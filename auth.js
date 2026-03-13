// ══════════════════════════════════════════════════════════════════
//  AUTHENTICATION & SUPABASE PERSISTENCE
//
//  On sign-in ALL three levels (A1, A2, B1) are fetched in parallel
//  and cached in _progressCache.  Level switches use the cache —
//  no extra DB round-trips.  Each level's evaluation stage, skill
//  level, word history and recency list are stored independently.
//
//  Mid-quiz abandonment protection:
//    A snapshot of the active level's progress is taken at quiz start.
//    If the user goes back / refreshes before finishing, the snapshot
//    is restored so the DB is never updated with partial quiz data.
//    Only a quiz that reaches showResults() commits to the DB.
//
//  DB table: user_progress  UNIQUE(user_id, level)
//    skill_level  → progress.skillLevel
//    failed_words → progress.words          (full word-stats map)
//    passed_words → { evaluationStage, recentWords }  (metadata)
//
//  Guest users: no DB interaction, no adaptive algorithm.
// ══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var SUPABASE_URL = 'https://birqofmhpstpdrmnassi.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_vRt9hVUTAhv9V0sWjF8JTg_QZHuV10T';
  var TABLE        = 'user_progress';
  var ALL_LEVELS   = ['A1', 'A2', 'B1'];

  var _db                   = null;   // Supabase client
  var _user                 = null;   // authenticated user or null
  var _currentAdaptiveLevel = 'A1';   // level whose progress is injected
  var _progressCache        = {};     // { A1: progressObj, A2: ..., B1: ... }

  // ── Mid-quiz abandonment tracking ─────────────────────────────
  var _quizInProgress = false;  // true from startAdaptiveQuiz → goHome/results
  var _quizCompleted  = false;  // true once showResults() is called
  var _quizSnapshot   = null;   // deep copy of progress taken at quiz start
  var _quizLevel      = null;   // which level was being quizzed

  // ── Original function references (set during _init) ───────────
  var _origStartLevel    = null;
  var _origStartAdaptive = null;
  var _origShowResults   = null;
  var _origGoHome        = null;

  // ── Supabase client ────────────────────────────────────────────
  function _initClient() {
    if (window.supabase && window.supabase.createClient) {
      _db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession    : true,   // always write session to localStorage
          autoRefreshToken  : true,   // keep session alive in background
          detectSessionInUrl: true,   // pick up ?code=… after OAuth redirect
        }
      });
    }
  }

  // ── Helpers ────────────────────────────────────────────────────
  function _deepCopy(obj) {
    try { return JSON.parse(JSON.stringify(obj)); } catch (e) { return null; }
  }

  function _defaultProgress() {
    return { evaluationStage: 0, skillLevel: 1, words: {}, recentWords: [] };
  }

  // ── DB row → progress object ───────────────────────────────────
  function _progressFromRow(row) {
    var meta = (row.passed_words && typeof row.passed_words === 'object')
      ? row.passed_words : {};
    // recentWords are stored as integers in DB; convert to strings so they
    // match the string IDs that the CSV parser produces (e.g. r.id === "17").
    var rw = Array.isArray(meta.recentWords)
      ? meta.recentWords.map(function (id) { return String(id); })
      : [];
    // Prefer the precise float stored in passed_words (meta.skillLevel),
    // fall back to the rounded integer in the skill_level column.
    var sl = (meta.skillLevel != null) ? Number(meta.skillLevel) : Number(row.skill_level);
    return {
      evaluationStage : parseInt(meta.evaluationStage, 10) || 0,
      skillLevel      : sl || 1,
      words           : (row.failed_words && typeof row.failed_words === 'object')
                          ? row.failed_words : {},
      recentWords     : rw
    };
  }

  // ── DB: fetch one level row (null if missing / error) ─────────
  async function _fetchRow(userId, level) {
    try {
      var res = await _db.from(TABLE).select('*')
        .eq('user_id', userId)
        .eq('level',   level)
        .single();
      if (!res.error && res.data) return _progressFromRow(res.data);
    } catch (e) {}
    return null;
  }

  // ── DB: guarantee a row exists; safe against UNIQUE violation ─
  async function _ensureRow(userId, level) {
    try {
      await _db.from(TABLE).upsert({
        user_id     : userId,
        level       : level,
        skill_level : 1,
        failed_words: {},
        passed_words: { evaluationStage: 0, recentWords: [] }
      }, { onConflict: 'user_id,level' });
    } catch (e) {}
  }

  // ── DB: upsert the row for one level ─────────────────────────
  // Uses upsert (not update) so a row is created if _ensureRow silently
  // failed; recentWords are converted to integers to match schema.
  async function _updateRow(userId, level, progress) {
    try {
      var recentInts = (progress.recentWords || []).map(function (id) {
        var n = parseInt(id, 10);
        return isNaN(n) ? id : n;
      });
      var res = await _db.from(TABLE)
        .upsert({
          user_id     : userId,
          level       : level,
          // skill_level is INTEGER in DB — store rounded value to avoid type error.
          // The precise float is preserved in passed_words.skillLevel below.
          skill_level : Math.round(progress.skillLevel) || 1,
          failed_words: progress.words      || {},
          passed_words: {
            evaluationStage: progress.evaluationStage || 0,
            skillLevel     : progress.skillLevel,   // precise float preserved here
            recentWords    : recentInts
          }
        }, { onConflict: 'user_id,level' });
    } catch (e) {}
  }

  // ── Load ALL levels into cache in one round-trip ───────────────
  async function _loadAllLevels(userId) {
    var results = await Promise.all(
      ALL_LEVELS.map(function (lv) { return _fetchRow(userId, lv); })
    );

    var ensures = [];
    ALL_LEVELS.forEach(function (lv, i) {
      if (!results[i]) {
        ensures.push(_ensureRow(userId, lv));
        results[i] = _defaultProgress();
      }
    });
    if (ensures.length) await Promise.all(ensures);

    ALL_LEVELS.forEach(function (lv, i) { _progressCache[lv] = results[i]; });
  }

  // ── Safety: ensure one level is cached (fallback for quiz start) ─
  // Called before each quiz in case the cache was not populated
  // (e.g. sign-in only partially loaded before the user tapped the quiz).
  async function _ensureLevelCached(userId, level) {
    if (_progressCache[level]) return; // already there — nothing to do
    var progress = await _fetchRow(userId, level);
    if (!progress) {
      await _ensureRow(userId, level);
      progress = _defaultProgress();
    }
    _progressCache[level] = progress;
  }

  // ── Inject a level's cached progress into the adaptive algorithm ─
  function _injectLevel(level) {
    var progress = _progressCache[level] || _defaultProgress();
    if (typeof window._adaptiveInjectProgress === 'function') {
      window._adaptiveInjectProgress(progress);
    }
    if (typeof window._adaptiveRefreshBadge === 'function') {
      window._adaptiveRefreshBadge();
    }
  }

  // ── Save hook: update cache + DB for whichever level is active ─
  function _registerSaveHook(userId) {
    if (typeof window._adaptiveSetSaveHook !== 'function') return;
    window._adaptiveSetSaveHook(function (p) {
      var lv = _currentAdaptiveLevel;  // read at call time, not captured
      _progressCache[lv] = p;          // keep cache in sync
      _updateRow(userId, lv, p);       // persist to DB
    });
  }

  // ── UI: settings drawer account section ───────────────────────
  function _renderAuthSection() {
    var el = document.getElementById('auth-section-content');
    if (!el) return;
    if (_user) {
      el.innerHTML =
        '<p class="auth-email">Signed in as: <strong>' +
          _escHtml(_user.email || _user.id) +
        '</strong></p>' +
        '<button class="about-btn" onclick="authSignOut()">Sign out</button>';
    } else {
      el.innerHTML =
        '<button class="about-btn" onclick="authSignIn()">Sign in with Google</button>';
    }
  }

  function _escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── UI: sign-in nudge on home screen ──────────────────────────
  function _renderHome() {
    var tip = document.getElementById('adaptive-tip');
    if (!tip) return;
    tip.classList.toggle('hidden', !!_user);
  }

  // ── Public: Google OAuth ───────────────────────────────────────
  window.authSignIn = async function () {
    if (!_db) return;
    // Explicitly set redirectTo so Supabase always returns to this exact
    // page.  The URL must also appear in Supabase Dashboard → Auth →
    // URL Configuration → Redirect URLs (add both production and any
    // localhost URLs you test from).
    await _db.auth.signInWithOAuth({
      provider: 'google',
      options : { redirectTo: window.location.origin + window.location.pathname }
    });
  };

  window.authSignOut = async function () {
    if (!_db) return;
    await _db.auth.signOut();
    window.location.href = window.location.origin + window.location.pathname;
  };

  // ── Auth events ────────────────────────────────────────────────
  async function _onSignIn(user) {
    // Guard: skip if already signed in as this user (INITIAL_SESSION + getUser race)
    if (_user && _user.id === user.id) return;
    _user = user;
    // Render immediately so the sign-out button appears without waiting for DB loads
    _renderAuthSection();
    _renderHome();
    await _loadAllLevels(user.id);
    _injectLevel(_currentAdaptiveLevel);
    _registerSaveHook(user.id);
  }

  function _onSignOut() {
    _user          = null;
    _progressCache = {};
    if (typeof window._adaptiveSetSaveHook === 'function') {
      window._adaptiveSetSaveHook(null);
    }
    _renderAuthSection();
    _renderHome();
  }

  // ── Function wrappers (set up in _init after all scripts load) ─

  // 1. Level cards: when signed in → adaptive quiz for this level;
  //                 when guest   → regular level quiz (unchanged behaviour).
  function _wrapStartLevel() {
    _origStartLevel = window.startLevel;
    window.startLevel = async function (lv) {
      _currentAdaptiveLevel = lv;
      if (_user) {
        // Inject this level's cached progress so the algorithm is ready,
        // then hand off to the adaptive entry point (which takes a snapshot
        // and manages save-on-completion / abandonment protection).
        _injectLevel(lv);
        if (typeof window.startAdaptiveQuiz === 'function') {
          await window.startAdaptiveQuiz(lv);
        }
      } else {
        if (typeof _origStartLevel === 'function') _origStartLevel(lv);
      }
    };
  }

  // 2. Adaptive quiz entry point — now called from startLevel (not a button).
  //    • receives the level directly (lv param)
  //    • ensures level is cached, takes a snapshot, starts the quiz
  function _wrapStartAdaptive() {
    _origStartAdaptive = window.startAdaptiveQuiz;
    window.startAdaptiveQuiz = async function (lv) {
      // Fallback: if somehow called without a level, use the tracked level
      lv = lv || _currentAdaptiveLevel;

      if (!_user) return; // should not happen via normal flow, but guard anyway

      // Safety: ensure this level has a progress object in cache
      await _ensureLevelCached(_user.id, lv);

      // Re-inject in case _ensureLevelCached just populated the cache
      _injectLevel(lv);

      // Take snapshot BEFORE the quiz mutates in-memory progress
      _quizInProgress = true;
      _quizCompleted  = false;
      _quizLevel      = lv;
      _quizSnapshot   = _deepCopy(_progressCache[lv]);

      if (typeof _origStartAdaptive === 'function') await _origStartAdaptive(lv);

      // If the quiz screen never became visible (CSV load failure, no cards, etc.)
      // then no quiz actually started — discard the snapshot flags immediately.
      var quizScreen = document.getElementById('screen-quiz');
      if (quizScreen && quizScreen.classList.contains('hidden')) {
        _quizInProgress = false;
        _quizCompleted  = false;
        _quizSnapshot   = null;
        _quizLevel      = null;
      }
    };
  }

  // 3. showResults: mark quiz as completed so goHome knows not to restore snapshot
  function _wrapShowResults() {
    _origShowResults = window.showResults;
    window.showResults = function () {
      _quizCompleted = true;          // quiz finished normally
      if (typeof _origShowResults === 'function') _origShowResults();
      // Note: _origShowResults is adaptive.js's wrapper, which calls _processResults
      // → _save → our save hook → updates _progressCache + DB
    };
  }

  // 4. goHome:
  //    • If quiz was in progress but NOT completed → abandonment detected
  //      Restore snapshot to cache and re-inject so the algorithm is back
  //      to its pre-quiz state.  The DB was never updated (save hook only
  //      fires inside showResults), so server state is already correct.
  //    • If quiz completed normally → progress already saved, nothing to restore.
  function _wrapGoHome() {
    _origGoHome = window.goHome;
    window.goHome = function () {
      if (_quizInProgress && !_quizCompleted && _quizLevel && _quizSnapshot) {
        // Mid-quiz abandonment: discard in-progress changes, restore snapshot
        _progressCache[_quizLevel] = _quizSnapshot;
        _injectLevel(_quizLevel);
      }
      // Reset tracking flags regardless
      _quizInProgress = false;
      _quizCompleted  = false;
      _quizSnapshot   = null;
      _quizLevel      = null;

      if (typeof _origGoHome === 'function') _origGoHome();
    };
  }

  // ── Bootstrap ──────────────────────────────────────────────────
  async function _init() {
    _initClient();
    if (!_db) return;

    // All wrappers must be registered after adaptive.js has run
    _wrapStartLevel();
    _wrapStartAdaptive();
    _wrapShowResults();
    _wrapGoHome();

    _db.auth.onAuthStateChange(function (event, session) {
      // INITIAL_SESSION  – fires on page-load when a session is in localStorage
      // SIGNED_IN        – fires after a fresh OAuth login / PKCE exchange
      // TOKEN_REFRESHED  – fires when the access token is silently renewed
      // All three mean "there is a valid user".
      if ((event === 'SIGNED_IN' ||
           event === 'INITIAL_SESSION' ||
           event === 'TOKEN_REFRESHED') && session && session.user) {
        _onSignIn(session.user);
      } else if (event === 'SIGNED_OUT') {
        _onSignOut();
      }
    });

    // getSession() reads from localStorage without a network round-trip.
    // This is more reliable than getUser() for the "stay logged in" case
    // because it works even when the Supabase server is slow or unreachable.
    // The PKCE exchange (after OAuth redirect) happens in the background and
    // fires SIGNED_IN via onAuthStateChange once it completes.
    var res  = await _db.auth.getSession();
    var user = res && res.data && res.data.session ? res.data.session.user : null;
    if (user) {
      await _onSignIn(user);
    } else {
      _renderAuthSection();
      _renderHome();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

})();

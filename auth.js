// ══════════════════════════════════════════════════════════════════
//  AUTHENTICATION & SUPABASE PERSISTENCE
//
//  On sign-in ALL three levels (A1, A2, B1) are fetched in parallel
//  and cached in _progressCache.  Level switches use the cache — no
//  extra DB round-trips.  Each level's evaluation stage, skill level,
//  word history, and recency list are stored independently.
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

  var _db                   = null;  // Supabase client
  var _user                 = null;  // authenticated user or null
  var _currentAdaptiveLevel = 'A1'; // which level's progress is injected right now
  var _progressCache        = {};   // { A1: progressObj, A2: progressObj, B1: progressObj }
  var _origStartLevel       = null;
  var _origStartAdaptive    = null;

  // ── Supabase client ────────────────────────────────────────────
  function _initClient() {
    if (window.supabase && window.supabase.createClient) {
      _db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  }

  // ── DB row → progress object ───────────────────────────────────
  function _progressFromRow(row) {
    var meta = (row.passed_words && typeof row.passed_words === 'object')
      ? row.passed_words : {};
    return {
      evaluationStage : meta.evaluationStage || 0,
      skillLevel      : row.skill_level      || 1,
      words           : (row.failed_words && typeof row.failed_words === 'object')
                          ? row.failed_words : {},
      recentWords     : Array.isArray(meta.recentWords) ? meta.recentWords : []
    };
  }

  function _defaultProgress() {
    return { evaluationStage: 0, skillLevel: 1, words: {}, recentWords: [] };
  }

  // ── DB: fetch one level's row (returns null if missing) ────────
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

  // ── DB: guarantee a row exists (safe with UNIQUE constraint) ───
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

  // ── DB: update the row for one level ──────────────────────────
  async function _updateRow(userId, level, progress) {
    try {
      await _db.from(TABLE)
        .update({
          skill_level : progress.skillLevel || 1,
          failed_words: progress.words      || {},
          passed_words: {
            evaluationStage: progress.evaluationStage || 0,
            recentWords    : progress.recentWords     || []
          }
        })
        .eq('user_id', userId)
        .eq('level',   level);
    } catch (e) {}
  }

  // ── Load ALL levels into cache (called once on sign-in) ────────
  async function _loadAllLevels(userId) {
    // Fetch all three in parallel
    var results = await Promise.all(
      ALL_LEVELS.map(function (lv) { return _fetchRow(userId, lv); })
    );

    // For any missing row: upsert a default and use a fresh object
    var ensures = [];
    ALL_LEVELS.forEach(function (lv, i) {
      if (!results[i]) {
        ensures.push(_ensureRow(userId, lv));
        results[i] = _defaultProgress();
      }
    });
    if (ensures.length) await Promise.all(ensures);

    // Populate the in-memory cache
    ALL_LEVELS.forEach(function (lv, i) {
      _progressCache[lv] = results[i];
    });
  }

  // ── Inject the active level's cached progress into the algorithm ─
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
  // Reads _currentAdaptiveLevel at call time (not captured at registration),
  // so level switches are automatically reflected in future saves.
  function _registerSaveHook(userId) {
    if (typeof window._adaptiveSetSaveHook !== 'function') return;
    window._adaptiveSetSaveHook(function (p) {
      var lv = _currentAdaptiveLevel;  // read now, not at registration
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

  // ── UI: adaptive banner + sign-in message ─────────────────────
  function _renderHome() {
    var banner = document.querySelector('.adaptive-banner');
    var msg    = document.getElementById('auth-signin-msg');
    if (_user) {
      if (banner) banner.style.display = '';
      if (msg)    msg.style.display    = 'none';
    } else {
      if (banner) banner.style.display = 'none';
      if (msg)    msg.style.display    = '';
    }
  }

  // ── Public: Google OAuth ───────────────────────────────────────
  window.authSignIn = async function () {
    if (!_db) return;
    await _db.auth.signInWithOAuth({ provider: 'google' });
  };

  window.authSignOut = async function () {
    if (!_db) return;
    await _db.auth.signOut();
  };

  // ── Auth event: sign-in ────────────────────────────────────────
  async function _onSignIn(user) {
    _user = user;

    // Fetch all three levels in parallel, populate cache
    await _loadAllLevels(user.id);

    // Inject the currently selected level's progress
    _injectLevel(_currentAdaptiveLevel);

    // Wire up the save hook (writes cache + DB for active level)
    _registerSaveHook(user.id);

    _renderAuthSection();
    _renderHome();
  }

  // ── Auth event: sign-out ───────────────────────────────────────
  function _onSignOut() {
    _user = null;
    _progressCache = {};
    if (typeof window._adaptiveSetSaveHook === 'function') {
      window._adaptiveSetSaveHook(null);
    }
    _renderAuthSection();
    _renderHome();
  }

  // ── Level-card intercept ───────────────────────────────────────
  // A1/A2/B1 cards always run the regular quiz (existing behaviour).
  // Additionally, when authenticated, switching levels swaps the
  // adaptive algorithm's progress from the in-memory cache — instant,
  // no extra DB call needed.
  function _wrapStartLevel() {
    _origStartLevel = window.startLevel;
    window.startLevel = function (lv) {
      var prevLevel = _currentAdaptiveLevel;
      _currentAdaptiveLevel = lv;

      if (_user && lv !== prevLevel) {
        // Swap from cache — synchronous, no async needed
        _injectLevel(lv);
      }

      // Delegate to original startLevel for the regular quiz
      if (typeof _origStartLevel === 'function') _origStartLevel(lv);
    };
  }

  // ── Adaptive quiz gate ─────────────────────────────────────────
  function _wrapStartAdaptive() {
    _origStartAdaptive = window.startAdaptiveQuiz;
    window.startAdaptiveQuiz = async function () {
      if (_user) {
        if (typeof _origStartAdaptive === 'function') await _origStartAdaptive();
      } else {
        // Guest: highlight the sign-in nudge
        var msg = document.getElementById('auth-signin-msg');
        if (msg) {
          msg.classList.add('auth-signin-msg--highlight');
          setTimeout(function () { msg.classList.remove('auth-signin-msg--highlight'); }, 1200);
        }
      }
    };
  }

  // ── Bootstrap ──────────────────────────────────────────────────
  async function _init() {
    _initClient();
    if (!_db) return;

    _wrapStartLevel();
    _wrapStartAdaptive();

    _db.auth.onAuthStateChange(function (event, session) {
      if (event === 'SIGNED_IN' && session && session.user) {
        _onSignIn(session.user);
      } else if (event === 'SIGNED_OUT') {
        _onSignOut();
      }
    });

    var res  = await _db.auth.getUser();
    var user = res && res.data && res.data.user ? res.data.user : null;
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

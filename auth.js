// ══════════════════════════════════════════════════════════════════
//  AUTHENTICATION & SUPABASE PERSISTENCE
//
//  Each authenticated user has ONE row per CEFR level in user_progress
//  (enforced by UNIQUE(user_id, level)).
//
//  Column mapping:
//    skill_level  → progress.skillLevel
//    failed_words → progress.words          (full word-stats map)
//    passed_words → { evaluationStage, recentWords }  (metadata)
//
//  Guest users: no DB interaction, simple random quizzes only.
// ══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var SUPABASE_URL = 'https://birqofmhpstpdrmnassi.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_vRt9hVUTAhv9V0sWjF8JTg_QZHuV10T';
  var TABLE        = 'user_progress';

  var _db                   = null;   // Supabase client
  var _user                 = null;   // current authenticated user or null
  var _currentAdaptiveLevel = 'A1';   // CEFR level whose DB row is active
  var _origStartLevel       = null;   // reference to app.js's startLevel()
  var _origStartAdaptive    = null;   // reference to adaptive.js's startAdaptiveQuiz()

  // ── Supabase client ────────────────────────────────────────────
  function _initClient() {
    if (window.supabase && window.supabase.createClient) {
      _db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  }

  // ── DB ↔ adaptive-progress mapping ────────────────────────────
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

  // ── DB: load one level row ─────────────────────────────────────
  async function _loadFromDB(userId, level) {
    try {
      var res = await _db.from(TABLE).select('*')
        .eq('user_id', userId)
        .eq('level',   level)
        .single();
      if (!res.error && res.data) return _progressFromRow(res.data);
    } catch (e) {}
    return null;
  }

  // ── DB: ensure a row exists (upsert to respect UNIQUE constraint) ─
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

  // ── DB: update the row for a specific level ────────────────────
  async function _updateDB(userId, progress, level) {
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

  // ── Load, upsert-default, and inject progress for a level ─────
  async function _activateLevel(userId, level) {
    var progress = await _loadFromDB(userId, level);
    if (!progress) {
      await _ensureRow(userId, level);
      progress = { evaluationStage: 0, skillLevel: 1, words: {}, recentWords: [] };
    }
    if (typeof window._adaptiveInjectProgress === 'function') {
      window._adaptiveInjectProgress(progress);
    }
    if (typeof window._adaptiveRefreshBadge === 'function') {
      window._adaptiveRefreshBadge();
    }
  }

  // ── Register the save hook (reads _currentAdaptiveLevel at call time) ─
  function _registerSaveHook(userId) {
    if (typeof window._adaptiveSetSaveHook !== 'function') return;
    window._adaptiveSetSaveHook(function (p) {
      // _currentAdaptiveLevel is read here, not captured — always uses active level
      _updateDB(userId, p, _currentAdaptiveLevel);
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

  // ── UI: adaptive banner & sign-in message visibility ──────────
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

  // ── Public: Google sign-in / sign-out ─────────────────────────
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
    await _activateLevel(user.id, _currentAdaptiveLevel);
    _registerSaveHook(user.id);
    _renderAuthSection();
    _renderHome();
  }

  // ── Auth event: sign-out ───────────────────────────────────────
  function _onSignOut() {
    _user = null;
    if (typeof window._adaptiveSetSaveHook === 'function') {
      window._adaptiveSetSaveHook(null);
    }
    _renderAuthSection();
    _renderHome();
  }

  // ── Intercept level-card clicks ────────────────────────────────
  // When a level card is tapped, update _currentAdaptiveLevel and,
  // for authenticated users, load that level's adaptive row from DB
  // so the adaptive quiz is always in sync with the selected level.
  function _wrapStartLevel() {
    _origStartLevel = window.startLevel;
    window.startLevel = function (lv) {
      var prevLevel = _currentAdaptiveLevel;
      _currentAdaptiveLevel = lv;

      if (_user && lv !== prevLevel) {
        // Fire-and-forget: load the new level's row in the background.
        // The save hook already reads _currentAdaptiveLevel at call time,
        // so future quiz saves will automatically target the new level.
        _activateLevel(_user.id, lv);
      }

      // Always delegate to the original startLevel for the regular quiz
      if (typeof _origStartLevel === 'function') _origStartLevel(lv);
    };
  }

  // ── Gate the adaptive quiz on auth status ──────────────────────
  function _wrapStartAdaptive() {
    _origStartAdaptive = window.startAdaptiveQuiz;
    window.startAdaptiveQuiz = async function () {
      if (_user) {
        if (typeof _origStartAdaptive === 'function') await _origStartAdaptive();
      } else {
        // Guest: highlight the sign-in nudge (adaptive banner is hidden but kept as safety net)
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

    // Listen for future auth events (sign-in after OAuth redirect, sign-out)
    _db.auth.onAuthStateChange(function (event, session) {
      if (event === 'SIGNED_IN' && session && session.user) {
        _onSignIn(session.user);
      } else if (event === 'SIGNED_OUT') {
        _onSignOut();
      }
    });

    // Check existing session (e.g. page reload after OAuth redirect)
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

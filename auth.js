// ══════════════════════════════════════════════════════════════════
//  AUTHENTICATION & SUPABASE PERSISTENCE
//  Loads after adaptive.js. Wraps startAdaptiveQuiz so that:
//    • authenticated users → adaptive algorithm (progress from Supabase)
//    • guest users         → simple random quiz (no persistence)
// ══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var SUPABASE_URL = 'https://birqofmhpstpdrmnassi.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_vRt9hVUTAhv9V0sWjF8JTg_QZHuV10T';
  var TABLE        = 'user_progress';

  var _db   = null;   // Supabase client
  var _user = null;   // authenticated user or null

  // ── Supabase init ──────────────────────────────────────────────
  function _initClient() {
    // The CDN bundle exposes window.supabase = { createClient, ... }
    if (window.supabase && window.supabase.createClient) {
      _db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  }

  // ── DB ↔ progress mapping ──────────────────────────────────────
  // user_progress columns:
  //   skill_level  (float)  → progress.skillLevel
  //   failed_words (jsonb)  → progress.words  (full word-stats map)
  //   passed_words (jsonb)  → { evaluationStage, recentWords } metadata
  //   level        (text)   → derived CEFR label for display

  function _progressFromRow(row) {
    var meta = (row.passed_words && typeof row.passed_words === 'object')
      ? row.passed_words : {};
    return {
      evaluationStage : meta.evaluationStage || 0,
      skillLevel      : row.skill_level      || 5,
      words           : (row.failed_words && typeof row.failed_words === 'object')
                          ? row.failed_words : {},
      recentWords     : Array.isArray(meta.recentWords) ? meta.recentWords : []
    };
  }

  function _rowFromProgress(p) {
    var sl    = p.skillLevel || 5;
    var level = sl <= 3.5 ? 'A1' : sl <= 6.5 ? 'A2' : 'B1';
    return {
      level       : level,
      skill_level : sl,
      failed_words: p.words       || {},
      passed_words: { evaluationStage: p.evaluationStage || 0,
                      recentWords    : p.recentWords     || [] }
    };
  }

  // ── DB operations ──────────────────────────────────────────────
  async function _loadFromDB(userId) {
    try {
      var res = await _db.from(TABLE).select('*').eq('user_id', userId).single();
      if (!res.error && res.data) return _progressFromRow(res.data);
    } catch (e) {}
    return null;
  }

  async function _insertDefaultRow(userId) {
    try {
      await _db.from(TABLE).insert({
        user_id     : userId,
        level       : 'A1',
        skill_level : 5,
        failed_words: {},
        passed_words: { evaluationStage: 0, recentWords: [] }
      });
    } catch (e) {}
  }

  async function _updateDB(userId, progress) {
    try {
      await _db.from(TABLE)
        .update(_rowFromProgress(progress))
        .eq('user_id', userId);
    } catch (e) {}
  }

  // ── UI: settings drawer auth section ──────────────────────────
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
        '<button class="about-btn auth-google-btn" onclick="authSignIn()">Sign in with Google</button>';
    }
  }

  function _escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── UI: home-screen visibility ─────────────────────────────────
  function _renderHome() {
    var banner  = document.querySelector('.adaptive-banner');
    var msg     = document.getElementById('auth-signin-msg');
    if (_user) {
      if (banner) banner.style.display = '';
      if (msg)    msg.style.display    = 'none';
    } else {
      if (banner) banner.style.display = 'none';
      if (msg)    msg.style.display    = '';
    }
  }

  // ── Sign-in / Sign-out ─────────────────────────────────────────
  window.authSignIn = async function () {
    if (!_db) return;
    await _db.auth.signInWithOAuth({ provider: 'google' });
  };

  window.authSignOut = async function () {
    if (!_db) return;
    await _db.auth.signOut();
  };

  // ── Handle sign-in: load/init DB row, wire up adaptive hooks ──
  async function _onSignIn(user) {
    _user = user;

    // 1. Try to load existing progress row
    var progress = await _loadFromDB(user.id);

    // 2. No row yet → insert defaults, use fresh progress object
    if (!progress) {
      await _insertDefaultRow(user.id);
      progress = { evaluationStage: 0, skillLevel: 5, words: {}, recentWords: [] };
    }

    // 3. Inject loaded progress into the adaptive algorithm
    if (typeof window._adaptiveInjectProgress === 'function') {
      window._adaptiveInjectProgress(progress);
    }

    // 4. Register the DB save hook so every quiz completion persists to Supabase
    if (typeof window._adaptiveSetSaveHook === 'function') {
      window._adaptiveSetSaveHook(function (p) { _updateDB(user.id, p); });
    }

    // 5. Refresh the adaptive skill badge on the home screen
    if (typeof window._adaptiveRefreshBadge === 'function') {
      window._adaptiveRefreshBadge();
    }

    _renderAuthSection();
    _renderHome();
  }

  // ── Handle sign-out: clear hooks, switch to guest mode ─────────
  function _onSignOut() {
    _user = null;

    if (typeof window._adaptiveSetSaveHook === 'function') {
      window._adaptiveSetSaveHook(null);
    }

    _renderAuthSection();
    _renderHome();
  }

  // ── Guest quiz: simple random selection from a chosen level ───
  // Replaces the adaptive quiz entry-point when no user is signed in.
  var _origStartAdaptive = null;

  function _guestQuiz() {
    // Show the sign-in message briefly then do nothing — the adaptive banner
    // is hidden for guests so this is a safety net only.
    var msg = document.getElementById('auth-signin-msg');
    if (msg) {
      msg.classList.add('auth-signin-msg--highlight');
      setTimeout(function () { msg.classList.remove('auth-signin-msg--highlight'); }, 1200);
    }
  }

  // ── Bootstrap ──────────────────────────────────────────────────
  async function _init() {
    _initClient();
    if (!_db) return;

    // Save reference to the adaptive entry-point before we might override it
    _origStartAdaptive = window.startAdaptiveQuiz;

    // Override startAdaptiveQuiz to gate on auth status
    window.startAdaptiveQuiz = async function () {
      if (_user) {
        // Authenticated: run the full adaptive algorithm
        if (typeof _origStartAdaptive === 'function') await _origStartAdaptive();
      } else {
        // Guest: show sign-in nudge
        _guestQuiz();
      }
    };

    // Listen for future auth state changes (sign-in after OAuth redirect, sign-out)
    _db.auth.onAuthStateChange(function (event, session) {
      if (event === 'SIGNED_IN' && session && session.user) {
        _onSignIn(session.user);
      } else if (event === 'SIGNED_OUT') {
        _onSignOut();
      }
    });

    // Check current session (handles OAuth redirect returning to the page)
    var res = await _db.auth.getUser();
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

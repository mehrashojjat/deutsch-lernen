// ══════════════════════════════════════════════════════════════════
//  AUTHENTICATION & SUPABASE PERSISTENCE
//
//  On sign-in all four levels (A1, A2, B1, ALL) are fetched in parallel
//  and cached in _progressCache.  Level switches use the cache —
//  no extra DB round-trips.  Legacy A1/A2/B1 and Adaptive V2 (ALL)
//  progress are stored independently.
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
//    quiz_stats   → progress.quizStats      (quiz completion counters)
//
//  Guest users: no DB interaction; adaptive engines run locally via
//  localStorage (deutsch_adaptive_v2_progress + per-level legacy keys).
// ══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var SUPABASE_URL = 'https://birqofmhpstpdrmnassi.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_vRt9hVUTAhv9V0sWjF8JTg_QZHuV10T';
  var TABLE        = 'user_progress';
  var LEGACY_LEVELS = ['A1', 'A2', 'B1'];
  var ALL_LEVELS   = ['A1', 'A2', 'B1', 'ALL'];
  var V2_LEVEL     = 'ALL';

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
  var _origStartAdaptiveV2 = null;
  var _origStartAdaptiveV2Review = null;
  var _origShowResults   = null;
  var _origGoHome        = null;
  var _capAppListener    = null;

  function _isCapacitorNative() {
    try {
      return !!(window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform());
    } catch (e) {
      return false;
    }
  }

  function _oauthRedirectTo() {
    if (_isCapacitorNative()) return 'so.rovi.wortschatz://auth/callback';
    return window.location.origin + window.location.pathname;
  }

  async function _openExternalAuthUrl(url) {
    var browser = window.Capacitor &&
      window.Capacitor.Plugins &&
      window.Capacitor.Plugins.Browser;

    if (browser && typeof browser.open === 'function') {
      await browser.open({ url: url });
      return;
    }
    window.open(url, '_blank');
  }

  async function _handleCapacitorAuthUrl(url) {
    if (!_db || !url) return;
    try {
      var parsed = new URL(url);
      if (parsed.protocol !== 'so.rovi.wortschatz:') return;

      // Support both OAuth return shapes:
      // 1) PKCE: ?code=...
      // 2) Implicit: #access_token=...&refresh_token=...
      var code = parsed.searchParams.get('code');
      var hashParams = new URLSearchParams((parsed.hash || '').replace(/^#/, ''));
      var accessToken = hashParams.get('access_token');
      var refreshToken = hashParams.get('refresh_token');

      if (code) {
        var exchanged = await _db.auth.exchangeCodeForSession(code);
        if (exchanged && exchanged.data && exchanged.data.session && exchanged.data.session.user) {
          await _onSignIn(exchanged.data.session.user);
        }
      } else if (accessToken && refreshToken) {
        var setRes = await _db.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
        if (setRes && setRes.data && setRes.data.user) {
          await _onSignIn(setRes.data.user);
        }
      }

      var browser = window.Capacitor &&
        window.Capacitor.Plugins &&
        window.Capacitor.Plugins.Browser;
      if (browser && typeof browser.close === 'function') {
        await browser.close().catch(function() {});
      }
    } catch (e) {}
  }

  function _wireCapacitorAuthCallback() {
    if (!_isCapacitorNative() || _capAppListener) return;
    var app = window.Capacitor &&
      window.Capacitor.Plugins &&
      window.Capacitor.Plugins.App;
    if (!app || typeof app.addListener !== 'function') return;
    _capAppListener = app.addListener('appUrlOpen', function (data) {
      if (!data || !data.url) return;
      _handleCapacitorAuthUrl(data.url);
    });
  }

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

  function _defaultQuizStats() {
    return { adaptive: _emptyStats(), theme: {} };
  }

  function _emptyStats() {
    return { quizzesCompleted: 0, correctAnswers: 0, incorrectAnswers: 0, studyTimeSeconds: 0 };
  }

  function _clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function _toUnifiedId(level, srcId) {
    var digit = level === 'A1' ? '1' : level === 'A2' ? '2' : '3';
    return String(parseInt(String(digit) + String(srcId), 10));
  }

  function _legacyAttemptWeight(progress) {
    var words = (progress && progress.words) || {};
    var total = 0;
    Object.keys(words).forEach(function (id) {
      var w = words[id] || {};
      total += Number(w.seenCount) || 0;
    });
    return total;
  }

  function _defaultProgress(level) {
    var lv = String(level || '').toUpperCase();
    var base = {
      evaluationStage: 0,
      skillLevel: 1,
      words: {},
      recentWords: [],
      quizStats: _defaultQuizStats()
    };
    if (lv === V2_LEVEL) {
      base.cefrBand = 'A1';
      base.learningPhase = 'active';
      base.crossBandLog = [];
      base.challengeLowStreak = 0;
    }
    return base;
  }

  function _bootstrapAllFromLegacy(legacyByLevel) {
    if (typeof window._v2BootstrapFromLegacyLevels === 'function') {
      return window._v2BootstrapFromLegacyLevels(legacyByLevel);
    }
    return _defaultProgress();
  }

  function _legacyProgressMap() {
    var out = {};
    LEGACY_LEVELS.forEach(function (lv) {
      out[lv] = _progressCache[lv] || null;
    });
    return out;
  }

  var GUEST_LEGACY_PREFIX = 'deutsch_adaptive_progress_';

  function _hasMeaningfulV2Progress(p) {
    if (typeof window._adaptiveV2HasMeaningfulProgress === 'function') {
      return window._adaptiveV2HasMeaningfulProgress(p);
    }
    if (!p) return false;
    if ((Number(p.evaluationStage) || 0) > 0) return true;
    if (Object.keys(p.words || {}).length > 0) return true;
    if ((Number(p.skillLevel) || 1) > 1) return true;
    if (p.cefrBand && p.cefrBand !== 'A1') return true;
    return false;
  }

  function _readGuestLegacyLevel(lv) {
    try {
      var raw = localStorage.getItem(GUEST_LEGACY_PREFIX + lv);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function _legacyProgressMapForBootstrap() {
    var out = {};
    LEGACY_LEVELS.forEach(function (lv) {
      var online = _progressCache[lv] || null;
      var guest = _readGuestLegacyLevel(lv);
      var onlineWeight = _legacyAttemptWeight(online);
      var guestWeight = _legacyAttemptWeight(guest);
      out[lv] = guestWeight > onlineWeight ? guest : online;
    });
    return out;
  }

  async function _finalizeV2Progress(userId, progress, opts) {
    opts = opts || {};
    var changed = typeof window._v2RepairProgressWordIds === 'function' &&
      window._v2RepairProgressWordIds(progress);
    _progressCache[V2_LEVEL] = progress;
    if (changed || opts.persist) await _updateRow(userId, V2_LEVEL, progress);
    return progress;
  }

  async function _resolveAllProgress(userId, byLevel) {
    byLevel = byLevel || {};
    var online = byLevel[V2_LEVEL] ? _progressFromRow(byLevel[V2_LEVEL]) : null;
    if (_hasMeaningfulV2Progress(online)) {
      return _finalizeV2Progress(userId, online);
    }

    var local = null;
    if (typeof window._adaptiveV2ReadGuestProgress === 'function') {
      local = window._adaptiveV2ReadGuestProgress();
    }
    if (_hasMeaningfulV2Progress(local)) {
      var migrated = (typeof window._adaptiveV2MigrateProgress === 'function')
        ? window._adaptiveV2MigrateProgress(local)
        : local;
      if (typeof window._adaptiveV2ClearGuestProgress === 'function') {
        window._adaptiveV2ClearGuestProgress();
      }
      return _finalizeV2Progress(userId, migrated, { persist: true });
    }

    var legacyMap = _legacyProgressMapForBootstrap();
    var legacyHasData = LEGACY_LEVELS.some(function (lv) {
      return _legacyAttemptWeight(legacyMap[lv]) > 0;
    });
    if (legacyHasData) {
      var boot = _bootstrapAllFromLegacy(legacyMap);
      return _finalizeV2Progress(userId, boot, { persist: true });
    }

    await _ensureRow(userId, V2_LEVEL);
    var fresh = _defaultProgress(V2_LEVEL);
    _progressCache[V2_LEVEL] = fresh;
    return fresh;
  }

  function _isMetaKey(key) {
    return key === 'evaluationStage' || key === 'skillLevel' || key === 'recentWords' ||
      key === 'cefrBand' || key === 'learningPhase' || key === 'legacyConfidence' ||
      key === 'crossBandLog' || key === 'challengeLowStreak' || key === 'lastQuizAccuracy';
  }

  function _countFromValue(value, fallback) {
    if (typeof value === 'number') return Math.max(0, value);
    if (value === true) return fallback;
    if (value && typeof value === 'object') {
      return Number(value.count || value.seenCount || value.attempts || value.correctCount ||
        value.correct || value.incorrectCount || value.wrongCount || value.failCount || value.failScore) || fallback;
    }
    return fallback;
  }

  function _parseJsonLike(value) {
    if (value == null) return value;
    if (typeof value === 'string') {
      var s = value.trim();
      if (!s) return null;
      try { return JSON.parse(s); } catch (e) { return value; }
    }
    if (value && typeof value === 'object' && value.value != null) {
      return _parseJsonLike(value.value);
    }
    return value;
  }

  function _mergeWordRecord(words, id, patch) {
    id = String(id);
    if (!id || _isMetaKey(id)) return;
    var cur = words[id] || { failScore: 0, seenCount: 0, correctCount: 0 };
    cur.failScore = Math.max(Number(cur.failScore) || 0, Number(patch.failScore) || 0);
    cur.seenCount = Math.max(Number(cur.seenCount) || 0, Number(patch.seenCount) || 0);
    cur.correctCount = Math.max(Number(cur.correctCount) || 0, Number(patch.correctCount) || 0);
    if (patch.recent) cur.recent = true;
    words[id] = cur;
  }

  function _mergeHistoryValue(words, id, value, kind) {
    if (!id || _isMetaKey(String(id))) return;
    if (value && typeof value === 'object' && (
      value.seenCount != null || value.correctCount != null || value.failScore != null ||
      value.correct != null || value.incorrectCount != null || value.wrongCount != null
    )) {
      var correct = Number(value.correctCount || value.correct || value.passedCount || 0) || 0;
      var incorrect = Number(value.incorrectCount || value.wrongCount || value.failedCount || value.failCount || 0) || 0;
      var fail = Number(value.failScore) || (kind === 'failed' ? Math.max(2, incorrect * 2) : 0);
      var seen = Number(value.seenCount || value.attempts || 0) || 0;
      if (!seen) seen = Math.max(correct + incorrect, correct, kind === 'failed' ? 1 : 0);
      _mergeWordRecord(words, id, { seenCount: seen, correctCount: correct, failScore: fail });
      return;
    }

    var count = _countFromValue(value, 1);
    if (kind === 'passed') {
      _mergeWordRecord(words, id, { seenCount: count, correctCount: count, failScore: 0 });
    } else {
      _mergeWordRecord(words, id, { seenCount: count, correctCount: 0, failScore: Math.max(2, count * 2) });
    }
  }

  function _mergeHistorySource(words, source, kind) {
    source = _parseJsonLike(source);
    if (!source) return;
    if (Array.isArray(source)) {
      source.forEach(function (item) {
        if (item && typeof item === 'object') {
          _mergeHistoryValue(words, item.id || item.wordId || item.word_id || item.csvId, item, kind);
        } else {
          _mergeHistoryValue(words, item, true, kind);
        }
      });
      return;
    }
    if (typeof source !== 'object') return;
    Object.keys(source).forEach(function (id) {
      if (_isMetaKey(id)) return;
      _mergeHistoryValue(words, id, source[id], kind);
    });
  }

  function _wordHistoryFromRow(row) {
    var words = {};
    _mergeHistorySource(words, _parseJsonLike(row.passed_words), 'passed');
    _mergeHistorySource(words, _parseJsonLike(row.failed_words), 'failed');
    return words;
  }

  // ── DB row → progress object ───────────────────────────────────
  function _progressFromRow(row) {
    var passed = _parseJsonLike(row.passed_words);
    var failed = _parseJsonLike(row.failed_words);
    var meta = (passed && typeof passed === 'object' && !Array.isArray(passed))
      ? passed : {};
    // recentWords are stored as integers in DB; convert to strings so they
    // match the string IDs that the CSV parser produces (e.g. r.id === "17").
    var rw = Array.isArray(meta.recentWords)
      ? meta.recentWords.map(function (id) { return String(id); })
      : [];
    // Prefer the precise float stored in passed_words (meta.skillLevel),
    // fall back to the rounded integer in the skill_level column.
    var sl = (meta.skillLevel != null) ? Number(meta.skillLevel) : Number(row.skill_level);
    var progress = {
      evaluationStage : parseInt(meta.evaluationStage, 10) || 0,
      skillLevel      : sl || 1,
      words           : _wordHistoryFromRow({ passed_words: passed, failed_words: failed }),
      recentWords     : rw,
      quizStats       : _normalizeQuizStats(_parseJsonLike(row.quiz_stats))
    };
    if (_rowLevelKey(row) === V2_LEVEL) {
      progress.cefrBand = meta.cefrBand || 'A1';
      progress.learningPhase = meta.learningPhase || 'active';
      if (meta.legacyConfidence != null) progress.legacyConfidence = Number(meta.legacyConfidence);
      progress.crossBandLog = Array.isArray(meta.crossBandLog) ? meta.crossBandLog : [];
      progress.challengeLowStreak = Number(meta.challengeLowStreak) || 0;
      if (meta.lastQuizAccuracy != null) progress.lastQuizAccuracy = Number(meta.lastQuizAccuracy);
    }
    return progress;
  }

  function _normalizeStats(s) {
    s = (s && typeof s === 'object') ? s : {};
    function _pickNum(obj, keys) {
      for (var i = 0; i < keys.length; i++) {
        var v = Number(obj[keys[i]]);
        if (isFinite(v) && v >= 0) return v;
      }
      return 0;
    }
    return {
      quizzesCompleted: _pickNum(s, ['quizzesCompleted', 'quizzes_completed', 'completed', 'quizCount']),
      correctAnswers: _pickNum(s, ['correctAnswers', 'correct_answers', 'correct', 'answersCorrect']),
      incorrectAnswers: _pickNum(s, ['incorrectAnswers', 'incorrect_answers', 'incorrect', 'wrong', 'answersIncorrect']),
      studyTimeSeconds: _pickNum(s, ['studyTimeSeconds', 'study_time_seconds', 'studyTime', 'timeSeconds', 'durationSeconds'])
    };
  }

  function _normalizeThemeStatEntry(entry) {
    var base = _normalizeStats(entry);
    entry = (entry && typeof entry === 'object') ? entry : {};
    base.seenWordIds = Array.isArray(entry.seenWordIds)
      ? entry.seenWordIds.map(function (id) { return String(id); }) : [];
    base.themeRecentWords = Array.isArray(entry.themeRecentWords)
      ? entry.themeRecentWords.map(function (id) { return String(id); }) : [];
    base.lastSeenAt = Number(entry.lastSeenAt) || 0;
    return base;
  }

  function _maxStats(a, b) {
    a = _normalizeStats(a);
    b = _normalizeStats(b);
    return {
      quizzesCompleted: Math.max(a.quizzesCompleted, b.quizzesCompleted),
      correctAnswers: Math.max(a.correctAnswers, b.correctAnswers),
      incorrectAnswers: Math.max(a.incorrectAnswers, b.incorrectAnswers),
      studyTimeSeconds: Math.max(a.studyTimeSeconds, b.studyTimeSeconds)
    };
  }

  function _mergeThemeStatEntry(a, b) {
    a = _normalizeThemeStatEntry(a);
    b = _normalizeThemeStatEntry(b);
    var seenSet = {};
    a.seenWordIds.forEach(function (id) { seenSet[id] = true; });
    b.seenWordIds.forEach(function (id) { seenSet[id] = true; });
    var recent = a.themeRecentWords.concat(b.themeRecentWords);
    var recentSeen = {};
    var mergedRecent = [];
    recent.forEach(function (id) {
      if (recentSeen[id]) return;
      recentSeen[id] = true;
      mergedRecent.push(id);
    });
    if (mergedRecent.length > 25) mergedRecent = mergedRecent.slice(-25);
    return {
      quizzesCompleted: Math.max(a.quizzesCompleted, b.quizzesCompleted),
      correctAnswers: Math.max(a.correctAnswers, b.correctAnswers),
      incorrectAnswers: Math.max(a.incorrectAnswers, b.incorrectAnswers),
      studyTimeSeconds: Math.max(a.studyTimeSeconds, b.studyTimeSeconds),
      seenWordIds: Object.keys(seenSet),
      themeRecentWords: mergedRecent,
      lastSeenAt: Math.max(a.lastSeenAt, b.lastSeenAt)
    };
  }

  function _mergeQuizStats(incoming, prev) {
    incoming = _normalizeQuizStats(incoming);
    prev = _normalizeQuizStats(prev);
    var out = { adaptive: _maxStats(incoming.adaptive, prev.adaptive), theme: {} };
    var keys = {};
    Object.keys(prev.theme).forEach(function (k) { keys[k] = true; });
    Object.keys(incoming.theme).forEach(function (k) { keys[k] = true; });
    Object.keys(keys).forEach(function (k) {
      out.theme[k] = _mergeThemeStatEntry(incoming.theme[k], prev.theme[k]);
    });
    return out;
  }

  function _normalizeQuizStats(stats) {
    stats = (stats && typeof stats === 'object') ? stats : {};
    var out = { adaptive: _normalizeStats(stats.adaptive), theme: {} };
    var theme = (stats.theme && typeof stats.theme === 'object') ? stats.theme : {};
    Object.keys(theme).forEach(function(key) {
      out.theme[key] = _normalizeThemeStatEntry(theme[key]);
    });
    return out;
  }

  function _rowLevelKey(row) {
    return String(row && row.level || '').toUpperCase();
  }

  // ── DB: fetch one level row (null if missing / error) ─────────
  async function _fetchRow(userId, level) {
    try {
      var res = await _db.from(TABLE).select('*')
        .eq('user_id', userId)
        .ilike('level', level)
        .limit(1);
      if (!res.error && res.data && res.data[0]) return _progressFromRow(res.data[0]);
      if (res.error && console && console.warn) console.warn('[auth] progress fetch failed', level, res.error);
    } catch (e) {
      if (console && console.warn) console.warn('[auth] progress fetch exception', level, e);
    }
    return null;
  }

  async function _fetchAllRows(userId) {
    try {
      var res = await _db.from(TABLE).select('*').eq('user_id', userId);
      if (!res.error && Array.isArray(res.data)) return res.data;
      if (res.error && console && console.warn) console.warn('[auth] progress fetch-all failed', res.error);
    } catch (e) {
      if (console && console.warn) console.warn('[auth] progress fetch-all exception', e);
    }
    return [];
  }

  // ── DB: guarantee a row exists; safe against UNIQUE violation ─
  async function _ensureRow(userId, level) {
    try {
      var passedDefault = { evaluationStage: 0, recentWords: [] };
      if (String(level).toUpperCase() === V2_LEVEL) {
        passedDefault.cefrBand = 'A1';
        passedDefault.learningPhase = 'active';
      }
      await _db.from(TABLE).upsert({
        user_id     : userId,
        level       : level,
        skill_level : 1,
        failed_words: {},
        passed_words: passedDefault,
        quiz_stats  : _defaultQuizStats()
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
      var passedMeta = {
        evaluationStage: progress.evaluationStage || 0,
        skillLevel     : progress.skillLevel,
        recentWords    : recentInts
      };
      if (level === V2_LEVEL) {
        passedMeta.cefrBand = progress.cefrBand || 'A1';
        passedMeta.learningPhase = progress.learningPhase || 'active';
        if (progress.legacyConfidence != null) passedMeta.legacyConfidence = progress.legacyConfidence;
        passedMeta.crossBandLog = progress.crossBandLog || [];
        passedMeta.challengeLowStreak = Number(progress.challengeLowStreak) || 0;
        if (progress.lastQuizAccuracy != null) passedMeta.lastQuizAccuracy = progress.lastQuizAccuracy;
      }
      var res = await _db.from(TABLE)
        .upsert({
          user_id     : userId,
          level       : level,
          // skill_level is INTEGER in DB — store rounded value to avoid type error.
          // The precise float is preserved in passed_words.skillLevel below.
          skill_level : Math.round(progress.skillLevel) || 1,
          failed_words: progress.words      || {},
          passed_words: passedMeta,
          quiz_stats  : _normalizeQuizStats(progress.quizStats)
        }, { onConflict: 'user_id,level' });
    } catch (e) {}
  }

  // ── Load ALL levels into cache in one round-trip ───────────────
  async function _loadAllLevels(userId) {
    var rows = await _fetchAllRows(userId);
    var byLevel = {};
    rows.forEach(function(row) {
      var key = _rowLevelKey(row);
      if (key && !byLevel[key]) byLevel[key] = row;
    });

    var ensures = [];
    LEGACY_LEVELS.forEach(function (lv) {
      if (byLevel[lv]) {
        _progressCache[lv] = _progressFromRow(byLevel[lv]);
        if (typeof window._v2MigrateLevelProgressIds === 'function') {
          window._v2MigrateLevelProgressIds(_progressCache[lv], lv);
        }
      } else {
        ensures.push(_ensureRow(userId, lv));
        _progressCache[lv] = _defaultProgress();
      }
    });

    await _resolveAllProgress(userId, byLevel);

    if (ensures.length) await Promise.all(ensures);
  }

  // ── Safety: ensure one level is cached (fallback for quiz start) ─
  // Called before each quiz in case the cache was not populated
  // (e.g. sign-in only partially loaded before the user tapped the quiz).
  async function _ensureLevelCached(userId, level) {
    if (_progressCache[level]) return;
    if (level === V2_LEVEL) {
      for (var li = 0; li < LEGACY_LEVELS.length; li++) {
        var legacyLv = LEGACY_LEVELS[li];
        if (!_progressCache[legacyLv]) {
          var legacyProgress = await _fetchRow(userId, legacyLv);
          _progressCache[legacyLv] = legacyProgress || _defaultProgress();
        }
      }
      var rows = await _fetchAllRows(userId);
      var byLevel = {};
      rows.forEach(function (row) {
        var key = _rowLevelKey(row);
        if (key === V2_LEVEL && !byLevel[key]) byLevel[key] = row;
      });
      await _resolveAllProgress(userId, byLevel);
      return;
    }
    var progress = await _fetchRow(userId, level);
    if (!progress) {
      await _ensureRow(userId, level);
      progress = _defaultProgress(level);
    }
    _progressCache[level] = progress;
  }

  function _injectV2Level() {
    if (typeof window._adaptiveV2SetAccountMode === 'function') {
      window._adaptiveV2SetAccountMode(true);
    }
    var progress = _progressCache[V2_LEVEL] || _defaultProgress(V2_LEVEL);
    if (typeof window._adaptiveV2InjectProgress === 'function') {
      window._adaptiveV2InjectProgress(progress);
    }
    if (typeof window._adaptiveV2RefreshBadge === 'function') {
      window._adaptiveV2RefreshBadge();
    }
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
  function _registerV2SaveHook(userId) {
    if (typeof window._adaptiveV2SetSaveHook !== 'function') return;
    window._adaptiveV2SetSaveHook(function (p) {
      var prev = _progressCache[V2_LEVEL] || _defaultProgress(V2_LEVEL);
      p = p && typeof p === 'object' ? p : _defaultProgress(V2_LEVEL);
      p.quizStats = _mergeQuizStats(p.quizStats, prev.quizStats);
      _progressCache[V2_LEVEL] = p;
      _updateRow(userId, V2_LEVEL, p);
    });
  }

  function _registerSaveHook(userId) {
    if (typeof window._adaptiveSetSaveHook !== 'function') return;
    window._adaptiveSetSaveHook(function (p) {
      var lv = _currentAdaptiveLevel;  // read at call time, not captured
      // Adaptive engine saves core progress fields only.
      // Preserve quizStats from cache so adaptive saves do not wipe activity data.
      var prev = _progressCache[lv] || _defaultProgress();
      p = p && typeof p === 'object' ? p : _defaultProgress();
      p.quizStats = _normalizeQuizStats(prev.quizStats);
      _progressCache[lv] = p;          // keep cache in sync
      _updateRow(userId, lv, p);       // persist to DB
    });
  }

  function _statKeyForCategory(categoryId) {
    try {
      var cat = (typeof CATEGORY_MAP !== 'undefined' ? CATEGORY_MAP : []).find(function(c) {
        return c.id === Number(categoryId);
      });
      var name = cat ? cat.name : String(categoryId || 'theme');
      return name.toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    } catch (e) {
      return String(categoryId || 'theme');
    }
  }

  function _incrementStats(target, payload) {
    target = _normalizeStats(target);
    target.quizzesCompleted += 1;
    target.correctAnswers += Number(payload.correctAnswers) || 0;
    target.incorrectAnswers += Number(payload.incorrectAnswers) || 0;
    target.studyTimeSeconds += Number(payload.studyTimeSeconds) || 0;
    return target;
  }

  function _recordQuizStats(payload) {
    if (!_user || !payload) return;
    var mode = payload.mode === 'theme' ? 'theme' : (payload.mode === 'adaptive_v2' ? 'adaptive_v2' : 'adaptive');
    if (mode === 'theme') return;
    var lv = mode === 'adaptive_v2' ? V2_LEVEL : (_currentAdaptiveLevel || 'A1');
    var progress = _progressCache[lv] || _defaultProgress();
    progress.quizStats = _normalizeQuizStats(progress.quizStats);
    progress.quizStats.adaptive = _incrementStats(progress.quizStats.adaptive, payload);
    _progressCache[lv] = progress;
    _updateRow(_user.id, lv, progress);
  }

  // ── UI: settings drawer account section ───────────────────────
  function _renderAuthSection() {
    var el = document.getElementById('auth-section-content');
    if (!el) return;
    var _offline = !!window.APP_OFFLINE;
    if (_user) {
      var _u = (typeof UI !== 'undefined' && typeof LANG !== 'undefined' && UI[LANG]) ? UI[LANG] : (typeof UI !== 'undefined' ? UI.en : null);
      var _signedInAs = (_u && _u.signedInAs) ? _u.signedInAs : 'Signed in as:';
      var _signOutLbl = (_u && _u.signOut) ? _u.signOut : 'Sign out';
      var _signOutBtn = _offline
        ? '<button class="auth-signout-btn auth-btn-offline" disabled>' + _escHtml(_signOutLbl) + '</button>'
        : '<button class="auth-signout-btn" onclick="authSignOut()">' + _escHtml(_signOutLbl) + '</button>';
      el.innerHTML =
        '<p class="auth-email">' + _escHtml(_signedInAs) + ' <strong>' +
          _escHtml(_user.email || _user.id) +
        '</strong></p>' + _signOutBtn;
    } else {
      var _btnExtra = _offline
        ? ' class="gsi-material-button auth-btn-offline" disabled'
        : ' class="gsi-material-button" onclick="authSignIn()"';
      el.innerHTML =
        '<button' + _btnExtra + '>' +
        '<div class="gsi-material-button-state"></div>' +
        '<div class="gsi-material-button-content-wrapper">' +
        '<div class="gsi-material-button-icon">' +
        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="display:block;">' +
        '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
        '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
        '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
        '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
        '</svg></div>' +
        '<span class="gsi-material-button-contents">Sign in with Google</span>' +
        '</div></button>';
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
    if (tip) tip.classList.toggle('hidden', !!_user);
    if (typeof window._ensureHomeLayout === 'function') window._ensureHomeLayout();
    if (typeof window.refreshInstallTip === 'function') window.refreshInstallTip();
  }

  // ── Public: Google OAuth ───────────────────────────────────────
  window.authSignIn = async function () {
    if (!_db) return;
    var redirectTo = _oauthRedirectTo();

    // Web: keep current in-page redirect flow.
    // Native: request provider URL and open in external browser, then handle
    // callback via App.appUrlOpen.
    if (_isCapacitorNative()) {
      var nativeRes = await _db.auth.signInWithOAuth({
        provider: 'google',
        options : {
          redirectTo: redirectTo,
          skipBrowserRedirect: true
        }
      });
      var authUrl = nativeRes && nativeRes.data ? nativeRes.data.url : null;
      if (authUrl) await _openExternalAuthUrl(authUrl);
      return;
    }

    await _db.auth.signInWithOAuth({
      provider: 'google',
      options : { redirectTo: redirectTo }
    });
  };

  window.authSignOut = async function () {
    if (!_db) return;
    await _db.auth.signOut();
    window.location.href = window.location.origin + window.location.pathname;
  };

  window.APP_AUTH_IS_SIGNED_IN = function () {
    return !!_user;
  };

  window.APP_AUTH_RESET_ADAPTIVE_V2 = async function () {
    if (!_user) return false;
    var fresh = _defaultProgress(V2_LEVEL);
    await _updateRow(_user.id, V2_LEVEL, fresh);
    _progressCache[V2_LEVEL] = fresh;
    if (typeof window._adaptiveV2InjectProgress === 'function') {
      window._adaptiveV2InjectProgress(fresh);
    }
    if (typeof window._adaptiveV2RefreshBadge === 'function') {
      window._adaptiveV2RefreshBadge();
    }
    return true;
  };

  window.APP_AUTH_GET_LEARNING_PROFILE = function (level) {
    if (!_user) return { signedIn: false, level: level || _currentAdaptiveLevel, progress: null };
    var lv = level || _currentAdaptiveLevel || 'A1';
    return {
      signedIn: true,
      level: lv,
      progress: _deepCopy(_progressCache[lv] || _defaultProgress())
    };
  };

  window.APP_AUTH_USE_LEARNING_LEVEL = function (level) {
    if (!level) return;
    if (String(level).toUpperCase() === V2_LEVEL) {
      _injectV2Level();
      return;
    }
    _currentAdaptiveLevel = level;
    _injectLevel(level);
  };

  window.APP_AUTH_RECORD_QUIZ_STATS = function (payload) {
    _recordQuizStats(payload);
  };

  function _jsonShape(value) {
    if (value == null) return { type: String(value), keys: [], sample: null };
    if (Array.isArray(value)) {
      return { type: 'array', length: value.length, sample: value.slice(0, 3) };
    }
    if (typeof value === 'object') {
      var keys = Object.keys(value);
      return { type: 'object', keyCount: keys.length, keys: keys.slice(0, 12), sample: keys.slice(0, 3).reduce(function(out, key) {
        out[key] = value[key];
        return out;
      }, {}) };
    }
    return { type: typeof value, sample: value };
  }

  window.APP_AUTH_DEBUG_PROGRESS = async function () {
    if (!_db) return { error: 'Supabase client is not initialized.' };
    var sessionRes = await _db.auth.getSession();
    var user = sessionRes && sessionRes.data && sessionRes.data.session && sessionRes.data.session.user;
    if (!user) return { error: 'No signed-in Supabase session found.' };
    var rows = await _fetchAllRows(user.id);
    var parsed = {};
    rows.forEach(function(row) {
      var key = _rowLevelKey(row) || String(row.level || 'unknown');
      var progress = _progressFromRow(row);
      var wordKeys = Object.keys(progress.words || {});
      parsed[key] = {
        dbLevel: row.level,
        skillLevel: progress.skillLevel,
        evaluationStage: progress.evaluationStage,
        recentWords: (progress.recentWords || []).length,
        parsedWordCount: wordKeys.length,
        parsedSample: wordKeys.slice(0, 5).reduce(function(out, id) {
          out[id] = progress.words[id];
          return out;
        }, {}),
        quizStats: progress.quizStats
      };
    });
    return {
      userId: user.id,
      email: user.email,
      rowCount: rows.length,
      cacheLevels: Object.keys(_progressCache),
      cacheSummary: ALL_LEVELS.reduce(function(out, lv) {
        var p = _progressCache[lv] || {};
        out[lv] = {
          words: Object.keys(p.words || {}).length,
          recentWords: (p.recentWords || []).length,
          skillLevel: p.skillLevel,
          evaluationStage: p.evaluationStage
        };
        return out;
      }, {}),
      rawRows: rows.map(function(row) {
        return {
          id: row.id,
          level: row.level,
          skill_level: row.skill_level,
          passed_words_shape: _jsonShape(row.passed_words),
          failed_words_shape: _jsonShape(row.failed_words),
          quiz_stats_shape: _jsonShape(row.quiz_stats)
        };
      }),
      parsed: parsed
    };
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
    _injectV2Level();
    _registerSaveHook(user.id);
    _registerV2SaveHook(user.id);
    var profileScreen = document.getElementById('screen-learning-profile');
    if (profileScreen && !profileScreen.classList.contains('hidden') &&
        typeof window.renderLearningProfile === 'function') {
      window.renderLearningProfile();
    }
  }

  function _onSignOut() {
    _user          = null;
    _progressCache = {};
    if (typeof window._adaptiveSetSaveHook === 'function') {
      window._adaptiveSetSaveHook(null);
    }
    if (typeof window._adaptiveV2SetSaveHook === 'function') {
      window._adaptiveV2SetSaveHook(null);
    }
    if (typeof window._adaptiveV2SetAccountMode === 'function') {
      window._adaptiveV2SetAccountMode(false);
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

  function _wrapStartAdaptiveV2() {
    _origStartAdaptiveV2 = window.startAdaptiveV2Quiz;
    _origStartAdaptiveV2Review = window.startAdaptiveV2ReviewQuiz;

    async function _runV2Quiz(fn, args) {
      if (_user) {
        await _ensureLevelCached(_user.id, V2_LEVEL);
        _injectV2Level();
        _quizInProgress = true;
        _quizCompleted  = false;
        _quizLevel      = V2_LEVEL;
        _quizSnapshot   = _deepCopy(_progressCache[V2_LEVEL]);
      }
      if (typeof fn === 'function') await fn.apply(null, args);
      var quizScreen = document.getElementById('screen-quiz');
      if (_user && quizScreen && quizScreen.classList.contains('hidden')) {
        _quizInProgress = false;
        _quizCompleted  = false;
        _quizSnapshot   = null;
        _quizLevel      = null;
      }
    }

    window.startAdaptiveV2Quiz = function () {
      return _runV2Quiz(_origStartAdaptiveV2, []);
    };
    window.startAdaptiveV2ReviewQuiz = function (rows, returnScreen) {
      return _runV2Quiz(_origStartAdaptiveV2Review, [rows, returnScreen]);
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
        if (_quizLevel === V2_LEVEL) _injectV2Level();
        else _injectLevel(_quizLevel);
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
    _wireCapacitorAuthCallback();

    // All wrappers must be registered after adaptive.js has run
    _wrapStartLevel();
    _wrapStartAdaptive();
    _wrapStartAdaptiveV2();
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

  // Expose auth re-render so the in-app offline screen can restore the auth
  // section without a page reload once connectivity is detected.
  window.APP_AUTH_RENDER = function() { _renderAuthSection(); _renderHome(); };

})();

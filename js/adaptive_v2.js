// ══════════════════════════════════════════════════════════════════
//  ADAPTIVE V2 — level-agnostic quiz engine (ALL vocabulary)
//  Depends on: app.js (renderCard, pick, showResults, show, _loadV2Vocab)
// ══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var QUIZ_LEN = 10;
  var RECENT_LIMIT = 25;
  var STORAGE_KEY = 'deutsch_adaptive_v2_progress';

  var _active = false;
  var _progress = null;
  var _answers = [];
  var _stageAtStart = 0;
  var _phaseAEarlyExit = false;
  var _pendingProgress = null;
  var _externalSaveFn = null;
  var _accountMode = false;
  var _quizCounter = 0;
  var _LEGACY_GUEST_PREFIX = 'deutsch_adaptive_progress_';

  function _defaultQuizStats() {
    return { adaptive: { quizzesCompleted: 0, correctAnswers: 0, incorrectAnswers: 0, studyTimeSeconds: 0 }, theme: {} };
  }

  function _legacyAttemptWeight(progress) {
    var words = (progress && progress.words) || {};
    var total = 0;
    Object.keys(words).forEach(function (id) {
      total += Number((words[id] || {}).seenCount) || 0;
    });
    return total;
  }

  function _toUnifiedId(level, srcId) {
    var digit = level === 'A1' ? '1' : level === 'A2' ? '2' : '3';
    return String(parseInt(String(digit) + String(srcId), 10));
  }

  window._v2BootstrapFromLegacyLevels = function (legacyByLevel) {
    var mergedWords = {};
    var totalWeight = 0;
    var weightedSkill = 0;
    var activeLegacyLevels = 0;
    var mergedRecent = [];
    var levels = ['A1', 'A2', 'B1'];

    levels.forEach(function (lv) {
      var p = legacyByLevel[lv];
      if (!p) return;
      var weight = _legacyAttemptWeight(p);
      if (weight > 0) {
        totalWeight += weight;
        weightedSkill += (Number(p.skillLevel) || 1) * weight;
        activeLegacyLevels += 1;
      }
      Object.keys(p.words || {}).forEach(function (srcId) {
        var uid = _toUnifiedId(lv, srcId);
        var w = p.words[srcId];
        if (!w) return;
        if (!mergedWords[uid]) {
          mergedWords[uid] = { failScore: 0, seenCount: 0, correctCount: 0, lastSeenQuiz: 0 };
        }
        var dst = mergedWords[uid];
        dst.failScore = Math.max(Number(dst.failScore) || 0, Number(w.failScore) || 0);
        dst.seenCount = Math.max(Number(dst.seenCount) || 0, Number(w.seenCount) || 0);
        dst.correctCount = Math.max(Number(dst.correctCount) || 0, Number(w.correctCount) || 0);
      });
      (p.recentWords || []).forEach(function (srcId) {
        mergedRecent.push(_toUnifiedId(lv, srcId));
      });
    });

    var bootstrapSkill = totalWeight ? weightedSkill / totalWeight : 1;
    var skipCalibration = activeLegacyLevels >= 2 && totalWeight >= 20;
    var seen = {};
    mergedRecent = mergedRecent.filter(function (id) {
      if (seen[id]) return false;
      seen[id] = true;
      return true;
    }).slice(-RECENT_LIMIT);

    return {
      evaluationStage: skipCalibration ? 3 : 0,
      skillLevel: _clamp(bootstrapSkill, 1, 10),
      words: mergedWords,
      recentWords: mergedRecent,
      quizStats: _defaultQuizStats()
    };
  };

  function _hasMeaningfulProgress(p) {
    if (!p) return false;
    if ((Number(p.evaluationStage) || 0) > 0) return true;
    if (Object.keys(p.words || {}).length > 0) return true;
    if ((Number(p.skillLevel) || 1) > 1) return true;
    return false;
  }

  function _loadLegacyGuestLevels() {
    var out = {};
    ['A1', 'A2', 'B1'].forEach(function (lv) {
      try {
        var raw = localStorage.getItem(_LEGACY_GUEST_PREFIX + lv);
        if (raw) out[lv] = JSON.parse(raw);
      } catch (e) {}
    });
    return out;
  }

  function _tryGuestLegacyBootstrap() {
    if (_accountMode) return null;
    var legacyByLevel = _loadLegacyGuestLevels();
    var hasLegacy = ['A1', 'A2', 'B1'].some(function (lv) {
      return _legacyAttemptWeight(legacyByLevel[lv]) > 0;
    });
    if (!hasLegacy) return null;
    return window._v2BootstrapFromLegacyLevels(legacyByLevel);
  }

  function _loadFromLocal() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
  }

  function _saveToLocal(p) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) {}
  }

  var _TYPE_LABELS = {
    N: 'Noun', V: 'Verb', A: 'Adjective', P: 'Phrase', D: 'Adverb', '#': 'Number', W: 'Word'
  };
  var _ARTICLE_LABELS = { r: 'der', e: 'die', s: 'das' };

  function _clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function _shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function _load() {
    if (_accountMode) return null;
    return _loadFromLocal();
  }

  function _save(p) {
    if (!_accountMode) _saveToLocal(p);
    if (typeof _externalSaveFn === 'function') _externalSaveFn(p);
  }

  function _initProgress() {
    return {
      evaluationStage: 0,
      skillLevel: 1,
      words: {},
      recentWords: [],
      quizStats: _defaultQuizStats()
    };
  }

  function _resolveGuestProgress() {
    var loaded = _loadFromLocal();
    if (!_hasMeaningfulProgress(loaded)) {
      var boot = _tryGuestLegacyBootstrap();
      if (boot) {
        loaded = boot;
        _saveToLocal(loaded);
      }
    }
    return loaded || _initProgress();
  }

  function _get() {
    if (!_progress) {
      if (_pendingProgress) {
        _progress = _pendingProgress;
        _pendingProgress = null;
      } else if (_accountMode) {
        _progress = _initProgress();
      } else {
        _progress = _resolveGuestProgress();
      }
    }
    return _progress;
  }

  function _allWords() {
    if (typeof window._v2AllQuizRows !== 'function') return [];
    return window._v2AllQuizRows();
  }

  function _wordStat(p, id) {
    if (!p.words[id]) p.words[id] = { failScore: 0, seenCount: 0, correctCount: 0, lastSeenQuiz: 0 };
    return p.words[id];
  }

  function _compareCandidates(a, b) {
    var failDiff = (Number(b.failScore) || 0) - (Number(a.failScore) || 0);
    if (failDiff) return failDiff;
    var seenDiff = (Number(a.lastSeenQuiz) || 0) - (Number(b.lastSeenQuiz) || 0);
    if (seenDiff) return seenDiff;
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  }

  function _available(pool, usedIds) {
    return pool.filter(function (r) { return !usedIds[r.id]; });
  }

  function _byDifficulty(pool, diff, recentWords) {
    var d = _clamp(Math.round(diff), 1, 10);
    var rSet = {};
    (recentWords || []).forEach(function (id) { rSet[id] = true; });
    var at = pool.filter(function (r) { return parseInt(r.difficulty, 10) === d; });
    var fresh = at.filter(function (r) { return !rSet[r.id]; });
    if (fresh.length) return fresh[0];
    if (at.length) return at[0];
    return null;
  }

  function _nearestDifficulty(pool, targetDiff) {
    if (!pool.length) return null;
    var ranked = pool.slice().sort(function (a, b) {
      var da = Math.abs(parseInt(a.difficulty, 10) - targetDiff);
      var db = Math.abs(parseInt(b.difficulty, 10) - targetDiff);
      return da - db || String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
    });
    return ranked[0];
  }

  function _buildPhaseA(all, p) {
    var selected = [];
    var usedIds = {};
    var rw = p.recentWords || [];
    for (var d = 1; d <= 10; d++) {
      var pool = _available(all, usedIds);
      var w = _byDifficulty(pool, d, rw);
      if (!w) w = _nearestDifficulty(pool, d);
      if (w) { usedIds[w.id] = true; selected.push(w); }
    }
    return selected.slice(0, QUIZ_LEN);
  }

  function _buildPhaseB(all, p) {
    var center = _clamp(p.skillLevel, 1, 10);
    var lo = _clamp(center - 1.5, 1, 10);
    var hi = _clamp(center + 1.5, 1, 10);
    var selected = [];
    var usedIds = {};
    var rw = p.recentWords || [];
    var slots = [];
    for (var i = 0; i < QUIZ_LEN; i++) {
      slots.push(lo + ((hi - lo) * i / Math.max(QUIZ_LEN - 1, 1)));
    }
    _shuffle(slots).forEach(function (target) {
      var pool = _available(all, usedIds);
      var w = _byDifficulty(pool, target, rw) || _nearestDifficulty(pool, target);
      if (w) { usedIds[w.id] = true; selected.push(w); }
    });
    while (selected.length < QUIZ_LEN) {
      var extra = _available(all, usedIds);
      if (!extra.length) break;
      var pick = extra[0];
      usedIds[pick.id] = true;
      selected.push(pick);
    }
    return selected.slice(0, QUIZ_LEN);
  }

  function _classifyWords(all, p) {
    var struggling = [];
    var learning = [];
    var stable = [];
    all.forEach(function (row) {
      var w = _wordStat(p, row.id);
      var diff = parseInt(row.difficulty, 10) || 5;
      var item = { id: row.id, row: row, failScore: w.failScore, lastSeenQuiz: w.lastSeenQuiz, seenCount: w.seenCount, difficulty: diff };
      if (w.failScore > 0) struggling.push(item);
      else if (w.seenCount === 0) learning.push(item);
      else if (w.seenCount > 0 && w.failScore === 0) stable.push(item);
      else learning.push(item);
    });
    return {
      struggling: struggling.sort(_compareCandidates),
      learning: learning.sort(_compareCandidates),
      stable: stable.sort(_compareCandidates)
    };
  }

  function _learningAtSkill(learning, skill) {
    var si = _clamp(Math.round(skill), 1, 10);
    return learning.slice().sort(function (a, b) {
      var da = Math.abs(a.difficulty - si);
      var db = Math.abs(b.difficulty - si);
      return da - db || _compareCandidates(a, b);
    });
  }

  function _buildNormalRows(all, p) {
    var pools = _classifyWords(all, p);
    var skill = p.skillLevel;
    var usedIds = {};
    var selected = [];

    function takeFromRanked(ranked, count) {
      var picked = [];
      for (var i = 0; i < ranked.length && picked.length < count; i++) {
        if (usedIds[ranked[i].id]) continue;
        usedIds[ranked[i].id] = true;
        picked.push(ranked[i].row);
      }
      return picked;
    }

    selected = selected.concat(takeFromRanked(pools.struggling, 3));

    selected = selected.concat(takeFromRanked(_learningAtSkill(pools.learning, skill), 3));
    selected = selected.concat(takeFromRanked(pools.stable, 2));

    var confidenceTarget = _clamp(skill - 1.5, 1, 10);
    var confidencePool = _available(all, usedIds);
    var confidence = _byDifficulty(confidencePool, confidenceTarget, p.recentWords) ||
      _nearestDifficulty(confidencePool, confidenceTarget);
    if (confidence) { usedIds[confidence.id] = true; selected.push(confidence); }

    var exploreTarget = _clamp(skill + 2, 1, 10);
    var explorePool = _available(all, usedIds);
    var explore = _byDifficulty(explorePool, exploreTarget, p.recentWords) ||
      _nearestDifficulty(explorePool, exploreTarget);
    if (explore) { usedIds[explore.id] = true; selected.push(explore); }

    while (selected.length < QUIZ_LEN) {
      var fallbackPool = _available(all, usedIds);
      if (!fallbackPool.length) break;
      var fb = fallbackPool[0];
      usedIds[fb.id] = true;
      selected.push(fb);
    }

    return _shuffle(selected).slice(0, QUIZ_LEN);
  }

  function _buildQueue() {
    var p = _get();
    var all = _allWords();
    if (!all.length) return [];
    var stage = p.evaluationStage;
    var rows;
    if (stage === 0) rows = _buildPhaseA(all, p);
    else if (stage === 1) rows = _buildPhaseB(all, p);
    else rows = _buildNormalRows(all, p);
    return _makeCards(rows, all);
  }

  function _makeCards(rows, all) {
    return rows.map(function (row) {
      var usedIds = {}; usedIds[row.id] = true;
      var usedEn = {}; usedEn[(row.translation_en || '').trim()] = true;
      var distractors = [];
      _shuffle(all).forEach(function (d) {
        if (distractors.length >= 6) return;
        if (usedIds[d.id]) return;
        var en = (d.translation_en || '').trim();
        if (en && !usedEn[en]) {
          usedEn[en] = true;
          usedIds[d.id] = true;
          distractors.push(d);
        }
      });
      return { _row: row, _distractors: distractors };
    });
  }

  function _updateWord(p, wordId, correct) {
    var w = _wordStat(p, wordId);
    w.seenCount++;
    w.lastSeenQuiz = _quizCounter;
    if (correct) {
      w.correctCount++;
      w.failScore = Math.max(0, w.failScore - 1);
    } else {
      w.failScore += 2;
    }
  }

  function _updateRecent(p, ids) {
    var rw = p.recentWords || [];
    ids.forEach(function (id) {
      var i = rw.indexOf(id);
      if (i !== -1) rw.splice(i, 1);
      rw.push(id);
    });
    p.recentWords = rw.slice(-RECENT_LIMIT);
  }

  function _afterPhaseA(p, answers) {
    var firstSix = answers.slice(0, 6);
    var firstSixCorrect = firstSix.filter(function (a) { return a.correct; }).length;
    if (firstSix.length >= 6 && firstSixCorrect === 0) {
      p.skillLevel = 2;
      p.evaluationStage = 3;
      _phaseAEarlyExit = true;
      return;
    }
    var correct = answers.filter(function (a) { return a.correct; });
    if (!correct.length) {
      p.skillLevel = 1;
    } else {
      var totalWeight = 0;
      var weightedSum = 0;
      correct.forEach(function (a) {
        var weight = 1 + a.position / Math.max(answers.length - 1, 1);
        totalWeight += weight;
        weightedSum += a.difficulty * weight;
      });
      p.skillLevel = _clamp(weightedSum / totalWeight, 1, 10);
    }
    p.evaluationStage = 1;
  }

  function _afterPhaseB(p, answers) {
    var correct = answers.filter(function (a) { return a.correct; });
    var avg = correct.length
      ? correct.reduce(function (s, a) { return s + a.difficulty; }, 0) / correct.length
      : 1;
    p.skillLevel = _clamp((p.skillLevel + avg) / 2, 1, 10);
    p.evaluationStage = 3;
  }

  function _applyNormalFormula(p, answers) {
    var accuracy = answers.length ? answers.filter(function (a) { return a.correct; }).length / answers.length : 0;
    p.skillLevel = _clamp(p.skillLevel + (accuracy - 0.65) * 0.6, 1, 10);
  }

  function _processResults(answers) {
    var p = _get();
    _phaseAEarlyExit = false;
    answers.forEach(function (a) { _updateWord(p, a.wordId, a.correct); });
    _updateRecent(p, answers.map(function (a) { return a.wordId; }));
    var stage = _stageAtStart;
    if (stage === 0) _afterPhaseA(p, answers);
    else if (stage === 1) _afterPhaseB(p, answers);
    else _applyNormalFormula(p, answers);
    _save(p);
    _progress = p;
  }

  function _v2Ui(key) {
    if (typeof t === 'function') {
      var val = t(key);
      if (val != null && val !== key) return val;
    }
    var fallback = {
      adaptiveV2BannerStatusDefault: 'Finds your level automatically',
      adaptiveV2StatusCal1: 'Calibration quiz 1 of 2',
      adaptiveV2StatusCal2: 'Calibration quiz 2 of 2'
    };
    return fallback[key] || '';
  }

  function _badgeText() {
    var p = _get();
    if (p.evaluationStage === 0) return _v2Ui('adaptiveV2StatusCal1');
    if (p.evaluationStage === 1) return _v2Ui('adaptiveV2StatusCal2');
    var skillLabel = _v2Ui('adaptiveV2StatusSkill');
    if (typeof skillLabel === 'function') return skillLabel(p.skillLevel.toFixed(1));
    return 'Your skill level: ' + p.skillLevel.toFixed(1);
  }

  function _updateHomeBadge() {
    var statusEl = document.getElementById('adaptive-v2-banner-status');
    if (!statusEl) return;
    var p = _get();
    if (p.evaluationStage >= 3 || _hasMeaningfulProgress(p)) {
      statusEl.textContent = _badgeText();
    } else {
      statusEl.textContent = _v2Ui('adaptiveV2BannerStatusDefault');
    }
  }

  window.startAdaptiveV2Quiz = async function () {
    var p = _get();
    _active = true;
    _answers = [];
    _stageAtStart = p.evaluationStage;
    _quizCounter++;

    var ov = document.getElementById('quiz-prep-overlay');
    ov.classList.add('active');

    try {
      if (typeof window._loadV2Vocab === 'function') await window._loadV2Vocab();
    } catch (err) {
      ov.classList.remove('active');
      var msg = 'Could not load vocabulary data.';
      if (window.location.protocol === 'file:') msg += ' Open through a local server instead of file://.';
      alert(msg);
      _active = false;
      return;
    }

    var cards = _buildQueue();
    ov.classList.remove('active');

    if (!cards.length) {
      alert('No words available!');
      _active = false;
      return;
    }

    currentLevel = 'ALL';
    currentThemeCategoryId = 0;
    queue = cards;
    idx = 0; ok = 0; no = 0;
    _quizReturnScreen = 'screen-levels';

    if (typeof window._quizStartedAtMs !== 'undefined') window._quizStartedAtMs = Date.now();
    else if (typeof _quizStartedAtMs !== 'undefined') _quizStartedAtMs = Date.now();

    window.umami?.track('adaptive_v2_started', { stage: _stageAtStart, skill: p.skillLevel });
    show('screen-quiz');
    renderCard();
  };

  window.startAdaptiveV2ReviewQuiz = async function (rows, returnScreen) {
    var p = _get();
    _active = true;
    _answers = [];
    _stageAtStart = Math.max(3, p.evaluationStage || 0);
    _quizCounter++;

    var ov = document.getElementById('quiz-prep-overlay');
    ov.classList.add('active');

    try {
      if (typeof window._loadV2Vocab === 'function') await window._loadV2Vocab();
    } catch (err) {
      ov.classList.remove('active');
      alert('Could not load vocabulary data.');
      _active = false;
      return;
    }

    var all = _allWords();
    var cards = _makeCards((rows || []).slice(0, QUIZ_LEN), all);
    ov.classList.remove('active');

    if (!cards.length) {
      alert('No words available!');
      _active = false;
      return;
    }

    currentLevel = 'ALL';
    currentThemeCategoryId = 0;
    queue = cards;
    idx = 0; ok = 0; no = 0;
    if (returnScreen) _quizReturnScreen = returnScreen;

    show('screen-quiz');
    renderCard();
  };

  var _origRenderCard = window.renderCard;
  window.renderCard = function () {
    _origRenderCard();
    if (_active) {
      var mb = document.getElementById('tmode-badge');
      if (mb) {
        mb.textContent = 'Adaptive V2';
        mb.className = 'tmode-badge grammar';
      }
      var tl = document.getElementById('tlevel');
      if (tl) tl.textContent = (typeof t === 'function' ? t('levelLabel') : 'Level') + ' ALL';
    }
  };

  var _origPick = window.pick;
  window.pick = function (btn, selectedId, correctId) {
    _origPick(btn, selectedId, correctId);
    if (_active) {
      var card = queue[idx];
      var diff = parseInt((card && card._row && card._row.difficulty) || '5', 10) || 5;
      _answers.push({
        wordId: correctId,
        difficulty: diff,
        correct: selectedId === correctId,
        position: idx
      });
    }
  };

  var _origShowResults = window.showResults;
  window.showResults = function () {
    var wasActive = _active;
    _origShowResults();
    if (wasActive) {
      _processResults(_answers);
      _updateHomeBadge();
    }
  };

  var _origRestartLevel = window.restartLevel;
  window.restartLevel = function () {
    if (_active) window.startAdaptiveV2Quiz();
    else _origRestartLevel();
  };

  var _origGoHome = window.goHome;
  window.goHome = function () {
    _active = false;
    _origGoHome();
    _updateHomeBadge();
  };

  window._adaptiveV2InjectProgress = function (p) {
    if (p && (isNaN(p.skillLevel) || p.skillLevel < 1)) p.skillLevel = 1;
    _pendingProgress = p;
    _progress = null;
  };

  window._adaptiveV2SetAccountMode = function (on) {
    _accountMode = !!on;
    _progress = null;
    _pendingProgress = null;
  };

  window._adaptiveV2SetSaveHook = function (fn) { _externalSaveFn = fn; };
  window._adaptiveV2RefreshBadge = _updateHomeBadge;
  window._adaptiveV2GetProgress = function () {
    if (_accountMode) return null;
    return _deepCopyProgress(_progress || _resolveGuestProgress());
  };

  function _deepCopyProgress(obj) {
    try { return JSON.parse(JSON.stringify(obj)); } catch (e) { return null; }
  }

  function _onReady() { _updateHomeBadge(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _onReady);
  } else {
    setTimeout(_onReady, 0);
  }
})();

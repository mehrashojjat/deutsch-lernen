// ══════════════════════════════════════════════════════════════════
//  ADAPTIVE V2 — CEFR-stratified quiz engine (ALL vocabulary)
//  Depends on: app.js (renderCard, pick, showResults, show, _loadV2Vocab)
// ══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var QUIZ_LEN = 10;
  var RECENT_LIMIT = 25;
  var STORAGE_KEY = 'deutsch_adaptive_v2_progress';
  var BANDS = ['A1', 'A2', 'B1'];
  var NEXT_BAND = { A1: 'A2', A2: 'B1' };
  var PREV_BAND = { A2: 'A1', B1: 'A2' };
  var PHASE_A_PROBE = [
    { band: 'A1', diff: 2 }, { band: 'A1', diff: 4 }, { band: 'A1', diff: 6 }, { band: 'A1', diff: 8 },
    { band: 'A2', diff: 3 }, { band: 'A2', diff: 6 }, { band: 'A2', diff: 9 },
    { band: 'B1', diff: 3 }, { band: 'B1', diff: 6 }, { band: 'B1', diff: 9 }
  ];

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

  function _defaultRushStats() {
    return {
      sessionsCompleted: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalStudyTimeSeconds: 0,
      bestSessionQuestions: 0,
      bestSessionAccuracy: 0,
      longestSessionSeconds: 0
    };
  }

  function _defaultQuizStats() {
    return {
      adaptive: { quizzesCompleted: 0, correctAnswers: 0, incorrectAnswers: 0, studyTimeSeconds: 0 },
      theme: {},
      rush: _defaultRushStats()
    };
  }

  function _normalizeRushStats(rush) {
    rush = (rush && typeof rush === 'object') ? rush : {};
    return {
      sessionsCompleted: Number(rush.sessionsCompleted) || 0,
      totalQuestions: Number(rush.totalQuestions) || 0,
      totalCorrect: Number(rush.totalCorrect) || 0,
      totalStudyTimeSeconds: Number(rush.totalStudyTimeSeconds) || 0,
      bestSessionQuestions: Number(rush.bestSessionQuestions) || 0,
      bestSessionAccuracy: Number(rush.bestSessionAccuracy) || 0,
      longestSessionSeconds: Number(rush.longestSessionSeconds) || 0
    };
  }

  function _normalizeQuizStats(stats) {
    stats = (stats && typeof stats === 'object') ? stats : {};
    var adaptive = stats.adaptive || {};
    var theme = (stats.theme && typeof stats.theme === 'object') ? stats.theme : {};
    return {
      adaptive: {
        quizzesCompleted: Number(adaptive.quizzesCompleted) || 0,
        correctAnswers: Number(adaptive.correctAnswers) || 0,
        incorrectAnswers: Number(adaptive.incorrectAnswers) || 0,
        studyTimeSeconds: Number(adaptive.studyTimeSeconds) || 0
      },
      theme: theme,
      rush: _normalizeRushStats(stats.rush)
    };
  }

  function _incrementQuizStats(target, payload) {
    target = target || { quizzesCompleted: 0, correctAnswers: 0, incorrectAnswers: 0, studyTimeSeconds: 0 };
    target.quizzesCompleted += 1;
    target.correctAnswers += Number(payload.correctAnswers) || 0;
    target.incorrectAnswers += Number(payload.incorrectAnswers) || 0;
    target.studyTimeSeconds += Number(payload.studyTimeSeconds) || 0;
    return target;
  }

  function _clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function _shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function _toUnifiedId(level, srcId) {
    var digit = level === 'A1' ? '1' : level === 'A2' ? '2' : '3';
    return String(parseInt(String(digit) + String(srcId), 10));
  }

  function _toUnifiedIdSafe(level, srcId) {
    var sid = String(srcId);
    if (window._v2IsUnifiedId && window._v2IsUnifiedId(sid)) return sid;
    return _toUnifiedId(level, sid);
  }

  window._v2BandFromId = function (id) {
    var d = String(id || '')[0];
    if (d === '2') return 'A2';
    if (d === '3') return 'B1';
    return 'A1';
  };

  function _initProgress() {
    return {
      evaluationStage: 0,
      cefrBand: 'A1',
      skillLevel: 1,
      learningPhase: 'active',
      words: {},
      recentWords: [],
      crossBandLog: [],
      challengeLowStreak: 0,
      quizStats: _defaultQuizStats()
    };
  }

  function _legacyAttemptWeight(progress) {
    var words = (progress && progress.words) || {};
    var total = 0;
    Object.keys(words).forEach(function (id) {
      total += Number((words[id] || {}).seenCount) || 0;
    });
    return total;
  }

  function _legacyLevelStats(legacyProgress, level) {
    var p = legacyProgress || {};
    var words = p.words || {};
    var attempts = 0;
    var correct = 0;
    var uniqueSeen = 0;
    Object.keys(words).forEach(function (id) {
      var w = words[id] || {};
      var seen = Number(w.seenCount) || 0;
      if (seen > 0) uniqueSeen++;
      attempts += seen;
      correct += Number(w.correctCount) || 0;
    });
    var evalStage = Number(p.evaluationStage) || 0;
    var evalDone = evalStage >= 3;
    if (!evalDone && attempts >= 25 && uniqueSeen >= 20) evalDone = true;
    return {
      attempts: attempts,
      uniqueSeen: uniqueSeen,
      accuracy: attempts ? correct / attempts : 0,
      evalDone: evalDone,
      skill: Number(p.skillLevel) || 1,
      evalStage: evalStage
    };
  }

  function _assessLegacyConfidence(legacyByLevel) {
    var levels = ['A1', 'A2', 'B1'];
    var stats = {};
    var hasAny = false;
    levels.forEach(function (lv) {
      stats[lv] = _legacyLevelStats(legacyByLevel[lv], lv);
      if (stats[lv].attempts > 0) hasAny = true;
    });
    if (!hasAny) {
      return { tier: 2, cefrBand: 'A1', skillLevel: 1, evaluationStage: 0, confidence: 0 };
    }

    var cefrBand = 'A1';
    for (var hi = levels.length - 1; hi >= 0; hi--) {
      var L = levels[hi];
      if (stats[L].evalDone && stats[L].attempts >= 15) { cefrBand = L; break; }
    }
    if (cefrBand === 'A1') {
      for (var j = levels.length - 1; j >= 0; j--) {
        if (stats[levels[j]].attempts >= 10) { cefrBand = levels[j]; break; }
      }
    }

    var skillLevel = _clamp(stats[cefrBand].skill, 1, 10);
    var confidence = 0;
    if (stats[cefrBand].evalDone) confidence += 30;
    if (stats[cefrBand].attempts >= 40) confidence += 25;
    else if (stats[cefrBand].evalDone && stats[cefrBand].attempts >= 25) confidence += 10;
    if (stats[cefrBand].uniqueSeen >= 50) confidence += 15;
    else if (stats[cefrBand].uniqueSeen >= 20) confidence += 5;
    if (stats[cefrBand].accuracy >= 0.55) confidence += 10;

    var sorted = levels.slice().sort(function (a, b) {
      return stats[b].attempts - stats[a].attempts;
    });
    if (sorted[1] && stats[sorted[1]].attempts >= 15) confidence += 10;

    var activeSkills = levels.filter(function (lv) { return stats[lv].attempts >= 10; })
      .map(function (lv) { return stats[lv].skill; });
    if (activeSkills.length >= 2) {
      var minS = Math.min.apply(null, activeSkills);
      var maxS = Math.max.apply(null, activeSkills);
      if (maxS - minS <= 2) confidence += 10;
    }
    confidence = Math.min(100, confidence);

    var evaluationStage = 0;
    if (confidence >= 70) evaluationStage = 3;
    else if (confidence >= 40) evaluationStage = 1;

    if (!stats[cefrBand].evalDone && stats[cefrBand].attempts < 25) {
      evaluationStage = 0;
      confidence = Math.min(confidence, 35);
    }

    var evalDoneLevels = levels.filter(function (lv) { return stats[lv].evalDone; });
    if (evalDoneLevels.length >= 2) {
      var skills = evalDoneLevels.map(function (lv) { return stats[lv].skill; });
      if (Math.max.apply(null, skills) - Math.min.apply(null, skills) > 4) {
        evaluationStage = 1;
      }
    }

    var tier = evaluationStage === 3 ? 0 : (evaluationStage === 1 ? 1 : 2);
    return { tier: tier, cefrBand: cefrBand, skillLevel: skillLevel, evaluationStage: evaluationStage, confidence: confidence };
  }

  window._v2BootstrapFromLegacyLevels = function (legacyByLevel) {
    var mergedWords = {};
    var mergedRecent = [];
    var levels = ['A1', 'A2', 'B1'];

    levels.forEach(function (lv) {
      var p = legacyByLevel[lv];
      if (!p) return;
      Object.keys(p.words || {}).forEach(function (srcId) {
        var uid = _toUnifiedIdSafe(lv, srcId);
        var w = p.words[srcId];
        if (!w) return;
        if (!mergedWords[uid]) {
          mergedWords[uid] = {
            failScore: 0, seenCount: 0, correctCount: 0, lastSeenQuiz: 0,
            themeSeenCount: 0, adaptiveSeenCount: 0
          };
        }
        var dst = mergedWords[uid];
        dst.failScore = Math.max(Number(dst.failScore) || 0, Number(w.failScore) || 0);
        dst.seenCount = Math.max(Number(dst.seenCount) || 0, Number(w.seenCount) || 0);
        dst.correctCount = Math.max(Number(dst.correctCount) || 0, Number(w.correctCount) || 0);
      });
      (p.recentWords || []).forEach(function (srcId) {
        mergedRecent.push(_toUnifiedIdSafe(lv, srcId));
      });
    });

    var assessment = _assessLegacyConfidence(legacyByLevel);
    var seen = {};
    mergedRecent = mergedRecent.filter(function (id) {
      if (seen[id]) return false;
      seen[id] = true;
      return true;
    }).slice(-RECENT_LIMIT);

    return {
      evaluationStage: assessment.evaluationStage,
      cefrBand: assessment.cefrBand,
      skillLevel: _clamp(assessment.skillLevel, 1, 10),
      learningPhase: 'active',
      legacyConfidence: assessment.confidence,
      words: mergedWords,
      recentWords: mergedRecent,
      crossBandLog: [],
      challengeLowStreak: 0,
      quizStats: _defaultQuizStats()
    };
  };

  function _inferBandFromWords(p, all) {
    var counts = { A1: 0, A2: 0, B1: 0 };
    Object.keys(p.words || {}).forEach(function (id) {
      var w = p.words[id];
      if (!w || !(Number(w.seenCount) > 0)) return;
      counts[window._v2BandFromId(id)]++;
    });
    if (counts.B1 >= counts.A2 && counts.B1 >= counts.A1 && counts.B1 > 0) return 'B1';
    if (counts.A2 >= counts.A1 && counts.A2 > 0) return 'A2';
    return 'A1';
  }

  function _migrateWordRecord(w) {
    if (!w || typeof w !== 'object') return;
    var seen = Number(w.seenCount) || 0;
    var themeSeen = Number(w.themeSeenCount) || 0;
    var adaptiveSeen = Number(w.adaptiveSeenCount);
    if (!isFinite(adaptiveSeen)) {
      w.adaptiveSeenCount = themeSeen > 0 ? Math.max(0, seen - themeSeen) : seen;
    }
    if (w.themeSeenCount == null) w.themeSeenCount = Math.max(0, seen - (Number(w.adaptiveSeenCount) || 0));
  }

  function _migrateProgress(p, all) {
    if (!p || typeof p !== 'object') return _initProgress();
    if (!p.words) p.words = {};
    Object.keys(p.words).forEach(function (id) { _migrateWordRecord(p.words[id]); });
    if (!p.recentWords) p.recentWords = [];
    if (!p.quizStats) p.quizStats = _defaultQuizStats();
    if (!p.cefrBand) p.cefrBand = all && all.length ? _inferBandFromWords(p, all) : 'A1';
    if (!p.learningPhase) p.learningPhase = 'active';
    if (!p.crossBandLog) p.crossBandLog = [];
    if (p.challengeLowStreak == null) p.challengeLowStreak = 0;
    if (isNaN(p.skillLevel) || p.skillLevel < 1) p.skillLevel = 1;
    if (isNaN(p.evaluationStage)) p.evaluationStage = 0;
    if (typeof window._v2RepairProgressWordIds === 'function') {
      if (window._v2RepairProgressWordIds(p) && !_accountMode) _saveToLocal(p);
    }
    return p;
  }

  function _hasMeaningfulProgress(p) {
    if (!p) return false;
    if ((Number(p.evaluationStage) || 0) > 0) return true;
    if (Object.keys(p.words || {}).length > 0) return true;
    if ((Number(p.skillLevel) || 1) > 1) return true;
    if (p.cefrBand && p.cefrBand !== 'A1') return true;
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

  function _save(p) {
    if (!_accountMode) _saveToLocal(p);
    if (typeof _externalSaveFn === 'function') _externalSaveFn(p);
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
    var result = _migrateProgress(loaded || _initProgress(), null);
    return result;
  }

  function _get() {
    if (!_progress) {
      if (_pendingProgress) {
        _progress = _migrateProgress(_pendingProgress, _allWords());
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

  function _readWordStat(p, id) {
    var w = (p.words && p.words[id]) || null;
    return {
      failScore: Number(w && w.failScore) || 0,
      seenCount: Number(w && w.seenCount) || 0,
      correctCount: Number(w && w.correctCount) || 0,
      lastSeenQuiz: Number(w && w.lastSeenQuiz) || 0,
      themeSeenCount: Number(w && w.themeSeenCount) || 0,
      adaptiveSeenCount: Number(w && w.adaptiveSeenCount) || 0
    };
  }

  function _wordStat(p, id) {
    if (!p.words[id]) {
      p.words[id] = {
        failScore: 0, seenCount: 0, correctCount: 0, lastSeenQuiz: 0,
        themeSeenCount: 0, adaptiveSeenCount: 0
      };
    }
    return p.words[id];
  }

  function _isUnseen(p, id) {
    return (Number(_readWordStat(p, id).adaptiveSeenCount) || 0) === 0;
  }

  function _hasExposure(p, id) {
    return (Number(_readWordStat(p, id).seenCount) || 0) > 0;
  }

  function _isNumberRow(row) {
    return row && row.word_type === 'Number';
  }

  function _filterByBand(pool, band) {
    return pool.filter(function (r) { return window._v2BandFromId(r.id) === band; });
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

  function _deprioritizeNumbers(pool, skipNumbers) {
    if (!skipNumbers) return pool;
    var non = pool.filter(function (r) { return !_isNumberRow(r); });
    return non.length ? non : pool;
  }

  function _byDifficulty(pool, diff, recentWords) {
    var d = _clamp(Math.round(diff), 1, 10);
    var rSet = {};
    (recentWords || []).forEach(function (id) { rSet[id] = true; });
    var at = pool.filter(function (r) { return parseInt(r.difficulty, 10) === d; });
    var fresh = at.filter(function (r) { return !rSet[r.id]; });
    if (fresh.length) return _shuffle(fresh)[0];
    if (at.length) return _shuffle(at)[0];
    return null;
  }

  function _nearestDifficulty(pool, targetDiff) {
    if (!pool.length) return null;
    var ranked = pool.slice().sort(function (a, b) {
      var da = Math.abs(parseInt(a.difficulty, 10) - targetDiff);
      var db = Math.abs(parseInt(b.difficulty, 10) - targetDiff);
      return da - db || String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
    });
    var bestDist = Math.abs(parseInt(ranked[0].difficulty, 10) - targetDiff);
    var ties = ranked.filter(function (r) {
      return Math.abs(parseInt(r.difficulty, 10) - targetDiff) === bestDist;
    });
    return _shuffle(ties)[0];
  }

  function _fallback(pool, usedIds, recentWords) {
    var avail = _available(pool, usedIds || {});
    var rSet = {};
    (recentWords || []).forEach(function (id) { rSet[id] = true; });
    var fresh = avail.filter(function (r) { return !rSet[r.id]; });
    var use = fresh.length ? fresh : avail;
    return use.length ? _shuffle(use)[0] : null;
  }

  function _pickUnseen(pool, p, opts) {
    opts = opts || {};
    var candidates = pool.filter(function (r) { return _isUnseen(p, r.id); });
    if (!candidates.length) return null;
    candidates = _deprioritizeNumbers(candidates, opts.skipNumbers !== false);
    var nounsVerbs = candidates.filter(function (r) {
      return r.word_type === 'Noun' || r.word_type === 'Verb' || r.word_type === 'Adjective';
    });
    if (nounsVerbs.length) candidates = nounsVerbs;
    return _shuffle(candidates)[0];
  }

  function _pickForCalibration(all, usedIds, rw, band, diff, numberUsed) {
    var pool = _deprioritizeNumbers(_available(_filterByBand(all, band), usedIds), numberUsed >= 1);
    var w = _byDifficulty(pool, diff, rw) || _nearestDifficulty(pool, diff);
    if (w && _isNumberRow(w) && numberUsed >= 1) {
      pool = pool.filter(function (r) { return !_isNumberRow(r); });
      w = _byDifficulty(pool, diff, rw) || _nearestDifficulty(pool, diff);
    }
    return w;
  }

  function _exploration(pool, recentWords, skillLevel, homeBand) {
    var S = _clamp(Math.round(skillLevel), 1, 10);
    var next = NEXT_BAND[homeBand];
    var rSet = {};
    (recentWords || []).forEach(function (id) { rSet[id] = true; });
    var fresh = pool.filter(function (r) { return !rSet[r.id]; });
    var use = fresh.length ? fresh : pool;

    if (next) {
      var cross = use.filter(function (r) {
        return window._v2BandFromId(r.id) === next && parseInt(r.difficulty, 10) >= 3;
      });
      if (cross.length) return _shuffle(cross)[0];
    }

    var hard = use.filter(function (r) {
      var d = parseInt(r.difficulty, 10);
      return window._v2BandFromId(r.id) === homeBand && d > S + 1 && d <= Math.min(10, S + 3);
    });
    if (hard.length) return _shuffle(hard)[0];

    var far = use.filter(function (r) {
      return Math.abs(parseInt(r.difficulty, 10) - S) >= 2;
    });
    if (far.length) return _shuffle(far)[0];
    return use.length ? _shuffle(use)[0] : null;
  }

  function _buildPhaseA(all, p) {
    var selected = [];
    var usedIds = {};
    var rw = p.recentWords || [];
    var numberUsed = 0;
    PHASE_A_PROBE.forEach(function (slot) {
      var w = _pickForCalibration(all, usedIds, rw, slot.band, slot.diff, numberUsed);
      if (w) {
        if (_isNumberRow(w)) numberUsed++;
        usedIds[w.id] = true;
        selected.push(w);
      }
    });
    return _shuffle(selected).slice(0, QUIZ_LEN);
  }

  function _bandProbeResults(answers) {
    var byBand = { A1: { total: 0, correct: 0, diffs: [] }, A2: { total: 0, correct: 0, diffs: [] }, B1: { total: 0, correct: 0, diffs: [] } };
    answers.forEach(function (a) {
      var b = a.cefrBand || window._v2BandFromId(a.wordId);
      if (!byBand[b]) return;
      byBand[b].total++;
      if (a.correct) {
        byBand[b].correct++;
        byBand[b].diffs.push(a.difficulty);
      }
    });
    return byBand;
  }

  function _bandPassRate(stats) {
    return stats.total ? stats.correct / stats.total : 0;
  }

  function _assignBandFromProbes(byBand) {
    var a1 = _bandPassRate(byBand.A1);
    var a2 = _bandPassRate(byBand.A2);
    var b1 = _bandPassRate(byBand.B1);
    if (a2 >= 0.6 && b1 >= 0.6) return 'B1';
    if (a2 >= 0.6) return 'A2';
    if (a1 >= 0.6 || a1 > a2) return 'A1';
    if (a2 > 0) return 'A2';
    return 'A1';
  }

  function _skillFromBandCorrect(byBand, band) {
    var diffs = byBand[band].diffs;
    if (!diffs.length) return 1;
    var sum = diffs.reduce(function (s, d) { return s + d; }, 0);
    return _clamp(sum / diffs.length, 1, 10);
  }

  function _afterPhaseA(p, answers) {
    var a1Probes = answers.slice(0, 4);
    if (a1Probes.length >= 4 && a1Probes.every(function (a) { return !a.correct; })) {
      p.cefrBand = 'A1';
      p.skillLevel = 1;
      p.evaluationStage = 3;
      p.learningPhase = 'active';
      _phaseAEarlyExit = true;
      return;
    }

    var byBand = _bandProbeResults(answers);
    p.cefrBand = _assignBandFromProbes(byBand);
    p.skillLevel = _skillFromBandCorrect(byBand, p.cefrBand);
    if (p.skillLevel <= 1 && answers.some(function (a) { return a.correct; })) {
      var correct = answers.filter(function (a) { return a.correct; });
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
    p.learningPhase = 'active';
  }

  function _phaseBSlots(p) {
    var band = p.cefrBand || 'A1';
    var S = _clamp(Math.round(p.skillLevel), 1, 10);
    var prev = PREV_BAND[band];
    var next = NEXT_BAND[band];
    var slots = [];

    if (prev) {
      slots.push({ band: prev, diff: _clamp(S + 6, 8, 10), label: 'crossdown' });
      slots.push({ band: prev, diff: 9, label: 'crossdown' });
    }
    slots.push({ band: band, diff: _clamp(S - 1, 1, 10), label: 'home' });
    slots.push({ band: band, diff: _clamp(S - 1, 1, 10), label: 'home' });
    slots.push({ band: band, diff: S, label: 'home' });
    slots.push({ band: band, diff: S, label: 'home' });
    slots.push({ band: band, diff: S, label: 'home' });
    slots.push({ band: band, diff: _clamp(S + 1, 1, 10), label: 'home' });
    slots.push({ band: band, diff: _clamp(S + 1, 1, 10), label: 'home' });
    if (next) {
      slots.push({ band: next, diff: 3, label: 'crossup' });
      slots.push({ band: next, diff: 4, label: 'explore' });
    } else {
      slots.push({ band: band, diff: _clamp(S + 2, 1, 10), label: 'explore' });
    }

    while (slots.length < QUIZ_LEN) slots.push({ band: band, diff: S, label: 'home' });
    return _shuffle(slots).slice(0, QUIZ_LEN);
  }

  function _buildPhaseB(all, p) {
    var selected = [];
    var usedIds = {};
    var rw = p.recentWords || [];
    var numberUsed = 0;
    _phaseBSlots(p).forEach(function (slot) {
      var pool = _available(all, usedIds);
      var w = null;
      if (slot.label === 'explore') {
        w = _exploration(_filterByBand(pool, slot.band), rw, p.skillLevel, p.cefrBand);
      } else {
        w = _pickForCalibration(all, usedIds, rw, slot.band, slot.diff, numberUsed);
      }
      if (!w) w = _fallback(_filterByBand(pool, slot.band), usedIds, rw);
      if (!w) w = _fallback(pool, usedIds, rw);
      if (w) {
        if (_isNumberRow(w)) numberUsed++;
        usedIds[w.id] = true;
        selected.push(w);
      }
    });
    while (selected.length < QUIZ_LEN) {
      var extra = _fallback(_available(all, usedIds), usedIds, rw);
      if (!extra) break;
      usedIds[extra.id] = true;
      selected.push(extra);
    }
    return selected.slice(0, QUIZ_LEN);
  }

  function _afterPhaseB(p, answers) {
    var homeBand = p.cefrBand || 'A1';
    var home = answers.filter(function (a) { return (a.cefrBand || window._v2BandFromId(a.wordId)) === homeBand; });
    var cross = answers.filter(function (a) { return (a.cefrBand || window._v2BandFromId(a.wordId)) !== homeBand; });
    var homeAcc = home.length ? home.filter(function (a) { return a.correct; }).length / home.length : 0;
    var crossAcc = cross.length ? cross.filter(function (a) { return a.correct; }).length / cross.length : 0;

    var correct = answers.filter(function (a) { return a.correct; });
    var homeCorrect = correct.filter(function (a) { return (a.cefrBand || window._v2BandFromId(a.wordId)) === homeBand; });
    var avg = homeCorrect.length
      ? homeCorrect.reduce(function (s, a) { return s + a.difficulty; }, 0) / homeCorrect.length
      : (correct.length ? correct.reduce(function (s, a) { return s + a.difficulty; }, 0) / correct.length : 1);
    p.skillLevel = _clamp((p.skillLevel + avg) / 2, 1, 10);

    if (crossAcc >= 0.8 && NEXT_BAND[homeBand]) p.cefrBand = NEXT_BAND[homeBand];
    else if (homeAcc < 0.3 && PREV_BAND[homeBand]) p.cefrBand = PREV_BAND[homeBand];

    p.evaluationStage = 3;
    p.learningPhase = 'active';
  }

  function _classifyWords(all, p, bandFilter) {
    var struggling = [];
    var learning = [];
    var stable = [];
    all.forEach(function (row) {
      if (bandFilter && window._v2BandFromId(row.id) !== bandFilter) return;
      var w = _readWordStat(p, row.id);
      var diff = parseInt(row.difficulty, 10) || 5;
      var item = {
        id: row.id, row: row, failScore: w.failScore, lastSeenQuiz: w.lastSeenQuiz,
        seenCount: w.seenCount, correctCount: w.correctCount, difficulty: diff,
        accuracy: w.seenCount ? w.correctCount / w.seenCount : 0
      };
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
    var ranked = learning.slice().sort(function (a, b) {
      var da = Math.abs(a.difficulty - si);
      var db = Math.abs(b.difficulty - si);
      return da - db || _compareCandidates(a, b);
    });
    return _shuffle(ranked.slice(0, Math.min(40, ranked.length)));
  }

  function _pickLearningRows(all, p, skill, band, count, usedIds, crossCount) {
    crossCount = crossCount || 0;
    var homeBand = band || p.cefrBand || 'A1';
    var next = NEXT_BAND[homeBand];
    var picked = [];
    var homePool = _filterByBand(all, homeBand);

    function tryPick(pool, n) {
      for (var widen = 0; widen <= 3 && picked.length < n; widen++) {
        var candidates = pool.filter(function (r) {
          if (usedIds[r.id]) return false;
          if (!_isUnseen(p, r.id)) return false;
          return Math.abs(parseInt(r.difficulty, 10) - skill) <= widen + 1;
        });
        while (candidates.length && picked.length < n) {
          var w = _pickUnseen(candidates, p, {});
          if (!w) break;
          usedIds[w.id] = true;
          picked.push(w);
          candidates = candidates.filter(function (r) { return r.id !== w.id; });
        }
      }
      if (picked.length < n) {
        var any = _pickUnseen(_available(_filterByBand(pool, homeBand), usedIds), p, {});
        if (any && picked.length < n) { usedIds[any.id] = true; picked.push(any); }
      }
    }

    var homeCount = Math.max(0, count - crossCount);
    tryPick(homePool, homeCount);

    if (crossCount > 0 && next) {
      var crossPool = _filterByBand(all, next).filter(function (r) {
        var d = parseInt(r.difficulty, 10);
        return d >= 2 && d <= 5;
      });
      for (var i = 0; i < crossCount && picked.length < count; i++) {
        var cw = _pickUnseen(_available(crossPool, usedIds), p, {}) ||
          _byDifficulty(_available(crossPool, usedIds), 3, p.recentWords);
        if (cw) { usedIds[cw.id] = true; picked.push(cw); }
      }
    }

    return picked;
  }

  function _bandHasUnseen(all, p, band) {
    return _filterByBand(all, band).some(function (r) { return _isUnseen(p, r.id); });
  }

  function _countUnseenInBand(all, p, band) {
    return _filterByBand(all, band).filter(function (r) { return _isUnseen(p, r.id); }).length;
  }

  function _shouldPrioritizeGlobalUnseen(p) {
    var band = p.cefrBand || 'A1';
    var skill = Number(p.skillLevel) || 1;
    if (band === 'B1' && skill >= 4) return true;
    if (band === 'A2' && skill >= 6) return true;
    if (band === 'A1' && skill >= 8) return true;
    if (p.learningPhase === 'band_review') return true;
    return false;
  }

  function _pickUnseenByBandPriority(all, p, usedIds, count, bandOrder) {
    var picked = [];
    bandOrder = bandOrder || ['B1', 'A2', 'A1'];
    bandOrder.forEach(function (band) {
      while (picked.length < count) {
        var pool = _available(_filterByBand(all, band), usedIds);
        var w = _pickUnseen(pool, p, {});
        if (!w) break;
        usedIds[w.id] = true;
        picked.push(w);
      }
    });
    while (picked.length < count) {
      var any = _pickUnseen(_available(all, usedIds), p, {});
      if (!any) break;
      usedIds[any.id] = true;
      picked.push(any);
    }
    return picked;
  }

  function _placementUncertainty(p) {
    var stage = Number(p.evaluationStage) || 0;
    if (stage === 0) return 1;
    if (stage === 1) return 0.78;
    var quizzes = (p.quizStats && p.quizStats.adaptive && p.quizStats.adaptive.quizzesCompleted) || 0;
    var u = 0.65;
    if (quizzes >= 2) u = 0.5;
    if (quizzes >= 5) u = 0.38;
    if (quizzes >= 12) u = 0.26;
    if (quizzes >= 25) u = 0.16;
    var seenWords = 0;
    Object.keys(p.words || {}).forEach(function (id) {
      if ((p.words[id].seenCount || 0) > 0) seenWords++;
    });
    if (seenWords < 25) u = Math.max(u, 0.55);
    else if (seenWords < 80) u = Math.max(u, 0.35);
    var acc = Number(p.lastQuizAccuracy);
    if (!isNaN(acc)) {
      if (acc < 0.45) u = Math.min(1, u + 0.3);
      else if (acc < 0.6) u = Math.min(1, u + 0.15);
      else if (acc >= 0.8) u = Math.max(0.12, u - 0.08);
    }
    return _clamp(u, 0.1, 1);
  }

  function _crossBandSlotCount(p) {
    if (p.learningPhase !== 'active') return 0;
    var band = p.cefrBand || 'A1';
    if (!NEXT_BAND[band]) return 0;
    var skill = p.skillLevel;
    if (skill >= 9) return 2;
    if (skill >= 7) return 1;
    return 0;
  }

  function _buildNormalRows(all, p) {
    var band = p.cefrBand || 'A1';
    var skill = p.skillLevel;
    var usedIds = {};
    var selected = [];
    var prioritizeUnseen = _shouldPrioritizeGlobalUnseen(p);

    if (prioritizeUnseen) {
      var pools = _classifyWords(all, p, null);
      function takeFromRanked(ranked, count) {
        var picked = [];
        for (var i = 0; i < ranked.length && picked.length < count; i++) {
          if (usedIds[ranked[i].id]) continue;
          usedIds[ranked[i].id] = true;
          picked.push(ranked[i].row);
        }
        return picked;
      }
      selected = selected.concat(takeFromRanked(pools.struggling, 2));
      selected = selected.concat(_pickUnseenByBandPriority(all, p, usedIds, 5, ['B1', 'A2', 'A1']));
      if (_countUnseenInBand(all, p, 'B1') + _countUnseenInBand(all, p, 'A2') + _countUnseenInBand(all, p, 'A1') === 0) {
        selected = selected.concat(takeFromRanked(pools.stable, 1));
      }
      var confBand = band === 'A1' && skill >= 8 ? 'A2' : band;
      var confidencePool = _deprioritizeNumbers(_available(_filterByBand(all, confBand), usedIds), true);
      var confidence = _byDifficulty(confidencePool, _clamp(skill - 1.5, 1, 10), p.recentWords) ||
        _nearestDifficulty(confidencePool, skill);
      if (confidence) { usedIds[confidence.id] = true; selected.push(confidence); }
      var explore = _pickUnseen(_available(_filterByBand(all, 'B1'), usedIds), p, {}) ||
        _pickUnseen(_available(_filterByBand(all, 'A2'), usedIds), p, {}) ||
        _byDifficulty(_available(_filterByBand(all, band), usedIds), _clamp(skill + 1, 1, 10), p.recentWords);
      if (explore) { usedIds[explore.id] = true; selected.push(explore); }
      while (selected.length < QUIZ_LEN) {
        var fb = _pickUnseen(_available(all, usedIds), p, {}) ||
          _fallback(_available(all, usedIds), usedIds, p.recentWords);
        if (!fb) break;
        usedIds[fb.id] = true;
        selected.push(fb);
      }
      return _shuffle(selected).slice(0, QUIZ_LEN);
    }

    var crossSlots = _crossBandSlotCount(p);
    var exploreIsCross = crossSlots >= 1;
    var pools = _classifyWords(all, p, band);

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

    var learnCross = crossSlots >= 2 ? 1 : 0;
    var learningRows = _pickLearningRows(all, p, skill, band, 3, usedIds, learnCross);
    selected = selected.concat(learningRows);

    selected = selected.concat(takeFromRanked(pools.stable, 2));

    var confidenceTarget = _clamp(skill - 1.5, 1, 10);
    var confidencePool = _deprioritizeNumbers(_available(_filterByBand(all, band), usedIds), true);
    var confidence = _byDifficulty(confidencePool, confidenceTarget, p.recentWords) ||
      _nearestDifficulty(confidencePool, confidenceTarget);
    if (confidence) { usedIds[confidence.id] = true; selected.push(confidence); }

    var explore = null;
    if (exploreIsCross && NEXT_BAND[band]) {
      var next = NEXT_BAND[band];
      var crossPool = _deprioritizeNumbers(_available(_filterByBand(all, next), usedIds), true);
      explore = _pickUnseen(crossPool, p, {}) ||
        _byDifficulty(crossPool, _clamp(skill - 5, 2, 5), p.recentWords) ||
        _nearestDifficulty(crossPool, 3);
    } else {
      var exploreTarget = _clamp(skill + 2, 1, 10);
      var explorePool = _deprioritizeNumbers(_available(_filterByBand(all, band), usedIds), true);
      explore = _pickUnseen(explorePool.filter(function (r) {
        return Math.abs(parseInt(r.difficulty, 10) - exploreTarget) <= 2;
      }), p, {}) ||
        _byDifficulty(explorePool, exploreTarget, p.recentWords) ||
        _nearestDifficulty(explorePool, exploreTarget);
    }
    if (explore) { usedIds[explore.id] = true; selected.push(explore); }

    while (selected.length < QUIZ_LEN) {
      var fb = _pickUnseen(_available(_filterByBand(all, band), usedIds), p, {}) ||
        _fallback(_available(_filterByBand(all, band), usedIds), usedIds, p.recentWords) ||
        _fallback(_available(all, usedIds), usedIds, p.recentWords);
      if (!fb) break;
      usedIds[fb.id] = true;
      selected.push(fb);
    }

    return _shuffle(selected).slice(0, QUIZ_LEN);
  }

  function _bandCoverage(all, p, band) {
    var bw = _filterByBand(all, band);
    if (!bw.length) return 1;
    var seen = bw.filter(function (r) { return _hasExposure(p, r.id); }).length;
    return seen / bw.length;
  }

  function _globalCoverage(all, p) {
    if (!all.length) return 1;
    var seen = all.filter(function (r) { return _hasExposure(p, r.id); }).length;
    return seen / all.length;
  }

  function _buildBandReviewRows(all, p) {
    var usedIds = {};
    var selected = [];
    var pools = _classifyWords(all, p, null);

    function take(ranked, n) {
      var picked = [];
      for (var j = 0; j < ranked.length && picked.length < n; j++) {
        if (usedIds[ranked[j].id]) continue;
        usedIds[ranked[j].id] = true;
        picked.push(ranked[j].row);
      }
      return picked;
    }

    var unseenLeft = _countUnseenInBand(all, p, 'B1') +
      _countUnseenInBand(all, p, 'A2') + _countUnseenInBand(all, p, 'A1');

    selected = selected.concat(take(pools.struggling, 2));
    selected = selected.concat(_pickUnseenByBandPriority(all, p, usedIds, unseenLeft > 0 ? 5 : 2, ['B1', 'A2', 'A1']));

    if (unseenLeft === 0) {
      var lowAccB1 = pools.stable.filter(function (it) {
        return window._v2BandFromId(it.id) === 'B1' && it.accuracy < 0.7;
      }).sort(_compareCandidates);
      selected = selected.concat(take(lowAccB1, 2));
    }

    var confPool = _available(_filterByBand(all, 'B1'), usedIds);
    var conf = _byDifficulty(confPool, _clamp(p.skillLevel - 1.5, 1, 10), p.recentWords);
    if (conf) { usedIds[conf.id] = true; selected.push(conf); }

    if (unseenLeft === 0) {
      var reactPool = _available(all.filter(function (r) {
        var b = window._v2BandFromId(r.id);
        return (b === 'A2' || b === 'A1') && parseInt(r.difficulty, 10) >= 8;
      }), usedIds);
      var react = _byDifficulty(reactPool, 9, p.recentWords) || _fallback(reactPool, usedIds, p.recentWords);
      if (react) { usedIds[react.id] = true; selected.push(react); }
    } else {
      var explore = _pickUnseen(_available(_filterByBand(all, 'B1'), usedIds), p, {}) ||
        _byDifficulty(_available(_filterByBand(all, 'B1'), usedIds), 10, p.recentWords);
      if (explore) { usedIds[explore.id] = true; selected.push(explore); }
    }

    while (selected.length < QUIZ_LEN) {
      var fb = _pickUnseen(_available(all, usedIds), p, {}) ||
        _fallback(_available(all, usedIds), usedIds, p.recentWords);
      if (!fb) break;
      usedIds[fb.id] = true;
      selected.push(fb);
    }
    return _shuffle(selected).slice(0, QUIZ_LEN);
  }

  function _buildChallengeRows(all, p) {
    var usedIds = {};
    var selected = [];
    var pools = _classifyWords(all, p, null);

    function take(ranked, n) {
      var picked = [];
      for (var i = 0; i < ranked.length && picked.length < n; i++) {
        if (usedIds[ranked[i].id]) continue;
        usedIds[ranked[i].id] = true;
        picked.push(ranked[i].row);
      }
      return picked;
    }

    selected = selected.concat(take(pools.struggling, 3));

    for (var u = 0; u < 3; u++) {
      var un = _pickUnseen(_available(all, usedIds), p, {});
      if (!un) break;
      usedIds[un.id] = true;
      selected.push(un);
    }

    var stableSorted = pools.stable.slice().sort(function (a, b) {
      return (Number(a.lastSeenQuiz) || 0) - (Number(b.lastSeenQuiz) || 0);
    });
    selected = selected.concat(take(stableSorted, 2));

    var conf = _byDifficulty(_available(_filterByBand(all, 'B1'), usedIds), _clamp(p.skillLevel - 2, 1, 10), p.recentWords);
    if (conf) { usedIds[conf.id] = true; selected.push(conf); }

    var unseenHard = all.filter(function (r) { return _isUnseen(p, r.id); }).sort(function (a, b) {
      return parseInt(b.difficulty, 10) - parseInt(a.difficulty, 10);
    });
    var ex = unseenHard.length ? _shuffle(unseenHard)[0] :
      _byDifficulty(_available(all, usedIds), 10, p.recentWords) ||
      _fallback(_available(all, usedIds), usedIds, p.recentWords);
    if (ex) { usedIds[ex.id] = true; selected.push(ex); }

    while (selected.length < QUIZ_LEN) {
      var fb = _fallback(_available(all, usedIds), usedIds, p.recentWords);
      if (!fb) break;
      usedIds[fb.id] = true;
      selected.push(fb);
    }
    return _shuffle(selected).slice(0, QUIZ_LEN);
  }

  function _buildQueue() {
    var p = _get();
    var all = _allWords();
    if (!all.length) return [];
    _migrateProgress(p, all);
    var stage = p.evaluationStage;
    var rows;
    if (stage === 0) rows = _buildPhaseA(all, p);
    else if (stage === 1) rows = _buildPhaseB(all, p);
    else if (p.learningPhase === 'band_review') rows = _buildBandReviewRows(all, p);
    else if (p.learningPhase === 'challenge') rows = _buildChallengeRows(all, p);
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
    w.adaptiveSeenCount = (Number(w.adaptiveSeenCount) || 0) + 1;
    w.lastSeenQuiz = _quizCounter;
    if (correct) {
      w.correctCount++;
      w.failScore = Math.max(0, w.failScore - 1);
    } else {
      w.failScore += 2;
    }
  }

  function _themeStatKey(categoryId) {
    if (typeof window._categorySlug === 'function') {
      return window._categorySlug(categoryId);
    }
    return String(categoryId || 'theme');
  }

  function _normalizeThemeStatEntry(entry) {
    entry = (entry && typeof entry === 'object') ? entry : {};
    return {
      quizzesCompleted: Number(entry.quizzesCompleted) || 0,
      correctAnswers: Number(entry.correctAnswers) || 0,
      incorrectAnswers: Number(entry.incorrectAnswers) || 0,
      studyTimeSeconds: Number(entry.studyTimeSeconds) || 0,
      seenWordIds: Array.isArray(entry.seenWordIds) ? entry.seenWordIds.map(String) : [],
      themeRecentWords: Array.isArray(entry.themeRecentWords) ? entry.themeRecentWords.map(String) : [],
      lastSeenAt: Number(entry.lastSeenAt) || 0
    };
  }

  function _updateThemeRecentWords(themeEntry, wordIds) {
    themeEntry = _normalizeThemeStatEntry(themeEntry);
    var rw = themeEntry.themeRecentWords.slice();
    (wordIds || []).forEach(function (id) {
      id = String(id);
      if (!id) return;
      var i = rw.indexOf(id);
      if (i !== -1) rw.splice(i, 1);
      rw.push(id);
    });
    themeEntry.themeRecentWords = rw.slice(-RECENT_LIMIT);
    return themeEntry;
  }

  function _applyThemeWordResults(p, answers) {
    if (answers.length) _quizCounter++;
    answers.forEach(function (a) {
      var w = _wordStat(p, a.wordId);
      w.seenCount++;
      w.themeSeenCount = (Number(w.themeSeenCount) || 0) + 1;
      w.lastSeenQuiz = _quizCounter;
      if (a.correct) {
        w.correctCount++;
        w.failScore = Math.max(0, w.failScore - 1);
      } else {
        w.failScore += 2;
      }
    });
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

  function _applyNormalFormula(p, answers) {
    var accuracy = answers.length ? answers.filter(function (a) { return a.correct; }).length / answers.length : 0;
    p.skillLevel = _clamp(p.skillLevel + (accuracy - 0.65) * 0.6, 1, 10);
  }

  function _logCrossBand(p, answers) {
    var home = p.cefrBand || 'A1';
    if (!p.crossBandLog) p.crossBandLog = [];
    answers.forEach(function (a) {
      var b = a.cefrBand || window._v2BandFromId(a.wordId);
      if (b !== home) {
        p.crossBandLog.push({ correct: !!a.correct, band: b, t: Date.now() });
      }
    });
    if (p.crossBandLog.length > 40) p.crossBandLog = p.crossBandLog.slice(-40);
  }

  function _crossBandAccuracy(p) {
    var log = p.crossBandLog || [];
    if (log.length < 20) return null;
    var recent = log.slice(-20);
    var correct = recent.filter(function (e) { return e.correct; }).length;
    return correct / recent.length;
  }

  function _applyBandProgression(p, answers) {
    if (p.learningPhase !== 'active') return;
    var home = p.cefrBand || 'A1';
    var next = NEXT_BAND[home];
    if (!next) return;

    _logCrossBand(p, answers);
    var crossAcc = _crossBandAccuracy(p);
    if (p.skillLevel >= 9 && crossAcc != null && crossAcc >= 0.7) {
      p.cefrBand = next;
      var crossAnswers = answers.filter(function (a) {
        return (a.cefrBand || window._v2BandFromId(a.wordId)) === next;
      });
      var crossCorrect = crossAnswers.filter(function (a) { return a.correct; });
      if (crossCorrect.length) {
        var avg = crossCorrect.reduce(function (s, a) { return s + a.difficulty; }, 0) / crossCorrect.length;
        p.skillLevel = _clamp(2 + avg * 0.35, 3, 5);
      } else {
        p.skillLevel = 4;
      }
      p.crossBandLog = [];
    }
  }

  function _checkPhaseTransitions(p, all, answers) {
    var accuracy = answers.length ? answers.filter(function (a) { return a.correct; }).length / answers.length : 0;

    if (p.learningPhase === 'active' && p.cefrBand === 'B1' && p.skillLevel >= 9) {
      if (_bandCoverage(all, p, 'B1') >= 0.85) {
        p.learningPhase = 'band_review';
      }
    }

    if (p.learningPhase === 'band_review') {
      var globalCov = _globalCoverage(all, p);
      var b1UnseenPct = 1 - _bandCoverage(all, p, 'B1');
      if ((globalCov >= 0.95 || b1UnseenPct < 0.03) && accuracy >= 0.65) {
        p.learningPhase = 'challenge';
        p.challengeLowStreak = 0;
      }
    }

    if (p.learningPhase === 'challenge') {
      if (accuracy < 0.45) p.challengeLowStreak = (p.challengeLowStreak || 0) + 1;
      else p.challengeLowStreak = 0;
      if (p.challengeLowStreak >= 3) {
        p.learningPhase = 'band_review';
        p.challengeLowStreak = 0;
      }
    }
  }

  function _processResults(answers) {
    var p = _get();
    var all = _allWords();
    _phaseAEarlyExit = false;
    var accuracy = answers.length ? answers.filter(function (a) { return a.correct; }).length / answers.length : 0;
    p.lastQuizAccuracy = accuracy;
    answers.forEach(function (a) { _updateWord(p, a.wordId, a.correct); });
    _updateRecent(p, answers.map(function (a) { return a.wordId; }));
    var stage = _stageAtStart;
    if (stage === 0) _afterPhaseA(p, answers);
    else if (stage === 1) _afterPhaseB(p, answers);
    else {
      _applyNormalFormula(p, answers);
      _applyBandProgression(p, answers);
      _checkPhaseTransitions(p, all, answers);
    }
    _save(p);
    _progress = p;
  }

  function _badgeText() {
    var p = _get();
    if (p.evaluationStage === 0) return t('adaptiveV2StatusCal1');
    if (p.evaluationStage === 1) return t('adaptiveV2StatusCal2');
    if (p.learningPhase === 'band_review') return t('adaptiveV2PhaseReview');
    if (p.learningPhase === 'challenge') return t('adaptiveV2PhaseChallenge');
    return '';
  }

  function _updateHomeBadge() {
    var statusEl = document.getElementById('adaptive-v2-banner-status');
    if (!statusEl) return;
    var text = _badgeText();
    statusEl.textContent = (typeof formatNumStr === 'function') ? formatNumStr(text) : text;
    statusEl.style.display = text ? '' : 'none';
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
      var msg = t('errLoadQuiz');
      if (window.location.protocol === 'file:') msg += t('errFileProtocol');
      alert(msg);
      _active = false;
      return;
    }

    _migrateProgress(_get(), _allWords());
    var cards = _buildQueue();
    ov.classList.remove('active');

    if (!cards.length) {
      alert(t('errNoWords'));
      _active = false;
      return;
    }

    currentLevel = 'ALL';
    currentThemeCategoryId = 0;
    queue = cards;
    idx = 0; ok = 0; no = 0;
    _quizReturnScreen = 'screen-levels';

    window.umami?.track('adaptive_v2_started', {
      stage: _stageAtStart, skill: p.skillLevel, band: p.cefrBand, phase: p.learningPhase
    });
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
      alert(t('errLoadQuiz'));
      _active = false;
      return;
    }

    var all = _allWords();
    var cards = _makeCards((rows || []).slice(0, QUIZ_LEN), all);
    ov.classList.remove('active');

    if (!cards.length) {
      alert(t('errNoWords'));
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

  window._adaptiveV2RecordQuizStats = function (payload) {
    if (_accountMode || !payload) return;
    var p = _get();
    p.quizStats = _normalizeQuizStats(p.quizStats);
    p.quizStats.adaptive = _incrementQuizStats(p.quizStats.adaptive, payload);
    _save(p);
    _progress = p;
  };

  window._adaptiveV2BuildQueue = function () {
    return _buildQueue();
  };

  window._adaptiveV2ProcessResults = function (answers, opts) {
    answers = answers || [];
    if (!answers.length) return;
    opts = opts || {};
    var savedStage = _stageAtStart;
    if (opts.forceActive) _stageAtStart = 3;
    if (opts.rush) _quizCounter++;
    _processResults(answers);
    _stageAtStart = savedStage;
    _updateHomeBadge();
    if (typeof window._isStatsTabVisible === 'function' && window._isStatsTabVisible() &&
        typeof window.renderLearningProfile === 'function') {
      window.renderLearningProfile();
    }
  };

  window._adaptiveV2RecordRushCheckpoint = function (payload) {
    if (!payload) return;
    var p = _get();
    p.quizStats = _normalizeQuizStats(p.quizStats);
    p.quizStats.adaptive = _incrementQuizStats(p.quizStats.adaptive, payload);
    var rush = p.quizStats.rush;
    var correct = Number(payload.correctAnswers) || 0;
    var incorrect = Number(payload.incorrectAnswers) || 0;
    var timeSec = Number(payload.studyTimeSeconds) || 0;
    rush.totalQuestions += correct + incorrect;
    rush.totalCorrect += correct;
    rush.totalStudyTimeSeconds += timeSec;
    p.quizStats.rush = rush;
    _save(p);
    _progress = p;
  };

  window._adaptiveV2FinalizeRushSession = function (session) {
    session = session || {};
    var p = _get();
    p.quizStats = _normalizeQuizStats(p.quizStats);
    var rush = p.quizStats.rush;
    var totalQ = Number(session.totalQuestions) || 0;
    var correct = Number(session.correctAnswers) || 0;
    var timeSec = Number(session.studyTimeSeconds) || 0;
    if (totalQ > 0) {
      rush.sessionsCompleted += 1;
      var acc = Math.round(correct / totalQ * 100);
      if (totalQ > rush.bestSessionQuestions) rush.bestSessionQuestions = totalQ;
      if (acc > rush.bestSessionAccuracy) rush.bestSessionAccuracy = acc;
      if (timeSec > rush.longestSessionSeconds) rush.longestSessionSeconds = timeSec;
    }
    p.quizStats.rush = rush;
    _save(p);
    _progress = p;
  };

  window._adaptiveV2IsCalibrated = function () {
    return (Number(_get().evaluationStage) || 0) >= 3;
  };

  window._adaptiveV2IsActive = function () { return _active; };

  window._adaptiveV2ApplyThemeResults = function (answers, payload) {
    if (!payload || !payload.categoryId) return null;
    answers = answers || [];
    var p = _get();
    var before = {
      skillLevel: p.skillLevel,
      cefrBand: p.cefrBand,
      evaluationStage: p.evaluationStage
    };
    if (answers.length) _applyThemeWordResults(p, answers);
    p.quizStats = _normalizeQuizStats(p.quizStats);
    var catKey = _themeStatKey(payload.categoryId);
    var themeEntry = _normalizeThemeStatEntry(p.quizStats.theme[catKey]);
    themeEntry = _incrementQuizStats(themeEntry, payload);
    if (answers.length) {
      var seenSet = {};
      themeEntry.seenWordIds.forEach(function (id) { seenSet[id] = true; });
      var recentIds = [];
      answers.forEach(function (a) {
        if (a && a.wordId) {
          seenSet[String(a.wordId)] = true;
          recentIds.push(String(a.wordId));
        }
      });
      themeEntry.seenWordIds = Object.keys(seenSet);
      themeEntry = _updateThemeRecentWords(themeEntry, recentIds);
    }
    themeEntry.lastSeenAt = Date.now();
    p.quizStats.theme[catKey] = themeEntry;
    _save(p);
    _progress = p;
    _updateHomeBadge();
    if (typeof window._isStatsTabVisible === 'function' && window._isStatsTabVisible() &&
        typeof window.renderLearningProfile === 'function') {
      window.renderLearningProfile();
    }
    return before;
  };

  window._adaptiveV2ReadWordStat = function (progress, id) {
    progress = progress || _get();
    return _readWordStat(progress, id);
  };

  window._adaptiveV2ResetProgress = function () {
    var fresh = _initProgress();
    _progress = fresh;
    _pendingProgress = null;
    if (!_accountMode) {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      _saveToLocal(fresh);
    }
    if (typeof _externalSaveFn === 'function') _externalSaveFn(fresh);
    _updateHomeBadge();
    return fresh;
  };

  window._adaptiveV2JourneyVisual = function () {
    var p = _get();
    var all = _allWords();
    var bands = ['A1', 'A2', 'B1'];
    var stage = Number(p.evaluationStage) || 0;
    if (!all.length) {
      return {
        segments: bands.map(function (b) { return { band: b, coverage: 0 }; }),
        markerLo: 1, markerHi: 99, markerCenter: 50,
        cefrBand: p.cefrBand || 'A1', skillLevel: Number(p.skillLevel) || 1,
        uncertainty: 1
      };
    }
    var segments = bands.map(function (b) {
      var bw = _filterByBand(all, b);
      var seen = bw.filter(function (r) { return _hasExposure(p, r.id); }).length;
      return { band: b, coverage: bw.length ? seen / bw.length : 0 };
    });
    var bandIdx = bands.indexOf(p.cefrBand || 'A1');
    if (bandIdx < 0) bandIdx = 0;
    var skill = _clamp(Number(p.skillLevel) || 1, 1, 10);
    var segW = 100 / 3;
    var within = (skill - 1) / 9;
    var center = bandIdx * segW + within * segW + segW * 0.05;
    var uncertainty = _placementUncertainty(p);

    if (stage === 0) {
      return {
        segments: segments,
        markerLo: 1,
        markerHi: 99,
        markerCenter: 50,
        cefrBand: p.cefrBand || 'A1',
        skillLevel: skill,
        uncertainty: 1
      };
    }

    var rangeHalf = (segW * 0.52) * uncertainty;
    if (stage === 1) rangeHalf = Math.max(rangeHalf, segW * 0.35);

    return {
      segments: segments,
      markerLo: Math.max(0, center - rangeHalf),
      markerHi: Math.min(100, center + rangeHalf),
      markerCenter: center,
      cefrBand: p.cefrBand || 'A1',
      skillLevel: skill,
      uncertainty: uncertainty
    };
  };

  window._adaptiveV2BandCoverage = function () {
    var p = _get();
    var all = _allWords();
    if (!all.length) return { band: 0, global: 0 };
    var band = p.cefrBand || 'A1';
    return {
      band: Math.round(_bandCoverage(all, p, band) * 100),
      global: Math.round(_globalCoverage(all, p) * 100)
    };
  };

  var _origRenderCard = window.renderCard;
  window.renderCard = function () {
    _origRenderCard();
    if (_active) {
      var mb = document.getElementById('tmode-badge');
      if (mb) {
        mb.textContent = t('adaptiveV2Badge');
        mb.className = 'tmode-badge glass glass-pill glass-chrome grammar';
      }
      var tl = document.getElementById('tlevel');
      if (tl) {
        var p = _get();
        var label = p.cefrBand || 'ALL';
        if (p.learningPhase === 'band_review') label = t('adaptiveV2ReviewLabel');
        else if (p.learningPhase === 'challenge') label = t('adaptiveV2ChallengeLabel');
        tl.textContent = t('levelLabel') + ' ' + label;
      }
    }
  };

  var _origPick = window.pick;
  window.pick = function (btn, selectedId, correctId) {
    _origPick(btn, selectedId, correctId);
    if (_active) {
      var card = queue[idx];
      var diff = parseInt((card && card._row && card._row.difficulty) || '5', 10) || 5;
      var p = _get();
      var wordBand = window._v2BandFromId(correctId);
      _answers.push({
        wordId: correctId,
        difficulty: diff,
        correct: selectedId === correctId,
        position: idx,
        cefrBand: wordBand,
        isCrossBand: wordBand !== (p.cefrBand || 'A1')
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
      if (typeof window._isStatsTabVisible === 'function' && window._isStatsTabVisible() &&
          typeof window.renderLearningProfile === 'function') {
        window.renderLearningProfile();
      }
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
    _pendingProgress = _migrateProgress(p, null);
    _progress = null;
  };

  window._adaptiveV2SetAccountMode = function (on) {
    _accountMode = !!on;
    _progress = null;
    _pendingProgress = null;
  };

  window._adaptiveV2SetSaveHook = function (fn) { _externalSaveFn = fn; };
  window._adaptiveV2RefreshBadge = _updateHomeBadge;
  window._adaptiveV2HasMeaningfulProgress = _hasMeaningfulProgress;
  window._adaptiveV2ReadGuestProgress = _loadFromLocal;
  window._adaptiveV2ClearGuestProgress = function () {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  };
  window._adaptiveV2MigrateProgress = function (p) {
    return _migrateProgress(p, null);
  };
  window._adaptiveV2GetProgress = function () {
    return _deepCopyProgress(_get());
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



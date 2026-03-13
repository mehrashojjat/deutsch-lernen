// ══════════════════════════════════════════════════════════════════
//  ADAPTIVE VOCABULARY QUIZ SYSTEM
//  Depends on: app.js (CSV_QUIZ_DATA, _loadCSVLevel, queue, idx,
//              ok, no, currentLevel, renderCard, pick, showResults,
//              restartLevel, goHome, show)
// ══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var STORAGE_KEY  = 'deutsch_adaptive_progress';
  var RECENT_LIMIT = 25;

  // ── External persistence hooks (set by auth.js) ───────────────
  var _pendingProgress = null;
  var _externalSaveFn  = null;

  // ── State ──────────────────────────────────────────────────────
  var _active       = false;   // true while an adaptive quiz is running
  var _progress     = null;    // cached progress object
  var _answers      = [];      // { wordId, difficulty, correct, position }
  var _stageAtStart = 0;       // evaluationStage value when this quiz began

  // ── Persistence ────────────────────────────────────────────────
  function _load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
  }
  function _save(p) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) {}
    if (typeof _externalSaveFn === 'function') _externalSaveFn(p);
  }
  function _initProgress() {
    return { evaluationStage: 0, skillLevel: 1, words: {}, recentWords: [] };
  }
  function _get() {
    if (!_progress) {
      if (_pendingProgress) { _progress = _pendingProgress; _pendingProgress = null; }
      else { _progress = _load() || _initProgress(); }
    }
    return _progress;
  }

  // ── Math helpers ───────────────────────────────────────────────
  function _clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function _shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ── Vocabulary pool (scoped to selected level) ─────────────────
  function _allWords(lv) {
    var pool = (typeof CSV_QUIZ_DATA !== 'undefined' && CSV_QUIZ_DATA[lv]) || [];
    var out = [];
    pool.forEach(function (r) {
      var d = parseInt(r.difficulty);
      if (d >= 1 && d <= 10) out.push(r);
    });
    return out;
  }

  // ── Selection helpers ──────────────────────────────────────────

  // Remove words already chosen for this quiz
  function _available(pool, usedIds) {
    return pool.filter(function (r) { return !usedIds[r.id]; });
  }

  // Pick a random word at exactly the given difficulty; prefer words not seen recently
  function _byDifficulty(pool, diff, recentWords) {
    var d   = _clamp(Math.round(diff), 1, 10);
    var rSet = {};
    (recentWords || []).forEach(function (id) { rSet[id] = true; });
    var at    = pool.filter(function (r) { return parseInt(r.difficulty) === d; });
    var fresh = at.filter(function (r) { return !rSet[r.id]; });
    if (fresh.length) return _shuffle(fresh)[0];
    if (at.length)    return _shuffle(at)[0];
    return null;
  }

  // Exploration: prefer difficulty > SI+1, cap at SI+3, prefer words not recently seen
  function _exploration(pool, recentWords, skillLevel) {
    var S      = _clamp(Math.round(skillLevel), 1, 10);
    var maxDiff = Math.min(10, S + 3);
    var rSet   = {};
    (recentWords || []).forEach(function (id) { rSet[id] = true; });
    var fresh = pool.filter(function (r) { return !rSet[r.id]; });
    var use   = fresh.length ? fresh : pool;
    // First choice: harder than SI+1 but no harder than SI+3
    var hard = use.filter(function (r) {
      var d = parseInt(r.difficulty);
      return d > S + 1 && d <= maxDiff;
    });
    if (hard.length) return _shuffle(hard)[0];
    // Second choice: any word at least 2 away from skill (within cap)
    var far = use.filter(function (r) {
      var d = parseInt(r.difficulty);
      return Math.abs(d - S) >= 2 && d <= maxDiff;
    });
    if (far.length) return _shuffle(far)[0];
    // Final fallback: any unused word
    if (use.length) return _shuffle(use)[0];
    return null;
  }

  // Fallback: any unused word, preferring words not recently seen
  function _fallback(pool, usedIds, recentWords) {
    var avail = _available(pool, usedIds);
    var rSet  = {};
    (recentWords || []).forEach(function (id) { rSet[id] = true; });
    var fresh = avail.filter(function (r) { return !rSet[r.id]; });
    var use   = fresh.length ? fresh : avail;
    return use.length ? _shuffle(use)[0] : null;
  }

  // ── Normal difficulty slot layout (shared by Eval3 and Normal mode) ──
  // Spec: 1@SI-2, 1@SI-1, 3@SI, 2@SI+1, 2 exploration, 1 fallback = 10 slots
  // null  = exploration slot
  // 'fb'  = fallback slot (any difficulty, any pool)
  function _normalDiffSlots(SI) {
    return _shuffle([
      _clamp(SI - 2, 1, 10),
      _clamp(SI - 1, 1, 10),
      SI, SI, SI,
      _clamp(SI + 1, 1, 10),
      _clamp(SI + 1, 1, 10),
      null, null,   // 2 exploration
      'fb'          // 1 explicit fallback slot
    ]);
  }

  // ── Queue builders ─────────────────────────────────────────────

  // Evaluation quiz 1: one word per difficulty 1–10 in order
  function _buildEval1(all, p) {
    var selected = [], usedIds = {}, rw = p.recentWords || [];
    for (var d = 1; d <= 10; d++) {
      var pool = _available(all, usedIds);
      var w    = _byDifficulty(pool, d, rw) || _fallback(all, usedIds, rw);
      if (w) { usedIds[w.id] = true; selected.push(w); }
    }
    return selected;
  }

  // Evaluation quiz 2: 2@S-2, 2@S-1, 3@S, 2@S+1, 1 exploration
  function _buildEval2(all, p) {
    var S    = _clamp(Math.round(p.skillLevel), 1, 10);
    var dist = [
      _clamp(S - 2, 1, 10), _clamp(S - 2, 1, 10),
      _clamp(S - 1, 1, 10), _clamp(S - 1, 1, 10),
      S, S, S,
      _clamp(S + 1, 1, 10), _clamp(S + 1, 1, 10),
      null  // 1 exploration
    ];
    var selected = [], usedIds = {}, rw = p.recentWords || [];
    dist.forEach(function (d) {
      var pool = _available(all, usedIds);
      var w    = (d === null)
        ? _exploration(pool, rw, p.skillLevel)
        : _byDifficulty(pool, d, rw);
      if (!w) w = _fallback(all, usedIds, rw);
      if (w)  { usedIds[w.id] = true; selected.push(w); }
    });
    return selected.slice(0, 10);
  }

  // Evaluation quiz 3: same distribution as normal mode
  function _buildEval3(all, p) {
    return _buildNormalRows(all, p);
  }

  // Normal adaptive mode rows (also used for Eval3)
  function _buildNormalRows(all, p) {
    var S     = p.skillLevel;
    var SI    = _clamp(Math.round(S), 1, 10);
    var words = p.words || {};
    var rw    = p.recentWords || [];

    // Categorise all words by history
    var pools = {
      newW:   all.filter(function (r) { return !words[r.id] || words[r.id].seenCount === 0; }),
      failed: all.filter(function (r) { return words[r.id] && words[r.id].failScore > 0; }),
      review: all.filter(function (r) {
        return words[r.id] && words[r.id].failScore === 0 && words[r.id].seenCount > 0;
      })
    };

    // 10 type-slots: 5 new, 3 failed, 2 review — shuffled so they interleave
    var typeSlots = _shuffle([
      'newW', 'newW', 'newW', 'newW', 'newW',
      'failed', 'failed', 'failed',
      'review', 'review'
    ]);
    // 10 difficulty-slots per spec
    var diffSlots = _normalDiffSlots(SI);

    var selected = [], usedIds = {};

    for (var i = 0; i < 10; i++) {
      var tType = typeSlots[i];
      var tDiff = diffSlots[i];
      var w     = null;

      if (tDiff === 'fb') {
        // Explicit fallback slot: any unused word, preferred type first
        w = _fallback(pools[tType], usedIds, rw);
        if (!w) w = _fallback(all, usedIds, rw);
      } else {
        // 1. Try preferred type pool at desired difficulty / exploration
        var preferred = _available(pools[tType], usedIds);
        w = (tDiff === null)
          ? _exploration(preferred, rw, S)
          : _byDifficulty(preferred, tDiff, rw);

        // 2. Relax pool restriction, keep difficulty target
        if (!w) {
          var anyPool = _available(all, usedIds);
          w = (tDiff === null)
            ? _exploration(anyPool, rw, S)
            : _byDifficulty(anyPool, tDiff, rw);
        }

        // 3. Any unused word
        if (!w) w = _fallback(all, usedIds, rw);
      }

      if (w) { usedIds[w.id] = true; selected.push(w); }
    }

    // Top-up in case any slot could not be filled
    while (selected.length < 10) {
      var w2 = _fallback(all, usedIds, rw);
      if (!w2) break;
      usedIds[w2.id] = true;
      selected.push(w2);
    }
    return selected.slice(0, 10);
  }

  // ── Build quiz cards (word + distractors) ──────────────────────
  function _makeCards(rows, all) {
    return rows.map(function (row) {
      var usedIds = {}; usedIds[row.id] = true;
      var usedEn  = {}; usedEn[(row.translation_en || '').trim()] = true;
      var distractors = [];
      _shuffle(all).forEach(function (d) {
        if (distractors.length >= 6) return;
        if (usedIds[d.id]) return;
        var en = (d.translation_en || '').trim();
        if (en && !usedEn[en]) {
          usedEn[en] = true; usedIds[d.id] = true;
          distractors.push(d);
        }
      });
      return { _row: row, _distractors: distractors };
    });
  }

  function _buildQueue(lv) {
    var p     = _get();
    var all   = _allWords(lv);
    if (!all.length) return [];
    var stage = p.evaluationStage;
    var rows;
    if      (stage === 0) rows = _buildEval1(all, p);
    else if (stage === 1) rows = _buildEval2(all, p);
    else if (stage === 2) rows = _buildEval3(all, p);
    else                  rows = _buildNormalRows(all, p);
    return _makeCards(rows, all);
  }

  // ── Post-quiz: word stats ──────────────────────────────────────
  function _updateWord(p, wordId, correct) {
    if (!p.words[wordId]) p.words[wordId] = { failScore: 0, seenCount: 0, correctCount: 0 };
    var w = p.words[wordId];
    w.seenCount++;
    if (correct) {
      w.correctCount++;
      w.failScore = Math.max(0, w.failScore - 1);  // recover 1 point per correct answer
    } else {
      w.failScore += 2;  // penalise 2 points per wrong answer; takes 2 correct to clear
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

  // ── Post-quiz: skill level updates ────────────────────────────

  // Eval 1 → skill = weighted average difficulty of correct answers
  // (cards are presented easiest→hardest so later position ≈ harder word)
  // Weight = 1 + position/9 → linear ramp from 1.0 (first) to 2.0 (last)
  function _afterEval1(p, answers) {
    var correct = answers.filter(function (a) { return a.correct; });
    if (!correct.length) {
      p.skillLevel = 1;
    } else {
      var totalWeight = 0, weightedSum = 0;
      correct.forEach(function (a) {
        var weight = 1 + a.position / 9;
        totalWeight += weight;
        weightedSum += a.difficulty * weight;
      });
      p.skillLevel = _clamp(weightedSum / totalWeight, 1, 10);
    }
    p.evaluationStage = 1;
  }

  // Eval 2 → average(current skill, avg difficulty of correct answers)
  function _afterEval2(p, answers) {
    var correct = answers.filter(function (a) { return a.correct; });
    var avg     = correct.length
      ? correct.reduce(function (s, a) { return s + a.difficulty; }, 0) / correct.length
      : 1;
    p.skillLevel    = _clamp((p.skillLevel + avg) / 2, 1, 10);
    p.evaluationStage = 2;
  }

  // Normal formula: skill += (accuracy - 0.65) * 0.6
  // Neutral at 65%; ±0.6 max swing per quiz (100% → +0.21, 0% → -0.39)
  function _applyNormalFormula(p, answers) {
    var accuracy   = answers.filter(function (a) { return a.correct; }).length / answers.length;
    p.skillLevel   = _clamp(p.skillLevel + (accuracy - 0.65) * 0.6, 1, 10);
  }

  function _afterEval3(p, answers) {
    _applyNormalFormula(p, answers);
    p.evaluationStage = 3;  // transitions to permanent normal mode
  }

  function _afterNormal(p, answers) {
    _applyNormalFormula(p, answers);
  }

  function _processResults(answers) {
    var p     = _get();
    answers.forEach(function (a) { _updateWord(p, a.wordId, a.correct); });
    _updateRecent(p, answers.map(function (a) { return a.wordId; }));
    var stage = _stageAtStart;
    if      (stage === 0) _afterEval1(p, answers);
    else if (stage === 1) _afterEval2(p, answers);
    else if (stage === 2) _afterEval3(p, answers);
    else                  _afterNormal(p, answers);
    _save(p);
    _progress = p;
  }

  // ── UI helpers ─────────────────────────────────────────────────
  function _adaptiveBadgeText() {
    var p = _get();
    if (p.evaluationStage < 3) return 'Eval ' + (p.evaluationStage + 1) + '/3';
    return 'Level\u00a0' + p.skillLevel.toFixed(1);
  }

  function _updateHomeBadge() {
    var el = document.getElementById('adaptive-skill-badge');
    if (el) el.textContent = _adaptiveBadgeText();
  }

  function _updateQuizHUD()    { /* transparent — app.js header handles level label */ }
  function _updateResultsHUD() { /* transparent — app.js results screen handles score */ }

  // ── Public: start adaptive quiz for a specific level ───────────
  window.startAdaptiveQuiz = async function (lv) {
    var p = _get();
    _active       = true;
    _answers      = [];
    _stageAtStart = p.evaluationStage;

    var ov = document.getElementById('quiz-prep-overlay');
    ov.classList.add('active');

    try {
      await _loadCSVLevel(lv);
    } catch (err) {
      ov.classList.remove('active');
      var msg = 'Could not load quiz data.';
      if (window.location.protocol === 'file:') msg += ' Open through a local server instead of file://.';
      alert(msg);
      _active = false;
      return;
    }

    var cards = _buildQueue(lv);
    ov.classList.remove('active');

    if (!cards.length) { alert('No words available!'); _active = false; return; }

    currentLevel = lv;
    queue = cards;
    idx = 0; ok = 0; no = 0;

    show('screen-quiz');
    renderCard();
  };

  // ── Wrap existing functions ────────────────────────────────────

  // renderCard: hook in after original renders each card
  var _origRenderCard = window.renderCard;
  window.renderCard = function () {
    _origRenderCard();
    if (_active) _updateQuizHUD();
  };

  // pick: record per-answer result (with position for Eval1 weighting)
  var _origPick = window.pick;
  window.pick = function (btn, selectedId, correctId) {
    _origPick(btn, selectedId, correctId);
    if (_active) {
      var card = queue[idx];
      var diff = parseInt((card && card._row && card._row.difficulty) || '5') || 5;
      _answers.push({
        wordId    : correctId,
        difficulty: diff,
        correct   : selectedId === correctId,
        position  : idx            // 0-based index in this quiz; used for Eval1 weighting
      });
    }
  };

  // showResults: process adaptive data after the results screen renders
  var _origShowResults = window.showResults;
  window.showResults = function () {
    _origShowResults();
    if (_active) {
      _processResults(_answers);
      _updateResultsHUD();
      _updateHomeBadge();
    }
  };

  // restartLevel: re-enter adaptive quiz for the same level
  var _origRestartLevel = window.restartLevel;
  window.restartLevel = function () {
    if (_active) { window.startAdaptiveQuiz(currentLevel); }
    else         { _origRestartLevel(); }
  };

  // goHome: reset active flag (auth.js snapshot restores progress if quiz abandoned)
  var _origGoHome = window.goHome;
  window.goHome = function () {
    _active = false;
    _origGoHome();
    _updateHomeBadge();
  };

  // ── Init home badge on first load ──────────────────────────────
  function _onReady() { _updateHomeBadge(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _onReady);
  } else {
    setTimeout(_onReady, 0);
  }

  // ── Hooks exposed for auth.js ──────────────────────────────────
  window._adaptiveInjectProgress = function (p) {
    _pendingProgress = p;
    _progress        = null;
  };
  window._adaptiveSetSaveHook    = function (fn) { _externalSaveFn = fn; };
  window._adaptiveRefreshBadge   = _updateHomeBadge;

})();

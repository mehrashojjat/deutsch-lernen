// ══════════════════════════════════════════════════════════════════
//  ADAPTIVE VOCABULARY QUIZ SYSTEM
//  Depends on: app.js (CSV_QUIZ_DATA, _loadCSVLevel, queue, idx,
//              ok, no, currentLevel, renderCard, pick, showResults,
//              restartLevel, goHome, show)
// ══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var STORAGE_KEY = 'deutsch_adaptive_progress';
  var RECENT_LIMIT = 25;

  // ── External persistence hooks (set by auth.js) ───────────────
  // _pendingProgress : progress object pre-loaded from Supabase; consumed once by _get()
  // _externalSaveFn  : async fn(progress) called in addition to localStorage after each quiz
  var _pendingProgress = null;
  var _externalSaveFn  = null;

  // ── State ──────────────────────────────────────────────────────
  var _active = false;          // true while an adaptive quiz is running
  var _progress = null;         // cached progress object
  var _answers = [];            // { wordId, difficulty, correct } for current quiz
  var _stageAtStart = 0;        // evaluationStage value when this quiz began

  // ── Persistence ───────────────────────────────────────────────
  function _load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
  }
  function _save(p) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) {}
    if (typeof _externalSaveFn === 'function') _externalSaveFn(p); // e.g. Supabase write
  }
  function _init() {
    return { evaluationStage: 0, skillLevel: 5, words: {}, recentWords: [] };
  }
  function _get() {
    if (!_progress) {
      if (_pendingProgress) { _progress = _pendingProgress; _pendingProgress = null; }
      else { _progress = _load() || _init(); }
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

  // ── Vocabulary pool (scoped to the level the user clicked) ────
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
  function _available(pool, usedIds) {
    return pool.filter(function (r) { return !usedIds[r.id]; });
  }

  function _byDifficulty(pool, diff, recentWords) {
    var d = _clamp(Math.round(diff), 1, 10);
    var rSet = {};
    (recentWords || []).forEach(function (id) { rSet[id] = true; });
    var at = pool.filter(function (r) { return parseInt(r.difficulty) === d; });
    var fresh = at.filter(function (r) { return !rSet[r.id]; });
    if (fresh.length) return _shuffle(fresh)[0];
    if (at.length) return _shuffle(at)[0];
    return null;
  }

  function _exploration(pool, recentWords, skillLevel) {
    var S = _clamp(Math.round(skillLevel), 1, 10);
    var rSet = {};
    (recentWords || []).forEach(function (id) { rSet[id] = true; });
    var fresh = pool.filter(function (r) { return !rSet[r.id]; });
    var use = fresh.length ? fresh : pool;
    // Prefer harder words (above skill level) to increase challenge
    var harder = use.filter(function (r) { return parseInt(r.difficulty) > S + 1; });
    if (harder.length) return _shuffle(harder)[0];
    var far = use.filter(function (r) { return Math.abs(parseInt(r.difficulty) - S) >= 2; });
    if (far.length) return _shuffle(far)[0];
    if (use.length) return _shuffle(use)[0];
    return null;
  }

  function _fallback(all, usedIds, recentWords) {
    var pool = _available(all, usedIds);
    var rSet = {};
    (recentWords || []).forEach(function (id) { rSet[id] = true; });
    var fresh = pool.filter(function (r) { return !rSet[r.id]; });
    var use = fresh.length ? fresh : pool;
    return use.length ? _shuffle(use)[0] : null;
  }

  // ── Queue builders ─────────────────────────────────────────────

  // Evaluation quiz 1: exactly 1 word per difficulty 1–10
  function _buildEval1(all, p) {
    var selected = [], usedIds = {}, rw = p.recentWords || [];
    for (var d = 1; d <= 10; d++) {
      var pool = _available(all, usedIds);
      var w = _byDifficulty(pool, d, rw) || _fallback(all, usedIds, rw);
      if (w) { usedIds[w.id] = true; selected.push(w); }
    }
    return selected;
  }

  // Evaluation quiz 2: distribution around skillLevel + 2 exploration
  function _buildEval2(all, p) {
    var S = _clamp(Math.round(p.skillLevel), 1, 10);
    var dist = [S - 2, S - 1, S - 1, S, S, S + 1, S + 1, S + 2]
      .map(function (d) { return _clamp(d, 1, 10); });

    // 2 exploration slots: difficulties not already represented in dist
    var distSet = {};
    dist.forEach(function (d) { distSet[d] = true; });
    var others = [];
    for (var d = 1; d <= 10; d++) { if (!distSet[d]) others.push(d); }
    var explDiffs = _shuffle(others).slice(0, 2);
    // If not enough other diffs, mark as null (pure exploration)
    while (explDiffs.length < 2) explDiffs.push(null);
    dist = dist.concat(explDiffs);

    var selected = [], usedIds = {}, rw = p.recentWords || [];
    dist.forEach(function (d) {
      var pool = _available(all, usedIds);
      var w = (d === null)
        ? _exploration(pool, rw, p.skillLevel)
        : _byDifficulty(pool, d, rw);
      if (!w) w = _fallback(all, usedIds, rw);
      if (w) { usedIds[w.id] = true; selected.push(w); }
    });
    return selected.slice(0, 10);
  }

  // Evaluation quiz 3: 3×S, 3×(S-1), 3×(S+1), 1 exploration
  function _buildEval3(all, p) {
    var S = _clamp(Math.round(p.skillLevel), 1, 10);
    var dist = [];
    for (var i = 0; i < 3; i++) dist.push(S);
    for (var i = 0; i < 3; i++) dist.push(_clamp(S - 1, 1, 10));
    for (var i = 0; i < 3; i++) dist.push(_clamp(S + 1, 1, 10));
    dist.push(null); // exploration

    var selected = [], usedIds = {}, rw = p.recentWords || [];
    dist.forEach(function (d) {
      var pool = _available(all, usedIds);
      var w = (d === null)
        ? _exploration(pool, rw, p.skillLevel)
        : _byDifficulty(pool, d, rw);
      if (!w) w = _fallback(all, usedIds, rw);
      if (w) { usedIds[w.id] = true; selected.push(w); }
    });
    return selected.slice(0, 10);
  }

  // Normal adaptive mode: 50% new / 30% failed / 20% review
  // crossed with difficulty targeting: 50%@S, 20%@S-1, 20%@S+1, 10% exploration
  function _buildNormal(all, p) {
    var S = p.skillLevel;
    var SI = _clamp(Math.round(S), 1, 10);
    var words = p.words || {};
    var rw = p.recentWords || [];

    // Categorise all words into pools
    var pools = {
      newW:   all.filter(function (r) { return !words[r.id] || words[r.id].seenCount === 0; }),
      failed: all.filter(function (r) { return words[r.id] && words[r.id].failScore > 0; }),
      review: all.filter(function (r) { return words[r.id] && words[r.id].failScore === 0 && words[r.id].seenCount > 0; })
    };

    // 10 type-slots: 5 new, 3 failed, 2 review  (shuffled for mixing)
    var typeSlots = _shuffle(['newW','newW','newW','newW','newW','failed','failed','failed','review','review']);
    // 10 difficulty-slots: wider spread so users see words from difficulty 1 up to SI,
    // not just the narrow ±1 band. Also 2 exploration slots biased toward harder words.
    // 3@S, 2@(S-1), 1@(S-2), 2@(S+1), 2 exploration (prefer S+2 and above)
    var diffSlots = _shuffle([SI, SI, SI,
                              _clamp(SI-1,1,10), _clamp(SI-1,1,10),
                              _clamp(SI-2,1,10),
                              _clamp(SI+1,1,10), _clamp(SI+1,1,10),
                              null, null]);

    var selected = [], usedIds = {};

    for (var i = 0; i < 10; i++) {
      var tType = typeSlots[i];
      var tDiff = diffSlots[i];
      var w = null;

      // Try preferred pool first
      var preferred = _available(pools[tType], usedIds);
      w = (tDiff === null)
        ? _exploration(preferred, rw, S)
        : _byDifficulty(preferred, tDiff, rw);

      // Relax pool type, keep difficulty
      if (!w) {
        var anyPool = _available(all, usedIds);
        w = (tDiff === null)
          ? _exploration(anyPool, rw, S)
          : _byDifficulty(anyPool, tDiff, rw);
      }

      // Final fallback: anything unused
      if (!w) w = _fallback(all, usedIds, rw);

      if (w) { usedIds[w.id] = true; selected.push(w); }
    }

    // Top-up if any slots failed
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
      var usedEn = {}; usedEn[(row.translation_en || '').trim()] = true;
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
    var p = _get();
    var all = _allWords(lv);
    if (!all.length) return [];
    var rows;
    var stage = p.evaluationStage;
    if      (stage === 0) rows = _buildEval1(all, p);
    else if (stage === 1) rows = _buildEval2(all, p);
    else if (stage === 2) rows = _buildEval3(all, p);
    else                  rows = _buildNormal(all, p);
    return _makeCards(rows, all);
  }

  // ── Post-quiz: word stats ──────────────────────────────────────
  function _updateWord(p, wordId, correct) {
    if (!p.words[wordId]) p.words[wordId] = { failScore: 0, seenCount: 0, correctCount: 0 };
    var w = p.words[wordId];
    w.seenCount++;
    if (correct) { w.correctCount++; w.failScore = Math.max(0, w.failScore - 1); }
    else         { w.failScore += 3; }
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
  function _afterEval1(p, answers) {
    var highest = 0;
    answers.forEach(function (a) { if (a.correct && a.difficulty > highest) highest = a.difficulty; });
    p.skillLevel = Math.max(1, highest);
    p.evaluationStage = 1;
  }

  function _afterEval2(p, answers) {
    var correct = answers.filter(function (a) { return a.correct; });
    var avg = correct.length
      ? correct.reduce(function (s, a) { return s + a.difficulty; }, 0) / correct.length
      : 1;
    p.skillLevel = _clamp((p.skillLevel + avg) / 2, 1, 10);
    p.evaluationStage = 2;
  }

  function _afterEval3(p, answers) {
    var accuracy = answers.filter(function (a) { return a.correct; }).length / 10;
    p.skillLevel = _clamp(p.skillLevel + (accuracy - 0.6), 1, 10);
    p.evaluationStage = 3;
  }

  function _afterNormal(p, answers) {
    var accuracy = answers.filter(function (a) { return a.correct; }).length / answers.length;
    p.skillLevel = _clamp(p.skillLevel + (accuracy - 0.6), 1, 10);
  }

  function _processResults(answers) {
    var p = _get();
    answers.forEach(function (a) { _updateWord(p, a.wordId, a.correct); });
    _updateRecent(p, answers.map(function (a) { return a.wordId; }));
    var stage = _stageAtStart;
    if      (stage === 0) _afterEval1(p, answers);
    else if (stage === 1) _afterEval2(p, answers);
    else if (stage === 2) _afterEval3(p, answers);
    else                  _afterNormal(p, answers);
    _save(p);
    _progress = p; // keep cache in sync
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

  function _updateQuizHUD() {
    // Intentionally left blank: the adaptive engine runs transparently.
    // The quiz header already shows the correct level name via app.js's
    // renderCard(), so we do not override it with evaluation stage labels.
  }

  function _updateResultsHUD() {
    // Intentionally left blank: adaptive progress is tracked silently.
    // The results screen shows the normal score/percentage via app.js.
  }

  // ── Public: start adaptive quiz for a specific level ───────────
  // Called from auth.js's startLevel wrapper when the user is signed in.
  // The user simply sees their chosen level quiz — the adaptive logic is
  // transparent.
  window.startAdaptiveQuiz = async function (lv) {
    var p = _get();
    _active = true;
    _answers = [];
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

    // Use the real level name so the quiz header reads "Level A1" etc.
    currentLevel = lv;
    queue = cards;
    idx = 0; ok = 0; no = 0;

    show('screen-quiz');
    renderCard();
  };

  // ── Wrap existing functions ────────────────────────────────────

  // renderCard: patch the level/HUD text after original runs
  var _origRenderCard = window.renderCard;
  window.renderCard = function () {
    _origRenderCard();
    if (_active) _updateQuizHUD();
  };

  // pick: record per-answer result for adaptive processing
  var _origPick = window.pick;
  window.pick = function (btn, selectedId, correctId) {
    _origPick(btn, selectedId, correctId);
    if (_active) {
      var card = queue[idx];
      var diff = parseInt((card && card._row && card._row.difficulty) || '5') || 5;
      _answers.push({ wordId: correctId, difficulty: diff, correct: selectedId === correctId });
    }
  };

  // showResults: process adaptive data and update results screen
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
    else { _origRestartLevel(); }
  };

  // goHome: reset adaptive flag and refresh home badge
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
  // Inject Supabase-loaded progress before the next quiz starts.
  // Clears the in-memory cache so _get() picks up the new value.
  window._adaptiveInjectProgress = function (p) {
    _pendingProgress = p;
    _progress = null;
  };
  // Register a save callback (called after every quiz alongside localStorage).
  window._adaptiveSetSaveHook = function (fn) { _externalSaveFn = fn; };
  // Let auth.js refresh the home badge after progress is injected.
  window._adaptiveRefreshBadge = _updateHomeBadge;

})();

/**
 * LOADER — German Sources Merger  v2
 * Runs LAST (after all source files).
 *
 * Merges:
 *   • window.APP_DATA   → produced by game_data.js (base WORD_BANK, VOCAB_CARDS, FORM_EX)
 *   • window._GS[]      → array of {WORD_BANK:[…], VOCAB_CARDS:{…}} pushed by each source file
 *
 * Load order in HTML:
 *   1. game_data.js                         → sets window.APP_DATA
 *   2. sources/goethe-institut/a1_words.js  → pushes to window._GS
 *   3. sources/goethe-institut/a2_words.js
 *   4. sources/goethe-institut/b1_words.js
 *   5. sources/goethe-institut/b2_words.js
 *   6. sources/dictionary/dictionary.js     → pushes to window._GS  (full dictionary, optional)
 *   7. loader.js  ← THIS FILE (runs last, merges everything)
 */
(function () {
  'use strict';

  // ── Defensive defaults ──────────────────────────────────────────────────────
  var base = window.APP_DATA || { WORD_BANK: [], VOCAB_CARDS: {}, FORM_EX: {} };
  if (!base.FORM_EX)     { base.FORM_EX     = {}; }
  if (!base.VOCAB_CARDS) { base.VOCAB_CARDS = {}; }
  if (!base.WORD_BANK)   { base.WORD_BANK   = []; }

  var gsArr = Array.isArray(window._GS) ? window._GS : [];

  // ── Helper: lemma key strips leading article ────────────────────────────────
  function lemmaKey(wordStr) {
    return (wordStr || '')
      .replace(/^(der|die|das|ein|eine)\s+/i, '')
      .trim()
      .toLowerCase();
  }

  // ── 1. Flatten sub-levels in base WORD_BANK ─────────────────────────────────
  base.WORD_BANK.forEach(function (w) {
    if (w.level === 'A2.1' || w.level === 'A2.2') { w.level = 'A2'; }
    if (w.level === 'B1.1' || w.level === 'B1.2') { w.level = 'B1'; }
  });

  // ── 2. Build de-dup set from base WORD_BANK ──────────────────────────────────
  var seen = {};
  base.WORD_BANK.forEach(function (w) { seen[lemmaKey(w.word)] = true; });

  // ── 3. Flatten sub-level keys in base VOCAB_CARDS ─────────────────────────-
  var vc = base.VOCAB_CARDS;
  ['A2.1','A2.2'].forEach(function (k) {
    if (vc[k]) { vc['A2'] = (vc['A2'] || []).concat(vc[k]); delete vc[k]; }
  });
  ['B1.1','B1.2'].forEach(function (k) {
    if (vc[k]) { vc['B1'] = (vc['B1'] || []).concat(vc[k]); delete vc[k]; }
  });

  // ── 4. Iterate all pushed source chunks ────────────────────────────────────
  gsArr.forEach(function (chunk) {
    if (!chunk) { return; }

    // 4a. Merge WORD_BANK entries (de-dup by lemma)
    var wb = chunk.WORD_BANK || chunk.wb || [];
    wb.forEach(function (w) {
      var key = lemmaKey(w.word);
      if (!seen[key]) {
        seen[key] = true;
        base.WORD_BANK.push(w);
      }
    });

    // 4b. Merge VOCAB_CARDS  {level: [card, …]}
    var srcVc = chunk.VOCAB_CARDS || chunk.vc || {};
    Object.keys(srcVc).forEach(function (lvl) {
      if (srcVc[lvl] && srcVc[lvl].length) {
        vc[lvl] = (vc[lvl] || []).concat(srcVc[lvl]);
      }
    });

    // 4c. Merge FORM_EX
    var srcFe = chunk.FORM_EX || chunk.fe || {};
    Object.keys(srcFe).forEach(function (word) {
      if (!base.FORM_EX[word]) {
        base.FORM_EX[word] = srcFe[word];
      } else {
        Object.keys(srcFe[word]).forEach(function (form) {
          if (!base.FORM_EX[word][form]) {
            base.FORM_EX[word][form] = srcFe[word][form];
          }
        });
      }
    });
  });

  // ── 5. Republish ─────────────────────────────────────────────────────────────
  window.APP_DATA = base;

  // ── 6. Console stats ─────────────────────────────────────────────────────────
  if (typeof console !== 'undefined') {
    var counts = {};
    base.WORD_BANK.forEach(function (w) { counts[w.level] = (counts[w.level] || 0) + 1; });
    console.log(
      '[Loader] APP_DATA ready:',
      'WORD_BANK=' + base.WORD_BANK.length + ' words', counts,
      '| VOCAB_CARDS:', Object.keys(vc).reduce(function (o, k) { o[k] = (vc[k]||[]).length; return o; }, {}),
      '| FORM_EX:', Object.keys(base.FORM_EX).length
    );
  }

})();

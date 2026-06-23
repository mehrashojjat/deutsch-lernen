// ══════════════════════════════════════════════════════════════════
//  RANDOM WORD EXPLORER (API-powered)
// ══════════════════════════════════════════════════════════════════
var _randUsed = new Set();
// State for the currently displayed explorer card (used by _explorerRefreshLang)
var _currentRandRow  = null;  // CSV row object
var _currentWiktData = null;  // Wiktionary data object (null when offline/failed)

function showRandomWord() { window.umami?.track('word_explorer_opened'); _rwFirstLoad = true; show('screen-random'); renderRandomWord(); }

// Build a flat pool of all CSV rows across A1/A2/B1 (cached after first build)
var _csvRandPool = null;
function _getCsvRandPool() {
  if (_csvRandPool) return _csvRandPool;
  var pool = [];
  ['A1','A2','B1'].forEach(function(lv) {
    var rows = CSV_QUIZ_DATA[lv] || [];
    rows.forEach(function(r) {
      if (r.word && r.word.trim() && r.translation_en && r.translation_en.trim()) pool.push(r);
    });
  });
  _csvRandPool = pool;
  return pool;
}

async function renderRandomWord() {
  if (_rwFirstLoad) { _rwFirstLoad = false; } else { window.umami?.track('word_refreshed'); }
  var content = document.getElementById('rw-content');
  try {
    await _loadAllCSV();
  } catch (e) {
    if (content) {
      content.innerHTML = '<div class="wikt-error"><span>' + escHtml(t('loadError') || 'Could not load vocabulary.') + '</span></div>';
    }
    return;
  }

  var pool = _getCsvRandPool();
  if (!pool.length) {
    if (content) {
      content.innerHTML = '<div class="wikt-error"><span>No words available in vocabulary.</span></div>';
    }
    return;
  }

  var idx, attempts = 0;
  do {
    idx = Math.floor(Math.random() * pool.length);
    attempts++;
  } while (_randUsed.has(idx) && attempts < 60);
  if (_randUsed.size > 300) _randUsed.clear();
  _randUsed.add(idx);

  var row  = pool[idx];
  var word = row.word;
  var tc   = typeChar(row.word_type);
  var key  = normKey(word);
  var meta = {
    word: word, tc: tc,
    en: row.translation_en || '',
    tr: row.translation_tr || '',
    ru: row.translation_ru || '',
    uk: row.translation_uk || '',
    fa: row.translation_fa || '',
    ar: (_arMemCache && _arMemCache[key]) || ''
  };

  // Animate refresh
  var rb = document.getElementById('rw-refresh-btn');
  if (rb) {
    rb.classList.add('is-spinning');
    setTimeout(function(){ rb.classList.remove('is-spinning'); }, 410);
  }

  content.innerHTML = loadingHTML();

  fetchWiktionary(word, tc).then(async function(data) {
    _currentRandRow  = row;
    _currentWiktData = data;
    await _prefetchLangMeta(word, meta);
    await _prefetchDefTranslations(data);
    content.innerHTML = renderWiktCard(data, meta, 'rw-content');
    var chip = content.querySelector('.rw-form[onclick*="pickFormExample"]');
    if (chip) { rwWordKey = word; chip.click(); }
  }).catch(function() {
    _currentRandRow  = row;
    _currentWiktData = null;
    // Offline fallback: render with whatever is cached
    var data = { found: false, word: word, ipa: '', sections: [] };
    content.innerHTML = renderWiktCard(data, meta, 'rw-content');
    _translateDefsInContainer(content);
    _autoFetchLangMeaning(word, content, meta.en);
  });
}

// Re-renders the currently visible explorer card in the newly selected language.
// Called by setLang() when screen-random is active.
async function _explorerRefreshLang() {
  if (!_currentRandRow) return;
  var row  = _currentRandRow;
  var data = _currentWiktData;
  var word = row.word;
  var tc   = typeChar(row.word_type);
  var key  = normKey(word);
  var meta = {
    word: word, tc: tc,
    en: row.translation_en || '',
    tr: row.translation_tr || '',
    ru: row.translation_ru || '',
    uk: row.translation_uk || '',
    fa: row.translation_fa || '',
    ar: (_arMemCache && _arMemCache[key]) || ''
  };
  var content = document.getElementById('rw-content');
  content.innerHTML = loadingHTML();
  if (data) {
    await _prefetchLangMeta(word, meta);
    await _prefetchDefTranslations(data);
    content.innerHTML = renderWiktCard(data, meta, 'rw-content');
    var chip = content.querySelector('.rw-form[onclick*="pickFormExample"]');
    if (chip) { rwWordKey = word; chip.click(); }
  } else {
    content.innerHTML = renderWiktCard({ found: false, word: word, ipa: '', sections: [] }, meta, 'rw-content');
    _translateDefsInContainer(content);
    _autoFetchLangMeaning(word, content, meta.en);
  }
}

// Prefetches translations for all remaining quiz cards in the new language,
// then re-renders the current card. Called by setLang() when screen-quiz is active.
async function _quizRefreshLang() {
  if (!queue.length) return;
  var targetLang = LANG;

  // All languages use CSV columns — re-render immediately
  renderCard();
}

// Pre-fetch the active language translation into meta before rendering
// so the card always displays in the right language on first paint.
async function _prefetchLangMeta(word, meta) {
  if (LANG === 'tr' && !meta.tr) { var _t = await fetchTurkish(word); if (_t) meta.tr = _t; }
  // ar, uk: read from CSV via metaFromWord — no API fetch needed
}

// Pre-fetches all definition translations into cache before the card renders,
// so the card shows translated definitions on first paint (no flicker/update).
async function _prefetchDefTranslations(data) {
  if (LANG === 'en' || !data || !data.sections || !data.sections.length) return;
  var cs = _defCacheFor(LANG), cache = cs.cache, saveFn = cs.saveFn;
  // Collect unique uncached definition texts across all sections
  var seen = {}, toFetch = [];
  data.sections.forEach(function(sec) {
    (sec.defs || []).slice(0, 5).forEach(function(d) {
      var dk = normDefKey(d.text);
      if (cache[dk] === undefined && !seen[dk]) { seen[dk] = true; toFetch.push({ text: d.text, key: dk }); }
    });
  });
  if (!toFetch.length) return;
  await _batchTranslateDefs(toFetch, LANG, cache, saveFn, null);
}

async function openWordCard(word, tc) {
  if (!word) return;
  var meta = metaFromWord(word);
  if (tc && meta.tc === '?') meta.tc = tc;
  var content = document.getElementById('word-modal-content');
  content.innerHTML = loadingHTML();
  document.getElementById('word-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent iOS pull-to-refresh
  try {
    var data = await fetchWiktionary(word, meta.tc);
    await _prefetchLangMeta(word, meta);
    await _prefetchDefTranslations(data);
    content.innerHTML = renderWiktCard(data, meta, 'word-modal-content');
    var chip = content.querySelector('.rw-form[onclick*="pickFormExample"]');
    if (chip) { rwWordKey = word; chip.click(); }
  } catch(e) {
    // Offline: render immediately with whatever is cached, auto-fetchers update if online
    var data = { found: false, word: word, ipa: '', sections: [] };
    content.innerHTML = renderWiktCard(data, meta, 'word-modal-content');
    _translateDefsInContainer(content);
    _autoFetchLangMeaning(word, content);
    var chip = content.querySelector('.rw-form[onclick*="pickFormExample"]');
    if (chip) { rwWordKey = word; chip.click(); }
  }
}

function closeWordModal() {
  var _overlay = document.getElementById('word-modal-overlay');
  _overlay.classList.remove('open');
  // Reset any drag-offset so the next open() starts clean
  var _wm = _overlay.querySelector('.word-modal');
  if (_wm) { _wm.style.transition = ''; _wm.style.transform = ''; }
  document.body.style.overflow = ''; // restore scroll
}

// ══════════════════════════════════════════════════════════════════
//  DICTIONARY
// ══════════════════════════════════════════════════════════════════
var _dictLoaded = false;
var _dictAllWords = [];
var _dictScrollPaused = false;
var _dictScrollPauseTimer = null;
var _dictLetterOffsets = {}; // letter → scrollTop px, built at render time

function openDictionary() {
  window.umami?.track('dictionary_opened');
  show('screen-dictionary');
  document.getElementById('dict-search-input').value = '';
  if (!_dictLoaded) {
    _loadAllCSV().then(function() {
      _buildDictData();
      _dictLoaded = true;
      _renderDictList('');
    }).catch(function() {
      document.getElementById('dict-list').innerHTML =
        '<div class="dict-empty">' + escHtml(t('dictEmpty')) + '</div>';
    });
  } else {
    _renderDictList('');
  }
}

function _buildDictData() {
  var all = [];
  ['A1', 'A2', 'B1'].forEach(function(lv) {
    (CSV_QUIZ_DATA[lv] || []).forEach(function(row) {
      if (!row.word) return;
      all.push({
        word: row.word,
        article: row.article || '',
        type: row.word_type || '',
        level: row.level || lv,
        translation_en: row.translation_en || '',
        translation_tr: row.translation_tr || '',
        translation_ru: row.translation_ru || '',
        translation_uk: row.translation_uk || '',
        translation_fa: row.translation_fa || '',
        translation_ar: row.translation_ar || '',
      });
    });
  });
  all.sort(function(a, b) {
    return a.word.localeCompare(b.word, 'de', { sensitivity: 'base' });
  });
  _dictAllWords = all;
  var subEl = document.getElementById('dict-screen-subtitle');
  if (subEl) {
    var _wLabel = {en:'words',de:'Wörter',tr:'kelime',fa:'واژه',ru:'слов',uk:'слів',ar:'كلمة'};
    subEl.textContent = formatNum(_dictAllWords.length) + ' ' + (_wLabel[LANG] || 'words') + ' · A–Z';
  }
  _buildDictAlphaBar();
  _initDictScrollTracker();
}

function _getDictMeaning(entry) {
  if (LANG === 'en') return entry.translation_en;
  if (LANG === 'tr') return entry.translation_tr || entry.translation_en;
  if (LANG === 'ru') return entry.translation_ru || entry.translation_en;
  if (LANG === 'uk') return entry.translation_uk || entry.translation_en;
  if (LANG === 'fa') return entry.translation_fa || entry.translation_en;
  if (LANG === 'ar') return entry.translation_ar || entry.translation_en;
  return entry.translation_en;
}

function _dictFirstLetter(word) {
  if (!word) return '#';
  var ch = word[0].toUpperCase();
  if (ch === '-' || (ch >= '0' && ch <= '9')) return '#';
  return ch;
}

function _buildDictAlphaBar() {
  var present = {};
  _dictAllWords.forEach(function(e) { present[_dictFirstLetter(e.word)] = true; });

  var alphabet = ['#','A','Ä','B','C','D','E','F','G','H','I','J','K','L',
                  'M','N','O','Ö','P','Q','R','S','T','U','Ü','V','W','X','Y','Z'];
  var bar = document.getElementById('dict-alpha-bar');
  bar.innerHTML = '';

  alphabet.forEach(function(l) {
    if (!present[l]) return;
    var sp = document.createElement('span');
    sp.className = 'dict-alpha-letter';
    sp.textContent = l;
    sp.setAttribute('data-letter', l);
    sp.addEventListener('click', function(e) { e.stopPropagation(); _dictJumpToLetter(l); });
    bar.appendChild(sp);
  });

  // Touch drag — works like a phone-book index strip
  bar.addEventListener('touchstart', _dictBarTouchHandler, { passive: true });
  bar.addEventListener('touchmove',  _dictBarTouchHandler, { passive: true });
  // touchend intentionally left without a handler — active class persists until next jump
}

function _dictBarTouchHandler(e) {
  var touch = e.touches[0];
  // Find closest letter by geometry (immune to RTL layout changes)
  var bar = document.getElementById('dict-alpha-bar');
  var letters = bar.querySelectorAll('.dict-alpha-letter');
  var closest = null, closestDist = Infinity;
  letters.forEach(function(sp) {
    var r = sp.getBoundingClientRect();
    var cy = r.top + r.height / 2;
    var dist = Math.abs(touch.clientY - cy);
    if (dist < closestDist) { closestDist = dist; closest = sp; }
  });
  if (closest && closestDist < 40) {
    var letter = closest.getAttribute('data-letter');
    if (letter) _dictJumpToLetter(letter);
  }
}

function _dictSetActiveLetter(l) {
  document.querySelectorAll('#dict-alpha-bar .dict-alpha-letter').forEach(function(sp) {
    sp.classList.toggle('active', sp.getAttribute('data-letter') === l);
  });
}

function _dictJumpToLetter(l) {
  var list = document.getElementById('dict-list');
  var offset = _dictLetterOffsets[l];
  // _dictLetterOffsets are captured at render time when scrollTop=0, so they
  // are the true layout positions and are unaffected by position:sticky painting.
  if (offset === undefined) return;
  _dictSetActiveLetter(l);
  _dictScrollPaused = true;
  clearTimeout(_dictScrollPauseTimer);
  list.scrollTop = offset;
  _dictScrollPauseTimer = setTimeout(function() { _dictScrollPaused = false; }, 500);
}

function _initDictScrollTracker() {
  var list = document.getElementById('dict-list');
  if (!list) return;
  if (list._dictScrollFn) list.removeEventListener('scroll', list._dictScrollFn);
  list._dictScrollFn = function() {
    if (_dictScrollPaused) return;
    var headers = list.querySelectorAll('[data-dict-letter]');
    if (!headers.length) return;
    var listTop = list.getBoundingClientRect().top;
    var activeLetter = null;
    // Last header whose top is at or above the list’s own top = current section
    headers.forEach(function(h) {
      if (h.getBoundingClientRect().top - listTop <= 2) {
        activeLetter = h.getAttribute('data-dict-letter');
      }
    });
    if (activeLetter) _dictSetActiveLetter(activeLetter);
  };
  list.addEventListener('scroll', list._dictScrollFn, { passive: true });
}

function _renderDictList(filter, keepScroll) {
  var list = document.getElementById('dict-list');
  var savedScroll = keepScroll ? list.scrollTop : 0;
  var filt = (filter || '').trim().toLowerCase();

  var words = filt
    ? _dictAllWords.filter(function(e) {
        return e.word.toLowerCase().includes(filt) ||
               _getDictMeaning(e).toLowerCase().includes(filt);
      })
    : _dictAllWords;

  if (!words.length) {
    list.innerHTML = '<div class="dict-empty">' + escHtml(t('dictEmpty')) + '</div>';
    return;
  }

  var isRtl = LANG === 'fa' || LANG === 'ar';
  var frag = document.createDocumentFragment();
  var curLetter = null;

  words.forEach(function(entry) {
    if (!filt) {
      var letter = _dictFirstLetter(entry.word);
      if (letter !== curLetter) {
        curLetter = letter;
        var hdr = document.createElement('div');
        hdr.className = 'dict-letter-header';
        hdr.setAttribute('data-dict-letter', letter);
        hdr.textContent = letter;
        frag.appendChild(hdr);
      }
    }

    var div = document.createElement('div');
    div.className = 'dict-entry';
    div.setAttribute('data-word', entry.word);
    div.setAttribute('data-level', entry.level);
    (function(w, tc) {
      div.addEventListener('click', function() { openWordCard(w, tc); });
    }(entry.word, entry.type ? typeChar(entry.type) : '?'));

    var top = document.createElement('div');
    top.className = 'dict-entry-top';

    var wEl = document.createElement('span');
    wEl.className = 'dict-word';
    if (entry.article && entry.type === 'Noun') {
      var artEl = document.createElement('span');
      artEl.className = 'dict-article';
      artEl.textContent = entry.article + ' ';
      wEl.appendChild(artEl);
      wEl.appendChild(document.createTextNode(entry.word));
    } else {
      wEl.textContent = entry.word;
    }
    top.appendChild(wEl);

    var lvEl = document.createElement('span');
    lvEl.className = 'dict-level';
    lvEl.textContent = entry.level;
    top.appendChild(lvEl);

    div.appendChild(top);

    var meaning = _getDictMeaning(entry);
    if (meaning) {
      var mEl = document.createElement('div');
      mEl.className = 'dict-meaning';
      // For RTL languages, give the meaning its own RTL context while the
      // surrounding layout stays LTR (German words are always left-to-right)
      if (isRtl) { mEl.dir = 'rtl'; mEl.style.textAlign = 'right'; }
      mEl.textContent = meaning;
      div.appendChild(mEl);
    }

    frag.appendChild(div);
  });

  list.innerHTML = '';
  list.appendChild(frag);
  list.scrollTop = 0;
  // Capture letter→scrollTop offsets NOW, while scrollTop=0 and before sticky moves anything.
  _dictLetterOffsets = {};
  var lr = list.getBoundingClientRect();
  list.querySelectorAll('[data-dict-letter]').forEach(function(h) {
    _dictLetterOffsets[h.getAttribute('data-dict-letter')] = h.getBoundingClientRect().top - lr.top;
  });
  if (savedScroll > 0) list.scrollTop = savedScroll;
  _initDictScrollTracker();
}

function dictFilter(val) {
  if (_dictLoaded) _renderDictList(val);
}



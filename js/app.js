//  APP STATE
// ══════════════════════════════════════════════════════════════════
let LANG = (function() { try { return localStorage.getItem('dl_lang') || 'en'; } catch(e) { return 'en'; } })();
var _FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
var _AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
function formatNum(n) {
  if (n == null && n !== 0) return '';
  var s = String(n);
  if (LANG === 'fa') return s.replace(/[0-9]/g, function(c) { return _FA_DIGITS[+c]; });
  if (LANG === 'ar') return s.replace(/[0-9]/g, function(c) { return _AR_DIGITS[+c]; });
  return s;
}
function formatNumStr(s) {
  if (s == null) return '';
  s = String(s);
  if (LANG === 'fa') return s.replace(/[0-9]/g, function(c) { return _FA_DIGITS[+c]; });
  if (LANG === 'ar') return s.replace(/[0-9]/g, function(c) { return _AR_DIGITS[+c]; });
  return s;
}
let currentLevel = null, queue = [], idx = 0, ok = 0, no = 0, answered = false;
const QUIZ_LEN = 10;
let swipeSelectedLevel = 'A1', swipeDeck = [], swipeIdx = 0, swipeGood = 0, swipeBad = 0;
let swipePreloadPromise = null, swipeAnimating = false;
var practiceSelectedLevels = { A1: true };
var practiceDeck = [], practiceIdx = 0;
var practiceSeenIds = {};
var practicePreloadPromise = null, practiceAnimating = false;
var practiceFilters = {
  difficulties: { __all__: true },
  categories: { __all__: true },
  wordTypes: { __all__: true },
  articles: { __all__: true }
};
var PRACTICE_ALL_KEY = '__all__';
var PRACTICE_WORD_TYPES = ['Noun', 'Verb', 'Adjective', 'Phrase', 'Adverb', 'Word'];
var PRACTICE_ARTICLES = ['der', 'die', 'das'];
var adaptiveSelectedLevel = 'A1';
var currentThemeCategoryId = 0; // non-zero while a theme quiz is active
var _themeAnswers = [];
var learningProfileSelectedLevel = 'ALL';
var _profileDirty = true;
var learningProfileDetailMode = null;
var learningProfileLastDetailHtml = '';
var _rwFirstLoad = false;

// ── Quiz active-time tracker ─────────────────────────────────────
// Accumulates engaged seconds only while a quiz is in progress.
// Committed in showResults(); discarded on abandonment (back, tab close).
var _quizTimerActiveMs = 0;
var _quizTimerSegmentStart = null;
var _quizTimerRunning = false;
var _quizTimerPaused = false;
var _quizTimerInactivityMs = 120000;
var _quizTimerInactivityHandle = null;
var _quizTimerLifecycleBound = false;

function _quizTimerNow() { return Date.now(); }

function _quizTimerFlushSegment() {
  if (_quizTimerRunning && !_quizTimerPaused && _quizTimerSegmentStart != null) {
    _quizTimerActiveMs += _quizTimerNow() - _quizTimerSegmentStart;
    _quizTimerSegmentStart = null;
  }
}

function _quizTimerBindLifecycle() {
  if (_quizTimerLifecycleBound) return;
  _quizTimerLifecycleBound = true;
  document.addEventListener('visibilitychange', function() {
    if (!_quizTimerRunning) return;
    if (document.hidden) _quizTimerPause();
    else _quizTimerResume();
  });
  window.addEventListener('pagehide', function() {
    if (_quizTimerRunning) _quizTimerAbandon();
  });
}

function _quizTimerResetInactivity() {
  clearTimeout(_quizTimerInactivityHandle);
  if (!_quizTimerRunning || _quizTimerPaused) return;
  _quizTimerInactivityHandle = setTimeout(function() {
    if (_quizTimerRunning && !_quizTimerPaused) _quizTimerPause();
  }, _quizTimerInactivityMs);
}

function _quizTimerStart() {
  _quizTimerBindLifecycle();
  clearTimeout(_quizTimerInactivityHandle);
  _quizTimerActiveMs = 0;
  _quizTimerRunning = true;
  _quizTimerPaused = false;
  _quizTimerSegmentStart = _quizTimerNow();
  _quizTimerResetInactivity();
}

function _quizTimerPause() {
  if (!_quizTimerRunning || _quizTimerPaused) return;
  _quizTimerFlushSegment();
  _quizTimerPaused = true;
  clearTimeout(_quizTimerInactivityHandle);
}

function _quizTimerResume() {
  if (!_quizTimerRunning || !_quizTimerPaused || document.hidden) return;
  _quizTimerPaused = false;
  _quizTimerSegmentStart = _quizTimerNow();
  _quizTimerResetInactivity();
}

function _quizTimerTouch() {
  if (!_quizTimerRunning) return;
  if (_quizTimerPaused && !document.hidden) {
    _quizTimerResume();
    return;
  }
  _quizTimerResetInactivity();
}

function _quizTimerStopAndGetSeconds() {
  if (!_quizTimerRunning) return 0;
  _quizTimerFlushSegment();
  _quizTimerRunning = false;
  _quizTimerPaused = false;
  clearTimeout(_quizTimerInactivityHandle);
  _quizTimerSegmentStart = null;
  return Math.max(0, Math.round(_quizTimerActiveMs / 1000));
}

function _quizTimerFlushAndGetSeconds() {
  if (!_quizTimerRunning) return 0;
  _quizTimerFlushSegment();
  var secs = Math.max(0, Math.round(_quizTimerActiveMs / 1000));
  _quizTimerActiveMs = 0;
  if (_quizTimerRunning && !_quizTimerPaused) {
    _quizTimerSegmentStart = _quizTimerNow();
  }
  return secs;
}

function _quizTimerAbandon() {
  if (typeof window._rushIsActive === 'function' && window._rushIsActive()) return;
  if (!_quizTimerRunning) return;
  _quizTimerRunning = false;
  _quizTimerPaused = false;
  _quizTimerActiveMs = 0;
  _quizTimerSegmentStart = null;
  clearTimeout(_quizTimerInactivityHandle);
}

function _quizTimerIsRunning() { return _quizTimerRunning; }
window._quizTimerStart = _quizTimerStart;
window._quizTimerStopAndGetSeconds = _quizTimerStopAndGetSeconds;
window._quizTimerFlushAndGetSeconds = _quizTimerFlushAndGetSeconds;
window._quizTimerAbandon = _quizTimerAbandon;
window._quizTimerTouch = _quizTimerTouch;
window._quizTimerIsRunning = _quizTimerIsRunning;
window._formatStudyTime = _formatStudyTime;
var _quizReturnScreen = 'screen-levels'; // screen to return to when hitting ← Back from quiz
var _deferredInstallPrompt = null;
var _installPromptReady = false;
var _installDismissed = false;
var _installStateMedia = null;
var _isStandaloneMode = false;
var _isCapacitorNativeRuntime = (function() {
  try {
    if (!window.Capacitor) return false;
    if (typeof window.Capacitor.isNativePlatform === 'function') {
      return !!window.Capacitor.isNativePlatform();
    }
    if (typeof window.Capacitor.getPlatform === 'function') {
      return window.Capacitor.getPlatform() !== 'web';
    }
    return false;
  } catch (e) {
    return false;
  }
})();
var _installGuideCloseTimer = null;
var _installExperienceInitialized = false;
var _installShareActionsBound = false;

function _applyNativeShellInsets() {
  if (!_isCapacitorNativeRuntime) return;
  if (document.body) document.body.classList.remove('native-shell');

  try {
    var plugins = window.Capacitor && window.Capacitor.Plugins;
    var statusBar = plugins && plugins.StatusBar;
    if (statusBar && typeof statusBar.setOverlaysWebView === 'function') {
      // Use native-managed inset to keep web content reliably below
      // status/notch area across auth return and app resume transitions.
      statusBar.setOverlaysWebView({ overlay: false }).catch(function() {});
    }
    if (statusBar && typeof statusBar.setBackgroundColor === 'function') {
      statusBar.setBackgroundColor({ color: '#0b0d13' }).catch(function() {});
    }
  } catch (e) {}
}

function _wireNativeShellInsetGuards() {
  if (!_isCapacitorNativeRuntime) return;
  _applyNativeShellInsets();

  window.addEventListener('pageshow', _applyNativeShellInsets);
  window.addEventListener('focus', _applyNativeShellInsets);
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) _applyNativeShellInsets();
  });

  try {
    var app = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (app && typeof app.addListener === 'function') {
      app.addListener('appStateChange', function (state) {
        if (state && state.isActive) _applyNativeShellInsets();
      });
      app.addListener('appUrlOpen', function () {
        _applyNativeShellInsets();
      });
    }
  } catch (e) {}
}

function _readInstallDismissed() {
  try { return localStorage.getItem('dl_install_dismissed') === '1'; }
  catch (e) { return false; }
}

function _writeInstallDismissed(v) {
  _installDismissed = !!v;
  try {
    if (_installDismissed) localStorage.setItem('dl_install_dismissed', '1');
    else localStorage.removeItem('dl_install_dismissed');
  } catch (e) {}
}

function _installLog(level, message, extra) {
  if (!window.console) return;
  var prefix = '[install] ' + message;
  if (level === 'error' && console.error) console.error(prefix, extra || '');
  else if (level === 'warn' && console.warn) console.warn(prefix, extra || '');
  else if (console.log) console.log(prefix, extra || '');
}

// ── Helpers ──
function t(key) { return UI[LANG][key] !== undefined ? UI[LANG][key] : UI.en[key]; }
function tv(obj) { return typeof obj === 'object' && obj !== null && (obj.en || obj.tr) ? obj[LANG] : obj; }
function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }
function rowTypeLabel(type) {
  var labels = t('typeBadge') || {};
  return labels[type] || type || (labels.Word || 'Word');
}

// ── Settings tab ──
function openSettings() {
  window.umami?.track('settings_opened');
  switchTab('settings');
  _syncAppChrome();
}
function closeSettings() {
  switchTab('learn');
}
function openAbout() {
  window.umami?.track('about_opened');
  document.getElementById('about-modal-overlay').classList.add('open');
}
function _trackUmamiEvent(name, payload) {
  try {
    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track(name, payload);
    }
  } catch (e) {}
}
function _publicAppUrl() {
  var canonical = document.querySelector('link[rel="canonical"]');
  var href = canonical && canonical.getAttribute('href');
  if (href) {
    try { return String(new URL(href, window.location.href)); }
    catch (e) {}
  }
  return 'https://wortschatzapp.de/';
}
function _canUseWebShare(shareData) {
  if (typeof navigator.share !== 'function') return false;
  if (typeof navigator.canShare === 'function') {
    try { return navigator.canShare(shareData); }
    catch (e) { return true; }
  }
  return true;
}
async function shareApp(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  var btn = document.getElementById('share-app-btn');
  var orig = btn ? btn.textContent : '';
  function flash(label) {
    if (!btn) return;
    btn.textContent = label;
    setTimeout(function() { btn.textContent = orig; }, 1800);
  }
  var shareData = {
    title: 'Wortschatz',
    text: 'Learn German with this app',
    url: _publicAppUrl()
  };

  if (!_canUseWebShare(shareData)) {
    _installLog('warn', 'settings share unavailable');
    flash(t('shareUnavailable'));
    return false;
  }

  try {
    // Call share immediately in the click handler task to preserve user activation.
    var sharePromise = navigator.share(shareData);
    _trackUmamiEvent('share_app');
    await sharePromise;
    return true;
  } catch (err) {
    if (err && err.name === 'AbortError') return false;
    _installLog('warn', 'settings share failed', err && (err.message || err.name || err));
    flash(t('shareFailed'));
    return false;
  }
}
function copyAppLink(opts) {
  opts = opts || {};
  if (opts.track !== false) _trackUmamiEvent('copy_link');
  var url = _publicAppUrl();
  var btn = document.getElementById(opts.buttonId || 'copy-link-btn');
  var orig = btn ? btn.textContent : '';
  var copiedLabel = opts.copiedLabel || t('linkCopied');
  function onCopied() {
    if (btn) {
      btn.textContent = copiedLabel;
      setTimeout(function() { btn.textContent = orig; }, 2000);
    }
  }
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(url).then(onCopied).catch(function() {
      var ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onCopied();
    });
  } else {
    var ta = document.createElement('textarea');
    ta.value = url;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    onCopied();
  }
}
function closeAbout() {
  document.getElementById('about-modal-overlay').classList.remove('open');
}
function openInstallGuide() {
  var overlay = document.getElementById('install-guide-overlay');
  var guide = document.querySelector('.install-guide');
  if (!overlay) return;
  if (_installGuideCloseTimer) {
    clearTimeout(_installGuideCloseTimer);
    _installGuideCloseTimer = null;
  }
  if (guide) {
    guide.style.transition = '';
    guide.style.transform = '';
  }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeInstallGuide() {
  var overlay = document.getElementById('install-guide-overlay');
  var guide = document.querySelector('.install-guide');
  if (!overlay) return;
  if (_installGuideCloseTimer) clearTimeout(_installGuideCloseTimer);
  overlay.classList.remove('open');
  _installGuideCloseTimer = setTimeout(function() {
    if (guide) {
      guide.style.transition = '';
      guide.style.transform = '';
    }
    document.body.style.overflow = '';
    _installGuideCloseTimer = null;
  }, 300);
}

// ── Custom language dropdown ──
var _LANG_LABELS = {
  de: '🇩🇪 Deutsch',
  en: '🇬🇧 English',
  tr: '🇹🇷 Türkçe',
  ru: '🇷🇺 Русский',
  uk: '🇺🇦 Українська',
  fa: '🇮🇷 فارسی',
  ar: '🇸🇦 العربية'
};
function _langDdSync(lang) {
  var lbl = document.getElementById('lang-dd-label');
  if (lbl) lbl.textContent = _LANG_LABELS[lang] || lang;
  var opts = document.querySelectorAll('#lang-dd-panel .lang-dd-option');
  opts.forEach(function(o){ o.classList.toggle('active', o.dataset.lang === lang); });
}
function _langDdToggle() {
  var dd = document.getElementById('lang-dd');
  if (dd) dd.classList.toggle('open');
}
function _langDdSelect(lang) {
  var dd = document.getElementById('lang-dd');
  if (dd) dd.classList.remove('open');
  setLang(lang);
}
document.addEventListener('click', function(e) {
  var dd = document.getElementById('lang-dd');
  if (dd && dd.classList.contains('open') && !dd.contains(e.target)) {
    dd.classList.remove('open');
  }
});

// ── Set language ──
function setLang(lang) {
  window.umami?.track('language_changed', { language: lang });
  LANG = lang;
  try { localStorage.setItem('dl_lang', lang); } catch(e) {}
  var sel = document.getElementById('lang-select');
  if (sel) sel.value = lang;
  _langDdSync(lang);
  ['de','en','tr','fa','ru','uk','ar'].forEach(function(l) {
    document.getElementById('opt-'+l).classList.toggle('active', lang===l);
  });
  var isRtl = lang==='fa' || lang==='ar';
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  document.body.classList.toggle('lang-fa', lang==='fa');
  document.body.classList.toggle('lang-ar', lang==='ar');
  document.body.classList.toggle('lang-rtl', isRtl);
  if (typeof window._syncSideRaysOrigins === 'function') window._syncSideRaysOrigins();
  document.querySelectorAll('.page-back-btn').forEach(function(btn) {
    btn.innerHTML = _backArrowSvg(isRtl);
  });
  applyTranslations();
  updateCounts();
  _renderCategoryGrid();
  _resyncTabLayoutAfterDirChange();
  _refreshDynamicUiForLang();
}

function _screenIsVisible(id) {
  if (id === 'screen-levels') return true;
  var tab = _pageOwnerTab(id);
  if (!tab) {
    if (_sharedPageIds && _sharedPageIds.indexOf(id) >= 0) return _getStackTop(_activeTab) === id;
    var el = document.getElementById(id);
    return !!(el && el.classList.contains('is-stack-top'));
  }
  return _getStackTop(tab) === id && tab === _activeTab;
}

function _resultsRefreshLang() {
  if (!_screenIsVisible('screen-results')) return;
  var total = (typeof ok === 'number' ? ok : 0) + (typeof no === 'number' ? no : 0);
  if (!total) return;
  var pct = Math.round(ok / total * 100);
  var titles = t('resultTitles');
  var title = pct >= 90 ? titles.great : pct >= 70 ? titles.good : pct >= 50 ? titles.ok : titles.low;
  var rTitle = document.getElementById('r-title');
  if (rTitle) rTitle.textContent = title;
  var rSub = document.getElementById('r-sub');
  if (rSub && typeof currentLevel !== 'undefined') rSub.textContent = t('resultSub')(currentLevel, pct);
}

function _rushSummaryRefreshLang() {
  if (!_screenIsVisible('screen-rush-summary')) return;
  var u = (typeof UI !== 'undefined' && UI[LANG]) ? UI[LANG] : UI.en;
  var title = document.getElementById('rush-summary-title');
  if (title) title.textContent = u.rushSummaryTitle;
  var record = document.getElementById('rush-summary-record');
  if (record && record.style.display !== 'none') record.textContent = u.rushSummaryRecord;
}

async function _wordModalRefreshLang() {
  var overlay = document.getElementById('word-modal-overlay');
  if (!overlay || !overlay.classList.contains('open') || !rwWordKey) return;
  var word = rwWordKey;
  var meta = metaFromWord(word);
  var content = document.getElementById('word-modal-content');
  if (!content) return;
  try {
    var data = await fetchWiktionary(word, meta.tc);
    await _prefetchLangMeta(word, meta);
    await _prefetchDefTranslations(data);
    content.innerHTML = renderWiktCard(data, meta);
    var chip = content.querySelector('.rw-form[onclick*="pickFormExample"]');
    if (chip) chip.click();
  } catch (e) {
    content.innerHTML = renderWiktCard({ found: false, word: word, ipa: '', sections: [] }, meta);
    _translateDefsInContainer(content);
    _autoFetchLangMeaning(word, content);
  }
}

function _refreshActiveOverlayScreenForLang() {
  if (_screenIsVisible('screen-quiz') && typeof _quizRefreshLang === 'function') {
    _quizRefreshLang();
    return;
  }
  if (_screenIsVisible('screen-swipe') && typeof _swipeRefreshLang === 'function') {
    _swipeRefreshLang();
    return;
  }
  if (_screenIsVisible('screen-random') && typeof _explorerRefreshLang === 'function') {
    _explorerRefreshLang();
    return;
  }
  if (_screenIsVisible('screen-practice') && typeof _practiceRefreshCards === 'function') {
    _practiceRefreshCards();
    return;
  }
  if (_screenIsVisible('screen-dictionary') && _dictLoaded && typeof _renderDictList === 'function') {
    var dictInput = document.getElementById('dict-search-input');
    _renderDictList(dictInput ? dictInput.value : '', true);
    return;
  }
  _resultsRefreshLang();
  _rushSummaryRefreshLang();
  var modal = document.getElementById('word-modal-overlay');
  if (modal && modal.classList.contains('open')) _wordModalRefreshLang();
}

function _refreshDynamicUiForLang() {
  learningProfileLastDetailHtml = '';

  if (typeof _statsTabReady !== 'undefined' && _statsTabReady && typeof renderLearningProfile === 'function') {
    renderLearningProfile();
  }
  if (typeof _practiceTabReady !== 'undefined' && _practiceTabReady) {
    if (typeof _renderPracticeSetupFilters === 'function') _renderPracticeSetupFilters();
    if (typeof _updatePracticeMatchCount === 'function') _updatePracticeMatchCount();
  }
  if (_dictLoaded && typeof _renderDictList === 'function' && !_screenIsVisible('screen-dictionary')) {
    var dictSearch = document.getElementById('dict-search-input');
    _renderDictList(dictSearch ? dictSearch.value : '', true);
  }
  if (typeof window.APP_AUTH_RENDER === 'function') window.APP_AUTH_RENDER();
  _refreshActiveOverlayScreenForLang();
}
window._refreshDynamicUiForLang = _refreshDynamicUiForLang;

// ── Apply all UI translations ──
function applyTranslations() {
  const u = new Proxy(UI[LANG], { get: function(obj, prop) { return obj[prop] !== undefined ? obj[prop] : UI.en[prop]; } });
  document.getElementById('st-title').textContent = u.settingsTitle;
  document.getElementById('st-lang-label').textContent = u.langLabel;
  document.getElementById('rw-banner-title').textContent = u.rwBannerTitle;
  document.getElementById('rw-banner-sub').textContent = u.rwBannerSub;
  document.getElementById('swipe-banner-title').textContent = u.swipeBannerTitle;
  document.getElementById('swipe-banner-sub').textContent = u.swipeBannerSub;
  // Level names
  const ln = u.levelNames;
  document.getElementById('swipe-ln-A1').textContent = ln.A1;
  document.getElementById('swipe-ln-A2').textContent = ln.A2;
  document.getElementById('swipe-ln-B1').textContent = ln.B1;
  // Results page
  document.getElementById('r-lbl-score').textContent = u.scoreLbl;
  document.getElementById('r-lbl-correct').textContent = u.correctLbl;
  document.getElementById('r-lbl-wrong').textContent = u.wrongLbl;
  document.getElementById('btn-play-again').textContent = u.playAgain;
  document.getElementById('btn-choose-level').textContent = u.chooseLevel;
  // Quiz buttons (back buttons are now in app-header, not in screens)
  document.getElementById('rw-screen-title').textContent = u.rwBannerTitle;
  document.getElementById('rw-screen-subtitle').textContent = u.rwBannerSub;
  document.getElementById('swipe-setup-screen-title').textContent = u.swipeSetupTitle;
  document.getElementById('swipe-setup-screen-subtitle').textContent = u.swipeSubtitle;
  document.getElementById('swipe-setup-title').textContent = u.swipeSetupTitle;
  document.getElementById('swipe-setup-sub').textContent = u.swipeSetupSub;
  document.getElementById('swipe-prepare-btn').textContent = u.prepareTen;
  document.getElementById('swipe-title').textContent = u.swipeSetupTitle;
  document.getElementById('swipe-subtitle').textContent = u.swipeSubtitle;
  // Account section label & adaptive tip
  document.getElementById('st-account-label').textContent = u.accountLabel;
  var shareLbl = document.getElementById('st-share-label');
  if (shareLbl) shareLbl.textContent = u.shareSectionLabel;
  var shareBtn = document.getElementById('share-app-btn');
  if (shareBtn) shareBtn.textContent = u.shareAppLabel;
  var copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) copyBtn.textContent = u.copyLinkLabel;
  document.getElementById('install-tip-title').textContent = u.installTipTitle;
  document.getElementById('install-tip-desc').textContent = u.installTipDesc;
  document.getElementById('install-guide-title').textContent = u.installGuideTitle;
  document.getElementById('install-step1-title').textContent = u.installStep1Title;
  document.getElementById('install-step2-title').textContent = u.installStep2Title;
  document.getElementById('install-guide-dismiss-btn').textContent = u.installClose;
  document.getElementById('at-title').textContent = u.tipTitle;
  document.getElementById('at-desc').textContent = u.tipDesc;
  // About & footer
  document.getElementById('st-about-btn').textContent = u.aboutTitle;
  document.getElementById('about-title').textContent = u.aboutTitle;
  document.getElementById('about-p1').textContent = u.aboutP1;
  document.getElementById('about-p2').innerHTML = u.aboutP2html;
  document.getElementById('about-p3').innerHTML = u.aboutP3html;
  document.getElementById('about-p4').textContent = u.aboutP4;
  document.getElementById('about-close-btn').textContent = u.aboutClose;
  document.getElementById('footer-msg').textContent = u.footerMsg;
  document.getElementById('footer-copy').textContent = u.footerCopy;
  // New banner titles
  var adaptiveBannerTitle = document.getElementById('adaptive-banner-title');
  if (adaptiveBannerTitle) adaptiveBannerTitle.textContent = u.adaptiveBannerTitle;
  var adaptiveBannerSub = document.getElementById('adaptive-banner-sub');
  if (adaptiveBannerSub) adaptiveBannerSub.textContent = u.adaptiveBannerSub;
  var v2Title = document.getElementById('adaptive-v2-banner-title');
  if (v2Title) v2Title.textContent = u.adaptiveV2BannerTitle;
  var v2Sub = document.getElementById('adaptive-v2-banner-sub');
  if (v2Sub) v2Sub.textContent = u.adaptiveV2BannerSub;
  if (typeof window._adaptiveV2RefreshBadge === 'function') window._adaptiveV2RefreshBadge();
  var rushTitle = document.getElementById('rush-banner-title');
  if (rushTitle) rushTitle.textContent = u.rushBannerTitle;
  if (typeof window._rushRefreshBanner === 'function') window._rushRefreshBanner();
  var lpTitle = document.getElementById('learning-profile-title');
  if (lpTitle) lpTitle.textContent = _lp('title');
  var lpbTitle = document.getElementById('learning-profile-banner-title');
  if (lpbTitle) lpbTitle.textContent = _lp('title');
  var rushAgain = document.getElementById('btn-rush-again');
  if (rushAgain) rushAgain.textContent = u.rushSummaryAgain;
  var rushHome = document.getElementById('btn-rush-home');
  if (rushHome) rushHome.textContent = u.rushSummaryHome;
  var rushLblScore = document.getElementById('rush-lbl-score');
  if (rushLblScore) rushLblScore.textContent = u.rushLblScore;
  var rushLblOk = document.getElementById('rush-lbl-correct');
  if (rushLblOk) rushLblOk.textContent = u.rushLblCorrect;
  var rushLblNo = document.getElementById('rush-lbl-wrong');
  if (rushLblNo) rushLblNo.textContent = u.rushLblWrong;
  var rushLblStreak = document.getElementById('rush-lbl-streak');
  if (rushLblStreak) rushLblStreak.textContent = u.rushLblStreak;
  var rushLblTime = document.getElementById('rush-lbl-time');
  if (rushLblTime) rushLblTime.textContent = u.rushLblTime;
  lpTitle = document.getElementById('learning-profile-title');
  if (lpTitle) lpTitle.textContent = _lp('title');
  var pBannerTitle = document.getElementById('practice-banner-title');
  if (pBannerTitle) pBannerTitle.textContent = u.practiceBannerTitle;
  var pBannerSub = document.getElementById('practice-banner-sub');
  if (pBannerSub) pBannerSub.textContent = u.practiceBannerSub;
  document.getElementById('theme-banner-title').textContent = u.themeBannerTitle;
  document.getElementById('theme-banner-sub').textContent = u.themeBannerSub;
  // Adaptive setup screen
  document.getElementById('adaptive-setup-screen-title').textContent = u.adaptiveSetupTitle;
  document.getElementById('adaptive-setup-screen-subtitle').textContent = u.adaptiveSetupSubtitle;
  var aln = u.levelNames;
  document.getElementById('adaptive-ln-A1').textContent = aln.A1;
  document.getElementById('adaptive-ln-A2').textContent = aln.A2;
  document.getElementById('adaptive-ln-B1').textContent = aln.B1;
  document.getElementById('adaptive-launch-btn').textContent = u.prepareTen;
  // Theme select screen
  document.getElementById('theme-screen-title').textContent = u.themeSelectTitle;
  document.getElementById('theme-screen-subtitle').textContent = u.themeSelectSubtitle;
  // Practice setup screen
  document.getElementById('practice-setup-screen-title').textContent = u.practiceSetupTitle;
  document.getElementById('practice-setup-screen-subtitle').textContent = u.practiceSubtitle;
  document.getElementById('practice-title').textContent = u.practiceSetupTitle;
  document.getElementById('practice-subtitle').textContent = u.practiceSubtitle;
  document.getElementById('practice-prepare-btn').textContent = u.prepareTen;
  var pln = u.levelNames;
  document.getElementById('practice-ln-A1').textContent = pln.A1;
  document.getElementById('practice-ln-A2').textContent = pln.A2;
  document.getElementById('practice-ln-B1').textContent = pln.B1;
  var pfl = document.getElementById('practice-filter-difficulty-label');
  if (pfl) pfl.textContent = u.practiceFilterDifficulty;
  pfl = document.getElementById('practice-filter-type-label');
  if (pfl) pfl.textContent = u.practiceFilterType;
  pfl = document.getElementById('practice-filter-article-label');
  if (pfl) pfl.textContent = u.practiceFilterArticle;
  pfl = document.getElementById('practice-filter-topics-label');
  if (pfl) pfl.textContent = u.practiceFilterTopics;
  pfl = document.getElementById('practice-clear-filters-btn');
  if (pfl) pfl.textContent = u.practiceClearFilters;
  pfl = document.getElementById('practice-match-label');
  if (pfl) pfl.textContent = u.practiceWordCount;
  pfl = document.getElementById('practice-match-hint');
  if (pfl) pfl.textContent = u.practiceNoWordsHint;
  // Dictionary static chrome (list refresh handled by _refreshDynamicUiForLang)
  var _dbt = document.getElementById('dict-banner-title');
  if (_dbt) _dbt.textContent = u.dictBannerTitle;
  var _dbs = document.getElementById('dict-banner-sub');
  if (_dbs) _dbs.textContent = u.dictBannerSub;
  document.getElementById('dict-screen-title').textContent = u.dictScreenTitle;
  if (!_dictLoaded) document.getElementById('dict-screen-subtitle').textContent = u.dictScreenSubtitle;
  document.getElementById('dict-search-input').placeholder = u.dictFilterPlaceholder;
  var _dlt = document.getElementById('dict-loading-text');
  if (_dlt) _dlt.textContent = u.dictLoading;
  // Offline screen
  var _os = document.getElementById('offline-title');
  if (_os) _os.textContent = u.offlineTitle;
  var _om = document.getElementById('offline-message');
  if (_om) _om.textContent = u.offlineMessage;
  var _or = document.getElementById('offline-refresh-btn');
  if (_or) _or.textContent = u.offlineRefreshBtn;
  var navTabs = u.navTabs || UI.en.navTabs;
  function _navTabLabel(tabId) {
    if (!navTabs) return tabId;
    if (tabId === 'learn') return navTabs.practice || tabId;
    if (tabId === 'practice') return navTabs.learn || tabId;
    return navTabs[tabId] || tabId;
  }
  TAB_ORDER.forEach(function(tabId) {
    var text = _navTabLabel(tabId);
    var lbl = document.querySelector('#bottom-tab-' + tabId + ' .bottom-tab-label');
    var goldLbl = document.querySelector('#bottom-tab-gold-overlay [data-tab="' + tabId + '"] .bottom-tab-label');
    if (lbl) lbl.textContent = text;
    if (goldLbl) goldLbl.textContent = text;
  });
  _refreshInstallGuideContent();
  _resyncPageChromeIfVisible();
}

function _resyncPageChromeIfVisible() {
  var pageId = _activeFlowPageId && _activeFlowPageId();
  if (pageId) _syncPageChrome(pageId);
}

function _setInstallStep1Text() {
  _refreshInstallGuideContent();
}

function _isIosVisitor() {
  var ua = window.navigator.userAgent || '';
  var platform = window.navigator.platform || '';
  var touchMac = platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || touchMac;
}

function _detectStandaloneMode() {
  var mq = window.matchMedia ? window.matchMedia('(display-mode: standalone)') : null;
  return !!((mq && mq.matches) || window.navigator.standalone);
}

function _canTriggerShareSheet() {
  return typeof navigator.share === 'function';
}

function _installGuideText(key) {
  var copy = {
    en: {
      guideSub: 'Use your browser\'s Share menu to add the app to your home screen.',
      step1Lead: 'Tap the ',
      step1Tail: ' Share button in your browser',
      step1Or: ', or ',
      step1ClickHere: 'tap here',
      step2: 'Then tap Add to Home Screen and confirm to install.'
    },
    tr: {
      guideSub: 'Uygulamayi ana ekraniniza eklemek için tarayicinizin Paylas menüsünü kullanin.',
      step1Lead: 'Tarayicinizdaki ',
      step1Tail: ' Paylas dügmesine dokunun',
      step1Or: ' ya da ',
      step1ClickHere: 'buraya dokunun',
      step2: 'Ardindan Ana Ekrana Ekle\'ye dokunun ve kurulumu onaylayin.'
    },
    fa: {
      guideSub: 'برای افزودن برنامه به صفحه اصلی، از منوی اشتراک گذاری مرورگر خود استفاده کنید.',
      step1Lead: 'روی دکمه ',
      step1Tail: ' اشتراک گذاری در مرورگر خود بزنید',
      step1Or: '، یا ',
      step1ClickHere: 'اینجا بزنید',
      step2: 'سپس Add to Home Screen را بزنید و نصب را تایید کنید.'
    },
    ru: {
      guideSub: 'Используйте меню Поделиться в вашем браузере, чтобы добавить приложение на главный экран.',
      step1Lead: 'Нажмите кнопку ',
      step1Tail: ' Поделиться в вашем браузере',
      step1Or: ' или ',
      step1ClickHere: 'нажмите здесь',
      step2: 'Затем нажмите Add to Home Screen и подтвердите установку.'
    },
    uk: {
      guideSub: 'Скористайтеся меню Поділитися у вашому браузері, щоб додати застосунок на головний екран.',
      step1Lead: 'Натисніть кнопку ',
      step1Tail: ' Поділитися у вашому браузері',
      step1Or: ' або ',
      step1ClickHere: 'натисніть тут',
      step2: 'Потім натисніть Add to Home Screen і підтвердьте встановлення.'
    },
    ar: {
      guideSub: 'استخدم قائمة المشاركة في متصفحك لإضافة التطبيق إلى الشاشة الرئيسية.',
      step1Lead: 'اضغط على زر ',
      step1Tail: ' المشاركة في متصفحك',
      step1Or: '، أو ',
      step1ClickHere: 'اضغط هنا',
      step2: 'ثم اضغط Add to Home Screen وأكد التثبيت.'
    }
  };
  var langCopy = copy[LANG] || copy.en;
  return langCopy[key] || copy.en[key] || '';
}

function _refreshInstallGuideContent() {
  var step1 = document.getElementById('install-step1-desc');
  var step2 = document.getElementById('install-step2-desc');
  if (!step1 || !step2) return;

  step1.innerHTML = '';
  step1.appendChild(document.createTextNode(_installGuideText('step1Lead')));
  var icon = document.createElement('span');
  icon.className = 'share-glyph-inline';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 15V4" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 7.5L12 4l3.5 3.5" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 13.5v4.3A1.2 1.2 0 0 0 6.2 19h11.6a1.2 1.2 0 0 0 1.2-1.2v-4.3" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  step1.appendChild(icon);
  step1.appendChild(document.createTextNode(_installGuideText('step1Tail')));
  step1.appendChild(document.createTextNode('.'));

  step2.textContent = _installGuideText('step2');
}

function refreshInstallTip() {
  var tip = document.getElementById('install-tip');
  if (!tip) return;
  if (_isCapacitorNativeRuntime) {
    tip.classList.add('hidden');
    return;
  }
  _isStandaloneMode = _detectStandaloneMode();
  var shouldShow = false;
  if (!_isStandaloneMode && !_installDismissed) {
    if (_isIosVisitor()) shouldShow = true;
    else if (_installPromptReady) shouldShow = true;
  }
  var wasHidden = tip.classList.contains('hidden');
  tip.classList.toggle('hidden', !shouldShow);
  if (shouldShow && wasHidden) window.umami?.track('install_banner_shown');
}

window.refreshInstallTip = refreshInstallTip;

async function triggerIosShareMenu(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  _installLog('log', 'share requested', {
    shareAvailable: _canTriggerShareSheet(),
    currentUrl: String(window.location.href),
    userActivation: !!(navigator.userActivation && navigator.userActivation.isActive)
  });
  if (!_canTriggerShareSheet()) return false;
  try {
    var shareData = {
      title: document.title,
      url: String(window.location.href)
    };
    await navigator.share(shareData);
    _installLog('log', 'share sheet opened');
    return true;
  } catch (err) {
    _installLog('warn', 'share failed', err && (err.message || err.name || err));
    return false;
  }
}

window.triggerIosShareMenu = triggerIosShareMenu;

async function handleInstallCTA() {
  if (_detectStandaloneMode()) return;
  if (_isIosVisitor()) {
    window.umami?.track('install_guide_opened', { platform: 'ios' });
    openInstallGuide();
    return;
  }
  if (!_deferredInstallPrompt) return;
  try {
    window.umami?.track('install_prompt_shown', { platform: 'android' });
    _deferredInstallPrompt.prompt();
    var choice = await _deferredInstallPrompt.userChoice;
    if (choice && choice.outcome === 'accepted') {
      window.umami?.track('install_accepted');
      _writeInstallDismissed(true);
    }
  } catch (e) {
  } finally {
    _deferredInstallPrompt = null;
    _installPromptReady = false;
    refreshInstallTip();
  }
}

window.handleInstallCTA = handleInstallCTA;

function _initInstallExperience() {
  if (_installExperienceInitialized) return;
  _installExperienceInitialized = true;
  _installLog('log', 'init install experience', { readyState: document.readyState });
  _installDismissed = _readInstallDismissed();
  _isStandaloneMode = _detectStandaloneMode() || _isCapacitorNativeRuntime;

  if (!_isCapacitorNativeRuntime && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function() {});
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      window.location.reload();
    });
  }

  if (!_isCapacitorNativeRuntime) {
    window.addEventListener('beforeinstallprompt', function(e) {
      e.preventDefault();
      _deferredInstallPrompt = e;
      _installPromptReady = true;
      refreshInstallTip();
    });

    window.addEventListener('appinstalled', function() {
      _deferredInstallPrompt = null;
      _installPromptReady = false;
      _writeInstallDismissed(true);
      closeInstallGuide();
      refreshInstallTip();
    });

    if (window.matchMedia) {
      _installStateMedia = window.matchMedia('(display-mode: standalone)');
      if (_installStateMedia && _installStateMedia.addEventListener) {
        _installStateMedia.addEventListener('change', refreshInstallTip);
      } else if (_installStateMedia && _installStateMedia.addListener) {
        _installStateMedia.addListener(refreshInstallTip);
      }
    }
  }

  window.addEventListener('pageshow', refreshInstallTip);
  window.addEventListener('focus', refreshInstallTip);
  refreshInstallTip();
  _wireInstallShareActions();
}

function _ensureHomeLayout() {
  /* layout now driven by bottom tabs */
}

window._ensureHomeLayout = _ensureHomeLayout;

function _wireInstallShareActions() {
  var overlay = document.getElementById('install-guide-overlay');
  if (!overlay) {
    _installLog('warn', 'install guide overlay not found');
    return;
  }
  if (_installShareActionsBound) return;
  _installShareActionsBound = true;
  _installLog('log', 'share actions bound');
}



// ── Card counts — no longer shown on level cards ──
function updateCounts() { /* word counts removed from UI */ }

// ── Unified vocabulary (vocabulary.v2.min.json — single source for all modes) ──
var CSV_QUIZ_DATA = { A1: null, A2: null, B1: null };
var _faCsvMap = {};
var _arCsvMap = {};

function _loadText(url) {
  return fetch(url)
    .then(function(r){
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .catch(function(fetchErr){
      return new Promise(function(resolve, reject) {
        try {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status === 0 && xhr.responseText)) {
              resolve(xhr.responseText);
            } else {
              reject(fetchErr || new Error('Load failed'));
            }
          };
          xhr.onerror = function() { reject(fetchErr || new Error('Load failed')); };
          xhr.send();
        } catch (xhrErr) {
          reject(fetchErr || xhrErr);
        }
      });
    });
}

function _loadCSVLevel(lv) {
  lv = String(lv || '').toUpperCase();
  if (CSV_QUIZ_DATA[lv] && CSV_QUIZ_DATA[lv].length) {
    return Promise.resolve(CSV_QUIZ_DATA[lv]);
  }
  return _loadV2Vocab().then(function () {
    if (!CSV_QUIZ_DATA[lv] || !CSV_QUIZ_DATA[lv].length) {
      throw new Error('No vocabulary rows for ' + lv);
    }
    return CSV_QUIZ_DATA[lv];
  });
}

function _loadAllCSV() {
  return _loadV2Vocab();
}

// ── Unified V2 vocabulary (ALL level) ──
var V2_VOCAB = null;
var V2_QUIZ_ROWS = null;
var _v2LoadPromise = null;

var _V2_TYPE_LABELS = { N: 'Noun', V: 'Verb', A: 'Adjective', P: 'Phrase', D: 'Adverb', '#': 'Number', W: 'Word' };
var _V2_ARTICLE_LABELS = { r: 'der', e: 'die', s: 'das' };
var _V2_TR_KEYS = ['translation_en', 'translation_tr', 'translation_fa', 'translation_ru', 'translation_uk', 'translation_ar'];

function _v2BandFromId(id) {
  var d = String(id || '')[0];
  if (d === '2') return 'A2';
  if (d === '3') return 'B1';
  return 'A1';
}

function _v2ToUnifiedId(level, srcId) {
  var digit = level === 'A1' ? '1' : level === 'A2' ? '2' : '3';
  return String(parseInt(String(digit) + String(srcId), 10));
}

function _v2IsUnifiedId(id) {
  var c = String(id || '')[0];
  return c === '1' || c === '2' || c === '3';
}

function _v2VocabHasId(id) {
  return !!(V2_VOCAB && V2_VOCAB[String(id)]);
}

function _v2CanonicalProgressId(id) {
  var sid = String(id);
  if (!V2_VOCAB) return sid;
  while (!_v2VocabHasId(sid) && _v2IsUnifiedId(sid) && sid.length > 1) {
    var prefix = sid[0];
    var stripped = sid.slice(1);
    if (!_v2IsUnifiedId(stripped) || stripped[0] !== prefix) break;
    sid = stripped;
  }
  return sid;
}

function _mergeV2WordStats(a, b) {
  a = a || {};
  b = b || {};
  return {
    failScore: Math.max(Number(a.failScore) || 0, Number(b.failScore) || 0),
    seenCount: Math.max(Number(a.seenCount) || 0, Number(b.seenCount) || 0),
    correctCount: Math.max(Number(a.correctCount) || 0, Number(b.correctCount) || 0),
    lastSeenQuiz: Math.max(Number(a.lastSeenQuiz) || 0, Number(b.lastSeenQuiz) || 0),
    themeSeenCount: Math.max(Number(a.themeSeenCount) || 0, Number(b.themeSeenCount) || 0),
    adaptiveSeenCount: Math.max(Number(a.adaptiveSeenCount) || 0, Number(b.adaptiveSeenCount) || 0)
  };
}

function _v2RepairProgressWordIds(progress) {
  if (!progress || !progress.words) return false;
  var words = progress.words;
  var nextWords = {};
  var changed = false;
  Object.keys(words).forEach(function(id) {
    var canonical = _v2CanonicalProgressId(id);
    if (canonical !== String(id)) changed = true;
    if (nextWords[canonical]) changed = true;
    nextWords[canonical] = _mergeV2WordStats(nextWords[canonical], words[id]);
  });
  if (Object.keys(nextWords).length !== Object.keys(words).length) changed = true;
  progress.words = nextWords;
  if (Array.isArray(progress.recentWords)) {
    var seen = {};
    var rw = [];
    progress.recentWords.forEach(function(id) {
      var c = _v2CanonicalProgressId(id);
      if (String(id) !== c) changed = true;
      if (!seen[c]) {
        seen[c] = true;
        rw.push(c);
      } else {
        changed = true;
      }
    });
    progress.recentWords = rw;
  }
  return changed;
}

function _syncCsvQuizDataFromV2() {
  if (!V2_QUIZ_ROWS) return;
  CSV_QUIZ_DATA.A1 = [];
  CSV_QUIZ_DATA.A2 = [];
  CSV_QUIZ_DATA.B1 = [];
  _faCsvMap = {};
  _arCsvMap = {};
  _csvRandPool = null;
  V2_QUIZ_ROWS.forEach(function(row) {
    var lv = row.level || _v2BandFromId(row.id);
    row.level = lv;
    CSV_QUIZ_DATA[lv].push(row);
    var k = normKey(row.word);
    if (row.translation_fa && row.translation_fa.trim() && !_faCsvMap[k]) {
      _faCsvMap[k] = row.translation_fa.trim();
    }
    if (row.translation_ar && row.translation_ar.trim() && !_arCsvMap[k]) {
      _arCsvMap[k] = row.translation_ar.trim();
    }
  });
}

function _v2MigrateLevelProgressIds(progress, level) {
  if (!progress || !progress.words || !level) return false;
  if (level !== 'A1' && level !== 'A2' && level !== 'B1') return false;
  if (progress.vocabIdFormat === 'unified') return false;
  var words = progress.words;
  var nextWords = {};
  Object.keys(words).forEach(function(id) {
    var uid = _v2ToUnifiedId(level, String(id));
    var w = words[id] || {};
    if (!nextWords[uid]) {
      nextWords[uid] = {
        failScore: Number(w.failScore) || 0,
        seenCount: Number(w.seenCount) || 0,
        correctCount: Number(w.correctCount) || 0
      };
      return;
    }
    var cur = nextWords[uid];
    cur.failScore = Math.max(Number(cur.failScore) || 0, Number(w.failScore) || 0);
    cur.seenCount = Math.max(Number(cur.seenCount) || 0, Number(w.seenCount) || 0);
    cur.correctCount = Math.max(Number(cur.correctCount) || 0, Number(w.correctCount) || 0);
  });
  progress.words = nextWords;
  if (progress.recentWords) {
    progress.recentWords = progress.recentWords.map(function(id) {
      return _v2ToUnifiedId(level, String(id));
    });
  }
  progress.vocabIdFormat = 'unified';
  return true;
}

function _v2EntryToRow(id, entry) {
  var tr = entry[3] || [];
  var uid = String(id);
  var row = {
    id: uid,
    level: _v2BandFromId(uid),
    word: (entry[8] || entry[0] || '').trim() || entry[0] || '',
    word_type: _V2_TYPE_LABELS[entry[1]] || 'Word',
    article: _V2_ARTICLE_LABELS[entry[2]] || '',
    difficulty: String(entry[4] || ''),
    category_id: String(entry[5] || ''),
    entry_type: 'main',
    example_de: (entry[6] || '').trim(),
    plural: (entry[7] || '').trim()
  };
  _V2_TR_KEYS.forEach(function(key, idx) {
    row[key] = (tr[idx] || '').trim();
  });
  return row;
}

function _loadV2Vocab() {
  if (V2_VOCAB) return Promise.resolve(V2_VOCAB);
  if (_v2LoadPromise) return _v2LoadPromise;
  _v2LoadPromise = _loadText('data/vocabulary.v2.min.json')
    .then(function(txt) {
      var parsed = JSON.parse(txt);
      var vocabKeys = Object.keys(parsed);
      V2_VOCAB = parsed;
      V2_QUIZ_ROWS = vocabKeys.map(function(id) {
        return _v2EntryToRow(id, parsed[id]);
      }).filter(function(r) {
        return r.translation_en && r.translation_en.trim();
      });
      if (!V2_QUIZ_ROWS.length) throw new Error('Vocabulary parsed but produced 0 quiz rows');
      if (V2_QUIZ_ROWS.length !== vocabKeys.length && console && console.warn) {
        console.warn('[vocab] quiz rows', V2_QUIZ_ROWS.length, 'vs vocabulary.v2.min.json keys', vocabKeys.length);
      }
      _syncCsvQuizDataFromV2();
      return V2_VOCAB;
    })
    .catch(function(err) {
      _v2LoadPromise = null;
      throw err;
    });
  return _v2LoadPromise;
}

window._loadV2Vocab = _loadV2Vocab;
window._v2BandFromId = _v2BandFromId;
window._v2ToUnifiedId = _v2ToUnifiedId;
window._v2IsUnifiedId = _v2IsUnifiedId;
window._v2MigrateLevelProgressIds = _v2MigrateLevelProgressIds;
window._v2CanonicalProgressId = _v2CanonicalProgressId;
window._v2RepairProgressWordIds = _v2RepairProgressWordIds;

function _v2ResolveRowId(level, id) {
  var sid = String(id);
  if (level === 'ALL') return sid;
  var row = _v2RowLookup(level, sid);
  return row ? String(row.id) : _v2ToUnifiedId(level, sid);
}

function _v2RowLookup(level, id) {
  var sid = String(id);
  if (level === 'ALL') {
    sid = _v2CanonicalProgressId(sid);
    if (typeof window._v2RowById === 'function') {
      var byId = window._v2RowById(sid);
      if (byId) return byId;
    }
    return (V2_QUIZ_ROWS || []).find(function(r) { return String(r.id) === sid; }) || null;
  }
  var rows = CSV_QUIZ_DATA[level] || [];
  var row = rows.find(function(r) { return String(r.id) === sid; });
  if (row) return row;
  var uid = _v2ToUnifiedId(level, sid);
  if (uid !== sid) {
    return rows.find(function(r) { return String(r.id) === uid; }) || null;
  }
  return null;
}

window._v2RowLookup = _v2RowLookup;

window._v2AllQuizRows = function() {
  return (V2_QUIZ_ROWS || []).slice();
};

window._v2RowById = function(id) {
  if (!V2_VOCAB || id == null) return null;
  var entry = V2_VOCAB[String(id)];
  return entry ? _v2EntryToRow(String(id), entry) : null;
};

// ── Get display label for a CSV row in the active language ──
// Correctness is NEVER determined by comparing this text.
// The row's unique `id` field is used for correct-answer checking instead,
// so translations in any language can never accidentally swap answers.
function _csvRowDisplay(row) {
  if (LANG === 'en' || LANG === 'de') return row.translation_en;
  if (LANG === 'tr') return row.translation_tr || row.translation_en;
  if (LANG === 'ru') return row.translation_ru || row.translation_en;
  if (LANG === 'uk') return row.translation_uk || row.translation_en;
  if (LANG === 'fa') return row.translation_fa || row.translation_en;
  if (LANG === 'ar') return row.translation_ar || row.translation_en;
}

// ── Build quiz queue from CSV rows ──
function buildQueue(level) {
  var pool = (CSV_QUIZ_DATA[level] || []).filter(function(r){
    return r.entry_type === 'main' && r.translation_en && r.translation_en.trim();
  });
  if (!pool.length) return [];

  var selected = shuffle(pool.slice()).slice(0, QUIZ_LEN);

  return selected.map(function(row) {
    var usedIds = {}; usedIds[row.id] = true;
    var usedEn  = {}; usedEn[row.translation_en.trim()] = true;
    var distractors = [];

    shuffle(pool.slice()).forEach(function(d) {
      if (distractors.length >= 6) return;
      if (usedIds[d.id]) return;
      var en = d.translation_en.trim();
      if (en && !usedEn[en]) {
        usedEn[en] = true; usedIds[d.id] = true;
        distractors.push(d);
      }
    });
    return { _row: row, _distractors: distractors };
  });
}

async function startLevel(lv) {
  currentThemeCategoryId = 0; // clear theme quiz state
  currentLevel = lv;
  var _ov = document.getElementById('quiz-prep-overlay');

  // Ensure vocabulary data is loaded
  if (!CSV_QUIZ_DATA[lv] || !CSV_QUIZ_DATA[lv].length) {
    _ov.classList.add('active');
    try {
      await _loadCSVLevel(lv);
    } catch (err) {
      _ov.classList.remove('active');
      var msg = t('errLoadQuizLevel')(lv);
      if (window.location.protocol === 'file:') {
        msg += t('errFileProtocol');
      }
      if (err && err.message) msg += '\n\n' + err.message;
      alert(msg);
      return;
    }
    _ov.classList.remove('active');
  }

  queue = buildQueue(lv);
  if (!queue.length) { alert(t('errNoCards')); return; }
  idx = 0; ok = 0; no = 0;

  // All languages (including Arabic) use CSV columns directly — no API pre-fetch needed.

  show('screen-quiz');
  renderCard();
}

function renderCard() {
  answered = false;
  if (idx === 0 && queue.length &&
      _screenIsVisible('screen-quiz')) {
    _quizTimerStart();
  }
  var card  = queue[idx];
  var total = queue.length;
  var row   = card._row;

  document.getElementById('prog').style.width = (idx / total * 100) + '%';
  document.getElementById('sc-ok').textContent  = formatNum(ok);
  document.getElementById('sc-no').textContent  = formatNum(no);
  document.getElementById('hud-pos').textContent = formatNum(idx + 1) + '/' + formatNum(total);

  // Word-type badge — from CSV word_type column (Noun, Verb, Adjective, etc.)
  var badge = document.getElementById('tbadge');
  var wt = row.word_type || 'Word';
  badge.textContent = wt;
  badge.className = 'tbadge glass glass-pill glass-chrome '
    + (wt === 'Noun'       ? 'noun'
     : wt === 'Verb'       ? 'verb'
     : (wt === 'Adjective' || wt === 'Adj') ? 'adj'
     : 'grammar');

  document.getElementById('tlevel').textContent = t('levelLabel') + ' ' + currentLevel;
  var mb = document.getElementById('tmode-badge');
  mb.textContent = t('vocabBadge');
  mb.className = 'tmode-badge glass glass-pill glass-chrome vocab';

  document.getElementById('cquestion').textContent = t('quizQuestion');

  // Show article + word for nouns (e.g. "der Hund"); plain word for verbs/others
  document.getElementById('cmain').textContent = (row.article ? row.article + ' ' : '') + expandOptional(row.word);

  // Sub-line: example sentence from CSV
  document.getElementById('csub').textContent = (row.example_de && row.example_de.trim()) ? row.example_de.trim() : '';

  // Each choice button carries the CSV row id as its identity.
  // Correctness is checked by comparing ids — NEVER by comparing displayed strings.
  // This makes the quiz translation-safe: even if labels differ between languages,
  // the right answer is always the button whose id matches the question row's id.
  var correctId     = row.id;
  var allChoiceRows = shuffle([row].concat(card._distractors.slice(0, 3)));

  var choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  allChoiceRows.forEach(function(choiceRow) {
    var btn = document.createElement('button');
    btn.className = 'cbtn glass glass-tile glass-interactive';
    btn.dataset.csvId = choiceRow.id;
    btn.textContent   = _csvRowDisplay(choiceRow);
    btn.onclick = (function(b, cId, corrId) {
      return function() { pick(b, cId, corrId); };
    })(btn, choiceRow.id, correctId);
    choicesEl.appendChild(btn);
  });

  // All languages use CSV columns directly — no per-choice API retry needed.

  var fb = document.getElementById('feedback');
  fb.className = 'feedback glass glass-pill glass-chrome'; fb.textContent = '';
  document.getElementById('next-btn').textContent = t('next');
  document.getElementById('next-btn').classList.remove('show');
  _syncPageChrome('screen-quiz');
}

function pick(btn, selectedId, correctId) {
  if (answered) return;
  answered = true;
  document.querySelectorAll('.cbtn').forEach(function(b){ b.classList.add('disabled'); });
  var fb = document.getElementById('feedback');

  // Row-id comparison — correct in every language, no string-matching needed
  if (selectedId === correctId) {
    btn.classList.add('correct'); btn.classList.remove('disabled');
    ok++; btn.classList.add('pop');
    fb.textContent = t('correct');
    fb.className = 'feedback glass glass-pill glass-chrome c show';
    if (currentThemeCategoryId > 0 && queue[idx] && queue[idx]._row) {
      _themeAnswers.push({
        wordId: String(queue[idx]._row.id),
        correct: true,
        categoryId: currentThemeCategoryId
      });
    }
  } else {
    btn.classList.add('wrong'); btn.classList.remove('disabled');
    no++;
    var correctText = '';
    document.querySelectorAll('.cbtn').forEach(function(b) {
      if (b.dataset.csvId === correctId) {
        b.classList.add('correct'); b.classList.remove('disabled');
        correctText = b.textContent;
      }
    });
    fb.innerHTML = t('wrong')(correctText);
    fb.className = 'feedback glass glass-pill glass-chrome w show';
    if (currentThemeCategoryId > 0 && queue[idx] && queue[idx]._row) {
      _themeAnswers.push({
        wordId: String(queue[idx]._row.id),
        correct: false,
        categoryId: currentThemeCategoryId
      });
    }
  }
  document.getElementById('sc-ok').textContent = formatNum(ok);
  document.getElementById('sc-no').textContent = formatNum(no);
  document.getElementById('next-btn').classList.add('show');
  _quizTimerTouch();
}

function nextCard(){
  _quizTimerTouch();
  idx++;
  if(idx>=queue.length)showResults();
  else renderCard();
}

function showResults(){
  const total=queue.length,pct=Math.round(ok/total*100);
  const rt=t('resultTitles');
  let emoji='😅',title=rt.low;
  if(pct>=90){emoji='🏆';title=rt.great;}
  else if(pct>=70){emoji='🎉';title=rt.good;}
  else if(pct>=50){emoji='👍';title=rt.ok;}
  var elapsedSeconds = _quizTimerStopAndGetSeconds();
  var statsPayload = {
    mode: currentThemeCategoryId > 0 ? 'theme' : (currentLevel === 'ALL' ? 'adaptive_v2' : 'adaptive'),
    categoryId: currentThemeCategoryId || null,
    correctAnswers: ok,
    incorrectAnswers: no,
    studyTimeSeconds: elapsedSeconds
  };
  if (currentThemeCategoryId > 0) {
    if (typeof window._adaptiveV2ApplyThemeResults === 'function') {
      window._adaptiveV2ApplyThemeResults(_themeAnswers.slice(), statsPayload);
    }
  } else {
    if (typeof window.APP_AUTH_RECORD_QUIZ_STATS === 'function') {
      window.APP_AUTH_RECORD_QUIZ_STATS(statsPayload);
    }
    if (currentLevel === 'ALL' && typeof window._adaptiveV2RecordQuizStats === 'function') {
      window._adaptiveV2RecordQuizStats(statsPayload);
    }
  }
  window.umami?.track('quiz_completed', { mode: currentThemeCategoryId > 0 ? 'theme' : (currentLevel === 'ALL' ? 'adaptive_v2' : 'adaptive'), level: currentLevel, score_pct: pct, correct: ok, wrong: no, total: total });
  document.getElementById('r-emoji').textContent=emoji;
  document.getElementById('r-title').textContent=title;
  document.getElementById('r-score').textContent=formatNum(ok)+'/'+formatNum(total);
  document.getElementById('r-sub').textContent=t('resultSub')(currentLevel,pct);
  document.getElementById('r-pct').textContent=formatNum(pct)+'%';
  document.getElementById('r-ok').textContent=formatNum(ok);
  document.getElementById('r-no').textContent=formatNum(no);
  document.getElementById('prog').style.width='100%';
  show('screen-results');
}

function restartLevel(){
  if (currentThemeCategoryId) startThemeQuiz(currentThemeCategoryId);
  else startLevel(currentLevel);
}
function goHome(){
  _quizTimerAbandon();
  switchTab('learn');
  _resetTabStack('learn');
  _syncAppChrome();
}
function _quizSessionActive(){
  var el=document.getElementById('screen-quiz');
  if(!_screenIsVisible('screen-quiz'))return false;
  if(typeof window._rushIsActive==='function'&&window._rushIsActive())return true;
  if(currentThemeCategoryId>0)return true;
  if(typeof window._adaptiveV2IsActive==='function'&&window._adaptiveV2IsActive())return true;
  return false;
}
function _abortQuizSession() {
  _quizTimerAbandon();
  currentThemeCategoryId = 0;
  _quizReturnScreen = 'screen-levels';
}
function _pageLeaveRequiresConfirm(pageId) {
  return pageId === 'screen-quiz' && _quizSessionActive();
}
function _confirmPageLeave(pageId) {
  return new Promise(function(resolve) {
    if (!_pageLeaveRequiresConfirm(pageId)) {
      resolve(true);
      return;
    }
    var isRush = typeof window._rushIsActive === 'function' && window._rushIsActive();
    if (typeof window.appDialog !== 'object' || typeof window.appDialog.confirm !== 'function') {
      resolve(true);
      return;
    }
    window.appDialog.confirm({
      title: t(isRush ? 'quizExitRushTitle' : 'quizExitTitle'),
      message: t(isRush ? 'quizExitRushMessage' : 'quizExitMessage'),
      primaryLabel: t(isRush ? 'quizExitRushLeave' : 'quizExitLeave'),
      cancelLabel: t('quizExitStay')
    }).then(function(result) {
      resolve(result === 'primary');
    });
  });
}
function _performQuizBack(){
  if(typeof window._rushIsActive==='function'&&window._rushIsActive()){
    if(typeof window.endRushSession==='function')window.endRushSession(true);
    return;
  }
  var ret=_quizReturnScreen;
  _abortQuizSession();
  if (ret === 'screen-learning-profile') {
    switchTab('stats', { popActiveToRoot: false });
    _resetTabStack('stats');
    _syncAppChrome();
    return;
  }
  if (ret === 'screen-practice-setup') {
    switchTab('practice', { popActiveToRoot: false });
    _resetTabStack('practice');
    _syncAppChrome();
    return;
  }
  if (_activeTab !== 'learn') switchTab('learn', { popActiveToRoot: false });
  var targetId = (!ret || ret === 'screen-levels' || ret === 'learn-root') ? _tabRoots.learn : ret;
  if (_getStackTop('learn') === 'screen-quiz') {
    _popStackToPage('learn', targetId, { animate: true }).then(function(ok) {
      if (!ok) {
        _resetTabStack('learn');
        if (targetId !== _tabRoots.learn) pushTabPage(targetId, { animate: false, tab: 'learn' });
      }
      var top = _getStackTop('learn');
      _syncAppChrome(top === _tabRoots.learn ? null : top);
    });
  } else {
    _resetTabStack('learn');
    if (targetId !== _tabRoots.learn) pushTabPage(targetId, { animate: false, tab: 'learn' });
    var top = _getStackTop('learn');
    _syncAppChrome(top === _tabRoots.learn ? null : top);
  }
}
function goQuizBack(){
  if(!_quizSessionActive()){
    _performQuizBack();
    return;
  }
  _confirmPageLeave('screen-quiz').then(function(ok) {
    if (ok) _performQuizBack();
  });
}
function openSwipeSetup(){ window.umami?.track('quick_match_opened'); show('screen-swipe-setup'); }
function setSwipeLevel(lv){
  swipeSelectedLevel = lv;
  ['A1','A2','B1'].forEach(function(k){
    document.getElementById('swipe-level-' + k).classList.toggle('active', k === lv);
  });
}

// ── ADAPTIVE QUIZ SETUP ──
function openAdaptiveSetup() {
  window.umami?.track('adaptive_quiz_opened');
  show('screen-adaptive-setup');
  if (typeof window._adaptiveRefreshBadge === 'function') window._adaptiveRefreshBadge();
}
function setAdaptiveLevel(lv) {
  adaptiveSelectedLevel = lv;
  ['A1','A2','B1'].forEach(function(k) {
    document.getElementById('adaptive-level-' + k).classList.toggle('active', k === lv);
  });
}
function launchAdaptiveQuiz() {
  window.umami?.track('adaptive_quiz_started', { level: adaptiveSelectedLevel });
  _quizReturnScreen = 'screen-adaptive-setup';
  startLevel(adaptiveSelectedLevel);
}

function openAdaptiveV2() {
  window.umami?.track('adaptive_v2_opened');
  if (typeof window._adaptiveV2RefreshBadge === 'function') window._adaptiveV2RefreshBadge();
  if (typeof window.startAdaptiveV2Quiz === 'function') window.startAdaptiveV2Quiz();
}

// ── THEME QUIZ ──
function openThemeSelect() {
  window.umami?.track('theme_quiz_opened');
  show('screen-theme-select');
  _loadV2Vocab().finally(function() {
    _renderCategoryGrid();
  });
}

function _renderCategoryGrid() {
  var grid = document.getElementById('category-grid');
  if (!grid) return;
  var catNames = t('categoryNames') || {};
  grid.innerHTML = CATEGORY_MAP.map(function(cat) {
    var vars = '--cat-accent:' + cat.accent + ';--cat-icon-bg:' + cat.iconBg + ';';
    return '<button type="button" class="category-card random-banner glass glass-tile glass-highlight glass-interactive" style="' + vars + '" onclick="startThemeQuiz(' + cat.id + ')">'
      + '<div class="rb-icon-wrap"><svg class="ui-icon" aria-hidden="true"><use href="#' + cat.svgIcon + '"/></svg></div>'
      + '<div class="rb-text"><strong>' + escHtml(catNames[cat.id] || cat.name) + '</strong></div>'
      + '</button>';
  }).join('');
  if (typeof _syncTabViewportHeight === 'function') _syncTabViewportHeight();
}

async function startThemeQuiz(categoryId) {
  _quizReturnScreen = 'screen-theme-select';
  currentThemeCategoryId = 0;
  _themeAnswers = [];
  var _ov = document.getElementById('quiz-prep-overlay');
  _ov.classList.add('active');
  try {
    await _loadV2Vocab();
  } catch(err) {
    _ov.classList.remove('active');
    var msg = t('errLoadQuiz');
    if (window.location.protocol === 'file:') msg += t('errFileProtocol');
    alert(msg);
    return;
  }
  _ov.classList.remove('active');

  var cards = _buildThemeQueue(categoryId);
  if (!cards.length) {
    alert(t('errNoWordsTopic'));
    return;
  }
  currentThemeCategoryId = categoryId;
  currentLevel = _categoryName(categoryId);
  queue = cards;
  idx = 0; ok = 0; no = 0;
  window.umami?.track('theme_quiz_started', { category_id: categoryId, category_name: currentLevel });
  show('screen-quiz');
  renderCard();
}

function _categoryName(id) {
  var names = t('categoryNames') || {};
  if (names[id]) return names[id];
  var cat = CATEGORY_MAP.find(function(c){ return c.id === id; });
  return cat ? cat.name : 'Theme';
}

function _themeSkillLevel() {
  if (typeof window._adaptiveV2GetProgress === 'function') {
    var p = window._adaptiveV2GetProgress();
    if (p && Number(p.skillLevel) >= 1) return Number(p.skillLevel);
  }
  return 4;
}

function _buildThemeQueue(categoryId) {
  var pool = (V2_QUIZ_ROWS || []).filter(function(r) {
    return r.entry_type === 'main' && r.translation_en && r.translation_en.trim() &&
      parseInt(r.category_id, 10) === categoryId;
  });
  if (!pool.length) return [];
  return _buildThemeCoverageQueue(pool, categoryId, _themeSkillLevel());
}

function _buildThemeCoverageQueue(pool, categoryId, skillLevel) {
  var progress = typeof window._adaptiveV2GetProgress === 'function'
    ? window._adaptiveV2GetProgress() : null;
  var catKey = _categorySlug(categoryId);
  var themeSeenMeta = {};
  var themeRecentSet = {};
  if (progress && progress.quizStats && progress.quizStats.theme && progress.quizStats.theme[catKey]) {
    var themeEntry = progress.quizStats.theme[catKey];
    (themeEntry.seenWordIds || []).forEach(function(id) {
      themeSeenMeta[String(id)] = true;
    });
    (themeEntry.themeRecentWords || []).forEach(function(id) {
      themeRecentSet[String(id)] = true;
    });
  }
  function readStat(row) {
    if (progress && typeof window._adaptiveV2ReadWordStat === 'function') {
      return window._adaptiveV2ReadWordStat(progress, row.id);
    }
    return { themeSeenCount: 0, failScore: 0, lastSeenQuiz: 0 };
  }
  function diffGap(row) {
    var d = parseInt(row.difficulty, 10);
    if (!(d >= 1 && d <= 10)) return 99;
    return Math.abs(d - skillLevel);
  }
  function cmpId(a, b) {
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  }
  function toItem(row) {
    var st = readStat(row);
    return {
      row: row,
      id: String(row.id),
      failScore: Number(st.failScore) || 0,
      themeSeenCount: Number(st.themeSeenCount) || 0,
      lastSeenQuiz: Number(st.lastSeenQuiz) || 0,
      diffGap: diffGap(row),
      inRecent: !!themeRecentSet[String(row.id)]
    };
  }
  function isThemeUnseen(item) {
    return item.themeSeenCount === 0 && !themeSeenMeta[item.id] && item.failScore === 0;
  }
  function isStable(item) {
    return item.failScore === 0 && (item.themeSeenCount > 0 || themeSeenMeta[item.id]);
  }
  var items = pool.map(toItem);
  var unseenRanked = items.filter(isThemeUnseen).sort(function(a, b) {
    if (a.inRecent !== b.inRecent) return a.inRecent ? 1 : -1;
    if (a.lastSeenQuiz !== b.lastSeenQuiz) return a.lastSeenQuiz - b.lastSeenQuiz;
    if (a.themeSeenCount !== b.themeSeenCount) return a.themeSeenCount - b.themeSeenCount;
    if (a.diffGap !== b.diffGap) return a.diffGap - b.diffGap;
    return cmpId(a, b);
  });
  var strugglingRanked = items.filter(function(i) { return i.failScore > 0; }).sort(function(a, b) {
    if (b.failScore !== a.failScore) return b.failScore - a.failScore;
    if (a.lastSeenQuiz !== b.lastSeenQuiz) return a.lastSeenQuiz - b.lastSeenQuiz;
    if (a.diffGap !== b.diffGap) return a.diffGap - b.diffGap;
    return cmpId(a, b);
  });
  var stableRanked = items.filter(isStable).sort(function(a, b) {
    if (a.themeSeenCount !== b.themeSeenCount) return a.themeSeenCount - b.themeSeenCount;
    if (a.lastSeenQuiz !== b.lastSeenQuiz) return a.lastSeenQuiz - b.lastSeenQuiz;
    if (a.diffGap !== b.diffGap) return a.diffGap - b.diffGap;
    return cmpId(a, b);
  });
  var challengeRanked = items.slice().sort(function(a, b) {
    if (a.diffGap !== b.diffGap) return a.diffGap - b.diffGap;
    if (a.inRecent !== b.inRecent) return a.inRecent ? 1 : -1;
    if (a.lastSeenQuiz !== b.lastSeenQuiz) return a.lastSeenQuiz - b.lastSeenQuiz;
    return cmpId(a, b);
  });
  function takeFrom(ranked, count, used) {
    var picked = [];
    for (var i = 0; i < ranked.length && picked.length < count; i++) {
      if (used[ranked[i].id]) continue;
      used[ranked[i].id] = true;
      picked.push(ranked[i].row);
    }
    return picked;
  }
  var used = {};
  var selected = [];
  selected = selected.concat(takeFrom(unseenRanked, 4, used));
  selected = selected.concat(takeFrom(strugglingRanked, 3, used));
  selected = selected.concat(takeFrom(stableRanked, 2, used));
  selected = selected.concat(takeFrom(challengeRanked, 1, used));
  var fillPools = [unseenRanked, strugglingRanked, stableRanked, challengeRanked, items];
  while (selected.length < QUIZ_LEN) {
    var added = false;
    for (var p = 0; p < fillPools.length; p++) {
      var extra = takeFrom(fillPools[p], 1, used);
      if (extra.length) {
        selected = selected.concat(extra);
        added = true;
        break;
      }
    }
    if (!added) break;
  }
  return _buildThemeQueueFromV2Rows(shuffle(selected));
}

function _buildThemeQueueFromV2Rows(rows) {
  var allRows = (V2_QUIZ_ROWS || []).filter(function(r) {
    return r.entry_type === 'main' && r.translation_en && r.translation_en.trim();
  });
  return rows.map(function(row) {
    var usedIds = {}; usedIds[row.id] = true;
    var usedEn  = {}; usedEn[row.translation_en.trim()] = true;
    var distractors = [];
    var catId = parseInt(row.category_id, 10);

    shuffle(allRows.filter(function(d) { return parseInt(d.category_id, 10) === catId; }))
      .forEach(function(d) {
        if (distractors.length >= 6) return;
        if (usedIds[d.id]) return;
        var en = d.translation_en.trim();
        if (en && !usedEn[en]) { usedEn[en] = true; usedIds[d.id] = true; distractors.push(d); }
      });

    if (distractors.length < 6) {
      shuffle(allRows).forEach(function(d) {
        if (distractors.length >= 6) return;
        if (usedIds[d.id]) return;
        var en = d.translation_en.trim();
        if (en && !usedEn[en]) { usedEn[en] = true; usedIds[d.id] = true; distractors.push(d); }
      });
    }

    return { _row: row, _distractors: distractors };
  });
}

function _buildQueueFromRows(rows) {
  var allRows = (V2_QUIZ_ROWS || []).filter(function(r) {
    return r.entry_type === 'main' && r.translation_en && r.translation_en.trim();
  });
  return rows.map(function(row) {
    var usedIds = {}; usedIds[row.id] = true;
    var usedEn  = {}; usedEn[row.translation_en.trim()] = true;
    var distractors = [];
    var catId = parseInt(row.category_id);

    // Pass 1: same-category distractors (keeps all 4 choices thematically related)
    shuffle(allRows.filter(function(d){ return parseInt(d.category_id) === catId; }))
      .forEach(function(d) {
        if (distractors.length >= 6) return;
        if (usedIds[d.id]) return;
        var en = d.translation_en.trim();
        if (en && !usedEn[en]) { usedEn[en] = true; usedIds[d.id] = true; distractors.push(d); }
      });

    // Pass 2: global fallback if the category is too small to fill 6 slots
    if (distractors.length < 6) {
      shuffle(allRows).forEach(function(d) {
        if (distractors.length >= 6) return;
        if (usedIds[d.id]) return;
        var en = d.translation_en.trim();
        if (en && !usedEn[en]) { usedEn[en] = true; usedIds[d.id] = true; distractors.push(d); }
      });
    }

    return { _row: row, _distractors: distractors };
  });
}

// ── LEARNING PROFILE ──
function openLearningProfile() {
  learningProfileSelectedLevel = 'ALL';
  _setLearningProfileTabActive(learningProfileSelectedLevel);
  window.umami?.track('learning_profile_opened');
  switchTab('stats');
  show('screen-levels');
  renderLearningProfile();
  _ensureLearningProfileData(learningProfileSelectedLevel);
}

function _profileLevels() {
  return ['ALL', 'A1', 'A2', 'B1'];
}

function _setLearningProfileTabActive(lv) {
  _profileLevels().forEach(function(k) {
    var el = document.getElementById('profile-level-' + k);
    if (el) el.classList.toggle('active', k === lv);
  });
}

function _ensureLearningProfileData(lv) {
  if (lv === 'ALL') {
    _loadV2Vocab().then(function() {
      renderLearningProfile();
    }).catch(function() {});
    return;
  }
  if (typeof _loadCSVLevel === 'function') {
    _loadCSVLevel(lv).then(function() {
      renderLearningProfile();
    }).catch(function() {});
  }
}

function setLearningProfileLevel(lv) {
  learningProfileSelectedLevel = lv;
  learningProfileDetailMode = null;
  learningProfileLastDetailHtml = '';
  _setLearningProfileTabActive(lv);
  renderLearningProfile();
  _ensureLearningProfileData(lv);
}

function _emptyGuestProgress() {
  return {
    evaluationStage: 0,
    skillLevel: 1,
    cefrBand: 'A1',
    learningPhase: 'active',
    words: {},
    recentWords: [],
    crossBandLog: [],
    challengeLowStreak: 0,
    quizStats: { adaptive: _emptyStats(), theme: {} }
  };
}

function _guestProfileProgress(level) {
  if (level === 'ALL') {
    if (typeof window._adaptiveV2GetProgress === 'function') {
      return window._adaptiveV2GetProgress() || _emptyGuestProgress();
    }
    return _emptyGuestProgress();
  }
  if (typeof window._adaptiveGetGuestProgress === 'function') {
    return window._adaptiveGetGuestProgress(level) || _emptyGuestProgress();
  }
  return _emptyGuestProgress();
}

function _profileSnapshot(level) {
  level = level || learningProfileSelectedLevel || 'ALL';
  var signedIn = typeof window.APP_AUTH_IS_SIGNED_IN === 'function' && window.APP_AUTH_IS_SIGNED_IN();
  if (level === 'ALL' && signedIn && typeof window.APP_AUTH_GET_LEARNING_PROFILE === 'function') {
    return window.APP_AUTH_GET_LEARNING_PROFILE('ALL');
  }
  if (level === 'ALL' && typeof window._adaptiveV2GetProgress === 'function') {
    var live = window._adaptiveV2GetProgress();
    if (live) return { signedIn: signedIn, level: level, progress: live };
  }
  if (signedIn && typeof window.APP_AUTH_GET_LEARNING_PROFILE === 'function') {
    return window.APP_AUTH_GET_LEARNING_PROFILE(level);
  }
  return {
    signedIn: false,
    level: level,
    progress: _guestProfileProgress(level)
  };
}

function _profileWordRows(progress) {
  var words = (progress && progress.words) || {};
  return Object.keys(words).map(function(id) {
    var w = words[id] || {};
    var correct = Number(w.correctCount);
    if (!isFinite(correct)) correct = Number(w.correct) || Number(w.passedCount) || 0;
    var seen = Number(w.seenCount);
    if (!isFinite(seen) || seen <= 0) {
      var incorrectLegacy = Number(w.incorrectCount) || Number(w.wrongCount) || Number(w.failedCount) || Number(w.failCount) || 0;
      seen = Math.max(correct + incorrectLegacy, correct, Number(w.attempts) || 0, Number(w.failScore) > 0 ? 1 : 0);
    }
    var fail = Number(w.failScore) || 0;
    if (!isFinite(correct) || correct < 0) correct = 0;
    if (!isFinite(seen) || seen < 0) seen = 0;
    return {
      id: String(id),
      seenCount: seen,
      correctCount: correct,
      incorrectCount: Math.max(0, seen - correct),
      failScore: fail,
      accuracy: seen ? correct / seen : 0
    };
  }).filter(function(w) { return w.seenCount > 0; });
}

function _isStrugglingWord(w) {
  if ((Number(w.failScore) || 0) >= 1) return true;
  if ((Number(w.incorrectCount) || 0) >= 1 && (Number(w.accuracy) || 0) < 1) return true;
  var repeatedIncorrect = (Number(w.incorrectCount) || 0) >= 2;
  var lowAccuracyWithHistory = (Number(w.seenCount) || 0) >= 4 && (Number(w.accuracy) || 0) < 0.65;
  var elevatedFailPressure = (Number(w.failScore) || 0) >= 4 && (Number(w.accuracy) || 0) < 0.8;
  return repeatedIncorrect || lowAccuracyWithHistory || elevatedFailPressure;
}

function _isMasteredWord(w) {
  return (Number(w.seenCount) || 0) >= 3 &&
    (Number(w.failScore) || 0) === 0 &&
    (Number(w.accuracy) || 0) >= 0.8;
}

function _profileTotals(progress) {
  var rows = _profileWordRows(progress);
  var correct = rows.reduce(function(sum, w) { return sum + w.correctCount; }, 0);
  var seen = rows.reduce(function(sum, w) { return sum + w.seenCount; }, 0);
  var struggling = rows.filter(_isStrugglingWord).length;
  var mastered = rows.filter(_isMasteredWord).length;
  return {
    wordsSeen: rows.length,
    wordsStruggling: struggling,
    wordsMastered: mastered,
    accuracyPct: seen ? Math.round(correct / seen * 100) : 0
  };
}

function _emptyStats() {
  return { quizzesCompleted: 0, correctAnswers: 0, incorrectAnswers: 0, studyTimeSeconds: 0 };
}

function _addStats(a, b) {
  a = a || _emptyStats(); b = b || _emptyStats();
  return {
    quizzesCompleted: (Number(a.quizzesCompleted) || 0) + (Number(b.quizzesCompleted) || 0),
    correctAnswers: (Number(a.correctAnswers) || 0) + (Number(b.correctAnswers) || 0),
    incorrectAnswers: (Number(a.incorrectAnswers) || 0) + (Number(b.incorrectAnswers) || 0),
    studyTimeSeconds: (Number(a.studyTimeSeconds) || 0) + (Number(b.studyTimeSeconds) || 0)
  };
}

function _activityTotals(quizStats) {
  var total = _addStats(null, quizStats && quizStats.adaptive);
  var theme = (quizStats && quizStats.theme) || {};
  Object.keys(theme).forEach(function(key) { total = _addStats(total, theme[key]); });
  return total;
}

function _deriveActivityFromWords(progress) {
  var rows = _profileWordRows(progress || {});
  var correct = rows.reduce(function(sum, w) { return sum + (Number(w.correctCount) || 0); }, 0);
  var incorrect = rows.reduce(function(sum, w) { return sum + (Number(w.incorrectCount) || 0); }, 0);
  var answers = correct + incorrect;
  return {
    quizzesCompleted: answers > 0 ? Math.max(1, Math.floor(answers / Math.max(1, QUIZ_LEN || 10))) : 0,
    correctAnswers: correct,
    incorrectAnswers: incorrect,
    studyTimeSeconds: 0
  };
}

function _activityTotalsWithFallback(progress) {
  var stats = _activityTotals((progress && progress.quizStats) || {});
  var hasTracked = (Number(stats.quizzesCompleted) || 0) > 0 ||
    (Number(stats.correctAnswers) || 0) > 0 ||
    (Number(stats.incorrectAnswers) || 0) > 0 ||
    (Number(stats.studyTimeSeconds) || 0) > 0;
  if (hasTracked) return stats;
  return _deriveActivityFromWords(progress);
}

function _profileLevelScore(level) {
  var snap = _profileSnapshot(level);
  if (!snap || !snap.progress) return -1;
  var progress = snap.progress || {};
  var totals = _profileTotals(progress);
  var activity = _activityTotalsWithFallback(progress);
  var answers = (Number(activity.correctAnswers) || 0) + (Number(activity.incorrectAnswers) || 0);
  var timeBoost = Math.min(1000, Math.max(0, Number(activity.studyTimeSeconds) || 0) / 10);
  return (Number(totals.wordsSeen) || 0) * 100 +
    (Number(activity.quizzesCompleted) || 0) * 50 +
    answers + timeBoost;
}

function _bestLearningProfileLevel() {
  var levels = _profileLevels();
  var best = 'ALL';
  var bestScore = _profileLevelScore(best);
  levels.slice(1).forEach(function(level) {
    var score = _profileLevelScore(level);
    if (score > bestScore) {
      best = level;
      bestScore = score;
    }
  });
  return best;
}

function _formatStudyTime(seconds) {
  seconds = Math.max(0, Number(seconds) || 0);
  if (seconds < 60) return seconds + 's';
  var minutes = Math.round(seconds / 60);
  if (minutes < 60) return minutes + 'm';
  var hours = Math.floor(minutes / 60);
  var rem = minutes % 60;
  return hours + 'h' + (rem ? ' ' + rem + 'm' : '');
}

function _categorySlug(id) {
  var cat = CATEGORY_MAP.find(function(c) { return c.id === Number(id); });
  var name = cat ? cat.name : String(id || 'theme');
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}
window._categorySlug = _categorySlug;

function _categoryNameFromStatKey(key) {
  var cat = CATEGORY_MAP.find(function(c) { return _categorySlug(c.id) === key || String(c.id) === key; });
  return cat ? _categoryName(cat.id) : String(key || '').replace(/_/g, ' ').replace(/\b\w/g, function(ch) { return ch.toUpperCase(); });
}

function _performanceLists(quizStats) {
  var rows = [];
  if (quizStats && Array.isArray(quizStats.__wordCategoryRows)) {
    rows = quizStats.__wordCategoryRows.slice();
  }
  if (!rows.length) return { strongest: [], weakest: [] };
  rows.sort(function(a, b) { return b.accuracy - a.accuracy || b.attempts - a.attempts; });

  var strongest = rows.slice(0, 3);
  var used = {};
  strongest.forEach(function(r) { used[r.key] = true; });

  var medianAcc = rows[Math.floor(rows.length / 2)].accuracy;
  var weakest = rows.slice().reverse().filter(function(r) {
    if (used[r.key]) return false;
    if (rows.length > 3 && r.accuracy >= medianAcc) return false;
    return true;
  }).slice(0, 3);

  return { strongest: strongest, weakest: weakest };
}

function _profileWordJoin(level, progress) {
  var rows = _profileWordRows(progress);
  var hasVocab = level === 'ALL' ? !!(V2_QUIZ_ROWS && V2_QUIZ_ROWS.length) : !!(CSV_QUIZ_DATA[level] && CSV_QUIZ_DATA[level].length);
  return rows.map(function(w) {
    var row = _v2RowLookup(level, w.id);
    var wordLabel = row ? ((row.article ? row.article + ' ' : '') + expandOptional(row.word || w.id)) : (hasVocab ? ('#' + w.id) : '');
    var meaning = row ? (_csvRowDisplay(row) || row.translation_en || '') : (hasVocab ? '' : _lp('loadingLevelWords'));
    var catId = row ? Number(row.category_id) || 0 : 0;
    return {
      id: w.id,
      seenCount: w.seenCount,
      correctCount: w.correctCount,
      incorrectCount: w.incorrectCount,
      failScore: w.failScore,
      accuracy: w.accuracy,
      word: wordLabel,
      meaning: meaning,
      categoryId: catId,
      categoryName: catId ? _categoryName(catId) : _lp('uncategorized')
    };
  });
}

function _v2CategoryPool(categoryId) {
  return (V2_QUIZ_ROWS || []).filter(function(r) {
    return r.entry_type === 'main' && r.translation_en && r.translation_en.trim() &&
      parseInt(r.category_id, 10) === Number(categoryId);
  });
}

function _themeCategoryCoverage(categoryId, progress) {
  var pool = _v2CategoryPool(categoryId);
  if (!pool.length) return { seen: 0, total: 0, pct: 0 };
  var seen = 0;
  pool.forEach(function(r) {
    var w = (progress && progress.words && progress.words[r.id]) || null;
    if ((Number(w && w.seenCount) || 0) > 0) seen++;
  });
  return {
    seen: seen,
    total: pool.length,
    pct: Math.round(seen / pool.length * 100)
  };
}

function _categoryGridBadge(categoryId) {
  var progress = typeof window._adaptiveV2GetProgress === 'function'
    ? window._adaptiveV2GetProgress() : null;
  if (!progress) return '';
  var cov = _themeCategoryCoverage(categoryId, progress);
  if (!cov.total) return '';
  return '<span class="cat-coverage">' + cov.seen + '/' + cov.total + '</span>';
}

function _themeStatEntry(progress, categoryId) {
  var theme = (progress && progress.quizStats && progress.quizStats.theme) || {};
  var entry = theme[_categorySlug(categoryId)] || {};
  return {
    quizzesCompleted: Number(entry.quizzesCompleted) || 0,
    correctAnswers: Number(entry.correctAnswers) || 0,
    incorrectAnswers: Number(entry.incorrectAnswers) || 0,
    studyTimeSeconds: Number(entry.studyTimeSeconds) || 0,
    seenWordIds: Array.isArray(entry.seenWordIds) ? entry.seenWordIds : []
  };
}

function _profileTopics(progress) {
  var joined = _profileWordJoin('ALL', progress || {});
  var catPerf = {};
  joined.forEach(function(w) {
    if (!w.categoryId) return;
    if (!catPerf[w.categoryId]) {
      catPerf[w.categoryId] = { attempts: 0, correct: 0, name: w.categoryName };
    }
    catPerf[w.categoryId].attempts += Number(w.seenCount) || 0;
    catPerf[w.categoryId].correct += Number(w.correctCount) || 0;
  });
  var topics = [];
  CATEGORY_MAP.forEach(function(cat) {
    var cov = _themeCategoryCoverage(cat.id, progress);
    var perf = catPerf[cat.id] || { attempts: 0, correct: 0, name: _categoryName(cat.id) };
    var activity = _themeStatEntry(progress, cat.id);
    if (activity.quizzesCompleted < 1 && perf.attempts < 5) return;
    topics.push({
      id: cat.id,
      name: _categoryName(cat.id),
      coveragePct: cov.pct,
      coverageLabel: cov.seen + '/' + cov.total,
      accuracy: perf.attempts ? Math.round(perf.correct / perf.attempts * 100) : 0,
      quizzesCompleted: activity.quizzesCompleted,
      correctAnswers: activity.correctAnswers,
      incorrectAnswers: activity.incorrectAnswers,
      studyTimeSeconds: activity.studyTimeSeconds
    });
  });
  topics.sort(function(a, b) {
    return b.coveragePct - a.coveragePct || b.quizzesCompleted - a.quizzesCompleted;
  });
  return topics;
}

function _profileTopicsHtml(topics) {
  if (!topics.length) {
    return '<div class="profile-empty glass glass-tile">' + escHtml(_lp('notEnoughCategoryData')) + '</div>';
  }
  return topics.map(function(topic) {
    return '<div class="profile-topic-row glass glass-tile">'
      + '<div class="profile-topic-main">'
      + '<div class="profile-topic-name">' + escHtml(topic.name) + '</div>'
      + '<div class="profile-topic-meta">'
      + escHtml(_lp('topicCoverage')) + ': ' + escHtml(topic.coverageLabel) + ' · '
      + escHtml(_lp('topicAccuracy')) + ': ' + formatNumStr(String(topic.accuracy) + '%')
      + '</div>'
      + '<div class="profile-topic-meta profile-topic-activity">'
      + escHtml(_lp('quizzesCompleted')) + ': ' + formatNum(topic.quizzesCompleted) + ' · '
      + escHtml(_lp('correctAnswers')) + ': ' + formatNum(topic.correctAnswers) + ' · '
      + escHtml(_lp('incorrectAnswers')) + ': ' + formatNum(topic.incorrectAnswers) + ' · '
      + escHtml(_lp('totalStudyTime')) + ': ' + escHtml(_formatStudyTime(topic.studyTimeSeconds))
      + '</div>'
      + '<div class="profile-topic-bar"><span style="width:' + topic.coveragePct + '%"></span></div>'
      + '</div>'
      + '<button type="button" class="profile-topic-btn glass glass-pill glass-interactive" onclick="startThemeQuiz(' + topic.id + ')">'
      + escHtml(_lp('practiceTopic')) + '</button>'
      + '</div>';
  }).join('');
}

function _categoryPerformanceFromWords(wordRows) {
  var byCat = {};
  (wordRows || []).forEach(function(w) {
    if (!w.categoryId) return;
    if (!byCat[w.categoryId]) {
      byCat[w.categoryId] = {
        key: String(w.categoryId),
        name: w.categoryName,
        attempts: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0
      };
    }
    byCat[w.categoryId].attempts += Number(w.seenCount) || 0;
    byCat[w.categoryId].correct += Number(w.correctCount) || 0;
    byCat[w.categoryId].incorrect += Number(w.incorrectCount) || 0;
  });
  return Object.keys(byCat).map(function(key) {
    var c = byCat[key];
    c.accuracy = c.attempts ? c.correct / c.attempts : 0;
    return c;
  }).filter(function(c) {
    return c.attempts >= 5;
  });
}

function _profileWordListHtml(title, rows) {
  if (!rows.length) {
    return '<div class="profile-empty glass glass-tile" style="margin-top:10px;">' + escHtml(_lp('noWordsInList')) + '</div>';
  }
  var items = rows.map(function(w) {
    return '<div class="profile-word-item glass glass-tile">'
      + '<div class="profile-word-main">' + escHtml(w.word) + '</div>'
      + (w.meaning ? '<div class="profile-word-meaning">' + escHtml(w.meaning) + '</div>' : '')
      + '</div>';
  }).join('');
  return '<div class="profile-section" style="margin-top:10px;"><div class="profile-section-title">' + escHtml(title) + '</div><div class="profile-word-list">' + items + '</div></div>';
}

window.toggleLearningProfileDetail = function(mode) {
  if (learningProfileDetailMode === mode) {
    var wrap = document.getElementById('profile-detail-wrap');
    if (wrap) {
      wrap.classList.remove('open');
      setTimeout(function() {
        learningProfileDetailMode = null;
        learningProfileLastDetailHtml = '';
        renderLearningProfile();
      }, 300);
      return;
    }
    learningProfileDetailMode = null;
    learningProfileLastDetailHtml = '';
    renderLearningProfile();
    return;
  }
  learningProfileDetailMode = mode;
  if (learningProfileDetailMode) {
    renderLearningProfile();
    _loadV2Vocab().then(function() {
      renderLearningProfile();
    }).catch(function() {
      renderLearningProfile();
    });
    return;
  }
  renderLearningProfile();
};

function _profileJourneyBarHtml(journey) {
  if (!journey || !journey.segments) return '';
  var segs = journey.segments.map(function (s) {
    var pct = Math.round((s.coverage || 0) * 100);
    return '<div class="profile-journey-seg profile-journey-seg-' + s.band.toLowerCase() + '">' +
      '<div class="profile-journey-seg-fill" style="width:' + pct + '%"></div>' +
    '</div>';
  }).join('');
  var lo = journey.markerLo.toFixed(1);
  var w = Math.max(1, journey.markerHi - journey.markerLo).toFixed(1);
  var tip = (journey.cefrBand || 'A1') + ' · ' + (Number(journey.skillLevel) || 1).toFixed(1) + ' / 10';
  var bandChips = journey.segments.map(function (s) {
    var pct = Math.round((s.coverage || 0) * 100);
    return '<span class="profile-journey-chip">' +
      '<span class="profile-journey-dot profile-journey-dot-' + s.band.toLowerCase() + '" aria-hidden="true"></span>' +
      '<span class="profile-journey-chip-band">' + escHtml(s.band) + '</span>' +
      '<span class="profile-journey-chip-meta">' + escHtml(_lp('journeySeenShort', { pct: pct })) + '</span>' +
    '</span>';
  }).join('');
  return '<div class="profile-journey-wrap">' +
    '<div class="profile-journey-bar">' + segs +
      '<div class="profile-journey-marker" style="left:' + lo + '%;width:' + w + '%" title="' + escHtml(tip) + '"></div>' +
    '</div>' +
    '<div class="profile-journey-legend">' +
      '<div class="profile-journey-legend-bands">' + bandChips + '</div>' +
      '<span class="profile-journey-chip profile-journey-chip-gold">' +
        '<span class="profile-journey-dot profile-journey-dot-gold" aria-hidden="true"></span>' +
        '<span class="profile-journey-chip-band">' + escHtml(_lp('journeyGoldShort')) + '</span>' +
        '<span class="profile-journey-chip-meta">' + escHtml(_lp('journeyGoldHint')) + '</span>' +
      '</span>' +
    '</div>' +
  '</div>';
}

async function resetAdaptiveV2Progress() {
  if (!confirm(_lp('resetAdaptiveConfirm'))) return;
  var signedIn = typeof window.APP_AUTH_IS_SIGNED_IN === 'function' && window.APP_AUTH_IS_SIGNED_IN();
  if (signedIn && typeof window.APP_AUTH_RESET_ADAPTIVE_V2 === 'function') {
    await window.APP_AUTH_RESET_ADAPTIVE_V2();
  } else if (typeof window._adaptiveV2ResetProgress === 'function') {
    window._adaptiveV2ResetProgress();
  }
  renderLearningProfile();
  if (typeof window._adaptiveV2RefreshBadge === 'function') window._adaptiveV2RefreshBadge();
}

function renderLearningProfile() {
  var el = document.getElementById('learning-profile-content');
  if (!el) return;
  learningProfileSelectedLevel = 'ALL';
  var snap = _profileSnapshot('ALL');
  var progress = (snap && snap.progress) || _emptyGuestProgress();
  var joinedWords = _profileWordJoin('ALL', progress);
  var totals = _profileTotals(progress);
  var activity = _activityTotalsWithFallback(progress);
  var topics = _profileTopics(progress);
  var topicsHtml = _profileTopicsHtml(topics);
  var isGuest = !(snap && snap.signedIn);
  function stat(label, value, extraClass, clickMode, selected) {
    var cls = 'profile-stat glass glass-tile';
    if (extraClass) cls += ' ' + extraClass;
    if (clickMode) cls += ' profile-stat-clickable';
    if (selected) cls += ' active';
    var onClick = clickMode ? ' onclick="toggleLearningProfileDetail(\'' + clickMode + '\')"' : '';
    return '<div class="' + cls + '"' + onClick + '><strong>' + escHtml(typeof value === 'number' ? formatNum(value) : formatNumStr(String(value))) + '</strong><span>' + escHtml(label) + '</span></div>';
  }
  var seenListRows = joinedWords.slice().sort(function(a, b) {
    return (Number(b.seenCount) || 0) - (Number(a.seenCount) || 0) || (Number(a.accuracy) || 0) - (Number(b.accuracy) || 0);
  });
  var strugglingListRows = joinedWords.filter(_isStrugglingWord).sort(function(a, b) {
    return (Number(b.failScore) || 0) - (Number(a.failScore) || 0) || (Number(a.accuracy) || 0) - (Number(b.accuracy) || 0);
  });
  var masteredListRows = joinedWords.filter(_isMasteredWord).sort(function(a, b) {
    return (Number(b.seenCount) || 0) - (Number(a.seenCount) || 0) || (Number(b.accuracy) || 0) - (Number(a.accuracy) || 0);
  });
  var detailsCsvReady = !!V2_QUIZ_ROWS;
  var detailHtml = '';
  if (learningProfileDetailMode === 'seen') {
    detailHtml = detailsCsvReady
      ? _profileWordListHtml(_lp('seenWords'), seenListRows)
      : '<div class="profile-empty glass glass-tile" style="margin-top:10px;">' + escHtml(_lp('loadingLevelWords')) + '</div>';
  } else if (learningProfileDetailMode === 'struggling') {
    detailHtml = detailsCsvReady
      ? _profileWordListHtml(_lp('strugglingWords'), strugglingListRows)
      : '<div class="profile-empty glass glass-tile" style="margin-top:10px;">' + escHtml(_lp('loadingLevelWords')) + '</div>';
  } else if (learningProfileDetailMode === 'mastered') {
    detailHtml = detailsCsvReady
      ? _profileWordListHtml(_lp('masteredWords'), masteredListRows)
      : '<div class="profile-empty glass glass-tile" style="margin-top:10px;">' + escHtml(_lp('loadingLevelWords')) + '</div>';
  }
  var detailIsOpen = !!learningProfileDetailMode;
  if (detailIsOpen && detailHtml) {
    learningProfileLastDetailHtml = detailHtml;
  } else if (!detailIsOpen) {
    learningProfileLastDetailHtml = '';
  }
  var detailPanelHtml =
    '<div id="profile-detail-wrap" class="profile-detail-wrap' + (detailIsOpen ? ' has-content' : '') + '">' +
      '<div class="profile-detail-inner">' + (detailHtml || '') + '</div>' +
    '</div>';

  var band = progress.cefrBand || 'A1';
  var skillNum = Number(progress.skillLevel) || 1;
  var journey = typeof window._adaptiveV2JourneyVisual === 'function'
    ? window._adaptiveV2JourneyVisual() : null;
  var adaptiveSection =
    '<div class="profile-section"><div class="profile-section-title">' + escHtml(_lp('adaptive')) + '</div>' +
      _profileJourneyBarHtml(journey) +
      '<div class="profile-grid">' +
        stat(_lp('adaptiveBand'), band) +
        stat(_lp('adaptiveSkill'), formatNumStr(skillNum.toFixed(1) + ' / 10')) +
      '</div></div>';

  var reviewBtnClass = isGuest ? ' profile-review-btn-locked' : '';
  var reviewBtnDisabled = isGuest ? ' disabled' : '';
  function reviewBtn(mode, label) {
    return '<button type="button" class="profile-review-btn glass glass-pill glass-interactive' + reviewBtnClass + '"' + reviewBtnDisabled +
      (isGuest ? '' : ' onclick="startLearningProfileReview(\'' + mode + '\')"') + '>' +
      escHtml(label) + '</button>';
  }
  var reviewSectionHtml = isGuest
    ? '<div class="profile-signin-unlock glass glass-tile">' +
        '<div class="profile-signin-unlock-head">' +
          '<span class="profile-signin-unlock-label">🔒 ' + escHtml(_lp('signInUnlock')) + '</span>' +
          '<button type="button" class="profile-signin-btn" onclick="openSettings()">' + escHtml(_lp('signInBtn')) + '</button>' +
        '</div>' +
        '<div class="profile-review-actions profile-review-actions-inbox">' +
          reviewBtn('weak', _lp('reviewWeakWords')) +
          reviewBtn('recent', _lp('reviewRecentMistakes')) +
          reviewBtn('mixed', _lp('reviewMixedPractice')) +
        '</div>' +
      '</div>'
    : '<div class="profile-review-actions">' +
        reviewBtn('weak', _lp('reviewWeakWords')) +
        reviewBtn('recent', _lp('reviewRecentMistakes')) +
        reviewBtn('mixed', _lp('reviewMixedPractice')) +
      '</div>';
  var topicsSectionHtml = isGuest
    ? '<div class="profile-signin-unlock glass glass-tile">' +
        '<div class="profile-signin-unlock-head profile-signin-unlock-head--compact">' +
          '<span class="profile-signin-unlock-label">🔒 ' + escHtml(_lp('signInUnlock')) + '</span>' +
          '<button type="button" class="profile-signin-btn" onclick="openSettings()">' + escHtml(_lp('signInBtn')) + '</button>' +
        '</div>' +
        '<p class="profile-signin-unlock-hint">' + escHtml(_lp('signInUnlockTopicsHint')) + '</p>' +
      '</div>'
    : topicsHtml;

  el.innerHTML =
    adaptiveSection +
    '<div class="profile-section"><div class="profile-section-title">' + escHtml(_lp('overview')) + '</div><div class="profile-grid">' +
      stat(_lp('wordsSeen'), totals.wordsSeen, 'profile-stat-seen', 'seen', learningProfileDetailMode === 'seen') +
      stat(_lp('wordsStruggling'), totals.wordsStruggling, 'profile-stat-struggling', 'struggling', learningProfileDetailMode === 'struggling') +
      stat(_lp('wordsMastered'), totals.wordsMastered, 'profile-stat-mastered', 'mastered', learningProfileDetailMode === 'mastered') +
      stat(_lp('accuracyPct').replace(/[%٪]/g, '').trim(), totals.accuracyPct + '%') +
    '</div></div>' +
    detailPanelHtml +
    '<div class="profile-section"><div class="profile-section-title">' + escHtml(_lp('activity')) + '</div>' +
      '<div class="profile-activity-grid">' +
        '<div class="profile-grid">' +
          stat(_lp('quizzesCompleted'), activity.quizzesCompleted) +
          stat(_lp('totalStudyTime'), _formatStudyTime(activity.studyTimeSeconds)) +
        '</div>' +
        '<div class="profile-grid">' +
          stat(_lp('correctAnswers'), activity.correctAnswers) +
          stat(_lp('incorrectAnswers'), activity.incorrectAnswers) +
        '</div>' +
      '</div></div>' +
    '<div class="profile-section"><div class="profile-section-title">' + escHtml(_lp('review')) + '</div>' +
      reviewSectionHtml +
    '</div>' +
    '<div class="profile-section"><div class="profile-section-title">' + escHtml(_lp('topics')) + '</div>' +
      topicsSectionHtml +
    '</div>' +
    '<div class="profile-section profile-danger-zone">' +
      '<button type="button" class="profile-reset-btn glass glass-pill glass-interactive" onclick="resetAdaptiveV2Progress()">' +
        escHtml(_lp('resetAdaptiveProgress')) +
      '</button></div>';

  if (detailIsOpen) {
    requestAnimationFrame(function() {
      var wrap = document.getElementById('profile-detail-wrap');
      if (wrap) wrap.classList.add('open');
    });
  }
  _profileDirty = false;
}

window.APP_DEBUG_LEARNING_PROFILE = function(level) {
  var lv = (level || learningProfileSelectedLevel || 'A1');
  var snap = _profileSnapshot(lv);
  var progress = (snap && snap.progress) || {};
  return {
    level: lv,
    signedIn: !!(snap && snap.signedIn),
    wordKeys: Object.keys(progress.words || {}).length,
    recentWords: (progress.recentWords || []).length,
    totals: _profileTotals(progress),
    activity: _activityTotalsWithFallback(progress),
    quizStats: progress.quizStats || null,
    categoryPerformance: _categoryPerformanceFromWords(_profileWordJoin(lv, progress)),
    sampleWords: Object.keys(progress.words || {}).slice(0, 5).reduce(function(out, id) {
      out[id] = progress.words[id];
      return out;
    }, {})
  };
};

function _rowsByIds(level, ids) {
  var out = [];
  ids.forEach(function(id) {
    var r = _v2RowLookup(level, id);
    if (r && r.entry_type === 'main' && r.translation_en && r.translation_en.trim()) out.push(r);
  });
  return out;
}

async function startLearningProfileReview(mode) {
  if (typeof window.APP_AUTH_IS_SIGNED_IN === 'function' && !window.APP_AUTH_IS_SIGNED_IN()) {
    if (typeof openSettings === 'function') openSettings();
    return;
  }
  var snap = _profileSnapshot(learningProfileSelectedLevel);
  if (!snap) return;
  var progress = snap.progress || {};
  var words = _profileWordRows(progress);
  var ov = document.getElementById('quiz-prep-overlay');
  ov.classList.add('active');
  try {
    await _loadV2Vocab();
  } catch (err) {
    ov.classList.remove('active');
    alert(t('errLoadQuiz'));
    return;
  }
  var ids = [];
  if (mode === 'weak') {
    ids = words.slice().sort(function(a, b) {
      return b.failScore - a.failScore || a.accuracy - b.accuracy || b.incorrectCount - a.incorrectCount;
    }).map(function(w) { return w.id; });
  } else if (mode === 'recent') {
    var recent = (progress.recentWords || []).slice().reverse();
    var failedMap = {};
    words.forEach(function(w) { if (w.failScore > 0 || w.incorrectCount > 0) failedMap[w.id] = true; });
    ids = recent.filter(function(id) { return failedMap[String(id)]; });
  } else {
    var struggling = words.filter(function(w) { return w.failScore >= 2 || w.incorrectCount >= 2; })
      .sort(function(a, b) { return b.failScore - a.failScore; });
    var recentWords = (progress.recentWords || []).slice().reverse().map(function(id) { return { id: String(id) }; });
    var mastered = words.filter(_isMasteredWord);
    ids = struggling.concat(recentWords, mastered).map(function(w) { return w.id; });
  }
  var used = {};
  ids = ids.filter(function(id) {
    id = String(id);
    if (used[id]) return false;
    used[id] = true;
    return true;
  });
  var rows = _rowsByIds(learningProfileSelectedLevel, ids).slice(0, QUIZ_LEN);
  if (rows.length < QUIZ_LEN) {
    var poolSource = learningProfileSelectedLevel === 'ALL'
      ? (V2_QUIZ_ROWS || [])
      : (CSV_QUIZ_DATA[learningProfileSelectedLevel] || []);
    var pool = shuffle(poolSource.filter(function(r) {
      return r.entry_type === 'main' && r.translation_en && r.translation_en.trim() && !used[String(r.id)];
    }));
    rows = rows.concat(pool.slice(0, QUIZ_LEN - rows.length));
  }
  ov.classList.remove('active');
  if (!rows.length) {
    alert(t('errCompleteAdaptiveFirst'));
    return;
  }
  if (typeof window.APP_AUTH_USE_LEARNING_LEVEL === 'function' && snap.signedIn) {
    window.APP_AUTH_USE_LEARNING_LEVEL(learningProfileSelectedLevel);
  }
  window.umami?.track('learning_profile_review_started', { mode: mode, level: learningProfileSelectedLevel });
  if (learningProfileSelectedLevel === 'ALL' && typeof window.startAdaptiveV2ReviewQuiz === 'function') {
    await window.startAdaptiveV2ReviewQuiz(rows, 'screen-learning-profile');
  } else if (typeof window.startAdaptiveReviewQuiz === 'function') {
    await window.startAdaptiveReviewQuiz(learningProfileSelectedLevel, rows, 'screen-learning-profile');
  } else {
    currentThemeCategoryId = 0;
    currentLevel = learningProfileSelectedLevel;
    queue = _buildQueueFromRows(rows);
    idx = 0; ok = 0; no = 0;
    _quizReturnScreen = 'screen-learning-profile';
    show('screen-quiz');
    renderCard();
  }
}

// ══════════════════════════════════════════════════════════════════
//  SWIPE CHECK
// ══════════════════════════════════════════════════════════════════
function _rowMeaningForLang(row) {
  if (LANG === 'en' || LANG === 'de') return row.translation_en || '';
  if (LANG === 'tr') return row.translation_tr || row.translation_en || '';
  if (LANG === 'ru') return row.translation_ru || row.translation_en || '';
  if (LANG === 'uk') return row.translation_uk || row.translation_en || '';
  if (LANG === 'fa') return row.translation_fa || row.translation_en || '';
  return row.translation_en || '';
}

async function _resolveMeaningRows(rows) {
  var map = {};
  var uniq = [];
  var seen = {};
  rows.forEach(function(r) {
    if (!r || !r.id || seen[r.id]) return;
    seen[r.id] = true;
    uniq.push(r);
  });
  if (LANG === 'de' || LANG === 'en' || LANG === 'tr' || LANG === 'ru' || LANG === 'uk' || LANG === 'fa') {
    uniq.forEach(function(r){ map[r.id] = _rowMeaningForLang(r); });
    return map;
  }
  var cs = _defCacheFor(LANG), cache = cs.cache, saveFn = cs.saveFn;
  var toFetch = [];
  var queued = {};
  uniq.forEach(function(r) {
    var txt = (r.translation_en || '').trim();
    if (!txt) return;
    var key = normDefKey(txt);
    if (cache[key] === undefined && !queued[key]) {
      queued[key] = true;
      toFetch.push({ text: txt, key: key });
    }
  });
  if (toFetch.length) {
    await _batchTranslateDefs(toFetch, LANG, cache, saveFn, null, 'en');
  }
  uniq.forEach(function(r) {
    var txt = (r.translation_en || '').trim();
    map[r.id] = cache[normDefKey(txt)] || txt;
  });
  return map;
}

async function _buildSwipeBatch(level, count) {
  var pool = (CSV_QUIZ_DATA[level] || []).filter(function(r){
    return r.entry_type === 'main' && r.translation_en && r.translation_en.trim();
  });
  if (!pool.length) return [];
  var selected = shuffle(pool.slice()).slice(0, Math.min(count, pool.length));
  var cards = selected.map(function(row) {
    var isMatch = Math.random() < 0.5;
    var meaningRow = row;
    if (!isMatch) {
      var alt = shuffle(pool.slice()).find(function(d) {
        return d.id !== row.id && (d.translation_en || '').trim() !== (row.translation_en || '').trim();
      });
      if (alt) meaningRow = alt;
      else isMatch = true;
    }
    return { row: row, meaningRow: meaningRow, isMatch: isMatch, meaningText: '', correctMeaningText: '' };
  });
  var meaningMap = await _resolveMeaningRows(cards.reduce(function(acc, card) {
    acc.push(card.row, card.meaningRow);
    return acc;
  }, []));
  cards.forEach(function(card) {
    card.meaningText = meaningMap[card.meaningRow.id] || card.meaningRow.translation_en || '';
    card.correctMeaningText = meaningMap[card.row.id] || card.row.translation_en || '';
  });
  return cards;
}

async function prepareSwipeGame() {
  var _ov = document.getElementById('quiz-prep-overlay');
  _ov.classList.add('active');
  try {
    await _loadCSVLevel(swipeSelectedLevel);
    swipeDeck = await _buildSwipeBatch(swipeSelectedLevel, QUIZ_LEN);
    swipeIdx = 0;
    swipeGood = 0;
    swipeBad = 0;
    swipePreloadPromise = null;
    swipeAnimating = false;
    window.umami?.track('quick_match_started', { level: swipeSelectedLevel });
    show('screen-swipe');
    renderSwipeCards();
  } catch (err) {
    var msg = t('errSwipePrepare');
    if (err && err.message) msg += '\n\n' + err.message;
    alert(msg);
  } finally {
    _ov.classList.remove('active');
  }
}

function _swipeWordLabel(row) {
  return (row.article ? row.article + ' ' : '') + expandOptional(row.word);
}

function _swipeWordSub(row) {
  if (row.plural && row.plural.trim()) return 'Pl.: ' + row.plural;
  if (row.verb_present && row.verb_present.trim()) return row.verb_present;
  return '';
}

function _renderSwipeCardHtml(card, posClass) {
  return '<div class="swipe-card glass glass-tile glass-highlight glass-chrome ' + posClass + '" data-swipe-pos="' + posClass + '">'
    + '<div class="swipe-word-block">'
    + '<div class="swipe-word">' + escHtml(_swipeWordLabel(card.row)) + '</div>'
    + '<div class="swipe-helper">' + escHtml(_swipeWordSub(card.row)) + '</div>'
    + '</div>'
    + '<div class="swipe-meaning-box glass glass-chrome"><div class="swipe-meaning-label">' + escHtml(t('swipeMeaningLabel')) + '</div><div class="swipe-meaning">' + escHtml(card.meaningText) + '</div></div>'
    + '</div>';
}

function _cardStackExitMs() {
  return _tabReducedMotion() ? 0 : 260;
}

function _releaseCardSettling(el) {
  if (!el) return;
  if (_tabReducedMotion()) {
    el.classList.remove('is-settling');
    return;
  }
  var settled = false;
  var finish = function() {
    if (settled) return;
    settled = true;
    el.classList.remove('is-settling');
    el.removeEventListener('transitionend', onEnd);
  };
  var onEnd = function(e) {
    if (e.target !== el || e.propertyName !== 'transform') return;
    finish();
  };
  el.addEventListener('transitionend', onEnd);
  setTimeout(finish, 380);
}

function _cardStackPromote(cfg) {
  var stack = document.getElementById(cfg.stackId);
  if (!stack) return false;
  var top = stack.querySelector('.' + cfg.cardClass + '.top');
  var under1 = stack.querySelector('.' + cfg.cardClass + '.under-1');
  var under2 = stack.querySelector('.' + cfg.cardClass + '.under-2');
  if (top) top.remove();
  if (!cfg.deck[cfg.idx]) {
    if (cfg.renderEmpty) cfg.renderEmpty(stack);
    return true;
  }
  if (!under1) return false;
  under1.classList.remove('under-1', 'dragging', 'swipe-left', 'swipe-right', 'flipped');
  under1.style.transform = '';
  under1.classList.add('top', 'is-settling');
  _releaseCardSettling(under1);
  if (under2) {
    under2.classList.remove('under-2');
    under2.classList.add('under-1');
  }
  var incoming = cfg.deck[cfg.idx + 2];
  if (incoming) {
    var wrap = document.createElement('div');
    wrap.innerHTML = cfg.renderCard(incoming, 'under-2');
    var el = wrap.firstElementChild;
    if (el) {
      if (!_tabReducedMotion()) el.classList.add('is-stack-enter');
      stack.insertBefore(el, stack.firstChild);
      if (!_tabReducedMotion()) {
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            el.classList.remove('is-stack-enter');
          });
        });
      }
    }
  }
  if (cfg.attachTop) cfg.attachTop(stack.querySelector('.' + cfg.cardClass + '.top'));
  return true;
}

function renderSwipeCards() {
  var stack = document.getElementById('swipe-card-stack');
  var current = swipeDeck[swipeIdx];
  if (!current) {
    stack.innerHTML = '<div class="swipe-empty"><strong>' + escHtml(t('swipeEmptyTitle')) + '</strong><span>' + escHtml(t('swipeEmptySub')) + '</span></div>';
    return;
  }
  var next1 = swipeDeck[swipeIdx + 1];
  var next2 = swipeDeck[swipeIdx + 2];
  stack.innerHTML =
    (next2 ? _renderSwipeCardHtml(next2, 'under-2') : '') +
    (next1 ? _renderSwipeCardHtml(next1, 'under-1') : '') +
    _renderSwipeCardHtml(current, 'top');
  _attachSwipeGesture(stack.querySelector('.swipe-card.top'));
  _ensureSwipePrefetch();
}

function _attachSwipeGesture(cardEl) {
  if (!cardEl) return;
  var startX = 0, currentX = 0, dragging = false;
  cardEl.onpointerdown = function(e) {
    if (swipeAnimating) return;
    if (e.cancelable) e.preventDefault();
    dragging = true;
    startX = e.clientX;
    currentX = 0;
    cardEl.classList.add('dragging');
    cardEl.setPointerCapture(e.pointerId);
  };
  cardEl.onpointermove = function(e) {
    if (!dragging) return;
    if (e.cancelable) e.preventDefault();
    currentX = e.clientX - startX;
    var rot = currentX * 0.05;
    cardEl.style.transform = 'translateX(' + currentX + 'px) rotate(' + rot + 'deg)';
  };
  cardEl.onpointerup = function(e) {
    if (!dragging) return;
    if (e.cancelable) e.preventDefault();
    dragging = false;
    cardEl.classList.remove('dragging');
    cardEl.releasePointerCapture(e.pointerId);
    if (Math.abs(currentX) > 90) {
      _animateSwipe(currentX > 0 ? 'right' : 'left', cardEl);
    } else {
      cardEl.style.transform = '';
    }
  };
  cardEl.onpointercancel = function(e) {
    if (e && e.cancelable) e.preventDefault();
    dragging = false;
    cardEl.classList.remove('dragging');
    cardEl.style.transform = '';
  };
}

function swipeAction(dir) {
  var top = document.querySelector('#swipe-card-stack .swipe-card.top');
  if (top) _animateSwipe(dir, top);
}

function _animateSwipe(dir, cardEl) {
  if (swipeAnimating) return;
  swipeAnimating = true;
  if (cardEl) {
    cardEl.classList.remove('dragging');
    cardEl.style.transform = '';
    cardEl.classList.add(dir === 'right' ? 'swipe-right' : 'swipe-left');
  }
  setTimeout(function() {
    _finalizeSwipe(dir);
    swipeAnimating = false;
  }, _cardStackExitMs());
}

function _showSwipeToast(success, card) {
  var flash = document.getElementById('swipe-flash');
  var mark = document.getElementById('swipe-flash-mark');
  var note = document.getElementById('swipe-flash-note');
  flash.className = 'swipe-flash ' + (success ? 'good' : 'bad');
  mark.textContent = success
    ? (card.isMatch ? t('swipeToastGoodMatch') : t('swipeToastGoodMiss'))
    : (card.isMatch ? t('swipeToastBadMatch') : t('swipeToastBadMiss'));
  if (success) {
    note.hidden = true;
    note.textContent = '';
  } else {
    note.hidden = false;
    note.textContent = t('swipeMeaningLabel') + ': ' + card.correctMeaningText;
  }
  flash.classList.add('show');
  clearTimeout(_showSwipeToast._timer);
  _showSwipeToast._timer = setTimeout(function() {
    flash.classList.remove('show');
  }, 2400);
}

function _finalizeSwipe(dir) {
  var card = swipeDeck[swipeIdx];
  if (!card) return;
  var guessedMatch = dir === 'right';
  var success = guessedMatch === card.isMatch;
  if (success) swipeGood++;
  else swipeBad++;
  _showSwipeToast(success, card);
  swipeIdx++;
  if (!_cardStackPromote({
    stackId: 'swipe-card-stack',
    cardClass: 'swipe-card',
    deck: swipeDeck,
    idx: swipeIdx,
    renderCard: _renderSwipeCardHtml,
    attachTop: _attachSwipeGesture,
    renderEmpty: function(stack) {
      stack.innerHTML = '<div class="swipe-empty"><strong>' + escHtml(t('swipeEmptyTitle')) + '</strong><span>' + escHtml(t('swipeEmptySub')) + '</span></div>';
    }
  })) renderSwipeCards();
  else _ensureSwipePrefetch();
}

function _ensureSwipePrefetch() {
  if (swipePreloadPromise) return;
  if (swipeDeck.length - swipeIdx > 3) return;
  swipePreloadPromise = _buildSwipeBatch(swipeSelectedLevel, QUIZ_LEN)
    .then(function(batch) {
      swipeDeck = swipeDeck.concat(batch);
    })
    .catch(function(){})
    .finally(function() {
      swipePreloadPromise = null;
    });
}

async function _swipeRefreshLang() {
  if (!swipeDeck.length) return;
  var _ov = document.getElementById('quiz-prep-overlay');
  _ov.classList.add('active');
  try {
    var meanings = await _resolveMeaningRows(swipeDeck.slice(swipeIdx).reduce(function(acc, card) {
      acc.push(card.row, card.meaningRow);
      return acc;
    }, []));
    swipeDeck.forEach(function(card) {
      card.meaningText = meanings[card.meaningRow.id] || card.meaningRow.translation_en || '';
      card.correctMeaningText = meanings[card.row.id] || card.row.translation_en || '';
    });
    renderSwipeCards();
  } finally {
    _ov.classList.remove('active');
  }
}

// ══════════════════════════════════════════════════════════════════
//  PRACTICE MODE
// ══════════════════════════════════════════════════════════════════
function _practiceFilterKeys(group) {
  return Object.keys(practiceFilters[group] || {}).filter(function(k) {
    return k !== PRACTICE_ALL_KEY && practiceFilters[group][k];
  });
}

function _practiceGroupIsAll(group) {
  var g = practiceFilters[group] || {};
  if (g[PRACTICE_ALL_KEY]) return true;
  return _practiceFilterKeys(group).length === 0;
}

function _practiceHasActiveFilters() {
  return ['difficulties', 'categories', 'wordTypes', 'articles'].some(function(g) {
    return !_practiceGroupIsAll(g);
  });
}

function _practiceSelectedLevelKeys() {
  return ['A1', 'A2', 'B1'].filter(function(k) { return practiceSelectedLevels[k]; });
}

function _getPracticeFilteredPool(level) {
  var levels = level ? [level] : _practiceSelectedLevelKeys();
  var pool = [];
  levels.forEach(function(lv) {
    (CSV_QUIZ_DATA[lv] || []).forEach(function(r) {
      if (r.entry_type === 'main' && r.word && r.word.trim()) pool.push(r);
    });
  });
  if (!_practiceGroupIsAll('difficulties')) {
    var diffs = _practiceFilterKeys('difficulties');
    var diffSet = {};
    diffs.forEach(function(d) { diffSet[parseInt(d, 10)] = true; });
    pool = pool.filter(function(r) {
      var d = parseInt(r.difficulty, 10);
      return diffSet[d];
    });
  }
  if (!_practiceGroupIsAll('categories')) {
    var cats = _practiceFilterKeys('categories');
    var catSet = {};
    cats.forEach(function(c) { catSet[parseInt(c, 10)] = true; });
    pool = pool.filter(function(r) { return catSet[parseInt(r.category_id, 10)]; });
  }
  if (!_practiceGroupIsAll('wordTypes')) {
    var types = _practiceFilterKeys('wordTypes');
    var typeSet = {};
    types.forEach(function(tk) { typeSet[tk] = true; });
    pool = pool.filter(function(r) { return typeSet[r.word_type]; });
  }
  if (!_practiceGroupIsAll('articles')) {
    var arts = _practiceFilterKeys('articles');
    var artSet = {};
    arts.forEach(function(a) { artSet[a] = true; });
    pool = pool.filter(function(r) { return r.article && artSet[r.article]; });
  }
  return pool;
}

function _updatePracticeMatchCount() {
  var count = _getPracticeFilteredPool().length;
  var numEl = document.getElementById('practice-match-num');
  var wrapEl = document.getElementById('practice-match-count');
  var hintEl = document.getElementById('practice-match-hint');
  var btnEl = document.getElementById('practice-prepare-btn');
  if (numEl) numEl.textContent = formatNum(count);
  if (wrapEl) wrapEl.classList.toggle('is-empty', count === 0);
  if (hintEl) hintEl.classList.toggle('hidden', count > 0);
  if (btnEl) btnEl.disabled = count === 0;
}

function _renderPracticeChip(group, key, label, extraClass, icon) {
  var active = key === PRACTICE_ALL_KEY
    ? _practiceGroupIsAll(group)
    : (!_practiceGroupIsAll(group) && !!(practiceFilters[group] && practiceFilters[group][key]));
  return '<button type="button" class="practice-chip glass glass-pill glass-chrome glass-interactive' + (active ? ' active' : '') +
    (extraClass ? ' ' + extraClass : '') + '" onclick="practiceToggleFilter(\'' + group + '\',\'' +
    String(key).replace(/'/g, "\\'") + '\')">' +
    (icon ? '<span class="chip-icon">' + icon + '</span>' : '') +
    escHtml(label) + '</button>';
}

function _practiceAllChip(group) {
  return _renderPracticeChip(group, PRACTICE_ALL_KEY, t('practiceFilterAll'), 'all-chip');
}

function _renderPracticeSetupFilters() {
  var diffEl = document.getElementById('practice-difficulty-chips');
  if (diffEl) {
    var diffHtml = _practiceAllChip('difficulties');
    for (var d = 1; d <= 10; d++) diffHtml += _renderPracticeChip('difficulties', String(d), formatNum(d));
    diffEl.innerHTML = diffHtml;
  }
  var typeEl = document.getElementById('practice-type-chips');
  if (typeEl) {
    var badges = t('typeBadge') || {};
    typeEl.innerHTML = _practiceAllChip('wordTypes') + PRACTICE_WORD_TYPES.map(function(wt) {
      return _renderPracticeChip('wordTypes', wt, badges[wt] || wt);
    }).join('');
  }
  var artEl = document.getElementById('practice-article-chips');
  if (artEl) {
    artEl.innerHTML = _practiceAllChip('articles') + PRACTICE_ARTICLES.map(function(a) {
      return _renderPracticeChip('articles', a, a);
    }).join('');
  }
  var catEl = document.getElementById('practice-category-chips');
  if (catEl) {
    var catNames = t('categoryNames') || {};
    catEl.innerHTML = _practiceAllChip('categories') + CATEGORY_MAP.map(function(cat) {
      var label = catNames[cat.id] || cat.name;
      return _renderPracticeChip('categories', String(cat.id), label, 'cat-chip', cat.icon);
    }).join('');
  }
}

function practiceToggleFilter(group, key) {
  if (!practiceFilters[group]) practiceFilters[group] = {};
  if (key === PRACTICE_ALL_KEY) {
    practiceFilters[group] = { __all__: true };
  } else {
    delete practiceFilters[group][PRACTICE_ALL_KEY];
    if (practiceFilters[group][key]) delete practiceFilters[group][key];
    else practiceFilters[group][key] = true;
    if (!_practiceFilterKeys(group).length) practiceFilters[group] = { __all__: true };
  }
  _renderPracticeSetupFilters();
  _updatePracticeMatchCount();
}

function practiceClearFilters() {
  practiceFilters = {
    difficulties: { __all__: true },
    categories: { __all__: true },
    wordTypes: { __all__: true },
    articles: { __all__: true }
  };
  _renderPracticeSetupFilters();
  _updatePracticeMatchCount();
}

async function _initPracticeTab() {
  try {
    await _loadV2Vocab();
  } catch (e) {}
  _renderPracticeSetupFilters();
  _updatePracticeMatchCount();
}

async function openPracticeSetup() {
  window.umami?.track('practice_opened');
  switchTab('practice');
  _resetTabStack('practice');
  _syncAppChrome();
}

function setPracticeLevel(lv) {
  var keys = _practiceSelectedLevelKeys();
  if (practiceSelectedLevels[lv] && keys.length <= 1) return;
  if (practiceSelectedLevels[lv]) delete practiceSelectedLevels[lv];
  else practiceSelectedLevels[lv] = true;
  ['A1','A2','B1'].forEach(function(k) {
    document.getElementById('practice-level-' + k).classList.toggle('active', !!practiceSelectedLevels[k]);
  });
  _updatePracticeMatchCount();
}

function _buildPracticeBatch() {
  var all = _getPracticeFilteredPool();
  var unseen = all.filter(function(r) { return !practiceSeenIds[r.id]; });
  if (!unseen.length) {
    practiceSeenIds = {};
    unseen = all.slice();
  }
  var batch = shuffle(unseen.slice()).slice(0, QUIZ_LEN);
  batch.forEach(function(r) { practiceSeenIds[r.id] = true; });
  return batch;
}

async function startPracticeGame() {
  var levels = _practiceSelectedLevelKeys();
  var pool = _getPracticeFilteredPool();
  if (!pool.length) {
    _updatePracticeMatchCount();
    return;
  }
  var _ov = document.getElementById('quiz-prep-overlay');
  _ov.classList.add('active');
  try {
    await Promise.all(levels.map(function(lv) { return _loadCSVLevel(lv); }));
    practiceSeenIds = {};
    practiceDeck = _buildPracticeBatch();
    if (!practiceDeck.length) { alert(t('errNoPracticeCards')); return; }
    practiceIdx = 0;
    practicePreloadPromise = null;
    practiceAnimating = false;
    window.umami?.track('practice_started', {
      level: levels.join(','),
      filtered_count: pool.length,
      filters_active: _practiceHasActiveFilters()
    });
    show('screen-practice');
    renderPracticeCards();
  } catch (err) {
    alert(t('errLoadPractice') + (err && err.message ? '\n' + err.message : ''));
  } finally {
    _ov.classList.remove('active');
  }
}

function _renderPracticeCardHtml(row, posClass) {
  var word = (row.article ? row.article + ' ' : '') + expandOptional(row.word);
  var example = (row.example_de || '').trim();
  var meaning = _csvRowDisplay(row) || '';
  return '<div class="practice-card ' + posClass + '">'
    + '<div class="practice-card-inner">'
    + '<div class="practice-front glass glass-tile glass-highlight glass-chrome" dir="ltr">'
    + '<div class="practice-word">' + escHtml(word) + '</div>'
    + (example ? '<div class="practice-example">' + escHtml(example) + '</div>' : '')
    + '</div>'
    + '<div class="practice-back glass glass-tile glass-highlight glass-chrome">'
    + '<div class="practice-meaning-label">' + escHtml(t('practiceMeaningLabel')) + '</div>'
    + '<div class="practice-meaning">' + escHtml(meaning) + '</div>'
    + '</div>'
    + '</div>'
    + '</div>';
}

function _practiceRefreshCards() {
  if (!practiceDeck.length) return;
  renderPracticeCards();
}

function renderPracticeCards() {
  var stack = document.getElementById('practice-card-stack');
  var current = practiceDeck[practiceIdx];
  if (!current) {
    stack.innerHTML = '<div class="swipe-empty"><strong>' + escHtml(t('practiceDoneTitle')) + '</strong><span>' + escHtml(t('practiceDoneSub')) + '</span></div>';
    return;
  }
  var next1 = practiceDeck[practiceIdx + 1];
  var next2 = practiceDeck[practiceIdx + 2];
  stack.innerHTML =
    (next2 ? _renderPracticeCardHtml(next2, 'under-2') : '') +
    (next1 ? _renderPracticeCardHtml(next1, 'under-1') : '') +
    _renderPracticeCardHtml(current, 'top');
  _attachPracticeGesture(stack.querySelector('.practice-card.top'));
  _ensurePracticePrefetch();
}

function _attachPracticeGesture(cardEl) {
  if (!cardEl) return;
  var startX = 0, startY = 0, currentX = 0, dragging = false, moved = false;
  cardEl.onpointerdown = function(e) {
    if (practiceAnimating) return;
    if (e.cancelable) e.preventDefault();
    dragging = true; moved = false;
    startX = e.clientX; startY = e.clientY; currentX = 0;
    cardEl.setPointerCapture(e.pointerId);
  };
  cardEl.onpointermove = function(e) {
    if (!dragging) return;
    if (e.cancelable) e.preventDefault();
    currentX = e.clientX - startX;
    var dy = e.clientY - startY;
    if (Math.abs(currentX) > 10 || Math.abs(dy) > 10) {
      moved = true;
      if (!cardEl.classList.contains('dragging')) cardEl.classList.add('dragging');
    }
    if (moved) {
      var rot = currentX * 0.05;
      cardEl.style.transform = 'translateX(' + currentX + 'px) rotate(' + rot + 'deg)';
    }
  };
  cardEl.onpointerup = function(e) {
    if (!dragging) return;
    if (e.cancelable) e.preventDefault();
    dragging = false;
    cardEl.classList.remove('dragging');
    cardEl.releasePointerCapture(e.pointerId);
    if (!moved) {
      cardEl.style.transform = '';
      cardEl.classList.toggle('flipped');
    } else if (Math.abs(currentX) > 90) {
      _animatePracticeDismiss(currentX > 0 ? 'right' : 'left', cardEl);
    } else {
      cardEl.style.transform = '';
    }
  };
  cardEl.onpointercancel = function(e) {
    if (e && e.cancelable) e.preventDefault();
    dragging = false;
    cardEl.classList.remove('dragging');
    cardEl.style.transform = '';
  };
}

function practiceFlipAction() {
  var top = document.querySelector('#practice-card-stack .practice-card.top');
  if (top && !practiceAnimating) top.classList.toggle('flipped');
}

function practiceDismissAction() {
  var top = document.querySelector('#practice-card-stack .practice-card.top');
  if (top) _animatePracticeDismiss('right', top);
}

function _animatePracticeDismiss(dir, cardEl) {
  if (practiceAnimating) return;
  practiceAnimating = true;
  if (cardEl) {
    cardEl.classList.remove('dragging');
    cardEl.style.transform = '';
    cardEl.classList.add(dir === 'right' ? 'swipe-right' : 'swipe-left');
  }
  setTimeout(function() {
    practiceIdx++;
    if (!_cardStackPromote({
      stackId: 'practice-card-stack',
      cardClass: 'practice-card',
      deck: practiceDeck,
      idx: practiceIdx,
      renderCard: _renderPracticeCardHtml,
      attachTop: _attachPracticeGesture,
      renderEmpty: function(stack) {
        stack.innerHTML = '<div class="swipe-empty"><strong>' + escHtml(t('practiceDoneTitle')) + '</strong><span>' + escHtml(t('practiceDoneSub')) + '</span></div>';
      }
    })) renderPracticeCards();
    else _ensurePracticePrefetch();
    practiceAnimating = false;
  }, _cardStackExitMs());
}

function _ensurePracticePrefetch() {
  if (practicePreloadPromise) return;
  if (practiceDeck.length - practiceIdx > 5) return;
  practicePreloadPromise = Promise.resolve().then(function() {
    var batch = _buildPracticeBatch();
    if (batch.length) practiceDeck = practiceDeck.concat(batch);
  }).catch(function(){}).finally(function() {
    practicePreloadPromise = null;
  });
}

// ══════════════════════════════════════════════════════════════════
//  RANDOM WORD EXPLORER
// ══════════════════════════════════════════════════════════════════
let lastRandIdx = -1;
let rwWordKey = null;

function getFallbackWordExample(wordKey) {
  var key = normKey(wordKey);
  var found = null;
  ['A1','A2','B1'].forEach(function(lv) {
    if (found) return;
    var r = (CSV_QUIZ_DATA[lv]||[]).find(function(x){ return normKey(x.word) === key; });
    if (r && r.example_de && r.example_de.trim()) found = r.example_de.trim();
  });
  return found;
}

function getExampleForForm(wordKey, formKey) {
  var fallback = getFallbackWordExample(wordKey);
  if (fallback) return { text: fallback, isHtml: false };
  return null;
}

function pickFormExample(el, key, modal) {
  var scope = modal
    ? document.getElementById('word-modal-content')
    : document.getElementById('rw-content');
  if (!scope) return;
  scope.querySelectorAll('.rw-form').forEach(function(c){ c.classList.remove('active-chip'); });
  el.classList.add('active-chip');
  var box = scope.querySelector(modal ? '#wm-ex-box' : '#rw-ex-box');
  if (!box) return;
  var ex = getExampleForForm(rwWordKey, key);
  if (ex) {
    if (ex.isHtml) box.innerHTML = ex.text;
    else box.textContent = ex.text;
    box.classList.add('lit');
  } else {
    box.textContent = UI[LANG].noExample;
    box.classList.remove('lit');
  }
}

// ══════════════════════════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════════════════════════
function escHtml(s) {
  if (s == null) return '';
  if (typeof s === 'object') {
    try {
      s = JSON.stringify(s);
    } catch (e) {
      s = String(s);
    }
  } else {
    s = String(s);
  }
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function typeChar(t) {
  t = (t||'').toLowerCase();
  if (t==='noun')      return 'N';
  if (t==='verb')      return 'V';
  if (t==='adjective') return 'A';
  if (t==='phrase')    return 'P';
  if (t==='adverb')    return 'D';
  return 'O';
}
function tcName(tc) {
  return {N:'Noun',V:'Verb',A:'Adjective',P:'Phrase',D:'Adverb',O:'Word','?':'Word'}[tc] || tc || 'Word';
}
// German grammatical term labels — used in the word card so the app stays
// oriented toward German learning regardless of the UI display language.
function tcNameDE(tc) {
  return {N:'Substantiv',V:'Verb',A:'Adjektiv',P:'Phrase',D:'Adverb',O:'Wort','?':'Wort'}[tc] || tc || 'Wort';
}
// Convert English Wiktionary POS string → German label for the card badge
function posLabelDE(pos) {
  return {
    'noun':'Substantiv','verb':'Verb','adjective':'Adjektiv','adverb':'Adverb',
    'article':'Artikel','conjunction':'Konjunktion','preposition':'Präposition',
    'pronoun':'Pronomen','numeral':'Numerale','particle':'Partikel',
    'interjection':'Interjektion','determiner':'Determiner',
    'wortform':'Wortform','verb form':'Verbform','noun form':'Nominalform',
    'adjective form':'Adjektivform'
  }[pos.toLowerCase()] || (pos.charAt(0).toUpperCase() + pos.slice(1));
}
// Expand optional-letter notation used in some word lists: "nah(e)" → "nahe", "Hend(e)l" → "Hendel"
function expandOptional(w) {
  return (w||'').replace(/\(([a-zA-Z\u00C0-\u024F]+)\)/g, '$1');
}
function normKey(w) {
  return expandOptional(w||'').replace(/^(der|die|das|ein|eine)\s+/i,'').trim().toLowerCase();
}
function loadingHTML() {
  return '<div class="wikt-loading"><div class="wikt-spinner"></div><span>' + t('dictLoading') + '</span></div>';
}
function wiktLookupWord(word, tc) {
  var base = expandOptional(word).replace(/^(der|die|das|ein|eine)\s+/i,'').trim();
  // Verbs, adjectives, adverbs, prepositions and conjunctions are lowercase in
  // Wiktionary German entries. Nouns, unknown words and everything else must be
  // capitalised (German capitalisation rule applies to nouns; for unknown/? type
  // words from frequency lists most are nouns, and Wiktionary redirects handle
  // the rest).
  var forceLower = (tc === 'V' || tc === 'A' || tc === 'D' || tc === 'R' || tc === 'C');
  return forceLower
    ? base.charAt(0).toLowerCase() + base.slice(1)
    : base.charAt(0).toUpperCase() + base.slice(1);
}
function metaFromWord(word) {
  var key = normKey(word);
  // Look up from CSV data
  var csvRow = null;
  ['A1','A2','B1'].forEach(function(lv) {
    if (csvRow) return;
    var r = (CSV_QUIZ_DATA[lv]||[]).find(function(x){ return normKey(x.word) === key; });
    if (r) csvRow = r;
  });
  var _ukFromCsv = csvRow && csvRow.translation_uk ? csvRow.translation_uk.trim() : '';
  var _faFromCsv = _faCsvMap[key] || '';
  var _arFromCsv = _arCsvMap[key] || '';
  if (csvRow) {
    return { word: csvRow.word, tc: typeChar(csvRow.word_type), en: csvRow.translation_en||'', tr: (_trMemCache&&_trMemCache[key]) || csvRow.translation_tr||'', fa: _faFromCsv || (_faMemCache&&_faMemCache[key])||'', ru: (_ruMemCache&&_ruMemCache[key]) || csvRow.translation_ru||'', uk: _ukFromCsv, ar: _arFromCsv || (_arMemCache&&_arMemCache[key])||'' };
  }
  return { word: word, tc: '?', en: '', tr: (_trMemCache&&_trMemCache[key])||'', fa: _faFromCsv || (_faMemCache&&_faMemCache[key])||'', ru: (_ruMemCache&&_ruMemCache[key])||'', uk: _ukFromCsv, ar: _arFromCsv || (_arMemCache&&_arMemCache[key])||'' };
}

// ── German verb lemmatizer ─────────────────────────────────────────
// Given an inflected (conjugated/participle) form, return the likely
// infinitive using the CSV vocabulary data.
// e.g. "verschwendet" → "verschwenden", "gespielt" → "spielen"
// Irregular (strong) verb Präteritum forms → infinitive.
// Covers A1–B2 vocabulary plus the most common irregular verbs a learner meets.
var STRONG_PAST = (function(){
  var m = {};
  var pairs = [
    ['blieb','bleiben'],['bliebst','bleiben'],['blieben','bleiben'],['bliebt','bleiben'],
    ['ging','gehen'],['gingst','gehen'],['gingen','gehen'],['gingt','gehen'],
    ['kam','kommen'],['kamst','kommen'],['kamen','kommen'],['kamt','kommen'],
    ['stand','stehen'],['standst','stehen'],['standen','stehen'],['standet','stehen'],
    ['fuhr','fahren'],['fuhrst','fahren'],['fuhren','fahren'],['fuhrt','fahren'],
    ['nahm','nehmen'],['nahmst','nehmen'],['nahmen','nehmen'],['nahmt','nehmen'],
    ['sah','sehen'],['sahst','sehen'],['sahen','sehen'],['saht','sehen'],
    ['gab','geben'],['gabst','geben'],['gaben','geben'],['gabt','geben'],
    ['fand','finden'],['fandst','finden'],['fanden','finden'],['fandet','finden'],
    ['rief','rufen'],['riefst','rufen'],['riefen','rufen'],['rieft','rufen'],
    ['lief','laufen'],['liefst','laufen'],['liefen','laufen'],['lieft','laufen'],
    ['hielt','halten'],['hieltest','halten'],['hielten','halten'],['hieltet','halten'],
    ['ließ','lassen'],['ließest','lassen'],['ließen','lassen'],['ließt','lassen'],
    ['hieß','heißen'],['hießest','heißen'],['hießen','heißen'],['hießt','heißen'],
    ['schlief','schlafen'],['schliefst','schlafen'],['schliefen','schlafen'],['schlieft','schlafen'],
    ['schrieb','schreiben'],['schriebst','schreiben'],['schrieben','schreiben'],['schriebt','schreiben'],
    ['sprach','sprechen'],['sprachst','sprechen'],['sprachen','sprechen'],['spracht','sprechen'],
    ['trug','tragen'],['trugst','tragen'],['trugen','tragen'],['trugt','tragen'],
    ['zog','ziehen'],['zogst','ziehen'],['zogen','ziehen'],['zogt','ziehen'],
    ['flog','fliegen'],['flogst','fliegen'],['flogen','fliegen'],['flogt','fliegen'],
    ['saß','sitzen'],['saßest','sitzen'],['saßen','sitzen'],['saßt','sitzen'],
    ['las','lesen'],['last','lesen'],['lasen','lesen'],
    ['aß','essen'],['aßest','essen'],['aßen','essen'],['aßt','essen'],
    ['trank','trinken'],['trankst','trinken'],['tranken','trinken'],['trankt','trinken'],
    ['sang','singen'],['sangst','singen'],['sangen','singen'],['sangt','singen'],
    ['bat','bitten'],['batst','bitten'],['baten','bitten'],['batet','bitten'],
    ['bot','bieten'],['botst','bieten'],['boten','bieten'],['botet','bieten'],
    ['bog','biegen'],['bogst','biegen'],['bogen','biegen'],['bogt','biegen'],
    ['ritt','reiten'],['rittest','reiten'],['ritten','reiten'],['rittet','reiten'],
    ['griff','greifen'],['griffst','greifen'],['griffen','greifen'],['grifft','greifen'],
    ['schrieb','schreiben'],['schnitt','schneiden'],['schnittest','schneiden'],['schnitten','schneiden'],
    ['stahl','stehlen'],['stahlst','stehlen'],['stahlen','stehlen'],
    ['half','helfen'],['halfst','helfen'],['halfen','helfen'],
    ['traf','treffen'],['trafst','treffen'],['trafen','treffen'],['traft','treffen'],
    ['vergaß','vergessen'],['vergaßest','vergessen'],['vergaßen','vergessen'],
    ['verlor','verlieren'],['verlorst','verlieren'],['verloren','verlieren'],
    ['gewann','gewinnen'],['gewannst','gewinnen'],['gewannen','gewinnen'],
    ['begann','beginnen'],['begannst','beginnen'],['begannen','beginnen'],
    ['rief','rufen'],['fiel','fallen'],['fielst','fallen'],['fielen','fallen'],['fielt','fallen'],
    ['wuchs','wachsen'],['wuchst','wachsen'],['wuchsen','wachsen'],
    ['warf','werfen'],['warfst','werfen'],['warfen','werfen'],['warft','werfen'],
    ['schlug','schlagen'],['schlugst','schlagen'],['schlugen','schlagen'],['schlugt','schlagen'],
    ['zog','ziehen'],['brach','brechen'],['brachst','brechen'],['brachen','brechen'],
    ['starb','sterben'],['starbst','sterben'],['starben','sterben'],
    ['roch','riechen'],['rochst','riechen'],['rochen','riechen'],
    ['log','lügen'],['logst','lügen'],['logen','lügen'],
    // ── Present-tense stem-changing (e→i, a→ä, etc.) du / er forms ──
    // These can't be detected by suffix rules because the stem vowel changes.
    ['isst','essen'],['ißt','essen'],                         // essen
    ['liest','lesen'],                                         // lesen
    ['gibt','geben'],['gibst','geben'],                        // geben
    ['nimmt','nehmen'],['nimmst','nehmen'],                    // nehmen
    ['spricht','sprechen'],['sprichst','sprechen'],            // sprechen
    ['trifft','treffen'],['triffst','treffen'],                // treffen
    ['hilft','helfen'],['hilfst','helfen'],                   // helfen
    ['wirft','werfen'],['wirfst','werfen'],                   // werfen
    ['bricht','brechen'],['brichst','brechen'],               // brechen
    ['sticht','stechen'],['stichst','stechen'],               // stechen
    ['tritt','treten'],['trittst','treten'],                  // treten
    ['vergisst','vergessen'],['vergisst','vergessen'],        // vergessen
    ['empfiehlt','empfehlen'],['empfiehlst','empfehlen'],    // empfehlen
    ['sieht','sehen'],['siehst','sehen'],                    // sehen (si- stem)
    ['stirbt','sterben'],['stirbst','sterben'],              // sterben
    // a → ä umlaut present
    ['läuft','laufen'],['läufst','laufen'],                  // laufen
    ['fährt','fahren'],['fährst','fahren'],                  // fahren
    ['schläft','schlafen'],['schläfst','schlafen'],          // schlafen
    ['hält','halten'],['hältst','halten'],                   // halten
    ['fällt','fallen'],['fällst','fallen'],                  // fallen
    ['trägt','tragen'],['trägst','tragen'],                  // tragen
    ['wächst','wachsen'],['wächst','wachsen'],               // wachsen
    ['schlägt','schlagen'],['schlägst','schlagen'],          // schlagen
    ['lässt','lassen'],['lässt','lassen'],                   // lassen (present)
    ['heißt','heißen'],                                       // heißen (present)
    ['lädt','laden'],['lädst','laden'],                      // laden
    // Irregular/modal present
    ['ist','sein'],['bist','sein'],                          // sein
    ['hat','haben'],['hast','haben'],                        // haben
    ['wird','werden'],['wirst','werden'],                    // werden
    ['kann','können'],['kannst','können'],                   // können
    ['muss','müssen'],['musst','müssen'],                    // müssen
    ['darf','dürfen'],['darfst','dürfen'],                   // dürfen
    ['will','wollen'],['willst','wollen'],                   // wollen
    ['soll','sollen'],['sollst','sollen'],                   // sollen
    ['mag','mögen'],['magst','mögen'],                       // mögen
    ['weiß','wissen'],['weißt','wissen'],                    // wissen
  ];
  pairs.forEach(function(p){ m[p[0]] = p[1]; });
  return m;
})();

function deduceLemma(word) {
  var w = word.toLowerCase().replace(/^(der|die|das|ein|eine)\s+/i,'').trim();
  // Check strong/irregular past tense table first
  if (STRONG_PAST[w]) return STRONG_PAST[w];
  var candidates = [];
  // ge- prefix past participle: gespielt → spielen, gearbeitet → arbeiten
  if (w.startsWith('ge') && w.length > 5) {
    var wGe = w.slice(2);
    if (wGe.endsWith('et')) candidates.push(wGe.slice(0,-2) + 'en');
    if (wGe.endsWith('t'))  candidates.push(wGe.slice(0,-1) + 'en');
  }
  // -et  → -en   verschwendet → verschwenden, arbeitet → arbeiten
  if (w.endsWith('et'))   candidates.push(w.slice(0,-2) + 'en');
  // -est → -en   arbeitest → arbeiten
  if (w.endsWith('est'))  candidates.push(w.slice(0,-3) + 'en');
  // -test→ -en   arbeitetest → arbeiten
  if (w.endsWith('test')) candidates.push(w.slice(0,-4) + 'en');
  // -ten → -en   arbeiteten → arbeiten
  if (w.endsWith('ten'))  candidates.push(w.slice(0,-3) + 'en');
  // -te  → -en   spielte → spielen
  if (w.endsWith('te'))   candidates.push(w.slice(0,-2) + 'en');
  // -st  → -en   spielst → spielen, kommst → kommen
  if (w.endsWith('st'))   candidates.push(w.slice(0,-2) + 'en');
  // -t   → -en   spielt → spielen (lower confidence; tried last)
  if (w.endsWith('t') && !w.endsWith('et')) candidates.push(w.slice(0,-1) + 'en');
  // -e   → -en   spiele → spielen
  if (w.endsWith('e') && !w.endsWith('ie')) candidates.push(w + 'n');

  for (var ci = 0; ci < candidates.length; ci++) {
    var c = candidates[ci];
    var csvVerb = null;
    ['A1','A2','B1'].every(function(lv) {
      var r = (CSV_QUIZ_DATA[lv]||[]).find(function(x){ return x.word.toLowerCase() === c && x.word_type === 'Verb'; });
      if (r) { csvVerb = r.word; return false; }
      return true;
    });
    if (csvVerb) return csvVerb;
  }
  return null;
}

// ══════════════════════════════════════════════════════════════════
//  WIKTIONARY FETCH + PARSE
// ══════════════════════════════════════════════════════════════════
async function fetchWiktionary(word, tc) {
  var lw = wiktLookupWord(word, tc);
  var data;
  try {
    data = await _wiktFetch(lw);
  } catch (e) {
    data = { found: false, word: lw, ipa: '', sections: [] };
  }
  // Retry with flipped first-letter case (handles ?-type words where we guessed
  // capitalisation but the Wiktionary entry is lowercase or vice versa)
  if (!data.found) {
    var alt = lw.charAt(0) === lw.charAt(0).toUpperCase()
      ? lw.charAt(0).toLowerCase() + lw.slice(1)
      : lw.charAt(0).toUpperCase() + lw.slice(1);
    if (alt !== lw) {
      try { var alt_data = await _wiktFetch(alt); if (alt_data.found) return alt_data; } catch(e) {}
    }
  }
  // Last resort: direct machine translation for the exact word
  if (!data.found) {
    var mmTrans = await fetchMyMemoryTranslation(word);
    if (mmTrans) data.autoTranslation = mmTrans;
  }
  return data;
}

async function _wiktFetch(lw) {
  var url = 'https://en.wiktionary.org/w/api.php?action=parse&page='
    + encodeURIComponent(lw)
    + '&prop=text&format=json&origin=*&redirects=1&disablelimitreport=1&disableeditsection=1';
  var resp = await fetch(url);
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  var json = await resp.json();
  if (json.error) throw new Error(json.error.info || 'API error');
  var data = parseWiktPage(json.parse.text['*'], lw);
  // If the HTML parse found nothing, fall back to the REST definition API
  if (!data.found) {
    try {
      var restData = await _wiktRestFetch(lw);
      if (restData.found) return restData;
    } catch(e) {}
  }
  return data;
}

// Wiktionary REST API fallback — returns structured definitions when the
// parse API's HTML doesn't contain a recognisable German section.
async function _wiktRestFetch(lw) {
  var url = 'https://en.wiktionary.org/api/rest_v1/page/definition/'
    + encodeURIComponent(lw) + '?redirect=true';
  var resp = await fetch(url);
  if (!resp.ok) return { found: false, word: lw, ipa: '', sections: [] };
  var json = await resp.json();
  var result = { found: false, word: lw, ipa: '', sections: [] };
  // The response is keyed by language code; German is 'de'
  var entries = json['de'] || [];
  // Also scan all keys for entries explicitly labelled German
  if (!entries.length) {
    Object.values(json).forEach(function(arr) {
      (arr || []).forEach(function(e) {
        if ((e.language || '').toLowerCase() === 'german') entries.push(e);
      });
    });
  }
  entries.forEach(function(entry) {
    var pos = (entry.partOfSpeech || 'word').toLowerCase();
    var sec = { pos: pos, headLine: '', defs: [], table: null, tableType: '' };
    (entry.definitions || []).slice(0, 6).forEach(function(def) {
      // Strip HTML tags from definition text
      var text = (def.definition || '').replace(/<[^>]*>/g, '').replace(/\s+/g,' ').trim();
      if (!text) return;
      var d = { text: text, examples: [] };
      // parsedExamples or examples array
      var exArr = def.parsedExamples || def.examples || [];
      exArr.slice(0, 2).forEach(function(ex) {
        var exTxt = typeof ex === 'string' ? ex : (ex.example || ex.text || '');
        exTxt = exTxt.replace(/<[^>]*>/g, '').replace(/\s+/g,' ').trim();
        if (exTxt) d.examples.push(exTxt);
      });
      sec.defs.push(d);
    });
    if (sec.defs.length) result.sections.push(sec);
  });
  result.found = result.sections.length > 0;
  return result;
}

// ── MyMemory machine-translation fallback (English only) ──
var _myMemoryCache = (function() {
  try { return JSON.parse(localStorage.getItem('dl_en_cache') || '{}'); } catch(e) { return {}; }
})();
function _myMemoryCacheSave() {
  try {
    var keys = Object.keys(_myMemoryCache);
    if (keys.length > 2000) {
      var trim = {};
      keys.slice(-1500).forEach(function(k){ trim[k] = _myMemoryCache[k]; });
      _myMemoryCache = trim;
    }
    localStorage.setItem('dl_en_cache', JSON.stringify(_myMemoryCache));
  } catch(e) {}
}
async function fetchMyMemoryTranslation(word) {
  var key = normKey(word);
  if (key.length < 2 || !/[a-zA-ZäöüÄÖÜß]/.test(key)) return null;
  if (_myMemoryCache[key] !== undefined) return _myMemoryCache[key];
  try {
    var url = 'https://api.mymemory.translated.net/get?q='
      + encodeURIComponent(key) + '&langpair=de|en';
    var resp = await fetch(url);
    if (resp.ok) {
      var json = await resp.json();
      if (json.responseStatus === 200 && json.responseData) {
        var t = (json.responseData.translatedText || '').trim();
        if (t && t.toLowerCase() !== key && !t.startsWith('PLEASE SELECT')) {
          _myMemoryCache[key] = t;
          _myMemoryCacheSave();
          return t;
        }
      }
    }
  } catch(e) {}
  _myMemoryCache[key] = null;
  _myMemoryCacheSave();
  return null;
}

// ── Turkish translation auto-fetch with localStorage persistence ──
var _trMemCache = (function() {
  try { return JSON.parse(localStorage.getItem('dl_tr_cache') || '{}'); } catch(e) { return {}; }
})();
function _trCacheSave() {
  try {
    var keys = Object.keys(_trMemCache);
    if (keys.length > 2000) {
      var trim = {};
      keys.slice(-1500).forEach(function(k){ trim[k] = _trMemCache[k]; });
      _trMemCache = trim;
    }
    localStorage.setItem('dl_tr_cache', JSON.stringify(_trMemCache));
  } catch(e) {}
}
async function fetchTurkish(word) {
  var key = normKey(word);
  if (key.length < 2 || !/[a-zA-ZäöüÄÖÜß]/.test(key)) return null;
  if (_trMemCache[key] !== undefined) return _trMemCache[key] || null;
  try {
    var url = 'https://api.mymemory.translated.net/get?q='
      + encodeURIComponent(word) + '&langpair=de|tr';
    var resp = await fetch(url);
    if (resp.ok) {
      var json = await resp.json();
      if (json.responseStatus === 200 && json.responseData) {
        var t = (json.responseData.translatedText || '').trim();
        if (t && t.toLowerCase() !== key && !t.startsWith('PLEASE SELECT')) {
          _trMemCache[key] = t;
          _trCacheSave();
          return t;
        }
      }
    }
  } catch(e) {}
  _trMemCache[key] = '';
  _trCacheSave();
  return null;
}
// Helper: auto-fetch the word-card main meaning (below the German word) for the active language.
// Logic is identical for all non-English languages:
//   Step 1 — translate the German word itself (de→target) via the language's fetch function.
//   Step 2 — if Step 1 returns nothing, translate the English meaning_en text (en→target) as
//             a fallback, and store the result in the word-level cache so it persists.
// Only the pending element for the CURRENT language is updated; all other language pending
// elements are silently ignored.
async function _autoFetchLangMeaning(word, container, enFallback) {
  if (LANG === 'en' || LANG === 'ru' || LANG === 'uk' || LANG === 'fa') return;
  var pendingClass = LANG + '-meaning-pending';
  var el = container.querySelector('.' + pendingClass);
  if (!el) return;

  var fetchFn = LANG==='tr' ? fetchTurkish
              : LANG==='fa' ? fetchPersian
              : LANG==='ru' ? fetchRussian
              : LANG==='uk' ? fetchUkrainian
              :                fetchArabic;
  var wordCache = LANG==='tr' ? _trMemCache : LANG==='fa' ? _faMemCache
               : LANG==='ru' ? _ruMemCache  : LANG==='uk' ? _ukMemCache : _arMemCache;
  var cacheSave = LANG==='tr' ? _trCacheSave : LANG==='fa' ? _faCacheSave
               : LANG==='ru' ? _ruCacheSave  : LANG==='uk' ? _ukCacheSave : _arCacheSave;

  // Step 1: de→target (direct German word translation)
  var result = await fetchFn(word);

  if (!result) {
    // Step 2: en→target (translate the English meaning as fallback)
    var meta = metaFromWord(word);
    var meaningEn = enFallback || meta.en || '';
    if (meaningEn) {
      try {
        var r = await fetch('https://api.mymemory.translated.net/get?q='
          + encodeURIComponent(meaningEn) + '&langpair=en|' + LANG);
        if (r.ok) {
          var j = await r.json();
          if (j.responseStatus === 200 && j.responseData) {
            var t = (j.responseData.translatedText || '').trim();
            if (t && !t.startsWith('PLEASE SELECT')) {
              result = t;
              // Store in word-level cache for future reuse
              wordCache[normKey(word)] = result;
              cacheSave();
            }
          }
        }
      } catch(e2) {}
    }
  }

  if (result && el.isConnected) {
    el.textContent = result;
    el.classList.remove(pendingClass);
  }
}

// ── Persian (Farsi) translation auto-fetch with localStorage persistence ──
var _faMemCache = (function() {
  try { return JSON.parse(localStorage.getItem('dl_fa_cache') || '{}'); } catch(e) { return {}; }
})();
function _faCacheSave() {
  try {
    var keys = Object.keys(_faMemCache);
    if (keys.length > 2000) {
      var trim = {};
      keys.slice(-1500).forEach(function(k){ trim[k] = _faMemCache[k]; });
      _faMemCache = trim;
    }
    localStorage.setItem('dl_fa_cache', JSON.stringify(_faMemCache));
  } catch(e) {}
}
async function fetchPersian(word) {
  var key = normKey(word);
  if (key.length < 2 || !/[a-zA-ZäöüÄÖÜß]/.test(key)) return null;
  if (_faMemCache[key] !== undefined) return _faMemCache[key] || null;
  try {
    var url = 'https://api.mymemory.translated.net/get?q='
      + encodeURIComponent(word) + '&langpair=de|fa';
    var resp = await fetch(url);
    if (resp.ok) {
      var json = await resp.json();
      if (json.responseStatus === 200 && json.responseData) {
        var t = (json.responseData.translatedText || '').trim();
        if (t && t.toLowerCase() !== key && !t.startsWith('PLEASE SELECT')) {
          _faMemCache[key] = t;
          _faCacheSave();
          return t;
        }
      }
    }
  } catch(e) {}
  _faMemCache[key] = '';
  _faCacheSave();
  return null;
}
// Helper: fetch Persian for a displayed word card and update the DOM element
// ── Russian translation auto-fetch with localStorage persistence ──
var _ruMemCache = (function() {
  try { return JSON.parse(localStorage.getItem('dl_ru_cache') || '{}'); } catch(e) { return {}; }
})();
function _ruCacheSave() {
  try {
    var keys = Object.keys(_ruMemCache);
    if (keys.length > 2000) {
      var trim = {};
      keys.slice(-1500).forEach(function(k){ trim[k] = _ruMemCache[k]; });
      _ruMemCache = trim;
    }
    localStorage.setItem('dl_ru_cache', JSON.stringify(_ruMemCache));
  } catch(e) {}
}
async function fetchRussian(word) {
  var key = normKey(word);
  if (key.length < 2 || !/[a-zA-ZäöüÄÖÜß]/.test(key)) return null;
  if (_ruMemCache[key] !== undefined) return _ruMemCache[key] || null;
  try {
    var url = 'https://api.mymemory.translated.net/get?q='
      + encodeURIComponent(word) + '&langpair=de|ru';
    var resp = await fetch(url);
    if (resp.ok) {
      var json = await resp.json();
      if (json.responseStatus === 200 && json.responseData) {
        var t = (json.responseData.translatedText || '').trim();
        if (t && t.toLowerCase() !== key && !t.startsWith('PLEASE SELECT')) {
          _ruMemCache[key] = t;
          _ruCacheSave();
          return t;
        }
      }
    }
  } catch(e) {}
  _ruMemCache[key] = '';
  _ruCacheSave();
  return null;
}

// ── Ukrainian translation auto-fetch with localStorage persistence ──
var _ukMemCache = (function() {
  try { return JSON.parse(localStorage.getItem('dl_uk_cache') || '{}'); } catch(e) { return {}; }
})();
function _ukCacheSave() {
  try {
    var keys = Object.keys(_ukMemCache);
    if (keys.length > 2000) {
      var trim = {};
      keys.slice(-1500).forEach(function(k){ trim[k] = _ukMemCache[k]; });
      _ukMemCache = trim;
    }
    localStorage.setItem('dl_uk_cache', JSON.stringify(_ukMemCache));
  } catch(e) {}
}
async function fetchUkrainian(word) {
  var key = normKey(word);
  if (key.length < 2 || !/[a-zA-ZäöüÄÖÜß]/.test(key)) return null;
  if (_ukMemCache[key] !== undefined) return _ukMemCache[key] || null;
  try {
    var url = 'https://api.mymemory.translated.net/get?q='
      + encodeURIComponent(word) + '&langpair=de|uk';
    var resp = await fetch(url);
    if (resp.ok) {
      var json = await resp.json();
      if (json.responseStatus === 200 && json.responseData) {
        var t = (json.responseData.translatedText || '').trim();
        if (t && t.toLowerCase() !== key && !t.startsWith('PLEASE SELECT')) {
          _ukMemCache[key] = t; _ukCacheSave(); return t;
        }
      }
    }
  } catch(e) {}
  _ukMemCache[key] = ''; _ukCacheSave(); return null;
}


// ── Arabic translation auto-fetch with localStorage persistence ──
var _arMemCache = (function() {
  try { return JSON.parse(localStorage.getItem('dl_ar_cache') || '{}'); } catch(e) { return {}; }
})();
function _arCacheSave() {
  try {
    var keys = Object.keys(_arMemCache);
    if (keys.length > 2000) {
      var trim = {};
      keys.slice(-1500).forEach(function(k){ trim[k] = _arMemCache[k]; });
      _arMemCache = trim;
    }
    localStorage.setItem('dl_ar_cache', JSON.stringify(_arMemCache));
  } catch(e) {}
}
async function fetchArabic(word) {
  var key = normKey(word);
  if (key.length < 2 || !/[a-zA-ZäöüÄÖÜß]/.test(key)) return null;
  if (_arMemCache[key] !== undefined) return _arMemCache[key] || null;
  try {
    var url = 'https://api.mymemory.translated.net/get?q='
      + encodeURIComponent(word) + '&langpair=de|ar';
    var resp = await fetch(url);
    if (resp.ok) {
      var json = await resp.json();
      if (json.responseStatus === 200 && json.responseData) {
        var t = (json.responseData.translatedText || '').trim();
        if (t && t.toLowerCase() !== key && !t.startsWith('PLEASE SELECT')) {
          _arMemCache[key] = t; _arCacheSave(); return t;
        }
      }
    }
  } catch(e) {}
  _arMemCache[key] = ''; _arCacheSave(); return null;
}


// ── Definition translation caches (per language, localStorage-backed) ──────
// Keyed by normalised definition text; separate from single-word caches.
function normDefKey(text) { return (text || '').trim().toLowerCase().slice(0, 250); }
var _defTrCache = (function(){ try { return JSON.parse(localStorage.getItem('dl_def_tr') || '{}'); } catch(e) { return {}; } })();
var _defFaCache = (function(){ try { return JSON.parse(localStorage.getItem('dl_def_fa') || '{}'); } catch(e) { return {}; } })();
var _defRuCache = (function(){ try { return JSON.parse(localStorage.getItem('dl_def_ru') || '{}'); } catch(e) { return {}; } })();
var _defUkCache = (function(){ try { return JSON.parse(localStorage.getItem('dl_def_uk') || '{}'); } catch(e) { return {}; } })();
var _defArCache = (function(){ try { return JSON.parse(localStorage.getItem('dl_def_ar') || '{}'); } catch(e) { return {}; } })();
function _defTrCacheSave(){try{var k=Object.keys(_defTrCache);if(k.length>400){var t={};k.slice(-300).forEach(function(x){t[x]=_defTrCache[x];});_defTrCache=t;}localStorage.setItem('dl_def_tr',JSON.stringify(_defTrCache));}catch(e){}}
function _defFaCacheSave(){try{var k=Object.keys(_defFaCache);if(k.length>400){var t={};k.slice(-300).forEach(function(x){t[x]=_defFaCache[x];});_defFaCache=t;}localStorage.setItem('dl_def_fa',JSON.stringify(_defFaCache));}catch(e){}}
function _defRuCacheSave(){try{var k=Object.keys(_defRuCache);if(k.length>400){var t={};k.slice(-300).forEach(function(x){t[x]=_defRuCache[x];});_defRuCache=t;}localStorage.setItem('dl_def_ru',JSON.stringify(_defRuCache));}catch(e){}}
function _defUkCacheSave(){try{var k=Object.keys(_defUkCache);if(k.length>400){var t={};k.slice(-300).forEach(function(x){t[x]=_defUkCache[x];});_defUkCache=t;}localStorage.setItem('dl_def_uk',JSON.stringify(_defUkCache));}catch(e){}}
function _defArCacheSave(){try{var k=Object.keys(_defArCache);if(k.length>400){var t={};k.slice(-300).forEach(function(x){t[x]=_defArCache[x];});_defArCache=t;}localStorage.setItem('dl_def_ar',JSON.stringify(_defArCache));}catch(e){}}
// ── Definition cache version invalidation ─────────────────────────────────
// Version key: bump this string whenever the source language for definition
// translations changes (e.g. de→target was wrong; now fixed to en→target).
(function() {
  var DEF_CACHE_VERSION = 'v2'; // was v1 (used de|target, now en|target)
  if (localStorage.getItem('dl_def_cache_ver') !== DEF_CACHE_VERSION) {
    ['dl_def_tr','dl_def_fa','dl_def_ru','dl_def_uk','dl_def_ar'].forEach(function(k){ localStorage.removeItem(k); });
    _defTrCache = {}; _defFaCache = {}; _defRuCache = {}; _defUkCache = {}; _defArCache = {};
    localStorage.setItem('dl_def_cache_ver', DEF_CACHE_VERSION);
  }
})();

function _defCacheFor(lang) {
  if (lang === 'tr') return { cache: _defTrCache, saveFn: _defTrCacheSave };
  if (lang === 'fa') return { cache: _defFaCache, saveFn: _defFaCacheSave };
  if (lang === 'ru') return { cache: _defRuCache, saveFn: _defRuCacheSave };
  if (lang === 'uk') return { cache: _defUkCache, saveFn: _defUkCacheSave };
  return { cache: _defArCache, saveFn: _defArCacheSave };
}

// Batch-fetches translations for items [{text, key, ...}] and stores results in cache.
// onResult(item, translatedText) is called for each successful translation (may be null).
// sourceLang: the language of the input text — 'en' for Wiktionary definitions, 'de' for German words.
async function _batchTranslateDefs(toFetch, langCode, cache, saveFn, onResult, sourceLang) {
  var src = sourceLang || 'en'; // Wiktionary definitions are in English
  var batches = [], cur = [], curLen = 0;
  toFetch.forEach(function(item) {
    var il = item.text.length + 1;
    if (curLen + il > 490 && cur.length) { batches.push(cur); cur = []; curLen = 0; }
    cur.push(item); curLen += il;
  });
  if (cur.length) batches.push(cur);
  await Promise.all(batches.map(async function(batch) {
    function applyResult(item, tr) {
      cache[item.key] = (tr && !tr.startsWith('PLEASE SELECT')) ? tr : '';
      if (onResult && cache[item.key]) onResult(item, cache[item.key]);
    }
    try {
      var url = 'https://api.mymemory.translated.net/get?q='
        + encodeURIComponent(batch.map(function(d){ return d.text; }).join('\n'))
        + '&langpair=' + src + '|' + langCode;
      var resp = await fetch(url);
      if (!resp.ok) throw new Error('http');
      var json = await resp.json();
      if (json.responseStatus !== 200 || !json.responseData) throw new Error('api');
      var parts = (json.responseData.translatedText || '').split('\n');
      if (parts.length !== batch.length) throw new Error('mismatch');
      batch.forEach(function(item, i) { applyResult(item, (parts[i] || '').trim()); });
      saveFn();
    } catch(e) {
      await Promise.all(batch.map(async function(item) {
        if (cache[item.key] !== undefined) return;
        try {
          var r = await fetch('https://api.mymemory.translated.net/get?q='
            + encodeURIComponent(item.text) + '&langpair=' + src + '|' + langCode);
          if (!r.ok) return;
          var j = await r.json();
          if (j.responseStatus === 200 && j.responseData)
            applyResult(item, (j.responseData.translatedText || '').trim());
        } catch(e2) { cache[item.key] = ''; }
      }));
      saveFn();
    }
  }));
}

// Translates ALL .def-translate-pending spans in a container in one batched request.
// Fills cached entries immediately; sends only uncached texts to the API.
async function _translateDefsInContainer(container) {
  if (LANG === 'en') return;
  var pending = Array.from(container.querySelectorAll('.def-translate-pending'));
  if (!pending.length) return;
  var cs = _defCacheFor(LANG), cache = cs.cache, saveFn = cs.saveFn;
  // Fill already-cached items immediately; collect the rest
  var toFetch = [];
  pending.forEach(function(el) {
    var orig = el.getAttribute('data-def-orig');
    if (!orig) return;
    var dk = normDefKey(orig);
    if (cache[dk]) {
      el.textContent = cache[dk];
      el.classList.remove('def-translate-pending');
    } else if (cache[dk] === undefined) {
      toFetch.push({ el: el, text: orig, key: dk });
    }
    // cache[dk] === '' means a prior fetch failed — keep English
  });
  if (!toFetch.length) return;
  await _batchTranslateDefs(toFetch, LANG, cache, saveFn, function(item, tr) {
    if (item.el.isConnected) {
      item.el.textContent = tr;
      item.el.classList.remove('def-translate-pending');
    }
  });
}

// ── Batch translation fetch: sends multiple words in one request (newline-joined)
// Falls back to parallel individual requests if the response doesn't align.
async function _batchFetchTranslations(words, langCode, cache, saveFn) {
  if (!words.length) return;
  // Pack words into batches that each fit within the 500-char MyMemory limit
  var batches = [], cur = [], curLen = 0;
  words.forEach(function(w) {
    var wl = w.length + 1; // word + \n separator
    if (curLen + wl > 490 && cur.length) { batches.push(cur); cur = []; curLen = 0; }
    cur.push(w); curLen += wl;
  });
  if (cur.length) batches.push(cur);

  await Promise.all(batches.map(async function(batch) {
    try {
      var url = 'https://api.mymemory.translated.net/get?q='
        + encodeURIComponent(batch.join('\n')) + '&langpair=de|' + langCode;
      var resp = await fetch(url);
      if (!resp.ok) throw new Error('http');
      var json = await resp.json();
      if (json.responseStatus !== 200 || !json.responseData) throw new Error('api');
      var parts = (json.responseData.translatedText || '').split('\n');
      if (parts.length !== batch.length) throw new Error('mismatch');
      batch.forEach(function(w, i) {
        var key = normKey(w);
        var t = (parts[i] || '').trim();
        if (t && t.toLowerCase() !== key && !t.startsWith('PLEASE SELECT')) {
          cache[key] = t;
        } else if (cache[key] === undefined) {
          cache[key] = '';
        }
      });
      saveFn();
    } catch(e) {
      // Alignment mismatch or network error — fall back to individual parallel fetches
      await Promise.all(batch.map(async function(w) {
        var key = normKey(w);
        if (cache[key] !== undefined) return;
        try {
          var r = await fetch('https://api.mymemory.translated.net/get?q='
            + encodeURIComponent(w) + '&langpair=de|' + langCode);
          if (!r.ok) return;
          var j = await r.json();
          if (j.responseStatus === 200 && j.responseData) {
            var t = (j.responseData.translatedText || '').trim();
            cache[key] = (t && t.toLowerCase() !== key && !t.startsWith('PLEASE SELECT')) ? t : '';
          }
        } catch(e2) {}
      }));
      saveFn();
    }
  }));
}

function parseWiktPage(htmlStr, word) {
  var dp = new DOMParser();
  var doc = dp.parseFromString(htmlStr, 'text/html');
  var result = { found: false, word: word, ipa: '', sections: [] };

  var pout = doc.querySelector('.mw-parser-output');
  if (!pout) return result;

  // ── Normalize new Wiktionary heading format (changed ~2023) ──
  // Wiktionary now wraps h2/h3/h4 in <div class="mw-heading mw-headingN">.
  // Replace each such div with its bare heading element so the rest of the
  // parser can treat them the same as the old flat format.
  Array.from(pout.querySelectorAll('div.mw-heading')).forEach(function(div) {
    var h = div.querySelector('h2,h3,h4,h5,h6');
    if (h && div.parentNode) {
      var newH = doc.createElement(h.tagName);
      // Copy just the text, stripping any edit-section spans
      newH.textContent = h.textContent.replace(/\[edit\]/gi,'').trim();
      div.parentNode.insertBefore(newH, div);
      div.parentNode.removeChild(div);
    }
  });

  var kids = Array.from(pout.children);

  // Find German h2 section bounds
  var gStart = -1, gEnd = kids.length;
  for (var i = 0; i < kids.length; i++) {
    if (kids[i].tagName === 'H2') {
      var h2txt = kids[i].textContent.replace(/\[.*?\]/g,'').trim();
      if (h2txt === 'German') { gStart = i; }
      else if (gStart >= 0) { gEnd = i; break; }
    }
  }
  if (gStart < 0) return result;

  var gNodes = kids.slice(gStart + 1, gEnd);

  // IPA
  for (var i = 0; i < gNodes.length; i++) {
    var ipaEl = gNodes[i].querySelector ? gNodes[i].querySelector('.IPA, .ipa') : null;
    if (ipaEl) { result.ipa = ipaEl.textContent.trim(); break; }
  }

  // Group content by h3/h4 POS headings.
  // Include inflected-form entries (Wortform, "verb form", etc.) so that
  // past-tense forms like "blieb" that only have a brief Wiktionary entry
  // still render their content rather than falling back to "not found".
  var POS = ['noun','verb','adjective','adverb','article','conjunction','preposition',
             'pronoun','numeral','particle','interjection','determiner',
             'wortform','verb form','noun form','adjective form',
             'participle','suffix','prefix','letter'];
  var posGroups = [], curPOS = null, curBatch = [];
  function flushPOS() {
    if (curPOS && curBatch.length) posGroups.push({ pos: curPOS, nodes: curBatch.slice() });
    curPOS = null; curBatch = [];
  }
  gNodes.forEach(function(el) {
    var tag = el.tagName;
    if (tag === 'H3' || tag === 'H4') {
      var txt = el.textContent.replace(/\[.*?\]/g,'').trim().toLowerCase();
      if (POS.indexOf(txt) >= 0) { flushPOS(); curPOS = txt; }
      else if (curPOS) curBatch.push(el);
    } else if (curPOS) {
      curBatch.push(el);
    }
  });
  flushPOS();

  posGroups.forEach(function(grp) {
    var sec = { pos: grp.pos, headLine: '', defs: [], table: null, tableType: '' };
    grp.nodes.forEach(function(el) {
      var tag = el.tagName;
      // Headword summary line (first <p> with <strong>)
      if (tag === 'P' && !sec.headLine && el.querySelector('strong')) {
        var clone = el.cloneNode(true);
        clone.querySelectorAll('.mw-editsection').forEach(function(x){ x.remove(); });
        var txt = clone.textContent.replace(/\s+/g,' ').trim();
        if (txt.length > 1) sec.headLine = txt;
      }
      // Definitions
      if (tag === 'OL') {
        Array.from(el.querySelectorAll(':scope > li')).slice(0,6).forEach(function(li) {
          var def = { text:'', examples:[] };
          var cl = li.cloneNode(true);
          cl.querySelectorAll('dl,ul,ol,.nyms,.mw-editsection').forEach(function(x){ x.remove(); });
          def.text = cl.textContent.replace(/\s+/g,' ').trim();
          li.querySelectorAll('dl > dd').forEach(function(dd) {
            var ec = dd.cloneNode(true);
            ec.querySelectorAll('.mw-editsection').forEach(function(x){ x.remove(); });
            var ex = ec.textContent.replace(/\s+/g,' ').trim();
            if (ex && ex.length < 400) def.examples.push(ex);
          });
          if (def.text) sec.defs.push(def);
        });
      }
      // Inflection table (direct or inside NavFrame/div/details)
      if (!sec.table) {
        var tbl = null;
        if (tag === 'TABLE') tbl = el;
        else if (tag === 'DIV' || tag === 'DETAILS') tbl = el.querySelector('table');
        if (tbl) sec.table = extractWiktTable(tbl);
      }
    });
    if (sec.table) sec.tableType = grp.pos==='noun'?'decl':grp.pos==='verb'?'conj':'inflex';
    if (sec.headLine || sec.defs.length > 0 || sec.table) result.sections.push(sec);
  });

  result.found = result.sections.length > 0;
  return result;
}

function extractWiktTable(tableEl) {
  var rows = [];
  tableEl.querySelectorAll('tr').forEach(function(tr) {
    var row = [];
    tr.querySelectorAll('th,td').forEach(function(cell) {
      // Clone the cell and strip superscript footnotes (e.g. <sup>1</sup>)
      // before reading textContent — otherwise footnote numbers bleed into form values.
      var cellCl = cell.cloneNode(true);
      cellCl.querySelectorAll('sup').forEach(function(x){ x.remove(); });
      var txt = cellCl.textContent.replace(/\[.*?\]/g,'').replace(/\n/g,' ').replace(/\s+/g,' ').trim();
      if (txt) row.push({
        text: txt,
        isHeader: cell.tagName === 'TH',
        colspan: parseInt(cell.getAttribute('colspan')) || 1,
        rowspan: parseInt(cell.getAttribute('rowspan')) || 1
      });
    });
    if (row.length) rows.push(row);
  });
  // Trim empty/header-only rows from bottom
  while (rows.length && rows[rows.length-1].every(function(c){ return c.isHeader; })) rows.pop();
  return rows;
}

// ══════════════════════════════════════════════════════════════════
//  HEAD-LINE CHIP RENDERER
// Turns Wiktionary's headword summary line into styled, clickable chips.
//
// Two formats are handled:
//   A) Inflected-form entry  — "nominative/accusative plural of Badeanzug"
//      → form-description chips  + a gold clickable chip for the base word
//   B) Full lemma entry      — "Badeanzug m (strong, genitive Badeanzuges or
//                               Badeanzugs, plural Badeanzüge)"
//      → lemma+gender chip  + individual chips for each bracketed attribute,
//        with clickable chips for any word-form values
// ══════════════════════════════════════════════════════════════════
function renderHeadLineChips(text) {
  if (!text) return '';

  // Helper: safe onclick value for openWordCard calls inside HTML attributes
  function cardLink(word) {
    var s = word.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return 'openWordCard(\'' + s + '\',\'?\')';
  }

  var html = '<div class="rw-forms" style="margin-bottom:12px;flex-wrap:wrap;">';

  // ── Pattern A: "... of BaseWord" ──────────────────────────────────────
  // e.g. "nominative/accusative/genitive plural of Badeanzug"
  var ofMatch = text.match(/^(.+?)\s+of\s+([A-ZÄÖÜa-zäöüß][^\s,()]+)\s*$/);
  if (ofMatch) {
    var formDesc = ofMatch[1].trim();  // "nominative/accusative/genitive plural"
    var baseWord = ofMatch[2].trim(); // "Badeanzug"

    // One chip per slash-separated form descriptor
    formDesc.split('/').forEach(function(part) {
      part = part.trim();
      if (!part) return;
      var translated = translateCellDE(part);
      html += '<div class="rw-form" style="cursor:default;">'
        + '<span class="fv" style="color:var(--muted);font-size:.78rem;">'
        + escHtml(translated) + '</span></div>';
    });

    // Non-clickable gold chip for the base word
    html += '<div class="rw-form rw-form--gold" style="cursor:default;">'
      + '<span class="fl" style="font-size:.62rem;">→</span>'
      + '<span class="fv gold">' + escHtml(baseWord) + '</span></div>';

    html += '</div>';
    return html;
  }

  // ── Pattern B: "Lemma gender (attrs…)" ───────────────────────────────
  // e.g. "Badeanzug m (strong, genitive Badeanzuges or Badeanzugs, plural Badeanzüge)"
  // We only show case-form chips (Genitiv, Plural, etc.) — skip the word+gender chip
  // and declension-type chips (stark/schwach/gemischt) which are noise for learners.
  var parenOpen = text.indexOf('(');
  var inParen = parenOpen >= 0 ? text.slice(parenOpen + 1).replace(/\)\s*$/, '').trim() : '';

  var chipHtml = '';
  if (inParen) {
    inParen.split(',').forEach(function(part) {
      part = part.trim();
      if (!part) return;

      // Case/number form chips — keep and make clickable
      var labelMatch = part.match(
        /^(genitive|dative|accusative|nominative|plural|singular)\s+(.+)$/i
      );
      if (labelMatch) {
        var lbl = translateCellDE(labelMatch[1].trim());
        var formsPart = labelMatch[2].trim();
        formsPart.split(/\s+or\s+/i).forEach(function(frm) {
          frm = frm.trim();
          if (!frm) return;
          chipHtml += '<div class="rw-form" style="cursor:default;">'
            + '<span class="fl">' + escHtml(lbl) + '</span>'
            + '<span class="fv blue">' + escHtml(frm) + '</span></div>';
        });
      }
      // Plain declension-type attributes (strong/weak/etc.) — silently skipped
    });
  }

  if (!chipHtml) return ''; // nothing useful to show
  html += chipHtml;
  html += '</div>';
  return html;
}

// ══════════════════════════════════════════════════════════════════
//  WIKTIONARY CARD RENDERER
// ══════════════════════════════════════════════════════════════════
function renderWiktCard(data, meta, targetId) {
  var word = meta.word || data.word;
  var tc   = meta.tc || '?';
  // Use the properly-cased lookup word as the display title (e.g., "nachtisch"
  // from the frequency-list index becomes "Nachtisch" for display)
  var displayWord = wiktLookupWord(word, tc);
  // When data was fetched from the base lemma (inflected form lookup),
  // annotate the card title so the user understands the relationship.
  var baseLemma = data.fromLemma || null;
  // Meaning: selected language first, then English as universal secondary
  // (data is predominantly in English so EN fallback is safe for all languages).
  // We never show Turkish to an English user or vice-versa without reason.
  var _cachedTr = _trMemCache && _trMemCache[normKey(meta.word)] || '';
  var _cachedFa = _faMemCache && _faMemCache[normKey(meta.word)] || '';
  var _cachedRu = _ruMemCache && _ruMemCache[normKey(meta.word)] || '';
  var _cachedUk = _ukMemCache && _ukMemCache[normKey(meta.word)] || '';
  var _cachedAr = _arMemCache && _arMemCache[normKey(meta.word)] || '';
  var meaning = LANG==='fa' ? (meta.fa || _cachedFa || meta.en || '')
              : LANG==='tr' ? (meta.tr || _cachedTr || meta.en || '')
              : LANG==='ru' ? (meta.ru || meta.en || '')
              : LANG==='uk' ? (meta.uk || _cachedUk || meta.en || '')
              : LANG==='ar' ? (meta.ar || _cachedAr || meta.en || '')
              : (meta.en || '');
  var _trPending = LANG === 'tr' && !(meta.tr || _cachedTr);
  var _faPending = LANG === 'fa' && !(meta.fa || _cachedFa);
  var _ruPending = LANG === 'ru' && !meta.ru;
  var _ukPending = false; // uk translations now from CSV, no async fetch needed
  var _arPending = LANG === 'ar' && !(meta.ar || _cachedAr);
  // Still no meaning? Pull the first Wiktionary definition (always English).
  if (!meaning && data.found && data.sections.length) {
    for (var _si = 0; _si < data.sections.length; _si++) {
      if (data.sections[_si].defs && data.sections[_si].defs.length) {
        meaning = data.sections[_si].defs[0].text;
        break;
      }
    }
  }
  // Still no meaning? The word may be an inflected form whose headLine says
  // "… of BaseWord". Look up the base word meaning from our local data.
  if (!meaning && data.found) {
    for (var _si2 = 0; _si2 < data.sections.length && !meaning; _si2++) {
      var _ofM = (data.sections[_si2].headLine || '').match(/\bof\s+([A-ZÄÖÜa-zäöüß][^\s,()]+)/);
      if (_ofM) {
        var _bm = metaFromWord(_ofM[1]);
        meaning = LANG==='tr' ? (_bm.tr || _bm.en || '')
                : LANG==='fa' ? (_bm.fa || _bm.en || '')
                : LANG==='ru' ? (_bm.ru || _bm.en || '')
                : LANG==='uk' ? (_bm.uk || _bm.en || '')
                : LANG==='ar' ? (_bm.ar || _bm.en || '')
                : (_bm.en || '');
      }
    }
  }
  // Last resort: machine translation attached by fetchWiktionary
  var meaningIsAuto = false;
  if (!meaning && data.autoTranslation) {
    meaning = data.autoTranslation;
    meaningIsAuto = true;
  }
  var _csvLevelRow = null;
  ['A1','A2','B1'].forEach(function(lv) {
    if (_csvLevelRow) return;
    var r = (CSV_QUIZ_DATA[lv]||[]).find(function(x){ return normKey(x.word)===normKey(word); });
    if (r) _csvLevelRow = r;
  });
  var level = _csvLevelRow ? (_csvLevelRow.level || '') : '';
  var wb = _csvRowToOfflineWord(_csvLevelRow);

  var html = '<div class="rw-card glass glass-tile glass-highlight glass-chrome">';
  html += '<div class="rw-type">' + (level ? escHtml(level) + ' · ' : '') + tcNameDE(tc) + '</div>';
  html += '<div class="rw-word">' + escHtml(displayWord)
    + (baseLemma ? ' <span style="color:var(--muted);font-size:.52em;font-weight:400;vertical-align:middle;white-space:nowrap">→ ' + escHtml(baseLemma) + '</span>' : '')
    + '</div>';
  if (meaning) {
    var _pendCls = _trPending ? ' tr-meaning-pending' : _faPending ? ' fa-meaning-pending' : _ruPending ? ' ru-meaning-pending' : _ukPending ? ' uk-meaning-pending' : _arPending ? ' ar-meaning-pending' : '';
    html += '<div class="rw-meaning-single' + _pendCls + '">' + escHtml(meaning)
      + (meaningIsAuto
        ? ' <span style="color:var(--muted);font-size:.75em;font-weight:400">· ⓘ ' + escHtml(t('autoTranslated')) + '</span>'
        : '')
      + '</div>';
  }
  if (data.ipa) html += '<div class="wikt-ipa">🔊 ' + escHtml(data.ipa) + '</div>';
  html += '<div class="rw-divider"></div>';

  if (!data.found || !data.sections.length) {
    // Offline fallback
    if (wb) {
      html += renderOfflineWordBody(wb);
      html += '<div class="wikt-offline-note">' + escHtml(t('offlineNote')) + '</div>';
    } else if (!meaning) {
      // No word bank entry and no meaning — inject a pending placeholder so
      // async fetcher (_autoFetchLangMeaning) can fill it,
      // or show an error for English where the sync fetch already ran.
      if (LANG === 'tr') {
        html += '<div class="rw-meaning-single tr-meaning-pending"></div>';
      } else if (LANG === 'fa') {
        html += '<div class="rw-meaning-single fa-meaning-pending"></div>';
      } else if (LANG === 'ru') {
        html += '<div class="rw-meaning-single ru-meaning-pending"></div>';
      } else if (LANG === 'uk') {
        html += '<div class="rw-meaning-single uk-meaning-pending"></div>';
      } else if (LANG === 'ar') {
        html += '<div class="rw-meaning-single ar-meaning-pending"></div>';
      } else {
        html += '<div class="wikt-error"><div class="wikt-error-word">' + escHtml(word) + '</div>'
          + '<span>No detailed information found.</span></div>';
      }
    }
    // When meaning IS set (from autoTranslation, meta.en, etc.) it is already
    // shown in the card header above — no error box needed.
    html += '</div>';
    return html;
  }

  // Meanings are collected separately so they can be appended after Beispiel
  var _meaningsHtml = '';

  data.sections.forEach(function(sec) {
    // POS badge is always in German — this is a German learning card
    html += '<span class="wikt-pos-badge">' + posLabelDE(sec.pos) + '</span>';

    var _isFormSec = /form|wortform|participle/i.test(sec.pos);

    // ── 1. Meanings — collected into _meaningsHtml, rendered at the very bottom ──
    if (sec.defs.length) {
      var _dfc = LANG==='tr'?_defTrCache:LANG==='fa'?_defFaCache:LANG==='ru'?_defRuCache:LANG==='uk'?_defUkCache:LANG==='ar'?_defArCache:null;
      _meaningsHtml += '<div class="rw-section"><div class="rw-section-title">' + escHtml(t('meanings')) + '</div>'
        + '<div class="wikt-def-list">';
      sec.defs.slice(0,5).forEach(function(d, i) {
        var _dk = normDefKey(d.text);
        var _cached = (_dfc && LANG !== 'en') ? _dfc[_dk] : undefined;
        var _isPending = (_dfc && LANG !== 'en' && _cached === undefined);
        // Plain text only — no clickable "of WORD" links in definitions
        var _dHtml = _cached ? escHtml(_cached) : escHtml(d.text);
        _meaningsHtml += '<div class="wikt-def-item">'
          + '<div class="wikt-def-row"><span class="wikt-def-num">' + (i+1) + '.</span>'
          + '<span class="wikt-def-text' + (_isPending ? ' def-translate-pending' : '') + '"'
          + (_isPending ? ' data-def-orig="' + escHtml(d.text) + '"' : '')
          + '>' + _dHtml + '</span></div>';
        if (d.examples.length) {
          _meaningsHtml += '<div class="wikt-example">' + escHtml(d.examples[0]) + '</div>';
        }
        _meaningsHtml += '</div>';
      });
      _meaningsHtml += '</div></div>';
    }

    // ── 2. Grundform — clickable base-word chip for inflected forms ────
    if (_isFormSec && sec.defs.length) {
      var _bwSet = [], _bwSeen = {};
      sec.defs.forEach(function(d) {
        var _bwm = d.text.match(/\bof\s+([A-ZÄÖÜa-zäöüß][A-ZÄÖÜa-zäöüßa-z]+)/i);
        if (_bwm && !_bwSeen[_bwm[1]]) { _bwSeen[_bwm[1]] = true; _bwSet.push(_bwm[1]); }
      });
      if (_bwSet.length) {
        html += '<div class="rw-section" style="margin-bottom:10px;">'
          + '<div class="rw-section-title">Grundform</div>'
          + '<div class="rw-forms">';
        _bwSet.forEach(function(_bwf) {
          html += '<div class="rw-form rw-form--gold" style="cursor:default;">'
            + '<span class="fl" style="font-size:.62rem;">→</span>'
            + '<span class="fv gold">' + escHtml(_bwf) + '</span>'
            + '</div>';
        });
        html += '</div></div>';
      }
    }

    // ── 3. HeadLine chips — only when no table (table already covers the same info).
    //    renderHeadLineChips skips the word+gender chip and type chips (stark/schwach),
    //    keeping only useful case-form chips (Genitiv, Plural etc.).
    if (!_isFormSec && sec.headLine && !(sec.table && sec.table.length)) {
      html += renderHeadLineChips(sec.headLine);
    }

    // ── 4. Declension / conjugation table ─────────────────────────────
    if (sec.table && sec.table.length) {
      var tTitle = sec.tableType==='conj' ? 'Konjugation'
                 : sec.tableType==='decl' ? 'Deklination'
                 : 'Beugung';
      html += '<div class="rw-section"><div class="rw-section-title">' + tTitle + '</div>'
        + renderWiktTable(sec.table) + '</div>';
    }

    html += '<div class="rw-divider" style="margin:10px 0 8px"></div>';
  });

  // ── Example sentence ─────────────────────────────────────────────────
  var _exTxt = null;
  // 1. Try Wiktionary definition examples first
  data.sections.forEach(function(_esec) {
    if (_exTxt) return;
    (_esec.defs || []).forEach(function(_ed) {
      if (!_exTxt && _ed.examples && _ed.examples.length) _exTxt = _ed.examples[0];
    });
  });
  if (_exTxt) {
    html += '<div class="rw-section"><div class="rw-section-title">Beispiel</div>'
      + '<div class="rw-example-box lit">' + escHtml(_exTxt) + '</div></div>';
  }

  // ── Meanings — rendered last so Beispiel and forms appear above ──────
  html += _meaningsHtml;

  html += '<div class="rw-source">' + escHtml(t('wiktSource')) + ': <a href="https://en.wiktionary.org/wiki/' + encodeURIComponent(wiktLookupWord(word,tc)) + '" target="_blank">Wiktionary</a></div>';
  html += '</div>';
  return html;
}

// ── English → German grammatical term translator ─────────────────────────
// Applied to every table cell so all grammatical labels appear in German.
var _DE_FULL = {
  'nominative':'Nominativ','accusative':'Akkusativ','dative':'Dativ','genitive':'Genitiv',
  'singular':'Singular','plural':'Plural',
  'masculine':'Mask.','feminine':'Fem.','neuter':'Neutr.','common':'Utrum',
  'positive':'Positiv','comparative':'Komparativ','superlative':'Superlativ',
  'present':'Präsens','preterite':'Präteritum','past':'Präteritum',
  'perfect':'Perfekt','pluperfect':'Plusquamperfekt',
  'future i':'Futur I','future ii':'Futur II','future':'Futur',
  'indicative':'Indikativ','subjunctive':'Konjunktiv','imperative':'Imperativ',
  'subjunctive i':'Konj. I','subjunctive ii':'Konj. II',
  'active':'Aktiv','passive':'Passiv',
  'strong':'Stark','weak':'Schwach','mixed':'Gemischt',
  'definite':'bestimmt','indefinite':'unbestimmt',
  'inflection':'Beugung','declension':'Deklination','conjugation':'Konjugation',
  // Person labels → German pronouns (so chip detector can recognise them)
  '1st person singular':'ich','2nd person singular':'du',
  '3rd person singular':'er/sie/es','1st person plural':'wir',
  '2nd person plural':'ihr','3rd person plural':'sie/Sie',
  '1st pers. sg.':'ich','2nd pers. sg.':'du','3rd pers. sg.':'er/sie/es',
  '1st pers. pl.':'wir','2nd pers. pl.':'ihr','3rd pers. pl.':'sie/Sie',
};
function translateCellDE(txt) {
  if (!txt) return txt;
  var lo = txt.trim().toLowerCase();
  if (_DE_FULL[lo]) return _DE_FULL[lo];
  // Multi-word phrase: translate each word individually via _DE_FULL
  if (lo.includes(' ')) {
    return lo.split(/\s+/).map(function(p) {
      return _DE_FULL[p] ? _DE_FULL[p] : (p.charAt(0).toUpperCase() + p.slice(1));
    }).join(' ');
  }
  return txt
    .replace(/\bNominative\b/g,'Nominativ').replace(/\bAccusative\b/g,'Akkusativ')
    .replace(/\bDative\b/g,'Dativ').replace(/\bGenitive\b/g,'Genitiv')
    .replace(/\bMasculine\b/g,'Mask.').replace(/\bFeminine\b/g,'Fem.')
    .replace(/\bNeuter\b/g,'Neutr.').replace(/\bSingular\b/g,'Singular')
    .replace(/\bPlural\b/g,'Plural').replace(/\bPositive\b/g,'Positiv')
    .replace(/\bComparative\b/g,'Komparativ').replace(/\bSuperlative\b/g,'Superlativ')
    .replace(/\bIndicative\b/g,'Indikativ').replace(/\bSubjunctive I\b/g,'Konj. I')
    .replace(/\bSubjunctive II\b/g,'Konj. II').replace(/\bSubjunctive\b/g,'Konjunktiv')
    .replace(/\bImperative\b/g,'Imperativ').replace(/\bPresent\b/g,'Präsens')
    .replace(/\bPreterite\b/g,'Präteritum').replace(/\bPerfect\b/g,'Perfekt')
    .replace(/\bActive\b/g,'Aktiv').replace(/\bPassive\b/g,'Passiv')
    .replace(/\bStrong\b/g,'Stark').replace(/\bWeak\b/g,'Schwach')
    .replace(/\b1st person\b/g,'1. P.').replace(/\b2nd person\b/g,'2. P.')
    .replace(/\b3rd person\b/g,'3. P.');
}

// ── Smart table renderer ────────────────────────────────────────────────────
// 1. Translates all cell text to German.
// 2. Tries to convert standard noun / verb / adjective tables into chips.
// 3. Falls back to a compact scrollable table for anything else.
function renderWiktTable(rows) {
  if (!rows || !rows.length) return '';

  // Step 1: translate every cell
  var trows = rows.map(function(row) {
    return row.map(function(c) {
      return { text: translateCellDE(c.text), isHeader: c.isHeader,
               colspan: c.colspan, rowspan: c.rowspan };
    });
  });

  // Step 2: try chip display
  var chips = _tryChips(trows);
  if (chips) return chips;

  // Step 3: compact scrollable table fallback
  var h = '<div class="wikt-table-wrap"><table class="wikt-table">';
  trows.forEach(function(row) {
    h += '<tr>';
    row.forEach(function(cell) {
      var tag = cell.isHeader ? 'th' : 'td';
      var cs = (cell.colspan>1?' colspan="'+cell.colspan+'"':'');
      var rs = (cell.rowspan>1?' rowspan="'+cell.rowspan+'"':'');
      h += '<'+tag+cs+rs+'>' + escHtml(cell.text) + '</'+tag+'>';
    });
    h += '</tr>';
  });
  h += '</table></div>';
  return h;
}

// Attempt to render a translated table as chip groups.
// Returns HTML string on success, null when the table is too irregular.
function _tryChips(trows) {
  // ── Noun declension: rows whose first-cell matches a German case name ──
  var caseRx = /^(Nominativ|Akkusativ|Dativ|Genitiv)$/i;
  var caseRows = trows.filter(function(r) {
    return r.length >= 2 && caseRx.test(r[0].text);
  });
  if (caseRows.length >= 2) {
    // Column headers: scan *backward* from the first case row to find the best
    // all-header row. Prefer rows that explicitly contain "Singular"/"Plural"
    // (or other column-label keywords) over rows whose cells are German word
    // forms (which Wiktionary sometimes uses as sub-headers).
    var colHdrs = [];
    var firstCaseIdx = trows.indexOf(caseRows[0]);
    var _fallbackHdrs = null;
    for (var _hi = firstCaseIdx - 1; _hi >= 0; _hi--) {
      var _hr = trows[_hi];
      if (_hr.every(function(c){ return c.isHeader; }) && _hr.length > 1) {
        var _cand = _hr.slice(1).map(function(c){ return c.text; });
        // Prefer rows that contain recognised column-label words
        if (_cand.some(function(t){ return /^(Singular|Plural|mask\.|Mask\.|fem\.|Fem\.|neutr\.|Neutr\.|utrum)/i.test(t); })) {
          colHdrs = _cand;
          break;
        }
        if (!_fallbackHdrs) _fallbackHdrs = _cand; // keep first fallback found
      }
    }
    if (!colHdrs.length) {
      if (_fallbackHdrs) {
        colHdrs = _fallbackHdrs;
      } else {
        // Infer from the data row width
        var _w = caseRows[0].length - 1;
        colHdrs = _w >= 2 ? ['Singular','Plural'] : ['Form'];
      }
    }
    // ── Safety: pad colHdrs so every data column has a label ──────────────
    // This ensures the Plural column always renders even when the backward
    // scan only found a 1-entry header row (e.g. a word-form sub-header row).
    var _dataW = Math.max.apply(null, caseRows.map(function(r){ return r.length - 1; }));
    while (colHdrs.length < _dataW) {
      colHdrs.push(colHdrs.length === 0 ? 'Singular' : colHdrs.length === 1 ? 'Plural' : '');
    }
    var caseColor = {Nominativ:'gold',Akkusativ:'blue',Dativ:'green',Genitiv:''};
    var caseAbbr  = {Nominativ:'Nom.',Akkusativ:'Akk.',Dativ:'Dat.',Genitiv:'Gen.'};
    var html = '';
    var numCols = Math.max(colHdrs.length, 1);
    for (var ci = 0; ci < numCols && ci < 3; ci++) {
      var colName = colHdrs[ci] || '';
      if (colName) html += '<div class="rw-section"><div class="rw-section-title">' + escHtml(colName) + '</div>';
      html += '<div class="rw-forms">';
      caseRows.forEach(function(row) {
        var cn = row[0].text;
        var cell = row[ci + 1];
        var val = cell ? cell.text : '';
        if (!val || val === '—' || val === '-' || val === '–') return;
        var cls = caseColor[cn] || '';
        var abbr = caseAbbr[cn] || cn;
        // Split cells that contain multiple forms (e.g. "Badeanzug, Badeanzuge" or
        // "des Badeanzuges / des Badeanzugs") into individual chips — one per form.
        var formParts = val.split(/,\s+|\s+\/\s+/).map(function(f){ return f.trim(); }).filter(Boolean);
        formParts.forEach(function(formVal) {
          if (!formVal || formVal === '—' || formVal === '-' || formVal === '–') return;
          html += '<div class="rw-form">'
            + '<span class="fl">' + escHtml(abbr) + '</span>'
            + '<span class="fv' + (cls?' '+cls:'') + '">' + escHtml(formVal) + '</span>'
            + '</div>';
        });
      });
      html += '</div>';
      if (colName) html += '</div>';
    }
    return html || null;
  }

  // ── Verb conjugation: rows whose first-cell is a German pronoun ──
  var pronounRx = /^(ich|du|er\/sie\/es|wir|ihr|sie\/Sie)$/i;
  var pronounRows = trows.filter(function(r) {
    return r.length >= 2 && pronounRx.test(r[0].text);
  });
  if (pronounRows.length >= 3) {
    var colHdrs2 = [];
    var firstPronounIdx = trows.indexOf(pronounRows[0]);
    for (var _hi2 = firstPronounIdx - 1; _hi2 >= 0; _hi2--) {
      var _hr2 = trows[_hi2];
      if (_hr2.every(function(c){ return c.isHeader; }) && _hr2.length > 1) {
        colHdrs2 = _hr2.slice(1).map(function(c){ return c.text; });
        break;
      }
    }
    if (!colHdrs2.length && pronounRows[0].length > 2) {
      colHdrs2 = ['Präsens','Präteritum'].slice(0, pronounRows[0].length - 1);
    }
    var pColor = {ich:'gold',du:'blue','er/sie/es':'green'};
    var html = '';
    var numCols2 = Math.max(colHdrs2.length, 1);
    for (var ci2 = 0; ci2 < numCols2 && ci2 < 3; ci2++) {
      var colName2 = colHdrs2[ci2] || '';
      if (colName2) html += '<div class="rw-section"><div class="rw-section-title">' + escHtml(colName2) + '</div>';
      html += '<div class="rw-forms">';
      pronounRows.forEach(function(row) {
        var pr = row[0].text;
        var cell2 = row[ci2 + 1];
        var val2 = cell2 ? cell2.text : '';
        if (!val2) return;
        var cls2 = pColor[pr.toLowerCase()] || '';
        html += '<div class="rw-form">'
          + '<span class="fl">' + escHtml(pr) + '</span>'
          + '<span class="fv' + (cls2?' '+cls2:'') + '">' + escHtml(val2) + '</span>'
          + '</div>';
      });
      html += '</div>';
      if (colName2) html += '</div>';
    }
    return html || null;
  }

  // ── Adjective degree: row containing Positiv / Komparativ / Superlativ ──
  var adjRx = /^(Positiv|Komparativ|Superlativ)$/i;
  var adjRows = trows.filter(function(r) {
    return r.some(function(c){ return adjRx.test(c.text); });
  });
  if (adjRows.length >= 1) {
    var html = '<div class="rw-forms">';
    var adjColor = {Positiv:'',Komparativ:'gold',Superlativ:'blue'};
    adjRows.forEach(function(row) {
      var hdr = row.find(function(c){ return c.isHeader && adjRx.test(c.text); });
      var val = row.find(function(c){ return !c.isHeader; });
      if (hdr && val) {
        var cls = adjColor[hdr.text] || '';
        html += '<div class="rw-form">'
          + '<span class="fl">' + escHtml(hdr.text) + '</span>'
          + '<span class="fv' + (cls?' '+cls:'') + '">' + escHtml(val.text) + '</span>'
          + '</div>';
      }
    });
    html += '</div>';
    return html;
  }

  return null; // give up — use the compact table fallback
}

// Build offline word-bank payload from embedded vocabulary row (design / offline).
function _csvRowToOfflineWord(row) {
  if (!row || !row.word) return null;
  var wb = {
    word: row.word,
    type: row.word_type || 'Word',
    level: row.level || '',
    example: row.example_de || '',
    source: 'Vocabulary'
  };
  if (row.plural) wb.plural = row.plural;
  return wb;
}

// Offline card body (cases/conjugation chips) — fallback when Wiktionary fails
function renderOfflineWordBody(w) {
  var u = UI[LANG];
  var html = '';
  var hint = t('rwTapFormHint');
  function chip(label, value, cls, key) {
    var enc = encodeURIComponent(key);
    return '<div class="rw-form" onclick="pickFormExample(this,decodeURIComponent(\''+enc+'\'))">'+'<span class="fl">'+label+'</span><span class="fv'+(cls?' '+cls:'')+'">'+value+'</span></div>';
  }
  rwWordKey = w.word;
  var hasGrammar = false;
  if (w.type==='Noun' && w.cases && Object.keys(w.cases).length) {
    hasGrammar = true;
    html += '<div class="rw-section"><div class="rw-section-title-row"><span>'+u.cases+'</span><span class="rw-click-hint">'+hint+'</span></div><div class="rw-forms">';
    var cc={Nominativ:'gold',Akkusativ:'blue',Dativ:'green',Genitiv:''};
    Object.entries(w.cases).forEach(function(kv){ if(kv[1]) html+=chip(kv[0],kv[1],cc[kv[0]]||'',kv[0]); });
    html += '</div></div>';
    if (w.plural) html += '<div class="rw-section"><div class="rw-section-title">'+u.plural+'</div><div class="rw-forms">'+chip(u.plural,w.plural,'','Plural')+'</div></div>';
  }
  if (w.type==='Verb' && w.conjugation && Object.keys(w.conjugation).length) {
    hasGrammar = true;
    html += '<div class="rw-section"><div class="rw-section-title-row"><span>'+u.presentTense+'</span><span class="rw-click-hint">'+hint+'</span></div><div class="rw-forms">';
    var pc={ich:'gold',du:'blue','er/sie/es':'green'};
    Object.entries(w.conjugation).forEach(function(kv){ html+=chip(kv[0],kv[1],pc[kv[0]]||'',kv[0]); });
    html += '</div></div>';
    var pt = w['präteritum'];
    if (pt && Object.keys(pt).length) {
      html += '<div class="rw-section"><div class="rw-section-title-row"><span>'+u.pastSimple+'</span><span class="rw-click-hint">'+hint+'</span></div><div class="rw-forms">';
      Object.entries(pt).forEach(function(kv){ html+=chip(kv[0],kv[1],'',kv[1]); });
      html += '</div></div>';
    }
    if (w.perfekt) html += '<div class="rw-section"><div class="rw-section-title">'+u.perfekt+'</div><div class="rw-forms">'+chip(u.perfekt,w.perfekt,'blue','perfekt')+'</div></div>';
  }
  if (w.type==='Adjective' && w.comparative) {
    hasGrammar = true;
    html += '<div class="rw-section"><div class="rw-section-title-row"><span>'+u.comparatives+'</span><span class="rw-click-hint">'+hint+'</span></div><div class="rw-forms">'+chip('Komparativ',w.comparative,'gold','Komparativ')+chip('Superlativ',w.superlative,'blue','Superlativ')+'</div></div>';
    if (w.endingNote) html += '<div class="rw-section"><div class="rw-section-title">'+u.adjEndings+'</div><div class="rw-example">'+w.endingNote+'</div></div>';
  }
  var tapMsg = t('tapPrompt');
  html += '<div class="rw-divider" style="margin-top:6px"></div>';
  if (!hasGrammar && w.example) {
    html += '<div class="rw-section"><div class="rw-section-title">'+u.examples+'</div><div class="rw-example-box lit">'+w.example+'</div></div>';
  } else {
    html += '<div class="rw-section"><div class="rw-section-title">'+u.examples+'</div><div class="rw-example-box" id="rw-ex-box">'+(hasGrammar ? tapMsg : (w.example||t('noExample')))+'</div></div>';
  }
  html += '<div class="rw-source">'+(w.source?w.source:UI[LANG].source)+' · '+w.level+'</div>';
  return html;
}


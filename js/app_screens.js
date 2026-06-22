// ── Screen switcher & tab navigation ──
var TAB_ORDER = ['learn', 'practice', 'stats', 'settings'];
var TAB_PAGE_GAP = 12;
var _activeTab = 'learn';
var _tabIndex = 0;
var _tabDragIndex = null;
var _tabCarouselReady = false;
var _practiceTabReady = false;
var _statsTabReady = false;
var _tabScrollTops = { learn: {}, practice: {}, stats: {}, settings: {} };
var _tabRoots = { learn: 'learn-root', practice: 'practice-root', stats: 'stats-root', settings: 'settings-root' };
var _tabStacks = { learn: ['learn-root'], practice: ['practice-root'], stats: ['stats-root'], settings: ['settings-root'] };
var _sharedPageIds = ['screen-quiz', 'screen-results', 'screen-rush-summary'];
var _flowPageIds = ['screen-adaptive-setup','screen-theme-select','screen-swipe-setup','screen-swipe','screen-random','screen-dictionary','screen-practice'].concat(_sharedPageIds);
var _stackAnimating = false;

/* Swap stack transition classes here — chrome + body animate together on .tab-page */
var STACK_TRANSITION = {
  forward: { exit: 'is-stack-exit', enter: 'is-stack-enter' },
  back:    { exit: 'is-stack-exit-back', enter: 'is-stack-enter-back' }
};
window.STACK_TRANSITION = STACK_TRANSITION;

function _pageElId(pageId) {
  if (pageId === 'learn-root') return 'tab-page-learn-root';
  if (pageId === 'practice-root') return 'tab-page-practice-root';
  if (pageId === 'stats-root') return 'tab-page-stats-root';
  if (pageId === 'settings-root') return 'tab-page-settings-root';
  return pageId;
}
function _getPageEl(pageId) {
  return document.getElementById(_pageElId(pageId));
}
function _getTabStackEl(tab) {
  return document.getElementById('tab-stack-' + tab);
}
function _getSharedDepot() {
  return document.getElementById('tab-shared-depot');
}
function _getStackTop(tab) {
  var stack = _tabStacks[tab];
  return stack.length ? stack[stack.length - 1] : _tabRoots[tab];
}
function _pageOwnerTab(pageId) {
  if (pageId === 'learn-root') return 'learn';
  if (pageId === 'practice-root') return 'practice';
  if (pageId === 'stats-root') return 'stats';
  if (pageId === 'settings-root') return 'settings';
  var el = _getPageEl(pageId);
  if (!el) return null;
  var stack = el.closest('.tab-stack');
  if (!stack || !stack.id) return null;
  if (stack.id === 'tab-stack-learn') return 'learn';
  if (stack.id === 'tab-stack-practice') return 'practice';
  if (stack.id === 'tab-stack-stats') return 'stats';
  if (stack.id === 'tab-stack-settings') return 'settings';
  return null;
}
function _isSharedPage(pageId) {
  return _sharedPageIds.indexOf(pageId) >= 0;
}
function _mountPageInStack(pageId, tab) {
  var el = _getPageEl(pageId);
  var stackEl = _getTabStackEl(tab);
  if (!el || !stackEl) return;
  if (el.parentElement !== stackEl) stackEl.appendChild(el);
}
function _returnSharedPageToDepot(pageId) {
  if (!_isSharedPage(pageId)) return;
  var el = _getPageEl(pageId);
  var depot = _getSharedDepot();
  if (el && depot && el.parentElement !== depot) depot.appendChild(el);
}
function _returnSharedPagesFromTabStack(tab) {
  _sharedPageIds.forEach(function(pid) {
    var el = _getPageEl(pid);
    if (el && el.parentElement && el.parentElement.id === 'tab-stack-' + tab) {
      _returnSharedPageToDepot(pid);
    }
  });
}
function _clearStackAnimClasses(el) {
  if (!el) return;
  el.classList.remove('is-stack-enter', 'is-stack-exit', 'is-stack-enter-back', 'is-stack-exit-back');
}
function _scrubStackPageInline(el) {
  if (!el) return;
  ['transform', 'min-height', 'height', 'width', 'left', 'top', 'visibility', 'overflow', 'pointer-events', 'position'].forEach(function(prop) {
    el.style.removeProperty(prop);
  });
}
function _stackDurMs() {
  return _tabReducedMotion() ? 0 : 520;
}
function _measurePageScrollHeight(pageId) {
  var el = _getPageEl(pageId);
  if (!el) return 0;
  if (el.classList.contains('is-stack-top') && el.offsetHeight > 0) return el.scrollHeight;
  var stackEl = el.closest('.tab-stack');
  var panel = el.closest('.tab-panel');
  var measureW = panel && panel.getBoundingClientRect().width > 0 ? panel.getBoundingClientRect().width : 0;
  if (measureW <= 0) {
    var stage = typeof _getTabStage === 'function' ? _getTabStage() : null;
    measureW = stage ? stage.clientWidth : 0;
  }
  var saved = {
    position: el.style.position,
    visibility: el.style.visibility,
    height: el.style.height,
    overflow: el.style.overflow,
    pointerEvents: el.style.pointerEvents,
    left: el.style.left,
    top: el.style.top,
    width: el.style.width,
    hadTop: el.classList.contains('is-stack-top')
  };
  if (stackEl) stackEl.classList.add('is-stack-measuring');
  el.classList.add('is-stack-top');
  el.style.position = 'relative';
  el.style.visibility = 'hidden';
  el.style.height = 'auto';
  el.style.overflow = 'visible';
  el.style.pointerEvents = 'none';
  el.style.left = '0';
  el.style.top = '0';
  el.style.width = measureW > 0 ? measureW + 'px' : '100%';
  var h = el.scrollHeight;
  el.classList.toggle('is-stack-top', saved.hadTop);
  el.style.position = saved.position;
  el.style.visibility = saved.visibility;
  el.style.height = saved.height;
  el.style.overflow = saved.overflow;
  el.style.pointerEvents = saved.pointerEvents;
  el.style.left = saved.left;
  el.style.top = saved.top;
  el.style.width = saved.width;
  if (stackEl) stackEl.classList.remove('is-stack-measuring');
  return h;
}
function _afterLayout(fn) {
  requestAnimationFrame(function() { requestAnimationFrame(fn); });
}
function _syncTabStackVisibility(tab) {
  var stackEl = _getTabStackEl(tab);
  if (!stackEl) return;
  var topId = _getStackTop(tab);
  stackEl.querySelectorAll('.tab-page').forEach(function(page) {
    var pid = page.getAttribute('data-page-id') || page.id;
    var isTop = pid === topId || page.id === topId || _pageElId(topId) === page.id;
    page.classList.toggle('is-stack-top', isTop);
    if (isTop) page.style.removeProperty('visibility');
  });
}
function _syncAllTabStacks() {
  TAB_ORDER.forEach(function(t) { _syncTabStackVisibility(t); });
}
function _stackContentHeight(tab) {
  return _measurePageScrollHeight(_getStackTop(tab));
}
function _setTabViewportHeight(h) {
  var viewport = _getTabViewport();
  if (!viewport) return;
  viewport.style.removeProperty('height');
}
function _viewportBounds() {
  var vv = window.visualViewport;
  if (vv) return { top: vv.offsetTop, bottom: vv.offsetTop + vv.height };
  return { top: 0, bottom: window.innerHeight };
}
function _pageHeightPx(el, pageId) {
  if (!el) return 0;
  if (el.offsetHeight > 0) return el.offsetHeight;
  if (pageId) return _measurePageScrollHeight(pageId);
  return el.scrollHeight || 0;
}
function _travelDownPx(stackEl, el, pageId) {
  var sr = stackEl.getBoundingClientRect();
  var v = _viewportBounds();
  return Math.max(1, Math.ceil(v.bottom - sr.top + 2));
}
function _travelUpPx(stackEl, el, pageId) {
  var sr = stackEl.getBoundingClientRect();
  var v = _viewportBounds();
  var h = _pageHeightPx(el, pageId);
  return Math.max(1, Math.ceil((sr.top + h) - v.top + 2));
}
function _stackTravelForTransition(stackEl, fromEl, fromId, toEl, toId, mode) {
  if (mode === 'down') return _travelDownPx(stackEl, fromEl, fromId);
  return Math.max(_travelUpPx(stackEl, fromEl, fromId), _travelUpPx(stackEl, toEl, toId));
}
function _pageFrameHeight(el, pageId) {
  if (el && el.offsetHeight > 0) return el.offsetHeight;
  if (pageId) return _measurePageScrollHeight(pageId);
  return el ? el.scrollHeight : 0;
}
function _clearStackAnimState(stackEl) {
  if (!stackEl) return;
  stackEl.classList.remove('is-stack-animating');
  stackEl.style.removeProperty('min-height');
  stackEl.style.removeProperty('--stack-travel');
}
function _stackTransition(tab, fromId, toId, direction, done) {
  var stackEl = _getTabStackEl(tab);
  var fromEl = _getPageEl(fromId);
  var toEl = _getPageEl(toId);
  var tKey = direction === 'forward' ? 'forward' : 'back';
  var exitCls = STACK_TRANSITION[tKey].exit;
  var enterCls = STACK_TRANSITION[tKey].enter;
  var travelMode = direction === 'forward' ? 'down' : 'up';
  if (!stackEl || !fromEl || !toEl || _tabReducedMotion()) {
    _clearStackAnimState(stackEl);
    _scrubStackPageInline(fromEl);
    _scrubStackPageInline(toEl);
    _syncTabStackVisibility(tab);
    if (done) done();
    return;
  }
  if (typeof _syncPageChrome === 'function') _syncPageChrome(toId);
  var fromH = _pageFrameHeight(fromEl, fromId);
  var toH = _pageFrameHeight(toEl, toId);
  var travelPx = _stackTravelForTransition(stackEl, fromEl, fromId, toEl, toId, travelMode);
  var frameH = Math.max(fromH, toH, 120);
  stackEl.classList.add('is-stack-animating');
  stackEl.style.setProperty('--stack-travel', travelPx + 'px');
  stackEl.style.minHeight = frameH + 'px';
  _clearStackAnimClasses(fromEl);
  _clearStackAnimClasses(toEl);
  _scrubStackPageInline(fromEl);
  _scrubStackPageInline(toEl);
  fromEl.classList.add(exitCls);
  toEl.classList.add(enterCls);
  fromEl.classList.remove('is-stack-top');
  toEl.classList.add('is-stack-top');
  var finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    fromEl.removeEventListener('animationend', onAnimEnd);
    toEl.removeEventListener('animationend', onAnimEnd);
    _clearStackAnimClasses(fromEl);
    _clearStackAnimClasses(toEl);
    _clearStackAnimState(stackEl);
    _syncTabStackVisibility(tab);
    _scrubStackPageInline(fromEl);
    _scrubStackPageInline(toEl);
    if (done) done();
  }
  var ended = 0;
  function onAnimEnd(e) {
    if (e.target !== fromEl && e.target !== toEl) return;
    ended++;
    if (ended >= 2) finish();
  }
  fromEl.addEventListener('animationend', onAnimEnd);
  toEl.addEventListener('animationend', onAnimEnd);
  setTimeout(finish, _stackDurMs() + 80);
}
function _animateStackNav(tab, fromId, toId, direction, done) {
  _stackAnimating = true;
  _afterLayout(function() {
    _stackTransition(tab, fromId, toId, direction, function() {
      _stackAnimating = false;
      var top = _getStackTop(tab);
      _syncAppChrome(top === _tabRoots[tab] ? null : top);
      if (done) done();
    });
  });
}
function pushTabPage(pageId, opts) {
  opts = opts || {};
  var tab = opts.tab || _pageOwnerTab(pageId) || _activeTab;
  if (!_tabStacks[tab]) return;
  var stack = _tabStacks[tab];
  if (stack[stack.length - 1] === pageId) {
    _syncAppChrome();
    return;
  }
  if (_isSharedPage(pageId)) _mountPageInStack(pageId, tab);
  else if (!_pageOwnerTab(pageId)) _mountPageInStack(pageId, tab);
  var fromId = stack[stack.length - 1];
  var animate = opts.animate !== false && !_tabReducedMotion() && !_stackAnimating;
  stack.push(pageId);
  if (animate) {
    _animateStackNav(tab, fromId, pageId, 'forward');
  } else {
    _syncTabStackVisibility(tab);
    _syncAppChrome(pageId);
  }
}
function popTabPage(opts) {
  opts = opts || {};
  var tab = opts.tab || _activeTab;
  var stack = _tabStacks[tab];
  if (!stack || stack.length <= 1 || _stackAnimating) {
    if (opts.onComplete) opts.onComplete(false);
    return false;
  }
  var fromId = stack[stack.length - 1];
  var toId = stack[stack.length - 2];
  var animate = opts.animate !== false && !_tabReducedMotion();
  stack.pop();
  var deferDepot = animate && _isSharedPage(fromId);
  if (!deferDepot && _isSharedPage(fromId)) _returnSharedPageToDepot(fromId);
  if (animate) {
    _animateStackNav(tab, fromId, toId, 'back', function() {
      if (deferDepot) _returnSharedPageToDepot(fromId);
      if (opts.onComplete) opts.onComplete(true);
    });
  } else {
    if (_isSharedPage(fromId)) _returnSharedPageToDepot(fromId);
    _syncTabStackVisibility(tab);
    _syncAppChrome();
    if (opts.onComplete) opts.onComplete(true);
  }
  return true;
}
function _popStackToPage(tab, targetPageId, opts) {
  opts = opts || {};
  if (!targetPageId || targetPageId === 'screen-levels') targetPageId = _tabRoots[tab];
  return new Promise(function(resolve) {
    function step() {
      if (_getStackTop(tab) === targetPageId) {
        var top = _getStackTop(tab);
        _syncAppChrome(top === _tabRoots[tab] ? null : top);
        resolve(true);
        return;
      }
      if (!_tabStacks[tab] || _tabStacks[tab].length <= 1) {
        resolve(_getStackTop(tab) === targetPageId);
        return;
      }
      if (_stackAnimating) {
        setTimeout(step, 40);
        return;
      }
      if (!popTabPage({
        animate: opts.animate !== false,
        tab: tab,
        onComplete: function(ok) {
          if (!ok) resolve(false);
          else step();
        }
      })) resolve(false);
    }
    step();
  });
}
function _popStackToRoot(tab, opts) {
  opts = opts || {};
  tab = tab || _activeTab;
  var root = _tabRoots[tab];
  if (_getStackTop(tab) === root) return Promise.resolve(true);
  var top = _getStackTop(tab);
  return _confirmPageLeave(top).then(function(ok) {
    if (!ok) return false;
    if (top === 'screen-quiz') _abortQuizSession();
    return _popStackToPage(tab, root, opts);
  });
}
window.popStackToPage = _popStackToPage;
window.popStackToRoot = _popStackToRoot;
function _resetTabStack(tab) {
  if (!_tabStacks[tab]) return;
  _returnSharedPagesFromTabStack(tab);
  _tabStacks[tab] = [_tabRoots[tab]];
  _syncTabStackVisibility(tab);
  _syncTabViewportHeight();
}
function _activeFlowPageId() {
  var top = _getStackTop(_activeTab);
  return top === _tabRoots[_activeTab] ? null : top;
}
function _ensureFlowPageChrome() {
  var isRtl = document.body.classList.contains('lang-rtl');
  document.querySelectorAll('.tab-flow-page').forEach(function(page) {
    if (page.querySelector(':scope > .tab-page-chrome')) return;
    var body = document.createElement('div');
    body.className = 'tab-page-body';
    while (page.firstChild) body.appendChild(page.firstChild);
    var chrome = document.createElement('div');
    chrome.className = 'tab-page-chrome';
    chrome.innerHTML = '<div class="tab-page-chrome-main">' +
      '<button class="app-back-btn page-back-btn glass glass-chrome glass-interactive" type="button" aria-label="Back"></button>' +
      '<div class="tab-page-title-wrap">' +
      '<div class="tab-page-title hidden"></div>' +
      '<div class="tab-page-subtitle hidden"></div>' +
      '</div></div>' +
      '<div class="tab-page-actions hidden"></div>';
    page.appendChild(chrome);
    page.appendChild(body);
    var pageId = page.id;
    var btn = chrome.querySelector('.page-back-btn');
    if (btn) {
      btn.innerHTML = _backArrowSvg(isRtl);
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var act = _getPageBackAction(pageId);
        if (act) act();
      });
    }
  });
}
function _getPageBackAction(pageId) {
  var backMap = {
    'screen-quiz': function(){ goQuizBack(); },
    'screen-results': null,
    'screen-rush-summary': function(){ goHome(); },
    'screen-swipe-setup': function(){ popTabPage(); },
    'screen-swipe': function(){ popTabPage(); },
    'screen-adaptive-setup': function(){ popTabPage(); },
    'screen-theme-select': function(){ popTabPage(); },
    'screen-random': function(){ popTabPage(); },
    'screen-dictionary': function(){ popTabPage(); },
    'screen-practice': function(){ popTabPage(); }
  };
  return pageId ? backMap[pageId] : null;
}
function _syncAppChrome(pageId) {
  var header = document.getElementById('app-header');
  if (pageId === undefined) pageId = _activeFlowPageId();
  if (header) header.classList.remove('header-subscreen');
  if (pageId) {
    _syncPageChrome(pageId);
    _appBackAction = _getPageBackAction(pageId) || function(){};
  } else {
    _resetSubscreenHeaders();
    _appBackAction = function(){};
  }
  _updateTabBarVisibility();
}
function show(id) {
  if (id === 'screen-learning-profile') {
    switchTab('stats');
    _resetTabStack('stats');
    _syncAppChrome();
    return;
  }
  if (id === 'screen-practice-setup') {
    switchTab('practice');
    _resetTabStack('practice');
    _syncAppChrome();
    return;
  }
  if (id === 'screen-levels') {
    _resetTabStack(_activeTab);
    _syncAppChrome();
    return;
  }
  var quizWasVisible = _screenIsVisible('screen-quiz');
  var tab = _pageOwnerTab(id) || _activeTab;
  if (tab !== _activeTab && TAB_ORDER.indexOf(tab) >= 0) switchTab(tab);
  var instant = { 'screen-results': 1, 'screen-rush-summary': 1 };
  pushTabPage(id, { animate: !instant[id], tab: tab });
  if (quizWasVisible && id !== 'screen-quiz' && id !== 'screen-results' && id !== 'screen-rush-summary') {
    _quizTimerAbandon();
  }
}
window.pushTabPage = pushTabPage;
window.popTabPage = popTabPage;
function _tabIsRtl() {
  return document.body.classList.contains('lang-rtl');
}
function _tabReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function _tabGesturesBlocked() {
  if (document.querySelector('.modal-root.open')) return true;
  if (_stackAnimating) return true;
  return false;
}
function _getTabStage() {
  return document.querySelector('#screen-levels .tab-stage');
}
function _getTabViewport() {
  return document.getElementById('tab-viewport');
}
function _getTabTrack() {
  return document.getElementById('tab-track');
}
function _tabStridePx() {
  var stage = _getTabStage();
  if (!stage) return 1;
  return stage.clientWidth + TAB_PAGE_GAP;
}
function _syncTabViewportHeight(show) {
  _setTabViewportHeight(0);
}
function _tabTrackOffsetPx(index) {
  var stride = _tabStridePx();
  return (_tabIsRtl() ? 1 : -1) * index * stride;
}
function _saveTabScroll() {
  var pageId = _getStackTop(_activeTab);
  if (!_tabScrollTops[_activeTab]) _tabScrollTops[_activeTab] = {};
  _tabScrollTops[_activeTab][pageId] = window.scrollY || document.documentElement.scrollTop || 0;
}
function _restoreTabScroll(tab) {
  var pageId = _getStackTop(tab);
  var y = (_tabScrollTops[tab] && _tabScrollTops[tab][pageId]) || 0;
  requestAnimationFrame(function() { window.scrollTo(0, y); });
}
function _applyTabTrackTransform(index, animate) {
  var track = _getTabTrack();
  if (!track) return;
  var dragging = _tabDragIndex !== null;
  var shouldAnimate = !!animate && _tabCarouselReady && !_tabReducedMotion() && !dragging;
  track.classList.toggle('is-dragging', dragging);
  if (!shouldAnimate) track.style.transition = 'none';
  else track.style.removeProperty('transition');
  track.style.transform = 'translateX(' + _tabTrackOffsetPx(index) + 'px)';
  if (!shouldAnimate) void track.offsetHeight;
}
function _syncTabGoldOverlayLabels() {
  TAB_ORDER.forEach(function(t) {
    var src = document.getElementById('bottom-tab-' + t);
    var dst = document.querySelector('#bottom-tab-gold-overlay [data-tab="' + t + '"] .bottom-tab-label');
    if (src && dst) {
      var lbl = src.querySelector('.bottom-tab-label');
      if (lbl) dst.textContent = lbl.textContent;
    }
  });
}
function _syncTabGoldOverlayLayout() {
  var inner = document.querySelector('.bottom-tabs-inner');
  var overlay = document.getElementById('bottom-tab-gold-overlay');
  if (!inner || !overlay) return;
  TAB_ORDER.forEach(function(t) {
    var btn = document.getElementById('bottom-tab-' + t);
    var gold = overlay.querySelector('[data-tab="' + t + '"]');
    if (!btn || !gold) return;
    gold.style.left = btn.offsetLeft + 'px';
    gold.style.top = btn.offsetTop + 'px';
    gold.style.width = btn.offsetWidth + 'px';
    gold.style.height = btn.offsetHeight + 'px';
  });
}
function _applyTabGoldOverlayClip(pillLeft, pillTop, pillW, pillH) {
  var inner = document.querySelector('.bottom-tabs-inner');
  var overlay = document.getElementById('bottom-tab-gold-overlay');
  if (!inner || !overlay) return;
  var iw = inner.offsetWidth;
  var ih = inner.offsetHeight;
  overlay.style.clipPath = 'inset(' + pillTop + 'px ' + (iw - pillLeft - pillW) + 'px ' + (ih - pillTop - pillH) + 'px ' + pillLeft + 'px round 999px)';
}
function _setTabIndicatorDragging(isDragging) {
  var indicator = document.getElementById('bottom-tab-indicator');
  var overlay = document.getElementById('bottom-tab-gold-overlay');
  if (indicator) indicator.classList.toggle('is-dragging', isDragging);
  if (overlay) overlay.classList.toggle('is-dragging', isDragging);
}
function _tabBtnLayout(btn) {
  return { left: btn.offsetLeft, top: btn.offsetTop, width: btn.offsetWidth, height: btn.offsetHeight };
}
function _updateTabIndicatorFromIndex(index) {
  var indicator = document.getElementById('bottom-tab-indicator');
  var inner = document.querySelector('.bottom-tabs-inner');
  if (!indicator || !inner) return;
  _syncTabGoldOverlayLayout();
  var floorIdx = Math.max(0, Math.min(TAB_ORDER.length - 1, Math.floor(index)));
  var ceilIdx = Math.min(TAB_ORDER.length - 1, floorIdx + 1);
  var frac = index - floorIdx;
  var btnA = document.getElementById('bottom-tab-' + TAB_ORDER[floorIdx]);
  if (!btnA) return;
  var ar = _tabBtnLayout(btnA);
  var pillLeft, pillTop, pillW, pillH;
  if (floorIdx === ceilIdx || frac < 0.001) {
    pillW = ar.width;
    pillH = ar.height;
    pillLeft = ar.left;
    pillTop = ar.top;
  } else {
    var btnB = document.getElementById('bottom-tab-' + TAB_ORDER[ceilIdx]);
    if (!btnB) return;
    var br = _tabBtnLayout(btnB);
    pillW = ar.width + (br.width - ar.width) * frac;
    pillH = ar.height + (br.height - ar.height) * frac;
    pillLeft = ar.left + (br.left - ar.left) * frac;
    pillTop = ar.top + (br.top - ar.top) * frac;
  }
  indicator.style.width = pillW + 'px';
  indicator.style.height = pillH + 'px';
  indicator.style.transform = 'translate(' + pillLeft + 'px,' + pillTop + 'px)';
  _applyTabGoldOverlayClip(pillLeft, pillTop, pillW, pillH);
}
function _syncTabPanelFlow(opts) {
  opts = opts || {};
  var show = {};
  if (typeof opts.dragIndex === 'number') {
    var lo = Math.max(0, Math.min(TAB_ORDER.length - 1, Math.floor(opts.dragIndex)));
    var hi = Math.max(0, Math.min(TAB_ORDER.length - 1, Math.ceil(opts.dragIndex)));
    show[lo] = true;
    show[hi] = true;
  } else {
    show[opts.activeIndex != null ? opts.activeIndex : _tabIndex] = true;
  }
  (opts.also || []).forEach(function(i) {
    if (i >= 0 && i < TAB_ORDER.length) show[i] = true;
  });
  TAB_ORDER.forEach(function(t, idx) {
    var panel = document.getElementById('tab-panel-' + t);
    if (panel) panel.classList.toggle('tab-flow-visible', !!show[idx]);
    if (show[idx]) _syncTabStackVisibility(t);
  });
  _syncTabViewportHeight(show);
}
function _syncTabPanelStates(index) {
  TAB_ORDER.forEach(function(t, idx) {
    var panel = document.getElementById('tab-panel-' + t);
    var isActive = idx === index;
    if (panel) {
      panel.classList.toggle('active', isActive);
      panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    }
    var btn = document.getElementById('bottom-tab-' + t);
    if (btn) {
      btn.classList.toggle('active', isActive);
      if (isActive) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    }
  });
}
function _ensurePracticeTab() {
  if (_practiceTabReady) return;
  _practiceTabReady = true;
  if (typeof _initPracticeTab === 'function') _initPracticeTab();
}
function _ensureStatsTab() {
  if (_statsTabReady) {
    if (_profileDirty && typeof renderLearningProfile === 'function') renderLearningProfile();
    return;
  }
  _statsTabReady = true;
  if (typeof _ensureLearningProfileData === 'function') {
    _ensureLearningProfileData(typeof learningProfileSelectedLevel !== 'undefined' ? learningProfileSelectedLevel : 'ALL');
  }
}
function _preloadAllTabs() {
  _ensurePracticeTab();
  _ensureStatsTab();
}
function _setTabDragIndex(fractionalIndex) {
  _tabDragIndex = Math.max(0, Math.min(TAB_ORDER.length - 1, fractionalIndex));
  _syncTabPanelFlow({ dragIndex: _tabDragIndex });
  _applyTabTrackTransform(_tabDragIndex, false);
  _setTabIndicatorDragging(true);
  _updateTabIndicatorFromIndex(_tabDragIndex);
}
function _snapTabDrag() {
  if (_tabDragIndex === null) return;
  var snapped = Math.round(_tabDragIndex);
  _tabDragIndex = null;
  var track = _getTabTrack();
  if (track) track.classList.remove('is-dragging');
  _setTabIndicatorDragging(false);
  _navigateTab(snapped, { animate: true, force: true, fromDrag: true });
}
function _navigateTab(index, opts) {
  opts = opts || {};
  index = Math.max(0, Math.min(TAB_ORDER.length - 1, Math.round(index)));
  var targetTab = TAB_ORDER[index];
  if (index === _tabIndex && _tabDragIndex === null && !opts.fromDrag && opts.popActiveToRoot !== false) {
    if (_getStackTop(targetTab) !== _tabRoots[targetTab]) {
      _popStackToRoot(targetTab, { animate: opts.animate !== false });
    }
    return;
  }
  if (index === _tabIndex && opts.fromDrag) {
    _setTabIndex(index, Object.assign({}, opts, { force: true }));
    return;
  }
  var leavingPage = _getStackTop(_activeTab);
  _confirmPageLeave(leavingPage).then(function(ok) {
    if (!ok) {
      if (opts.fromDrag) {
        _tabDragIndex = null;
        _setTabIndex(_tabIndex, { animate: true, force: true });
        _updateTabIndicator(_activeTab);
      }
      return;
    }
    if (leavingPage === 'screen-quiz') {
      _abortQuizSession();
      if (_getStackTop(_activeTab) === 'screen-quiz') popTabPage({ animate: false, tab: _activeTab });
    }
    _setTabIndex(index, opts);
  });
}
function _setTabIndex(index, opts) {
  opts = opts || {};
  index = Math.max(0, Math.min(TAB_ORDER.length - 1, Math.round(index)));
  if (!opts.force && index === _tabIndex && _tabDragIndex === null) return;
  var prevIndex = _tabIndex;
  if (!opts.skipScrollSave) _saveTabScroll();
  var animating = opts.animate !== false && _tabCarouselReady && !_tabReducedMotion() && prevIndex !== index;
  _tabIndex = index;
  _activeTab = TAB_ORDER[index];
  _tabDragIndex = null;
  _syncTabPanelStates(index);
  _syncTabPanelFlow({ activeIndex: index, also: animating ? [prevIndex] : [] });
  _applyTabTrackTransform(index, animating);
  _updateTabIndicator(_activeTab);
  if (animating) {
    var track = _getTabTrack();
    if (track) {
      var onTransitionEnd = function(e) {
        if (e.target !== track || e.propertyName !== 'transform') return;
        track.removeEventListener('transitionend', onTransitionEnd);
        _syncTabPanelFlow({ activeIndex: index });
      };
      track.addEventListener('transitionend', onTransitionEnd);
    }
  }
  if (!opts.skipScrollRestore) _restoreTabScroll(_activeTab);
  _syncAppChrome();
}
function switchTab(tab, opts) {
  var idx = TAB_ORDER.indexOf(tab);
  if (idx < 0) return;
  _navigateTab(idx, Object.assign({ animate: true, popActiveToRoot: false }, opts || {}));
}
window.switchTab = switchTab;

function _isStatsTabVisible() {
  return _activeTab === 'stats' && _getStackTop('stats') === 'stats-root';
}
function _isPracticeTabVisible() {
  return _activeTab === 'practice';
}
window._isStatsTabVisible = _isStatsTabVisible;

function _updateTabBarVisibility() {
  var tabs = document.getElementById('bottom-tabs');
  if (!tabs) return;
  tabs.classList.remove('hidden');
  document.body.classList.remove('tabs-hidden');
}

function _updateTabIndicator(tab) {
  _setTabIndicatorDragging(false);
  _updateTabIndicatorFromIndex(TAB_ORDER.indexOf(tab));
}

function _tabIndexFromNavX(clientX) {
  var inner = document.querySelector('.bottom-tabs-inner');
  if (!inner) return _tabIndex;
  var rect = inner.getBoundingClientRect();
  var x = clientX - rect.left;
  var entries = TAB_ORDER.map(function(t, i) {
    var btn = document.getElementById('bottom-tab-' + t);
    if (!btn) return null;
    return { index: i, center: btn.offsetLeft + btn.offsetWidth / 2 };
  }).filter(Boolean);
  if (!entries.length) return _tabIndex;
  entries.sort(function(a, b) { return a.center - b.center; });
  if (x <= entries[0].center) return entries[0].index;
  if (x >= entries[entries.length - 1].center) return entries[entries.length - 1].index;
  for (var i = 0; i < entries.length - 1; i++) {
    if (x >= entries[i].center && x <= entries[i + 1].center) {
      var span = entries[i + 1].center - entries[i].center;
      if (!span) return entries[i].index;
      var frac = (x - entries[i].center) / span;
      return entries[i].index + frac * (entries[i + 1].index - entries[i].index);
    }
  }
  return _tabIndex;
}

function _resyncTabLayoutAfterDirChange() {
  if (typeof _tabIndex !== 'number') return;
  var idx = _tabDragIndex !== null ? _tabDragIndex : _tabIndex;
  _syncTabPanelFlow({ activeIndex: _tabIndex, also: [Math.floor(idx), Math.ceil(idx)] });
  _applyTabTrackTransform(idx, false);
  requestAnimationFrame(function() {
    _syncTabGoldOverlayLabels();
    _updateTabIndicator(_activeTab);
    _syncTabViewportHeight({ [_tabIndex]: true });
  });
}
window._resyncTabLayoutAfterDirChange = _resyncTabLayoutAfterDirChange;

function _initTabGestures() {
  var navInner = document.querySelector('.bottom-tabs-inner');
  if (!navInner) return;

  var DRAG_THRESHOLD = 8;
  var navState = null;
  var navSuppressClick = false;

  navInner.addEventListener('pointerdown', function(e) {
    if (_tabGesturesBlocked() || e.button > 0) return;
    var tabBtn = e.target.closest('.bottom-tab');
    navState = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startIndex: _tabDragIndex !== null ? _tabDragIndex : _tabIndex,
      targetTab: tabBtn ? tabBtn.getAttribute('data-tab') : null,
      dragging: false
    };
  });

  navInner.addEventListener('pointermove', function(e) {
    if (!navState || navState.id !== e.pointerId) return;
    var dx = e.clientX - navState.startX;
    var dy = e.clientY - navState.startY;
    if (!navState.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      navState.dragging = true;
      navInner.classList.add('is-dragging');
      navInner.setPointerCapture(e.pointerId);
    }
    e.preventDefault();
    _setTabDragIndex(_tabIndexFromNavX(e.clientX));
  }, { passive: false });

  function _endNavDrag(e) {
    if (!navState || navState.id !== e.pointerId) return;
    navInner.classList.remove('is-dragging');
    if (navState.dragging) {
      try { navInner.releasePointerCapture(e.pointerId); } catch (err) {}
      _snapTabDrag();
      navSuppressClick = true;
    } else if (navState.targetTab) {
      if (!_tabGesturesBlocked()) switchTab(navState.targetTab, { popActiveToRoot: true });
    } else if (!_tabGesturesBlocked()) {
      _navigateTab(Math.round(_tabIndexFromNavX(e.clientX)), { animate: true, fromDrag: true });
    }
    navState = null;
  }
  navInner.addEventListener('pointerup', _endNavDrag);
  navInner.addEventListener('pointercancel', _endNavDrag);

  TAB_ORDER.forEach(function(t) {
    var btn = document.getElementById('bottom-tab-' + t);
    if (!btn) return;
    btn.addEventListener('click', function(e) {
      if (navSuppressClick) {
        e.preventDefault();
        navSuppressClick = false;
        return;
      }
      if (_tabGesturesBlocked()) return;
      switchTab(t, { popActiveToRoot: true });
    });
  });
}
window._initTabGestures = _initTabGestures;

function _backArrowSvg(isRtl) {
  return '<svg class="ui-icon" aria-hidden="true"><use href="#' + (isRtl ? 'icon-arrow-right' : 'icon-arrow-left') + '"/></svg>';
}

// Page chrome actions: `.screen-top-actions-src` mounts into `.tab-page-actions`.
var _pageActionMount = null;

function _restorePageActions() {
  if (_pageActionMount && _pageActionMount.slot) {
    _pageActionMount.slot.innerHTML = '';
    _pageActionMount.slot.classList.add('hidden');
  }
  if (_pageActionMount && _pageActionMount.el && _pageActionMount.home) {
    _pageActionMount.home.appendChild(_pageActionMount.el);
  }
  _pageActionMount = null;
}

function _mountPageActions(screenId) {
  _restorePageActions();
  var screen = document.getElementById(screenId);
  if (!screen) return;
  var src = screen.querySelector('.screen-top-actions-src');
  var slot = screen.querySelector('.tab-page-actions');
  if (!src || !slot) return;
  var home = screen.querySelector('.tab-page-body') || screen;
  _pageActionMount = { el: src, home: home, slot: slot };
  slot.appendChild(src);
  slot.classList.remove('hidden');
}

function _resetSubscreenHeaders() {
  _restorePageActions();
  document.querySelectorAll('.swipe-header, .dict-header').forEach(function(h) { h.style.display = ''; });
  ['rush-summary-title'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.visibility = '';
  });
}

function _adaptiveBandLabel(p) {
  if (!p) return '';
  if (p.learningPhase === 'band_review') {
    return typeof t === 'function' ? t('adaptiveV2ReviewLabel') : 'B1 Review';
  }
  if (p.learningPhase === 'challenge') {
    return typeof t === 'function' ? t('adaptiveV2ChallengeLabel') : 'Challenge';
  }
  return p.cefrBand || 'ALL';
}

function _adaptiveV2Subtitle(p) {
  if (!p) return '';
  var stage = Number(p.evaluationStage) || 0;
  if (stage < 3) {
    if (stage <= 1) return typeof t === 'function' ? t('adaptiveV2StatusCal1') : 'Calibration · step 1 of 2';
    return typeof t === 'function' ? t('adaptiveV2StatusCal2') : 'Calibration · step 2 of 2';
  }
  if (p.learningPhase === 'band_review') return typeof t === 'function' ? t('adaptiveV2PhaseReview') : 'Review mode';
  if (p.learningPhase === 'challenge') return typeof t === 'function' ? t('adaptiveV2PhaseChallenge') : 'Challenge mode';
  var skillFn = typeof t === 'function' ? t('adaptiveV2StatusSkill') : null;
  if (skillFn && Number(p.skillLevel) >= 1) return skillFn(p.skillLevel);
  return _adaptiveBandLabel(p);
}

function _getQuizTopBarMeta() {
  if (currentThemeCategoryId > 0) {
    return {
      title: typeof t === 'function' ? t('themeSelectTitle') : 'Theme Quiz',
      subtitle: _categoryName(currentThemeCategoryId),
      color: '#b78af7'
    };
  }
  if (typeof window._rushIsActive === 'function' && window._rushIsActive()) {
    var rushP = typeof window._adaptiveV2GetProgress === 'function' ? window._adaptiveV2GetProgress() : null;
    return {
      title: typeof t === 'function' ? t('rushBannerTitle') : 'Rush Mode',
      subtitle: _adaptiveBandLabel(rushP),
      color: '#ff9a62'
    };
  }
  if (typeof window._adaptiveV2IsActive === 'function' && window._adaptiveV2IsActive()) {
    var v2P = typeof window._adaptiveV2GetProgress === 'function' ? window._adaptiveV2GetProgress() : null;
    return {
      title: typeof t === 'function' ? t('adaptiveV2BannerTitle') : 'Adaptive V2 (Beta)',
      subtitle: _adaptiveV2Subtitle(v2P),
      color: '#c4a0f7'
    };
  }
  if (currentLevel && currentLevel !== 'ALL') {
    var levelNames = (typeof t === 'function' ? t('levelNames') : null) || (UI[LANG] && UI[LANG].levelNames) || UI.en.levelNames || {};
    var levelName = levelNames[currentLevel] || '';
    return {
      title: typeof t === 'function' ? t('adaptiveSetupTitle') : 'Adaptive Quiz',
      subtitle: levelName ? currentLevel + ' · ' + levelName : currentLevel,
      color: '#6be8a0'
    };
  }
  return { title: '', subtitle: '', color: '' };
}

function _syncQuizPageChrome(screen) {
  var titleEl = screen.querySelector('.tab-page-title');
  var subEl = screen.querySelector('.tab-page-subtitle');
  if (!titleEl || !subEl) return;
  var meta = _getQuizTopBarMeta();
  if (meta.title) {
    titleEl.textContent = meta.title;
    titleEl.style.color = meta.color || '';
    titleEl.classList.remove('hidden');
  } else {
    titleEl.textContent = '';
    titleEl.classList.add('hidden');
  }
  if (meta.subtitle) {
    subEl.textContent = meta.subtitle;
    subEl.classList.remove('hidden');
  } else {
    subEl.textContent = '';
    subEl.classList.add('hidden');
  }
}

function _syncPageChrome(screenId) {
  var screen = document.getElementById(screenId);
  if (!screen) return;
  var chrome = screen.querySelector(':scope > .tab-page-chrome');
  if (!chrome) return;
  var titleEl = chrome.querySelector('.tab-page-title');
  var subEl = chrome.querySelector('.tab-page-subtitle');
  var backBtn = chrome.querySelector('.page-back-btn');
  var isRtl = document.body.classList.contains('lang-rtl');
  var showBack = !!_getPageBackAction(screenId);
  _restorePageActions();
  if (screenId === 'screen-quiz') {
    _syncQuizPageChrome(screen);
    _mountPageActions(screenId);
  } else {
    var titleSrc = screen.querySelector('.swipe-title, .rw-title, #rush-summary-title');
    var subSrc = screen.querySelector('.swipe-subtitle');
    if (titleSrc && titleSrc.textContent.trim()) {
      titleEl.textContent = titleSrc.textContent;
      titleEl.style.color = titleSrc.style.color || '';
      titleEl.classList.remove('hidden');
      if (titleSrc.id === 'rush-summary-title') titleSrc.style.visibility = 'hidden';
    } else {
      titleEl.textContent = '';
      titleEl.classList.add('hidden');
    }
    if (subSrc && subSrc.textContent.trim()) {
      subEl.textContent = subSrc.textContent;
      subEl.classList.remove('hidden');
    } else {
      subEl.textContent = '';
      subEl.classList.add('hidden');
    }
    var inlineHeader = screen.querySelector('.swipe-header, .dict-header, .screen-top-title-src');
    if (inlineHeader) inlineHeader.style.display = 'none';
    _mountPageActions(screenId);
  }
  if (backBtn) {
    backBtn.innerHTML = _backArrowSvg(isRtl);
    backBtn.classList.toggle('hidden', !showBack);
  }
  var hasTitle = titleEl && !titleEl.classList.contains('hidden');
  var hasActions = chrome.querySelector('.tab-page-actions:not(.hidden)');
  chrome.classList.toggle('hidden', !showBack && !hasTitle && !hasActions);
}

function showOfflineScreen() {
  window.APP_OFFLINE = true;
  var el = document.getElementById('offline-screen');
  if (el) el.classList.remove('hidden');
  document.body.classList.add('app-offline');
}

function hideOfflineScreen() {
  window.APP_OFFLINE = false;
  var el = document.getElementById('offline-screen');
  if (el) el.classList.add('hidden');
  document.body.classList.remove('app-offline');
  if (typeof window.APP_AUTH_RENDER === 'function') window.APP_AUTH_RENDER();
}

function checkOnline() {
  var btn = document.getElementById('offline-refresh-btn');
  var origText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = t('offlineChecking') || '…'; }

  var _done = false;
  function _restore() {
    if (_done) return;
    _done = true;
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }

  // Safety net: never leave the button stuck for more than 7 seconds.
  var _timer = setTimeout(_restore, 7000);

  // GET with a cache-bust query string: the SW won't find it in cache,
  // so it hits the real network. Succeeds online, rejects offline.
  // GET is used (not HEAD) because some WebKit PWA environments silently
  // hang on fetch() for methods the SW doesn't handle via respondWith().
  fetch('/sw.js?_nc=' + Date.now(), { cache: 'no-store' })
    .then(function(res) {
      clearTimeout(_timer);
      if (_done) return;
      _done = true;
      if (res.ok) {
        hideOfflineScreen();
      } else {
        _restore();
      }
    })
    .catch(function() {
      clearTimeout(_timer);
      _restore();
    });
}

// ── Init ──
// Apply persisted language layout (RTL, body classes, active button) on startup
(function() {
  var isRtl = LANG === 'fa' || LANG === 'ar';
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  document.body.classList.toggle('lang-fa', LANG === 'fa');
  document.body.classList.toggle('lang-ar', LANG === 'ar');
  document.body.classList.toggle('lang-rtl', isRtl);
  ['de','en','tr','fa','ru','uk','ar'].forEach(function(l) {
    var el = document.getElementById('opt-' + l);
    if (el) el.classList.toggle('active', l === LANG);
  });
  var sel = document.getElementById('lang-select');
  if (sel) sel.value = LANG;
  _langDdSync(LANG);
})();
applyTranslations();
_preloadAllTabs();
_ensureFlowPageChrome();

_setTabIndex(0, { animate: false, skipScrollSave: true, force: true });
_tabCarouselReady = true;
_initTabGestures();
_syncTabGoldOverlayLabels();
requestAnimationFrame(function() { _updateTabIndicator(_activeTab); });
window.addEventListener('resize', function() {
  _applyTabTrackTransform(_tabDragIndex !== null ? _tabDragIndex : _tabIndex, false);
  if (_tabDragIndex !== null) _syncTabPanelFlow({ dragIndex: _tabDragIndex });
  else _syncTabPanelFlow({ activeIndex: _tabIndex });
  _syncTabGoldOverlayLabels();
  _updateTabIndicator(_activeTab);
});
_updateTabBarVisibility();
_syncAllTabStacks();
_syncAppChrome();
_ensureHomeLayout();
window.addEventListener('pageshow', function() {
  _ensureHomeLayout();
  if (typeof window._adaptiveV2RefreshBadge === 'function') window._adaptiveV2RefreshBadge();
});
// ── Connectivity probe ───────────────────────────────────────────────────
// Fetches a cache-busted URL through the real network (SW passes _nc=
// requests un-cached). Times out after 5 s to handle captive-portal /
// server-unreachable scenarios that don't give an immediate connection error.
function _startConnectivityProbe(onFail) {
  var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var timer = ctrl ? setTimeout(function() { ctrl.abort(); }, 5000) : null;
  fetch('/sw.js?_nc=' + Date.now(), {
    cache: 'no-store',
    signal: ctrl ? ctrl.signal : undefined
  }).then(function(res) {
    if (timer) clearTimeout(timer);
    if (!res.ok) onFail();
  }).catch(function() {
    if (timer) clearTimeout(timer);
    onFail();
  });
}

// Connectivity check on startup.
// navigator.onLine is unreliable (reports true when a network interface is
// active even without real internet), so we probe the network directly.
// Runs in all contexts (browser tab + standalone PWA) because browsers cache
// the page via the service worker and will serve it even with no internet —
// we need to detect that and show the offline screen regardless.
if (!navigator.onLine) {
  // Synchronous fast path: browser already knows it's offline.
  showOfflineScreen();
} else {
  // Async probe with 5-second timeout.
  _startConnectivityProbe(showOfflineScreen);
}

// React to connectivity changes while the page is open.
window.addEventListener('offline', function() { showOfflineScreen(); });
window.addEventListener('online', function() {
  // Browser says a network interface is back. Optimistically hide the screen
  // and re-probe; if the probe fails (captive portal / server still down),
  // the offline screen re-appears.
  hideOfflineScreen();
  _startConnectivityProbe(showOfflineScreen);
});
updateCounts();
_wireNativeShellInsetGuards();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initInstallExperience, { once: true });
} else {
  _initInstallExperience();
}
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') {
    closeWordModal();
    closeInstallGuide();
  }
});

// ── Word-modal drag-to-close ─────────────────────────────────────────
// Handle click (desktop) + full-modal swipe-down (mobile, scroll-aware)
(function() {
  var handle = document.querySelector('.word-modal-handle');
  var modal  = document.querySelector('.word-modal');
  var scrollEl = modal ? (modal.querySelector('.word-modal-surface') || modal) : null;
  if (!modal) return;

  // Desktop: click the pill handle to dismiss
  if (handle) handle.addEventListener('click', function() { closeWordModal(); });

  var _startY, _startScrollTop, _dragging, _deltaY;

  modal.addEventListener('touchstart', function(e) {
    _startY = e.touches[0].clientY;
    _startScrollTop = scrollEl ? scrollEl.scrollTop : 0;
    _dragging = false;
    _deltaY = 0;
  }, { passive: true });

  // non-passive so we can preventDefault before the browser fires pull-to-refresh
  modal.addEventListener('touchmove', function(e) {
    if (_startY === undefined) return;
    var dy = e.touches[0].clientY - _startY;
    // When already at scroll-top and moving down, block pull-to-refresh
    // immediately — even before the drag threshold is crossed.
    if (_startScrollTop === 0 && dy > 0) {
      e.preventDefault();
    }
    if (!_dragging && dy > 6 && _startScrollTop === 0) {
      _dragging = true;
      modal.style.transition = 'none';
    }
    if (_dragging) {
      _deltaY = Math.max(0, dy);
      modal.style.transform = 'translateY(' + _deltaY + 'px)';
    }
  }, { passive: false });

  modal.addEventListener('touchend', function() {
    if (_startY === undefined) return;
    _startY = undefined;
    if (_dragging && _deltaY > 80) {
      // Animate off-screen, then close
      modal.style.transition = 'transform .2s ease-out';
      modal.style.transform = 'translateY(110%)';
      setTimeout(function() { closeWordModal(); }, 210);
    } else {
      modal.style.transition = '';
      modal.style.transform = '';
    }
    _dragging = false;
    _deltaY = 0;
  });
})();

// ── Install guide drag-to-close ──────────────────────────────────────
// Same close behavior as the settings drawer: tap the handle or swipe down.
(function() {
  var handle = document.querySelector('.install-guide-handle');
  var guide = document.querySelector('.install-guide');
  if (!guide) return;

  if (handle) handle.addEventListener('click', function() { closeInstallGuide(); });

  var _startY, _dragging, _deltaY;

  guide.addEventListener('touchstart', function(e) {
    _startY = e.touches[0].clientY;
    _dragging = false;
    _deltaY = 0;
  }, { passive: true });

  guide.addEventListener('touchmove', function(e) {
    if (_startY === undefined) return;
    var dy = e.touches[0].clientY - _startY;
    if (dy > 0) e.preventDefault();
    if (!_dragging && dy > 6) {
      _dragging = true;
      guide.style.transition = 'none';
    }
    if (_dragging) {
      _deltaY = Math.max(0, dy);
      guide.style.transform = 'translateY(' + _deltaY + 'px)';
    }
  }, { passive: false });

  guide.addEventListener('touchend', function() {
    if (_startY === undefined) return;
    _startY = undefined;
    if (_dragging && _deltaY > 80) {
      guide.style.transition = 'transform .2s ease-out';
      guide.style.transform = 'translateY(110%)';
      setTimeout(function() { closeInstallGuide(); }, 210);
    } else {
      guide.style.transition = '';
      guide.style.transform = '';
    }
    _dragging = false;
    _deltaY = 0;
  });

  guide.addEventListener('touchcancel', function() {
    _startY = undefined;
    guide.style.transition = '';
    guide.style.transform = '';
    _dragging = false;
    _deltaY = 0;
  });
})();



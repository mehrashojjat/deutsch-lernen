// ══════════════════════════════════════════════════════════════════
//  APP DIALOG — native bottom-sheet confirm/alert (matches settings drawer)
//  Depends on: app.js (t)
// ══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var _open = false;
  var _resolve = null;
  var _onKeyDown = null;

  function _label(key, fallback) {
    if (typeof t === 'function') {
      var val = t(key);
      if (val != null && val !== key) return val;
    }
    return fallback;
  }

  function _els() {
    return {
      overlay: document.getElementById('app-dialog-overlay'),
      panel: document.getElementById('app-dialog'),
      title: document.getElementById('app-dialog-title'),
      message: document.getElementById('app-dialog-message'),
      cancel: document.getElementById('app-dialog-cancel'),
      primary: document.getElementById('app-dialog-primary'),
      handle: document.getElementById('app-dialog-handle')
    };
  }

  function _close(result) {
    if (!_open) return;
    _open = false;
    var el = _els();
    if (el.overlay) el.overlay.classList.remove('open');
    if (el.panel) {
      el.panel.classList.remove('open');
      el.panel.classList.remove('single');
    }
    document.body.style.overflow = '';
    if (_onKeyDown) {
      document.removeEventListener('keydown', _onKeyDown);
      _onKeyDown = null;
    }
    var fn = _resolve;
    _resolve = null;
    if (typeof fn === 'function') fn(result);
  }

  function _show(opts, single) {
    opts = opts || {};
    if (_open) {
      return Promise.resolve('cancel');
    }
    var el = _els();
    if (!el.overlay || !el.panel) {
      return Promise.resolve('cancel');
    }

    var title = opts.title || '';
    var message = opts.message || '';
    if (el.title) {
      el.title.textContent = title;
      el.title.style.display = title ? '' : 'none';
    }
    if (el.message) el.message.textContent = message;
    if (el.primary) {
      el.primary.textContent = opts.primaryLabel ||
        _label('dialogOk', 'OK');
    }
    if (el.cancel) {
      el.cancel.textContent = opts.cancelLabel ||
        _label('dialogCancel', 'Cancel');
    }
    if (el.panel) el.panel.classList.toggle('single', !!single);

    return new Promise(function (resolve) {
      _resolve = resolve;
      _open = true;
      document.body.style.overflow = 'hidden';
      el.overlay.classList.add('open');
      el.panel.classList.add('open');

      function finish(result) {
        if (result === 'primary' && typeof opts.onPrimary === 'function') {
          opts.onPrimary();
        } else if (result === 'cancel' && typeof opts.onCancel === 'function') {
          opts.onCancel();
        }
        _close(result);
      }

      el.primary.onclick = function () { finish('primary'); };
      el.cancel.onclick = function () { finish('cancel'); };
      el.overlay.onclick = function () { finish('cancel'); };
      if (el.handle) el.handle.onclick = function () { finish('cancel'); };
      el.panel.onclick = function (e) { e.stopPropagation(); };

      _onKeyDown = function (e) {
        if (e.key === 'Escape') finish('cancel');
      };
      document.addEventListener('keydown', _onKeyDown);

      if (el.primary) el.primary.focus();
    });
  }

  window.appDialog = {
    confirm: function (opts) {
      return _show(opts, false);
    },
    alert: function (opts) {
      return _show(opts, true);
    },
    isOpen: function () {
      return _open;
    }
  };
})();

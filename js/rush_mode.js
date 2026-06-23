// ══════════════════════════════════════════════════════════════════
//  RUSH MODE — endless adaptive V2 quiz (sign-in, calibrated users)
//  Depends on: app.js, adaptive_v2.js, auth.js
// ══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var CHECKPOINT_LEN = 5;
  var _rushActive = false;
  var _rushAnswers = [];
  var _rushPreloadPromise = null;
  var _rushBestStreak = 0;
  var _rushCurrentStreak = 0;
  var _rushSessionTimeSec = 0;
  var _rushPagehideBound = false;

  function _rushTimerFlushSeconds() {
    if (typeof window._quizTimerFlushAndGetSeconds === 'function') {
      return window._quizTimerFlushAndGetSeconds();
    }
    return 0;
  }

  function _rushCheckpointPayload(answers) {
    var correct = 0;
    var incorrect = 0;
    answers.forEach(function (a) {
      if (a && a.correct) correct++;
      else incorrect++;
    });
    return {
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      studyTimeSeconds: _rushTimerFlushSeconds()
    };
  }

  function _rushRunCheckpoint(answers) {
    if (!answers || !answers.length) return;
    var payload = _rushCheckpointPayload(answers);
    if (typeof window._adaptiveV2ProcessResults === 'function') {
      window._adaptiveV2ProcessResults(answers, { forceActive: true, rush: true });
    }
    if (typeof window._adaptiveV2RecordRushCheckpoint === 'function') {
      window._adaptiveV2RecordRushCheckpoint(payload);
    } else if (typeof window.APP_AUTH_RECORD_QUIZ_STATS === 'function') {
      window.APP_AUTH_RECORD_QUIZ_STATS({
        mode: 'adaptive_v2',
        correctAnswers: payload.correctAnswers,
        incorrectAnswers: payload.incorrectAnswers,
        studyTimeSeconds: payload.studyTimeSeconds
      });
    }
    _rushSessionTimeSec += payload.studyTimeSeconds;
    if (typeof window.APP_AUTH_RUSH_CHECKPOINT === 'function') {
      window.APP_AUTH_RUSH_CHECKPOINT();
    }
  }

  function _rushMaybeCheckpoint(forceAll) {
    while (_rushAnswers.length >= CHECKPOINT_LEN) {
      _rushRunCheckpoint(_rushAnswers.splice(0, CHECKPOINT_LEN));
    }
    if (forceAll && _rushAnswers.length) {
      _rushRunCheckpoint(_rushAnswers.splice(0, _rushAnswers.length));
    }
  }

  function _rushEnsurePrefetch() {
    if (!_rushActive || _rushPreloadPromise) return;
    if (typeof queue === 'undefined' || typeof idx === 'undefined') return;
    if (queue.length - idx > 5) return;
    _rushPreloadPromise = Promise.resolve().then(function () {
      if (typeof window._adaptiveV2BuildQueue !== 'function') return [];
      return window._adaptiveV2BuildQueue();
    }).then(function (batch) {
      if (batch && batch.length && typeof queue !== 'undefined') {
        queue = queue.concat(batch);
      }
    }).catch(function () {}).finally(function () {
      _rushPreloadPromise = null;
    });
  }

  function _rushEnsureQueueAsync() {
    if (typeof queue === 'undefined' || typeof idx === 'undefined') {
      return Promise.resolve(false);
    }
    if (idx < queue.length) return Promise.resolve(true);
    var wait = _rushPreloadPromise ? _rushPreloadPromise : Promise.resolve();
    return wait.then(function () {
      if (idx < queue.length) return true;
      if (typeof window._adaptiveV2BuildQueue !== 'function') return false;
      var batch = window._adaptiveV2BuildQueue();
      if (batch && batch.length) {
        queue = queue.concat(batch);
        return true;
      }
      return false;
    });
  }

  function _rushBindPagehide() {
    if (_rushPagehideBound) return;
    _rushPagehideBound = true;
    window.addEventListener('pagehide', function () {
      if (!_rushActive) return;
      _rushMaybeCheckpoint(true);
      var tail = _rushTimerFlushSeconds();
      _rushSessionTimeSec += tail;
    });
  }

  function _rushRenderSummary() {
    var total = (typeof ok === 'number' ? ok : 0) + (typeof no === 'number' ? no : 0);
    var correct = typeof ok === 'number' ? ok : 0;
    var pct = total ? Math.round(correct / total * 100) : 0;
    var p = typeof window._adaptiveV2GetProgress === 'function' ? window._adaptiveV2GetProgress() : null;
    var rushStats = (p && p.quizStats && p.quizStats.rush) || {};
    var bestQ = Number(rushStats.bestSessionQuestions) || 0;
    var isRecord = total > 0 && total >= bestQ;

    document.getElementById('rush-summary-emoji').textContent = pct >= 80 ? '🏆' : (pct >= 60 ? '🎉' : '👍');
    document.getElementById('rush-summary-title').textContent = t('rushSummaryTitle');
    document.getElementById('rush-summary-score').textContent =
      (typeof formatNum === 'function' ? formatNum(correct) : correct) + '/' +
      (typeof formatNum === 'function' ? formatNum(total) : total);
    document.getElementById('rush-summary-pct').textContent =
      (typeof formatNum === 'function' ? formatNum(pct) : pct) + '%';
    document.getElementById('rush-summary-ok').textContent =
      typeof formatNum === 'function' ? formatNum(correct) : String(correct);
    document.getElementById('rush-summary-no').textContent =
      typeof formatNum === 'function' ? formatNum(no) : String(no);
    document.getElementById('rush-summary-streak').textContent =
      typeof formatNum === 'function' ? formatNum(_rushBestStreak) : String(_rushBestStreak);
    var timeEl = document.getElementById('rush-summary-time');
    if (timeEl) {
      timeEl.textContent = typeof window._formatStudyTime === 'function'
        ? window._formatStudyTime(_rushSessionTimeSec)
        : (_rushSessionTimeSec + 's');
    }
    var recordEl = document.getElementById('rush-summary-record');
    if (recordEl) {
      recordEl.textContent = isRecord ? t('rushSummaryRecord') : '';
      recordEl.style.display = isRecord ? '' : 'none';
    }
    if (typeof show === 'function') show('screen-rush-summary');
  }

  function _rushEndSession(showSummary) {
    if (!_rushActive) return;
    _rushMaybeCheckpoint(true);
    var tailTime = _rushTimerFlushSeconds();
    if (tailTime > 0) {
      _rushSessionTimeSec += tailTime;
      if (typeof window._adaptiveV2RecordRushCheckpoint === 'function') {
        window._adaptiveV2RecordRushCheckpoint({
          correctAnswers: 0,
          incorrectAnswers: 0,
          studyTimeSeconds: tailTime
        });
      }
    }
    var total = (typeof ok === 'number' ? ok : 0) + (typeof no === 'number' ? no : 0);
    if (typeof window._adaptiveV2FinalizeRushSession === 'function') {
      window._adaptiveV2FinalizeRushSession({
        totalQuestions: total,
        correctAnswers: typeof ok === 'number' ? ok : 0,
        studyTimeSeconds: _rushSessionTimeSec
      });
    }
    if (typeof window._quizTimerStopAndGetSeconds === 'function') {
      window._quizTimerStopAndGetSeconds();
    }
    _rushActive = false;
    currentThemeCategoryId = 0;
    if (typeof window.APP_AUTH_RUSH_COMPLETE === 'function') {
      window.APP_AUTH_RUSH_COMPLETE();
    }
    window.umami?.track('rush_mode_ended', {
      questions: total,
      correct: typeof ok === 'number' ? ok : 0,
      accuracy_pct: total ? Math.round((ok / total) * 100) : 0
    });
    if (showSummary !== false) _rushRenderSummary();
  }

  window.endRushSession = _rushEndSession;
  window._rushIsActive = function () { return _rushActive; };

  window.openRushMode = function () {
    window.umami?.track('rush_mode_opened');
    if (typeof window.APP_AUTH_IS_SIGNED_IN === 'function' && !window.APP_AUTH_IS_SIGNED_IN()) {
      if (typeof window.appDialog !== 'object' || typeof window.appDialog.confirm !== 'function') return;
      window.appDialog.confirm({
        title: t('rushSignInTitle'),
        message: t('rushSignInMessage'),
        primaryLabel: t('rushSignInPrimary'),
        cancelLabel: t('dialogCancel')
      }).then(function (result) {
        if (result === 'primary' && typeof openSettings === 'function') openSettings();
      });
      return;
    }
    if (typeof window._adaptiveV2IsCalibrated === 'function' && !window._adaptiveV2IsCalibrated()) {
      if (typeof window.appDialog !== 'object' || typeof window.appDialog.confirm !== 'function') return;
      window.appDialog.confirm({
        title: t('rushCalTitle'),
        message: t('rushCalMessage'),
        primaryLabel: t('rushCalPrimary'),
        cancelLabel: t('dialogCancel')
      }).then(function (result) {
        if (result === 'primary' && typeof openAdaptiveV2 === 'function') openAdaptiveV2();
      });
      return;
    }
    if (typeof window.startRushMode === 'function') window.startRushMode();
  };

  window.startRushMode = async function () {
    _rushActive = true;
    _rushAnswers = [];
    _rushPreloadPromise = null;
    _rushBestStreak = 0;
    _rushCurrentStreak = 0;
    _rushSessionTimeSec = 0;
    _rushBindPagehide();

    var ov = document.getElementById('quiz-prep-overlay');
    ov.classList.add('active');

    try {
      if (typeof window._loadV2Vocab === 'function') await window._loadV2Vocab();
    } catch (err) {
      ov.classList.remove('active');
      _rushActive = false;
      alert(t('errLoadQuiz'));
      return;
    }

    var cards = typeof window._adaptiveV2BuildQueue === 'function' ? window._adaptiveV2BuildQueue() : [];
    ov.classList.remove('active');

    if (!cards.length) {
      _rushActive = false;
      alert(t('errNoWords'));
      return;
    }

    currentLevel = 'ALL';
    currentThemeCategoryId = 0;
    queue = cards;
    idx = 0;
    ok = 0;
    no = 0;
    _quizReturnScreen = 'screen-levels';

    window.umami?.track('rush_mode_started');
    if (typeof show === 'function') show('screen-quiz');
    if (typeof renderCard === 'function') renderCard();
  };

  window.restartRushMode = function () {
    if (typeof window.openRushMode === 'function') window.openRushMode();
  };

  window._rushRefreshBanner = function () {
    var sub = document.getElementById('rush-banner-sub');
    var iconUse = document.querySelector('#rush-banner-icon use');
    var iconSvg = document.getElementById('rush-banner-icon');
    if (!sub) return;
    var signedIn = typeof window.APP_AUTH_IS_SIGNED_IN === 'function' && window.APP_AUTH_IS_SIGNED_IN();
    sub.textContent = signedIn
      ? t('rushBannerSub')
      : t('rushBannerSubGuest');
    if (iconUse) iconUse.setAttribute('href', signedIn ? '#icon-lightning' : '#icon-lock');
    if (iconSvg) iconSvg.classList.toggle('ui-icon--filled', !!signedIn);
  };

  var _origRenderCard = window.renderCard;
  window.renderCard = function () {
    _origRenderCard();
    if (!_rushActive) return;

    _rushEnsurePrefetch();

    var sessionNum = (typeof ok === 'number' ? ok : 0) + (typeof no === 'number' ? no : 0) + idx + 1;
    var posEl = document.getElementById('hud-pos');
    if (posEl) {
      posEl.textContent = '#' + (typeof formatNum === 'function' ? formatNum(sessionNum) : sessionNum);
    }
    var segPos = ((typeof ok === 'number' ? ok : 0) + (typeof no === 'number' ? no : 0) + idx) % CHECKPOINT_LEN;
    var prog = document.getElementById('prog');
    if (prog) prog.style.width = (segPos / CHECKPOINT_LEN * 100) + '%';

    var mb = document.getElementById('tmode-badge');
    if (mb) {
      mb.textContent = t('rushBadge');
      mb.className = 'tmode-badge glass glass-pill glass-chrome grammar';
    }
    var tl = document.getElementById('tlevel');
    if (tl && typeof window._adaptiveV2GetProgress === 'function') {
      var p = window._adaptiveV2GetProgress();
      var label = (p && p.cefrBand) || 'ALL';
      if (p && p.learningPhase === 'band_review') {
        label = t('adaptiveV2ReviewLabel');
      } else if (p && p.learningPhase === 'challenge') {
        label = t('adaptiveV2ChallengeLabel');
      }
      var lvl = t('levelLabel');
      tl.textContent = lvl + ' ' + label;
    }
  };

  var _origPick = window.pick;
  window.pick = function (btn, selectedId, correctId) {
    var wasRush = _rushActive;
    _origPick(btn, selectedId, correctId);
    if (!wasRush) return;

    var card = queue[idx];
    var diff = parseInt((card && card._row && card._row.difficulty) || '5', 10) || 5;
    var p = typeof window._adaptiveV2GetProgress === 'function' ? window._adaptiveV2GetProgress() : null;
    var wordBand = typeof window._v2BandFromId === 'function' ? window._v2BandFromId(correctId) : 'A1';
    var correct = selectedId === correctId;
    _rushAnswers.push({
      wordId: correctId,
      difficulty: diff,
      correct: correct,
      position: (typeof ok === 'number' ? ok : 0) + (typeof no === 'number' ? no : 0),
      cefrBand: wordBand,
      isCrossBand: wordBand !== ((p && p.cefrBand) || 'A1')
    });

    if (correct) {
      _rushCurrentStreak++;
      if (_rushCurrentStreak > _rushBestStreak) _rushBestStreak = _rushCurrentStreak;
    } else {
      _rushCurrentStreak = 0;
    }
  };

  var _origNextCard = window.nextCard;
  window.nextCard = function () {
    if (!_rushActive) {
      _origNextCard();
      return;
    }
    if (typeof window._quizTimerTouch === 'function') window._quizTimerTouch();
    _rushMaybeCheckpoint(false);
    idx++;
    _rushEnsureQueueAsync().then(function (hasCards) {
      if (!hasCards || idx >= queue.length) {
        alert(t('errNoWords'));
        _rushEndSession(true);
        return;
      }
      if (typeof renderCard === 'function') renderCard();
    });
  };

  var _origGoHome = window.goHome;
  window.goHome = function () {
    if (_rushActive) {
      _rushEndSession(true);
      return;
    }
    if (typeof _origGoHome === 'function') _origGoHome();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window._rushRefreshBanner();
    });
  } else {
    window._rushRefreshBanner();
  }
})();



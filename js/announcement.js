// ── Announcement Banner System ──────────────────────────────────────────
// To show a new announcement, push a new entry into ANNOUNCEMENTS.
// Each entry: { id, i18n: { [lang]: { title, message, ctaLabel, dismiss } }, ctaUrl }
// The most-recent entry is always shown on every page load.
// The active UI language is read from localStorage key 'dl_lang' (falls back to 'en').
// RTL languages (fa, ar) automatically flip the card direction.
// ────────────────────────────────────────────────────────────────────────
(function () {
  'use strict';

  var LINK = '<strong><a href="https://wortschatzapp.de" target="_blank" rel="noopener noreferrer">wortschatzapp.de</a></strong>';

  var ANNOUNCEMENTS = [
    {
      id: 'move-wortschatzapp-2026',
      ctaUrl: 'https://wortschatzapp.de',
      i18n: {
        en: {
          title: "We're moving!",
          message: 'Formerly DeutschLernen, is getting a new homepage at ' + LINK + '. This address will stay active for a while, but head over to the new site to keep learning.',
          ctaLabel: 'Go to wortschatzapp.de',
          dismiss: 'Maybe later'
        },
        de: {
          title: 'Wir ziehen um!',
          message: 'Früher als DeutschLernen bekannt, bekommt jetzt eine neue Homepage unter ' + LINK + '. Diese Adresse bleibt noch eine Weile aktiv, aber besuche die neue Seite, um weiter zu lernen.',
          ctaLabel: 'Zu wortschatzapp.de',
          dismiss: 'Vielleicht später'
        },
        tr: {
          title: 'Taşınıyoruz!',
          message: 'Eski adıyla DeutschLernen, yeni ana sayfasına kavuşuyor: ' + LINK + '. Bu adres bir süre daha aktif kalacak, ama öğrenmeye devam etmek için yeni siteyi ziyaret et.',
          ctaLabel: "wortschatzapp.de'ye git",
          dismiss: 'Belki sonra'
        },
        ru: {
          title: 'Мы переезжаем!',
          message: 'Ранее известный как DeutschLernen, получает новый адрес — ' + LINK + '. Этот адрес ещё будет работать некоторое время, но заходите на новый сайт, чтобы продолжать учиться.',
          ctaLabel: 'Перейти на wortschatzapp.de',
          dismiss: 'Может, позже'
        },
        uk: {
          title: 'Ми переїжджаємо!',
          message: 'Раніше відомий як DeutschLernen, отримує нову головну сторінку за адресою ' + LINK + '. Ця адреса ще деякий час залишатиметься активною, але заходьте на новий сайт, щоб продовжувати вчитися.',
          ctaLabel: 'Перейти на wortschatzapp.de',
          dismiss: 'Може, пізніше'
        },
        fa: {
          title: '!داریم نقل مکان می‌کنیم',
          message: 'که پیش‌تر DeutschLernen نام داشت، صفحه اصلی جدیدی به نشانی ' + LINK + ' پیدا کرده است. این نشانی فعلاً فعال می‌ماند، اما برای ادامه یادگیری به سایت جدید سر بزنید.',
          ctaLabel: 'رفتن به wortschatzapp.de',
          dismiss: 'شاید بعداً'
        },
        ar: {
          title: '!نحن ننتقل',
          message: 'المعروف سابقاً بـ DeutschLernen، يحصل على صفحة رئيسية جديدة على ' + LINK + '. سيبقى هذا العنوان نشطاً لبعض الوقت، لكن توجّه إلى الموقع الجديد لمواصلة التعلّم.',
          ctaLabel: 'الذهاب إلى wortschatzapp.de',
          dismiss: 'ربما لاحقاً'
        }
      }
    }
  ];

  // Only show on the old domain — hide on the new site itself.
  if (window.location.hostname === 'wortschatzapp.de') return;

  // Always show the most-recent announcement on every page load.
  var active = ANNOUNCEMENTS[ANNOUNCEMENTS.length - 1];
  if (!active) return;

  // Resolve language — fall back through chain to 'en'.
  var RTL_LANGS = { fa: true, ar: true };
  var lang = (function () {
    try { return localStorage.getItem('dl_lang') || 'en'; } catch (e) { return 'en'; }
  }());
  var t = active.i18n[lang] || active.i18n['en'];
  var isRtl = !!RTL_LANGS[lang];

  // ── Inject styles ──────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent =
    '#ann-overlay{' +
      'position:fixed;inset:0;z-index:9000;' +
      'display:flex;align-items:center;justify-content:center;padding:20px;' +
      'background:rgba(6,8,16,.72);backdrop-filter:blur(14px);' +
      'opacity:0;transition:opacity .25s;pointer-events:none;}' +
    '#ann-overlay.open{opacity:1;pointer-events:all;}' +
    '#ann-card{' +
      'background:linear-gradient(180deg,rgba(21,28,46,.99),rgba(14,18,31,.99));' +
      'border:1px solid rgba(255,255,255,.09);border-radius:22px;' +
      'padding:26px 24px 20px;max-width:380px;width:100%;' +
      'box-shadow:0 20px 60px rgba(0,0,0,.6);' +
      'transform:translateY(12px);transition:transform .28s cubic-bezier(.32,.72,0,1);}' +
    '#ann-overlay.open #ann-card{transform:translateY(0);}' +
    '#ann-icon{font-size:1.55rem;margin-bottom:10px;}' +
    '#ann-title{' +
      'font-family:"Fraunces","Vazirmatn",serif;color:#e8c97a;' +
      'font-size:1.1rem;font-weight:700;margin-bottom:10px;}' +
    '#ann-msg{font-size:.86rem;line-height:1.72;color:#dde1f0;margin-bottom:22px;}' +
    '#ann-msg strong{color:#e8c97a;font-weight:600;}' +
    '#ann-msg a{color:#e8c97a;text-decoration:none;font-weight:600;}' +
    '#ann-msg a:hover{text-decoration:underline;}' +
    '#ann-cta{' +
      'display:block;width:100%;padding:13px;' +
      'background:linear-gradient(135deg,#e8c97a,#c8a050);color:#0b0d13;' +
      'border:none;border-radius:50px;' +
      'font-family:"Outfit","Vazirmatn",sans-serif;font-size:.9rem;font-weight:700;' +
      'cursor:pointer;margin-bottom:8px;transition:opacity .15s;}' +
    '#ann-cta:hover{opacity:.88;}' +
    '#ann-dismiss{' +
      'display:block;width:100%;padding:9px;' +
      'background:none;border:none;' +
      'color:#6b7090;font-size:.82rem;cursor:pointer;' +
      'font-family:"Outfit","Vazirmatn",sans-serif;transition:color .15s;}' +
    '#ann-dismiss:hover{color:#dde1f0;}';
  document.head.appendChild(style);

  // ── Build markup ───────────────────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'ann-overlay';
  overlay.innerHTML =
    '<div id="ann-card"' + (isRtl ? ' dir="rtl"' : '') + '>' +
    '  <div id="ann-icon">📢</div>' +
    '  <div id="ann-title">' + t.title + '</div>' +
    '  <div id="ann-msg">' + t.message + '</div>' +
    '  <button id="ann-cta">' + t.ctaLabel + '</button>' +
    '  <button id="ann-dismiss">' + t.dismiss + '</button>' +
    '</div>';
  document.body.appendChild(overlay);

  // ── Dismiss helper ─────────────────────────────────────────────────────
  function dismiss() {
    overlay.classList.remove('open');
    setTimeout(function () { overlay.remove(); style.remove(); }, 300);
  }

  document.getElementById('ann-cta').addEventListener('click', function () {
    dismiss();
    window.open(active.ctaUrl, '_blank', 'noopener,noreferrer');
  });

  document.getElementById('ann-dismiss').addEventListener('click', dismiss);

  // Clicking the backdrop also dismisses.
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) dismiss();
  });

  // ── Show (after two rAF frames so the page has painted first) ──────────
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.add('open');
    });
  });

}());

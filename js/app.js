// ══════════════════════════════════════════════════════════════════
//  UI STRINGS  (EN + TR)
// ══════════════════════════════════════════════════════════════════
const UI = {
  en: {
    headerSub: 'Word Practice · Cases · Verb Forms',
    settingsTitle: 'Settings',
    langLabel: 'Language',
    closeDone: 'Close',
    rwBannerTitle: 'Word Explorer',
    rwBannerSub: 'Open one word card instantly',
    swipeBannerTitle: 'Quick Match',
    swipeBannerSub: 'Swipe if the meaning matches',
    selectLevel: 'Select Level',
    levelNames: { A1:'Starter', A2:'Elementary', B1:'Intermediate', B2:'Upper-Intermediate' },
    cardCount: (n) => n + ' word practice cards',
    back: '← Back',
    next: 'Next →',
    correct: '✓ Correct!',
    wrong: (a) => `✗ Wrong. Correct answer: <strong>${a}</strong>`,
    resultTitles: { great:'Excellent!', good:'Well done!', ok:'Good effort!', low:'Keep practicing!' },
    resultSub: (lv,p) => `Level ${lv} · ${p}% correct`,
    scoreLbl: 'Score', correctLbl: 'Correct', wrongLbl: 'Wrong',
    accountLabel: 'Account',
    installTipTitle: 'Install the app',
    installTipDesc: 'Install it on your home screen for faster access and an app-like experience.',
    installGuideTitle: 'Install this app',
    installGuideSub: 'Use these two quick steps to install the app on your home screen.',
    installStep1Title: 'Open the Share menu',
    installStep1Desc: 'Tap the Share button in your browser, or click here.',
    installStep2Title: 'Choose Add to Home Screen',
    installStep2Desc: 'In the menu that opens, tap Add to Home Screen, then confirm to install.',
    installOpenShare: 'Open Share Menu',
    installClose: 'Close',
    tipTitle: 'Save your progress',
    tipDesc: 'Sign in from Settings to keep your progress and get smarter quizzes.',
    playAgain: 'Play again', chooseLevel: 'Back Home',
    rwTitle: 'Word Explorer',
    cases: 'Cases (Kasus)', plural: 'Plural',
    presentTense: 'Präsens (Present)', pastSimple: 'Präteritum (Simple Past)', perfekt: 'Perfekt',
    comparatives: 'Komparativ & Superlativ', adjEndings: 'Adjective Endings (Nom.)', examples: 'Examples',
    source: 'Source: Goethe-Institut word list',
    modeIcons: { vocab:'📖' },
    vocabBadge: 'Word Practice',
    meaning: 'Meaning',
    tapPrompt: '👆 Tap any form above to see an example sentence.',
    noExample: 'No example available.',
    quizQuestion: 'What does this word mean?',
    swipeSetupTitle: 'Quick Match',
    swipeSetupSub: '',
    prepareTen: 'Start',
    swipeSubtitle: 'Swipe if the meaning matches',
    swipeMeaningLabel: 'Meaning',
    swipeEmptyTitle: 'Deck finished',
    swipeEmptySub: 'Prepare another batch to continue swiping.',
    swipeToastGoodMatch: 'Correct',
    swipeToastGoodMiss: 'Correct',
    swipeToastBadMatch: 'Wrong',
    swipeToastBadMiss: 'Wrong',
    levelLabel: 'Level',
    wiktSource: 'Source',
    meanings: 'Meanings',
    autoTranslated: 'Auto-translated',
    offlineNote: 'ⓘ Offline data · Wiktionary unreachable',
    aboutBtn: 'ℹ️ About',
    aboutTitle: 'About',
    aboutClose: 'Close',
    aboutP1: 'I built this free mini-game for myself — a simple way to practice German without any paywalls. I wanted it available as a free resource for anyone learning German.',
    aboutP2html: 'Made by <strong>Mehras Hojjat</strong>. Feel free to reach out on <a href="https://linkedin.com/in/mehrashojjat" target="_blank" rel="noopener">LinkedIn</a> or <a href="https://instagram.com/mehrashojjat" target="_blank" rel="noopener">Instagram</a> for feature requests or feedback.',
    aboutP3html: 'Word lists from <strong>Goethe-Institut</strong> · Translations via <strong>MyMemory API</strong> · Open source on <a href="https://github.com/mehrashojjat/deutsch-lernen" target="_blank" rel="noopener">GitHub</a> · Built with <strong>Claude AI</strong>.',
    footerMsg: 'Hey! Built this while learning German myself — hope it helps you too. Completely free 🇩🇪',
    footerCopy: '© 2026 Mehras Hojjat',
    adaptiveBannerTitle: 'Adaptive Quiz',
    adaptiveBannerSub: 'Adjusts to your skill level',
    adaptiveSetupTitle: 'Adaptive Quiz',
    adaptiveSetupSubtitle: 'Adjusts difficulty to your skill level',
    themeBannerTitle: 'Theme Quiz',
    themeBannerSub: 'Quiz yourself on a topic',
    themeSelectTitle: 'Theme Quiz',
    themeSelectSubtitle: 'Pick a topic to practise',
    dictBannerTitle: 'Dictionary',
    dictBannerSub: 'Browse all words A–Z',
    dictScreenTitle: 'Dictionary',
    dictScreenSubtitle: 'All words · A–Z',
    dictBack: '← Back',
    dictFilterPlaceholder: 'Filter words…',
    dictLoading: 'Loading…',
    dictEmpty: 'No words found.',
    typeBadge: { Noun: 'Noun', Verb: 'Verb', Adjective: 'Adjective', Phrase: 'Phrase', Adverb: 'Adverb', Word: 'Word' },
    categoryNames: {1:'Numbers & Quantities',2:'Time & Calendar',3:'Family & Relationships',4:'Body & Health',5:'Food & Drink',6:'Home & Living',7:'Clothing & Appearance',8:'Work & Careers',9:'Education & Learning',10:'Travel & Tourism',11:'Transportation',12:'Shopping & Finance',13:'Language, Communication & Media',14:'Nature, Weather & Animals',15:'Sports & Leisure',16:'Arts & Culture',17:'Technology & Devices',18:'Society, Law & Politics',19:'Emotions & Personal Traits',20:'Places & Geography',21:'Grammar & Function Words'},
  },
  tr: {
    headerSub: 'Kelime Pratiği · Hâller · Fiil Çekimi',
    settingsTitle: 'Ayarlar',
    langLabel: 'Dil',
    closeDone: 'Kapat',
    rwBannerTitle: 'Rastgele Kelime Keşfi',
    rwBannerSub: 'Her kelimenin tüm hâllerini, çekimlerini ve örneklerini gör',
    swipeBannerTitle: 'Hızlı Eşleştirme',
    swipeBannerSub: 'Anlam eşleşiyorsa kaydır',
    selectLevel: 'Seviye Seç',
    levelNames: { A1:'Başlangıç', A2:'Temel', B1:'Orta', B2:'Üst-Orta' },
    cardCount: (n) => n + ' kelime pratiği kartı',
    back: '← Geri',
    next: 'Sonraki →',
    correct: '✓ Doğru!',
    wrong: (a) => `✗ Yanlış. Doğru cevap: <strong>${a}</strong>`,
    resultTitles: { great:'Mükemmel!', good:'Çok iyi!', ok:'Güzel deneme!', low:'Pratik yapmaya devam!' },
    resultSub: (lv,p) => `Seviye ${lv} · %${p} doğru`,
    scoreLbl: 'Puan', correctLbl: 'Doğru', wrongLbl: 'Yanlış',
    accountLabel: 'Hesap',
    tipTitle: 'İlerlemenizi kaydedin',
    tipDesc: 'İlerlemenizi korumak ve daha akıllı quizler almak için Ayarlar\'dan giriş yapın.',
    playAgain: 'Tekrar oyna', chooseLevel: 'Ana Sayfaya Dön',
    rwTitle: 'Kelime Keşfi',
    cases: 'Hâller (Kasus)', plural: 'Çoğul',
    presentTense: 'Präsens (Şimdiki)', pastSimple: 'Präteritum (Geçmiş)', perfekt: 'Perfekt',
    comparatives: 'Karşılaştırma & Üstünlük', adjEndings: 'Sıfat Ekleri (Nom.)', examples: 'Örnekler',
    source: 'Kaynak: Goethe-Enstitüsü kelime listesi',
    modeIcons: { vocab:'📖' },
    vocabBadge: 'Kelime Pratiği',
    meaning: 'Anlam',
    tapPrompt: '👆 Örnek cümle görmek için yukarıdaki bir biçime dokun.',
    noExample: 'Örnek bulunamadı.',
    quizQuestion: 'Bu kelimenin anlamı nedir?',
    swipeSetupTitle: 'Hızlı Eşleştirme',
    swipeSetupSub: '',
    prepareTen: 'Başlat',
    swipeSubtitle: 'Anlam eşleşiyorsa kaydır',
    swipeMeaningLabel: 'Anlam',
    swipeEmptyTitle: 'Kartlar bitti',
    swipeEmptySub: 'Devam etmek için yeni bir seri başlat.',
    swipeToastGoodMatch: 'Doğru',
    swipeToastGoodMiss: 'Doğru',
    swipeToastBadMatch: 'Yanlış',
    swipeToastBadMiss: 'Yanlış',
    levelLabel: 'Seviye',
    wiktSource: 'Kaynak',
    meanings: 'Anlamlar',
    autoTranslated: 'Otomatik çevrildi',
    offlineNote: 'ⓘ Çevrimdışı veri · Wiktionary erişilemiyor',
    aboutBtn: 'ℹ️ Hakkında',
    aboutTitle: 'Hakkında',
    aboutClose: 'Kapat',
    aboutP1: 'Bu ücretsiz mini oyunu kendim için yaptım — Almanca kelime pratiği yapmanın basit bir yolu, ücret ödemeden. Almanca öğrenen herkes için ücretsiz bir kaynak olarak sunmak istedim.',
    aboutP2html: 'Yapımcı: <strong>Mehras Hojjat</strong>. Özellik istekleri veya geri bildirim için <a href="https://linkedin.com/in/mehrashojjat" target="_blank" rel="noopener">LinkedIn</a> ya da <a href="https://instagram.com/mehrashojjat" target="_blank" rel="noopener">Instagram</a>\'dan ulaşabilirsiniz.',
    aboutP3html: 'Kelime listeleri: <strong>Goethe-Institut</strong> · Çeviriler: <strong>MyMemory API</strong> · Açık kaynak: <a href="https://github.com/mehrashojjat/deutsch-lernen" target="_blank" rel="noopener">GitHub</a> · <strong>Claude AI</strong> ile yapıldı.',
    footerMsg: 'Merhaba! Bunu Almanca öğrenirken kendim için yaptım — umarım sana da yardımcı olur. Tamamen ücretsiz 🇩🇪',
    footerCopy: '© 2026 Mehras Hojjat',
    adaptiveBannerTitle: 'Uyarlamalı Sınav',
    adaptiveBannerSub: 'Seviyenize göre ayarlanır',
    adaptiveSetupTitle: 'Uyarlamalı Sınav',
    adaptiveSetupSubtitle: 'Zorluk seviyenize göre ayarlanır',
    themeBannerTitle: 'Konu Sınavı',
    themeBannerSub: 'Bir konuyu seçerek test edin',
    themeSelectTitle: 'Konu Sınavı',
    themeSelectSubtitle: 'Çalışmak istediğiniz konuyu seçin',
    dictBannerTitle: 'Sözlük',
    dictBannerSub: 'Tüm kelimelere A–Z göz at',
    dictScreenTitle: 'Sözlük',
    dictScreenSubtitle: 'Tüm kelimeler · A–Z',
    dictBack: '← Geri',
    dictFilterPlaceholder: 'Kelime ara…',
    dictLoading: 'Yükleniyor…',
    dictEmpty: 'Kelime bulunamadı.',
    typeBadge: { Noun: 'İsim', Verb: 'Fiil', Adjective: 'Sıfat', Phrase: 'Deyim', Adverb: 'Zarf', Word: 'Kelime' },
    categoryNames: {1:'Sayılar ve Miktarlar',2:'Zaman ve Takvim',3:'Aile ve İlişkiler',4:'Vücut ve Sağlık',5:'Yiyecek ve İçecek',6:'Ev ve Yaşam',7:'Giyim ve Görünüm',8:'İş ve Kariyer',9:'Eğitim ve Öğrenim',10:'Seyahat ve Turizm',11:'Ulaşım',12:'Alışveriş ve Finans',13:'Dil, İletişim ve Medya',14:'Doğa, Hava ve Hayvanlar',15:'Spor ve Boş Zaman',16:'Sanat ve Kültür',17:'Teknoloji ve Cihazlar',18:'Toplum, Hukuk ve Siyaset',19:'Duygular ve Kişilik Özellikleri',20:'Yerler ve Coğrafya',21:'Dilbilgisi ve İşlev Sözcükleri'},
  },
  fa: {
    headerSub: 'تمرین واژگان · حالت‌ها · صرف فعل',
    settingsTitle: 'تنظیمات',
    langLabel: 'زبان',
    closeDone: 'بستن',
    rwBannerTitle: 'کاوشگر واژه تصادفی',
    rwBannerSub: 'هر واژه را با تمام حالت‌ها، صرف‌ها و مثال‌هایش ببین',
    swipeBannerTitle: 'تطبیق سریع',
    swipeBannerSub: 'اگر معنی درست است، بکش',
    selectLevel: 'انتخاب سطح',
    levelNames: { A1:'مبتدی', A2:'پایه', B1:'متوسط', B2:'بالاتر از متوسط' },
    cardCount: (n) => n + ' کارت تمرین واژگان',
    back: '→ بازگشت',
    next: 'بعدی ←',
    correct: '✓ درست!',
    wrong: (a) => `✗ اشتباه. جواب درست: <strong>${a}</strong>`,
    resultTitles: { great:'عالی!', good:'خیلی خوب!', ok:'تلاش خوبی بود!', low:'به تمرین ادامه بده!' },
    resultSub: (lv,p) => `سطح ${lv} · ${p}٪ درست`,
    scoreLbl: 'امتیاز', correctLbl: 'درست', wrongLbl: 'اشتباه',
    accountLabel: 'حساب کاربری',
    tipTitle: 'پیشرفت خود را ذخیره کنید',
    tipDesc: 'برای حفظ پیشرفت و دریافت آزمون‌های هوشمندتر از طریق تنظیمات وارد شوید.',
    playAgain: 'دوباره بازی کن', chooseLevel: 'بازگشت به خانه',
    rwTitle: 'کاوشگر واژه',
    cases: 'حالت‌ها (Kasus)', plural: 'جمع',
    presentTense: 'Präsens (حال)', pastSimple: 'Präteritum (گذشته ساده)', perfekt: 'Perfekt',
    comparatives: 'تفضیلی و عالی', adjEndings: 'پسوندهای صفت (Nom.)', examples: 'مثال‌ها',
    source: 'منبع: فهرست واژگان مؤسسه گوته',
    modeIcons: { vocab:'📖' },
    vocabBadge: 'تمرین واژگان',
    meaning: 'معنی',
    tapPrompt: '👆 برای مشاهده جمله نمونه روی یک شکل بالا ضربه بزنید.',
    noExample: 'نمونه‌ای موجود نیست.',
    quizQuestion: 'این کلمه چه معنایی دارد؟',
    swipeSetupTitle: 'تطبیق سریع',
    swipeSetupSub: '',
    prepareTen: 'شروع',
    swipeSubtitle: 'اگر معنی درست است، بکش',
    swipeMeaningLabel: 'معنی',
    swipeEmptyTitle: 'کارت‌ها تمام شد',
    swipeEmptySub: 'برای ادامه یک دسته جدید شروع کنید.',
    swipeToastGoodMatch: 'درست',
    swipeToastGoodMiss: 'درست',
    swipeToastBadMatch: 'اشتباه',
    swipeToastBadMiss: 'اشتباه',
    levelLabel: 'سطح',
    wiktSource: 'منبع',
    meanings: 'معانی',
    autoTranslated: 'ترجمه خودکار',
    offlineNote: 'ⓘ داده آفلاین · Wiktionary در دسترس نیست',
    aboutBtn: 'ℹ️ درباره',
    aboutTitle: 'درباره',
    aboutClose: 'بستن',
    aboutP1: 'این بازی رایگان کوچک را برای خودم ساختم — روشی ساده برای تمرین واژگان آلمانی بدون هیچ هزینه‌ای. می‌خواستم برای هر کسی که آلمانی می‌آموزد در دسترس باشد.',
    aboutP2html: 'ساخته <strong>Mehras Hojjat</strong>. برای درخواست ویژگی یا بازخورد از طریق <a href="https://linkedin.com/in/mehrashojjat" target="_blank" rel="noopener">LinkedIn</a> یا <a href="https://instagram.com/mehrashojjat" target="_blank" rel="noopener">Instagram</a> در تماس باشید.',
    aboutP3html: 'فهرست واژگان: <strong>Goethe-Institut</strong> · ترجمه‌ها: <strong>MyMemory API</strong> · متن‌باز در <a href="https://github.com/mehrashojjat/deutsch-lernen" target="_blank" rel="noopener">GitHub</a> · ساخته شده با <strong>Claude AI</strong>.',
    footerMsg: 'سلام! این بازی رو برای یادگیری آلمانی خودم ساختم — امیدوارم به تو هم کمک کنه. کاملاً رایگان 🇩🇪',
    footerCopy: '© ۲۰۲۶ Mehras Hojjat',
    adaptiveBannerTitle: 'آزمون تطبیقی',
    adaptiveBannerSub: 'سطح شما را تشخیص می‌دهد',
    adaptiveSetupTitle: 'آزمون تطبیقی',
    adaptiveSetupSubtitle: 'دشواری بر اساس سطح شما تنظیم می‌شود',
    themeBannerTitle: 'آزمون موضوعی',
    themeBannerSub: 'یک موضوع انتخاب کنید',
    themeSelectTitle: 'آزمون موضوعی',
    themeSelectSubtitle: 'موضوع مورد نظر را انتخاب کنید',
    dictBannerTitle: 'واژه‌نامه',
    dictBannerSub: 'مرور تمام واژه‌ها از الف تا ی',
    dictScreenTitle: 'واژه‌نامه',
    dictScreenSubtitle: 'همه واژه‌ها · A–Z',
    dictBack: '→ بازگشت',
    dictFilterPlaceholder: 'جستجوی واژه…',
    dictLoading: 'در حال بارگذاری…',
    dictEmpty: 'واژه‌ای یافت نشد.',
    typeBadge: { Noun: 'اسم', Verb: 'فعل', Adjective: 'صفت', Phrase: 'عبارت', Adverb: 'قید', Word: 'کلمه' },
    categoryNames: {1:'اعداد و مقادیر',2:'زمان و تقویم',3:'خانواده و روابط',4:'بدن و سلامتی',5:'غذا و نوشیدنی',6:'خانه و زندگی',7:'پوشاک و ظاهر',8:'کار و مشاغل',9:'آموزش و یادگیری',10:'سفر و گردشگری',11:'حمل‌ونقل',12:'خرید و امور مالی',13:'زبان، ارتباطات و رسانه',14:'طبیعت، آب‌وهوا و حیوانات',15:'ورزش و اوقات فراغت',16:'هنر و فرهنگ',17:'فناوری و دستگاه‌ها',18:'جامعه، قانون و سیاست',19:'احساسات و ویژگی‌های شخصیتی',20:'مکان‌ها و جغرافیا',21:'دستور زبان و کلمات ربط'},
  },
  ru: {
    headerSub: 'Практика слов · Падежи · Спряжение',
    settingsTitle: 'Настройки',
    langLabel: 'Язык',
    closeDone: 'Закрыть',
    rwBannerTitle: 'Исследователь случайных слов',
    rwBannerSub: 'Смотри любое слово со всеми формами, падежами и примерами',
    swipeBannerTitle: 'Быстрое совпадение',
    swipeBannerSub: 'Смахни, если значение подходит',
    selectLevel: 'Выбрать уровень',
    levelNames: { A1:'Начальный', A2:'Элементарный', B1:'Средний', B2:'Выше среднего' },
    cardCount: (n) => n + ' карточек практики слов',
    back: '← Назад',
    next: 'Далее →',
    correct: '✓ Правильно!',
    wrong: (a) => `✗ Неверно. Правильный ответ: <strong>${a}</strong>`,
    resultTitles: { great:'Отлично!', good:'Хорошо!', ok:'Неплохая попытка!', low:'Продолжай практиковаться!' },
    resultSub: (lv,p) => `Уровень ${lv} · ${p}% правильно`,
    scoreLbl: 'Счёт', correctLbl: 'Правильно', wrongLbl: 'Неверно',
    accountLabel: 'Аккаунт',
    tipTitle: 'Сохраните прогресс',
    tipDesc: 'Войдите через Настройки, чтобы сохранить прогресс и получать более умные тесты.',
    playAgain: 'Играть снова', chooseLevel: 'На главную',
    rwTitle: 'Исследователь слов',
    cases: 'Падежи (Kasus)', plural: 'Множественное число',
    presentTense: 'Präsens (Настоящее)', pastSimple: 'Präteritum (Прошедшее)', perfekt: 'Perfekt',
    comparatives: 'Сравнительная и превосходная степень', adjEndings: 'Окончания прилагательных (Nom.)', examples: 'Примеры',
    source: 'Источник: список слов института Гёте',
    modeIcons: { vocab:'📖' },
    vocabBadge: 'Практика слов',
    meaning: 'Значение',
    tapPrompt: '👆 Нажмите на форму выше, чтобы увидеть пример предложения.',
    noExample: 'Пример отсутствует.',
    quizQuestion: 'Что означает это слово?',
    swipeSetupTitle: 'Быстрое совпадение',
    swipeSetupSub: '',
    prepareTen: 'Старт',
    swipeSubtitle: 'Смахни, если значение подходит',
    swipeMeaningLabel: 'Значение',
    swipeEmptyTitle: 'Колода закончилась',
    swipeEmptySub: 'Запусти новую серию, чтобы продолжить.',
    swipeToastGoodMatch: 'Верно',
    swipeToastGoodMiss: 'Верно',
    swipeToastBadMatch: 'Неверно',
    swipeToastBadMiss: 'Неверно',
    levelLabel: 'Уровень',
    wiktSource: 'Источник',
    meanings: 'Значения',
    autoTranslated: 'Авто-перевод',
    offlineNote: 'ⓘ Офлайн данные · Wiktionary недоступен',
    aboutBtn: 'ℹ️ О приложении',
    aboutTitle: 'О приложении',
    aboutClose: 'Закрыть',
    aboutP1: 'Я создал эту бесплатную мини-игру для себя — простой способ практиковать немецкую лексику без платных подписок. Хотел сделать её доступной бесплатно для всех, кто учит немецкий.',
    aboutP2html: 'Автор: <strong>Mehras Hojjat</strong>. Для запросов функций или обратной связи пишите в <a href="https://linkedin.com/in/mehrashojjat" target="_blank" rel="noopener">LinkedIn</a> или <a href="https://instagram.com/mehrashojjat" target="_blank" rel="noopener">Instagram</a>.',
    aboutP3html: 'Списки слов: <strong>Goethe-Institut</strong> · Переводы: <strong>MyMemory API</strong> · Открытый код: <a href="https://github.com/mehrashojjat/deutsch-lernen" target="_blank" rel="noopener">GitHub</a> · Создано с <strong>Claude AI</strong>.',
    footerMsg: 'Привет! Сделал это для своего изучения немецкого — надеюсь, поможет и тебе. Полностью бесплатно 🇩🇪',
    footerCopy: '© 2026 Mehras Hojjat',
    adaptiveBannerTitle: 'Адаптивная викторина',
    adaptiveBannerSub: 'Адаптируется к вашему уровню',
    adaptiveSetupTitle: 'Адаптивная викторина',
    adaptiveSetupSubtitle: 'Сложность адаптируется к вашему уровню',
    themeBannerTitle: 'Тематическая викторина',
    themeBannerSub: 'Выберите тему для тренировки',
    themeSelectTitle: 'Тематическая викторина',
    themeSelectSubtitle: 'Выберите тему',
    dictBannerTitle: 'Словарь',
    dictBannerSub: 'Все слова от A до Z',
    dictScreenTitle: 'Словарь',
    dictScreenSubtitle: 'Все слова · A–Z',
    dictLoading: 'Загрузка…',
    dictEmpty: 'Слова не найдены.',
    typeBadge: { Noun: 'Существительное', Verb: 'Глагол', Adjective: 'Прилагательное', Phrase: 'Фраза', Adverb: 'Наречие', Word: 'Слово' },
    categoryNames: {1:'Числа и количества',2:'Время и календарь',3:'Семья и отношения',4:'Тело и здоровье',5:'Еда и напитки',6:'Дом и быт',7:'Одежда и внешность',8:'Работа и карьера',9:'Образование и обучение',10:'Путешествия и туризм',11:'Транспорт',12:'Покупки и финансы',13:'Язык, общение и СМИ',14:'Природа, погода и животные',15:'Спорт и досуг',16:'Искусство и культура',17:'Технологии и устройства',18:'Общество, право и политика',19:'Эмоции и черты характера',20:'Места и география',21:'Грамматика и служебные слова'},
  },
  uk: {
    headerSub: 'Практика слів · Відмінки · Відмінювання',
    settingsTitle: 'Налаштування',
    langLabel: 'Мова',
    closeDone: 'Закрити',
    rwBannerTitle: 'Дослідник випадкових слів',
    rwBannerSub: 'Переглядай будь-яке слово з усіма формами, відмінками та прикладами',
    swipeBannerTitle: 'Швидке зіставлення',
    swipeBannerSub: 'Свайпни, якщо значення підходить',
    selectLevel: 'Обрати рівень',
    levelNames: { A1:'Початківець', A2:'Елементарний', B1:'Середній', B2:'Вище середнього' },
    cardCount: (n) => n + ' карток практики слів',
    back: '← Назад',
    next: 'Далі →',
    correct: '✓ Правильно!',
    wrong: (a) => `✗ Неправильно. Правильна відповідь: <strong>${a}</strong>`,
    resultTitles: { great:'Відмінно!', good:'Молодець!', ok:'Непогана спроба!', low:'Продовжуй практикуватись!' },
    resultSub: (lv,p) => `Рівень ${lv} · ${p}% правильно`,
    scoreLbl: 'Рахунок', correctLbl: 'Правильно', wrongLbl: 'Неправильно',
    accountLabel: 'Акаунт',
    tipTitle: 'Збережіть прогрес',
    tipDesc: 'Увійдіть через Налаштування, щоб зберегти прогрес і отримувати розумніші тести.',
    playAgain: 'Грати знову', chooseLevel: 'На головну',
    rwTitle: 'Дослідник слів',
    cases: 'Відмінки (Kasus)', plural: 'Множина',
    presentTense: 'Präsens (Теперішній)', pastSimple: 'Präteritum (Минулий)', perfekt: 'Perfekt',
    comparatives: 'Вищий і найвищий ступінь', adjEndings: 'Закінчення прикметників (Nom.)', examples: 'Приклади',
    source: 'Джерело: список слів інституту Гете',
    modeIcons: { vocab:'📖' },
    vocabBadge: 'Практика слів',
    meaning: 'Значення',
    tapPrompt: '👆 Натисніть на форму вище, щоб побачити приклад речення.',
    noExample: 'Приклад відсутній.',
    quizQuestion: 'Що означає це слово?',
    swipeSetupTitle: 'Швидке зіставлення',
    swipeSetupSub: '',
    prepareTen: 'Старт',
    swipeSubtitle: 'Свайпни, якщо значення підходить',
    swipeMeaningLabel: 'Значення',
    swipeEmptyTitle: 'Колода закінчилась',
    swipeEmptySub: 'Запусти нову серію, щоб продовжити.',
    swipeToastGoodMatch: 'Правильно',
    swipeToastGoodMiss: 'Правильно',
    swipeToastBadMatch: 'Неправильно',
    swipeToastBadMiss: 'Неправильно',
    levelLabel: 'Рівень',
    wiktSource: 'Джерело',
    meanings: 'Значення',
    autoTranslated: 'Авто-переклад',
    offlineNote: 'ⓘ Офлайн дані · Wiktionary недоступний',
    aboutBtn: 'ℹ️ Про додаток',
    aboutTitle: 'Про додаток',
    aboutClose: 'Закрити',
    aboutP1: 'Я створив цю безкоштовну міні-гру для себе — простий спосіб практикувати німецьку лексику без будь-яких платежів. Хотів зробити її доступною безкоштовно для всіх, хто вивчає німецьку.',
    aboutP2html: 'Автор: <strong>Mehras Hojjat</strong>. Для запитів щодо функцій або відгуків пишіть у <a href="https://linkedin.com/in/mehrashojjat" target="_blank" rel="noopener">LinkedIn</a> або <a href="https://instagram.com/mehrashojjat" target="_blank" rel="noopener">Instagram</a>.',
    aboutP3html: 'Списки слів: <strong>Goethe-Institut</strong> · Переклади: <strong>MyMemory API</strong> · Відкритий код: <a href="https://github.com/mehrashojjat/deutsch-lernen" target="_blank" rel="noopener">GitHub</a> · Створено з <strong>Claude AI</strong>.',
    footerMsg: 'Привіт! Зробив це для вивчення німецької — сподіваюся, допоможе і тобі. Повністю безкоштовно 🇩🇪',
    footerCopy: '© 2026 Mehras Hojjat',
    adaptiveBannerTitle: 'Адаптивна вікторина',
    adaptiveBannerSub: 'Адаптується до вашого рівня',
    adaptiveSetupTitle: 'Адаптивна вікторина',
    adaptiveSetupSubtitle: 'Складність адаптується до вашого рівня',
    themeBannerTitle: 'Тематична вікторина',
    themeBannerSub: 'Виберіть тему для практики',
    themeSelectTitle: 'Тематична вікторина',
    themeSelectSubtitle: 'Виберіть тему',
    dictBannerTitle: 'Словник',
    dictBannerSub: 'Усі слова від A до Z',
    dictScreenTitle: 'Словник',
    dictScreenSubtitle: 'Усі слова · A–Z',
    dictLoading: 'Завантаження…',
    dictEmpty: 'Слова не знайдено.',
    typeBadge: { Noun: 'Іменник', Verb: 'Дієслово', Adjective: 'Прикметник', Phrase: 'Фраза', Adverb: 'Прислівник', Word: 'Слово' },
    categoryNames: {1:'Числа та кількості',2:'Час і календар',3:'Сім\'я та стосунки',4:'Тіло та здоров\'я',5:'Їжа та напої',6:'Дім та побут',7:'Одяг та зовнішність',8:'Робота та кар\'єра',9:'Освіта та навчання',10:'Подорожі та туризм',11:'Транспорт',12:'Покупки та фінанси',13:'Мова, спілкування та ЗМІ',14:'Природа, погода та тварини',15:'Спорт та дозвілля',16:'Мистецтво та культура',17:'Технології та пристрої',18:'Суспільство, право та політика',19:'Емоції та риси характеру',20:'Місця та географія',21:'Граматика та службові слова'},
  },
  ar: {
    headerSub: 'تدريب المفردات · الحالات · تصريف الأفعال',
    settingsTitle: 'الإعدادات',
    langLabel: 'اللغة',
    closeDone: 'إغلاق',
    rwBannerTitle: 'مستكشف الكلمات العشوائي',
    rwBannerSub: 'اعرض أي كلمة بجميع أشكالها وحالاتها وأمثلتها',
    swipeBannerTitle: 'مطابقة سريعة',
    swipeBannerSub: 'اسحب إذا كان المعنى صحيحاً',
    selectLevel: 'اختر المستوى',
    levelNames: { A1:'مبتدئ', A2:'أساسي', B1:'متوسط', B2:'فوق المتوسط' },
    cardCount: (n) => n + ' بطاقة تدريب مفردات',
    back: '→ رجوع',
    next: '← التالي',
    correct: '✓ صحيح!',
    wrong: (a) => `✗ خطأ. الإجابة الصحيحة: <strong>${a}</strong>`,
    resultTitles: { great:'ممتاز!', good:'أحسنت!', ok:'محاولة جيدة!', low:'واصل التدريب!' },
    resultSub: (lv,p) => `المستوى ${lv} · ${p}% صحيح`,
    scoreLbl: 'النقاط', correctLbl: 'صحيح', wrongLbl: 'خطأ',
    accountLabel: 'الحساب',
    tipTitle: 'احفظ تقدمك',
    tipDesc: 'سجّل الدخول من الإعدادات للحفاظ على تقدمك والحصول على اختبارات أذكى.',
    playAgain: 'العب مرة أخرى', chooseLevel: 'العودة للرئيسية',
    rwTitle: 'مستكشف الكلمات',
    cases: 'الحالات (Kasus)', plural: 'الجمع',
    presentTense: 'Präsens (المضارع)', pastSimple: 'Präteritum (الماضي البسيط)', perfekt: 'Perfekt',
    comparatives: 'المقارنة والتفضيل', adjEndings: 'لواحق الصفات (Nom.)', examples: 'أمثلة',
    source: 'المصدر: قائمة مفردات معهد غوته',
    modeIcons: { vocab:'📖' },
    vocabBadge: 'تدريب المفردات',
    meaning: 'المعنى',
    tapPrompt: '👆 اضغط على أي شكل أعلاه لرؤية جملة مثال.',
    noExample: 'لا يوجد مثال.',
    quizQuestion: 'ما معنى هذه الكلمة؟',
    swipeSetupTitle: 'مطابقة سريعة',
    swipeSetupSub: '',
    prepareTen: 'ابدأ',
    swipeSubtitle: 'اسحب إذا كان المعنى صحيحاً',
    swipeMeaningLabel: 'المعنى',
    swipeEmptyTitle: 'انتهت البطاقات',
    swipeEmptySub: 'ابدأ مجموعة جديدة للمتابعة.',
    swipeToastGoodMatch: 'صحيح',
    swipeToastGoodMiss: 'صحيح',
    swipeToastBadMatch: 'خطأ',
    swipeToastBadMiss: 'خطأ',
    levelLabel: 'المستوى',
    wiktSource: 'المصدر',
    meanings: 'المعاني',
    autoTranslated: 'ترجمة تلقائية',
    offlineNote: 'ⓘ بيانات غير متصلة · Wiktionary غير متاح',
    aboutBtn: 'ℹ️ حول التطبيق',
    aboutTitle: 'حول التطبيق',
    aboutClose: 'إغلاق',
    aboutP1: 'صنعت هذه اللعبة المجانية الصغيرة لنفسي — طريقة بسيطة لتدريب المفردات الألمانية دون أي رسوم. أردت أن تكون متاحة كمورد مجاني لأي شخص يتعلم الألمانية.',
    aboutP2html: 'صنعه <strong>Mehras Hojjat</strong>. للتواصل بشأن طلبات الميزات أو الملاحظات عبر <a href="https://linkedin.com/in/mehrashojjat" target="_blank" rel="noopener">LinkedIn</a> أو <a href="https://instagram.com/mehrashojjat" target="_blank" rel="noopener">Instagram</a>.',
    aboutP3html: 'قوائم الكلمات: <strong>Goethe-Institut</strong> · الترجمات: <strong>MyMemory API</strong> · مفتوح المصدر: <a href="https://github.com/mehrashojjat/deutsch-lernen" target="_blank" rel="noopener">GitHub</a> · مبني بـ <strong>Claude AI</strong>.',
    footerMsg: 'مرحباً! صنعت هذا لتعلم الألمانية بنفسي — أتمنى أن يفيدك أيضاً. مجاني تماماً 🇩🇪',
    footerCopy: '© 2026 Mehras Hojjat',
    adaptiveBannerTitle: 'اختبار تكيّفي',
    adaptiveBannerSub: 'يتكيّف مع مستواك',
    adaptiveSetupTitle: 'اختبار تكيّفي',
    adaptiveSetupSubtitle: 'تتكيّف الصعوبة مع مستواك',
    themeBannerTitle: 'اختبار موضوعي',
    themeBannerSub: 'اختبر نفسك في موضوع محدد',
    themeSelectTitle: 'اختبار موضوعي',
    themeSelectSubtitle: 'اختر موضوعاً للتدرّب عليه',
    dictBannerTitle: 'القاموس',
    dictBannerSub: 'تصفح جميع الكلمات من A إلى Z',
    dictScreenTitle: 'القاموس',
    dictScreenSubtitle: 'جميع الكلمات · A–Z',
    dictBack: '→ رجوع',
    dictFilterPlaceholder: 'ابحث عن كلمة…',
    dictLoading: 'جارٍ التحميل…',
    dictEmpty: 'لا توجد كلمات.',
    typeBadge: { Noun: 'اسم', Verb: 'فعل', Adjective: 'صفة', Phrase: 'عبارة', Adverb: 'ظرف', Word: 'كلمة' },
    categoryNames: {1:'الأعداد والكميات',2:'الوقت والتقويم',3:'العائلة والعلاقات',4:'الجسم والصحة',5:'الطعام والشراب',6:'المنزل والمعيشة',7:'الملابس والمظهر',8:'العمل والمهن',9:'التعليم والتعلم',10:'السفر والسياحة',11:'المواصلات',12:'التسوق والمال',13:'اللغة والتواصل والإعلام',14:'الطبيعة والطقس والحيوانات',15:'الرياضة وأوقات الفراغ',16:'الفنون والثقافة',17:'التكنولوجيا والأجهزة',18:'المجتمع والقانون والسياسة',19:'المشاعر وسمات الشخصية',20:'الأماكن والجغرافيا',21:'قواعد اللغة والكلمات الوظيفية'},
  }
};

// ════════════════════════════════════════════════════════════════
//  CATEGORY MAP — 21 vocabulary categories, ID 1–21
// ════════════════════════════════════════════════════════════════
var CATEGORY_MAP = [
  { id:  1, name: 'Numbers & Quantities',           icon: '🔢' },
  { id:  2, name: 'Time & Calendar',                icon: '🕐' },
  { id:  3, name: 'Family & Relationships',         icon: '👨‍👩‍👧' },
  { id:  4, name: 'Body & Health',                  icon: '🏥' },
  { id:  5, name: 'Food & Drink',                   icon: '🍽️' },
  { id:  6, name: 'Home & Living',                  icon: '🏠' },
  { id:  7, name: 'Clothing & Appearance',          icon: '👗' },
  { id:  8, name: 'Work & Careers',                 icon: '💼' },
  { id:  9, name: 'Education & Learning',           icon: '📚' },
  { id: 10, name: 'Travel & Tourism',               icon: '✈️' },
  { id: 11, name: 'Transportation',                 icon: '🚗' },
  { id: 12, name: 'Shopping & Finance',             icon: '🛍️' },
  { id: 13, name: 'Language, Communication & Media', icon: '💬' },
  { id: 14, name: 'Nature, Weather & Animals',      icon: '🌿' },
  { id: 15, name: 'Sports & Leisure',               icon: '⚽' },
  { id: 16, name: 'Arts & Culture',                 icon: '🎨' },
  { id: 17, name: 'Technology & Devices',           icon: '💻' },
  { id: 18, name: 'Society, Law & Politics',        icon: '⚖️' },
  { id: 19, name: 'Emotions & Personal Traits',     icon: '❤️' },
  { id: 20, name: 'Places & Geography',             icon: '🗺️' },
  { id: 21, name: 'Grammar & Function Words',       icon: '📝' },
];


// ══════════════════════════════════════════════════════════════════
//  APP STATE
// ══════════════════════════════════════════════════════════════════
let LANG = (function() { try { return localStorage.getItem('dl_lang') || 'en'; } catch(e) { return 'en'; } })();
let currentLevel = null, queue = [], idx = 0, ok = 0, no = 0, answered = false;
const QUIZ_LEN = 10;
let swipeSelectedLevel = 'A1', swipeDeck = [], swipeIdx = 0, swipeGood = 0, swipeBad = 0;
let swipePreloadPromise = null, swipeAnimating = false;
var adaptiveSelectedLevel = 'A1';
var currentThemeCategoryId = 0; // non-zero while a theme quiz is active
var _quizReturnScreen = 'screen-levels'; // screen to return to when hitting ← Back from quiz
var _deferredInstallPrompt = null;
var _installPromptReady = false;
var _installDismissed = false;
var _installStateMedia = null;
var _isStandaloneMode = false;
var _installGuideCloseTimer = null;
var _installExperienceInitialized = false;
var _installShareActionsBound = false;

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

// ── Settings drawer ──
function openSettings() {
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('settings-drawer').classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent iOS pull-to-refresh
}
function closeSettings() {
  document.getElementById('drawer-overlay').classList.remove('open');
  var _dr = document.getElementById('settings-drawer');
  _dr.classList.remove('open');
  // Reset any drag-offset so the next open() starts clean
  _dr.style.transition = '';
  _dr.style.transform = '';
  document.body.style.overflow = ''; // restore scroll
}
function openAbout() {
  document.getElementById('about-modal-overlay').classList.add('open');
}
function closeAbout(e) {
  if (e && e.target !== document.getElementById('about-modal-overlay')) return;
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
function closeInstallGuide(e) {
  if (e && e.target !== document.getElementById('install-guide-overlay')) return;
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

// ── Set language ──
function setLang(lang) {
  LANG = lang;
  try { localStorage.setItem('dl_lang', lang); } catch(e) {}
  ['en','tr','fa','ru','uk','ar'].forEach(function(l) {
    document.getElementById('opt-'+l).classList.toggle('active', lang===l);
  });
  var isRtl = lang==='fa' || lang==='ar';
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  document.body.classList.toggle('lang-fa', lang==='fa');
  document.body.classList.toggle('lang-ar', lang==='ar');
  document.body.classList.toggle('lang-rtl', isRtl);
  applyTranslations();
  updateCounts();
  // Immediately update the active screen so the user sees the new language at once
  if (!document.getElementById('screen-quiz').classList.contains('hidden')) {
    _quizRefreshLang();
  } else if (!document.getElementById('screen-swipe').classList.contains('hidden')) {
    _swipeRefreshLang();
  } else if (!document.getElementById('screen-random').classList.contains('hidden')) {
    _explorerRefreshLang();
  } else if (!document.getElementById('screen-theme-select').classList.contains('hidden')) {
    _renderCategoryGrid();
  } else if (!document.getElementById('screen-dictionary').classList.contains('hidden')) {
    if (_dictLoaded) _renderDictList(document.getElementById('dict-search-input').value, true);
  }
}

// ── Apply all UI translations ──
function applyTranslations() {
  const u = new Proxy(UI[LANG], { get: function(obj, prop) { return obj[prop] !== undefined ? obj[prop] : UI.en[prop]; } });
  document.getElementById('header-sub').textContent = u.headerSub;
  document.getElementById('st-title').textContent = u.settingsTitle;
  document.getElementById('st-lang-label').textContent = u.langLabel;
  document.getElementById('st-close-btn').textContent = u.closeDone;
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
  // Quiz buttons
  document.getElementById('quiz-back-btn').textContent = u.back;
  document.getElementById('rw-back-btn').textContent = u.back;
  document.getElementById('swipe-setup-back-btn').textContent = u.back;
  document.getElementById('swipe-back-btn').textContent = u.back;
  document.getElementById('rw-screen-title').textContent = u.rwTitle;
  document.getElementById('swipe-setup-screen-title').textContent = u.swipeSetupTitle;
  document.getElementById('swipe-setup-screen-subtitle').textContent = u.swipeSubtitle;
  document.getElementById('swipe-setup-title').textContent = u.swipeSetupTitle;
  document.getElementById('swipe-setup-sub').textContent = u.swipeSetupSub;
  document.getElementById('swipe-prepare-btn').textContent = u.prepareTen;
  document.getElementById('swipe-title').textContent = u.swipeSetupTitle;
  document.getElementById('swipe-subtitle').textContent = u.swipeSubtitle;
  // Account section label & adaptive tip
  document.getElementById('st-account-label').textContent = u.accountLabel;
  document.getElementById('install-tip-title').textContent = u.installTipTitle;
  document.getElementById('install-tip-desc').textContent = u.installTipDesc;
  document.getElementById('install-guide-title').textContent = u.installGuideTitle;
  document.getElementById('install-step1-title').textContent = u.installStep1Title;
  document.getElementById('install-step2-title').textContent = u.installStep2Title;
  document.getElementById('install-share-btn').textContent = u.installOpenShare;
  document.getElementById('install-guide-dismiss-btn').textContent = u.installClose;
  document.getElementById('at-title').textContent = u.tipTitle;
  document.getElementById('at-desc').textContent = u.tipDesc;
  // About & footer
  document.getElementById('st-about-btn').textContent = u.aboutBtn;
  document.getElementById('about-title').textContent = u.aboutTitle;
  document.getElementById('about-p1').textContent = u.aboutP1;
  document.getElementById('about-p2').innerHTML = u.aboutP2html;
  document.getElementById('about-p3').innerHTML = u.aboutP3html;
  document.getElementById('about-close-btn').textContent = u.aboutClose;
  document.getElementById('footer-msg').textContent = u.footerMsg;
  document.getElementById('footer-copy').textContent = u.footerCopy;
  // New banner titles
  document.getElementById('adaptive-banner-title').textContent = u.adaptiveBannerTitle;
  document.getElementById('adaptive-banner-sub').textContent = u.adaptiveBannerSub;
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
  document.getElementById('adaptive-setup-back-btn').textContent = u.back;
  // Theme select screen
  document.getElementById('theme-screen-title').textContent = u.themeSelectTitle;
  document.getElementById('theme-screen-subtitle').textContent = u.themeSelectSubtitle;
  document.getElementById('theme-back-btn').textContent = u.back;
  // Dictionary screen
  document.getElementById('dict-banner-title').textContent = u.dictBannerTitle;
  document.getElementById('dict-banner-sub').textContent = u.dictBannerSub;
  document.getElementById('dict-back-btn').textContent = u.dictBack;
  document.getElementById('dict-screen-title').textContent = u.dictScreenTitle;
  if (!_dictLoaded) document.getElementById('dict-screen-subtitle').textContent = u.dictScreenSubtitle;
  document.getElementById('dict-search-input').placeholder = u.dictFilterPlaceholder;
  var _dlt = document.getElementById('dict-loading-text');
  if (_dlt) _dlt.textContent = u.dictLoading;
  // Refresh meanings immediately if dictionary is open
  if (_dictLoaded && !document.getElementById('screen-dictionary').classList.contains('hidden')) {
    _renderDictList(document.getElementById('dict-search-input').value, true);
  }
  _refreshInstallGuideContent();
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

function _isIosSafariInstallable() {
  var ua = window.navigator.userAgent || '';
  return _isIosVisitor() &&
    /Safari/i.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|YaBrowser/i.test(ua);
}

function _detectStandaloneMode() {
  var mq = window.matchMedia ? window.matchMedia('(display-mode: standalone)') : null;
  return !!((mq && mq.matches) || window.navigator.standalone);
}

function _installGuideText(key) {
  var copy = {
    en: {
      guideSub: 'Use your browser\'s Share menu to add the app to your home screen.',
      step1Lead: 'Tap the ',
      step1Tail: ' Share button in your browser.',
      step2Safari: 'In the menu that opens, tap Add to Home Screen, then confirm to install.',
      step2Other: 'If you see Add to Home Screen, tap it. If you do not, open this page in Safari and use Safari\'s Share menu instead.'
    },
    tr: {
      guideSub: 'Uygulamayi ana ekraniniza eklemek için tarayicinizin Paylas menüsünü kullanin.',
      step1Lead: 'Tarayicinizdaki ',
      step1Tail: ' Paylas dügmesine dokunun.',
      step2Safari: 'Acilan menüden Ana Ekrana Ekle\'ye dokunun ve kurulumu onaylayin.',
      step2Other: 'Ana Ekrana Ekle seçenegini görürseniz ona dokunun. Görmüyorsaniz bu sayfayi Safari\'de açip Safari\'nin Paylas menüsünü kullanin.'
    },
    fa: {
      guideSub: 'برای افزودن برنامه به صفحه اصلی، از منوی اشتراک گذاری مرورگر خود استفاده کنید.',
      step1Lead: 'روی دکمه ',
      step1Tail: ' اشتراک گذاری در مرورگر خود بزنید.',
      step2Safari: 'در منوی بازشده، Add to Home Screen را بزنید و نصب را تایید کنید.',
      step2Other: 'اگر Add to Home Screen را می‌بینید، آن را بزنید. اگر نمی‌بینید، این صفحه را در Safari باز کنید و از منوی اشتراک گذاری Safari استفاده کنید.'
    },
    ru: {
      guideSub: 'Используйте меню Поделиться в вашем браузере, чтобы добавить приложение на главный экран.',
      step1Lead: 'Нажмите кнопку ',
      step1Tail: ' Поделиться в вашем браузере.',
      step2Safari: 'В открывшемся меню нажмите Add to Home Screen и подтвердите установку.',
      step2Other: 'Если вы видите Add to Home Screen, нажмите его. Если нет, откройте эту страницу в Safari и используйте меню Поделиться Safari.'
    },
    uk: {
      guideSub: 'Скористайтеся меню Поділитися у вашому браузері, щоб додати застосунок на головний екран.',
      step1Lead: 'Натисніть кнопку ',
      step1Tail: ' Поділитися у вашому браузері.',
      step2Safari: 'У меню, що відкриється, натисніть Add to Home Screen і підтвердьте встановлення.',
      step2Other: 'Якщо ви бачите Add to Home Screen, натисніть його. Якщо ні, відкрийте цю сторінку в Safari і скористайтеся меню Поділитися Safari.'
    },
    ar: {
      guideSub: 'استخدم قائمة المشاركة في متصفحك لإضافة التطبيق إلى الشاشة الرئيسية.',
      step1Lead: 'اضغط على زر ',
      step1Tail: ' المشاركة في متصفحك.',
      step2Safari: 'في القائمة التي تفتح، اضغط Add to Home Screen ثم أكد التثبيت.',
      step2Other: 'إذا رأيت Add to Home Screen فاضغط عليه. وإذا لم تره، فافتح هذه الصفحة في Safari واستخدم قائمة المشاركة الخاصة بـ Safari.'
    }
  };
  var langCopy = copy[LANG] || copy.en;
  return langCopy[key] || copy.en[key] || '';
}

function _refreshInstallGuideContent() {
  var sub = document.getElementById('install-guide-sub');
  var step1 = document.getElementById('install-step1-desc');
  var step2 = document.getElementById('install-step2-desc');
  var primaryBtn = document.getElementById('install-share-btn');
  if (!sub || !step1 || !step2 || !primaryBtn) return;

  sub.textContent = _installGuideText('guideSub');

  step1.innerHTML = '';
  step1.appendChild(document.createTextNode(_installGuideText('step1Lead')));
  var icon = document.createElement('span');
  icon.className = 'share-glyph-inline';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 15V4" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 7.5L12 4l3.5 3.5" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 13.5v4.3A1.2 1.2 0 0 0 6.2 19h11.6a1.2 1.2 0 0 0 1.2-1.2v-4.3" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  step1.appendChild(icon);
  step1.appendChild(document.createTextNode(_installGuideText('step1Tail')));

  step2.textContent = _isIosSafariInstallable()
    ? _installGuideText('step2Safari')
    : _installGuideText('step2Other');

  // A webpage cannot open the browser's own install-capable Share menu.
  primaryBtn.style.display = _isIosVisitor() ? 'none' : '';
}

function refreshInstallTip() {
  var tip = document.getElementById('install-tip');
  if (!tip) return;
  _isStandaloneMode = _detectStandaloneMode();
  var shouldShow = false;
  if (!_isStandaloneMode && !_installDismissed) {
    if (_isIosVisitor()) shouldShow = true;
    else if (_installPromptReady) shouldShow = true;
  }
  tip.classList.toggle('hidden', !shouldShow);
}

window.refreshInstallTip = refreshInstallTip;

async function triggerIosShareMenu(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  _installLog('log', 'share requested', {
    shareAvailable: typeof navigator.share === 'function',
    currentUrl: String(window.location.href),
    userActivation: !!(navigator.userActivation && navigator.userActivation.isActive)
  });
  if (typeof navigator.share !== 'function') return false;
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
    openInstallGuide();
    return;
  }
  if (!_deferredInstallPrompt) return;
  try {
    _deferredInstallPrompt.prompt();
    var choice = await _deferredInstallPrompt.userChoice;
    if (choice && choice.outcome === 'accepted') _writeInstallDismissed(true);
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
  _isStandaloneMode = _detectStandaloneMode();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function() {});
  }

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

  window.addEventListener('pageshow', refreshInstallTip);
  window.addEventListener('focus', refreshInstallTip);
  refreshInstallTip();
  _wireInstallShareActions();
}

function _wireInstallShareActions() {
  var overlay = document.getElementById('install-guide-overlay');
  if (!overlay) {
    _installLog('warn', 'install guide overlay not found');
    return;
  }
  if (_installShareActionsBound) return;
  _installShareActionsBound = true;
  _installLog('log', 'share actions bound', {
    primaryFound: !!document.getElementById('install-share-btn'),
    inlineFound: !!document.getElementById('install-step1-link')
  });
  overlay.addEventListener('click', async function(ev) {
    var target = ev.target && ev.target.closest
      ? ev.target.closest('#install-share-btn, #install-step1-link')
      : null;
    if (!target) return;
    _installLog('log', 'share button tapped', { id: target.id || '(unknown)' });
    await triggerIosShareMenu(ev);
  });
}



// ── Card counts — no longer shown on level cards ──
function updateCounts() { /* word counts removed from UI */ }

// ── CSV-based quiz data ──
// CSVs are the single source of truth for quiz/explorer vocabulary data.
// Quiz mode loads only the selected level; explorer can intentionally load all levels.
var CSV_QUIZ_DATA = { A1: null, A2: null, B1: null };
var _csvLoadPromises = { A1: null, A2: null, B1: null };
var _faCsvMap = {}; // normKey -> translation_fa, built as CSV levels load
var _arCsvMap = {}; // normKey -> translation_ar, built as CSV levels load

function _parseCSVText(text) {
  if (!text) return [];
  text = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  var records = [];
  var row = [];
  var field = '';
  var inQuotes = false;

  for (var i = 0; i < text.length; i++) {
    var ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      field = '';
      if (row.some(function(v){ return v !== ''; })) records.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some(function(v){ return v !== ''; })) records.push(row);
  if (!records.length) return [];

  var headers = records[0].map(function(h){ return (h || '').trim(); });
  var rows = [];
  for (var r = 1; r < records.length; r++) {
    var vals = records[r];
    var obj = {};
    headers.forEach(function(h, idx){ obj[h] = (vals[idx] || '').trim(); });
    rows.push(obj);
  }
  return rows;
}

function _loadCSVText(url) {
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
              reject(fetchErr || new Error('CSV load failed'));
            }
          };
          xhr.onerror = function() { reject(fetchErr || new Error('CSV load failed')); };
          xhr.send();
        } catch (xhrErr) {
          reject(fetchErr || xhrErr);
        }
      });
    });
}

function _loadCSVLevel(lv) {
  if (CSV_QUIZ_DATA[lv]) return Promise.resolve(CSV_QUIZ_DATA[lv]);
  if (_csvLoadPromises[lv]) return _csvLoadPromises[lv];
  var url = 'data/' + lv.toLowerCase() + '.csv';
  _csvLoadPromises[lv] = _loadCSVText(url)
    .then(function(txt){
      var parsed = _parseCSVText(txt);
      CSV_QUIZ_DATA[lv] = parsed.filter(function(r){ return r.word && r.word.trim(); });
      var quizRows = CSV_QUIZ_DATA[lv].filter(function(r){
        return r.entry_type === 'main'
            && r.translation_en && r.translation_en.trim();
      });
      if (!quizRows.length) {
        throw new Error('CSV parsed but produced 0 quiz rows for ' + lv);
      }
      // Build fa and ar lookup maps from quiz rows
      quizRows.forEach(function(r) {
        var k = normKey(r.word);
        if (!_faCsvMap[k] && r.translation_fa && r.translation_fa.trim()) {
          _faCsvMap[k] = r.translation_fa.trim();
        }
        if (!_arCsvMap[k] && r.translation_ar && r.translation_ar.trim()) {
          _arCsvMap[k] = r.translation_ar.trim();
        }
      });
      return CSV_QUIZ_DATA[lv];
    })
    .catch(function(err){
      _csvLoadPromises[lv] = null;
      throw err;
    });
  return _csvLoadPromises[lv];
}

function _loadAllCSV() {
  return Promise.all(['A1','A2','B1'].map(_loadCSVLevel));
}

// ── Get display label for a CSV row in the active language ──
// Correctness is NEVER determined by comparing this text.
// The row's unique `id` field is used for correct-answer checking instead,
// so translations in any language can never accidentally swap answers.
function _csvRowDisplay(row) {
  if (LANG === 'en') return row.translation_en;
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

  // Ensure CSV data is loaded
  if (!CSV_QUIZ_DATA[lv]) {
    _ov.classList.add('active');
    try {
      await _loadCSVLevel(lv);
    } catch (err) {
      _ov.classList.remove('active');
      var msg = 'Could not load ' + lv + ' quiz data from CSV.';
      if (window.location.protocol === 'file:') {
        msg += ' Open the app through a local server instead of file://.';
      }
      if (err && err.message) msg += '\n\nDetails: ' + err.message;
      alert(msg);
      return;
    }
    _ov.classList.remove('active');
  }

  queue = buildQueue(lv);
  if (!queue.length) { alert('No cards!'); return; }
  idx = 0; ok = 0; no = 0;

  // All languages (including Arabic) use CSV columns directly — no API pre-fetch needed.

  show('screen-quiz');
  renderCard();
}

function renderCard() {
  answered = false;
  var card  = queue[idx];
  var total = queue.length;
  var row   = card._row;

  document.getElementById('prog').style.width = (idx / total * 100) + '%';
  document.getElementById('sc-ok').textContent  = ok;
  document.getElementById('sc-no').textContent  = no;
  document.getElementById('hud-pos').textContent = (idx + 1) + '/' + total;

  // Word-type badge — from CSV word_type column (Noun, Verb, Adjective, etc.)
  var badge = document.getElementById('tbadge');
  var wt = row.word_type || 'Word';
  badge.textContent = wt;
  badge.className = 'tbadge '
    + (wt === 'Noun'       ? 'noun'
     : wt === 'Verb'       ? 'verb'
     : (wt === 'Adjective' || wt === 'Adj') ? 'adj'
     : 'grammar');

  document.getElementById('tlevel').textContent = t('levelLabel') + ' ' + currentLevel;
  var mb = document.getElementById('tmode-badge');
  mb.textContent = t('vocabBadge');
  mb.className = 'tmode-badge vocab';

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
    btn.className = 'cbtn';
    btn.dataset.csvId = choiceRow.id;
    btn.textContent   = _csvRowDisplay(choiceRow);
    btn.onclick = (function(b, cId, corrId) {
      return function() { pick(b, cId, corrId); };
    })(btn, choiceRow.id, correctId);
    choicesEl.appendChild(btn);
  });

  // All languages use CSV columns directly — no per-choice API retry needed.

  var fb = document.getElementById('feedback');
  fb.className = 'feedback'; fb.textContent = '';
  document.getElementById('next-btn').textContent = t('next');
  document.getElementById('next-btn').classList.remove('show');
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
    fb.className = 'feedback c show';
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
    fb.className = 'feedback w show';
  }
  document.getElementById('sc-ok').textContent = ok;
  document.getElementById('sc-no').textContent = no;
  document.getElementById('next-btn').classList.add('show');
}

function nextCard(){
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
  document.getElementById('r-emoji').textContent=emoji;
  document.getElementById('r-title').textContent=title;
  document.getElementById('r-score').textContent=ok+'/'+total;
  document.getElementById('r-sub').textContent=t('resultSub')(currentLevel,pct);
  document.getElementById('r-pct').textContent=pct+'%';
  document.getElementById('r-ok').textContent=ok;
  document.getElementById('r-no').textContent=no;
  document.getElementById('prog').style.width='100%';
  show('screen-results');
}

function restartLevel(){
  if (currentThemeCategoryId) startThemeQuiz(currentThemeCategoryId);
  else startLevel(currentLevel);
}
function goHome(){show('screen-levels');}
function goQuizBack(){var t=_quizReturnScreen;_quizReturnScreen='screen-levels';window.goHome();show(t);}
function openSwipeSetup(){ show('screen-swipe-setup'); }
function setSwipeLevel(lv){
  swipeSelectedLevel = lv;
  ['A1','A2','B1'].forEach(function(k){
    document.getElementById('swipe-level-' + k).classList.toggle('active', k === lv);
  });
}

// ── ADAPTIVE QUIZ SETUP ──
function openAdaptiveSetup() {
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
  _quizReturnScreen = 'screen-adaptive-setup';
  startLevel(adaptiveSelectedLevel);
}

// ── THEME QUIZ ──
function openThemeSelect() {
  _loadAllCSV(); // preload in background
  show('screen-theme-select');
  _renderCategoryGrid();
}

function _renderCategoryGrid() {
  var grid = document.getElementById('category-grid');
  if (!grid) return;
  var catNames = t('categoryNames') || {};
  grid.innerHTML = CATEGORY_MAP.map(function(cat) {
    return '<button class="category-card" onclick="startThemeQuiz(' + cat.id + ')">'
      + '<span class="cat-icon">' + cat.icon + '</span>'
      + '<span class="cat-name">' + escHtml(catNames[cat.id] || cat.name) + '</span>'
      + '</button>';
  }).join('');
}

async function startThemeQuiz(categoryId) {
  _quizReturnScreen = 'screen-theme-select';
  currentThemeCategoryId = 0;
  var _ov = document.getElementById('quiz-prep-overlay');
  _ov.classList.add('active');
  try {
    await _loadAllCSV();
  } catch(err) {
    _ov.classList.remove('active');
    var msg = 'Could not load quiz data.';
    if (window.location.protocol === 'file:') msg += ' Open through a local server instead of file://';
    alert(msg);
    return;
  }
  _ov.classList.remove('active');

  var cards = _buildThemeQueue(categoryId);
  if (!cards.length) {
    alert('Not enough words available for this topic yet!');
    return;
  }
  currentThemeCategoryId = categoryId;
  currentLevel = _categoryName(categoryId);
  queue = cards;
  idx = 0; ok = 0; no = 0;
  show('screen-quiz');
  renderCard();
}

function _categoryName(id) {
  var names = t('categoryNames') || {};
  if (names[id]) return names[id];
  var cat = CATEGORY_MAP.find(function(c){ return c.id === id; });
  return cat ? cat.name : 'Theme';
}

function _buildThemeQueue(categoryId) {
  // Gather all CSV rows across all levels matching this category
  var pool = [];
  ['A1','A2','B1'].forEach(function(lv) {
    (CSV_QUIZ_DATA[lv] || []).filter(function(r){
      return r.entry_type === 'main' && r.translation_en && r.translation_en.trim();
    }).forEach(function(r) {
      if (parseInt(r.category_id) === categoryId) pool.push(r);
    });
  });
  if (!pool.length) return [];

  // Determine difficulty range for this category
  var diffs = pool.map(function(r){ return parseInt(r.difficulty); }).filter(function(d){ return d >= 1 && d <= 10; });
  if (!diffs.length) return _buildQueueFromRows(shuffle(pool).slice(0, QUIZ_LEN));
  var catMin = Math.min.apply(null, diffs);
  var catMax = Math.max.apply(null, diffs);

  // Determine user skill level from adaptive progress; default 4 for new users
  var skillLevel = 4;
  try {
    var _ap = JSON.parse(localStorage.getItem('deutsch_adaptive_progress'));
    if (_ap && _ap.skillLevel >= 1) skillLevel = _ap.skillLevel;
  } catch(e) {}

  // Clamp skill to category bounds
  var effectiveDiff = Math.max(catMin, Math.min(catMax, Math.round(skillLevel)));
  return _buildThemeQueueWithFallback(pool, effectiveDiff);
}

function _buildThemeQueueWithFallback(pool, targetDiff) {
  var needed = QUIZ_LEN;
  var used = {};
  var selected = [];

  // Stage 1 — exact difficulty
  shuffle(pool.filter(function(r){ return parseInt(r.difficulty) === targetDiff; }))
    .forEach(function(r){ if (selected.length < needed && !used[r.id]) { used[r.id] = true; selected.push(r); } });

  // Stage 2 — expand radius outward from targetDiff
  if (selected.length < needed) {
    for (var radius = 1; radius <= 9 && selected.length < needed; radius++) {
      shuffle(pool.filter(function(r) { return Math.abs(parseInt(r.difficulty) - targetDiff) === radius; }))
        .forEach(function(r){ if (selected.length < needed && !used[r.id]) { used[r.id] = true; selected.push(r); } });
    }
  }

  // Stage 3 — any remaining words from pool
  if (selected.length < needed) {
    shuffle(pool.filter(function(r){ return !used[r.id]; }))
      .forEach(function(r){ if (selected.length < needed) { used[r.id] = true; selected.push(r); } });
  }

  return _buildQueueFromRows(selected);
}

function _buildQueueFromRows(rows) {
  var allRows = [];
  ['A1','A2','B1'].forEach(function(lv){
    allRows = allRows.concat((CSV_QUIZ_DATA[lv] || []).filter(function(r){
      return r.entry_type === 'main' && r.translation_en && r.translation_en.trim();
    }));
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

// ══════════════════════════════════════════════════════════════════
//  SWIPE CHECK
// ══════════════════════════════════════════════════════════════════
function _rowMeaningForLang(row) {
  if (LANG === 'en') return row.translation_en || '';
  if (LANG === 'tr') return row.translation_tr || row.translation_en || '';
  if (LANG === 'ru') return row.translation_ru || row.translation_en || '';
  if (LANG === 'uk') return row.translation_uk || row.translation_en || '';
  if (LANG === 'fa') return row.translation_fa || row.translation_en || '';
  return '';
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
  if (LANG === 'en' || LANG === 'tr' || LANG === 'ru' || LANG === 'uk' || LANG === 'fa') {
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
    show('screen-swipe');
    renderSwipeCards();
  } catch (err) {
    var msg = 'Could not prepare swipe cards from CSV.';
    if (err && err.message) msg += '\n\nDetails: ' + err.message;
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
  return '<div class="swipe-card ' + posClass + '" data-swipe-pos="' + posClass + '">'
    + '<div class="swipe-word-block">'
    + '<div class="swipe-word">' + escHtml(_swipeWordLabel(card.row)) + '</div>'
    + '<div class="swipe-helper">' + escHtml(_swipeWordSub(card.row)) + '</div>'
    + '</div>'
    + '<div class="swipe-meaning-box"><div class="swipe-meaning-label">' + escHtml(t('swipeMeaningLabel')) + '</div><div class="swipe-meaning">' + escHtml(card.meaningText) + '</div></div>'
    + '</div>';
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
  }, 190);
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
  renderSwipeCards();
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
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
  var msg = LANG==='tr' ? 'Yükleniyor…' : LANG==='fa' ? 'در حال بارگذاری…' : LANG==='ru' ? 'Загрузка…' : LANG==='uk' ? 'Завантаження…' : LANG==='ar' ? 'جارٍ التحميل…' : 'Loading…';
  return '<div class="wikt-loading"><div class="wikt-spinner"></div><span>' + msg + '</span></div>';
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
  var data = await _wiktFetch(lw);
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
    html += '<div class="rw-form" style="cursor:default;border-color:var(--gold);background:rgba(232,201,122,.08);">'
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

  var html = '<div class="rw-card">';
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
          html += '<div class="rw-form" style="cursor:default;border-color:var(--gold);background:rgba(232,201,122,.08);">'
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

// Offline card body (cases/conjugation chips) — fallback when Wiktionary fails
function renderOfflineWordBody(w) {
  var u = UI[LANG];
  var html = '';
  var hint = LANG==='tr'?'Örnek için bir biçime dokun':LANG==='fa'?'برای مثال روی یک شکل بزنید':'Tap a form to see an example';
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
  var tapMsg = LANG==='tr'?'Örnek görmek için bir biçime dokunun.':LANG==='fa'?'برای مشاهده مثال روی یک شکل بزنید.':'Tap any form above to see an example sentence.';
  html += '<div class="rw-divider" style="margin-top:6px"></div>';
  if (!hasGrammar && w.example) {
    html += '<div class="rw-section"><div class="rw-section-title">'+u.examples+'</div><div class="rw-example-box lit">'+w.example+'</div></div>';
  } else {
    html += '<div class="rw-section"><div class="rw-section-title">'+u.examples+'</div><div class="rw-example-box" id="rw-ex-box">'+(hasGrammar ? tapMsg : (w.example||'No example available.'))+'</div></div>';
  }
  html += '<div class="rw-source">'+(w.source?w.source:UI[LANG].source)+' · '+w.level+'</div>';
  return html;
}

// ══════════════════════════════════════════════════════════════════
//  RANDOM WORD EXPLORER (API-powered)
// ══════════════════════════════════════════════════════════════════
var _randUsed = new Set();
// State for the currently displayed explorer card (used by _explorerRefreshLang)
var _currentRandRow  = null;  // CSV row object
var _currentWiktData = null;  // Wiktionary data object (null when offline/failed)

function showRandomWord() { show('screen-random'); renderRandomWord(); }

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
  // Ensure CSV data is loaded (fast no-op if already done)
  await _loadAllCSV();

  var pool = _getCsvRandPool();
  if (!pool.length) return;

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
  var rb = document.querySelector('.refresh-btn');
  if (rb) {
    rb.style.transform = 'rotate(360deg)';
    rb.style.transition = 'transform .4s ease';
    setTimeout(function(){ rb.style.transition='none'; rb.style.transform='rotate(0deg)'; }, 410);
  }

  var content = document.getElementById('rw-content');
  content.innerHTML = loadingHTML();

  fetchWiktionary(word, tc).then(async function(data) {
    _currentRandRow  = row;
    _currentWiktData = data;
    await _prefetchLangMeta(word, meta);
    await _prefetchDefTranslations(data);
    content.innerHTML = renderWiktCard(data, meta);
    var chip = content.querySelector('.rw-form[onclick*="pickFormExample"]');
    if (chip) { rwWordKey = word; chip.click(); }
  }).catch(function() {
    _currentRandRow  = row;
    _currentWiktData = null;
    // Offline fallback: render with whatever is cached
    var data = { found: false, word: word, ipa: '', sections: [] };
    content.innerHTML = renderWiktCard(data, meta);
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
    content.innerHTML = renderWiktCard(data, meta);
    var chip = content.querySelector('.rw-form[onclick*="pickFormExample"]');
    if (chip) { rwWordKey = word; chip.click(); }
  } else {
    content.innerHTML = renderWiktCard({ found: false, word: word, ipa: '', sections: [] }, meta);
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
    content.innerHTML = renderWiktCard(data, meta);
    var chip = content.querySelector('.rw-form[onclick*="pickFormExample"]');
    if (chip) { rwWordKey = word; chip.click(); }
  } catch(e) {
    // Offline: render immediately with whatever is cached, auto-fetchers update if online
    var data = { found: false, word: word, ipa: '', sections: [] };
    content.innerHTML = renderWiktCard(data, meta);
    _translateDefsInContainer(content);
    _autoFetchLangMeaning(word, content);
    var chip = content.querySelector('.rw-form[onclick*="pickFormExample"]');
    if (chip) { rwWordKey = word; chip.click(); }
  }
}

function closeWordModal(e) {
  if (e && e.target !== document.getElementById('word-modal-overlay')) return;
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
    var _wLabel = {en:'words',tr:'kelime',fa:'واژه',ru:'слово',uk:'слово',ar:'كلمة'};
    subEl.textContent = _dictAllWords.length + ' ' + (_wLabel[LANG] || 'words') + ' · A–Z';
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



// ── Screen switcher ──
function show(id){
  ['screen-levels','screen-quiz','screen-results','screen-random','screen-swipe-setup','screen-swipe','screen-adaptive-setup','screen-theme-select','screen-dictionary'].forEach(s=>{
    document.getElementById(s).classList.toggle('hidden',s!==id);
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
  ['en','tr','fa','ru','uk','ar'].forEach(function(l) {
    var el = document.getElementById('opt-' + l);
    if (el) el.classList.toggle('active', l === LANG);
  });
})();
applyTranslations();
updateCounts();
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
  if (!modal) return;

  // Desktop: click the pill handle to dismiss
  if (handle) handle.addEventListener('click', function() { closeWordModal(); });

  var _startY, _startScrollTop, _dragging, _deltaY;

  modal.addEventListener('touchstart', function(e) {
    _startY = e.touches[0].clientY;
    _startScrollTop = modal.scrollTop;
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

// ── Settings drawer drag-to-close ────────────────────────────────────
// Handle click (desktop) + full-drawer swipe-down (mobile)
(function() {
  var handle = document.querySelector('.drawer-handle');
  var drawer = document.getElementById('settings-drawer');
  if (!drawer) return;

  // Desktop: click the pill handle to dismiss
  if (handle) handle.addEventListener('click', function() { closeSettings(); });

  var _startY, _dragging, _deltaY;

  drawer.addEventListener('touchstart', function(e) {
    _startY = e.touches[0].clientY;
    _dragging = false;
    _deltaY = 0;
  }, { passive: true });

  // non-passive: prevent pull-to-refresh on any downward swipe on the drawer
  drawer.addEventListener('touchmove', function(e) {
    if (_startY === undefined) return;
    var dy = e.touches[0].clientY - _startY;
    // Block pull-to-refresh immediately on any downward movement
    if (dy > 0) e.preventDefault();
    if (!_dragging && dy > 6) {
      _dragging = true;
      drawer.style.transition = 'none';
    }
    if (_dragging) {
      _deltaY = Math.max(0, dy);
      drawer.style.transform = 'translateX(-50%) translateY(' + _deltaY + 'px)';
    }
  }, { passive: false });

  drawer.addEventListener('touchend', function() {
    if (_startY === undefined) return;
    _startY = undefined;
    if (_dragging && _deltaY > 80) {
      // Animate off-screen, then close
      drawer.style.transition = 'transform .2s ease-out';
      drawer.style.transform = 'translateX(-50%) translateY(110%)';
      setTimeout(function() { closeSettings(); }, 210);
    } else {
      drawer.style.transition = '';
      drawer.style.transform = '';
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

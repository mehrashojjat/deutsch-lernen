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
    cardCount: (n) => formatNum(n) + ' word practice cards',
    back: '← Back',
    next: 'Next →',
    correct: '✓ Correct!',
    wrong: (a) => `✗ Wrong. Correct answer: <strong>${a}</strong>`,
    resultTitles: { great:'Excellent!', good:'Well done!', ok:'Good effort!', low:'Keep practicing!' },
    resultSub: (lv,p) => `Level ${lv} · ${formatNum(p)}% correct`,
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
    tipTitle: 'Progress Not Saved',
    tipDesc: 'Sign in to keep your learning history and quiz results.',
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
    aboutP4: 'Originally named DeutschLernen during early development.',
    footerMsg: 'Hey! Built this while learning German myself — hope it helps you too. Completely free 🇩🇪',
    footerCopy: '© 2026 Mehras Hojjat',
    adaptiveBannerTitle: 'Adaptive Quiz',
    adaptiveBannerSub: 'Adjusts to your skill level',
    adaptiveV2BannerTitle: 'Adaptive V2 (Beta)',
    adaptiveV2BannerSub: 'Finds your level · adapts each quiz',
    adaptiveV2BannerStatusDefault: '',
    adaptiveV2StatusCal1: 'Calibration · step 1 of 2',
    adaptiveV2StatusCal2: 'Calibration · step 2 of 2',
    adaptiveV2StatusSkill: (n) => 'Your skill level: ' + formatNum(n),
    adaptiveV2PhaseReview: 'Review mode',
    adaptiveV2PhaseChallenge: 'Challenge mode',
    learningProfileBannerTitle: 'Learning Profile',
    learningProfileTitle: 'Learning Profile',
    adaptiveSetupTitle: 'Adaptive Quiz',
    adaptiveSetupSubtitle: 'Adjusts difficulty to your skill level',
    themeBannerTitle: 'Theme Quiz',
    themeBannerSub: 'Quiz yourself on a topic',
    themeSelectTitle: 'Theme Quiz',
    themeSelectSubtitle: 'Pick a topic to practise',
    dictBannerTitle: 'Dictionary',
    dictBannerSub: 'Browse all words',
    dictScreenTitle: 'Dictionary',
    dictScreenSubtitle: 'All words',
    dictBack: '← Back',
    dictFilterPlaceholder: 'Filter words…',
    dictLoading: 'Loading…',
    dictEmpty: 'No words found.',
    typeBadge: { Noun: 'Noun', Verb: 'Verb', Adjective: 'Adjective', Phrase: 'Phrase', Adverb: 'Adverb', Word: 'Word' },
    signedInAs: 'Signed in as:',
    signOut: 'Sign out',
    categoryNames: {1:'Numbers & Quantities',2:'Time & Calendar',3:'Family & Relationships',4:'Body & Health',5:'Food & Drink',6:'Home & Living',7:'Clothing & Appearance',8:'Work & Careers',9:'Education & Learning',10:'Travel & Tourism',11:'Transportation',12:'Shopping & Finance',13:'Language, Communication & Media',14:'Nature, Weather & Animals',15:'Sports & Leisure',16:'Arts & Culture',17:'Technology & Devices',18:'Society, Law & Politics',19:'Emotions & Personal Traits',20:'Places & Geography',21:'Grammar & Function Words'},
    practiceBannerTitle: 'Practice',
    practiceBannerSub: 'Flip cards to learn words',
    practiceSetupTitle: 'Practice',
    practiceSetupSub: '',
    practiceSubtitle: 'Flip cards to reveal meanings',
    practiceMeaningLabel: 'Meaning',
    practiceFilterDifficulty: 'Difficulty',
    practiceFilterType: 'Word type',
    practiceFilterArticle: 'Article (nouns)',
    practiceFilterTopics: 'Topics',
    practiceFilterAll: 'All',
    practiceClearFilters: 'Clear filters',
    practiceWordCount: 'words in your loop',
    practiceNoWordsHint: 'No words match — try another level or loosen filters.',
    offlineTitle: "You're Offline",
    offlineMessage: 'This app needs an internet connection to work.',
    offlineRefreshBtn: 'Refresh',
    offlineChecking: 'Checking…',
    practiceDoneTitle: 'All done',
    practiceDoneSub: 'Loading next difficulty…',
    errLoadQuiz: 'Could not load quiz data.',
    errLoadQuizLevel: (lv) => 'Could not load ' + lv + ' quiz data.',
    errNoCards: 'No cards!',
    errNoWords: 'No words available!',
    errNoWordsTopic: 'Not enough words available for this topic yet!',
    errCompleteAdaptiveFirst: 'Complete an adaptive quiz first so your review set has words to use.',
    errSwipePrepare: 'Could not prepare swipe cards.',
    errNoPracticeCards: 'No practice cards found.',
    errLoadPractice: 'Could not load practice data.',
    errFileProtocol: ' Open the app through a local server instead of file://.',
    adaptiveV2Badge: 'Adaptive V2',
    adaptiveV2ReviewLabel: 'B1 Review',
    adaptiveV2ChallengeLabel: 'Challenge',
    shareSectionLabel: 'Share this app',
    shareAppLabel: 'Share',
    copyLinkLabel: 'Copy link',
    linkCopied: 'Link copied',
    shareUnavailable: 'Share unavailable',
    shareFailed: 'Share failed',
    rwTapFormHint: 'Tap a form to see an example',
  },
  de: {
    headerSub: 'Wortübung · Fälle · Verbformen',
    settingsTitle: 'Einstellungen',
    langLabel: 'Sprache',
    closeDone: 'Schließen',
    rwBannerTitle: 'Wort-Explorer',
    rwBannerSub: 'Jedes Wort mit allen Formen, Fällen und Beispielen ansehen',
    swipeBannerTitle: 'Quick Match',
    swipeBannerSub: 'Wische, wenn die Bedeutung passt',
    selectLevel: 'Niveau wählen',
    levelNames: { A1:'Anfänger', A2:'Grundstufe', B1:'Mittelstufe', B2:'Obere Mittelstufe' },
    cardCount: (n) => formatNum(n) + ' Lernkarten',
    back: '← Zurück',
    next: 'Weiter →',
    correct: '✓ Richtig!',
    wrong: (a) => `✗ Falsch. Richtige Antwort: <strong>${a}</strong>`,
    resultTitles: { great:'Ausgezeichnet!', good:'Gut gemacht!', ok:'Guter Versuch!', low:'Weiter üben!' },
    resultSub: (lv,p) => `Niveau ${lv} · ${formatNum(p)}% richtig`,
    scoreLbl: 'Punkte', correctLbl: 'Richtig', wrongLbl: 'Falsch',
    accountLabel: 'Konto',
    installTipTitle: 'App installieren',
    installTipDesc: 'Auf dem Startbildschirm installieren für schnelleren Zugriff und ein App-ähnliches Erlebnis.',
    installGuideTitle: 'Diese App installieren',
    installGuideSub: 'Zwei einfache Schritte zur Installation auf dem Startbildschirm.',
    installStep1Title: 'Teilen-Menü öffnen',
    installStep1Desc: 'Auf die Teilen-Schaltfläche im Browser tippen oder hier klicken.',
    installStep2Title: '„Zum Home-Bildschirm" wählen',
    installStep2Desc: 'Im Menü „Zum Home-Bildschirm hinzufügen" antippen und bestätigen.',
    installOpenShare: 'Teilen-Menü öffnen',
    installClose: 'Schließen',
    tipTitle: 'Fortschritt nicht gespeichert',
    tipDesc: 'Melde dich an, um deinen Lernverlauf und Quiz-Ergebnisse zu behalten.',
    playAgain: 'Nochmal spielen', chooseLevel: 'Zur Startseite',
    rwTitle: 'Wort-Explorer',
    cases: 'Fälle (Kasus)', plural: 'Plural',
    presentTense: 'Präsens', pastSimple: 'Präteritum', perfekt: 'Perfekt',
    comparatives: 'Komparativ & Superlativ', adjEndings: 'Adjektivendungen (Nom.)', examples: 'Beispiele',
    source: 'Quelle: Goethe-Institut Wortliste',
    modeIcons: { vocab:'📖' },
    vocabBadge: 'Wortübung',
    meaning: 'Bedeutung',
    tapPrompt: '👆 Auf eine Form oben tippen, um einen Beispielsatz zu sehen.',
    noExample: 'Kein Beispiel verfügbar.',
    quizQuestion: 'Was bedeutet dieses Wort?',
    swipeSetupTitle: 'Quick Match',
    swipeSetupSub: '',
    prepareTen: 'Starten',
    swipeSubtitle: 'Wische, wenn die Bedeutung passt',
    swipeMeaningLabel: 'Bedeutung',
    swipeEmptyTitle: 'Stapel beendet',
    swipeEmptySub: 'Neue Runde starten, um weiterzumachen.',
    swipeToastGoodMatch: 'Richtig',
    swipeToastGoodMiss: 'Richtig',
    swipeToastBadMatch: 'Falsch',
    swipeToastBadMiss: 'Falsch',
    levelLabel: 'Niveau',
    wiktSource: 'Quelle',
    meanings: 'Bedeutungen',
    autoTranslated: 'Automatisch übersetzt',
    offlineNote: 'ⓘ Offline-Daten · Wiktionary nicht erreichbar',
    aboutBtn: 'ℹ️ Über',
    aboutTitle: 'Über',
    aboutClose: 'Schließen',
    aboutP1: 'Ich habe dieses kostenlose Mini-Spiel für mich selbst erstellt — ein einfacher Weg, Deutsch zu üben ohne Bezahlschranken. Ich wollte es als kostenloses Angebot für alle Deutschlernenden bereitstellen.',
    aboutP2html: 'Erstellt von <strong>Mehras Hojjat</strong>. Für Funktionswünsche oder Feedback auf <a href="https://linkedin.com/in/mehrashojjat" target="_blank" rel="noopener">LinkedIn</a> oder <a href="https://instagram.com/mehrashojjat" target="_blank" rel="noopener">Instagram</a>.',
    aboutP3html: 'Wortlisten von <strong>Goethe-Institut</strong> · Übersetzungen via <strong>MyMemory API</strong> · Open Source auf <a href="https://github.com/mehrashojjat/deutsch-lernen" target="_blank" rel="noopener">GitHub</a> · Erstellt mit <strong>Claude AI</strong>.',
    aboutP4: 'In der frühen Entwicklungsphase unter dem Namen DeutschLernen bekannt.',
    footerMsg: 'Hallo! Ich habe das für mein eigenes Deutschlernen gebaut — hoffe, es hilft dir auch. Komplett kostenlos 🇩🇪',
    footerCopy: '© 2026 Mehras Hojjat',
    adaptiveBannerTitle: 'Adaptives Quiz',
    adaptiveBannerSub: 'Passt sich deinem Niveau an',
    adaptiveV2BannerTitle: 'Adaptiv V2 (Beta)',
    adaptiveV2BannerSub: 'Findet dein Niveau · passt sich an',
    adaptiveV2BannerStatusDefault: '',
    adaptiveV2StatusCal1: 'Kalibrierung · Schritt 1 von 2',
    adaptiveV2StatusCal2: 'Kalibrierung · Schritt 2 von 2',
    adaptiveV2StatusSkill: (n) => 'Dein Niveau: ' + formatNum(n),
    adaptiveV2PhaseReview: 'Wiederholmodus',
    adaptiveV2PhaseChallenge: 'Herausforderungsmodus',
    learningProfileBannerTitle: 'Lernprofil',
    learningProfileTitle: 'Lernprofil',
    adaptiveSetupTitle: 'Adaptives Quiz',
    adaptiveSetupSubtitle: 'Schwierigkeit passt sich deinem Niveau an',
    themeBannerTitle: 'Themen-Quiz',
    themeBannerSub: 'Über ein Thema testen',
    themeSelectTitle: 'Themen-Quiz',
    themeSelectSubtitle: 'Thema zum Üben wählen',
    dictBannerTitle: 'Wörterbuch',
    dictBannerSub: 'Alle Wörter durchsuchen',
    dictScreenTitle: 'Wörterbuch',
    dictScreenSubtitle: 'Alle Wörter',
    dictBack: '← Zurück',
    dictFilterPlaceholder: 'Wörter filtern…',
    dictLoading: 'Wird geladen…',
    dictEmpty: 'Keine Wörter gefunden.',
    typeBadge: { Noun: 'Nomen', Verb: 'Verb', Adjective: 'Adjektiv', Phrase: 'Phrase', Adverb: 'Adverb', Word: 'Wort' },
    signedInAs: 'Angemeldet als:',
    signOut: 'Abmelden',
    practiceBannerTitle: 'Üben',
    practiceBannerSub: 'Karten umdrehen und Wörter lernen',
    practiceSetupTitle: 'Üben',
    practiceSetupSub: '',
    practiceSubtitle: 'Karte umdrehen, um die Bedeutung zu sehen',
    practiceMeaningLabel: 'Bedeutung',
    practiceFilterDifficulty: 'Schwierigkeit',
    practiceFilterType: 'Wortart',
    practiceFilterArticle: 'Artikel (Nomen)',
    practiceFilterTopics: 'Themen',
    practiceFilterAll: 'Alle',
    practiceClearFilters: 'Filter löschen',
    practiceWordCount: 'Wörter in deiner Runde',
    practiceNoWordsHint: 'Keine Wörter passen — anderes Niveau oder weniger Filter.',
    offlineTitle: 'Kein Internet',
    offlineMessage: 'Diese App benötigt eine Internetverbindung.',
    offlineRefreshBtn: 'Neu laden',
    offlineChecking: 'Prüfen…',
    practiceDoneTitle: 'Fertig',
    practiceDoneSub: 'Nächste Schwierigkeit wird geladen…',
    errLoadQuiz: 'Quiz-Daten konnten nicht geladen werden.',
    errLoadQuizLevel: (lv) => lv + '-Quiz-Daten konnten nicht geladen werden.',
    errNoCards: 'Keine Karten!',
    errNoWords: 'Keine Wörter verfügbar!',
    errNoWordsTopic: 'Für dieses Thema noch nicht genug Wörter.',
    errCompleteAdaptiveFirst: 'Zuerst ein adaptives Quiz absolvieren, damit Wörter zum Wiederholen vorhanden sind.',
    errSwipePrepare: 'Swipe-Karten konnten nicht vorbereitet werden.',
    errNoPracticeCards: 'Keine Übungskarten gefunden.',
    errLoadPractice: 'Übungsdaten konnten nicht geladen werden.',
    errFileProtocol: ' App über einen lokalen Server statt file:// öffnen.',
    adaptiveV2Badge: 'Adaptiv V2',
    adaptiveV2ReviewLabel: 'B1-Wiederholung',
    adaptiveV2ChallengeLabel: 'Herausforderung',
    shareSectionLabel: 'App teilen',
    shareAppLabel: 'Teilen',
    copyLinkLabel: 'Link kopieren',
    linkCopied: 'Link kopiert',
    shareUnavailable: 'Teilen nicht verfügbar',
    shareFailed: 'Teilen fehlgeschlagen',
    rwTapFormHint: 'Form antippen für ein Beispiel',
    categoryNames: {1:'Zahlen & Mengen',2:'Zeit & Kalender',3:'Familie & Beziehungen',4:'Körper & Gesundheit',5:'Essen & Trinken',6:'Zuhause & Wohnen',7:'Kleidung & Aussehen',8:'Arbeit & Karriere',9:'Bildung & Lernen',10:'Reisen & Tourismus',11:'Verkehr & Transport',12:'Einkaufen & Finanzen',13:'Sprache, Kommunikation & Medien',14:'Natur, Wetter & Tiere',15:'Sport & Freizeit',16:'Kunst & Kultur',17:'Technologie & Geräte',18:'Gesellschaft, Recht & Politik',19:'Gefühle & Charaktereigenschaften',20:'Orte & Geografie',21:'Grammatik & Funktionswörter'},
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
    cardCount: (n) => formatNum(n) + ' kelime pratiği kartı',
    back: '← Geri',
    next: 'Sonraki →',
    correct: '✓ Doğru!',
    wrong: (a) => `✗ Yanlış. Doğru cevap: <strong>${a}</strong>`,
    resultTitles: { great:'Mükemmel!', good:'Çok iyi!', ok:'Güzel deneme!', low:'Pratik yapmaya devam!' },
    resultSub: (lv,p) => `Seviye ${lv} · %${formatNum(p)} doğru`,
    scoreLbl: 'Puan', correctLbl: 'Doğru', wrongLbl: 'Yanlış',
    accountLabel: 'Hesap',
    installTipTitle: 'Uygulamayı yükle',
    installTipDesc: 'Daha hızlı erişim ve uygulama deneyimi için ana ekranınıza yükleyin.',
    installGuideTitle: 'Bu uygulamayı yükle',
    installGuideSub: 'Uygulamayı ana ekranınıza eklemek için bu iki hızlı adımı izleyin.',
    installStep1Title: 'Paylaş menüsünü aç',
    installStep1Desc: 'Tarayıcınızdaki Paylaş düğmesine dokunun veya buraya tıklayın.',
    installStep2Title: 'Ana Ekrana Ekle\'yi seç',
    installStep2Desc: 'Açılan menüden Ana Ekrana Ekle\'ye dokunun ve onaylayın.',
    installOpenShare: 'Paylaş menüsünü aç',
    installClose: 'Kapat',
    tipTitle: 'İlerleme kaydedilmedi',
    tipDesc: 'Öğrenme geçmişinizi ve quiz sonuçlarınızı korumak için giriş yapın.',
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
    aboutP4: 'Erken geliştirme döneminde DeutschLernen adıyla biliniyordu.',
    footerMsg: 'Merhaba! Bunu Almanca öğrenirken kendim için yaptım — umarım sana da yardımcı olur. Tamamen ücretsiz 🇩🇪',
    footerCopy: '© 2026 Mehras Hojjat',
    adaptiveBannerTitle: 'Uyarlamalı Sınav',
    adaptiveBannerSub: 'Seviyenize göre ayarlanır',
    adaptiveV2BannerTitle: 'Uyarlamalı V2 (Beta)',
    adaptiveV2BannerSub: 'Seviyeni bulur · quizler uyum sağlar',
    adaptiveV2BannerStatusDefault: '',
    adaptiveV2StatusCal1: 'Kalibrasyon · adım 1 / 2',
    adaptiveV2StatusCal2: 'Kalibrasyon · adım 2 / 2',
    adaptiveV2StatusSkill: (n) => 'Seviyeniz: ' + formatNum(n),
    adaptiveV2PhaseReview: 'Tekrar modu',
    adaptiveV2PhaseChallenge: 'Meydan okuma modu',
    learningProfileBannerTitle: 'Öğrenme Profili',
    learningProfileTitle: 'Öğrenme Profili',
    adaptiveSetupTitle: 'Uyarlamalı Sınav',
    adaptiveSetupSubtitle: 'Zorluk seviyenize göre ayarlanır',
    themeBannerTitle: 'Konu Sınavı',
    themeBannerSub: 'Bir konuyu seçerek test edin',
    themeSelectTitle: 'Konu Sınavı',
    themeSelectSubtitle: 'Çalışmak istediğiniz konuyu seçin',
    dictBannerTitle: 'Sözlük',
    dictBannerSub: 'Tüm kelimelere göz at',
    dictScreenTitle: 'Sözlük',
    dictScreenSubtitle: 'Tüm kelimeler',
    dictBack: '← Geri',
    dictFilterPlaceholder: 'Kelime ara…',
    dictLoading: 'Yükleniyor…',
    dictEmpty: 'Kelime bulunamadı.',
    typeBadge: { Noun: 'İsim', Verb: 'Fiil', Adjective: 'Sıfat', Phrase: 'Deyim', Adverb: 'Zarf', Word: 'Kelime' },
    signedInAs: 'Giriş yapıldı:',
    signOut: 'Çıkış yap',
    categoryNames: {1:'Sayılar ve Miktarlar',2:'Zaman ve Takvim',3:'Aile ve İlişkiler',4:'Vücut ve Sağlık',5:'Yiyecek ve İçecek',6:'Ev ve Yaşam',7:'Giyim ve Görünüm',8:'İş ve Kariyer',9:'Eğitim ve Öğrenim',10:'Seyahat ve Turizm',11:'Ulaşım',12:'Alışveriş ve Finans',13:'Dil, İletişim ve Medya',14:'Doğa, Hava ve Hayvanlar',15:'Spor ve Boş Zaman',16:'Sanat ve Kültür',17:'Teknoloji ve Cihazlar',18:'Toplum, Hukuk ve Siyaset',19:'Duygular ve Kişilik Özellikleri',20:'Yerler ve Coğrafya',21:'Dilbilgisi ve İşlev Sözcükleri'},
    practiceBannerTitle: 'Pratik',
    practiceBannerSub: 'Kartları çevirerek kelime öğren',
    practiceSetupTitle: 'Pratik',
    practiceSetupSub: '',
    practiceSubtitle: 'Anlamı görmek için kartı çevir',
    practiceMeaningLabel: 'Anlam',
    practiceFilterDifficulty: 'Zorluk',
    practiceFilterType: 'Kelime türü',
    practiceFilterArticle: 'Tanımlık (isimler)',
    practiceFilterTopics: 'Konular',
    practiceFilterAll: 'Tümü',
    practiceClearFilters: 'Filtreleri temizle',
    practiceWordCount: 'turundaki kelime',
    practiceNoWordsHint: 'Eşleşen kelime yok — seviye veya filtreleri değiştirin.',
    offlineTitle: 'Çevrimedışısınız',
    offlineMessage: 'Bu uygulama çalışmak için internet bağlantısı gerektirir.',
    offlineRefreshBtn: 'Yenile',
    offlineChecking: 'Kontrol ediliyor…',
    practiceDoneTitle: 'Tamamlandı',
    practiceDoneSub: 'Sonraki zorluk yükleniyor…',
    errLoadQuiz: 'Quiz verileri yüklenemedi.',
    errLoadQuizLevel: (lv) => lv + ' quiz verileri yüklenemedi.',
    errNoCards: 'Kart yok!',
    errNoWords: 'Kelime bulunamadı!',
    errNoWordsTopic: 'Bu konu için henüz yeterli kelime yok.',
    errCompleteAdaptiveFirst: 'Tekrar setinizde kelime olması için önce uyarlamalı bir quiz tamamlayın.',
    errSwipePrepare: 'Kaydırma kartları hazırlanamadı.',
    errNoPracticeCards: 'Pratik kartı bulunamadı.',
    errLoadPractice: 'Pratik verileri yüklenemedi.',
    errFileProtocol: ' Uygulamayı file:// yerine yerel sunucu üzerinden açın.',
    adaptiveV2Badge: 'Uyarlamalı V2',
    adaptiveV2ReviewLabel: 'B1 Tekrar',
    adaptiveV2ChallengeLabel: 'Meydan okuma',
    shareSectionLabel: 'Bu uygulamayı paylaş',
    shareAppLabel: 'Paylaş',
    copyLinkLabel: 'Bağlantıyı kopyala',
    linkCopied: 'Bağlantı kopyalandı',
    shareUnavailable: 'Paylaşım kullanılamıyor',
    shareFailed: 'Paylaşım başarısız',
    rwTapFormHint: 'Örnek için bir biçime dokun',
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
    cardCount: (n) => formatNum(n) + ' کارت تمرین واژگان',
    back: '→ بازگشت',
    next: 'بعدی ←',
    correct: '✓ درست!',
    wrong: (a) => `✗ اشتباه. جواب درست: <strong>${a}</strong>`,
    resultTitles: { great:'عالی!', good:'خیلی خوب!', ok:'تلاش خوبی بود!', low:'به تمرین ادامه بده!' },
    resultSub: (lv,p) => `سطح ${lv} · ${formatNum(p)}٪ درست`,
    scoreLbl: 'امتیاز', correctLbl: 'درست', wrongLbl: 'اشتباه',
    accountLabel: 'حساب کاربری',
    installTipTitle: 'نصب برنامه',
    installTipDesc: 'برای دسترسی سریع‌تر و تجربه‌ای روان‌تر، روی صفحه اصلی نصب کنید.',
    installGuideTitle: 'این برنامه را نصب کنید',
    installGuideSub: 'برای نصب برنامه روی صفحهٔ اصلی این دو گام ساده را انجام دهید.',
    installStep1Title: 'منوی اشتراک‌گذاری را باز کنید',
    installStep1Desc: 'روی دکمهٔ اشتراک‌گذاری در مرورگر بزنید یا اینجا کلیک کنید.',
    installStep2Title: '«Add to Home Screen» را انتخاب کنید',
    installStep2Desc: 'در منوی بازشده «Add to Home Screen» را بزنید و تأیید کنید.',
    installOpenShare: 'باز کردن منوی اشتراک‌گذاری',
    installClose: 'بستن',
    tipTitle: 'پیشرفت ذخیره نشده',
    tipDesc: 'برای حفظ تاریخچهٔ یادگیری و نتایج آزمون وارد شوید.',
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
    aboutP4: 'در مراحل اولیه توسعه با نام DeutschLernen شناخته می‌شد.',
    footerMsg: 'سلام! این بازی رو برای یادگیری آلمانی خودم ساختم — امیدوارم به تو هم کمک کنه. کاملاً رایگان 🇩🇪',
    footerCopy: '© ۲۰۲۶ Mehras Hojjat',
    adaptiveBannerTitle: 'آزمون تطبیقی',
    adaptiveBannerSub: 'سطح شما را تشخیص می‌دهد',
    adaptiveV2BannerTitle: 'آزمون تطبیقی V2 (بتا)',
    adaptiveV2BannerSub: 'سطحت را پیدا می‌کند · هر آزمون تطبیق می‌یابد',
    adaptiveV2BannerStatusDefault: '',
    adaptiveV2StatusCal1: 'کالیبراسیون · گام ۱ از ۲',
    adaptiveV2StatusCal2: 'کالیبراسیون · گام ۲ از ۲',
    adaptiveV2StatusSkill: (n) => 'سطح مهارت شما: ' + formatNum(n),
    adaptiveV2PhaseReview: 'حالت مرور',
    adaptiveV2PhaseChallenge: 'حالت چالش',
    learningProfileBannerTitle: 'پروفایل یادگیری',
    learningProfileTitle: 'پروفایل یادگیری',
    adaptiveSetupTitle: 'آزمون تطبیقی',
    adaptiveSetupSubtitle: 'دشواری بر اساس سطح شما تنظیم می‌شود',
    themeBannerTitle: 'آزمون موضوعی',
    themeBannerSub: 'یک موضوع انتخاب کنید',
    themeSelectTitle: 'آزمون موضوعی',
    themeSelectSubtitle: 'موضوع مورد نظر را انتخاب کنید',
    dictBannerTitle: 'واژه‌نامه',
    dictBannerSub: 'مرور همه واژه‌ها',
    dictScreenTitle: 'واژه‌نامه',
    dictScreenSubtitle: 'همه واژه‌ها',
    dictBack: '→ بازگشت',
    dictFilterPlaceholder: 'جستجوی واژه…',
    dictLoading: 'در حال بارگذاری…',
    dictEmpty: 'واژه‌ای یافت نشد.',
    typeBadge: { Noun: 'اسم', Verb: 'فعل', Adjective: 'صفت', Phrase: 'عبارت', Adverb: 'قید', Word: 'کلمه' },
    signedInAs: 'وارد شده به عنوان:',
    signOut: 'خروج از حساب',
    practiceBannerTitle: 'تمرین',
    practiceBannerSub: 'کارت‌ها را برگردانید تا واژه‌ها یاد بگیرید',
    practiceSetupTitle: 'تمرین',
    practiceSetupSub: '',
    practiceSubtitle: 'کارت را برگردانید تا معنی را ببینید',
    practiceMeaningLabel: 'معنی',
    practiceFilterDifficulty: 'سختی',
    practiceFilterType: 'نوع واژه',
    practiceFilterArticle: 'حرف تعریف (اسم)',
    practiceFilterTopics: 'موضوعات',
    practiceFilterAll: 'همه',
    practiceClearFilters: 'پاک کردن فیلترها',
    practiceWordCount: 'واژه در لیست شما',
    practiceNoWordsHint: 'واژه‌ای پیدا نشد — سطح یا فیلترها را تغییر دهید.',
    offlineTitle: 'آفلاین هستید',
    offlineMessage: 'این برنامه برای کار کردن به اتصال اینترنت نیاز دارد.',
    offlineRefreshBtn: 'بارگذاری مجدد',
    offlineChecking: 'در حال بررسی…',
    practiceDoneTitle: 'تمام شد',
    practiceDoneSub: 'در حال بارگذاری سختی بعدی…',
    errLoadQuiz: 'دادهٔ آزمون بارگذاری نشد.',
    errLoadQuizLevel: (lv) => 'دادهٔ آزمون ' + lv + ' بارگذاری نشد.',
    errNoCards: 'کارتی نیست!',
    errNoWords: 'واژه‌ای در دسترس نیست!',
    errNoWordsTopic: 'برای این موضوع هنوز واژهٔ کافی نیست.',
    errCompleteAdaptiveFirst: 'ابتدا یک آزمون تطبیقی کامل کنید تا واژه‌های مرور داشته باشید.',
    errSwipePrepare: 'کارت‌های تطبیق آماده نشد.',
    errNoPracticeCards: 'کارتی برای تمرین پیدا نشد.',
    errLoadPractice: 'دادهٔ تمرین بارگذاری نشد.',
    errFileProtocol: ' برنامه را از طریق سرور محلی باز کنید، نه file://.',
    adaptiveV2Badge: 'تطبیقی V2',
    adaptiveV2ReviewLabel: 'مرور B1',
    adaptiveV2ChallengeLabel: 'چالش',
    shareSectionLabel: 'اشتراک‌گذاری این برنامه',
    shareAppLabel: 'اشتراک‌گذاری',
    copyLinkLabel: 'کپی پیوند',
    linkCopied: 'پیوند کپی شد',
    shareUnavailable: 'اشتراک‌گذاری در دسترس نیست',
    shareFailed: 'اشتراک‌گذاری ناموفق بود',
    rwTapFormHint: 'برای مثال روی یک شکل بزنید',
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
    cardCount: (n) => formatNum(n) + ' карточек практики слов',
    back: '← Назад',
    next: 'Далее →',
    correct: '✓ Правильно!',
    wrong: (a) => `✗ Неверно. Правильный ответ: <strong>${a}</strong>`,
    resultTitles: { great:'Отлично!', good:'Хорошо!', ok:'Неплохая попытка!', low:'Продолжай практиковаться!' },
    resultSub: (lv,p) => `Уровень ${lv} · ${formatNum(p)}% правильно`,
    scoreLbl: 'Счёт', correctLbl: 'Правильно', wrongLbl: 'Неверно',
    accountLabel: 'Аккаунт',
    installTipTitle: 'Установить приложение',
    installTipDesc: 'Установите на главный экран для быстрого доступа и удобного использования.',
    installGuideTitle: 'Установить это приложение',
    installGuideSub: 'Два простых шага для установки приложения на главный экран.',
    installStep1Title: 'Откройте меню «Поделиться»',
    installStep1Desc: 'Нажмите кнопку «Поделиться» в браузере или нажмите здесь.',
    installStep2Title: 'Выберите «Add to Home Screen»',
    installStep2Desc: 'В открывшемся меню выберите «Add to Home Screen» и подтвердите.',
    installOpenShare: 'Открыть меню «Поделиться»',
    installClose: 'Закрыть',
    tipTitle: 'Прогресс не сохранён',
    tipDesc: 'Войдите, чтобы сохранить историю обучения и результаты викторин.',
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
    aboutP4: 'В начале разработки приложение называлось DeutschLernen.',
    footerMsg: 'Привет! Сделал это для своего изучения немецкого — надеюсь, поможет и тебе. Полностью бесплатно 🇩🇪',
    footerCopy: '© 2026 Mehras Hojjat',
    adaptiveBannerTitle: 'Адаптивная викторина',
    adaptiveBannerSub: 'Адаптируется к вашему уровню',
    adaptiveV2BannerTitle: 'Адаптив V2 (Beta)',
    adaptiveV2BannerSub: 'Находит уровень · подстраивает каждый квиз',
    adaptiveV2BannerStatusDefault: '',
    adaptiveV2StatusCal1: 'Калибровка · шаг 1 из 2',
    adaptiveV2StatusCal2: 'Калибровка · шаг 2 из 2',
    adaptiveV2StatusSkill: (n) => 'Ваш уровень: ' + formatNum(n),
    adaptiveV2PhaseReview: 'Режим повторения',
    adaptiveV2PhaseChallenge: 'Режим вызова',
    learningProfileBannerTitle: 'Профиль обучения',
    learningProfileTitle: 'Профиль обучения',
    adaptiveSetupTitle: 'Адаптивная викторина',
    adaptiveSetupSubtitle: 'Сложность адаптируется к вашему уровню',
    themeBannerTitle: 'Тематическая викторина',
    themeBannerSub: 'Выберите тему для тренировки',
    themeSelectTitle: 'Тематическая викторина',
    themeSelectSubtitle: 'Выберите тему',
    dictBannerTitle: 'Словарь',
    dictBannerSub: 'Все слова',
    dictScreenTitle: 'Словарь',
    dictScreenSubtitle: 'Все слова',
    dictBack: '← Назад',
    dictFilterPlaceholder: 'Фильтр слов…',
    dictLoading: 'Загрузка…',
    dictEmpty: 'Слова не найдены.',
    typeBadge: { Noun: 'Существительное', Verb: 'Глагол', Adjective: 'Прилагательное', Phrase: 'Фраза', Adverb: 'Наречие', Word: 'Слово' },
    signedInAs: 'Вы вошли как:',
    signOut: 'Выйти',
    practiceBannerTitle: 'Практика',
    practiceBannerSub: 'Переворачивайте карточки, чтобы учить слова',
    practiceSetupTitle: 'Практика',
    practiceSetupSub: '',
    practiceSubtitle: 'Переверни карточку, чтобы увидеть значение',
    practiceMeaningLabel: 'Значение',
    practiceFilterDifficulty: 'Сложность',
    practiceFilterType: 'Тип слова',
    practiceFilterArticle: 'Артикль (существ.)',
    practiceFilterTopics: 'Темы',
    practiceFilterAll: 'Все',
    practiceClearFilters: 'Сбросить фильтры',
    practiceWordCount: 'слов в наборе',
    practiceNoWordsHint: 'Нет подходящих слов — смените уровень или фильтры.',
    offlineTitle: 'Нет подключения',
    offlineMessage: 'Для работы приложения необходимо подключение к интернету.',
    offlineRefreshBtn: 'Обновить',
    offlineChecking: 'Проверка…',
    practiceDoneTitle: 'Готово',
    practiceDoneSub: 'Загрузка следующей сложности…',
    errLoadQuiz: 'Не удалось загрузить данные викторины.',
    errLoadQuizLevel: (lv) => 'Не удалось загрузить данные викторины ' + lv + '.',
    errNoCards: 'Нет карточек!',
    errNoWords: 'Нет доступных слов!',
    errNoWordsTopic: 'Для этой темы пока недостаточно слов.',
    errCompleteAdaptiveFirst: 'Сначала пройдите адаптивную викторину, чтобы были слова для повторения.',
    errSwipePrepare: 'Не удалось подготовить карточки для свайпа.',
    errNoPracticeCards: 'Карточки для практики не найдены.',
    errLoadPractice: 'Не удалось загрузить данные практики.',
    errFileProtocol: ' Откройте приложение через локальный сервер, а не file://.',
    adaptiveV2Badge: 'Адаптив V2',
    adaptiveV2ReviewLabel: 'Повторение B1',
    adaptiveV2ChallengeLabel: 'Вызов',
    shareSectionLabel: 'Поделиться приложением',
    shareAppLabel: 'Поделиться',
    copyLinkLabel: 'Копировать ссылку',
    linkCopied: 'Ссылка скопирована',
    shareUnavailable: 'Поделиться недоступно',
    shareFailed: 'Не удалось поделиться',
    rwTapFormHint: 'Нажмите на форму, чтобы увидеть пример',
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
    cardCount: (n) => formatNum(n) + ' карток практики слів',
    back: '← Назад',
    next: 'Далі →',
    correct: '✓ Правильно!',
    wrong: (a) => `✗ Неправильно. Правильна відповідь: <strong>${a}</strong>`,
    resultTitles: { great:'Відмінно!', good:'Молодець!', ok:'Непогана спроба!', low:'Продовжуй практикуватись!' },
    resultSub: (lv,p) => `Рівень ${lv} · ${formatNum(p)}% правильно`,
    scoreLbl: 'Рахунок', correctLbl: 'Правильно', wrongLbl: 'Неправильно',
    accountLabel: 'Акаунт',
    installTipTitle: 'Встановити додаток',
    installTipDesc: 'Встановіть на головний екран для швидкого доступу та зручного використання.',
    installGuideTitle: 'Встановити цей додаток',
    installGuideSub: 'Два прості кроки для встановлення додатку на головний екран.',
    installStep1Title: 'Відкрийте меню «Поділитися»',
    installStep1Desc: 'Натисніть кнопку «Поділитися» в браузері або натисніть тут.',
    installStep2Title: 'Виберіть «Add to Home Screen»',
    installStep2Desc: 'У меню, що відкриється, виберіть «Add to Home Screen» і підтвердіть.',
    installOpenShare: 'Відкрити меню «Поділитися»',
    installClose: 'Закрити',
    tipTitle: 'Прогрес не збережено',
    tipDesc: 'Увійдіть, щоб зберегти історію навчання та результати вікторин.',
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
    aboutP4: 'На початку розробки додаток мав назву DeutschLernen.',
    footerMsg: 'Привіт! Зробив це для вивчення німецької — сподіваюся, допоможе і тобі. Повністю безкоштовно 🇩🇪',
    footerCopy: '© 2026 Mehras Hojjat',
    adaptiveBannerTitle: 'Адаптивна вікторина',
    adaptiveBannerSub: 'Адаптується до вашого рівня',
    adaptiveV2BannerTitle: 'Адаптив V2 (Beta)',
    adaptiveV2BannerSub: 'Знаходить рівень · підлаштовує кожну вікторину',
    adaptiveV2BannerStatusDefault: '',
    adaptiveV2StatusCal1: 'Калібрування · крок 1 з 2',
    adaptiveV2StatusCal2: 'Калібрування · крок 2 з 2',
    adaptiveV2StatusSkill: (n) => 'Ваш рівень: ' + formatNum(n),
    adaptiveV2PhaseReview: 'Режим повторення',
    adaptiveV2PhaseChallenge: 'Режим виклику',
    learningProfileBannerTitle: 'Профіль навчання',
    learningProfileTitle: 'Профіль навчання',
    adaptiveSetupTitle: 'Адаптивна вікторина',
    adaptiveSetupSubtitle: 'Складність адаптується до вашого рівня',
    themeBannerTitle: 'Тематична вікторина',
    themeBannerSub: 'Виберіть тему для практики',
    themeSelectTitle: 'Тематична вікторина',
    themeSelectSubtitle: 'Виберіть тему',
    dictBannerTitle: 'Словник',
    dictBannerSub: 'Усі слова',
    dictScreenTitle: 'Словник',
    dictScreenSubtitle: 'Усі слова',
    dictBack: '← Назад',
    dictFilterPlaceholder: 'Фільтр слів…',
    dictLoading: 'Завантаження…',
    dictEmpty: 'Слова не знайдено.',
    typeBadge: { Noun: 'Іменник', Verb: 'Дієслово', Adjective: 'Прикметник', Phrase: 'Фраза', Adverb: 'Прислівник', Word: 'Слово' },
    signedInAs: 'Ввійшли як:',
    signOut: 'Вийти',
    practiceBannerTitle: 'Практика',
    practiceBannerSub: 'Перевертайте картки, щоб вивчати слова',
    practiceSetupTitle: 'Практика',
    practiceSetupSub: '',
    practiceSubtitle: 'Переверни картку, щоб побачити значення',
    practiceMeaningLabel: 'Значення',
    practiceFilterDifficulty: 'Складність',
    practiceFilterType: 'Тип слова',
    practiceFilterArticle: 'Артикль (іменники)',
    practiceFilterTopics: 'Теми',
    practiceFilterAll: 'Усі',
    practiceClearFilters: 'Скинути фільтри',
    practiceWordCount: 'слів у наборі',
    practiceNoWordsHint: 'Немає відповідних слів — змініть рівень або фільтри.',
    offlineTitle: 'Немає інтернету',
    offlineMessage: 'Для роботи додатку потрібне підключення до інтернету.',
    offlineRefreshBtn: 'Оновити',
    offlineChecking: 'Перевірка…',
    practiceDoneTitle: 'Готово',
    practiceDoneSub: 'Завантаження наступної складності…',
    errLoadQuiz: 'Не вдалося завантажити дані вікторини.',
    errLoadQuizLevel: (lv) => 'Не вдалося завантажити дані вікторини ' + lv + '.',
    errNoCards: 'Немає карток!',
    errNoWords: 'Немає доступних слів!',
    errNoWordsTopic: 'Для цієї теми поки недостатньо слів.',
    errCompleteAdaptiveFirst: 'Спочатку пройдіть адаптивну вікторину, щоб були слова для повторення.',
    errSwipePrepare: 'Не вдалося підготувати картки для свайпу.',
    errNoPracticeCards: 'Картки для практики не знайдено.',
    errLoadPractice: 'Не вдалося завантажити дані практики.',
    errFileProtocol: ' Відкрийте додаток через локальний сервер, а не file://.',
    adaptiveV2Badge: 'Адаптив V2',
    adaptiveV2ReviewLabel: 'Повторення B1',
    adaptiveV2ChallengeLabel: 'Виклик',
    shareSectionLabel: 'Поділитися додатком',
    shareAppLabel: 'Поділитися',
    copyLinkLabel: 'Копіювати посилання',
    linkCopied: 'Посилання скопійовано',
    shareUnavailable: 'Поділитися недоступно',
    shareFailed: 'Не вдалося поділитися',
    rwTapFormHint: 'Натисніть на форму, щоб побачити приклад',
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
    cardCount: (n) => formatNum(n) + ' بطاقة تدريب مفردات',
    back: '→ رجوع',
    next: '← التالي',
    correct: '✓ صحيح!',
    wrong: (a) => `✗ خطأ. الإجابة الصحيحة: <strong>${a}</strong>`,
    resultTitles: { great:'ممتاز!', good:'أحسنت!', ok:'محاولة جيدة!', low:'واصل التدريب!' },
    resultSub: (lv,p) => `المستوى ${lv} · ${formatNum(p)}% صحيح`,
    scoreLbl: 'النقاط', correctLbl: 'صحيح', wrongLbl: 'خطأ',
    accountLabel: 'الحساب',
    installTipTitle: 'ثبّت التطبيق',
    installTipDesc: 'ثبّته على شاشتك الرئيسية للوصول السريع وتجربة سلسة.',
    installGuideTitle: 'ثبّت هذا التطبيق',
    installGuideSub: 'خطوتان سريعتان لتثبيت التطبيق على شاشتك الرئيسية.',
    installStep1Title: 'افتح قائمة المشاركة',
    installStep1Desc: 'اضغط زر المشاركة في متصفحك، أو انقر هنا.',
    installStep2Title: 'اختر «Add to Home Screen»',
    installStep2Desc: 'في القائمة التي تفتح، اضغط Add to Home Screen ثم أكّد التثبيت.',
    installOpenShare: 'فتح قائمة المشاركة',
    installClose: 'إغلاق',
    tipTitle: 'التقدم غير محفوظ',
    tipDesc: 'سجّل الدخول للاحتفاظ بسجل تعلّمك ونتائج الاختبارات.',
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
    aboutP4: 'كان اسم التطبيق DeutschLernen في مراحل التطوير الأولى.',
    footerMsg: 'مرحباً! صنعت هذا لتعلم الألمانية بنفسي — أتمنى أن يفيدك أيضاً. مجاني تماماً 🇩🇪',
    footerCopy: '© 2026 Mehras Hojjat',
    adaptiveBannerTitle: 'اختبار تكيّفي',
    adaptiveBannerSub: 'يتكيّف مع مستواك',
    adaptiveV2BannerTitle: 'اختبار تكيّفي V2 (تجريبي)',
    adaptiveV2BannerSub: 'يكتشف مستواك · يتكيّف كل اختبار',
    adaptiveV2BannerStatusDefault: '',
    adaptiveV2StatusCal1: 'المعايرة · الخطوة ١ من ٢',
    adaptiveV2StatusCal2: 'المعايرة · الخطوة ٢ من ٢',
    adaptiveV2StatusSkill: (n) => 'مستوى مهارتك: ' + formatNum(n),
    adaptiveV2PhaseReview: 'وضع المراجعة',
    adaptiveV2PhaseChallenge: 'وضع التحدي',
    learningProfileBannerTitle: 'ملف التعلم',
    learningProfileTitle: 'ملف التعلم',
    adaptiveSetupTitle: 'اختبار تكيّفي',
    adaptiveSetupSubtitle: 'تتكيّف الصعوبة مع مستواك',
    themeBannerTitle: 'اختبار موضوعي',
    themeBannerSub: 'اختبر نفسك في موضوع محدد',
    themeSelectTitle: 'اختبار موضوعي',
    themeSelectSubtitle: 'اختر موضوعاً للتدرّب عليه',
    dictBannerTitle: 'القاموس',
    dictBannerSub: 'تصفح جميع الكلمات',
    dictScreenTitle: 'القاموس',
    dictScreenSubtitle: 'جميع الكلمات',
    dictBack: '→ رجوع',
    dictFilterPlaceholder: 'ابحث عن كلمة…',
    dictLoading: 'جارٍ التحميل…',
    dictEmpty: 'لا توجد كلمات.',
    typeBadge: { Noun: 'اسم', Verb: 'فعل', Adjective: 'صفة', Phrase: 'عبارة', Adverb: 'ظرف', Word: 'كلمة' },
    signedInAs: 'تسجيل الدخول باسم:',
    signOut: 'تسجيل الخروج',
    practiceBannerTitle: 'تدريب',
    practiceBannerSub: 'اقلب البطاقات لتعلم الكلمات',
    practiceSetupTitle: 'تدريب',
    practiceSetupSub: '',
    practiceSubtitle: 'اقلب البطاقة لرؤية المعنى',
    practiceMeaningLabel: 'المعنى',
    practiceFilterDifficulty: 'الصعوبة',
    practiceFilterType: 'نوع الكلمة',
    practiceFilterArticle: 'أداة التعريف (الأسماء)',
    practiceFilterTopics: 'المواضيع',
    practiceFilterAll: 'الكل',
    practiceClearFilters: 'مسح الفلاتر',
    practiceWordCount: 'كلمة في مجموعتك',
    practiceNoWordsHint: 'لا توجد كلمات مطابقة — غيّر المستوى أو الفلاتر.',
    offlineTitle: 'أنت غير متصل',
    offlineMessage: 'يحتاج هذا التطبيق إلى اتصال بالإنترنت للعمل.',
    offlineRefreshBtn: 'تحديث',
    offlineChecking: 'جارٍ التحقق…',
    practiceDoneTitle: 'اكتمل',
    practiceDoneSub: 'جارٍ تحميل الصعوبة التالية…',
    errLoadQuiz: 'تعذّر تحميل بيانات الاختبار.',
    errLoadQuizLevel: (lv) => 'تعذّر تحميل بيانات اختبار ' + lv + '.',
    errNoCards: 'لا توجد بطاقات!',
    errNoWords: 'لا توجد كلمات متاحة!',
    errNoWordsTopic: 'لا توجد كلمات كافية لهذا الموضوع بعد.',
    errCompleteAdaptiveFirst: 'أكمل اختباراً تكيّفياً أولاً ليكون لديك كلمات للمراجعة.',
    errSwipePrepare: 'تعذّر تجهيز بطاقات السحب.',
    errNoPracticeCards: 'لم يتم العثور على بطاقات تدريب.',
    errLoadPractice: 'تعذّر تحميل بيانات التدريب.',
    errFileProtocol: ' افتح التطبيق عبر خادم محلي بدلاً من file://.',
    adaptiveV2Badge: 'تكيّفي V2',
    adaptiveV2ReviewLabel: 'مراجعة B1',
    adaptiveV2ChallengeLabel: 'تحدي',
    shareSectionLabel: 'شارك هذا التطبيق',
    shareAppLabel: 'مشاركة',
    copyLinkLabel: 'نسخ الرابط',
    linkCopied: 'تم نسخ الرابط',
    shareUnavailable: 'المشاركة غير متاحة',
    shareFailed: 'فشلت المشاركة',
    rwTapFormHint: 'اضغط على شكل لرؤية مثال',
    categoryNames: {1:'الأعداد والكميات',2:'الوقت والتقويم',3:'العائلة والعلاقات',4:'الجسم والصحة',5:'الطعام والشراب',6:'المنزل والمعيشة',7:'الملابس والمظهر',8:'العمل والمهن',9:'التعليم والتعلم',10:'السفر والسياحة',11:'المواصلات',12:'التسوق والمال',13:'اللغة والتواصل والإعلام',14:'الطبيعة والطقس والحيوانات',15:'الرياضة وأوقات الفراغ',16:'الفنون والثقافة',17:'التكنولوجيا والأجهزة',18:'المجتمع والقانون والسياسة',19:'المشاعر وسمات الشخصية',20:'الأماكن والجغرافيا',21:'قواعد اللغة والكلمات الوظيفية'},
  }
};

const PROFILE_I18N = {
  en: {
    title: 'Learning Profile',
    adaptive: 'Adaptive',
    overview: 'Overview', activity: 'Activity', performance: 'Performance', review: 'Review',
    wordsSeen: 'Words Seen', wordsStruggling: 'Words Struggling', wordsMastered: 'Words Mastered', accuracyPct: 'Accuracy %', wordsReviewed: 'Words Reviewed',
    quizzesCompleted: 'Quizzes Completed', correctAnswers: 'Correct Answers', incorrectAnswers: 'Incorrect Answers', totalStudyTime: 'Total Study Time',
    strongest: 'Strongest', needsPractice: 'Needs Practice', notEnoughCategoryData: 'Not enough category data yet',
    topics: 'Topics', topicCoverage: 'Coverage', topicAccuracy: 'Accuracy', practiceTopic: 'Practice',
    reviewWeakWords: 'Review Weak Words', reviewRecentMistakes: 'Review Recent Mistakes', reviewMixedPractice: 'Review Mixed Practice',
    seenWords: 'Seen Words', strugglingWords: 'Struggling Words', masteredWords: 'Mastered Words',
    loadingLevelWords: 'Loading words for this level...', noWordsInList: 'No words available in this list yet.',
    signInUnlock: 'Sign in to unlock:',
    signInBtn: 'Sign in',
    signInPrompt: 'Sign in to sync your progress across devices.',
    guestProfileEmpty: 'Complete a quiz at this level to see stats here.',
    noTrackedFor: 'No tracked data for {level}. Try the {best} tab.',
    adaptiveBand: 'CEFR band',
    adaptiveSkill: 'Skill level',
    journeySeenShort: '{pct}% seen',
    journeyGoldShort: 'Your level',
    journeyGoldHint: 'wide = calibrating · narrow = confident',
    resetAdaptiveProgress: 'Reset adaptive progress',
    resetAdaptiveConfirm: 'Reset all Adaptive V2 progress? This deletes your word history, skill level, and calibration. This cannot be undone.',
    metaSeen: 'Seen', metaRight: 'Right', metaWrong: 'Wrong',
    uncategorized: 'Uncategorized'
  },
  de: {
    title: 'Lernprofil',
    adaptive: 'Adaptiv',
    overview: 'Überblick', activity: 'Aktivität', performance: 'Leistung', review: 'Wiederholen',
    wordsSeen: 'Gesehene Wörter', wordsStruggling: 'Schwierige Wörter', wordsMastered: 'Gemeisterte Wörter', accuracyPct: 'Genauigkeit %', wordsReviewed: 'Überprüfte Wörter',
    quizzesCompleted: 'Abgeschlossene Quizze', correctAnswers: 'Richtige Antworten', incorrectAnswers: 'Falsche Antworten', totalStudyTime: 'Gesamtlernzeit',
    strongest: 'Stärkste Bereiche', needsPractice: 'Mehr Übung nötig', notEnoughCategoryData: 'Noch nicht genug Kategoriedaten',
    reviewWeakWords: 'Schwache Wörter wiederholen', reviewRecentMistakes: 'Letzte Fehler wiederholen', reviewMixedPractice: 'Gemischte Wiederholung',
    seenWords: 'Gesehene Wörter', strugglingWords: 'Schwierige Wörter', masteredWords: 'Gemeisterte Wörter',
    loadingLevelWords: 'Wörter für dieses Niveau werden geladen...', noWordsInList: 'Noch keine Wörter in dieser Liste.',
    signInUnlock: 'Anmelden zum Freischalten:',
    signInBtn: 'Anmelden',
    signInPrompt: 'Melde dich an, um deinen Fortschritt geräteübergreifend zu synchronisieren.',
    guestProfileEmpty: 'Spiele ein Quiz auf diesem Niveau, um hier Statistiken zu sehen.',
    noTrackedFor: 'Keine erfassten Daten für {level}. Wechsle zum Tab {best}.',
    adaptiveBand: 'CEFR-Niveau',
    adaptiveSkill: 'Fähigkeitsstufe',
    journeySeenShort: '{pct}% gesehen',
    journeyGoldShort: 'Dein Niveau',
    journeyGoldHint: 'breit = kalibrieren · schmal = sicher',
    resetAdaptiveProgress: 'Adaptiven Fortschritt zurücksetzen',
    resetAdaptiveConfirm: 'Gesamten adaptiven V2-Fortschritt zurücksetzen? Wortverlauf, Niveau und Kalibrierung werden gelöscht. Das kann nicht rückgängig gemacht werden.',
    metaSeen: 'Gesehen', metaRight: 'Richtig', metaWrong: 'Falsch',
    uncategorized: 'Ohne Kategorie',
    topics: 'Themen', topicCoverage: 'Abdeckung', topicAccuracy: 'Genauigkeit', practiceTopic: 'Üben'
  },
  tr: {
    title: 'Öğrenme Profili',
    adaptive: 'Uyarlamalı',
    overview: 'Genel Bakış', activity: 'Aktivite', performance: 'Performans', review: 'Tekrar',
    wordsSeen: 'Görülen Kelimeler', wordsStruggling: 'Zorlanılan Kelimeler', wordsMastered: 'Uzmanlaşılan Kelimeler', accuracyPct: 'Doğruluk %', wordsReviewed: 'İncelenen Kelimeler',
    quizzesCompleted: 'Tamamlanan Quizler', correctAnswers: 'Doğru Cevaplar', incorrectAnswers: 'Yanlış Cevaplar', totalStudyTime: 'Toplam Çalışma Süresi',
    strongest: 'En Güçlü Alanlar', needsPractice: 'Daha Fazla Pratik', notEnoughCategoryData: 'Henüz yeterli kategori verisi yok',
    reviewWeakWords: 'Zayıf Kelimeleri Tekrar Et', reviewRecentMistakes: 'Son Hataları Tekrar Et', reviewMixedPractice: 'Karışık Tekrar',
    seenWords: 'Görülen Kelimeler', strugglingWords: 'Zorlanılan Kelimeler', masteredWords: 'Uzmanlaşılan Kelimeler',
    loadingLevelWords: 'Bu seviye için kelimeler yükleniyor...', noWordsInList: 'Bu listede henüz kelime yok.',
    signInUnlock: 'Kilidi açmak için giriş yap:',
    signInBtn: 'Giriş yap',
    signInPrompt: 'İlerlemenizi cihazlar arasında senkronize etmek için giriş yapın.',
    guestProfileEmpty: 'Burada istatistik görmek için bu seviyede bir quiz tamamlayın.',
    noTrackedFor: '{level} için takip edilen veri yok. {best} sekmesini dene.',
    adaptiveBand: 'CEFR seviyesi',
    adaptiveSkill: 'Yetenek seviyesi',
    journeySeenShort: '%{pct} görüldü',
    journeyGoldShort: 'Seviyeniz',
    journeyGoldHint: 'geniş = kalibrasyon · dar = emin',
    resetAdaptiveProgress: 'Uyarlamalı ilerlemeyi sıfırla',
    resetAdaptiveConfirm: 'Tüm Uyarlamalı V2 ilerlemesini sıfırla? Kelime geçmişi, seviye ve kalibrasyon silinir. Bu geri alınamaz.',
    metaSeen: 'Görüldü', metaRight: 'Doğru', metaWrong: 'Yanlış',
    uncategorized: 'Kategorisiz',
    topics: 'Konular', topicCoverage: 'Kapsam', topicAccuracy: 'Doğruluk', practiceTopic: 'Pratik'
  },
  fa: {
    title: 'پروفایل یادگیری',
    adaptive: 'تطبیقی',
    overview: 'نمای کلی', activity: 'فعالیت', performance: 'عملکرد', review: 'مرور',
    wordsSeen: 'واژه‌های دیده‌شده', wordsStruggling: 'واژه‌های دشوار', wordsMastered: 'واژه‌های مسلط', accuracyPct: 'دقت ٪', wordsReviewed: 'واژه‌های مرورشده',
    quizzesCompleted: 'کوئیزهای تکمیل‌شده', correctAnswers: 'پاسخ‌های درست', incorrectAnswers: 'پاسخ‌های نادرست', totalStudyTime: 'کل زمان مطالعه',
    strongest: 'قوی‌ترین دسته‌ها', needsPractice: 'نیاز به تمرین', notEnoughCategoryData: 'هنوز دادهٔ کافی برای دسته‌ها نیست',
    reviewWeakWords: 'مرور واژه‌های ضعیف', reviewRecentMistakes: 'مرور اشتباهات اخیر', reviewMixedPractice: 'مرور ترکیبی',
    seenWords: 'واژه‌های دیده‌شده', strugglingWords: 'واژه‌های دشوار', masteredWords: 'واژه‌های مسلط',
    loadingLevelWords: 'در حال بارگذاری واژه‌های این سطح...', noWordsInList: 'هنوز واژه‌ای در این فهرست نیست.',
    signInUnlock: 'برای باز کردن قفل وارد شوید:',
    signInBtn: 'ورود',
    signInPrompt: 'برای همگام‌سازی پیشرفت بین دستگاه‌ها وارد شوید.',
    guestProfileEmpty: 'برای دیدن آمار این سطح، یک آزمون کامل کنید.',
    noTrackedFor: 'برای {level} دادهٔ ثبت‌شده‌ای نیست. تب {best} را امتحان کنید.',
    adaptiveBand: 'سطح CEFR',
    adaptiveSkill: 'سطح مهارت',
    journeySeenShort: '{pct}٪ دیده‌شده',
    journeyGoldShort: 'سطح شما',
    journeyGoldHint: 'عریض = کالیبراسیون · باریک = اطمینان',
    resetAdaptiveProgress: 'بازنشانی پیشرفت تطبیقی',
    resetAdaptiveConfirm: 'همهٔ پیشرفت تطبیقی V2 بازنشانی شود؟ تاریخچهٔ واژه‌ها، سطح و کالیبراسیون حذف می‌شود. این کار برگشت‌پذیر نیست.',
    metaSeen: 'دیده', metaRight: 'درست', metaWrong: 'نادرست',
    uncategorized: 'بدون دسته',
    topics: 'موضوعات', topicCoverage: 'پوشش', topicAccuracy: 'دقت', practiceTopic: 'تمرین'
  },
  ru: {
    title: 'Профиль обучения',
    adaptive: 'Адаптив',
    overview: 'Обзор', activity: 'Активность', performance: 'Результаты', review: 'Повторение',
    wordsSeen: 'Просмотрено слов', wordsStruggling: 'Сложные слова', wordsMastered: 'Освоенные слова', accuracyPct: 'Точность %', wordsReviewed: 'Повторенные слова',
    quizzesCompleted: 'Завершено викторин', correctAnswers: 'Правильные ответы', incorrectAnswers: 'Неправильные ответы', totalStudyTime: 'Общее время обучения',
    strongest: 'Сильные категории', needsPractice: 'Нужно подтянуть', notEnoughCategoryData: 'Недостаточно данных по категориям',
    reviewWeakWords: 'Повторить слабые слова', reviewRecentMistakes: 'Повторить недавние ошибки', reviewMixedPractice: 'Смешанная практика',
    seenWords: 'Просмотренные слова', strugglingWords: 'Сложные слова', masteredWords: 'Освоенные слова',
    loadingLevelWords: 'Загрузка слов для этого уровня...', noWordsInList: 'В этом списке пока нет слов.',
    signInUnlock: 'Войдите, чтобы разблокировать:',
    signInBtn: 'Войти',
    signInPrompt: 'Войдите, чтобы синхронизировать прогресс между устройствами.',
    guestProfileEmpty: 'Пройдите викторину на этом уровне, чтобы увидеть статистику.',
    noTrackedFor: 'Нет данных для {level}. Попробуйте вкладку {best}.',
    adaptiveBand: 'Уровень CEFR',
    adaptiveSkill: 'Уровень навыка',
    journeySeenShort: '{pct}% просмотрено',
    journeyGoldShort: 'Ваш уровень',
    journeyGoldHint: 'широко = калибровка · узко = уверенно',
    resetAdaptiveProgress: 'Сбросить адаптивный прогресс',
    resetAdaptiveConfirm: 'Сбросить весь прогресс Adaptive V2? История слов, уровень и калибровка будут удалены. Это нельзя отменить.',
    metaSeen: 'Просм.', metaRight: 'Верно', metaWrong: 'Неверно',
    uncategorized: 'Без категории',
    topics: 'Темы', topicCoverage: 'Охват', topicAccuracy: 'Точность', practiceTopic: 'Практика'
  },
  uk: {
    title: 'Профіль навчання',
    adaptive: 'Адаптив',
    overview: 'Огляд', activity: 'Активність', performance: 'Результати', review: 'Повторення',
    wordsSeen: 'Переглянуто слів', wordsStruggling: 'Складні слова', wordsMastered: 'Опановані слова', accuracyPct: 'Точність %', wordsReviewed: 'Повторені слова',
    quizzesCompleted: 'Завершено вікторин', correctAnswers: 'Правильні відповіді', incorrectAnswers: 'Неправильні відповіді', totalStudyTime: 'Загальний час навчання',
    strongest: 'Найсильніші категорії', needsPractice: 'Потрібно попрактикувати', notEnoughCategoryData: 'Недостатньо даних за категоріями',
    reviewWeakWords: 'Повторити слабкі слова', reviewRecentMistakes: 'Повторити недавні помилки', reviewMixedPractice: 'Змішана практика',
    seenWords: 'Переглянуті слова', strugglingWords: 'Складні слова', masteredWords: 'Опановані слова',
    loadingLevelWords: 'Завантаження слів для цього рівня...', noWordsInList: 'У цьому списку поки немає слів.',
    signInUnlock: 'Увійдіть, щоб розблокувати:',
    signInBtn: 'Увійти',
    signInPrompt: 'Увійдіть, щоб синхронізувати прогрес між пристроями.',
    guestProfileEmpty: 'Пройдіть вікторину на цьому рівні, щоб побачити статистику.',
    noTrackedFor: 'Немає даних для {level}. Спробуйте вкладку {best}.',
    adaptiveBand: 'Рівень CEFR',
    adaptiveSkill: 'Рівень навички',
    journeySeenShort: '{pct}% переглянуто',
    journeyGoldShort: 'Ваш рівень',
    journeyGoldHint: 'широко = калібрування · вузько = впевнено',
    resetAdaptiveProgress: 'Скинути адаптивний прогрес',
    resetAdaptiveConfirm: 'Скинути весь прогрес Adaptive V2? Історія слів, рівень і калібрування будуть видалені. Це не можна скасувати.',
    metaSeen: 'Перегл.', metaRight: 'Прав.', metaWrong: 'Неправ.',
    uncategorized: 'Без категорії',
    topics: 'Теми', topicCoverage: 'Охоплення', topicAccuracy: 'Точність', practiceTopic: 'Практика'
  },
  ar: {
    title: 'ملف التعلم',
    adaptive: 'تكيّفي',
    overview: 'نظرة عامة', activity: 'النشاط', performance: 'الأداء', review: 'مراجعة',
    wordsSeen: 'الكلمات التي تمت رؤيتها', wordsStruggling: 'الكلمات الصعبة', wordsMastered: 'الكلمات المتقنة', accuracyPct: 'الدقة %', wordsReviewed: 'الكلمات المُراجَعة',
    quizzesCompleted: 'الاختبارات المكتملة', correctAnswers: 'الإجابات الصحيحة', incorrectAnswers: 'الإجابات الخاطئة', totalStudyTime: 'إجمالي وقت الدراسة',
    strongest: 'أقوى الفئات', needsPractice: 'تحتاج إلى تدريب', notEnoughCategoryData: 'لا توجد بيانات فئات كافية بعد',
    reviewWeakWords: 'مراجعة الكلمات الضعيفة', reviewRecentMistakes: 'مراجعة الأخطاء الأخيرة', reviewMixedPractice: 'مراجعة مختلطة',
    seenWords: 'الكلمات التي تمت رؤيتها', strugglingWords: 'الكلمات الصعبة', masteredWords: 'الكلمات المتقنة',
    loadingLevelWords: 'جارٍ تحميل كلمات هذا المستوى...', noWordsInList: 'لا توجد كلمات في هذه القائمة بعد.',
    signInUnlock: 'سجّل الدخول للفتح:',
    signInBtn: 'تسجيل الدخول',
    signInPrompt: 'سجّل الدخول لمزامنة تقدمك عبر الأجهزة.',
    guestProfileEmpty: 'أكمل اختباراً على هذا المستوى لرؤية الإحصائيات هنا.',
    noTrackedFor: 'لا توجد بيانات متتبعة للمستوى {level}. جرّب تبويب {best}.',
    adaptiveBand: 'مستوى CEFR',
    adaptiveSkill: 'مستوى المهارة',
    journeySeenShort: '{pct}% شوهد',
    journeyGoldShort: 'مستواك',
    journeyGoldHint: 'عريض = معايرة · ضيق = ثقة',
    resetAdaptiveProgress: 'إعادة تعيين التقدم التكيّفي',
    resetAdaptiveConfirm: 'إعادة تعيين كل تقدم Adaptive V2؟ سيتم حذف سجل الكلمات والمستوى والمعايرة. لا يمكن التراجع عن ذلك.',
    metaSeen: 'شوهد', metaRight: 'صحيح', metaWrong: 'خطأ',
    uncategorized: 'غير مصنف',
    topics: 'المواضيع', topicCoverage: 'التغطية', topicAccuracy: 'الدقة', practiceTopic: 'تدريب'
  }
};

function _lp(key, vars) {
  var dict = PROFILE_I18N[LANG] || PROFILE_I18N.en;
  var text = dict[key] || PROFILE_I18N.en[key] || '';
  if (vars && typeof text === 'string') {
    Object.keys(vars).forEach(function(k) {
      text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), formatNumStr(String(vars[k])));
    });
  }
  return text;
}

// ════════════════════════════════════════════════════════════════
//  CATEGORY MAP — 21 vocabulary categories, ID 1–21
// ════════════════════════════════════════════════════════════════
var CATEGORY_MAP = [
  { id:  1, name: 'Numbers & Quantities',            icon: '🔢', c1: 'rgba(126,184,247,.12)', c2: 'rgba(183,138,247,.08)', b: 'rgba(126,184,247,.28)', bl: 'rgb(74 119 159)',  br: 'rgb(64 97 127)'   },
  { id:  2, name: 'Time & Calendar',                 icon: '🕐', c1: 'rgba(183,138,247,.12)', c2: 'rgba(126,184,247,.08)', b: 'rgba(183,138,247,.28)', bl: 'rgb(117 81 159)',  br: 'rgb(111 77 150)'  },
  { id:  3, name: 'Family & Relationships',          icon: '👨‍👩‍👧', c1: 'rgba(247,138,168,.12)', c2: 'rgba(183,138,247,.08)', b: 'rgba(247,138,168,.28)', bl: 'rgb(146 90 108)',  br: 'rgb(127 78 94)'   },
  { id:  4, name: 'Body & Health',                   icon: '🏥', c1: 'rgba(247,100,120,.12)', c2: 'rgba(247,138,168,.08)', b: 'rgba(247,100,120,.28)', bl: 'rgb(146 65 77)',   br: 'rgb(127 55 66)'   },
  { id:  5, name: 'Food & Drink',                    icon: '🍽️', c1: 'rgba(247,170,80,.12)',  c2: 'rgba(232,201,122,.08)', b: 'rgba(247,170,80,.28)',  bl: 'rgb(146 111 51)',  br: 'rgb(127 95 44)'   },
  { id:  6, name: 'Home & Living',                   icon: '🏠', c1: 'rgba(232,201,122,.12)', c2: 'rgba(247,170,80,.08)',  b: 'rgba(232,201,122,.28)', bl: 'rgb(121 107 68)',  br: 'rgb(111 98 62)'   },
  { id:  7, name: 'Clothing & Appearance',           icon: '👗', c1: 'rgba(247,138,183,.12)', c2: 'rgba(183,138,247,.08)', b: 'rgba(247,138,183,.28)', bl: 'rgb(146 90 117)',  br: 'rgb(127 78 101)'  },
  { id:  8, name: 'Work & Careers',                  icon: '💼', c1: 'rgba(100,220,190,.12)', c2: 'rgba(107,232,160,.08)', b: 'rgba(100,220,190,.28)', bl: 'rgb(59 143 122)',  br: 'rgb(51 123 105)'  },
  { id:  9, name: 'Education & Learning',            icon: '📚', c1: 'rgba(100,170,247,.12)', c2: 'rgba(100,220,190,.08)', b: 'rgba(100,170,247,.28)', bl: 'rgb(59 111 158)',  br: 'rgb(51 95 127)'   },
  { id: 10, name: 'Travel & Tourism',                icon: '✈️', c1: 'rgba(100,210,247,.12)', c2: 'rgba(126,184,247,.08)', b: 'rgba(100,210,247,.28)', bl: 'rgb(59 137 158)',  br: 'rgb(51 117 127)'  },
  { id: 11, name: 'Transportation',                  icon: '🚗', c1: 'rgba(126,184,247,.12)', c2: 'rgba(100,210,247,.08)', b: 'rgba(126,184,247,.28)', bl: 'rgb(74 119 159)',  br: 'rgb(64 97 127)'   },
  { id: 12, name: 'Shopping & Finance',              icon: '🛍️', c1: 'rgba(247,138,168,.12)', c2: 'rgba(232,201,122,.08)', b: 'rgba(247,138,168,.28)', bl: 'rgb(146 90 108)',  br: 'rgb(127 78 94)'   },
  { id: 13, name: 'Language, Communication & Media', icon: '💬', c1: 'rgba(107,232,160,.12)', c2: 'rgba(126,184,247,.08)', b: 'rgba(107,232,160,.28)', bl: 'rgb(69 127 90)',   br: 'rgb(54 95 69)'    },
  { id: 14, name: 'Nature, Weather & Animals',       icon: '🌿', c1: 'rgba(107,232,160,.12)', c2: 'rgba(100,210,180,.08)', b: 'rgba(107,232,160,.28)', bl: 'rgb(69 127 90)',   br: 'rgb(54 95 69)'    },
  { id: 15, name: 'Sports & Leisure',                icon: '⚽', c1: 'rgba(150,220,100,.12)', c2: 'rgba(232,201,122,.08)', b: 'rgba(150,220,100,.28)', bl: 'rgb(89 143 64)',   br: 'rgb(77 123 55)'   },
  { id: 16, name: 'Arts & Culture',                  icon: '🎨', c1: 'rgba(247,140,80,.12)',  c2: 'rgba(247,138,168,.08)', b: 'rgba(247,140,80,.28)',  bl: 'rgb(146 91 51)',   br: 'rgb(127 78 44)'   },
  { id: 17, name: 'Technology & Devices',            icon: '💻', c1: 'rgba(80,220,240,.12)',  c2: 'rgba(126,184,247,.08)', b: 'rgba(80,220,240,.28)',  bl: 'rgb(47 143 154)',  br: 'rgb(40 123 132)'  },
  { id: 18, name: 'Society, Law & Politics',         icon: '⚖️', c1: 'rgba(232,201,122,.12)', c2: 'rgba(247,170,80,.08)',  b: 'rgba(232,201,122,.28)', bl: 'rgb(121 107 68)',  br: 'rgb(111 98 62)'   },
  { id: 19, name: 'Emotions & Personal Traits',      icon: '❤️', c1: 'rgba(247,80,100,.12)',  c2: 'rgba(247,138,168,.08)', b: 'rgba(247,80,100,.28)',  bl: 'rgb(146 52 64)',   br: 'rgb(127 44 55)'   },
  { id: 20, name: 'Places & Geography',              icon: '🗺️', c1: 'rgba(80,200,200,.12)',  c2: 'rgba(126,184,247,.08)', b: 'rgba(80,200,200,.28)',  bl: 'rgb(47 130 128)',  br: 'rgb(40 112 110)'  },
  { id: 21, name: 'Grammar & Function Words',        icon: '📝', c1: 'rgba(232,201,122,.12)', c2: 'rgba(126,184,247,.08)', b: 'rgba(232,201,122,.28)', bl: 'rgb(121 107 68)',  br: 'rgb(111 98 62)'   },
];


// ══════════════════════════════════════════════════════════════════
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
var practiceSelectedLevel = 'A1';
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
var learningProfileDetailMode = null;
var learningProfileLastDetailHtml = '';
var _quizStartedAtMs = 0;
var _rwFirstLoad = false;
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

// ── Settings drawer ──
function openSettings() {
  window.umami?.track('settings_opened');
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
  var backBtn = document.getElementById('app-back-btn');
  if (backBtn && !backBtn.classList.contains('hidden')) {
    backBtn.innerHTML = _backArrowSvg(isRtl);
  }
  applyTranslations();
  updateCounts();
  _renderCategoryGrid();
  // Immediately update the active screen so the user sees the new language at once
  if (!document.getElementById('screen-quiz').classList.contains('hidden')) {
    _quizRefreshLang();
  } else if (!document.getElementById('screen-swipe').classList.contains('hidden')) {
    _swipeRefreshLang();
  } else if (!document.getElementById('screen-random').classList.contains('hidden')) {
    _explorerRefreshLang();
  } else if (!document.getElementById('screen-theme-select').classList.contains('hidden')) {
    // already re-rendered unconditionally above
  } else if (!document.getElementById('screen-dictionary').classList.contains('hidden')) {
    if (_dictLoaded) _renderDictList(document.getElementById('dict-search-input').value, true);
  } else if (!document.getElementById('screen-practice').classList.contains('hidden')) {
    _practiceRefreshCards();
  } else if (!document.getElementById('screen-learning-profile').classList.contains('hidden')) {
    renderLearningProfile();
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
  // Quiz buttons (back buttons are now in app-header, not in screens)
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
  document.getElementById('learning-profile-banner-title').textContent = _lp('title');
  document.getElementById('learning-profile-title').textContent = _lp('title');
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
  // Practice banner + setup screen
  document.getElementById('practice-banner-title').textContent = u.practiceBannerTitle;
  document.getElementById('practice-banner-sub').textContent = u.practiceBannerSub;
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
  if (!document.getElementById('screen-practice-setup').classList.contains('hidden')) {
    _renderPracticeSetupFilters();
    _updatePracticeMatchCount();
  }
  // Dictionary screen
  var _dbt = document.getElementById('dict-banner-title');
  if (_dbt) _dbt.textContent = u.dictBannerTitle;
  var _dbs = document.getElementById('dict-banner-sub');
  if (_dbs) _dbs.textContent = u.dictBannerSub;
  document.getElementById('dict-screen-title').textContent = u.dictScreenTitle;
  if (!_dictLoaded) document.getElementById('dict-screen-subtitle').textContent = u.dictScreenSubtitle;
  document.getElementById('dict-search-input').placeholder = u.dictFilterPlaceholder;
  var _dlt = document.getElementById('dict-loading-text');
  if (_dlt) _dlt.textContent = u.dictLoading;
  // Refresh meanings immediately if dictionary is open
  if (_dictLoaded && !document.getElementById('screen-dictionary').classList.contains('hidden')) {
    _renderDictList(document.getElementById('dict-search-input').value, true);
  }
  // Offline screen
  var _os = document.getElementById('offline-title');
  if (_os) _os.textContent = u.offlineTitle;
  var _om = document.getElementById('offline-message');
  if (_om) _om.textContent = u.offlineMessage;
  var _or = document.getElementById('offline-refresh-btn');
  if (_or) _or.textContent = u.offlineRefreshBtn;
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
  var actions = document.querySelector('.home-actions');
  if (actions) actions.classList.add('profile-visible');
  var profile = document.getElementById('learning-profile-banner');
  if (profile) profile.classList.remove('hidden');
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
      V2_VOCAB = parsed;
      V2_QUIZ_ROWS = Object.keys(parsed).map(function(id) {
        return _v2EntryToRow(id, parsed[id]);
      }).filter(function(r) {
        return r.translation_en && r.translation_en.trim();
      });
      if (!V2_QUIZ_ROWS.length) throw new Error('Vocabulary parsed but produced 0 quiz rows');
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

function _v2ResolveRowId(level, id) {
  var sid = String(id);
  if (level === 'ALL') return sid;
  var row = _v2RowLookup(level, sid);
  return row ? String(row.id) : _v2ToUnifiedId(level, sid);
}

function _v2RowLookup(level, id) {
  var sid = String(id);
  if (level === 'ALL') {
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
    fb.className = 'feedback w show';
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
  var elapsedSeconds = _quizStartedAtMs ? Math.max(0, Math.round((Date.now() - _quizStartedAtMs) / 1000)) : 0;
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
function goHome(){show('screen-levels');}
function goQuizBack(){var t=_quizReturnScreen;_quizReturnScreen='screen-levels';window.goHome();show(t);}
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
  _quizStartedAtMs = Date.now();
  startLevel(adaptiveSelectedLevel);
}

function openAdaptiveV2() {
  window.umami?.track('adaptive_v2_opened');
  if (typeof window._adaptiveV2RefreshBadge === 'function') window._adaptiveV2RefreshBadge();
  _quizStartedAtMs = Date.now();
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
    var badge = _categoryGridBadge(cat.id);
    return '<button class="category-card" style="background:linear-gradient(135deg,' + cat.c1 + ',' + cat.c2 + ');border-left:1px solid ' + cat.bl + ';border-right:1px solid ' + cat.br + '" onclick="startThemeQuiz(' + cat.id + ')">'
      + '<span class="cat-icon">' + cat.icon + '</span>'
      + '<span class="cat-name">' + escHtml(catNames[cat.id] || cat.name) + '</span>'
      + badge
      + '</button>';
  }).join('');
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
  _quizStartedAtMs = Date.now();
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
  if (progress && progress.quizStats && progress.quizStats.theme && progress.quizStats.theme[catKey]) {
    (progress.quizStats.theme[catKey].seenWordIds || []).forEach(function(id) {
      themeSeenMeta[String(id)] = true;
    });
  }
  function readStat(row) {
    if (progress && typeof window._adaptiveV2ReadWordStat === 'function') {
      return window._adaptiveV2ReadWordStat(progress, row.id);
    }
    return { themeSeenCount: 0, failScore: 0 };
  }
  function diffGap(row) {
    var d = parseInt(row.difficulty, 10);
    if (!(d >= 1 && d <= 10)) return 99;
    return Math.abs(d - skillLevel);
  }
  function bucket(row) {
    var st = readStat(row);
    var themeSeen = Number(st.themeSeenCount) || 0;
    if (themeSeen === 0 && !themeSeenMeta[String(row.id)]) return 0;
    if ((Number(st.failScore) || 0) > 0) return 1;
    return 2;
  }
  var sorted = pool.slice().sort(function(a, b) {
    var ba = bucket(a);
    var bb = bucket(b);
    if (ba !== bb) return ba - bb;
    if (ba === 2) {
      var ta = Number(readStat(a).themeSeenCount) || 0;
      var tb = Number(readStat(b).themeSeenCount) || 0;
      if (ta !== tb) return ta - tb;
    }
    var da = diffGap(a);
    var db = diffGap(b);
    if (da !== db) return da - db;
    return Math.random() - 0.5;
  });
  var selected = [];
  var used = {};
  sorted.forEach(function(r) {
    if (selected.length >= QUIZ_LEN || used[r.id]) return;
    used[r.id] = true;
    selected.push(r);
  });
  if (selected.length < QUIZ_LEN) {
    shuffle(pool).forEach(function(r) {
      if (selected.length >= QUIZ_LEN || used[r.id]) return;
      used[r.id] = true;
      selected.push(r);
    });
  }
  return _buildThemeQueueFromV2Rows(selected);
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
  _ensureHomeLayout();
  learningProfileSelectedLevel = 'ALL';
  _setLearningProfileTabActive(learningProfileSelectedLevel);
  window.umami?.track('learning_profile_opened');
  show('screen-learning-profile');
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
    return '<div class="profile-empty">' + escHtml(_lp('notEnoughCategoryData')) + '</div>';
  }
  return topics.map(function(topic) {
    return '<div class="profile-topic-row">'
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
      + '<button type="button" class="profile-topic-btn" onclick="startThemeQuiz(' + topic.id + ')">'
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
    return '<div class="profile-empty" style="margin-top:10px;">' + escHtml(_lp('noWordsInList')) + '</div>';
  }
  var items = rows.map(function(w) {
    return '<div class="profile-word-item">'
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
    var cls = 'profile-stat';
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
      : '<div class="profile-empty" style="margin-top:10px;">' + escHtml(_lp('loadingLevelWords')) + '</div>';
  } else if (learningProfileDetailMode === 'struggling') {
    detailHtml = detailsCsvReady
      ? _profileWordListHtml(_lp('strugglingWords'), strugglingListRows)
      : '<div class="profile-empty" style="margin-top:10px;">' + escHtml(_lp('loadingLevelWords')) + '</div>';
  } else if (learningProfileDetailMode === 'mastered') {
    detailHtml = detailsCsvReady
      ? _profileWordListHtml(_lp('masteredWords'), masteredListRows)
      : '<div class="profile-empty" style="margin-top:10px;">' + escHtml(_lp('loadingLevelWords')) + '</div>';
  }
  var detailIsOpen = !!learningProfileDetailMode;
  if (detailIsOpen && detailHtml) {
    learningProfileLastDetailHtml = detailHtml;
  }
  var detailPanelHtml =
    '<div id="profile-detail-wrap" class="profile-detail-wrap' + (detailIsOpen ? ' has-content' : '') + '">' +
      '<div class="profile-detail-inner">' + (learningProfileLastDetailHtml || '') + '</div>' +
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
    return '<button type="button" class="profile-review-btn' + reviewBtnClass + '"' + reviewBtnDisabled +
      (isGuest ? '' : ' onclick="startLearningProfileReview(\'' + mode + '\')"') + '>' +
      escHtml(label) + '</button>';
  }
  var reviewSectionHtml = isGuest
    ? '<div class="profile-signin-unlock">' +
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
    '<div class="profile-section"><div class="profile-section-title">' + escHtml(_lp('topics')) + '</div>' +
      topicsHtml +
    '</div>' +
    '<div class="profile-section"><div class="profile-section-title">' + escHtml(_lp('review')) + '</div>' +
      reviewSectionHtml +
    '</div>' +
    '<div class="profile-section profile-danger-zone">' +
      '<button type="button" class="profile-reset-btn" onclick="resetAdaptiveV2Progress()">' +
        escHtml(_lp('resetAdaptiveProgress')) +
      '</button></div>';

  if (detailIsOpen) {
    requestAnimationFrame(function() {
      var wrap = document.getElementById('profile-detail-wrap');
      if (wrap) wrap.classList.add('open');
    });
  }
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
  _quizStartedAtMs = Date.now();
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

function _getPracticeFilteredPool(level) {
  var pool = (CSV_QUIZ_DATA[level || practiceSelectedLevel] || []).filter(function(r) {
    return r.entry_type === 'main' && r.word && r.word.trim();
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

function _syncPracticeLayout() {
  var screen = document.getElementById('screen-practice-setup');
  var header = screen && screen.querySelector('.practice-setup-header');
  var scroll = document.getElementById('practice-setup-scroll');
  var footer = screen && screen.querySelector('.practice-setup-footer');
  if (!screen || screen.classList.contains('hidden') || !header || !scroll) return;
  scroll.style.paddingTop = Math.round(header.getBoundingClientRect().bottom + 14) + 'px';
  if (footer) {
    scroll.style.setProperty('--practice-scroll-pad', (footer.offsetHeight + 26) + 'px');
  }
}

if (typeof window !== 'undefined' && !window._practiceLayoutResizeBound) {
  window._practiceLayoutResizeBound = true;
  window.addEventListener('resize', function() {
    var scr = document.getElementById('screen-practice-setup');
    if (scr && !scr.classList.contains('hidden')) _syncPracticeLayout();
  });
}

function _updatePracticeMatchCount() {
  var count = _getPracticeFilteredPool(practiceSelectedLevel).length;
  var numEl = document.getElementById('practice-match-num');
  var wrapEl = document.getElementById('practice-match-count');
  var hintEl = document.getElementById('practice-match-hint');
  var btnEl = document.getElementById('practice-prepare-btn');
  if (numEl) numEl.textContent = formatNum(count);
  if (wrapEl) wrapEl.classList.toggle('is-empty', count === 0);
  if (hintEl) hintEl.classList.toggle('hidden', count > 0);
  if (btnEl) btnEl.disabled = count === 0;
  _syncPracticeLayout();
}

function _renderPracticeChip(group, key, label, extraClass, icon) {
  var active = key === PRACTICE_ALL_KEY
    ? _practiceGroupIsAll(group)
    : (!_practiceGroupIsAll(group) && !!(practiceFilters[group] && practiceFilters[group][key]));
  return '<button type="button" class="practice-chip' + (active ? ' active' : '') +
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

async function openPracticeSetup() {
  window.umami?.track('practice_opened');
  show('screen-practice-setup');
  var scrollEl = document.getElementById('practice-setup-scroll');
  if (scrollEl) scrollEl.scrollTop = 0;
  try {
    await _loadV2Vocab();
  } catch (e) {}
  _renderPracticeSetupFilters();
  _updatePracticeMatchCount();
  requestAnimationFrame(function() {
    _syncPracticeLayout();
    requestAnimationFrame(_syncPracticeLayout);
  });
}

function setPracticeLevel(lv) {
  practiceSelectedLevel = lv;
  ['A1','A2','B1'].forEach(function(k) {
    document.getElementById('practice-level-' + k).classList.toggle('active', k === lv);
  });
  _updatePracticeMatchCount();
}

function _buildPracticeBatch(level) {
  var all = _getPracticeFilteredPool(level);
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
  var pool = _getPracticeFilteredPool(practiceSelectedLevel);
  if (!pool.length) {
    _updatePracticeMatchCount();
    return;
  }
  var _ov = document.getElementById('quiz-prep-overlay');
  _ov.classList.add('active');
  try {
    await _loadCSVLevel(practiceSelectedLevel);
    practiceSeenIds = {};
    practiceDeck = _buildPracticeBatch(practiceSelectedLevel);
    if (!practiceDeck.length) { alert(t('errNoPracticeCards')); return; }
    practiceIdx = 0;
    practicePreloadPromise = null;
    practiceAnimating = false;
    window.umami?.track('practice_started', {
      level: practiceSelectedLevel,
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
    + '<div class="practice-front" dir="ltr">'
    + '<div class="practice-word">' + escHtml(word) + '</div>'
    + (example ? '<div class="practice-example">' + escHtml(example) + '</div>' : '')
    + '</div>'
    + '<div class="practice-back">'
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
    renderPracticeCards();
    practiceAnimating = false;
  }, 190);
}

function _ensurePracticePrefetch() {
  if (practicePreloadPromise) return;
  if (practiceDeck.length - practiceIdx > 5) return;
  practicePreloadPromise = Promise.resolve().then(function() {
    var batch = _buildPracticeBatch(practiceSelectedLevel);
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



// ── Screen switcher ──
var _appBackAction = function(){};
function _backArrowSvg(isRtl) {
  var pts = isRtl ? '10,6 0,0 0,12' : '0,6 10,0 10,12';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><polygon points="'+pts+'"/></svg>';
}
function show(id){
  ['screen-levels','screen-learning-profile','screen-quiz','screen-results','screen-random','screen-swipe-setup','screen-swipe','screen-adaptive-setup','screen-theme-select','screen-dictionary','screen-practice-setup','screen-practice'].forEach(s=>{
    document.getElementById(s).classList.toggle('hidden',s!==id);
  });
  document.body.classList.toggle('practice-setup-scroll-lock', id === 'screen-practice-setup');
  var btn = document.getElementById('app-back-btn');
  if (!btn) return;
  var isRtl = document.body.classList.contains('lang-rtl');
  var backMap = {
    'screen-quiz':             function(){ goQuizBack(); },
    'screen-results':          null,
    'screen-learning-profile': function(){ goHome(); },
    'screen-swipe-setup':      function(){ goHome(); },
    'screen-swipe':            function(){ openSwipeSetup(); },
    'screen-adaptive-setup':   function(){ goHome(); },
    'screen-theme-select':     function(){ goHome(); },
    'screen-random':           function(){ goHome(); },
    'screen-dictionary':       function(){ goHome(); },
    'screen-practice-setup':   function(){ goHome(); },
    'screen-practice':         function(){ openPracticeSetup(); }
  };
  var action = backMap[id];
  var show = !!action;
  btn.classList.toggle('hidden', !show);
  btn.innerHTML = _backArrowSvg(isRtl);
  _appBackAction = action || function(){};
}

function showOfflineScreen() {
  window.APP_OFFLINE = true;
  var el = document.getElementById('offline-screen');
  if (el) el.classList.remove('hidden');
}

function hideOfflineScreen() {
  window.APP_OFFLINE = false;
  var el = document.getElementById('offline-screen');
  if (el) el.classList.add('hidden');
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
// Handle click (desktop) + drag-to-close via the handle pill only (mobile)
(function() {
  var handle = document.querySelector('.drawer-handle');
  var drawer = document.getElementById('settings-drawer');
  if (!drawer) return;

  // Desktop: click the handle to dismiss
  if (handle) handle.addEventListener('click', function() { closeSettings(); });

  // Mobile drag-to-close — listen ONLY on the handle, not the whole drawer.
  // This means buttons in the drawer body receive clean, uninterrupted taps.
  if (!handle) return;

  var _startY, _dragging, _deltaY;

  handle.addEventListener('touchstart', function(e) {
    _startY = e.touches[0].clientY;
    _dragging = false;
    _deltaY = 0;
  }, { passive: true });

  handle.addEventListener('touchmove', function(e) {
    if (_startY === undefined) return;
    var dy = e.touches[0].clientY - _startY;
    if (dy > 0) e.preventDefault();
    if (!_dragging && dy > 8) {
      _dragging = true;
      drawer.style.transition = 'none';
    }
    if (_dragging) {
      _deltaY = Math.max(0, dy);
      drawer.style.transform = 'translateX(-50%) translateY(' + _deltaY + 'px)';
    }
  }, { passive: false });

  handle.addEventListener('touchend', function() {
    if (_startY === undefined) return;
    _startY = undefined;
    if (_dragging && _deltaY > 60) {
      drawer.style.transition = 'transform .2s ease-out';
      drawer.style.transform = 'translateX(-50%) translateY(calc(100% + 28px))';
      setTimeout(function() { closeSettings(); }, 210);
    } else {
      drawer.style.transition = '';
      drawer.style.transform = '';
    }
    _dragging = false;
    _deltaY = 0;
  });

  handle.addEventListener('touchcancel', function() {
    _startY = undefined;
    _dragging = false;
    _deltaY = 0;
    drawer.style.transition = '';
    drawer.style.transform = '';
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

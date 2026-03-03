# Goethe-Institut Wortlisten

## About
The Goethe-Institut is Germany's official international cultural and language
institution. Its German exam word lists (`Wortlisten`) are the most authoritative
CEFR-aligned vocabulary references for learners worldwide.

## Coverage
| File | Level | ~Words | Notes |
|------|-------|--------|-------|
| `a1_words.js` | A1 | 600 | Starter – survival communication |
| `a2_words.js` | A2 | 700 | Elementary – everyday topics |
| `b1_words.js` | B1 | 900 | Intermediate – independent use |
| `b2_words.js` | B2 | 800 | Upper-intermediate – complex topics |

## Data Schema (WORD_BANK)
```js
// Noun
{ source:'goethe', type:'Noun', word:'der Tisch', level:'A1',
  meaning_en:'table', meaning_tr:'masa', meaning_fa:'میز',
  cases:{Nominativ:'der Tisch', Akkusativ:'den Tisch',
          Dativ:'dem Tisch', Genitiv:'des Tisches'},
  plural:'die Tische', example:'...' }

// Verb
{ source:'goethe', type:'Verb', word:'arbeiten', level:'A1',
  meaning_en:'to work', meaning_tr:'çalışmak', meaning_fa:'کار کردن',
  conjugation:{ich:'arbeite', du:'arbeitest', 'er/sie/es':'arbeitet',
               wir:'arbeiten', ihr:'arbeitet', 'sie/Sie':'arbeiten'},
  präteritum:{ich:'arbeitete', ...}, perfekt:'hat gearbeitet', example:'...' }

// Adjective  
{ source:'goethe', type:'Adjective', word:'groß', level:'A1',
  meaning_en:'big / tall', meaning_tr:'büyük', meaning_fa:'بزرگ',
  comparative:'größer', superlative:'am größten', example:'...' }
```

## Quiz Cards Schema (VOCAB_CARDS)
```js
{ source:'goethe', badgeType:'noun', badgeLabel:'Bedeutung',
  question:{en:'...', tr:'...', fa:'...'},
  main:'der Tisch', sub:{en:'noun', tr:'isim', fa:'اسم'},
  answer:{en:'table', tr:'masa', fa:'میز'},
  choices_en:['table','chair','window','door'],
  choices_tr:['masa','sandalye','pencere','kapı'],
  choices_fa:['میز','صندلی','پنجره','در'] }
```

## Official Resources
- Goethe-Zertifikat A1: https://www.goethe.de/en/spr/kup/prf/prf/gzs.html
- Goethe-Zertifikat A2: https://www.goethe.de/en/spr/kup/prf/prf/gza2.html
- Goethe-Zertifikat B1: https://www.goethe.de/en/spr/kup/prf/prf/gzb1.html
- Goethe-Zertifikat B2: https://www.goethe.de/en/spr/kup/prf/prf/gzb2.html
- Wortlisten PDF: https://www.goethe.de/de/spr/kup/prf/prf/gzb1/vor/wol.html

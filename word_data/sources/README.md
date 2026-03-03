# Word Data Sources

This folder contains German vocabulary data organized by source.
Every JS file registers itself into `window._GERMAN_SOURCES` before
`loader.js` merges everything into `window.APP_DATA`.

---

## Source Catalogue

### 1. `goethe-institut/`  ← Primary for Quiz
**Goethe-Institut Official Wortlisten**
- URL: https://www.goethe.de
- Levels: A1, A2, B1, B2, C1, C2
- Files: `a1_words.js`, `a2_words.js`, `b1_words.js`, `b2_words.js`
- Content: ~4,000 words across all levels (nouns, verbs, adjectives, phrases)
- Use: WORD_BANK entries + VOCAB_CARDS quiz questions
- License: Freely available exam-preparation word lists
- Notes: These are the canonical official CEFR word lists used in all
  Goethe-Zertifikat examinations worldwide.

### 2. `dwds/`  ← Primary for Word Explorer / Search
**DWDS – Digitales Wörterbuch der deutschen Sprache**
- URL: https://www.dwds.de
- Operator: Berlin-Brandenburg Academy of Sciences and Humanities (BBAW)
- Files: `dictionary.js`, `advanced.js`
- Content: Comprehensive word entries with multiple meanings,
  full grammatical forms, and authentic corpus example sentences
- Use: WORD_BANK rich entries for Word Explorer/Search
- License: CC-BY open data; see https://www.dwds.de/d/nutzungsbedingungen
- Notes: Contains 600,000 entries across 75 billion corpus tokens.
  The most authoritative freely available German dictionary.

### 3. `frequency/`  ← Coverage Breadth
**Leipzig Corpora & German Frequency Lists**
- URL: https://wortschatz.uni-leipzig.de
- Files: `top_1000.js`, `top_2000.js`, `top_3000.js`
- Content: The ~3,000 most frequently used German words with
  basic grammar info, organized by frequency rank
- Use: WORD_BANK entries to ensure broad vocabulary coverage
- License: Free for research and educational use
- Notes: Based on 100M+ sentence corpus from German newspapers,
  web text, and Wikipedia.

### 4. `phrases/`  ← Grammar & Communication
**Compiled from Klett "Menschen", Hueber "Schritte", Cornelsen "Aspekte"**
- Files: `common_phrases.js`, `separable_verbs.js`, `idioms.js`
- Content: Fixed phrases, separable verbs, modal constructions,
  common collocations, idiomatic expressions
- Use: WORD_BANK phrase entries + quiz grammar cards
- License: Educational reference compilation
- Notes: Topic-grouped for daily communication scenarios.

### 5. `textbooks/`  ← Thematic Vocabulary
**Hueber "Schritte plus Neu" · Klett "Menschen" · Cornelsen "Aspekte neu"**
- Files: `body_health.js`, `travel_transport.js`, `work_career.js`,
  `family_home.js`, `food_cooking.js`, `nature_environment.js`,
  `culture_media.js`, `politics_society.js`
- Content: Thematically organized vocabulary aligned to textbook topics
- Use: WORD_BANK + VOCAB_CARDS
- License: Educational reference / curriculum alignment

---

## How Data Flows

```
sources/goethe-institut/a1_words.js  ─┐
sources/goethe-institut/a2_words.js  ─┤
sources/goethe-institut/b1_words.js  ─┤
sources/goethe-institut/b2_words.js  ─┤   Push into
sources/dwds/dictionary.js           ─┤── window._GS.wordBank[]
sources/frequency/top_1000.js        ─┤   window._GS.vocabCards{}
sources/phrases/common_phrases.js    ─┤   window._GS.formEx{}
sources/textbooks/body_health.js     ─┘

loader.js  ──► merge → window.APP_DATA = { WORD_BANK, VOCAB_CARDS, FORM_EX }
```

---

## Level Mapping

All levels are mapped to the 4 main CEFR levels:
`A1` · `A2` · `B1` · `B2`

Sub-level designations (A2.1, A2.2, B1.1, B1.2) used internally in
some textbooks are merged into their parent level here.

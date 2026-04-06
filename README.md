# Wortschatz

A browser-based German vocabulary learning app — no installation, no build step, just open and play.

> Originally developed under the name **DeutschLernen** during early development.

---

## What is this?

**Wortschatz** is an interactive app that helps you build German vocabulary across CEFR levels A1, A2, and B1. It includes multiple quiz modes, a full dictionary with A–Z browsing, and a word explorer that shows Wiktionary grammar data for any word. All features work offline after the first load.

It runs entirely in the browser as a static HTML/JS app — no server required.

---

## Repository Structure

```
/
├── index.html               # App entry point
├── js/
│   ├── app.js               # Main application logic
│   ├── adaptive.js          # Adaptive quiz engine
│   └── auth.js              # Supabase authentication
├── data/
│   ├── a1.csv               # A1 vocabulary (812 words)
│   ├── a2.csv               # A2 vocabulary (1059 words)
│   └── b1.csv               # B1 vocabulary (4272 words)
├── icons/                   # PWA + favicon assets
├── site.webmanifest         # PWA manifest
├── favicon.ico
├── apple-touch-icon.png
├── CNAME                    # GitHub Pages custom domain
└── start_local_server.command  # macOS: double-click to serve locally
```

---

## How to Run

**Locally:** Double-click `start_local_server.command` (macOS), then open `http://localhost:8000` in your browser.

**Live:** Hosted at [wortschatzapp.de](https://wortschatzapp.de) via GitHub Pages.

---

## Word Data

All vocabulary is stored in three CSV files under `data/`. These are the single source of truth for every feature in the app.

| File | Level | Rows | Description |
|------|-------|-----:|-------------|
| `data/a1.csv` | A1 | 812 | Starter – survival communication |
| `data/a2.csv` | A2 | 1059 | Elementary – everyday topics |
| `data/b1.csv` | B1 | 4272 | Intermediate – independent use |

Vocabulary is sourced from the official word lists published by the [Goethe-Institut](https://www.goethe.de) — the canonical CEFR-aligned references used in Goethe-Zertifikat examinations. Translations (EN/TR/RU/UK/FA/AR) and example sentences are enriched from DWDS, MyMemory API, and manual curation.

---

## Quiz Modes

### Standard Quiz
Select a CEFR level (A1 / A2 / B1) from the home screen to start a 10-question multiple-choice quiz drawn from that level's vocabulary.

### Adaptive Quiz
Tap **Adaptive Quiz** on the home screen, choose a level, and start. The quiz engine self-calibrates over three diagnostic rounds before entering a permanent adaptive mode that targets words near your demonstrated skill level. See *Adaptive Quiz System* below for full details.

### Theme Quiz
Tap **Theme Quiz** on the home screen and select one of the 21 vocabulary categories. The quiz draws 10 words from that category across all CEFR levels, targeting your current skill level (defaulting to difficulty 4 for new users).

---

## Features

- **Word Explorer** — tap any word to open a card with Wiktionary grammar data (declension tables, conjugation, IPA, definitions), plus the CSV example sentence
- **Dictionary** — full A–Z list of all ~6 000 words with alphabet jump bar and live search, filterable by the active display language
- **Swipe Mode** — swipe-based flashcard review
- **6 display languages** — English, Turkish, Persian, Russian, Ukrainian, Arabic (RTL-aware)
- **PWA** — installable on iOS and Android, works offline

---

## Vocabulary Schema

Each CSV row has the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `id` | string | Unique row identifier |
| `level` | string | CEFR level: `A1`, `A2`, or `B1` |
| `source_page` | int | Page number in source booklet |
| `section` | string | Section slug |
| `entry_type` | string | `main` (quiz-eligible) or `section_title` |
| `word` | string | German word or phrase |
| `article` | string | Grammatical article (`der`/`die`/`das`) for nouns |
| `plural` | string | Plural form (nouns) |
| `word_type` | string | `Noun`, `Verb`, `Adjective`, `Phrase`, `Adverb`, `Number`, `Word` |
| `translation_en` | string | English translation |
| `translation_tr` | string | Turkish translation |
| `translation_ru` | string | Russian translation |
| `translation_uk` | string | Ukrainian translation |
| `translation_fa` | string | Persian (Farsi) translation |
| `translation_ar` | string | Arabic translation |
| `difficulty` | int 1–10 | Difficulty rating within the level |
| `category_id` | int 1–21 | Vocabulary category (see table below) |
| `example_de` | string | German example sentence |

### Category IDs

| ID | Category |
|----|----------|
| 1 | Numbers & Quantities |
| 2 | Time & Calendar |
| 3 | Family & Relationships |
| 4 | Body & Health |
| 5 | Food & Drink |
| 6 | Home & Living |
| 7 | Clothing & Appearance |
| 8 | Work & Careers |
| 9 | Education & Learning |
| 10 | Travel & Tourism |
| 11 | Transportation |
| 12 | Shopping & Finance |
| 13 | Language, Communication & Media |
| 14 | Nature, Weather & Animals |
| 15 | Sports & Leisure |
| 16 | Arts & Culture |
| 17 | Technology & Devices |
| 18 | Society, Law & Politics |
| 19 | Emotions & Personal Traits |
| 20 | Places & Geography |
| 21 | Grammar & Function Words |

---

## Adaptive Quiz System

### Overview

Each word in the dataset carries a **difficulty rating from 1 to 10**. Each user maintains a floating-point **skill level** on the same scale. The system uses these two numbers to continuously tailor each quiz — targeting words near the user's current level, reinforcing previously failed words, and periodically probing for potential improvement.

---

### Word Difficulty (1–10)

Difficulty values are assigned per word in the CSV data. Level A1 contains words rated 1–10 within the beginner range; A2 and B1 each have their own independent 1–10 scale calibrated to their respective vocabulary demands.

---

### Evaluation Phase

Before entering adaptive mode, each user completes three diagnostic quizzes designed to estimate their starting skill level as precisely as possible.

**Eval 1 — Breadth scan**
One word is selected from each difficulty tier 1 through 10, giving a 10-card quiz spanning the full range. Skill is calculated as the **position-weighted average difficulty of all correct answers**.

**Eval 2 — Focused confirmation**
Using the Eval 1 estimate as a starting point (S), the quiz is built with: 2 words at S−2, 2 at S−1, 3 at S, 2 at S+1, and 1 exploration word beyond S+1. Skill updates to the **average of the old skill and the average difficulty of all correct answers**.

**Eval 3 — Normal-mode trial**
Uses the same word distribution as normal quizzes and applies the same skill update formula. After Eval 3, the user enters permanent adaptive mode.

---

### Adaptive Quiz Logic

Every quiz is generated along two independent dimensions:

**Word history dimension** — 10 type slots:
- 5 × New (never seen before)
- 3 × Failed (previously answered incorrectly)
- 2 × Review (seen before, no outstanding fail score)

**Difficulty dimension** — 10 slots around the user's current skill index (SI = rounded skill level):
- 1 × SI−2, 1 × SI−1, 3 × SI, 2 × SI+1, 2 × Exploration, 1 × Fallback

Type and difficulty slots are each independently shuffled and then paired positionally.

---

### Skill Adjustment

After every quiz:

```
skillLevel += (accuracy - 0.65) * 0.6
skillLevel  = clamp(skillLevel, 1, 10)
```

The neutral point is **65% accuracy**. The maximum change per quiz is +0.21 (100%) or −0.39 (0%).

---

### Memory Reinforcement

Each word tracks a **fail score**:
- Wrong answer → `failScore += 2`
- Correct answer → `failScore -= 1` (minimum 0)

Words with a positive fail score occupy 3 of the 10 slots in every quiz until cleared.

---

### Level Isolation

A1, A2, and B1 each maintain completely independent progress records (skill level, evaluation stage, word history, recent-words list). For signed-in users, all three levels are persisted to the database and loaded in parallel on sign-in.

---

## License

Word list data is used for educational purposes. Vocabulary sourced from Goethe-Institut freely available exam-preparation material. Translations enriched via [MyMemory API](https://mymemory.translated.net/) and [DWDS](https://www.dwds.de/).

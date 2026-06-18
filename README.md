# Wortschatz

A browser-based German vocabulary learning app — open in the browser and start learning.

> Originally developed under the name **DeutschLernen** during early development.

---

## What is this?

**Wortschatz** is an interactive app that helps you build German vocabulary across CEFR levels A1, A2, and B1. It includes multiple quiz and practice modes, a learning profile with progress tracking, a full dictionary, and a word explorer with Wiktionary grammar data. After the first load, most content is cached for offline use; a network connection is required on startup.

It runs entirely in the browser as a static HTML/JS app — no build step for production deployment.

---

## Repository Structure

```
/
├── index.html               # App entry point
├── js/
│   ├── app.js               # Main application logic, UI, practice, theme quiz, profile
│   ├── adaptive.js          # Legacy adaptive quiz engine (per-level A1/A2/B1)
│   ├── adaptive_v2.js       # Adaptive V2 engine (unified ALL vocabulary)
│   ├── auth.js              # Supabase authentication & progress persistence
│   └── announcement.js      # Domain migration banner (non-production hosts)
├── data/
│   ├── vocabulary.v2.min.json  # Unified compact vocabulary used by the app
│   └── vocabulary.v2.map.json  # Human-readable vocabulary source/sidecar
├── scripts/
│   ├── dev.mjs              # Local dev server + Cloudflare tunnel
│   └── restart_server.sh    # Kill/restart npm dev in background
├── icons/                   # PWA + favicon assets
├── mobile/                  # Capacitor shell workspace
│   ├── ios/                 # Native iOS project
│   ├── android/             # Native Android project
│   └── capacitor.config.json
├── site.webmanifest         # PWA manifest
├── sw.js                    # Service worker (network-first for app data)
├── favicon.ico
├── apple-touch-icon.png
├── CNAME                    # GitHub Pages custom domain
└── package.json             # npm dev server + Cloudflare tunnel
```

---

## How to Run

**Locally:**

```bash
npm install
npm run dev
```

Then open `https://localhost:3000` in your browser (self-signed cert — accept the warning once). The dev script also starts a trusted Cloudflare HTTPS tunnel for mobile testing (Web Share, etc.) with no cert warnings.

**Restart in background:** `scripts/restart_server.sh` (kills anything on port 3000, then runs `npm run dev` via nohup).

**Do not open via `file://`** — JSON fetches and the service worker require HTTP. Use `npm run dev` locally.

**Live:** Hosted at [wortschatzapp.de](https://wortschatzapp.de) via GitHub Pages.

### Mobile Shell (Capacitor)

Capacitor setup is isolated under `mobile/` so GitHub Pages deployment from repository root stays unchanged.

From `mobile/`:

- `npm install`
- `npm run sync`
- `npm run open:ios`
- `npm run open:android`

The shell currently loads the live website URL in a WebView for MVP testing.

---

## Home Screen

The home screen is organized around **Adaptive V2 (Beta)** as the primary mode. Available entry points:

| Banner | Description |
|--------|-------------|
| **Adaptive V2 (Beta)** | Level-agnostic adaptive quiz across the full vocabulary (~6 000 words). Starts immediately — no level picker. Shows a status chip during calibration, B1 review, or challenge phases. |
| **Learning Profile** | Progress dashboard: journey bar, word stats, activity, review quizzes, topic breakdown, reset. |
| **Practice** | Flip-card study mode with filters. No scoring or progress tracking. |
| **Theme Quiz** | 10-question MCQ on one of 21 vocabulary categories. |
| **Quick Match** | Swipe right/left to judge whether a shown meaning matches the German word. |
| **Word Explorer** | Opens a random word card with Wiktionary grammar data. |

**Hidden from home (still in code):** Legacy **Adaptive Quiz** (per-level A1/A2/B1) and **Dictionary** banners are commented out in `index.html`. The underlying screens and functions still work if called programmatically.

**Standard level quiz:** 10 random MCQ words for a chosen CEFR level. No home-screen entry; used for guests when a level is triggered directly. Signed-in users who start a level quiz are redirected to the legacy adaptive engine for that level instead.

---

## Universal Quiz Mechanics

All multiple-choice quiz modes share these rules:

- **Quiz length:** 10 questions (`QUIZ_LEN = 10`)
- **Format:** German word (+ article for nouns) → 4 translation choices
- **Correctness:** Compared by **word ID**, never display string
- **Distractors:** Up to 6 candidates collected; 3 distractors + 1 correct shown, deduplicated by English translation
- **Eligible words:** entries in `vocabulary.v2.min.json` with a non-empty English translation
- **Example sentence:** Shown under the word from `example_de` when present
- **Results thresholds:** ≥90% Excellent, ≥70% Well done, ≥50% Good effort, else Keep practicing
- **Study time:** Active seconds spent answering questions (see [Quiz study time](#quiz-study-time) below)

---

## Quiz Study Time

All multiple-choice quiz modes share one **active-time tracker** in `app.js`. Time is recorded only when a quiz **fully completes** (all 10 questions answered and the results screen is shown). It appears in the Learning Profile **Activity → Total study time** and in per-topic theme stats.

### What counts

| Included | Excluded |
|----------|----------|
| Time on question cards while the tab is visible and the user is active | Loading / prep overlay before the first card |
| Reading feedback between questions (within the inactivity window) | Tab or browser in background (`document.hidden`) |
| Adaptive V2, Theme Quiz, legacy adaptive, and profile review quizzes | Practice, Quick Match, Word Explorer, Dictionary |
| | Results screen (timer stops before it is shown) |
| | **Any quiz abandoned before completion** |

### Pausing rules

The clock **pauses** when:

- The user switches to another tab or minimizes the browser (`visibilitychange`)
- The user is inactive for **2 minutes** with no answer or “Next” tap

The clock **resumes** when the tab becomes visible again or the user answers / advances.

### When time is saved

Time is committed **once** in `showResults()` together with correct/incorrect counts. It is added to:

- `quizStats.adaptive` — Adaptive V2 and legacy per-level adaptive quizzes
- `quizStats.theme[category_slug]` — Theme Quiz (per category)

Signed-in users persist via Supabase; guests via `localStorage`.

### Abandonment and edge cases

| Scenario | Time recorded? | Progress recorded? |
|----------|----------------|-------------------|
| User taps ← Back mid-quiz | **No** — timer discarded | **No** — snapshot restored (signed-in) |
| User closes tab or refreshes mid-quiz | **No** | **No** — snapshot restored on reload (signed-in) |
| User navigates away via app back / `goHome()` | **No** | **No** |
| Quiz fails to start (load error, no cards) | **No** — timer never started | **No** |
| User completes all 10 questions | **Yes** — active seconds only | **Yes** |
| User taps “Play again” after finishing | Previous quiz already saved; new quiz gets a fresh timer | New quiz saved on its own completion |

Timer start is tied to the **first question card** (`renderCard` at index 0), so all entry paths (Adaptive V2, Theme Quiz, legacy adaptive, profile review) behave the same regardless of how the quiz was launched.

---

## Adaptive V2 (Beta)

The primary adaptive engine. Uses `data/vocabulary.v2.min.json` across all CEFR levels. Progress is stored under `user_progress.level = 'ALL'` (signed in) or `localStorage` key `deutsch_adaptive_v2_progress` (guest). Does **not** overwrite legacy per-level A1/A2/B1 adaptive data.

### Progress fields

| Field | Description |
|-------|-------------|
| `evaluationStage` | `0` = Phase A, `1` = Phase B, `3` = active (stage `2` unused) |
| `cefrBand` | Assigned band: `A1`, `A2`, or `B1` |
| `skillLevel` | Float 1–10 within the assigned band |
| `learningPhase` | `active`, `band_review`, or `challenge` |
| `words` | Per-word stats map (see Word memory below) |
| `recentWords` | Last 25 word IDs (FIFO) |
| `crossBandLog` | Last 40 cross-band answer entries for promotion |
| `challengeLowStreak` | Consecutive low-accuracy challenge quizzes |
| `lastQuizAccuracy` | Most recent quiz accuracy (0–1) |
| `legacyConfidence` | Set on legacy import only (0–100) |
| `quizStats` | `{ adaptive: {...}, theme: { [category_slug]: {...} } }` |

Per-word stats in `words[id]`:

| Field | Description |
|-------|-------------|
| `failScore` | Wrong +2, correct −1 (min 0) |
| `seenCount` | Total exposures (adaptive + theme) |
| `correctCount` | Correct answers |
| `adaptiveSeenCount` | Adaptive-only exposures; **"unseen" for adaptive selection** uses this, not `seenCount` |
| `themeSeenCount` | Theme-quiz-only exposures |
| `lastSeenQuiz` | Quiz counter when last seen |

### Calibration — Phase A (`evaluationStage === 0`)

10 fixed probes (shuffled), then answered:

| Band | Difficulties | Count |
|------|-------------|-------|
| A1 | 2, 4, 6, 8 | 4 |
| A2 | 3, 6, 9 | 3 |
| B1 | 3, 6, 9 | 3 |

Numbers are deprioritized (max 1 number word per quiz).

**Early exit:** If all 4 A1 probes are wrong → assign `cefrBand = A1`, `skillLevel = 1`, skip Phase B, go directly to active mode.

**Band assignment** (otherwise): B1 if A2 pass rate ≥ 60% **and** B1 ≥ 60%; A2 if A2 ≥ 60%; A1 if A1 ≥ 60% or A1 > A2; else A2 if any A2 attempts, else A1.

**Skill after Phase A:** Average difficulty of correct answers in assigned band; if skill ≤ 1 but some answers were correct, use position-weighted average (weight = `1 + position/(n−1)`). → `evaluationStage = 1`.

### Calibration — Phase B (`evaluationStage === 1`)

10 slots (shuffled): 2 crossdown from previous band at high difficulty, 2+3+2 home-band at S−1/S/S+1, 1–2 crossup/explore into next band (or within-band explore at B1).

**After Phase B:**
- Skill: `(currentSkill + avgDifficultyOfHomeBandCorrect) / 2`
- Band adjust: cross accuracy ≥ 80% → promote; home accuracy < 30% → demote
- → `evaluationStage = 3`, `learningPhase = active`

### Legacy import

Existing A1/A2/B1 adaptive progress is merged into `ALL` on first V2 load. Word stats are merged per unified ID (max of failScore, seenCount, correctCount).

**Confidence score** (0–100):

| Component | Points |
|-----------|--------|
| Legacy eval done (`evaluationStage ≥ 3`, or ≥25 attempts & ≥20 unique seen) | +30 |
| ≥40 attempts on band, else eval done & ≥25 attempts | +25 / +10 |
| ≥50 unique seen, else ≥20 | +15 / +5 |
| Accuracy ≥ 55% | +10 |
| Second-most-active level ≥15 attempts | +10 |
| ≥2 active levels (≥10 attempts each) with skill spread ≤ 2 | +10 |

**Bootstrap evaluation stage:**
- Confidence ≥ 70 → stage 3 (skip calibration)
- Confidence ≥ 40 → stage 1 (Phase B only)
- Else → stage 0 (both phases)
- If eval not done & <25 attempts → max confidence 35
- If ≥2 eval-done levels with skill spread > 4 → force stage 1

### Normal active mode

**Default 10-slot layout:**
- 3 struggling (`failScore > 0`, sorted by failScore desc, then oldest `lastSeenQuiz`)
- 3 unseen (`adaptiveSeenCount === 0`), skill-targeted within home band; 1 cross-band slot if skill ≥ 7, 2 if skill ≥ 9
- 2 stable (seen, failScore 0)
- 1 confidence at difficulty `clamp(skill − 1.5, 1, 10)` (numbers deprioritized)
- 1 explore: cross-band if skill ≥ 7, else within-band at `skill + 2` (±2)

**Global unseen priority** replaces the default layout when:
- B1 band & skill ≥ 4, OR A2 & skill ≥ 6, OR A1 & skill ≥ 8, OR `band_review` phase

Then: 2 struggling + 5 unseen (B1→A2→A1 priority) + optional stable + confidence + explore.

### Skill adjustment

After every post-calibration quiz:

```
skillLevel += (accuracy - 0.65) * 0.6
skillLevel  = clamp(skillLevel, 1, 10)
```

Neutral point: **65% accuracy**. Max swing: **+0.21** (100%) / **−0.39** (0%).

### Band promotion

When `skillLevel ≥ 9` and the last **20** cross-band log entries have ≥ **70%** accuracy → promote A1→A2→B1. New skill: `clamp(2 + avgCrossCorrectDifficulty × 0.35, 3, 5)`, or **4** if no cross answers. Clears `crossBandLog`.

### Endgame phases

| Phase | Enter | Exit |
|-------|-------|------|
| **`band_review`** | B1 band, skill ≥ 9, B1 coverage ≥ **85%** | — |
| **`challenge`** | Global coverage ≥ **95%** OR B1 unseen < **3%**, AND last quiz accuracy ≥ **65%** | 3 consecutive quizzes with accuracy < **45%** → back to `band_review` |

**`band_review` quiz:** 2 struggling + 5 unseen (or 2 if no unseen) + low-accuracy B1 stable + B1 confidence + explore/hard A2/A1 react.

**`challenge` quiz:** 3 struggling + 3 global unseen + 2 oldest stable + B1 confidence + hardest unseen explore.

---

## Theme Quiz

Tap **Theme Quiz**, select one of 21 categories. Draws 10 MCQ words from that category across all CEFR levels.

**Skill reference:** Uses Adaptive V2 `skillLevel` if available; defaults to **4** for new users. Skill is used for difficulty targeting only — **Theme Quiz does not update skill, band, or evaluation stage**.

**10-slot layout:**
- 4 × unseen (theme: `themeSeenCount === 0`, not in category `seenWordIds`, failScore 0)
- 3 × struggling (failScore > 0)
- 2 × stable (seen in theme or globally, failScore 0)
- 1 × challenge (closest difficulty to skill)

Distractors prefer same category, then global fallback.

**Progress effects:** Updates per-word stats (`seenCount`, `themeSeenCount`, `failScore`, etc.) and `quizStats.theme[category_slug]` (counters, `seenWordIds`, `themeRecentWords` max 25, `lastSeenAt`).

Category grid shows `seen/total` badge per category.

---

## Practice

Flip-card study mode. **No scoring or progress persistence.**

**Setup filters** (all default to All):
- CEFR level: A1 / A2 / B1
- Difficulty: 1–10
- Word type: Noun, Verb, Adjective, Phrase, Adverb, Word (not Number)
- Article: der, die, das (nouns only)
- Topics: 21 categories

**Deck:** Filter pool → shuffle unseen (session `practiceSeenIds`) → batch of 10. When all seen, reset and reshuffle.

**Interaction:** Tap to flip (German front + example / translation back). Swipe > 90px to dismiss and advance. Prefetches next batch when ≤ 5 cards remain.

---

## Quick Match

Swipe-based meaning-matching game. **No progress persistence.**

- Level picker: A1 / A2 / B1
- 10-card batches; prefetches when ≤ 3 cards left
- Each card: 50% chance the shown meaning **matches** the word, 50% a mismatched word from the same level
- Swipe **right** = matches, **left** = doesn't match (90px threshold)
- Session `swipeGood` / `swipeBad` counters only

---

## Learning Profile

Dashboard for Adaptive V2 (`ALL`-level) progress. Always renders ALL-level data regardless of legacy per-level tabs in code.

### Sections

1. **Adaptive** — Journey bar showing A1/A2/B1 coverage % per band with a placement marker (uncertainty width shrinks as quizzes and seen words accumulate). Stats: CEFR band, skill `X.X / 10`.

2. **Overview** — Clickable stats that expand word lists:
   - **Words Seen** — unique words with `seenCount > 0`
   - **Words Struggling** — failScore ≥ 1, or incorrect ≥ 1 with accuracy < 100%, or ≥ 2 incorrect, or seen ≥ 4 & accuracy < 65%, or failScore ≥ 4 & accuracy < 80%
   - **Words Mastered** — seen ≥ 3, failScore 0, accuracy ≥ 80%
   - **Accuracy %** — total correct / total seen

3. **Activity** — Quizzes completed, study time (active quiz seconds only — see [Quiz study time](#quiz-study-time)), correct/incorrect (from `quizStats.adaptive` + all theme stats, with word-history fallback for guests).

4. **Review** (signed-in only; guests see locked buttons with sign-in prompt):
   - **Review Weak Words** — sorted by failScore desc
   - **Review Recent Mistakes** — recent words filtered to failed
   - **Review Mixed Practice** — struggling (failScore ≥ 2) + recent + mastered
   - Launches a 10-word Adaptive V2 review quiz; returns to profile on completion. Review quizzes skip calibration but apply normal skill/band updates.

5. **Topics** (signed-in only for full breakdown):
   - Categories with ≥ 1 theme quiz OR ≥ 5 word attempts
   - Coverage, accuracy, per-topic activity stats
   - **Practice** button → starts Theme Quiz for that category

6. **Reset adaptive progress** — Clears all Adaptive V2 progress (word history, skill, calibration).

---

## Legacy Adaptive Quiz (Per-Level)

Still fully implemented in `js/adaptive.js`. Hidden from home; accessible when signed-in users trigger a level quiz, or via `openAdaptiveSetup()` if the banner is re-enabled.

Each level (A1, A2, B1) maintains independent progress.

### Evaluation (3 stages)

| Stage | Name | Layout |
|-------|------|--------|
| 0 — Eval 1 | Breadth scan | 1 word per difficulty 1–10 |
| 1 — Eval 2 | Focused confirmation | 2@S−2, 2@S−1, 3@S, 2@S+1, 1 exploration |
| 2 — Eval 3 | Normal-mode trial | Same as normal mode |
| ≥3 | Permanent adaptive | Normal mode |

### Normal mode (10 cards)

**Type dimension** (shuffled, paired with difficulty):
- 5 × New (never seen)
- 3 × Failed (failScore > 0)
- 2 × Review (seen, failScore 0)

**Difficulty dimension** (shuffled):
- 1 × SI−2, 1 × SI−1, 3 × SI, 2 × SI+1, 2 × Exploration, 1 × Fallback

SI = rounded skill level, clamped 1–10.

### Skill formulas

| When | Formula |
|------|---------|
| Eval 1 | Position-weighted avg difficulty of correct answers |
| Eval 2 | `(currentSkill + avgDifficultyOfCorrect) / 2` |
| Eval 3+ | `skillLevel += (accuracy − 0.65) × 0.6`, clamp 1–10 |

Word memory: wrong → failScore +2; correct → failScore −1 (min 0). `recentWords`: last 25 IDs.

---

## Progress & Persistence

### Guest users

Adaptive V2 and legacy adaptive algorithms run fully for guests. Progress is stored in `localStorage`:

| Key | Purpose |
|-----|---------|
| `deutsch_adaptive_v2_progress` | Adaptive V2 progress |
| `deutsch_adaptive_progress_{A1\|A2\|B1}` | Legacy per-level adaptive progress |
| `dl_lang` | UI language |

### Signed-in users (Supabase)

Google OAuth via Supabase. All four levels (`A1`, `A2`, `B1`, `ALL`) fetched in parallel on sign-in and cached.

**Mid-quiz protection:** A progress snapshot is taken at quiz start. If the user navigates away before results, the snapshot is restored — the database is only updated when a quiz completes. **Quiz study time follows the same rule:** the active-time tracker is discarded on abandonment and only committed in `showResults()`.

**Sign-in merge order for ALL:** Online ALL row → local guest V2 → legacy A1/A2/B1 bootstrap.

### `user_progress` table

Unique constraint: `(user_id, level)` where level ∈ `A1`, `A2`, `B1`, `ALL`.

| Column | Content |
|--------|---------|
| `user_id` | UUID |
| `level` | `A1` / `A2` / `B1` / `ALL` |
| `skill_level` | INTEGER (rounded; precise float in metadata) |
| `failed_words` | Full `progress.words` map (despite column name) |
| `passed_words` | Metadata: `evaluationStage`, `skillLevel` (float), `recentWords`; ALL-level also stores `cefrBand`, `learningPhase`, `legacyConfidence`, `crossBandLog`, `challengeLowStreak`, `lastQuizAccuracy` |
| `quiz_stats` | `{ adaptive: {...}, theme: { [slug]: {...} } }` |

---

## Other Features

### Word Explorer
- Random word from full A1+A2+B1 pool (~6 000 words)
- Avoids repeats until 300 seen, then clears set
- Fetches Wiktionary grammar (declension, conjugation, IPA, definitions)
- Shows the German example sentence; offline fallback uses cached vocabulary data
- Tap any word elsewhere → word card modal

### Dictionary
- Full A–Z sorted list of all words with alphabet jump bar and live search
- Meaning column uses active display language
- Home entry hidden; `openDictionary()` still works

### Languages
- **7 UI languages:** Deutsch, English, Türkçe, Русский, Українська, فارسی, العربية
- **Quiz translations:** EN, TR, FA, RU, UK, AR (EN fallback)
- RTL support for Persian and Arabic

### PWA & Offline
- Installable on iOS and Android (install tip on home for guests)
- Service worker caches shell assets; JS/JSON/data use network-first with cache fallback
- **Startup requires network:** App probes connectivity on load and shows an offline screen if unreachable (auth sign-in/out also blocked offline)

### Announcements
- Shown on non-`wortschatzapp.de` hosts only
- Current: domain migration notice to wortschatzapp.de (7 languages)

### Authentication
- Optional **Google sign-in** via Supabase (Settings)
- Syncs Adaptive V2 (`ALL`) and legacy per-level progress to the cloud
- Capacitor native app uses external browser OAuth + deep link (`so.rovi.wortschatz://auth/callback`)

### Analytics
- [Umami](https://umami.is) events for mode starts/completions, language changes, install prompts, etc. (e.g. `adaptive_v2_opened`, `quiz_completed`, `practice_started`)

---

## Word Data

All vocabulary is stored in `data/vocabulary.v2.map.json` and `data/vocabulary.v2.min.json`. The compact `min` file is the runtime file loaded by the app; the `map` file is the human-readable source/sidecar for review and maintenance.

Vocabulary is sourced from the official word lists published by the [Goethe-Institut](https://www.goethe.de) — the canonical CEFR-aligned references used in Goethe-Zertifikat examinations. Translations (EN/TR/RU/UK/FA/AR) and example sentences are enriched from DWDS, MyMemory API, and manual curation.

---

## Vocabulary Schema

Each `vocabulary.v2.map.json` entry has the following fields:

| Field | Type | Description |
|--------|------|-------------|
| `unified_id` | int | Unique vocabulary ID |
| `level` | string | CEFR level: `A1`, `A2`, or `B1` |
| `word` | string | German word or phrase |
| `article` | string | Grammatical article (`der`/`die`/`das`) for nouns |
| `plural` | string | Plural form (nouns) |
| `word_type` | string | `Noun`, `Verb`, `Adjective`, `Phrase`, `Adverb`, `Number`, `Word` |
| `difficulty` | int 1–10 | Difficulty rating within the level |
| `category_id` | int 1–21 | Vocabulary category (see table below) |
| `example_de` | string | German example sentence |
| `translations` | object | Translations keyed by `en`, `tr`, `fa`, `ru`, `uk`, `ar` |

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

### Adding New Vocabulary

When adding new words, first remove true duplicates against the existing `vocabulary.v2.map.json`. Treat obvious variants of the same lexical item carefully: keep distinct useful entries such as gendered profession forms, fixed phrases, separable verbs, or different meanings, but do not add a word only because the source uses a different inflected form. New `unified_id` values must continue from the current highest ID with no gaps.

Difficulty is an integer from 1–10 within the CEFR level, not a global A1–B1 scale. For B1 imports, use the source level split as the starting band: B1.1 words should normally be 1–5, B1.2 words should normally be 6–10, and appendix or grammar-pattern entries should be assigned by complexity. Then refine per word: common everyday concrete words are lower, abstract/legal/work/administrative terms are higher, and verb-preposition or grammar-function patterns are usually higher if they require structure knowledge.

Choose `category_id` by the actual meaning and likely learning context of the word, not by a page title alone. Prefer the existing 21 categories. Use category `21` for grammar/function words, connectors, preposition patterns, and general phrases that do not belong to a topic category. For words that could fit multiple categories, choose the category where the example sentence and quiz context will be clearest; for example, `Visum` belongs in Travel, while `Aufenthaltserlaubnis` belongs in Society/Law/Politics.

Write `example_de` as one natural B1-level German sentence. It should demonstrate the word’s normal usage, article/case or required preposition when relevant, and match the selected category. Keep it short and concrete, avoid rare idioms, and do not make the sentence a translation exercise. For fixed phrases and verb-preposition entries, the sentence must show the full pattern, such as `sich freuen auf`, `warten auf`, or `sich kümmern um`.

Translations are for the word or phrase itself, not for the German example sentence. Fill all six languages: `en`, `tr`, `fa`, `ru`, `uk`, `ar`. Keep translations concise, natural, and meaning-focused; include a slash-separated alternative only when one word has multiple common senses or when gender/context needs clarification. Manually review machine translations and reject nonsense or unrelated output. For Farsi and Arabic, normalize any digits into the correct script and do not leave Latin digits in those fields.

After editing, regenerate/update the compact `vocabulary.v2.min.json` so it exactly matches the map entry. Validate that map/min counts match, all new entries have non-empty `example_de` and six translations, Farsi/Arabic contain no Latin digits, `unified_id` equals the entry key, and the new ID range is contiguous.

---

## Unified Vocabulary (V2)

Adaptive V2 reads `data/vocabulary.v2.min.json`, a compact dictionary keyed by **unified numeric ID**. The first digit encodes the CEFR level (no zero padding):

| Prefix digit | Level |
|:--:|:--|
| `1` | A1 |
| `2` | A2 |
| `3` | B1 |

Examples: A1 `129` → `1129` · A2 `133` → `2133` · B1 `744` → `3744` · B1 `4272` → `34272`

Each entry is a 9-tuple (no separate level/srcId fields):

| Index | Field | Description |
|------:|-------|-------------|
| 0 | `lemma` | Lowercase German word |
| 1 | `type` | Short POS code: `N` Noun, `V` Verb, `A` Adjective, `P` Phrase, `D` Adverb, `#` Number, `W` Word |
| 2 | `article` | `r` = der, `e` = die, `s` = das, empty = none |
| 3 | `tr` | Translations in order: EN, TR, FA, RU, UK, AR |
| 4 | `difficulty` | Integer 1–10 |
| 5 | `category_id` | Category 1–21 |
| 6 | `example_de` | German example sentence (shown under quiz word) |
| 7 | `plural` | Plural form for nouns (empty if not applicable) |
| 8 | `word` | Display form with original casing |

Example:

```json
"12": ["eins", "#", "", ["one", "bir", "یک", "одin", "odin", "واحد"], 1, 1, "Eins ist die erste Zahl.", "", "eins"]
```

`data/vocabulary.v2.map.json` is the human-readable sidecar with source fields for every unified ID.

---

## License

Word list data is used for educational purposes. Vocabulary sourced from Goethe-Institut freely available exam-preparation material. Translations enriched via [MyMemory API](https://mymemory.translated.net/) and [DWDS](https://www.dwds.de/).

# Implementation Plan: Unified Vocabulary System and Browser-Only Data Architecture

This plan details how we will merge the three level CSVs into a single optimized static JSON file, implement a parallel transition quiz flow, and migrate user progress without requiring any manual changes to your Supabase database.

---

## 1. Supabase & Local Database Compatibility (No DB Changes Required)

The current Supabase table `user_progress` has the following schema:
* `user_id` (UUID / Text)
* `level` (Text - e.g., `A1`, `A2`, `B1`)
* `skill_level` (Integer)
* `failed_words` (JSON)
* `passed_words` (JSON)
* `quiz_stats` (JSON)
* **Unique Constraint:** `(user_id, level)`

### Why this is fully compatible as-is:
* Because the `level` column is a simple text column, we can save the new unified progress under `level = 'ALL'` (or `'UNIFIED'`). 
* Supabase will treat this as just another row for the user. No table creation, column modifications, or database migration scripts are needed on Supabase.
* The existing table structure is fully compatible out-of-the-box.

---

## 2. Step-by-Step Implementation Flow

### Step 1: Create the Unified Dataset
We will write a script `scripts/merge_vocab.py` to parse [a1.csv](file:///Users/mehrashojjat/Desktop/Works/MI/DL/data/a1.csv), [a2.csv](file:///Users/mehrashojjat/Desktop/Works/MI/DL/data/a2.csv), and [b1.csv](file:///Users/mehrashojjat/Desktop/Works/MI/DL/data/b1.csv) and generate `/data/vocabulary.json`.

* Each item in `vocabulary.json` will have a format like:
  ```json
  {
    "id": 1,                     // New globally unique sequential ID
    "original_id": "129",        // ID from the original CSV file
    "original_level": "A1",      // Original CSV level (A1, A2, or B1)
    "word": "Abfahrt",
    "article": "die",
    "plural": "-en",
    "word_type": "Noun",
    "translation_en": "departure",
    "translation_fa": "حرکت / عزیمت",
    "example_de": "Die Abfahrt ist um zehn.",
    "difficulty": "8",
    "category_id": "11"
  }
  ```

### Step 2: Implement Unified Vocabulary Loading
In [js/app.js](file:///Users/mehrashojjat/Desktop/Works/MI/DL/js/app.js):
1. We will update `_loadCSVLevel(lv)` (or write a wrapper) to handle `lv = 'ALL'`.
2. When loading `'ALL'`, the app will fetch `data/vocabulary.json`, parse it, and populate `CSV_QUIZ_DATA['ALL']`.
3. We will construct the Persian and Arabic mapping search dictionary (`_faCsvMap`, `_arCsvMap`) from this unified list.

### Step 3: Implement the Parallel Transition Quiz
To test the new system safely without replacing the existing level-based adaptive quizzes:
1. **Add Beta Entry Point:** In `index.html` on the levels screen, we will add a new card/button: **"Unified Adaptive Quiz (Beta)"**.
2. **Launch Logic:** Tapping this will invoke `startLevel('ALL')` (or `startAdaptiveQuiz('ALL')`).
3. **Adaptive Selection Match:**
   * In [js/adaptive.js](file:///Users/mehrashojjat/Desktop/Works/MI/DL/js/adaptive.js), `_allWords('ALL')` will load all 3,000 words.
   * The adaptive algorithms (`_buildEval1`, `_buildEval2`, `_buildNormalRows`) will select words matching the user's `skillLevel` (1 to 10) from the entire pool instead of being limited to a single level.
   * During the quiz, the user will be tested on words that match their skill. As they get answers right, the skill level increases, and they are automatically served harder words (which will naturally be A2 or B1 words with advanced sentences).

### Step 4: Progress Migration Logic (One-Time Execution)
When a user launches a unified quiz for the first time, we will run a migration function on their LocalStorage and Supabase data:
1. Build the lookup map: `(original_level, original_id) ➔ unified_id` using the loaded `vocabulary.json` metadata.
2. Load the progress cache for `A1`, `A2`, and `B1`.
3. Create a new unified progress object:
   ```javascript
   var unifiedProgress = {
     evaluationStage: Math.max(A1.evaluationStage, A2.evaluationStage, B1.evaluationStage),
     skillLevel: Math.max(A1.skillLevel, A2.skillLevel, B1.skillLevel), // Start at highest level reached
     words: {},
     recentWords: [],
     quizStats: {
       adaptive: mergeStats([A1.quizStats.adaptive, A2.quizStats.adaptive, B1.quizStats.adaptive]),
       theme: mergeThemeStats([A1.quizStats.theme, A2.quizStats.theme, B1.quizStats.theme])
     }
   };
   ```
4. **Merge Word Proficiency:** Loop through the `words` records in `A1`, `A2`, and `B1`. Translate their level-specific keys to their new `unified_id`. If a word overlaps (meaning the user has records for the same word in both A1 and B1), we merge the seen counts and keep the best `failScore`.
5. **Save to DB:** Save `unifiedProgress` under the row `level = 'ALL'` in Supabase and write to LocalStorage under a new key (or update the existing key).
6. **Set flag:** Write a flag `deutsch_adaptive_progress_migrated = true` to LocalStorage to ensure the migration only runs once.

### Step 5: Learning Profile Redesign (Parallel Option)
1. Add a layout toggle in the Learning Profile to display either the level-specific stats (old tabs) or the new unified dashboard showing overall vocabulary coverage (e.g. `A1: 100%, A2: 80%, B1: 20%`).

---

## 3. Verification Plan

### Automated Tests
1. **Merge Verification Script:** Run `scripts/verify_vocab.py` to ensure:
   * No duplicate IDs are generated.
   * Mapping coverage is 100% (every word in A1, A2, and B1 maps to exactly one unified ID).
   * All translation values and example sentences are intact.

### Manual Verification
1. Run local dev server (`npm run dev` or `start_local_server.command`).
2. Log in with a test user who has existing A1/A2/B1 progress data.
3. Open the **Unified Adaptive Quiz (Beta)**. Verify that:
   * The migration runs successfully and prints logging statements to the console.
   * A new row `level = 'ALL'` is written to your Supabase `user_progress` table.
   * You are quizzed on words matching your highest previous skill level.
   * Tapping answers correctly updates the unified progress stats.
4. Verify the unified dashboard under the **Learning Profile** displays your merged stats accurately.

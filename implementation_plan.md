# Implementation Plan: Adaptive V2 With Unified Vocabulary (Parallel, Safe Rollout)

This plan introduces a new Adaptive V2 quiz flow that does not ask the user to pick A1, A2, or B1. It runs in parallel with the current system and does not change current production behavior while we test and iterate.

## Goal Description

Introduce a level-agnostic Adaptive V2 mode with its own play logic, calibrated baseline assessments, unified vocabulary JSON, and integration into the Learning Profile. This allows users to experience a continuous learning curve across the entire German vocabulary database.

## User Review Required

> [!WARNING]
> This rollout relies on the new `ALL` level value in the `user_progress` table, which will coexist alongside legacy level rows (`A1`, `A2`, `B1`). Disabling Adaptive V2 would require simply hiding the UI entry point; legacy adaptive progress remains intact.

> [!IMPORTANT]
> The unified ID format is numeric and encodes the level directly as the first character, with no zero padding:
> `unified_id = int(str(level_digit) + str(srcId))`
> - A1 (level 1) prefix = `1`
> - A2 (level 2) prefix = `2`
> - B1 (level 3) prefix = `3`
>
> Examples:
> - A1 ID `129` $\rightarrow$ `1129`
> - A2 ID `133` $\rightarrow$ `2133`
> - B1 ID `744` $\rightarrow$ `3744`
> - B1 ID `4272` $\rightarrow$ `34272`
>
> This design allows us to drop `level` / `srcLevel` / `srcId` fields entirely from the JSON payload. The V2 code extracts the original level and ID by checking the first character of the ID string.

---

## Proposed Changes

### Build Pipeline (Data Merging)

Create a Python script to merge `data/a1.csv`, `data/a2.csv`, and `data/b1.csv` into a compact, unified JSON format.

#### [NEW] [merge_vocab.py](file:///Users/mehrashojjat/Desktop/Works/MI/DL/scripts/merge_vocab.py)
- Read Goethe-Institut word lists from `data/a1.csv`, `data/a2.csv`, and `data/b1.csv`.
- Filter only rows with `entry_type == 'main'` and valid `difficulty` values (1-10).
- Assign stable unified IDs using the concatenation formula `int(str(level_digit) + str(srcId))` without zero padding.
- Map field values to the compact schema proposal (no level, srcLevel, or srcId fields needed):
  - `lemma`: lowercase version of the word.
  - `type`: mapped to short codes (`N`, `V`, `A`, etc.).
  - `article`: mapped to short letters (`r`, `e`, `s`).
  - `tr`: array of translations corresponding to `["en", "tr", "fa", "ru", "uk", "ar"]`.
- Output:
  - `data/vocabulary.v2.min.json`: compact dictionary payload.
  - `data/vocabulary.v2.map.json`: debugging/mapping verification sidecar.
- Validate that unified IDs are unique, and fields match row values perfectly.

---

### UI & Home Screen

Add the entry point for the new Adaptive V2 Mode on the main dashboard.

#### [MODIFY] [index.html](file:///Users/mehrashojjat/Desktop/Works/MI/DL/index.html)
- Add a new "Adaptive V2 (Beta)" card to the home screen layout right below the legacy "Adaptive Quiz" button.
- Add the "Adaptive" tab button in the Learning Profile view:
  ```html
  <button class="profile-level-tab" id="profile-level-ALL" onclick="setLearningProfileLevel('ALL')">Adaptive</button>
  ```
- Update stylesheet rules to accommodate the new tab and banner.

#### [MODIFY] [js/app.js](file:///Users/mehrashojjat/Desktop/Works/MI/DL/js/app.js)
- Extend standard loader logic to fetch `data/vocabulary.v2.min.json` when starting V2 mode.
- Update `PROFILE_I18N` to support the new `"adaptive"` tab label in all 7 languages.
- Default `learningProfileSelectedLevel` to `ALL` instead of `A1`/`A2`/`B1` when the profile drawer is opened.
- Update `renderLearningProfile()` to fetch data for level `ALL` from the `ALL` row of Supabase caching.

---

### Core Quiz & Play Logic (Isolated Engine)

We keep the new play logic completely unique and self-contained in a separate JS file to preserve codebase cleanliness. The logic accesses JSON tuple values directly without in-memory inflation.

#### [NEW] [adaptive_v2.js](file:///Users/mehrashojjat/Desktop/Works/MI/DL/js/adaptive_v2.js)
- Implement self-contained quiz startup, question rendering, choices interaction, and results screens for V2.
- Implement calibration quizzes:
  - **Phase A**: Broad probe (10 questions spanning difficulties 1-10). If 0 correct in first 6 questions, cap skill at 2 and skip Phase B.
  - **Phase B**: Focused probe (10 questions centered around Phase A skill ±1.5).
- Implement normal mode slot allocations (10 slots total):
  - Group A (3 slots): Struggling/Recovering words.
  - Group B (3 slots): Unseen/Learning words at current skill.
  - Group C (2 slots): Dormant/Stable words for review.
  - Group D (1 slot): Confidence word (skill - 1.5).
  - Group E (1 slot): Exploratory word (skill + 2).
- Enforce deterministic tie-breaking (by review pressure, oldest last seen, then lowest ID).
- Keep word counters: `seenCount`, `correctCount`, `failScore`, `lastSeenQuiz`.

---

### Database Persistence & Authentication Coexistence

Support parallel rollout under `ALL` row prefix without overwriting legacy A1/A2/B1 records.

#### [MODIFY] [js/auth.js](file:///Users/mehrashojjat/Desktop/Works/MI/DL/js/auth.js)
- Include `'ALL'` level row in database persistence fetches and cache updates alongside `['A1', 'A2', 'B1']`.
- Implement runtime bootstrap service:
  - If `ALL` row does not exist, fetch available legacy rows (`A1`, `A2`, `B1`).
  - Calculate `bootstrapSkill` using a weighted average of attempt counts.
  - Map legacy words to unified IDs and populate the initial `ALL` profile.
  - Skip Calibration Phase A/B if multiple legacy profiles provide sufficient confidence.
  - Seed the initial `ALL` row to Supabase.
- Ensure V2 path reads and writes only to level `'ALL'` and does not modify legacy level rows.

#### [MODIFY] [README.md](file:///Users/mehrashojjat/Desktop/Works/MI/DL/README.md)
- Document the new compact unified vocabulary schema, short codes, and the numeric ID level-encoding logic in `vocabulary.v2.min.json`.

---

## Verification Plan

### Automated Tests
We will execute standard builder checks inside `merge_vocab.py`:
- `python3 scripts/merge_vocab.py`
- Validate that output `vocabulary.v2.min.json` contains unique stable IDs, matches the schema structure, and maps 100% of Goethe-Institut word list main entries.

### Manual Verification
1. **Bootstrap Validation**:
   - Verify that an existing user with legacy `A1`/`A2`/`B1` profiles gets successfully bootstrapped into `ALL` level on first load without database error.
   - Verify that a fresh user with no legacy data correctly triggers Calibration Phase A.
2. **Coexistence Validation**:
   - Check Supabase records to confirm legacy level rows (`A1`, `A2`, `B1`) remain intact and are not overwritten by V2.
3. **UI / Styling Verification**:
   - Inspect the home screen layout on both desktop and mobile viewports to ensure high aesthetic appeal and responsive alignment.
   - Verify the Default tab on the Learning Profile is set to `Adaptive` and renders correct aggregated stats from the `ALL` row.

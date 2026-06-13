# Implementation Plan: Adaptive V2 With Unified Vocabulary (Parallel, Safe Rollout)

This plan introduces a new Adaptive V2 quiz flow that does not ask the user to pick A1, A2, or B1. It runs in parallel with the current system and does not change current production behavior while we test and iterate.

## 1. Core Decisions

1. Keep current adaptive flow intact.
  - Existing level-based adaptive continues to use A1, A2, B1 CSV logic unchanged.
  - Adaptive V2 is introduced as a separate path.
  - Current Adaptive button remains untouched.
  - Add a temporary separate button for V2 testing.

2. Keep old source IDs during migration.
  - We will keep source level and source row ID fields in the new unified data for now.
  - After migration stabilizes, we can remove or externalize those fields.

3. Use a compact unified JSON schema.
  - Avoid repeated per-item keys like translation_en.
  - Use field dictionary plus tuple rows to reduce size.

4. Keep same German word from different levels as separate entries.
  - Same surface word can have different context, difficulty, category, and example by level.
  - We may include a shared lemma/group key for analytics, but quiz rows stay separate.

## 2. Supabase Compatibility (No Schema Changes)

Current table user_progress already supports this rollout.

Columns used:
- user_id
- level
- skill_level
- failed_words
- passed_words
- quiz_stats

Strategy:
- Existing rows remain:
  - level = A1
  - level = A2
  - level = B1
- New row for V2:
  - level = ALL

This requires no new table and no column migration.

## 3. Unified Data Format (Minimal Runtime Payload)

### 3.1 Files
- Source files remain unchanged:
  - data/a1.csv
  - data/a2.csv
  - data/b1.csv
- New generated runtime file:
  - data/vocabulary.v2.min.json
- Optional helper mapping file (for debugging/migration trace):
  - data/vocabulary.v2.map.json

Runtime boundary for Adaptive V2:
- Adaptive V2 runtime reads only:
  - data/vocabulary.v2.min.json
  - optional data/vocabulary.v2.map.json (if needed for first-time bootstrap mapping)
- Adaptive V2 runtime must not read A1/A2/B1 CSV files directly.
- A1/A2/B1 CSV files remain only as build-time input for generating the unified JSON and for classic modes.

### 3.2 Compact schema proposal

Example shape:

{
  "v": 2,
  "langs": ["en","tr","fa","ru","uk","ar"],
  "fields": ["id","lemma","word","article","type","diff","cat","srcLevel","srcId","ex","tr"],
  "rows": [
   [901,"abfahrt","Abfahrt","die","N",8,11,0,129,"Die Abfahrt ist um zehn.",["departure","kalkis","حرکت","отправление","відправлення","المغادرة"]],
   [1788,"abfahrt","Abfahrt","die","N",9,10,2,744,"Die Abfahrt verzögert sich.",["departure","kalkis","عزیمت","отбытие","відбуття","الانطلاق"]]
  ]
}

Notes:
- srcLevel encoding suggestion: 0=A1, 1=A2, 2=B1.
- tr array order follows langs.
- This keeps payload small while still migration-safe.

## 4. Adaptive V2 Quiz Logic (No Level Picker)

### 4.1 Entry point
- Keep existing Adaptive button behavior exactly as-is.
- Add a separate temporary home button: Adaptive V2 (Beta).
- This path does not ask user to choose level.
- This path loads unified JSON only and never uses legacy CSV loader functions.

### 4.2 Startup behavior
1. Check if user is signed in.
2. Load unified row level=ALL from Supabase.
3. If ALL row exists and has evaluationStage >= 1, skip calibration and continue in normal mode.
4. If ALL row does not exist:
   - Load whichever of A1/A2/B1 legacy rows exist. Missing levels are ignored, not errors.
   - Count usable legacy rows using both progress depth and row quality, not just presence.
     - usable = evaluationStage > 0 OR seenCount > 10 OR quizStats has meaningful activity
   - Bootstrap decision tree:
     a. Zero usable legacy rows → cold-start calibration (Phase A + Phase B, 2 quizzes total).
     b. One usable legacy row → partial bootstrap: derive skill from that row, skip calibration Phase A, run Phase B only (1 calibration quiz to refine across full word pool).
     c. Two or more usable legacy rows → full bootstrap: derive skill weighted by attempt counts across available rows. Skip all calibration. Enter normal mode immediately.
   - Create and upsert the ALL row before starting the first quiz.
5. No external migration script or pre-run is required.

Bootstrap skill derivation formula:
- For each available legacy row: weight = totalAttempts in that level / sum of all available attempts
- bootstrapSkill = sum(legacySkill[i] * weight[i])
- Clamp to [1, 10]
- skillConfidence = min(1.0, totalAttempts / 80)
- If a level is missing entirely, it contributes nothing and does not reduce confidence by itself.
- If one level is missing but the remaining available rows have high quality, do not force calibration just because a row is absent.

This is a zero-migration rollout: no pre-execution migration script is required.

### 4.3 Cold-start calibration (for new users with no prior data)
- V2 calibration should infer baseline ability quickly.
- Each calibration quiz is exactly 10 questions.

Phase A: Broad probe (10 questions)
- Difficulty spread across the full range: 2 at diff 1-3, 4 at diff 4-6, 3 at diff 7-8, 1 at diff 9-10.
- All words are unseen and distributed across different categories to avoid misleading category bias.
- After quiz: compute Phase A skill = weighted average difficulty of correct answers.
  - Formula: sum(difficulty[i] * correct[i]) / max(1, correctCount)
  - If user gets 0 correct in first 6 questions, cap Phase A skill at 2 and skip Phase B.
  - If user gets 9-10 correct, set Phase A skill to 8 and go directly to normal mode.

Phase B: Focused probe (10 questions)
- Center difficulty tightly around Phase A skill result ±1.5.
- Mix: 4 words at Phase A skill, 3 words at skill+1, 2 words at skill-1, 1 word at skill+2.
- After quiz: compute final bootstrap skill using combined Phase A and Phase B data.
  - skillLevel = (phaseAskill * 0.4) + (phaseBweightedCorrect * 0.6)
  - skillConfidence = 0.3 (low confidence, will increase with normal quizzes)

After Phase B (or skip condition), move to Normal adaptive mode.

Calibration skipping rules:
- Skipped Phase A: bootstrap from one legacy row → start at Phase B difficulty centered on legacy skill.
- Skipped both phases: bootstrap from two or more legacy rows → enter normal mode directly with skillConfidence derived from total legacy attempt count.

### 4.4 Normal V2 adaptation
- Keep per-word counters: seenCount, correctCount, failScore, lastSeenQuiz.
- Keep per-word timing/cycle counters:
  - quizzesSinceSeen
  - quizzesSinceWrong
  - consecutiveCorrect
  - consecutiveWrong
  - recoveryStreak
  - categorySeenCount
  - categoryWrongCount
- Keep user-level cycle counters:
  - totalQuizzesTaken
  - totalQuestionsAnswered
  - totalCorrectAnswers
  - totalWrongAnswers
  - consecutiveLowScoreQuizzes
  - currentWeakCategoryWindow
  - currentCoveragePressure
- Keep continuous skill level (float 1-10) and skillConfidence (float 0-1).
- Quiz length is always exactly 10 questions in all modes.
- Skill update after each quiz:
  - accuracy = correctCount / 10
  - delta = (accuracy - 0.65) * 0.5 * (1 + skillConfidence * 0.3)
  - newSkill = clamp(skillLevel + delta, 1, 10)
  - skillConfidence = min(1.0, skillConfidence + 0.05)
- Selection policy (see section 4.6 for exact slot allocation):
  - Core around current skill.
  - Include weak words by failScore.
  - Include unseen words near skill.
  - Include a small exploration share above skill.
  - Include periodic review of out-of-range words (see section 4.7).
- Deterministic behavior rule:
  - No word may be selected solely because a fixed number of quizzes has passed.
  - Selection must use the saved counters, difficulty, category coverage, and recency.
  - If two candidates tie, break ties by:
    1. oldest lastSeenQuiz
    2. highest quizzesSinceWrong
    3. lowest categorySeenCount
    4. lowest numeric id

### 4.5 Word state machine (V2)

Each word record: { seenCount, correctCount, failScore, lastSeenQuiz }

State classification:
- Unseen: seenCount == 0
- Learning: seenCount >= 1 and failScore == 0 and seenCount < 4
- Struggling: failScore >= 4 OR (seenCount >= 3 AND correctCount/seenCount < 0.5)
- Recovering: failScore in [1,3] after previously being Struggling
- Stable: failScore == 0 AND seenCount >= 4 AND correctCount/seenCount >= 0.8
- Dormant: Stable AND lastSeenQuiz was more than 20 quizzes ago
- Coverage-pending: Unseen or weakly seen words outside the current skill band that still need to be surfaced at least once before they can be considered truly optional review

Per-answer state transitions:
- Correct answer:
  - seenCount += 1
  - correctCount += 1
  - failScore = max(0, failScore - 1)
  - If was Struggling and failScore drops below 4: becomes Recovering
  - If was Recovering and failScore reaches 0: becomes Stable after 2 more correct answers
- Incorrect answer:
  - seenCount += 1
  - failScore += 2
  - If becomes Struggling (failScore >= 4): mark for urgent resurfacing

Resurfacing rules:
- Newly failed (failScore just reached 4): must appear in next quiz within first 4 slots.
- Recovering: must appear every 2 quizzes until Stable.
- Dormant: must appear at least once every 15 quizzes regardless of composition rules.
- Stable: eligible but low priority; rotated through pool naturally.
- Coverage-pending: must be inserted according to coverage pressure and category coverage gaps, not skipped indefinitely.
- Out-of-range but unseen words are not blocked; they are moved into Coverage-pending and pulled into quizzes once the user’s coverage map shows a deficit in that band or category.

Mastery threshold:
- Word is considered mastered when: Stable AND seenCount >= 5 AND correctCount/seenCount >= 0.85
- Mastered words still appear as Dormant reviews; they are never permanently excluded.

### 4.6 Quiz composition rules (V2 normal mode, exactly 10 slots)

Slot allocation (priority order for filling):
- Slot group A (3 slots): Struggling or Recovering words ordered by failScore descending.
- Slot group B (3 slots): Unseen or Learning words at difficulty nearest to current skillLevel.
- Slot group C (2 slots): Dormant or Stable words due for periodic review.
- Slot group D (1 slot): Confidence word at difficulty max(1, skillLevel - 1.5) from Stable pool.
- Slot group E (1 slot): Exploratory word at difficulty min(10, skillLevel + 2) from Unseen pool.

Fallback cascade when a slot group cannot fill its quota:
1. Slot group A is short (fewer than 3 Struggling/Recovering words):
   - Fill remaining A slots from Slot group B candidates at current skill.
2. Slot group B is short (fewer than 3 near-skill unseen/learning words):
   - Expand difficulty window by ±2 and retry.
   - If still short: fill from global unseen pool sorted by difficulty proximity to skill.
3. Slot group C is short (not enough Dormant/Stable due for review):
   - Fill from Stable words closest to skill level regardless of review schedule.
4. Slot group D is short (no confidence candidates):
   - Fill from any Learning word below skill.
5. Slot group E is short (no exploratory candidates at skill+2):
   - Try skill+1, then skill+3, then any unseen word.
6. Global fallback: if after all above total is still under 10:
   - Fill remaining slots with any words not already in this quiz, prioritizing near-skill unseen.
   - Deduplication: same word ID must never appear twice in one quiz.

Total must always equal exactly 10 before quiz starts. If the entire word pool has fewer than 10 eligible words (extremely unlikely given ~3000 entries), reduce quiz length to available count and log a warning.

Deterministic slot fill order:
- Within each slot group, choose candidates by:
  1. highest current review pressure
  2. then highest coverage pressure
  3. then oldest lastSeenQuiz
  4. then highest quizzesSinceWrong
  5. then lowest categorySeenCount
  6. then lowest id
- This prevents random drift and makes the same saved state produce the same next quiz structure.

Coverage pressure definition:
- Words or bands that have never been seen, or have not been seen recently enough relative to the user’s current skill, gain pressure.
- Coverage pressure is tracked per difficulty band and per category.
- If the user is doing poorly, weak/recovering words increase in pressure faster than new words.

### 4.7 Out-of-range word handling

Scenario: user's skillLevel is high (e.g. 8.5) but words at difficulty 1-3 were never seen.

Rule: All words in the unified pool are eligible for inclusion regardless of difficulty relative to skill. Difficulty determines slot priority and selection weight, but it does not create hard exclusions.

Specifically:
- Words at difficulty < (skillLevel - 3): treated as coverage-pending or dormant-eligible depending on whether they have been seen before.
  - They are not held back behind a literal fixed quiz count.
  - Instead, they enter a rolling coverage queue that uses quizzesSinceSeen, category coverage deficit, and difficulty-band deficit.
  - This prevents the system from waiting too long for an active user and also prevents over-serving easy words to a struggling user.
- Words at difficulty > (skillLevel + 3): treated as Exploratory but served at reduced frequency.
  - At most 1 slot per quiz for above-range words.
  - These increase in frequency as skillLevel rises to meet them.

If a user bootstrapped from a high legacy skill and has never seen A1 difficulty words:
- The system does not assume they can skip easier words forever.
- It should introduce at least one easy-band coverage word early, but exact timing is governed by coveragePressure rather than a rigid fixed count.
- If the user answers easy-band coverage words correctly, those words become Stable and their pressure drops.
- If the user keeps missing them, the system elevates them into Struggling/Recovering and slows introduction of harder words until weak-band coverage improves.
- If the user is already struggling badly, the scheduler should prefer weak/recovering words over new out-of-range material.

### 4.8 Future vocabulary expansion (adding words to the JSON later)

When new words are added to vocabulary.v2.min.json (from any source level):
- New words have IDs that are strictly higher than all existing IDs. IDs are never reused or reordered.
- Existing word records in user progress are unaffected because keys are IDs not positions.
- New words start as Unseen for all users and enter the normal selection pool immediately.
- No database migration or user data change is required when new words are added.
- The builder script must verify that no existing ID is reused and no existing row is reordered.
- A dataset version field in the JSON (v) should be incremented whenever rows are added or changed.
- The app should log dataset version on load so version drift can be detected in telemetry.
- If a word is ever removed from the dataset (rare), existing progress records for that ID become orphaned.
  - Orphaned IDs should be silently ignored during quiz selection.
  - They do not need to be purged from user records.
- New words must be self-sufficiently classifiable from the CSV metadata bundled into the build:
  - difficulty drives initial slot pressure
  - category_id drives category coverage balancing
  - word_type drives safe distractor generation and special-case handling
- The system must not rely on manual hand-tuning after new CSV rows are added.
  - On the next build, the new words become immediately visible to the unified dataset and the V2 scheduler.
- If multiple new words land in the same category or difficulty band, the scheduler must use deterministic tie-breaks rather than random choice.
- When a future CSV update adds new words to A1/A2/B1:
  - the builder assigns new IDs,
  - preserves difficulty/category exactly as authored,
  - and automatically recalculates the coverage map so V2 can start using them without a code change.

## 5. Progress Model and Bootstrap (No Mandatory Migration)

### 5.1 V2 row state under level=ALL

Suggested structure:

{
  "evaluationStage": 0,
  "skillLevel": 1,
  "skillConfidence": 0,
  "coverage": {
   "difficultyBands": { "1-3": 0, "4-6": 0, "7-8": 0, "9-10": 0 },
   "categorySeen": {},
   "categoryWrong": {}
  },
  "words": {
   "901": { "seenCount": 3, "correctCount": 2, "failScore": 2, "lastSeenQuiz": 7, "consecutiveCorrect": 1, "consecutiveWrong": 0, "quizzesSinceSeen": 2, "categoryId": 11 }
  },
  "recentWords": [901,1788],
  "quizStats": {
   "adaptive": { "quizzesCompleted": 0, "correctAnswers": 0, "incorrectAnswers": 0, "studyTimeSeconds": 0 },
   "theme": {}
  },
  "migration": {
   "fromLegacyLevels": true,
   "migratedAt": "ISO_DATETIME",
   "version": 1
  }
}

### 5.2 Runtime bootstrap flow (first V2 launch only)
1. Build lookup from source identity to unified ID:
  - (srcLevel, srcId) -> unified id
2. Read whichever legacy rows exist among A1/A2/B1.
3. Create ALL profile with available data only:
  - evaluationStage = max of existing legacy stages (missing levels ignored)
  - skillLevel = weighted from existing legacy skill and attempt counts (fallback to max skill)
  - words merged by mapped unified id
  - quizStats merged by sum
  - coverage map initialized from available legacy categories and difficulty bands
4. Upsert ALL row and continue directly into V2.
5. No external migration run is required.

### 5.3 Legacy row coexistence
- Never delete or overwrite A1/A2/B1 rows during V2 rollout.
- V2 reads them only for first-time bootstrap when ALL is missing.
- After ALL exists, V2 writes only ALL.
- Old adaptive continues reading/writing A1/A2/B1.
- Missing legacy level rows are valid and must not fail bootstrap.
- If only A2 and B1 exist, bootstrap should still be able to derive a valid ALL profile.
- If only one legacy row exists, bootstrap should still create ALL and calibrate from that row plus live quiz feedback.
- If no legacy row exists, ALL starts from a true cold start with no assumed proficiency.

## 6. Learning Profile Changes

### 6.1 Tabs
- Keep existing tabs:
  - A1, A2, B1
- Add new tab:
  - Adaptive

### 6.2 Default tab on open
- Learning profile should default to Adaptive tab when opened.
- This is required for V2 testing visibility.

### 6.3 Data source by tab
- Adaptive tab uses level=ALL row.
- A1/A2/B1 tabs continue to use existing rows.

### 6.4 Display parity
- Adaptive tab should include the same sections:
  - Overview
  - Activity
  - Performance
  - Review actions
- Performance should be category-based from word history in ALL profile.

## 7. Implementation Steps

1. Build script and dataset
  - Add scripts/merge_vocab.py to generate vocabulary.v2.min.json.
  - Add verification output and stable ID guarantees.

2. Add V2 loader and parsing
  - Add unified loader path in js/app.js for ALL runtime dataset.
  - Keep existing CSV loader untouched.

3. Add Adaptive V2 engine path
  - Separate module or guarded branch so legacy adaptive behavior cannot regress.

4. Add migration service in auth/data layer
  - Replace migration concept with runtime bootstrap service:
    - legacy read (partial rows supported)
    - unified merge
    - ALL upsert
    - no standalone migration command needed

5. Add learning profile Adaptive tab and default selection
  - Render from ALL row if present.
  - Fallback behavior:
    - if ALL missing and legacy exists, trigger migration seed on first V2/profile access.
    - if no legacy exists, show calibration-needed state.

6. Add telemetry for rollout confidence
  - adaptive_v2_bootstrap_started
  - adaptive_v2_bootstrap_completed
  - adaptive_v2_bootstrap_failed
  - adaptive_v2_started
  - adaptive_v2_quiz_completed

## 8. Execution Phases (LLM-Ready)

Phase 1: Unified JSON build pipeline
- Implement scripts/merge_vocab.py
- Generate data/vocabulary.v2.min.json
- Generate optional data/vocabulary.v2.map.json
- Run builder validation checks and fail build on schema/ID errors

Phase 2: V2 runtime loader (JSON-only)
- Add loader path for unified JSON in app logic
- Ensure V2 button path uses only JSON loader
- Confirm no direct CSV read is performed by V2 runtime

Phase 3: Adaptive V2 engine implementation
- Implement calibration and normal-mode scheduling
- Implement deterministic candidate selection and tie-break order
- Implement per-word and user-level counters and persistence updates
- Enforce exactly 10 questions per quiz in all V2 modes

Phase 4: Bootstrap and persistence coexistence
- Implement first-run bootstrap from available legacy rows into ALL
- Ensure partial/missing A1/A2/B1 rows are handled safely
- Ensure legacy rows are never overwritten by V2 path

Phase 5: Learning Profile integration
- Add Adaptive tab
- Default profile opening tab = Adaptive
- Ensure Adaptive tab reads level=ALL only
- Keep A1/A2/B1 tabs unchanged

Phase 6: Regression and compatibility
- Verify classic modes still use CSV and old adaptive logic unchanged
- Verify V2 uses unified JSON only
- Verify Supabase coexistence (A1/A2/B1 + ALL)

Phase 7: Final stabilization loop (must complete before marking plan done)
- Run full checks across functional, data, and edge-case scenarios
- Fix any missing/wrong logic or code found
- Re-run full checks
- Repeat fix + re-check cycle until all checks pass with no blocking issues
- Only then mark implementation as finished

## 9. Verification Plan

### 8.1 Automated checks
1. Builder validation
  - unified IDs are unique and stable
  - 100 percent source coverage from A1/A2/B1
  - tuple row width matches fields length
2. Bootstrap validation
  - every mapped legacy key resolves to unified ID
  - merged counters are non-negative and consistent
  - partial legacy data (only A2/B1, only B1, only A1, etc.) succeeds

### 8.2 Manual checks
1. Legacy regression
  - Existing adaptive A1/A2/B1 still behaves exactly as before.
2. V2 startup paths
  - Existing user with any subset of legacy rows gets seeded ALL profile.
  - New user without legacy data gets calibration flow.
3. Supabase rows
  - A1/A2/B1 rows remain untouched.
  - ALL row is created/updated by V2 only.
  - No prerequisite migration row/job is required before first V2 launch.
4. Learning profile
  - Opens on Adaptive tab by default.
  - A1/A2/B1 tabs still work.

## 10. Rollout Safety

1. Feature flag Adaptive V2 Beta entry.
2. Keep rollback simple: hide V2 entry and stop ALL writes.
3. Legacy path remains available at all times.

## 11. Future Optimization (After Stabilization)

1. Remove srcLevel and srcId from runtime dataset or move fully to map sidecar.
2. Consider binary compression of unified dataset for faster first load.
3. Tune calibration question mix based on real user telemetry.

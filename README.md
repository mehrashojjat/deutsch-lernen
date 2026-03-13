# DeutschLernen

A simple, browser-based flashcard game for learning German vocabulary — no installation, no login, just open and play.

---

## What is this?

**rovi Deutsch Lernen** is an interactive card game that helps you build German vocabulary across all CEFR levels (A1 → B2). Each round presents you with a word or phrase and asks you to pick the correct meaning. Cards cover nouns with their grammatical gender and cases, verbs with conjugations, adjectives with comparatives, and common phrases.

It runs entirely in the browser as a static HTML/JS app — no server or build step required.

---

## Word Sources

### Goethe-Institut Official Wortlisten *(primary)*
The core vocabulary comes from the official word lists published by the [Goethe-Institut](https://www.goethe.de) — Germany's internationally recognised language and cultural institute. These lists are the canonical CEFR-aligned references used in all Goethe-Zertifikat examinations.

| Level | Words used (CSV rows) | Description |
|-------|---------------------:|-------------|
| A1 | 812 | Starter – survival communication |
| A2 | 1059 | Elementary – everyday topics |
| B1 | 4272 | Intermediate – independent use |

### Additional Sources
- **DWDS** – *Digitales Wörterbuch der deutschen Sprache* ([dwds.de](https://www.dwds.de)) — comprehensive dictionary entries with meanings, grammar, and example sentences, maintained by the Berlin-Brandenburg Academy of Sciences and Humanities.
- **Leipzig Corpora / German Frequency Lists** ([wortschatz.uni-leipzig.de](https://wortschatz.uni-leipzig.de)) — the ~3 000 most frequently used German words, based on a 100M+ sentence corpus.
- **German–Turkish word list** — a bilingual reference included to support Turkish-speaking learners.

---

## How to Run

Open `index.html` in any modern browser. That's it.

---

---

## Adaptive Quiz System

### Overview

Each word in the dataset carries a **difficulty rating from 1 to 10**. Each user maintains a floating-point **skill level** on the same scale. The system uses these two numbers to continuously tailor each quiz — targeting words near the user's current level, reinforcing previously failed words, and periodically probing for potential improvement.

---

### Word Difficulty (1–10)

Difficulty values are assigned per word in the CSV data and represent increasing linguistic complexity within each CEFR level. Level A1 contains words rated 1–10 within the beginner range; A2 and B1 each have their own independent 1–10 scale calibrated to their respective vocabulary demands. A score of 1 within a level means the simplest, highest-frequency words for that level; a score of 10 means the most demanding vocabulary within that level.

---

### Evaluation Phase

Before entering adaptive mode, each user completes three diagnostic quizzes designed to estimate their starting skill level as precisely as possible.

**Eval 1 — Breadth scan**
One word is selected from each difficulty tier 1 through 10, giving a 10-card quiz spanning the full range. After the quiz, skill is calculated as the **position-weighted average difficulty of all correct answers**. Cards answered later in the quiz (higher difficulty) receive a higher weight (up to 2×), so a user who handles harder words correctly earns a proportionally higher initial estimate.

**Eval 2 — Focused confirmation**
Using the Eval 1 estimate as a starting point (S), the quiz is built with: 2 words at S−2, 2 at S−1, 3 at S, 2 at S+1, and 1 exploration word beyond S+1. After the quiz, skill is updated to the **average of the old skill and the average difficulty of all correct answers**, converging toward the user's demonstrated ability.

**Eval 3 — Normal-mode trial**
Uses the same word distribution as normal quizzes (see below) and applies the same skill update formula. After Eval 3 completes, `evaluationStage` is set to 3 and the user enters permanent adaptive mode.

---

### Adaptive Quiz Logic

Every quiz is generated along two independent dimensions that are then combined:

**Word history dimension** — 10 type slots are filled as:
- 5 × New (never seen before)
- 3 × Failed (previously answered incorrectly)
- 2 × Review (seen before, currently failing-score-free)

**Difficulty dimension** — 10 difficulty slots are generated around the user's current skill index (SI = rounded skill level):
- 1 × SI−2
- 1 × SI−1
- 3 × SI
- 2 × SI+1
- 2 × Exploration
- 1 × Fallback

All difficulty values are clamped to [1, 10]. The type slots and difficulty slots are each independently shuffled, then paired positionally. This ensures each quiz has both the correct type mix and the correct difficulty spread without any fixed ordering.

For each slot, the system first tries to find a word from the preferred type pool at the target difficulty. If none is available it relaxes the type restriction while keeping the difficulty target. If still no word is found it falls back to any unused word regardless of type or difficulty.

---

### Skill Adjustment

After every quiz (Eval 3 and all normal quizzes), skill level is updated with:

```
skillLevel += (accuracy - 0.65) * 0.6
skillLevel  = clamp(skillLevel, 1, 10)
```

The neutral point is **65% accuracy**. Scoring above 65% raises the skill level; below 65% lowers it. The maximum possible change per quiz is +0.21 (100% accuracy) or −0.39 (0% accuracy). This asymmetry means the system is slightly conservative — it requires consistently strong performance to push the skill level up, while a single poor quiz has a modest corrective effect.

Skill level is **only updated when a quiz is completed normally** (reaching the results screen). Leaving a quiz mid-way or refreshing the page has no effect on stored progress.

---

### Memory Reinforcement

Each word tracks a **fail score** that accumulates with incorrect answers and decays with correct ones:

- Wrong answer → `failScore += 2`
- Correct answer → `failScore -= 1` (minimum 0)

This means a single wrong answer requires **two correct answers to clear**. Words with a positive fail score are classified as "Failed" and occupy 3 of the 10 slots in every quiz until they are fully recovered. This forces repeated exposure to difficult words and prevents them from being buried by new vocabulary.

---

### Exploration

Two of the 10 difficulty slots in every quiz are designated **exploration slots**. The exploration selector prefers words with difficulty **strictly above SI+1**, with a hard cap at **SI+3**. If no words exist in that range, it widens to any word at least 2 difficulty levels from the current skill. This gives the system a systematic way to test whether the user is ready to advance, without overwhelming the quiz with material that is too far out of reach.

---

### Anti-Repetition

Every word the user sees is added to a **recentWords list** capped at the 25 most recent word IDs. When selecting words for any slot, the system first attempts to pick from words not on this list. Only if no such candidate exists does it allow recently seen words. This prevents the same words from appearing across back-to-back quizzes and encourages broader vocabulary coverage over time.

---

### Level Isolation

A1, A2, and B1 each maintain completely independent progress records. Skill level, evaluation stage, word history (fail scores, seen counts), and the recent-words list are all stored and updated separately for each level. A user can be in Eval 2 on A1, normal adaptive mode on A2, and untouched on B1 simultaneously, with no cross-level interference.

For signed-in users all three levels are persisted to the database under a composite key of `(user_id, level)`, and all three are loaded in parallel on sign-in so level switching requires no extra network round-trips.

---

## License

Word list data is used for educational purposes. Please refer to each source's own terms:
- Goethe-Institut Wortlisten: freely available exam-preparation material
- DWDS: [CC-BY open data](https://www.dwds.de/d/nutzungsbedingungen)
- Leipzig Corpora: free for research and educational use

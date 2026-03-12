#!/usr/bin/env python3
"""
Expand B1 difficulty from 1-3 to 1-10 scale.
  old 1 → new 1–3
  old 2 → new 4–7
  old 3 → new 8–10

B1 vocabulary note: the original 1-3 bands were assigned using a length-based
heuristic (≤5→1, 6-8→2, ≥9→3), so within-band length variation is narrow.
Band-2 thresholds map directly to single character lengths (6→4, 7→5, 8→6).
Band-3 uses a wider window to accommodate the many 9-11 char compounds.
"""
import csv
from collections import Counter

# Manual overrides: word → new difficulty (1-10)
OVERRIDES = {
    # ── Band 1: ultra-common function words / basic verbs (→ 1) ──
    # Length ≥5 but should be at the very bottom of difficulty
    'gehen':    1,
    'haben':    1,
    'kommen':   1,
    'machen':   1,
    'sagen':    1,
    'geben':    1,
    'nicht':    1,
    'immer':    1,
    'schon':    1,
    'wurde':    1,   # simple past form of "sein"
    'meine':    1,   # basic possessive
    'viele':    1,   # basic quantifier
    'ander':    1,   # basic "other"
    'aller':    1,
    'einen':    1,
    'musst':    1,   # modal past form

    # ── Band 1: common but slightly more complex (len 5 → 2 instead of 3) ──
    'durch':    2,   # preposition, slightly less basic
    'wurde':    1,   # already above

    # ── Band 2: special cases ──
    # (None needed; single char-length mapping works well for band 2)

    # ── Band 3: calibration to example words ──
    'Verantwortung': 9,   # example says 9; heuristic gives 10 (len 13)
}


def get_new_difficulty(word: str, old_difficulty: int) -> int:
    w = word.strip()
    if w in OVERRIDES:
        return OVERRIDES[w]

    # Length without spaces
    wl = len(w.replace(' ', ''))

    if old_difficulty == 1:
        # target band: 1–3
        # B1 band-1 words are clustered at len 2-5 (original heuristic ≤5→1)
        if wl <= 3:
            return 1
        elif wl <= 4:
            return 2
        else:
            return 3  # len 5+ within the "easy" band

    elif old_difficulty == 2:
        # target band: 4–7
        # B1 band-2 words cluster tightly at len 6-8 (heuristic 6-8→2)
        # Map each char-length to its own sub-level
        if wl <= 6:
            return 4
        elif wl == 7:
            return 5
        elif wl == 8:
            return 6
        else:
            return 7   # len 9+ within the "medium" band

    else:  # old_difficulty == 3
        # target band: 7–10 (the shortest band-3 words drop to 7 to fill that sparse level)
        # B1 band-3 words range from len 6 (semantic overrides) to len 20 (compounds)
        if wl <= 8:
            return 7   # short but semantically hard (abstract nouns, etc.)
        elif wl <= 10:
            return 8
        elif wl <= 11:
            return 9
        else:
            return 10


def main():
    path = '/home/user/deutsch-lernen/word_data/quiz_csv/b1.csv'

    rows = []
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)

        diff_idx = header.index('difficulty')
        word_idx = header.index('word')

        rows.append(header)
        for row in reader:
            old_diff = int(row[diff_idx])
            word     = row[word_idx] if len(row) > word_idx else ''
            new_diff = get_new_difficulty(word, old_diff)
            row[diff_idx] = str(new_diff)
            rows.append(row)

    with open(path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    # Report distribution
    counts = Counter(int(row[diff_idx]) for row in rows[1:])
    total  = sum(counts.values())
    print(f"B1: {total} words")
    for d in range(1, 11):
        c = counts.get(d, 0)
        print(f"  Difficulty {d:2d}: {c:4d}  ({c/total*100:.1f}%)")


if __name__ == '__main__':
    main()

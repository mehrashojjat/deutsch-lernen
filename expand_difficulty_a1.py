#!/usr/bin/env python3
"""
Expand A1 difficulty from 1-3 to 1-10 scale.
  old 1 → new 1–3
  old 2 → new 4–7
  old 3 → new 8–10
Within each band, difficulty increases with word complexity/length.
"""
import csv
from collections import Counter

# Manual overrides: word → new difficulty (1-10)
OVERRIDES = {
    # ── Band 1: too long for heuristic but extremely basic ──
    'gehen':    1,   # fundamental movement verb
    'haben':    1,
    'machen':   1,
    'sagen':    1,
    'geben':    1,
    'kommen':   1,
    'nicht':    1,   # essential negation particle
    'immer':    1,   # very high frequency adverb
    'schon':    1,   # extremely frequent
    'danke':    1,   # greeting

    # Band 1: heuristic gives 3 (len≥7) but these are common enough for 2
    'schlecht': 2,   # basic adjective despite len 8
    'spielen':  2,   # very common verb, len 7 → would be 3
    'trinken':  2,   # very common verb, len 7 → would be 3
    'Familie':  2,   # very common noun, len 7 → would be 3
    'Tochter':  2,   # common family word, len 7 → would be 3
    'schnell':  2,   # common adjective, len 7 → would be 3
    'tschüss':  2,   # basic greeting, len 7 → would be 3

    # ── Band 2: multi-word expressions — strip-space heuristic over-rates them ──
    'was für ein':   5,   # basic question expression (no-space len 9 → 7)
    'Pommes frites': 6,   # common food (no-space len 12 → 7)
}


def get_new_difficulty(word: str, old_difficulty: int) -> int:
    w = word.strip()
    if w in OVERRIDES:
        return OVERRIDES[w]

    # Length without spaces (handles multi-word phrases more fairly)
    wl = len(w.replace(' ', ''))

    if old_difficulty == 1:
        # target band: 1–3
        # len≤4 → 1 (short function/content words), len 5 → 2, len≥6 → 3
        # Wider level-3 window ensures at least 5% of total reach difficulty 3
        if wl <= 4:
            return 1
        elif wl <= 5:
            return 2
        else:
            return 3

    elif old_difficulty == 2:
        # target band: 4–7
        if wl <= 5:
            return 4
        elif wl <= 6:
            return 5
        elif wl <= 7:
            return 6
        else:
            return 7

    else:  # old_difficulty == 3
        # target band: 8–10
        if wl <= 7:
            return 8
        elif wl <= 10:
            return 9
        else:
            return 10


def main():
    path = '/home/user/deutsch-lernen/word_data/quiz_csv/a1.csv'

    rows = []
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)

        diff_idx     = header.index('difficulty')
        word_idx     = header.index('word')

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
    print(f"A1: {total} words")
    for d in range(1, 11):
        c = counts.get(d, 0)
        print(f"  Difficulty {d:2d}: {c:4d}  ({c/total*100:.1f}%)")


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Expand A2 difficulty from 1-3 to 1-10 scale.
  old 1 → new 1–3
  old 2 → new 4–7
  old 3 → new 8–10
Within each band, difficulty increases with word complexity / length.
"""
import csv
from collections import Counter

# Manual overrides: word → new difficulty (1-10)
OVERRIDES = {
    # ── Band 1: shorter than heuristic suggests but clearly basic (→ 1) ──
    'Mutter':   1,   # fundamental family noun (len 6 → heuristic gives 2)
    'Eltern':   1,
    'Bruder':   1,
    'Schule':   1,
    'Arbeit':   1,
    'Morgen':   1,   # basic time noun
    'Abend':    1,
    'Nacht':    1,
    'Woche':    1,
    'Stunde':   1,
    'Minute':   1,
    'Sommer':   1,
    'Winter':   1,
    'einmal':   1,   # very common adverb

    # ── Band 1: longer than heuristic, but very common words (→ 2) ──
    'schwarz':      2,   # basic color (len 7 → heuristic gives 3)
    'schnell':      2,
    'spielen':      2,
    'trinken':      2,
    'möchten':      2,
    'bleiben':      2,
    'bringen':      2,
    'glauben':      2,
    'richtig':      2,
    'geboren':      2,
    'gestern':      2,
    'schlecht':     2,
    'wirklich':     2,
    'natürlich':    2,   # len 9 → heuristic gives 3; very common
    'Deutschland':  2,   # len 11 → heuristic gives 3; fundamental word
    'glücklich':    2,   # len 9; very common adjective
    'vielleicht':   2,   # len 10; extremely common adverb

    # ── Band 2: multi-word expressions ──
    'ein bisschen':     5,   # very common expression
    'auf Wiedersehen':  6,   # farewell phrase
}


def get_new_difficulty(word: str, old_difficulty: int) -> int:
    w = word.strip()
    if w in OVERRIDES:
        return OVERRIDES[w]

    # Length without spaces (handles multi-word phrases fairly)
    wl = len(w.replace(' ', ''))

    if old_difficulty == 1:
        # target band: 1–3
        if wl <= 4:
            return 1
        elif wl <= 5:
            return 2
        else:
            return 3

    elif old_difficulty == 2:
        # target band: 4–7
        if wl <= 4:
            return 4
        elif wl <= 6:
            return 5
        elif wl <= 8:
            return 6
        else:
            return 7

    else:  # old_difficulty == 3
        # target band: 8–10
        # A2 band-3 words are more complex than A1 band-3 → tighter upper threshold
        if wl <= 7:
            return 8
        elif wl <= 9:
            return 9
        else:
            return 10


def main():
    path = '/home/user/deutsch-lernen/word_data/quiz_csv/a2.csv'

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
    print(f"A2: {total} words")
    for d in range(1, 11):
        c = counts.get(d, 0)
        print(f"  Difficulty {d:2d}: {c:4d}  ({c/total*100:.1f}%)")


if __name__ == '__main__':
    main()

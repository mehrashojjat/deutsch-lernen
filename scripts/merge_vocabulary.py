#!/usr/bin/env python3
"""
Merge vocabulary data from A1, A2, and B1 CSV files into a single all_words.csv.
Extracts: id, word, difficulty — and adds a level column per source file.
"""

import csv
import os

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "word_data", "quiz_csv")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "word_data", "all_words.csv")

SOURCES = [
    ("a1.csv", "A1"),
    ("a2.csv", "A2"),
    ("b1.csv", "B1"),
]

rows = []
counts = {}

for filename, level in SOURCES:
    path = os.path.join(BASE_DIR, filename)
    level_count = 0
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append({
                "id": row["id"],
                "word": row["word"],
                "difficulty": row["difficulty"],
                "level": level,
            })
            level_count += 1
    counts[level] = level_count
    print(f"  Loaded {level_count} rows from {filename} (level={level})")

with open(OUTPUT_PATH, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["id", "word", "difficulty", "level"])
    writer.writeheader()
    writer.writerows(rows)

total = len(rows)
print(f"\nWrote {total} rows to all_words.csv")
for level, count in counts.items():
    print(f"  {level}: {count} rows")

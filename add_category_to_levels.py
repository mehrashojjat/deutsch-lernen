#!/usr/bin/env python3
"""
Copy category column from categorized_words.csv into a1.csv, a2.csv, b1.csv.
Matches rows by (level, id). Verifies every 100th row. Reports missing ids.
"""

import csv
import os
import random

CATEGORIZED = "word_data/categorized_words.csv"
LEVEL_FILES = {
    "A1": "word_data/quiz_csv/a1.csv",
    "A2": "word_data/quiz_csv/a2.csv",
    "B1": "word_data/quiz_csv/b1.csv",
}

# ── Step 1: Build id→category map per level ──────────────────────────────────
id_to_category = {}   # (level, id) → category
id_to_word = {}       # (level, id) → word (for verification)

with open(CATEGORIZED, newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        key = (row["level"], row["id"])
        id_to_category[key] = row["theme"]
        id_to_word[key] = row["word"]

print(f"Loaded {len(id_to_category)} category mappings from {CATEGORIZED}\n")

# ── Step 2: Process each level file ──────────────────────────────────────────
verification_summary = {}

for level, filepath in LEVEL_FILES.items():
    with open(filepath, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        original_fields = reader.fieldnames
        rows = list(reader)

    missing_ids = []
    sample_rows = []   # rows chosen for verification (every 100th)
    updated_rows = []

    for idx, row in enumerate(rows):
        key = (level, row["id"])
        category = id_to_category.get(key)

        if category is None:
            missing_ids.append(row["id"])
            print(f"  WARNING [{level}] id={row['id']} (word={row['word']!r}) not found in categorized_words.csv")
            category = ""

        new_row = dict(row)
        new_row["category"] = category
        updated_rows.append(new_row)

        # Collect every 100th row for verification
        if (idx + 1) % 100 == 0:
            sample_rows.append((idx, row["id"], row["word"], category, key))

    # Write updated file (preserve column order, append 'category' at end)
    out_fields = original_fields + ["category"]
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=out_fields)
        writer.writeheader()
        writer.writerows(updated_rows)

    # ── Verify samples ────────────────────────────────────────────────────────
    errors = 0
    for idx, row_id, word, applied_category, key in sample_rows:
        expected_category = id_to_category.get(key, "")
        expected_word = id_to_word.get(key, "")

        id_ok = row_id == key[1]
        cat_ok = applied_category == expected_category
        word_ok = word.lower() == expected_word.lower()

        if not (id_ok and cat_ok and word_ok):
            errors += 1
            print(f"  VERIFY FAIL [{level}] row={idx+1} id={row_id} word={word!r} "
                  f"category={applied_category!r} expected={expected_category!r}")

    verification_summary[level] = {
        "samples": len(sample_rows),
        "errors": errors,
        "missing": len(missing_ids),
        "total": len(rows),
    }

    status = "OK" if errors == 0 else f"{errors} ERRORS"
    print(f"{level}: wrote {len(rows)} rows, {len(sample_rows)} samples verified [{status}]"
          + (f", {len(missing_ids)} missing ids" if missing_ids else ""))

# ── Step 3: Summary ───────────────────────────────────────────────────────────
print("\nVerified sample rows:")
for level, info in verification_summary.items():
    status = "OK" if info["errors"] == 0 else f"{info['errors']} ERRORS"
    print(f"  {level}: {info['samples']} samples {status}")

total_missing = sum(v["missing"] for v in verification_summary.values())
if total_missing:
    print(f"\nWARNING: {total_missing} ids had no matching category.")
else:
    print("\nAll ids matched successfully.")

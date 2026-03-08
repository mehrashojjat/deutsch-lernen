#!/usr/bin/env python3
"""Dump the A1 PDF text page by page to stdout for inspection."""
import fitz
import os

PDF = os.path.join(os.path.dirname(__file__), "../word_data/quiz_csv/A1_SD1_Wortliste_02.pdf")

doc = fitz.open(PDF)
print(f"Total pages: {len(doc)}")
for page in doc:
    print(f"\n=== PAGE {page.number + 1} ===")
    print(page.get_text())

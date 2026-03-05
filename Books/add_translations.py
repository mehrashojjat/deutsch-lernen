#!/usr/bin/env python3
"""
Add English translations to a German word list CSV.

Usage:
    python add_translations.py <csv_path> [--lang en]

Adds a column named 'translation_<lang>' (default: translation_en).
Translates using Claude API in batches. Skips rows that already have a value.
"""

import csv
import json
import os
import sys
import time
import argparse
import anthropic

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

SYSTEM_PROMPT = """You are a German-to-English dictionary. Given a list of German words with their
grammatical info, return ONLY a JSON object mapping each word_id to its English translation.

Rules:
- One concise translation per word (the most common meaning)
- For nouns: just the English noun without article (e.g. "house", not "the house")
- For verbs: infinitive form (e.g. "to go" or just "go")
- For numbers: the English number word
- For abbreviations: expand to English equivalent
- For section titles (entry_type=section_title): translate the German title
- Keep proper nouns (country names, cities) in their English form
- Respond ONLY with a valid JSON object, no extra text
"""


def build_batch_prompt(batch):
    """Build a prompt for a batch of rows."""
    lines = []
    for row in batch:
        word = row['word']
        article = row.get('article', '')
        word_type = row.get('word_type', '')
        entry_type = row.get('entry_type', '')
        extra = []
        if article:
            extra.append(f"article={article}")
        if word_type:
            extra.append(f"type={word_type}")
        if entry_type:
            extra.append(f"entry={entry_type}")
        meta = ', '.join(extra)
        lines.append(f'  {row["id"]}: "{word}" ({meta})')
    return "Translate these German words to English:\n" + "\n".join(lines)


def translate_batch(client, batch, lang='en', retries=3):
    """Translate a batch of rows. Returns dict {id: translation}."""
    prompt = build_batch_prompt(batch)
    for attempt in range(retries):
        try:
            msg = client.messages.create(
                model='claude-haiku-4-5-20251001',
                max_tokens=2048,
                system=SYSTEM_PROMPT,
                messages=[{'role': 'user', 'content': prompt}],
            )
            text = msg.content[0].text.strip()
            # Extract JSON if wrapped in code block
            if text.startswith('```'):
                text = text.split('```')[1]
                if text.startswith('json'):
                    text = text[4:]
                text = text.strip()
            result = json.loads(text)
            # Keys may come back as strings or ints
            return {str(k): v for k, v in result.items()}
        except Exception as e:
            if attempt < retries - 1:
                wait = 2 ** attempt
                print(f"    Retry {attempt+1}/{retries} after error: {e} (waiting {wait}s)")
                time.sleep(wait)
            else:
                print(f"    FAILED after {retries} attempts: {e}")
                return {}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('csv_path', nargs='?',
                        default=os.path.join(SCRIPT_DIR, 'A1_SD1_Wortliste_02.csv'))
    parser.add_argument('--lang', default='en', help='ISO 639-1 language code (default: en)')
    parser.add_argument('--batch-size', type=int, default=50)
    args = parser.parse_args()

    col = f'translation_{args.lang}'
    csv_path = args.csv_path

    print(f"Reading {csv_path} …")
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        rows = list(reader)

    # Add column if missing
    if col not in fieldnames:
        fieldnames = list(fieldnames) + [col]
        for row in rows:
            row[col] = ''

    # Find rows needing translation
    todo = [r for r in rows if not r.get(col, '').strip()]
    print(f"  {len(rows)} total rows, {len(todo)} need translation (column: {col})")

    if not todo:
        print("Nothing to do.")
        return

    api_key = os.environ.get('ANTHROPIC_API_KEY', '')
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY not set.")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    # Build lookup by id
    row_by_id = {r['id']: r for r in rows}

    batch_size = args.batch_size
    batches = [todo[i:i+batch_size] for i in range(0, len(todo), batch_size)]
    print(f"  Translating in {len(batches)} batches of up to {batch_size} …")

    total_done = 0
    for bi, batch in enumerate(batches, 1):
        print(f"  Batch {bi}/{len(batches)} ({len(batch)} words) …", end=' ', flush=True)
        translations = translate_batch(client, batch, lang=args.lang)
        for row in batch:
            t = translations.get(str(row['id']), '')
            if t:
                row_by_id[row['id']][col] = t
                total_done += 1
        print(f"got {len(translations)} translations")
        # Small pause to respect rate limits
        if bi < len(batches):
            time.sleep(0.5)

    # Write back
    print(f"\nWriting {csv_path} with {col} column …")
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    filled = sum(1 for r in rows if r.get(col, '').strip())
    print(f"Done — {filled}/{len(rows)} rows have translations.")


if __name__ == '__main__':
    main()

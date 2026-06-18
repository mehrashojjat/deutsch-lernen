#!/usr/bin/env python3
"""Merge vocabulary.b1.new.map.json into production vocabulary.v2 files."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"

NEW_MAP_PATH = DATA_DIR / "vocabulary.b1.new.map.json"
PROD_MIN_PATH = DATA_DIR / "vocabulary.v2.min.json"
PROD_MAP_PATH = DATA_DIR / "vocabulary.v2.map.json"

WORD_TYPE_MAP = {
    "Noun": "N",
    "Verb": "V",
    "Adjective": "A",
    "Phrase": "P",
    "Adverb": "D",
    "Number": "#",
    "Word": "W",
    "Other": "W",
}

ARTICLE_MAP = {
    "der": "r",
    "die": "e",
    "das": "s",
}

TR_LANGS = ["en", "tr", "fa", "ru", "uk", "ar"]


def parse_category_id(raw) -> int:
    text = str(raw or "").strip()
    if not text.isdigit():
        return 0
    return int(text)


def to_compact(entry: dict) -> list:
    word = entry["word"]
    lemma = word.lower()
    word_type = WORD_TYPE_MAP.get(entry.get("word_type", ""), "W")
    article = ARTICLE_MAP.get((entry.get("article") or "").lower(), "")
    translations = entry.get("translations") or {}
    tr_list = [str(translations.get(lang, "") or "") for lang in TR_LANGS]
    return [
        lemma,
        word_type,
        article,
        tr_list,
        int(entry["difficulty"]),
        parse_category_id(entry.get("category_id")),
        entry.get("example_de") or "",
        entry.get("plural") or "",
        word,
    ]


def main() -> int:
    for path in (NEW_MAP_PATH, PROD_MIN_PATH, PROD_MAP_PATH):
        if not path.exists():
            print(f"Missing required file: {path}", file=sys.stderr)
            return 1

    new_map = json.loads(NEW_MAP_PATH.read_text(encoding="utf-8"))
    new_entries = new_map.get("entries") or {}

    missing_category = [
        key for key, entry in new_entries.items()
        if not str(entry.get("category_id", "")).strip().isdigit()
    ]
    if missing_category:
        sample = ", ".join(missing_category[:5])
        print(
            f"Refusing merge: {len(missing_category)} entries have empty category_id "
            f"(fill 1–21 in vocabulary.b1.new.map.json first). Sample IDs: {sample}",
            file=sys.stderr,
        )
        return 1

    new_min = {key: to_compact(entry) for key, entry in new_entries.items()}

    prod_min = json.loads(PROD_MIN_PATH.read_text(encoding="utf-8"))
    prod_map = json.loads(PROD_MAP_PATH.read_text(encoding="utf-8"))

    overlap = set(new_min.keys()) & set(prod_min.keys())
    if overlap:
        sample = ", ".join(sorted(overlap, key=int)[:5])
        print(f"Refusing merge: overlapping unified IDs ({len(overlap)}): {sample}", file=sys.stderr)
        return 1

    merged_min = dict(prod_min)
    merged_min.update(new_min)

    merged_entries = dict(prod_map.get("entries", {}))
    merged_entries.update(new_entries)

    level_counts = {"A1": 0, "A2": 0, "B1": 0}
    for entry in merged_entries.values():
        level = entry.get("level")
        if level in level_counts:
            level_counts[level] += 1

    merged_map = {
        "meta": {
            "total": len(merged_entries),
            "levels": level_counts,
            "schema": prod_map.get("meta", {}).get(
                "schema",
                "[lemma, type, article, tr[6], difficulty, category_id, example_de, plural, word]",
            ),
        },
        "entries": merged_entries,
    }

    PROD_MIN_PATH.write_text(
        json.dumps(merged_min, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    PROD_MAP_PATH.write_text(
        json.dumps(merged_map, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Merged {len(new_min)} new entries into production vocabulary")
    print(f"Total entries: {len(merged_entries)}")
    print("Counts:", ", ".join(f"{k}={v}" for k, v in level_counts.items()))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

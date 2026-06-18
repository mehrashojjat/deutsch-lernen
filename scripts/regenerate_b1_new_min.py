#!/usr/bin/env python3
"""Regenerate data/vocabulary.b1.new.min.json from vocabulary.b1.new.map.json."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"

MAP_PATH = DATA_DIR / "vocabulary.b1.new.map.json"
MIN_PATH = DATA_DIR / "vocabulary.b1.new.min.json"

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
    return int(text) if text.isdigit() else 0


def to_compact(entry: dict) -> list:
    word = entry["word"]
    translations = entry.get("translations") or {}
    return [
        word.lower(),
        WORD_TYPE_MAP.get(entry.get("word_type", ""), "W"),
        ARTICLE_MAP.get((entry.get("article") or "").lower(), ""),
        [str(translations.get(lang, "") or "") for lang in TR_LANGS],
        int(entry["difficulty"]),
        parse_category_id(entry.get("category_id")),
        entry.get("example_de") or "",
        entry.get("plural") or "",
        word,
    ]


def main() -> int:
    if not MAP_PATH.exists():
        print(f"Missing map file: {MAP_PATH}", file=sys.stderr)
        return 1

    payload = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    entries = payload.get("entries") or {}
    compact = {key: to_compact(entry) for key, entry in entries.items()}

    MIN_PATH.write_text(
        json.dumps(compact, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"Wrote {MIN_PATH} ({len(compact)} entries)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

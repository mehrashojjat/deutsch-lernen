#!/usr/bin/env python3
"""Merge A1/A2/B1 CSV word lists into unified vocabulary.v2.min.json."""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"

LEVELS = [
    ("A1", 1, DATA_DIR / "a1.csv"),
    ("A2", 2, DATA_DIR / "a2.csv"),
    ("B1", 3, DATA_DIR / "b1.csv"),
]

WORD_TYPE_MAP = {
    "Noun": "N",
    "Verb": "V",
    "Adjective": "A",
    "Phrase": "P",
    "Adverb": "D",
    "Number": "#",
    "Word": "W",
}

ARTICLE_MAP = {
    "der": "r",
    "die": "e",
    "das": "s",
}

TR_LANGS = ["translation_en", "translation_tr", "translation_fa", "translation_ru", "translation_uk", "translation_ar"]


def unified_id(level_digit: int, src_id: str) -> int:
    return int(f"{level_digit}{src_id}")


def parse_row(row: dict, level: str, level_digit: int) -> tuple[int, list, dict] | None:
    if row.get("entry_type") != "main":
        return None

    difficulty_raw = row.get("difficulty", "").strip()
    if not difficulty_raw.isdigit():
        return None
    difficulty = int(difficulty_raw)
    if difficulty < 1 or difficulty > 10:
        return None

    src_id = row.get("id", "").strip()
    if not src_id:
        return None

    uid = unified_id(level_digit, src_id)
    word = row.get("word", "").strip()
    if not word:
        return None

    lemma = word.lower()
    word_type = WORD_TYPE_MAP.get(row.get("word_type", "").strip(), "W")
    article = ARTICLE_MAP.get(row.get("article", "").strip().lower(), "")
    translations = [(row.get(key) or "").strip() for key in TR_LANGS]

    category_raw = row.get("category_id", "").strip()
    category_id = int(category_raw) if category_raw.isdigit() else 0
    example_de = (row.get("example_de") or "").strip()
    plural = (row.get("plural") or "").strip()

    compact = [lemma, word_type, article, translations, difficulty, category_id, example_de, plural, word]
    sidecar = {
        "unified_id": uid,
        "level": level,
        "src_id": src_id,
        "word": word,
        "article": row.get("article", "").strip(),
        "plural": plural,
        "word_type": row.get("word_type", "").strip(),
        "difficulty": difficulty,
        "category_id": category_id,
        "example_de": example_de,
        "translations": dict(zip(["en", "tr", "fa", "ru", "uk", "ar"], translations)),
    }
    return uid, compact, sidecar


def load_level(level: str, level_digit: int, path: Path) -> tuple[dict, dict, list[str]]:
    if not path.exists():
        raise FileNotFoundError(f"Missing CSV: {path}")

    payload: dict[str, list] = {}
    sidecar: dict[str, dict] = {}
    errors: list[str] = []

    with path.open(newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        for line_no, row in enumerate(reader, start=2):
            parsed = parse_row(row, level, level_digit)
            if not parsed:
                continue
            uid, compact, meta = parsed
            key = str(uid)
            if key in payload:
                errors.append(f"{path.name}:{line_no} duplicate unified id {uid}")
                continue
            payload[key] = compact
            sidecar[key] = meta

    return payload, sidecar, errors


def validate(payload: dict[str, list], sidecar: dict[str, dict]) -> list[str]:
    errors: list[str] = []
    ids = list(payload.keys())

    if len(ids) != len(set(ids)):
        errors.append("Unified IDs are not unique")

    for key, entry in payload.items():
        if not isinstance(entry, list) or len(entry) not in (6, 7, 8, 9):
            errors.append(f"{key}: invalid tuple length (expected 6–9, got {len(entry) if isinstance(entry, list) else '?'})")
            continue

        lemma, word_type, article, translations, difficulty, category_id = entry[:6]
        example_de = entry[6] if len(entry) > 6 else ""
        plural = entry[7] if len(entry) > 7 else ""
        display_word = entry[8] if len(entry) > 8 else lemma
        meta = sidecar.get(key)
        if not meta:
            errors.append(f"{key}: missing sidecar entry")
            continue

        if lemma != meta["word"].lower():
            errors.append(f"{key}: lemma mismatch ({lemma!r} vs {meta['word']!r})")

        if WORD_TYPE_MAP.get(meta["word_type"], "W") != word_type:
            errors.append(f"{key}: type mismatch ({word_type!r})")

        expected_article = ARTICLE_MAP.get(meta["article"].lower(), "")
        if expected_article != article:
            errors.append(f"{key}: article mismatch ({article!r})")

        if not isinstance(translations, list) or len(translations) != 6:
            errors.append(f"{key}: translations must contain 6 language strings")
        elif translations[0] != meta["translations"]["en"]:
            errors.append(f"{key}: English translation mismatch")

        if difficulty != meta["difficulty"]:
            errors.append(f"{key}: difficulty mismatch")
        if category_id != meta["category_id"]:
            errors.append(f"{key}: category_id mismatch")

        if example_de != meta.get("example_de", ""):
            errors.append(f"{key}: example_de mismatch")
        if plural != meta.get("plural", ""):
            errors.append(f"{key}: plural mismatch")
        if display_word != meta.get("word", ""):
            errors.append(f"{key}: display word mismatch")

        level_digit = int(str(key)[0])
        if level_digit not in (1, 2, 3):
            errors.append(f"{key}: invalid level digit {level_digit}")

    return errors


def main() -> int:
    merged: dict[str, list] = {}
    sidecar: dict[str, dict] = {}
    all_errors: list[str] = []
    per_level_counts: dict[str, int] = {}

    for level, level_digit, path in LEVELS:
        level_payload, level_sidecar, errors = load_level(level, level_digit, path)
        per_level_counts[level] = len(level_payload)
        all_errors.extend(errors)

        overlap = set(merged.keys()) & set(level_payload.keys())
        if overlap:
            sample = sorted(overlap)[:5]
            all_errors.append(f"Cross-level ID collision for ids: {', '.join(sample)}")

        merged.update(level_payload)
        sidecar.update(level_sidecar)

    validation_errors = validate(merged, sidecar)
    all_errors.extend(validation_errors)

    out_min = DATA_DIR / "vocabulary.v2.min.json"
    out_map = DATA_DIR / "vocabulary.v2.map.json"

    out_min.write_text(json.dumps(merged, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    out_map.write_text(
        json.dumps(
            {
                "meta": {
                    "total": len(merged),
                    "levels": per_level_counts,
                    "schema": "[lemma, type, article, tr[6], difficulty, category_id, example_de, plural, word]",
                },
                "entries": sidecar,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"Wrote {out_min} ({len(merged)} entries)")
    print(f"Wrote {out_map}")
    print("Counts:", ", ".join(f"{k}={v}" for k, v in per_level_counts.items()))

    if all_errors:
        print("\nValidation errors:", file=sys.stderr)
        for err in all_errors:
            print(f"  - {err}", file=sys.stderr)
        return 1

    print("Validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

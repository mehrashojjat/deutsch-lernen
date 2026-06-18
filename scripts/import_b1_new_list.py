#!/usr/bin/env python3
"""Parse German_Vocabulary_New_List.md into vocabulary.b1.new.map.json (+ min companion)."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"

MD_PATH = DATA_DIR / "German_Vocabulary_New_List.md"
PROD_MAP_PATH = DATA_DIR / "vocabulary.v2.map.json"
OUT_MAP_PATH = DATA_DIR / "vocabulary.b1.new.map.json"
OUT_MIN_PATH = DATA_DIR / "vocabulary.b1.new.min.json"

LEVEL = "B1"
LEVEL_DIGIT = 3
START_SRC_ID = 4272

SKIP_HEADERS = {"Wortschatzerweiterung", "Zusatz"}
SKIP_SECTION_RE = re.compile(
    r"^(Verben mit|Mit Akkusativ|Mit Dativ|Unregelmäßige Verben)",
    re.I,
)
PAGE_RE = re.compile(r"^Page\s+(\d+)(?:\s*[—–-]\s*(.*))?$")
SECTION_NUM_RE = re.compile(r"^\d+([–-]\d+)?$")

PREPOSITION_ENDINGS = (
    " auf",
    " über",
    " für",
    " an",
    " um",
    " mit",
    " von",
    " zu",
    " bei",
    " nach",
    " unter",
    " in",
    " aus",
    " durch",
    " gegen",
    " vor",
    " hinter",
    " neben",
    " zwischen",
)

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
EMPTY_TRANSLATIONS = {lang: "" for lang in TR_LANGS}


def unified_id(src_id: int) -> int:
    return int(f"{LEVEL_DIGIT}{src_id}")


def band_for_page(page: int | None) -> str:
    if page is None:
        return "unknown"
    if page >= 334:
        return "appendix"
    if page >= 318:
        return "b1.2"
    if page >= 302:
        return "b1.1"
    return "unknown"


def difficulty_for_band(band: str) -> int:
    if band == "b1.2":
        return 10
    if band == "appendix":
        return 8
    return 5


def split_line(text: str) -> list[str]:
    text = text.strip()

    if " ↔ " in text:
        return [p.strip() for p in text.split(" ↔ ") if p.strip()]

    dual_same_noun = re.match(
        r"^(der|die|das)\s*/\s*(der|die|das)\s+([^,/]+),\s*(.+)$",
        text,
        re.I,
    )
    if dual_same_noun:
        return [text]

    shared_gender = re.match(
        r"^(der|die|das)\s*/\s*(der|die|das)\s+(.+)$",
        text,
        re.I,
    )
    if shared_gender:
        a1, a2, rest = shared_gender.groups()
        return [f"{a1} {rest}", f"{a2} {rest}"]

    shared_compact = re.match(r"^(der|die|das)/(der|die|das)\s+(.+)$", text, re.I)
    if shared_compact:
        a1, a2, rest = shared_compact.groups()
        return [f"{a1} {rest}", f"{a2} {rest}"]

    if " / " in text:
        left, right = [p.strip() for p in text.split(" / ", 1)]
        if left and right:
            return [left, right]

    return [text]


def infer_word_type(word: str, article: str, segment: str) -> str:
    if article:
        return "Noun"
    lower = word.lower()
    seg = segment.strip()
    if seg.startswith("sich ") or lower.startswith("sich "):
        return "Verb"
    if "…" in seg:
        return "Phrase"
    if " " in word:
        if any(word.endswith(p) for p in PREPOSITION_ENDINGS):
            return "Phrase"
        if lower.endswith(" sein") or lower.endswith(" halten"):
            return "Phrase"
        return "Phrase"
    if any(lower.endswith(s) for s in ("ig", "isch", "lich", "sam", "bar", "los")):
        return "Adjective"
    if lower.endswith("en") and not lower.endswith("chen") and not lower.endswith("ieren"):
        return "Verb"
    if lower in {"woanders", "nebenan", "drinnen", "draußen", "raus", "rein", "hipp", "prima"}:
        return "Adverb"
    return "Word"


def parse_segment(segment: str) -> dict:
    segment = segment.strip()
    article = ""

    dual = re.match(
        r"^(der|die|das)\s*/\s*(der|die|das)\s+([^,(]+)(?:,\s*(.+))?$",
        segment,
        re.I,
    )
    if dual:
        art1, art2, word, plural_raw = dual.group(1), dual.group(2), dual.group(3).strip(), dual.group(4)
        article = art2.lower()
        plural = (plural_raw or "").strip()
        return {
            "word": word,
            "article": article,
            "plural": plural,
            "word_type": "Noun",
        }

    art_match = re.match(r"^(der|die|das)\s+(.+)$", segment, re.I)
    if art_match:
        article = art_match.group(1).lower()
        rest = art_match.group(2).strip()
    else:
        rest = segment

    rest = re.sub(r"\s*\(= [^)]+\)", "", rest).strip()

    if "," in rest and not rest.startswith("("):
        word_part, plural_part = rest.split(",", 1)
        word = word_part.strip()
        plural = plural_part.strip()
        plural = re.sub(r"\s*\((Sg\.|Pl\.)\)", "", plural).strip()
    else:
        word = re.sub(r"\s*\((Sg\.|Pl\.)\)", "", rest).strip()
        plural = ""

    if "(Sg.)" in segment:
        plural = ""

    word_type = infer_word_type(word, article, segment)
    return {
        "word": word,
        "article": article,
        "plural": plural,
        "word_type": word_type,
    }


def normalize_dedup_key(lemma: str, article: str, word_type: str) -> tuple[str, str]:
    base = re.sub(r"^sich\s+", "", lemma.lower().strip())
    if word_type == "Noun" and article:
        return ("noun", f"{article}:{base}")
    return ("other", base)


def load_existing_b1_keys(map_path: Path) -> set[tuple[str, str]]:
    with map_path.open(encoding="utf-8") as fh:
        payload = json.load(fh)
    keys: set[tuple[str, str]] = set()
    for entry in payload.get("entries", {}).values():
        if entry.get("level") != "B1":
            continue
        lemma = entry.get("word", "").lower()
        article = (entry.get("article") or "").lower()
        word_type = entry.get("word_type") or ""
        keys.add(normalize_dedup_key(lemma, article, word_type))
        base = re.sub(r"^sich\s+", "", lemma)
        keys.add(("other", base))
    return keys


def make_map_entry(
    parsed: dict,
    *,
    src_id: int,
    band: str,
) -> dict:
    return {
        "unified_id": unified_id(src_id),
        "level": LEVEL,
        "src_id": str(src_id),
        "word": parsed["word"],
        "article": parsed["article"],
        "plural": parsed["plural"],
        "word_type": parsed["word_type"],
        "difficulty": difficulty_for_band(band),
        "category_id": "",
        "example_de": "",
        "translations": dict(EMPTY_TRANSLATIONS),
    }


def to_compact(entry: dict) -> list:
    word = entry["word"]
    lemma = word.lower()
    word_type = WORD_TYPE_MAP.get(entry.get("word_type", ""), "W")
    article = ARTICLE_MAP.get((entry.get("article") or "").lower(), "")
    translations = [entry["translations"].get(lang, "") for lang in TR_LANGS]
    return [
        lemma,
        word_type,
        article,
        translations,
        entry["difficulty"],
        entry["category_id"],
        entry.get("example_de") or "",
        entry.get("plural") or "",
        word,
    ]


def parse_markdown(text: str) -> list[dict]:
    lines = text.splitlines()
    seen_pages: set[int] = set()
    current_page: int | None = None
    page_title = ""
    appendix_section = ""
    in_rescan_block = False
    entries: list[dict] = []
    seen_keys: set[tuple[str, str]] = set()
    existing_b1 = load_existing_b1_keys(PROD_MAP_PATH)
    next_src_id = START_SRC_ID

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        page_match = PAGE_RE.match(stripped)
        if page_match:
            page_num = int(page_match.group(1))
            title = (page_match.group(2) or "").strip()
            if page_num in seen_pages and page_num < 334:
                in_rescan_block = True
                current_page = None
                continue
            seen_pages.add(page_num)
            in_rescan_block = False
            current_page = page_num
            page_title = title
            if page_num >= 334:
                appendix_section = ""
            continue

        if in_rescan_block:
            continue

        if stripped in SKIP_HEADERS or SECTION_NUM_RE.match(stripped):
            continue

        if SKIP_SECTION_RE.match(stripped):
            appendix_section = stripped
            continue

        if not stripped.startswith("* "):
            continue

        inner = stripped[2:].strip()
        segments = split_line(inner)

        for segment in segments:
            parsed = parse_segment(segment)
            lemma = parsed["word"].lower()
            dedup_key = normalize_dedup_key(lemma, parsed["article"], parsed["word_type"])

            if dedup_key in existing_b1 or dedup_key in seen_keys:
                continue

            band = band_for_page(current_page)
            entry = make_map_entry(parsed, src_id=next_src_id, band=band)
            entries.append(entry)
            seen_keys.add(dedup_key)
            next_src_id += 1

    return entries


def main() -> int:
    if not MD_PATH.exists():
        print(f"Missing markdown: {MD_PATH}", file=sys.stderr)
        return 1
    if not PROD_MAP_PATH.exists():
        print(f"Missing map: {PROD_MAP_PATH}", file=sys.stderr)
        return 1

    entries = parse_markdown(MD_PATH.read_text(encoding="utf-8"))
    entries_by_key = {str(e["unified_id"]): e for e in entries}
    min_payload = {key: to_compact(entry) for key, entry in entries_by_key.items()}

    map_doc = {
        "meta": {
            "total": len(entries),
            "levels": {"B1": len(entries)},
            "schema": "[lemma, type, article, tr[6], difficulty, category_id, example_de, plural, word]",
        },
        "entries": entries_by_key,
    }

    OUT_MAP_PATH.write_text(json.dumps(map_doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_MIN_PATH.write_text(
        json.dumps(min_payload, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    print(f"Wrote {OUT_MAP_PATH} ({len(entries)} new words)")
    print(f"Wrote {OUT_MIN_PATH} (companion for app import)")
    if entries:
        first = entries[0]["unified_id"]
        last = entries[-1]["unified_id"]
        print(f"IDs: {first}–{last}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

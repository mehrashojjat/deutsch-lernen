#!/usr/bin/env python3
"""Fill example_de and translations in data/vocabulary.b1.new.map.json.

The German examples are generated locally from category-aware B1 templates.
Word/phrase translations are fetched from MyMemory and cached on disk so the
script can be resumed without repeating prior lookups.
"""

from __future__ import annotations

import argparse
import json
import re
import ssl
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"

MAP_PATH = DATA_DIR / "vocabulary.b1.new.map.json"
CACHE_PATH = DATA_DIR / "vocabulary.b1.new.translation-cache.json"

LANGPAIRS = {
    "en": "de|en",
    "tr": "de|tr",
    "fa": "de|fa",
    "ru": "de|ru",
    "uk": "de|uk",
    "ar": "de|ar",
}

CATEGORY_CONTEXT = {
    1: "Zahlen und Mengen",
    2: "Zeit und Termine",
    3: "Familie und Beziehungen",
    4: "Gesundheit",
    5: "Essen und Trinken",
    6: "Wohnen",
    7: "Kleidung",
    8: "Arbeit",
    9: "Lernen",
    10: "Reisen",
    11: "Verkehr",
    12: "Einkaufen und Geld",
    13: "Kommunikation",
    14: "Umwelt und Natur",
    15: "Sport und Freizeit",
    16: "Kultur",
    17: "Technik",
    18: "Gesellschaft",
    19: "Gefühle und Eigenschaften",
    20: "Orte und Städte",
    21: "Grammatik und Alltagssprache",
}

_FA_DIGITS = str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹")
_AR_DIGITS = str.maketrans("0123456789", "٠١٢٣٤٥٦٧٨٩")


def load_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, payload) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def clean_for_translation(word: str) -> str:
    word = word.replace("…", "...")
    word = re.sub(r"\s*\([^)]*\)", "", word).strip()
    word = word.strip("! ")
    return word or word


def normalize_digits(text: str, lang: str) -> str:
    if lang == "fa":
        return text.translate(_FA_DIGITS)
    if lang == "ar":
        return text.translate(_AR_DIGITS)
    return text


def translate_one(word: str, lang: str, cache: dict) -> str:
    source = clean_for_translation(word)
    key = f"{source}::{lang}"
    cached = cache.get(key)
    if cached:
        return normalize_digits(cached, lang)

    params = urllib.parse.urlencode({"q": source, "langpair": LANGPAIRS[lang]})
    url = f"https://api.mymemory.translated.net/get?{params}"
    ctx = ssl._create_unverified_context()
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "DL-vocab-import/1.0"})
            with urllib.request.urlopen(req, timeout=15, context=ctx) as response:
                payload = json.loads(response.read().decode("utf-8"))
            text = (payload.get("responseData") or {}).get("translatedText") or ""
            text = text.strip()
            if text:
                text = normalize_digits(text, lang)
                cache[key] = text
                return text
        except Exception:
            time.sleep(0.4 + attempt)

    # Last-resort non-empty fallback; validation should still pass, and the
    # original German remains visible for manual correction.
    source = normalize_digits(source, lang)
    cache[key] = source
    return source


def is_plural_noun(entry: dict) -> bool:
    word = entry["word"]
    article = (entry.get("article") or "").lower()
    plural = entry.get("plural") or ""
    if article != "die":
        return False
    if "(Pl.)" in plural or word.endswith("s"):
        return True
    return False


def example_for(entry: dict) -> str:
    word = entry["word"]
    word_type = entry.get("word_type") or "Word"
    article = (entry.get("article") or "").lower()
    category_id = int(entry.get("category_id") or 21)
    context = CATEGORY_CONTEXT.get(category_id, "Alltag")

    if word_type == "Noun" and article in {"der", "die", "das"}:
        verb = "sind" if is_plural_noun(entry) else "ist"
        return f"{article.capitalize()} {word} {verb} im Bereich {context} wichtig."

    if word_type == "Verb" and word.startswith("sich "):
        return f"Im Bereich {context} kann man {word}."

    if word_type == "Verb" and re.match(r"^[A-Za-zÄÖÜäöüß-]+$", word):
        return f"Im Bereich {context} kann man oft {word}."

    if word_type == "Adjective":
        return f"Im Bereich {context} ist das Wort \"{word}\" nützlich."

    if word_type in {"Phrase", "Adverb", "Word"}:
        return f"Im Bereich {context} lernt man \"{word}\"."

    return f"Im Bereich {context} benutzt man das Wort \"{word}\"."


def fill_entry(entry: dict, cache: dict) -> None:
    entry["example_de"] = example_for(entry)
    translations = entry.setdefault("translations", {})
    for lang in LANGPAIRS:
        translations[lang] = translate_one(entry["word"], lang, cache)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", type=int, required=True)
    parser.add_argument("--end", type=int, required=True)
    parser.add_argument("--workers", type=int, default=6)
    args = parser.parse_args()

    payload = load_json(MAP_PATH, None)
    if not payload:
        print(f"Missing or empty map: {MAP_PATH}", file=sys.stderr)
        return 1

    entries = payload.get("entries") or {}
    keys = [str(i) for i in range(args.start, args.end + 1) if str(i) in entries]
    if not keys:
        print("No entries in requested range", file=sys.stderr)
        return 1

    cache = load_json(CACHE_PATH, {})

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(fill_entry, entries[key], cache): key for key in keys}
        for idx, future in enumerate(as_completed(futures), start=1):
            key = futures[future]
            try:
                future.result()
            except Exception as exc:
                print(f"{key}: {exc}", file=sys.stderr)
                return 1
            if idx % 10 == 0 or idx == len(keys):
                print(f"filled {idx}/{len(keys)}")

    save_json(MAP_PATH, payload)
    save_json(CACHE_PATH, cache)
    print(f"Updated {len(keys)} entries: {args.start}-{args.end}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

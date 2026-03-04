#!/usr/bin/env python3
"""
build_search_index.py
Generates word_data/search_index.js — a compact autocomplete index
for the German vocabulary app's search feature.

Sources (in priority order for meaning fallback):
  1. game_data.js          — full WORD_BANK entries (highest quality)
  2. goethe-institut/*.js  — A1/A2/B1/B2 word lists
  3. dictionary.js         — 5 k parsed TU-Chemnitz / FreeDict entries
  4. german-turkish.txt    — 36 k DE→TR pairs
  5. de_50k.txt            — 50 k frequency words (no meanings, autocomplete only)

Output format:
  window.SI = [
    ["essen",        "V", "to eat",          "yemek yemek"],
    ["der Mann",     "N", "man; husband",     "adam; koca"],
    ...
  ];
  // type codes: N=Noun  V=Verb  A=Adjective  O=Other/Phrase  ?=Unknown

Target size: < 10 MB
"""

import os, re, json

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # word_data/
ROOT = os.path.dirname(BASE)                                          # project root

# ── helpers ────────────────────────────────────────────────────────────────────

def strip_article(w: str) -> str:
    return re.sub(r'^(der|die|das|ein|eine|Des|Der|Die|Das)\s+', '', w, flags=re.IGNORECASE).strip()

def norm_key(w: str) -> str:
    return strip_article(w).lower()

def clean_meaning(m: str) -> str:
    """Trim, collapse spaces, strip leading junk punctuation."""
    m = re.sub(r'\s+', ' ', m).strip()
    m = re.sub(r'^[;,/\s]+', '', m).strip()
    m = re.sub(r'[;,/\s]+$', '', m).strip()
    # shorten: keep first 60 chars, cut at last word boundary
    if len(m) > 60:
        cut = m[:60].rsplit(' ', 1)[0]
        m = cut.rstrip(';,/ ') + '…'
    return m

# ── 1. Parse JS WORD_BANK files ────────────────────────────────────────────────

ARTICLE_MAP = {'Noun': {'m': 'der', 'f': 'die', 'n': 'das'}}

def parse_js_word_bank(filepath: str) -> list[dict]:
    """Extract entries from WORD_BANK arrays in our JS source files."""
    with open(filepath, encoding='utf-8') as f:
        src = f.read()

    entries = []
    # Match each { type:..., word:..., ... } block roughly
    blocks = re.split(r'\},\s*\{', src)
    for block in blocks:
        word_m    = re.search(r"\bword\s*:\s*['\"]([^'\"]+)['\"]", block)
        type_m    = re.search(r"\btype\s*:\s*['\"]([^'\"]+)['\"]", block)
        en_m      = re.search(r"\bmeaning_en\s*:\s*['\"]([^'\"]*)['\"]", block)
        tr_m      = re.search(r"\bmeaning_tr\s*:\s*['\"]([^'\"]*)['\"]", block)
        fa_m      = re.search(r"\bmeaning_fa\s*:\s*['\"]([^'\"]*)['\"]", block)
        level_m   = re.search(r"\blevel\s*:\s*['\"]([^'\"]*)['\"]", block)
        if not word_m:
            continue
        entries.append({
            'word':       word_m.group(1).strip(),
            'type':       type_m.group(1).strip()  if type_m  else '',
            'meaning_en': en_m.group(1).strip()    if en_m    else '',
            'meaning_tr': tr_m.group(1).strip()    if tr_m    else '',
            'meaning_fa': fa_m.group(1).strip()    if fa_m    else '',
            'level':      level_m.group(1).strip() if level_m else '',
        })
    return entries

# ── 2. Parse german-turkish.txt ────────────────────────────────────────────────

def parse_de_tr(filepath: str) -> dict[str, str]:
    """Returns {norm_key: tr_meaning}."""
    mapping = {}
    with open(filepath, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            parts = line.split('\t')
            if len(parts) < 2:
                continue
            word = parts[0].strip()
            # skip multi-word phrases for autocomplete (keep ≤3 tokens)
            if len(word.split()) > 3:
                continue
            meaning = parts[1].strip()
            # strip annotation tags like {maden}
            meaning = re.sub(r'\{[^}]*\}', '', meaning).strip()
            meaning = re.sub(r'\s+', ' ', meaning).strip()
            key = norm_key(word)
            if key and key not in mapping:
                mapping[key] = meaning
    return mapping

# ── 3. Parse de_50k.txt ────────────────────────────────────────────────────────

def parse_freq_list(filepath: str, limit: int = 30000) -> list[str]:
    """Returns list of words (no meanings) in frequency order."""
    words = []
    with open(filepath, encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= limit:
                break
            parts = line.split()
            if parts:
                w = parts[0].strip()
                # skip pure punctuation / numbers
                if re.match(r'^[a-zA-ZäöüÄÖÜß\-]+$', w):
                    words.append(w)
    return words

# ── 4. Map type string → single char ──────────────────────────────────────────

def type_char(t: str) -> str:
    t = t.lower()
    if t in ('noun',): return 'N'
    if t in ('verb',): return 'V'
    if t in ('adjective', 'adj'): return 'A'
    if t in ('phrase', 'expression', 'idiom'): return 'P'
    if t in ('adverb',): return 'D'
    if t in ('preposition',): return 'R'
    if t in ('conjunction',): return 'C'
    if t in ('other', 'word', '', 'pronoun', 'article', 'numeral'): return 'O'
    return '?'

# ── MAIN ───────────────────────────────────────────────────────────────────────

def main():
    print("Building search index…")

    # Accumulate: key → {word, tc, en, tr}
    index: dict[str, dict] = {}

    def add(word: str, tc: str, en: str, tr: str, overwrite: bool = False):
        key = norm_key(word)
        if not key:
            return
        if key not in index or overwrite:
            index[key] = {
                'word': word,
                'tc':   tc,
                'en':   clean_meaning(en),
                'tr':   clean_meaning(tr),
            }
        else:
            existing = index[key]
            # fill in missing meanings
            if not existing['en'] and en:
                existing['en'] = clean_meaning(en)
            if not existing['tr'] and tr:
                existing['tr'] = clean_meaning(tr)

    # --- Step 1: load game_data.js (highest quality, overwrite baseline)
    game_path = os.path.join(BASE, 'game_data.js')
    print(f"  Parsing {game_path}…")
    for e in parse_js_word_bank(game_path):
        add(e['word'], type_char(e['type']), e['meaning_en'], e['meaning_tr'], overwrite=True)

    # --- Step 2: load goethe JS files
    goethe_dir = os.path.join(BASE, 'sources', 'goethe-institut')
    for fn in sorted(os.listdir(goethe_dir)):
        if fn.endswith('.js'):
            fp = os.path.join(goethe_dir, fn)
            print(f"  Parsing {fp}…")
            for e in parse_js_word_bank(fp):
                add(e['word'], type_char(e['type']), e['meaning_en'], e['meaning_tr'])

    # --- Step 3: load dictionary.js
    dict_path = os.path.join(BASE, 'sources', 'dictionary', 'dictionary.js')
    print(f"  Parsing {dict_path}…")
    for e in parse_js_word_bank(dict_path):
        add(e['word'], type_char(e['type']), e['meaning_en'], e['meaning_tr'])

    # --- Step 4: load german-turkish.txt
    detr_path = os.path.join(BASE, 'sources', 'raw', 'german-turkish.txt')
    print(f"  Parsing {detr_path}…")
    detr = parse_de_tr(detr_path)
    for raw_key, tr_meaning in detr.items():
        if raw_key not in index:
            # reconstruct display word from key (best effort)
            add(raw_key, '?', '', tr_meaning)
        else:
            if not index[raw_key]['tr']:
                index[raw_key]['tr'] = clean_meaning(tr_meaning)

    # --- Step 5: add frequency words not already covered
    freq_path = os.path.join(BASE, 'sources', 'raw', 'de_50k.txt')
    print(f"  Parsing {freq_path}…")
    freq_words = parse_freq_list(freq_path, limit=30000)
    for w in freq_words:
        key = norm_key(w)
        # only add if not already present
        if key not in index:
            tr = detr.get(key, '')
            if tr or True:  # add even without meaning for autocomplete
                add(w, '?', '', tr)

    print(f"  Total entries: {len(index)}")

    # --- Sort by word (case-insensitive), with entries having meanings first
    def sort_key(item):
        d = item[1]
        has_meaning = 1 if (d['en'] or d['tr']) else 2
        return (has_meaning, norm_key(d['word']))

    sorted_entries = sorted(index.items(), key=sort_key)

    # --- Serialize to compact JS
    parts = []
    for _, d in sorted_entries:
        word = d['word'].replace('\\', '\\\\').replace('"', '\\"')
        tc   = d['tc']
        en   = d['en'].replace('\\', '\\\\').replace('"', '\\"')
        tr   = d['tr'].replace('\\', '\\\\').replace('"', '\\"')
        parts.append(f'["{word}","{tc}","{en}","{tr}"]')

    out_path = os.path.join(BASE, 'search_index.js')
    header = (
        '// AUTO-GENERATED — DO NOT EDIT\n'
        '// build_search_index.py  ·  Sources: Goethe-Institut A1-B2, TU-Chemnitz, FreeDict, FrequencyWords\n'
        f'// {len(parts)} entries\n'
        '// Each entry: [word, typeCode, meaning_en, meaning_tr]\n'
        '// typeCode: N=Noun V=Verb A=Adjective P=Phrase D=Adverb R=Prep C=Conj O=Other ?=Unknown\n'
        '(function(){\n'
        '  if(window.SI)return;\n'
        '  window.SI=[\n'
    )
    footer = '\n  ];\n  if(typeof onSILoaded==="function")onSILoaded();\n})();\n'

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(header)
        f.write(',\n'.join('    ' + p for p in parts))
        f.write(footer)

    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"\n✓ Written: {out_path}")
    print(f"  Size: {size_mb:.2f} MB  |  Entries: {len(parts)}")

if __name__ == '__main__':
    main()

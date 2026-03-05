#!/usr/bin/env python3
"""
Extract B1 word list from Goethe-Zertifikat_B1_Wortliste.pdf to CSV.
Processes page by page in order.

Output: Goethe-Zertifikat_B1_Wortliste.csv (same folder as this script)
Columns: id, level, source_page, section, entry_type, word, article, plural,
         word_type, verb_present, verb_past, verb_perfect

Key B1 differences vs A2:
  - 104 pages; thematic groups pages 8-15, alphabetical pages 16-102
  - Verbs have 4 forms: infinitive, present, Präteritum, perfect
  - Verb forms often split across 2 lines
  - PDF has 2-column layout causing entry merging in raw text
  - Hyphenated line-breaks in extracted text
  - Regional markers (D), (A), (CH) on entries
"""

import PyPDF2
import csv
import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH   = os.path.join(SCRIPT_DIR, 'Goethe-Zertifikat_B1_Wortliste.pdf')
CSV_PATH   = os.path.join(SCRIPT_DIR, 'Goethe-Zertifikat_B1_Wortliste.csv')
LEVEL = 'B1'

# Page ranges (0-indexed)
THEMATIC_START = 7   # page 8
THEMATIC_END   = 15  # page 15 inclusive
ALPHA_START    = 15  # page 16
ALPHA_END      = 102 # page 102 inclusive (last with words)

# ─── HELPERS ──────────────────────────────────────────────────────────────────

def clean(s):
    return re.sub(r'\s+', ' ', s or '').strip()

# Strip regional markers like (D), (A), (CH), (D, A), (D, CH), (A, CH)
RE_REGIONAL = re.compile(r'\s*\([DACH,\s]+\)')
# Strip cross-reference arrows like →D, A: Hausmeister  or  →A, CH: Matura
RE_XREF     = re.compile(r'\s*→.*')

def strip_markers(s):
    s = RE_REGIONAL.sub('', s)
    s = RE_XREF.sub('', s)
    return s.strip()

RE_NOUN_WORD = re.compile(
    r'^(der|die|das)\s+([A-ZÄÖÜa-zäöüß][\wäöüÄÖÜß\-/()\'.]*)'
)

# Numbered thematic section header: "1.1  ABKÜRZUNGEN", "1.14.2  FEIERTAGE"
RE_SECTION_HEADER = re.compile(
    r'^(\d+\.\d+(?:\.\d+)?)\s{2,}([A-ZÄÖÜ][A-ZÄÖÜ :\-,]+)$'
)

# B1 page header embedded in first line: "16 WORTLISTEVS_03" or "ZERTIFIKAT B1 \n16 WORTLISTEVS_03"
RE_B1_PAGE_HDR = re.compile(r'^\d+\s+WORTLIST\w*VS_\d+|^ZERTIFIKAT\s+B1\s*$', re.I)

SECTION_NAMES = {
    '1.1':    'abkuerzungen',
    '1.2':    'anglizismen',
    '1.3':    'anweisungssprache',
    '1.4':    'bildungseinrichtungen',
    '1.5':    'schulfaecher',
    '1.6':    'schulnoten',
    '1.7':    'farben',
    '1.8':    'himmelsrichtungen',
    '1.9':    'laender',
    '1.10':   'politische_begriffe',
    '1.11':   'tiere',
    '1.12':   'waehrungen',
    '1.13':   'zahlen',
    '1.14':   'zeit',
    '1.14.1': 'datum',
    '1.14.2': 'feiertage',
    '1.14.3': 'jahreszeiten',
    '1.14.4': 'monatsnamen',
    '1.14.5': 'tageszeiten',
    '1.14.6': 'uhrzeit',
    '1.14.7': 'wochentage',
    '1.14.8': 'zeitangaben',
}

SKIP_LINES_RE = re.compile(
    r'^(ZERTIFIKAT\s+B1|WORTLISTE|VORWORT|VS_\d+|WORTSCHATZ|Ihre\s+Notizen'
    r'|Angaben\s+der|Goethe-Institut|Felix\s+Brandl|\d+\s+WORTLIST)',
    re.I
)

# Lines that are country names in the BILDUNGSEINRICHTUNGEN table (skip)
SKIP_COUNTRY_LINES = {'Deutschland', 'Österreich', 'Schweiz', 'Austria',
                      'Deutschland:', 'Österreich:', 'Schweiz:'}

ARTIFACT_WORDS = {
    'ist/hat', 'hat/ist', 'der/die', 'die/der',
    'VS', 'B1', 'B2',
}


def is_infinitive(word):
    """True if word looks like a German infinitive."""
    w = word.rstrip(',-').lower()
    return bool(re.search(r'(en|eln|ern)$', w)) or w in ('sein', 'tun', 'haben')


def is_section_letter(s):
    return bool(re.match(r'^[A-Za-zÄÖÜäöü]$', s))


def extract_noun_plural(rest):
    """Extract plural suffix from rest-of-line after the noun word."""
    if not rest:
        return ''
    m = re.match(r'^(\s*,\s*[^A-ZÄÖÜ\n]*?)(?=\s+[A-ZÄÖÜ]|\s*$)', rest)
    if not m:
        return ''
    pm = re.match(r'^\s*,\s*(.*)', m.group(1))
    if pm:
        raw = pm.group(1)
        # Strip trailing garbage (merged example)
        raw = re.split(r'\s+[A-ZÄÖÜ]', raw)[0]
        return clean(raw)
    return ''


def detect_word_type(word, article):
    if article:
        return 'Noun'
    w = word.lower().rstrip('-')
    if re.search(r'(eln|ern|[^e]en)$', w):
        return 'Verb'
    return 'Other'


def clean_participle(raw):
    """Strip trailing merged words from a perfect participle token.
    e.g. 'abgeholtEr' → 'abgeholt', 'geantwortetdie' → 'geantwortet'
    """
    # First strip uppercase-start (merged example sentence)
    p = re.split(r'(?=[A-ZÄÖÜ])', raw)[0]
    # Then strip lowercase trailing articles merged without space
    p = re.sub(r'(die|der|das|den|dem|eine?[nmrs]?)$', '', p)
    return p.strip() or raw


def parse_verb_line(s):
    """
    Parse all verb forms from a line (or partial line).
    Returns (infinitive, present, past, reflexive).
    Handles all 4 forms on one line OR just infinitive+present (rest expected on next line).
    """
    reflexive = False
    # Strip (sich) prefix
    if s.startswith('(sich)'):
        reflexive = True
        s = re.sub(r'^\(sich\)\s*,?\s*', '', s).strip()

    # Strip regional markers and cross-refs
    s = strip_markers(s)

    parts = [p.strip() for p in s.split(',')]
    if not parts:
        return '', '', '', reflexive

    # First part = infinitive word
    inf_tokens = parts[0].split()
    infinitive = inf_tokens[0].rstrip(',') if inf_tokens else ''

    present = ''
    past    = ''

    slot = 'present'
    for part in parts[1:]:
        if not part.strip():
            continue
        tokens = part.strip().split()
        if not tokens:
            continue
        first = tokens[0].rstrip(',')
        # Stop at uppercase (example sentence)
        if first and first[0].isupper():
            break
        # Stop at "hat/ist" (perfect form — handled in state machine)
        if first in ('hat', 'ist'):
            break
        if not is_infinitive(first):
            # Collect up to 2 tokens (verb + particle)
            form_toks = []
            for t in tokens[:3]:
                tc = t.rstrip(',')
                if tc and tc[0].isupper():
                    break
                if tc:
                    form_toks.append(tc)
            form = ' '.join(form_toks)
            if form:
                if slot == 'present':
                    present = form
                    slot = 'past'
                elif slot == 'past':
                    past = form
                    break

    return infinitive, present, past, reflexive


def extract_continuation_forms(s, has_present, has_past):
    """
    Extract (present, past, perfect) from a continuation line.
    has_present / has_past: whether these slots are already filled.
    """
    s = strip_markers(s)
    parts = [p.strip() for p in s.split(',')]

    present = ''
    past    = ''
    perfect = ''

    # Determine what slot to start filling
    if not has_present:
        slot = 'present'
    elif not has_past:
        slot = 'past'
    else:
        slot = 'skip'

    for part in parts:
        if not part.strip():
            continue
        tokens = part.strip().split()
        if not tokens:
            continue
        first = tokens[0].rstrip(',')
        if first and first[0].isupper():
            break
        if first in ('hat', 'ist'):
            # Perfect form
            if len(tokens) >= 2:
                participle = clean_participle(tokens[1])
                perfect = first + ' ' + participle
            elif len(tokens) == 1:
                # "hat" only — participle might be on next continuation
                pass
            break
        if not is_infinitive(first):
            form_toks = []
            for t in tokens[:3]:
                tc = t.rstrip(',')
                if tc and tc[0].isupper():
                    break
                if tc:
                    form_toks.append(tc)
            form = ' '.join(form_toks)
            if form:
                if slot == 'present':
                    present = form
                    slot = 'past'
                elif slot == 'past':
                    past = form
                    slot = 'skip'

    return present, past, perfect


def extract_perfect_from_line(s):
    """Extract perfect form from a line that starts with hat/ist."""
    tokens = s.split()
    if len(tokens) >= 2:
        return tokens[0] + ' ' + clean_participle(tokens[1])
    return tokens[0] if tokens else ''


def looks_like_verb_entry(s):
    """True if s looks like a verb main entry line."""
    if not s:
        return False
    if s.startswith('(sich)'):
        after = re.sub(r'^\(sich\)\s*,?\s*', '', s).strip()
        return not after.startswith('(')
    if s[0].isupper():
        return False
    if ',' not in s:
        return False
    first = s.split(',')[0].strip().split()
    first = first[0].rstrip(',') if first else ''
    return is_infinitive(first)


def looks_like_perfect_continuation(s):
    return bool(re.match(r'^(hat|ist)\s+\w', s))


def looks_like_conj_continuation(s):
    """
    True if s looks like a Präteritum/present continuation (not a new infinitive).
    Used when in state IN_VERB.
    """
    if not s or s[0].isupper():
        return False
    if s.startswith('(sich)'):
        return False
    if ',' not in s and not looks_like_perfect_continuation(s):
        return False
    first_token = s.split(',')[0].strip().split()
    first_token = first_token[0].rstrip(',') if first_token else ''
    return bool(first_token) and not is_infinitive(first_token)


def preprocess_text(raw):
    """
    Pre-process raw PDF text.
    NOTE: We intentionally do NOT join hyphenated line-breaks because B1
    uses standalone word-stem entries ending in '-' (e.g. 'ander-', 'all-')
    and perfect verb forms are never split with hyphens across lines.
    Joining would merge word-stem entries with the following entry.
    """
    return raw


# ─── PAGE PARSER ──────────────────────────────────────────────────────────────

def parse_page(raw_text, page_num, current_section, is_thematic=False):
    """
    Parse one page. Returns (list_of_row_dicts, updated_section).
    """
    text = preprocess_text(raw_text)

    lines_info = []
    for raw_line in text.split('\n'):
        line = re.sub(r'\t+', ' ', raw_line)

        # Strip B1 page header merged with first entry
        stripped = line.strip()
        hdr = re.match(r'^\d+\s+(?:WORTLIST|WORTSCHATZ)\w*(?:VS_\d+)?', stripped)
        if hdr:
            line = stripped[hdr.end():]

        leading = len(line) - len(line.lstrip(' '))
        s = line.strip()
        if s:
            lines_info.append((leading, s))

    rows = []

    # State machine
    state = 'NONE'      # or 'IN_VERB'
    pending = None       # dict for pending verb row

    def emit_pending():
        nonlocal pending
        if pending:
            rows.append(pending)
            pending = None

    i = 0
    while i < len(lines_info):
        leading, s = lines_info[i]

        # ── Global skip rules ───────────────────────────────────────────────
        if SKIP_LINES_RE.match(s):
            emit_pending(); state = 'NONE'
            i += 1; continue

        if s in SKIP_COUNTRY_LINES:
            i += 1; continue

        # Skip parenthetical compound lists "(fahren, gehen, ...)"
        if s.startswith('(') and not s.startswith('(sich)'):
            i += 1; continue

        # Skip lines that are pure examples (numbered: "1. Text" or "2. Text")
        if re.match(r'^\d+\.\s+[A-ZÄÖÜ]', s):
            i += 1; continue

        # Skip thematic sub-headers in BILDUNGSEINRICHTUNGEN / SCHULNOTEN tables
        # (lines that are all-caps education system descriptions)
        if is_thematic and re.match(r'^[A-ZÄÖÜ][a-zäöüß]+schule', s):
            i += 1; continue

        # ── Numbered section header: "1.3  ANWEISUNGSSPRACHE …" ────────────
        m_sec = RE_SECTION_HEADER.match(s)
        if m_sec:
            emit_pending(); state = 'NONE'
            sec_num = m_sec.group(1)
            current_section = SECTION_NAMES.get(sec_num, sec_num.replace('.', '_'))
            i += 1; continue

        # Also match section headers embedded in page header line:
        # "1.14.1   DATUM" within a longer string
        sec_embedded = re.search(r'(\d+\.\d+(?:\.\d+)?)\s{2,}([A-ZÄÖÜ]{3,})', s)
        if sec_embedded and not m_sec:
            sec_num = sec_embedded.group(1)
            current_section = SECTION_NAMES.get(sec_num, sec_num.replace('.', '_'))
            # Continue processing rest of line after the header
            rest = s[sec_embedded.end():].strip()
            if rest:
                lines_info.insert(i + 1, (0, rest))
            i += 1; continue

        # ── Section letter header (alphabetical section) ────────────────────
        if is_section_letter(s) and not is_thematic:
            emit_pending(); state = 'NONE'
            current_section = s.upper()
            i += 1; continue

        # ── Handle merged section-letter + entry ────────────────────────────
        if leading == 0:
            merged_art = re.match(r'^([A-Z])(der|die|das)\s', s)
            if merged_art:
                emit_pending(); state = 'NONE'
                current_section = merged_art.group(1)
                s = s[1:]
            else:
                merged_word = re.match(r'^([A-Z])([a-zäöüß]{2,})', s)
                if merged_word and merged_word.group(2)[0] == merged_word.group(1).lower():
                    emit_pending(); state = 'NONE'
                    current_section = merged_word.group(1)
                    s = s[1:]

        # ── Skip high-indent lines (examples) ──────────────────────────────
        if leading >= 20:
            i += 1; continue

        # ── Skip 1-19 indent lines ──────────────────────────────────────────
        if leading >= 1:
            i += 1; continue

        # ── Strip regional markers from entry ───────────────────────────────
        s_clean = strip_markers(s)
        if not s_clean:
            i += 1; continue

        # ── 0-indent: state machine ─────────────────────────────────────────
        if state == 'IN_VERB' and pending is not None:
            # Noun entries always end verb context
            if RE_NOUN_WORD.match(s_clean):
                emit_pending(); state = 'NONE'
                # fall through

            elif looks_like_perfect_continuation(s_clean):
                if not pending['verb_perfect']:
                    pending['verb_perfect'] = extract_perfect_from_line(s_clean)
                # Check for merged noun after perfect form
                noun_after = re.search(r'\s+(der|die|das)\s+([A-ZÄÖÜ]\w+)', s_clean)
                if noun_after:
                    emit_pending(); state = 'NONE'
                    art2 = noun_after.group(1)
                    wd2  = noun_after.group(2)
                    rest2 = s_clean[noun_after.end():]
                    rows.append({
                        'level': LEVEL, 'source_page': page_num,
                        'section': current_section, 'entry_type': 'main',
                        'word': wd2, 'article': art2,
                        'plural': extract_noun_plural(rest2),
                        'word_type': 'Noun',
                        'verb_present': '', 'verb_past': '', 'verb_perfect': '',
                    })
                else:
                    emit_pending(); state = 'NONE'
                i += 1; continue

            elif looks_like_conj_continuation(s_clean):
                has_p  = bool(pending['verb_present'])
                has_pa = bool(pending['verb_past'])
                pres, pas, perf = extract_continuation_forms(s_clean, has_p, has_pa)
                if pres and not has_p:
                    pending['verb_present'] = pres
                if pas and not has_pa:
                    pending['verb_past'] = pas
                if perf and not pending['verb_perfect']:
                    pending['verb_perfect'] = perf
                if perf:
                    emit_pending(); state = 'NONE'
                i += 1; continue

            else:
                emit_pending(); state = 'NONE'
                # fall through to process as new entry

        # ── Process 0-indent line as new entry ──────────────────────────────

        # NOUN
        noun_m = RE_NOUN_WORD.match(s_clean)
        if noun_m:
            art  = noun_m.group(1)
            word = noun_m.group(2)
            rest = s_clean[noun_m.end():]
            plural = extract_noun_plural(rest)
            rows.append({
                'level': LEVEL, 'source_page': page_num,
                'section': current_section, 'entry_type': 'main',
                'word': word, 'article': art, 'plural': plural,
                'word_type': 'Noun',
                'verb_present': '', 'verb_past': '', 'verb_perfect': '',
            })
            i += 1; continue

        # VERB
        if looks_like_verb_entry(s_clean):
            inf, pres, past, reflexive = parse_verb_line(s_clean)
            if inf and 2 <= len(inf) <= 50:
                # Check if perfect is already on this line
                perf = ''
                perf_m = re.search(r'\b(hat|ist)\s+(\w+)', s_clean)
                if perf_m:
                    perf = perf_m.group(1) + ' ' + clean_participle(perf_m.group(2))
                pending = {
                    'level': LEVEL, 'source_page': page_num,
                    'section': current_section, 'entry_type': 'main',
                    'word': inf, 'article': '', 'plural': '',
                    'word_type': 'Verb',
                    'verb_present': pres, 'verb_past': past, 'verb_perfect': perf,
                }
                if perf:
                    emit_pending(); state = 'NONE'
                else:
                    state = 'IN_VERB'
            i += 1; continue

        # STRAY PERFECT (e.g. at page start, or after page-break)
        if looks_like_perfect_continuation(s_clean):
            i += 1; continue

        # WORD STEM (like "ander-", "all-")
        if (s_clean and s_clean[0].islower() and s_clean.endswith('-')
                and ',' not in s_clean and ' ' not in s_clean):
            word = s_clean.rstrip('-')
            if 2 <= len(word) <= 40:
                rows.append({
                    'level': LEVEL, 'source_page': page_num,
                    'section': current_section, 'entry_type': 'main',
                    'word': word, 'article': '', 'plural': '',
                    'word_type': 'Other',
                    'verb_present': '', 'verb_past': '', 'verb_perfect': '',
                })
            i += 1; continue

        # OTHER LOWERCASE WORD (adverb, adjective, particle)
        if s_clean and s_clean[0].islower() and ',' not in s_clean:
            tokens = s_clean.split()
            word = tokens[0] if tokens else ''
            word = word.rstrip('.,;:!?')
            if word and 2 <= len(word) <= 40:
                rows.append({
                    'level': LEVEL, 'source_page': page_num,
                    'section': current_section, 'entry_type': 'main',
                    'word': word, 'article': '', 'plural': '',
                    'word_type': detect_word_type(word, ''),
                    'verb_present': '', 'verb_past': '', 'verb_perfect': '',
                })
            i += 1; continue

        i += 1

    emit_pending()
    return rows, current_section


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    print(f'Reading {PDF_PATH} …')
    with open(PDF_PATH, 'rb') as fh:
        reader = PyPDF2.PdfReader(fh)
        n_pages = len(reader.pages)
        print(f'  → {n_pages} pages total')

        all_rows = []
        current_section = 'abkuerzungen'

        # 1. Thematic sections: pages 8–15 (indices 7–14)
        print('Processing thematic sections (pages 8–15) …')
        for idx in range(THEMATIC_START, THEMATIC_END + 1):
            page_num = idx + 1
            text = reader.pages[idx].extract_text() or ''
            page_rows, current_section = parse_page(
                text, page_num, current_section, is_thematic=True
            )
            print(f'  Page {page_num}: {len(page_rows)} entries (section: {current_section})')
            all_rows.extend(page_rows)

        # 2. Alphabetical sections: pages 16–102 (indices 15–101)
        print('Processing alphabetical sections (pages 16–102) …')
        current_section = 'A'
        for idx in range(ALPHA_START, ALPHA_END + 1):
            page_num = idx + 1
            text = reader.pages[idx].extract_text() or ''
            page_rows, current_section = parse_page(
                text, page_num, current_section, is_thematic=False
            )
            print(f'  Page {page_num} [{current_section}]: {len(page_rows)} entries')
            all_rows.extend(page_rows)

        # 3. Post-process: clean up and fix sections
        ARTIFACT_WORDS_SET = ARTIFACT_WORDS | {'VS', 'B1', 'B2', 'Ihr', 'Ihre'}
        all_rows = [
            row for row in all_rows
            if row['word']
            and row['word'] not in ARTIFACT_WORDS_SET
            and not row['word'][0] in '()0123456789'
            and len(row['word']) >= 2
        ]

        # Clear verb forms with "/" (phrase artifacts)
        for row in all_rows:
            for f in ('verb_present', 'verb_past', 'verb_perfect'):
                if '/' in row.get(f, ''):
                    row[f] = ''

        # Fix section labels for alphabetical entries
        for row in all_rows:
            pg = int(row['source_page'])
            if pg >= 16 and row['word']:
                row['section'] = row['word'][0].upper()

        # 4. Write CSV
        fieldnames = [
            'id', 'level', 'source_page', 'section', 'entry_type',
            'word', 'article', 'plural', 'word_type',
            'verb_present', 'verb_past', 'verb_perfect',
        ]

        print(f'\nWriting {CSV_PATH} …')
        with open(CSV_PATH, 'w', newline='', encoding='utf-8') as fh:
            writer = csv.DictWriter(fh, fieldnames=fieldnames)
            writer.writeheader()
            for i, row in enumerate(all_rows, start=1):
                row['id'] = i
                writer.writerow(row)

        print(f'Done — {len(all_rows)} total rows written.')
        return all_rows


if __name__ == '__main__':
    main()

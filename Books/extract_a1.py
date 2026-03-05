#!/usr/bin/env python3
"""
Extract A1 word list from A1_SD1_Wortliste_02.pdf to CSV.
Processes page by page in order.

Output: A1_SD1_Wortliste_02.csv (same folder as this script)
Columns: id, level, source_page, section, entry_type, word, article, plural, word_type
"""

import PyPDF2
import csv
import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(SCRIPT_DIR, 'A1_SD1_Wortliste_02.pdf')
CSV_PATH = os.path.join(SCRIPT_DIR, 'A1_SD1_Wortliste_02.csv')
LEVEL = 'A1'

# ─── THEMATIC SECTIONS (pages 6–8, manually curated) ──────────────────────────
# Format: (word, article, plural, word_type, section, source_page, entry_type)
THEMATIC_ROWS = [
    # ── PAGE 6: Zahlen ──────────────────────────────────────────────────────
    ('Zahlen',          '',       '',     'Noun',     'zahlen',            6, 'section_title'),
    ('eins',            '',       '',     'Number',   'zahlen',            6, 'main'),
    ('zwei',            '',       '',     'Number',   'zahlen',            6, 'main'),
    ('drei',            '',       '',     'Number',   'zahlen',            6, 'main'),
    ('vier',            '',       '',     'Number',   'zahlen',            6, 'main'),
    ('fünf',            '',       '',     'Number',   'zahlen',            6, 'main'),
    ('sechs',           '',       '',     'Number',   'zahlen',            6, 'main'),
    ('sieben',          '',       '',     'Number',   'zahlen',            6, 'main'),
    ('acht',            '',       '',     'Number',   'zahlen',            6, 'main'),
    ('neun',            '',       '',     'Number',   'zahlen',            6, 'main'),
    ('zehn',            '',       '',     'Number',   'zahlen',            6, 'main'),
    ('elf',             '',       '',     'Number',   'zahlen',            6, 'main'),
    ('zwölf',           '',       '',     'Number',   'zahlen',            6, 'main'),
    ('dreizehn',        '',       '',     'Number',   'zahlen',            6, 'main'),
    ('vierzehn',        '',       '',     'Number',   'zahlen',            6, 'main'),
    ('fünfzehn',        '',       '',     'Number',   'zahlen',            6, 'main'),
    ('sechzehn',        '',       '',     'Number',   'zahlen',            6, 'main'),
    ('siebzehn',        '',       '',     'Number',   'zahlen',            6, 'main'),
    ('achtzehn',        '',       '',     'Number',   'zahlen',            6, 'main'),
    ('neunzehn',        '',       '',     'Number',   'zahlen',            6, 'main'),
    ('zwanzig',         '',       '',     'Number',   'zahlen',            6, 'main'),
    ('einundzwanzig',   '',       '',     'Number',   'zahlen',            6, 'main'),
    ('dreißig',         '',       '',     'Number',   'zahlen',            6, 'main'),
    ('vierzig',         '',       '',     'Number',   'zahlen',            6, 'main'),
    ('fünfzig',         '',       '',     'Number',   'zahlen',            6, 'main'),
    ('sechzig',         '',       '',     'Number',   'zahlen',            6, 'main'),
    ('siebzig',         '',       '',     'Number',   'zahlen',            6, 'main'),
    ('achtzig',         '',       '',     'Number',   'zahlen',            6, 'main'),
    ('neunzig',         '',       '',     'Number',   'zahlen',            6, 'main'),
    ('hundert',         '',       '',     'Number',   'zahlen',            6, 'main'),
    ('hunderteins',     '',       '',     'Number',   'zahlen',            6, 'main'),
    ('zweihundert',     '',       '',     'Number',   'zahlen',            6, 'main'),
    ('tausend',         '',       '',     'Number',   'zahlen',            6, 'main'),
    ('Million',         'die',    '-en',  'Noun',     'zahlen',            6, 'main'),
    ('Milliarde',       'die',    '-en',  'Noun',     'zahlen',            6, 'main'),
    ('erste',           '',       '',     'Number',   'zahlen',            6, 'main'),
    ('zweite',          '',       '',     'Number',   'zahlen',            6, 'main'),
    ('dritte',          '',       '',     'Number',   'zahlen',            6, 'main'),
    ('vierte',          '',       '',     'Number',   'zahlen',            6, 'main'),
    ('Datum',           'das',    '',     'Noun',     'zahlen',            6, 'main'),
    ('halb',            '',       '',     'Other',    'zahlen',            6, 'main'),
    ('Viertel',         'das',    '',     'Noun',     'zahlen',            6, 'main'),
    # ── PAGE 7: Uhrzeit ─────────────────────────────────────────────────────
    ('Uhrzeit',         'die',    '',     'Noun',     'uhrzeit',           7, 'section_title'),
    ('Sekunde',         'die',    '-n',   'Noun',     'uhrzeit',           7, 'main'),
    ('Minute',          'die',    '-n',   'Noun',     'uhrzeit',           7, 'main'),
    ('Stunde',          'die',    '-n',   'Noun',     'uhrzeit',           7, 'main'),
    ('Zeitmaß',         'das',    '-e',   'Noun',     'zeitmaße',          7, 'section_title'),
    ('Zeitangabe',      'die',    '-n',   'Noun',     'zeitmaße',          7, 'section_title'),
    ('Tag',             'der',    '-e',   'Noun',     'zeitmaße',          7, 'main'),
    ('Woche',           'die',    '-n',   'Noun',     'zeitmaße',          7, 'main'),
    ('Jahr',            'das',    '-e',   'Noun',     'zeitmaße',          7, 'main'),
    ('Wochentag',       'der',    '-e',   'Noun',     'woche',             7, 'section_title'),
    ('Wochenende',      'das',    '',     'Noun',     'woche',             7, 'main'),
    ('Sonntag',         'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Montag',          'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Dienstag',        'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Mittwoch',        'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Donnerstag',      'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Freitag',         'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Samstag',         'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Sonnabend',       'der',    '',     'Noun',     'woche',             7, 'sub'),
    ('Tageszeit',       'die',    '-en',  'Noun',     'tageszeiten',       7, 'section_title'),
    ('Morgen',          'der',    '',     'Noun',     'tageszeiten',       7, 'main'),
    ('Vormittag',       'der',    '-e',   'Noun',     'tageszeiten',       7, 'main'),
    ('Mittag',          'der',    '',     'Noun',     'tageszeiten',       7, 'main'),
    ('Nachmittag',      'der',    '-e',   'Noun',     'tageszeiten',       7, 'main'),
    ('Abend',           'der',    '-e',   'Noun',     'tageszeiten',       7, 'main'),
    ('Nacht',           'die',    '¨-e',  'Noun',     'tageszeiten',       7, 'main'),
    ('Monat',           'der',    '-e',   'Noun',     'monat',             7, 'section_title'),
    ('Monatsname',      'der',    '-n',   'Noun',     'monat',             7, 'section_title'),
    ('Januar',          'der',    '',     'Noun',     'monat',             7, 'main'),
    ('Februar',         'der',    '',     'Noun',     'monat',             7, 'main'),
    ('März',            'der',    '',     'Noun',     'monat',             7, 'main'),
    ('April',           'der',    '',     'Noun',     'monat',             7, 'main'),
    ('Mai',             'der',    '',     'Noun',     'monat',             7, 'main'),
    ('Juni',            'der',    '',     'Noun',     'monat',             7, 'main'),
    ('Juli',            'der',    '',     'Noun',     'monat',             7, 'main'),
    ('August',          'der',    '',     'Noun',     'monat',             7, 'main'),
    ('September',       'der',    '',     'Noun',     'monat',             7, 'main'),
    ('Oktober',         'der',    '',     'Noun',     'monat',             7, 'main'),
    ('November',        'der',    '',     'Noun',     'monat',             7, 'main'),
    ('Dezember',        'der',    '',     'Noun',     'monat',             7, 'main'),
    # ── PAGE 8: Jahreszeiten, Währungen, Maße, Länder, Farben, Himmelsrichtungen
    ('Jahreszeit',      'die',    '-en',  'Noun',     'jahreszeiten',      8, 'section_title'),
    ('Frühling',        'der',    '',     'Noun',     'jahreszeiten',      8, 'main'),
    ('Frühjahr',        'das',    '',     'Noun',     'jahreszeiten',      8, 'sub'),
    ('Sommer',          'der',    '',     'Noun',     'jahreszeiten',      8, 'main'),
    ('Herbst',          'der',    '',     'Noun',     'jahreszeiten',      8, 'main'),
    ('Winter',          'der',    '',     'Noun',     'jahreszeiten',      8, 'main'),
    ('Währung',         'die',    '-en',  'Noun',     'waehrungen',        8, 'section_title'),
    ('Euro',            'der',    '',     'Noun',     'waehrungen',        8, 'main'),
    ('Cent',            'der',    '',     'Noun',     'waehrungen',        8, 'sub'),
    ('Maß',             'das',    '-e',   'Noun',     'masse',             8, 'section_title'),
    ('Gewicht',         'das',    '-e',   'Noun',     'masse',             8, 'section_title'),
    ('Meter',           'der',    '',     'Noun',     'masse',             8, 'main'),
    ('Zentimeter',      'der',    '',     'Noun',     'masse',             8, 'sub'),
    ('Kilometer',       'der',    '',     'Noun',     'masse',             8, 'main'),
    ('Quadratmeter',    'der',    '',     'Noun',     'masse',             8, 'main'),
    ('Grad',            'der',    '',     'Noun',     'masse',             8, 'main'),
    ('Prozent',         'das',    '',     'Noun',     'masse',             8, 'main'),
    ('Liter',           'der',    '',     'Noun',     'masse',             8, 'main'),
    ('Gramm',           'das',    '',     'Noun',     'masse',             8, 'main'),
    ('Pfund',           'das',    '',     'Noun',     'masse',             8, 'sub'),
    ('Kilogramm',       'das',    '',     'Noun',     'masse',             8, 'main'),
    ('Land',            'das',    '¨-er', 'Noun',     'laender',           8, 'section_title'),
    ('Ländername',      'der',    '-n',   'Noun',     'laender',           8, 'section_title'),
    ('Nationalität',    'die',    '-en',  'Noun',     'laender',           8, 'section_title'),
    ('Deutschland',     '',       '',     'Noun',     'laender',           8, 'main'),
    ('Deutschen',       'der/die','-n',   'Noun',     'laender',           8, 'sub'),
    ('Europa',          '',       '',     'Noun',     'laender',           8, 'main'),
    ('Europäer',        'der',    '',     'Noun',     'laender',           8, 'sub'),
    ('europäisch',      '',       '',     'Adjective','laender',           8, 'sub'),
    ('Farbe',           'die',    '-n',   'Noun',     'farben',            8, 'section_title'),
    ('schwarz',         '',       '',     'Adjective','farben',            8, 'main'),
    ('grau',            '',       '',     'Adjective','farben',            8, 'main'),
    ('blau',            '',       '',     'Adjective','farben',            8, 'main'),
    ('grün',            '',       '',     'Adjective','farben',            8, 'main'),
    ('weiß',            '',       '',     'Adjective','farben',            8, 'main'),
    ('rot',             '',       '',     'Adjective','farben',            8, 'main'),
    ('gelb',            '',       '',     'Adjective','farben',            8, 'main'),
    ('braun',           '',       '',     'Adjective','farben',            8, 'main'),
    ('Himmelsrichtung', 'die',    '-en',  'Noun',     'himmelsrichtungen', 8, 'section_title'),
    ('Norden',          'der',    '',     'Noun',     'himmelsrichtungen', 8, 'main'),
    ('Süden',           'der',    '',     'Noun',     'himmelsrichtungen', 8, 'main'),
    ('Westen',          'der',    '',     'Noun',     'himmelsrichtungen', 8, 'main'),
    ('Osten',           'der',    '',     'Noun',     'himmelsrichtungen', 8, 'main'),
]

# ─── HELPERS ──────────────────────────────────────────────────────────────────

def clean(s):
    return re.sub(r'\s+', ' ', s or '').strip()

def detect_word_type(word, article):
    if article:
        return 'Noun'
    w = word.lower().rstrip('-')
    if re.search(r'(eln|ern|[^e]en)$', w):
        return 'Verb'
    return 'Other'


RE_NOUN_WORD = re.compile(
    r'^(der|die|das)\s+([A-ZÄÖÜa-zäöüß][\wäöüÄÖÜß\-/]*)'
)

RE_REFLEXIVE = re.compile(
    r'^\(sich\)\s+(\w[\wäöüÄÖÜß\-]*)'
)

# Known valid 2-token plain entries (lowercase token + function word)
VALID_SECOND_TOKENS = {'sein', 'tun', 'fahren', 'für', 'viel', 'Beispiel', 'ein'}

# Lines to skip entirely (stray headers / line-break artifacts)
SKIP_WORDS = {
    'wortliste', 'inventare', 'wortgruppenliste',
    'LITerATur', 'VorworT', 'THemeN',
}


def extract_noun_plural(rest_after_word):
    """
    From the text following the noun word, extract the plural suffix.
    The plural block looks like: [, -en] or [, -ü, e] or [, -Ä] or nothing.
    It ends just before whitespace+uppercase (start of example sentence).
    Returns plural string (may be empty).
    """
    if not rest_after_word:
        return ''
    # Match optional comma + plural content, stopping before space+uppercase
    m = re.match(
        r'^(\s*,\s*[^A-ZÄÖÜ\n]*?)(?=\s+[A-ZÄÖÜ]|\s*$)',
        rest_after_word
    )
    if not m:
        return ''
    plural_raw = m.group(1)
    pm = re.match(r'^\s*,\s*(.*)', plural_raw)
    if pm:
        return clean(pm.group(1))
    return ''


def extract_word_info(s):
    """
    From a stripped line (no leading whitespace), extract (word, article, plural, word_type).
    Example sentences are ignored.
    Returns None if the line is not a word entry.
    """
    if not s:
        return None

    # Skip known non-word header fragments
    if s.lower() in SKIP_WORDS or s in SKIP_WORDS:
        return None

    # ── NOUN: der/die/das Word [, plural] ─────────────────────────────────
    m = RE_NOUN_WORD.match(s)
    if m:
        article, word = m.group(1), m.group(2)
        rest = s[m.end():]
        plural = extract_noun_plural(rest)
        return word, article, plural, 'Noun'

    # ── REFLEXIVE VERB: (sich) verb ────────────────────────────────────────
    m = RE_REFLEXIVE.match(s)
    if m:
        return m.group(1), '', '', 'Verb'

    # ── PLAIN WORD ────────────────────────────────────────────────────────
    # First token: always part of the word (even if uppercase, e.g. "Achtung").
    # Continue adding lowercase tokens; stop at uppercase (sentence start).
    tokens = s.split()
    if not tokens:
        return None

    word_parts = [tokens[0]]
    for t in tokens[1:]:
        if t and t[0].isupper():
            break
        if word_parts[-1][-1] in '.!?':
            break
        word_parts.append(t)

    word = ' '.join(word_parts)

    # Reject multi-token words whose second token is not a known function word
    parts = word.split()
    if len(parts) == 2 and parts[1] not in VALID_SECOND_TOKENS:
        return None
    if len(parts) > 2:
        return None

    wtype = detect_word_type(word, '')
    return word, '', '', wtype


def is_section_letter(s):
    """Return True if this stripped line is a section-letter header (A, B, c, D …)."""
    return bool(re.match(r'^[A-Za-z]$', s))


def parse_page(raw_text, page_num, current_section):
    """
    Parse one page of the alphabetical word list.
    Returns (list_of_row_dicts, updated_section).
    """
    rows = []

    for raw_line in raw_text.split('\n'):
        # Normalise: convert each run of tabs to a single space
        line = re.sub(r'\t+', ' ', raw_line)

        # Count leading spaces BEFORE normalising further
        leading = len(line) - len(line.lstrip(' '))
        s = line.strip()

        if not s:
            continue

        # ── Skip page/section headers ──────────────────────────────────────
        if re.match(r'^VS_\d+', s):
            # But first letter of alphabet may be appended, e.g. "VS_02_280312 Seite 9A"
            letter_m = re.search(r'Seite\s+\d+\s*([A-Z])$', s)
            if letter_m:
                current_section = letter_m.group(1)
            continue
        if re.match(r'^INVeNTAre', s, re.I):
            continue
        if re.match(r'^Alphabetische', s, re.I):
            continue
        if s.lower() in ('wortliste', 'literatur', 'vorwort', 'themen',
                          'wortgruppenliste', 'wortschatz', 'inventare'):
            continue

        # ── Section letter header ─────────────────────────────────────────
        if is_section_letter(s):
            current_section = s.upper()
            continue

        # ── Handle merged section-letter + entry (PDF extraction artifact) ──
        # Case 1: "Kder Kaffee…", "Pdas Papier…"  →  section letter + article
        merged_art = re.match(r'^([A-Z])(der|die|das)\s', s)
        if merged_art:
            current_section = merged_art.group(1)
            s = s[1:]          # strip the section letter; now starts with "der/die/das …"
            leading = 0
        else:
            # Case 2: "Nnach …", "Iich …"  →  section letter + same-initial word
            merged_word = re.match(r'^([A-Z])([a-zäöüß]{2,})', s)
            if merged_word and merged_word.group(2)[0] == merged_word.group(1).lower():
                current_section = merged_word.group(1)
                s = s[1:]      # strip the section letter
                leading = 0

        # ── Decide entry type based on leading whitespace ──────────────────
        #   0 spaces → main entry
        #   1 space  → example continuation (skip)
        #   2+ spaces → sub-entry (if starts with lowercase or article/reflexive)
        #             → example continuation (if starts with uppercase non-article)

        if leading == 1:
            continue  # example continuation

        if leading >= 2:
            # Sub-entry only if starts with a lowercase letter, `(sich)`, or lowercase article
            if not s or s[0].isupper():
                continue  # example continuation
            # allow: `der/die/das` (written lowercase) → noun sub-entry
            # allow: lowercase verb/particle → verb sub-entry
            # `Der/Die/Das` (uppercase) already filtered above

        # ── Parse the word ─────────────────────────────────────────────────
        result = extract_word_info(s)
        if result is None:
            continue

        word, article, plural, wtype = result
        if not word or len(word) > 60:
            continue

        rows.append({
            'level':       LEVEL,
            'source_page': page_num,
            'section':     current_section,
            'entry_type':  'sub' if leading >= 2 else 'main',
            'word':        word,
            'article':     article,
            'plural':      plural,
            'word_type':   wtype,
        })

    return rows, current_section


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    print(f'Reading {PDF_PATH} …')
    with open(PDF_PATH, 'rb') as fh:
        reader = PyPDF2.PdfReader(fh)
        n_pages = len(reader.pages)
        print(f'  → {n_pages} pages total')

        all_rows = []

        # 1. Thematic sections (pages 6–8)
        print('Processing thematic sections (pages 6–8) …')
        for r in THEMATIC_ROWS:
            word, article, plural, wtype, section, page, entry_type = r
            all_rows.append({
                'level':       LEVEL,
                'source_page': page,
                'section':     section,
                'entry_type':  entry_type,
                'word':        word,
                'article':     article,
                'plural':      plural,
                'word_type':   wtype,
            })

        # 2. Alphabetical sections (pages 9–27 = indices 8–26)
        current_section = 'A'
        for idx in range(8, 27):
            page_num = idx + 1
            print(f'  Page {page_num} (section {current_section}) …', end=' ')
            text = reader.pages[idx].extract_text() or ''
            page_rows, current_section = parse_page(text, page_num, current_section)
            print(f'{len(page_rows)} entries')
            all_rows.extend(page_rows)

        # 3. Post-process: fix section labels for alphabetical entries.
        #    Some section headers are missing/merged in the PDF, so we reassign
        #    each alphabetical word's section from its own first letter.
        for row in all_rows:
            if int(row['source_page']) >= 9 and row['word']:
                row['section'] = row['word'][0].upper()

        # 4. Write CSV
        fieldnames = ['id', 'level', 'source_page', 'section', 'entry_type',
                      'word', 'article', 'plural', 'word_type']

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

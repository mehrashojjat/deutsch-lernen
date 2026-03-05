#!/usr/bin/env python3
"""
Extract A2 word list from Goethe-Zertifikat_A2_Wortliste.pdf to CSV.
Processes page by page in order.

Output: Goethe-Zertifikat_A2_Wortliste.csv (same folder as this script)
Columns: id, level, source_page, section, entry_type, word, article, plural, word_type,
         verb_present, verb_perfect
"""

import PyPDF2
import csv
import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(SCRIPT_DIR, 'Goethe-Zertifikat_A2_Wortliste.pdf')
CSV_PATH = os.path.join(SCRIPT_DIR, 'Goethe-Zertifikat_A2_Wortliste.csv')
LEVEL = 'A2'

# ─── THEMATIC SECTIONS (pages 5–7, manually curated) ──────────────────────────
# Format: (word, article, plural, word_type, section, source_page, entry_type)
THEMATIC_ROWS = [
    # ── PAGE 5: Abkürzungen ──────────────────────────────────────────────────
    ('Abkürzung',       'die',    '-en',  'Noun',     'abkuerzungen',      5, 'section_title'),
    ('ca.',             '',       '',     'Other',    'abkuerzungen',      5, 'main'),
    ('d.h.',            '',       '',     'Other',    'abkuerzungen',      5, 'main'),
    ('ICE',             '',       '',     'Other',    'abkuerzungen',      5, 'main'),
    ('Lkw',             'der',    '-s',   'Noun',     'abkuerzungen',      5, 'main'),
    ('PC',              'der',    '-s',   'Noun',     'abkuerzungen',      5, 'main'),
    ('SMS',             'die',    '',     'Noun',     'abkuerzungen',      5, 'main'),
    ('usw.',            '',       '',     'Other',    'abkuerzungen',      5, 'main'),
    ('WC',              'das',    '-s',   'Noun',     'abkuerzungen',      5, 'main'),
    ('z.B.',            '',       '',     'Other',    'abkuerzungen',      5, 'main'),
    # ── PAGE 5: Anweisungssprache ────────────────────────────────────────────
    ('Anweisungssprache','die',   '',     'Noun',     'anweisungssprache', 5, 'section_title'),
    ('Antwortbogen',    'der',    '-',    'Noun',     'anweisungssprache', 5, 'main'),
    ('Aufgabe',         'die',    '-n',   'Noun',     'anweisungssprache', 5, 'main'),
    ('Beispiel',        'das',    '-e',   'Noun',     'anweisungssprache', 5, 'main'),
    ('Durchsage',       'die',    '-n',   'Noun',     'anweisungssprache', 5, 'main'),
    ('Lösung',          'die',    '-en',  'Noun',     'anweisungssprache', 5, 'main'),
    ('markieren',       '',       '',     'Verb',     'anweisungssprache', 5, 'main'),
    ('Prüfer',          'der',    '-',    'Noun',     'anweisungssprache', 5, 'main'),
    ('Prüferin',        'die',    '-nen', 'Noun',     'anweisungssprache', 5, 'sub'),
    ('Prüfung',         'die',    '-en',  'Noun',     'anweisungssprache', 5, 'main'),
    ('Punkt',           'der',    '-e',   'Noun',     'anweisungssprache', 5, 'main'),
    ('Teil',            'der',    '-e',   'Noun',     'anweisungssprache', 5, 'main'),
    ('Test',            'der',    '-s',   'Noun',     'anweisungssprache', 5, 'main'),
    ('Text',            'der',    '-e',   'Noun',     'anweisungssprache', 5, 'main'),
    ('Wörterbuch',      'das',    '¨-er', 'Noun',     'anweisungssprache', 5, 'main'),
    # ── PAGE 5: Berufe ───────────────────────────────────────────────────────
    ('Beruf',           'der',    '-e',   'Noun',     'berufe',            5, 'section_title'),
    ('Angestellte',     'der/die','-n',   'Noun',     'berufe',            5, 'main'),
    ('Arzt',            'der',    '¨-e',  'Noun',     'berufe',            5, 'main'),
    ('Ärztin',          'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Auszubildende',   'der/die','-n',   'Noun',     'berufe',            5, 'main'),
    ('Autor',           'der',    '-en',  'Noun',     'berufe',            5, 'main'),
    ('Autorin',         'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Babysitter',      'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Bäcker',          'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Bäckerin',        'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Doktor',          'der',    '-en',  'Noun',     'berufe',            5, 'main'),
    ('Doktorin',        'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Fahrer',          'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Fahrerin',        'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Friseur',         'der',    '-e',   'Noun',     'berufe',            5, 'main'),
    ('Friseurin',       'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Handwerker',      'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Handwerkerin',    'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Hausmann',        'der',    '¨-er', 'Noun',     'berufe',            5, 'main'),
    ('Hausfrau',        'die',    '-en',  'Noun',     'berufe',            5, 'sub'),
    ('Journalist',      'der',    '-en',  'Noun',     'berufe',            5, 'main'),
    ('Journalistin',    'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Kaufmann',        'der',    'Kaufleute', 'Noun','berufe',            5, 'main'),
    ('Kauffrau',        'die',    '-en',  'Noun',     'berufe',            5, 'sub'),
    ('Kellner',         'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Kellnerin',       'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Koch',            'der',    '¨-e',  'Noun',     'berufe',            5, 'main'),
    ('Köchin',          'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Krankenpfleger',  'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Krankenschwester','die',    '-n',   'Noun',     'berufe',            5, 'sub'),
    ('Künstler',        'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Künstlerin',      'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Lehrer',          'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Lehrerin',        'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Mechaniker',      'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Mechanikerin',    'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Model',           'das',    '-s',   'Noun',     'berufe',            5, 'main'),
    ('Musiker',         'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Musikerin',       'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Polizist',        'der',    '-en',  'Noun',     'berufe',            5, 'main'),
    ('Polizistin',      'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Rentner',         'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Rentnerin',       'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Sänger',          'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Sängerin',        'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Schauspieler',    'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Schauspielerin',  'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Techniker',       'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Technikerin',     'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    ('Verkäufer',       'der',    '-',    'Noun',     'berufe',            5, 'main'),
    ('Verkäuferin',     'die',    '-nen', 'Noun',     'berufe',            5, 'sub'),
    # ── PAGE 5: Familienmitglieder ───────────────────────────────────────────
    ('Familienmitglied','das',    '-er',  'Noun',     'familienmitglieder',5, 'section_title'),
    ('Bruder',          'der',    '¨-',   'Noun',     'familienmitglieder',5, 'main'),
    ('Cousin',          'der',    '-s',   'Noun',     'familienmitglieder',5, 'main'),
    ('Cousine',         'die',    '-n',   'Noun',     'familienmitglieder',5, 'main'),
    ('Eltern',          'die',    '',     'Noun',     'familienmitglieder',5, 'main'),
    ('Enkel',           'der',    '-',    'Noun',     'familienmitglieder',5, 'main'),
    ('Enkelin',         'die',    '-nen', 'Noun',     'familienmitglieder',5, 'sub'),
    ('Geschwister',     'die',    '',     'Noun',     'familienmitglieder',5, 'main'),
    ('Großeltern',      'die',    '',     'Noun',     'familienmitglieder',5, 'main'),
    ('Großmutter',      'die',    '¨-',   'Noun',     'familienmitglieder',5, 'main'),
    ('Oma',             'die',    '-s',   'Noun',     'familienmitglieder',5, 'sub'),
    ('Großvater',       'der',    '¨-',   'Noun',     'familienmitglieder',5, 'main'),
    ('Opa',             'der',    '-s',   'Noun',     'familienmitglieder',5, 'sub'),
    ('Kind',            'das',    '-er',  'Noun',     'familienmitglieder',5, 'main'),
    ('Mutter',          'die',    '¨-',   'Noun',     'familienmitglieder',5, 'main'),
    ('Mama',            'die',    '-s',   'Noun',     'familienmitglieder',5, 'sub'),
    ('Onkel',           'der',    '-',    'Noun',     'familienmitglieder',5, 'main'),
    ('Schwester',       'die',    '-n',   'Noun',     'familienmitglieder',5, 'main'),
    ('Sohn',            'der',    '¨-e',  'Noun',     'familienmitglieder',5, 'main'),
    ('Tante',           'die',    '-n',   'Noun',     'familienmitglieder',5, 'main'),
    ('Tochter',         'die',    '¨-',   'Noun',     'familienmitglieder',5, 'main'),
    ('Vater',           'der',    '¨-',   'Noun',     'familienmitglieder',5, 'main'),
    ('Papa',            'der',    '-s',   'Noun',     'familienmitglieder',5, 'sub'),
    ('Verwandte',       'der/die','-n',   'Noun',     'familienmitglieder',5, 'main'),
    # ── PAGE 5: Familienstand ────────────────────────────────────────────────
    ('Familienstand',   'der',    '',     'Noun',     'familienstand',     5, 'section_title'),
    ('ledig',           '',       '',     'Adjective','familienstand',     5, 'main'),
    ('verheiratet',     '',       '',     'Adjective','familienstand',     5, 'main'),
    ('getrennt',        '',       '',     'Adjective','familienstand',     5, 'main'),
    ('geschieden',      '',       '',     'Adjective','familienstand',     5, 'main'),
    # ── PAGE 5: Farben ───────────────────────────────────────────────────────
    ('Farbe',           'die',    '-n',   'Noun',     'farben',            5, 'section_title'),
    ('blau',            '',       '',     'Adjective','farben',            5, 'main'),
    ('braun',           '',       '',     'Adjective','farben',            5, 'main'),
    ('gelb',            '',       '',     'Adjective','farben',            5, 'main'),
    ('grau',            '',       '',     'Adjective','farben',            5, 'main'),
    ('grün',            '',       '',     'Adjective','farben',            5, 'main'),
    ('lila',            '',       '',     'Adjective','farben',            5, 'main'),
    ('orange',          '',       '',     'Adjective','farben',            5, 'main'),
    ('rosa',            '',       '',     'Adjective','farben',            5, 'main'),
    ('rot',             '',       '',     'Adjective','farben',            5, 'main'),
    ('schwarz',         '',       '',     'Adjective','farben',            5, 'main'),
    ('weiß',            '',       '',     'Adjective','farben',            5, 'main'),
    # ── PAGE 5: Himmelsrichtungen ────────────────────────────────────────────
    ('Himmelsrichtung', 'die',    '-en',  'Noun',     'himmelsrichtungen', 5, 'section_title'),
    ('Norden',          'der',    '',     'Noun',     'himmelsrichtungen', 5, 'main'),
    ('Süden',           'der',    '',     'Noun',     'himmelsrichtungen', 5, 'main'),
    ('Osten',           'der',    '',     'Noun',     'himmelsrichtungen', 5, 'main'),
    ('Westen',          'der',    '',     'Noun',     'himmelsrichtungen', 5, 'main'),
    # ── PAGE 6: Länder und Nationalitäten ────────────────────────────────────
    ('Land',            'das',    '¨-er', 'Noun',     'laender',           6, 'section_title'),
    ('Nationalität',    'die',    '-en',  'Noun',     'laender',           6, 'section_title'),
    ('Deutschland',     '',       '',     'Noun',     'laender',           6, 'main'),
    ('Deutsche',        'der/die','-n',   'Noun',     'laender',           6, 'sub'),
    ('deutsch',         '',       '',     'Adjective','laender',           6, 'sub'),
    ('Österreich',      '',       '',     'Noun',     'laender',           6, 'main'),
    ('Österreicher',    'der',    '-',    'Noun',     'laender',           6, 'sub'),
    ('Österreicherin',  'die',    '-nen', 'Noun',     'laender',           6, 'sub'),
    ('österreichisch',  '',       '',     'Adjective','laender',           6, 'sub'),
    ('Schweiz',         'die',    '',     'Noun',     'laender',           6, 'main'),
    ('Schweizer',       'der',    '-',    'Noun',     'laender',           6, 'sub'),
    ('Schweizerin',     'die',    '-nen', 'Noun',     'laender',           6, 'sub'),
    ('schweizerisch',   '',       '',     'Adjective','laender',           6, 'sub'),
    ('Luxemburg',       '',       '',     'Noun',     'laender',           6, 'main'),
    ('Luxemburger',     'der',    '-',    'Noun',     'laender',           6, 'sub'),
    ('Luxemburgerin',   'die',    '-nen', 'Noun',     'laender',           6, 'sub'),
    ('luxemburgisch',   '',       '',     'Adjective','laender',           6, 'sub'),
    ('Europa',          '',       '',     'Noun',     'laender',           6, 'main'),
    ('Europäer',        'der',    '-',    'Noun',     'laender',           6, 'sub'),
    ('Europäerin',      'die',    '-nen', 'Noun',     'laender',           6, 'sub'),
    ('europäisch',      '',       '',     'Adjective','laender',           6, 'sub'),
    # ── PAGE 6: Währungen und Maße ───────────────────────────────────────────
    ('Währung',         'die',    '-en',  'Noun',     'waehrungen',        6, 'section_title'),
    ('Maß',             'das',    '-e',   'Noun',     'masse',             6, 'section_title'),
    ('Euro',            'der',    '',     'Noun',     'waehrungen',        6, 'main'),
    ('Cent',            'der',    '',     'Noun',     'waehrungen',        6, 'sub'),
    ('Franken',         'der',    '-',    'Noun',     'waehrungen',        6, 'main'),
    ('Rappen',          'der',    '-',    'Noun',     'waehrungen',        6, 'sub'),
    ('Meter',           'der',    '',     'Noun',     'masse',             6, 'main'),
    ('Zentimeter',      'der',    '',     'Noun',     'masse',             6, 'sub'),
    ('Kilometer',       'der',    '',     'Noun',     'masse',             6, 'main'),
    ('Prozent',         'das',    '',     'Noun',     'masse',             6, 'main'),
    ('Liter',           'der',    '',     'Noun',     'masse',             6, 'main'),
    ('Gramm',           'das',    '',     'Noun',     'masse',             6, 'main'),
    ('Kilogramm',       'das',    '',     'Noun',     'masse',             6, 'sub'),
    ('Grad',            'der',    '',     'Noun',     'masse',             6, 'main'),
    # ── PAGE 6: Schule und Schulfächer ───────────────────────────────────────
    ('Schule',          'die',    '-n',   'Noun',     'schule',            6, 'section_title'),
    ('Schulfach',       'das',    '¨-er', 'Noun',     'schule',            6, 'section_title'),
    ('Abitur',          'das',    '',     'Noun',     'schule',            6, 'main'),
    ('Direktor',        'der',    '-en',  'Noun',     'schule',            6, 'main'),
    ('Hausaufgabe',     'die',    '-n',   'Noun',     'schule',            6, 'main'),
    ('Klasse',          'die',    '-n',   'Noun',     'schule',            6, 'main'),
    ('Klassenfahrt',    'die',    '-en',  'Noun',     'schule',            6, 'main'),
    ('Sekretariat',     'das',    '-e',   'Noun',     'schule',            6, 'main'),
    ('Stundenplan',     'der',    '¨-e',  'Noun',     'schule',            6, 'main'),
    ('Biologie',        '',       '',     'Noun',     'schule',            6, 'main'),
    ('Chemie',          '',       '',     'Noun',     'schule',            6, 'main'),
    ('Deutsch',         '',       '',     'Noun',     'schule',            6, 'main'),
    ('Englisch',        '',       '',     'Noun',     'schule',            6, 'main'),
    ('Französisch',     '',       '',     'Noun',     'schule',            6, 'main'),
    ('Geografie',       '',       '',     'Noun',     'schule',            6, 'main'),
    ('Geschichte',      '',       '',     'Noun',     'schule',            6, 'main'),
    ('Kunst',           'die',    '',     'Noun',     'schule',            6, 'main'),
    ('Latein',          '',       '',     'Noun',     'schule',            6, 'main'),
    ('Mathematik',      '',       '',     'Noun',     'schule',            6, 'main'),
    ('Musik',           'die',    '',     'Noun',     'schule',            6, 'main'),
    ('Physik',          '',       '',     'Noun',     'schule',            6, 'main'),
    ('Religion',        'die',    '-en',  'Noun',     'schule',            6, 'main'),
    ('Sozialkunde',     '',       '',     'Noun',     'schule',            6, 'main'),
    ('Sport',           'der',    '',     'Noun',     'schule',            6, 'main'),
    # ── PAGE 6: Feiertage ────────────────────────────────────────────────────
    ('Feiertag',        'der',    '-e',   'Noun',     'feiertage',         6, 'section_title'),
    ('Karneval',        'der',    '',     'Noun',     'feiertage',         6, 'main'),
    ('Ostern',          '',       '',     'Noun',     'feiertage',         6, 'main'),
    ('Weihnachten',     '',       '',     'Noun',     'feiertage',         6, 'main'),
    ('Neujahr',         'das',    '',     'Noun',     'feiertage',         6, 'main'),
    ('Silvester',       '',       '',     'Noun',     'feiertage',         6, 'main'),
    # ── PAGE 6: Jahreszeiten ─────────────────────────────────────────────────
    ('Jahreszeit',      'die',    '-en',  'Noun',     'jahreszeiten',      6, 'section_title'),
    ('Frühling',        'der',    '',     'Noun',     'jahreszeiten',      6, 'main'),
    ('Frühjahr',        'das',    '',     'Noun',     'jahreszeiten',      6, 'sub'),
    ('Sommer',          'der',    '',     'Noun',     'jahreszeiten',      6, 'main'),
    ('Herbst',          'der',    '',     'Noun',     'jahreszeiten',      6, 'main'),
    ('Winter',          'der',    '',     'Noun',     'jahreszeiten',      6, 'main'),
    # ── PAGE 6: Monate ───────────────────────────────────────────────────────
    ('Monat',           'der',    '-e',   'Noun',     'monat',             6, 'section_title'),
    ('Januar',          'der',    '',     'Noun',     'monat',             6, 'main'),
    ('Februar',         'der',    '',     'Noun',     'monat',             6, 'main'),
    ('März',            'der',    '',     'Noun',     'monat',             6, 'main'),
    ('April',           'der',    '',     'Noun',     'monat',             6, 'main'),
    ('Mai',             'der',    '',     'Noun',     'monat',             6, 'main'),
    ('Juni',            'der',    '',     'Noun',     'monat',             6, 'main'),
    ('Juli',            'der',    '',     'Noun',     'monat',             6, 'main'),
    ('August',          'der',    '',     'Noun',     'monat',             6, 'main'),
    ('September',       'der',    '',     'Noun',     'monat',             6, 'main'),
    ('Oktober',         'der',    '',     'Noun',     'monat',             6, 'main'),
    ('November',        'der',    '',     'Noun',     'monat',             6, 'main'),
    ('Dezember',        'der',    '',     'Noun',     'monat',             6, 'main'),
    # ── PAGE 6: Tageszeiten ──────────────────────────────────────────────────
    ('Tageszeit',       'die',    '-en',  'Noun',     'tageszeiten',       6, 'section_title'),
    ('Tag',             'der',    '-e',   'Noun',     'tageszeiten',       6, 'main'),
    ('Morgen',          'der',    '-',    'Noun',     'tageszeiten',       6, 'main'),
    ('Vormittag',       'der',    '-e',   'Noun',     'tageszeiten',       6, 'main'),
    ('Mittag',          'der',    '-e',   'Noun',     'tageszeiten',       6, 'main'),
    ('Nachmittag',      'der',    '-e',   'Noun',     'tageszeiten',       6, 'main'),
    ('Abend',           'der',    '-e',   'Noun',     'tageszeiten',       6, 'main'),
    ('Nacht',           'die',    '¨-e',  'Noun',     'tageszeiten',       6, 'main'),
    ('Mitternacht',     'die',    '',     'Noun',     'tageszeiten',       6, 'main'),
    ('täglich',         '',       '',     'Adverb',   'tageszeiten',       6, 'main'),
    ('tagsüber',        '',       '',     'Adverb',   'tageszeiten',       6, 'main'),
    ('morgens',         '',       '',     'Adverb',   'tageszeiten',       6, 'main'),
    ('vormittags',      '',       '',     'Adverb',   'tageszeiten',       6, 'main'),
    ('mittags',         '',       '',     'Adverb',   'tageszeiten',       6, 'main'),
    ('nachmittags',     '',       '',     'Adverb',   'tageszeiten',       6, 'main'),
    ('abends',          '',       '',     'Adverb',   'tageszeiten',       6, 'main'),
    ('nachts',          '',       '',     'Adverb',   'tageszeiten',       6, 'main'),
    # ── PAGE 7: Zahlen ───────────────────────────────────────────────────────
    ('Zahlen',          '',       '',     'Noun',     'zahlen',            7, 'section_title'),
    ('eins',            '',       '',     'Number',   'zahlen',            7, 'main'),
    ('zwei',            '',       '',     'Number',   'zahlen',            7, 'main'),
    ('drei',            '',       '',     'Number',   'zahlen',            7, 'main'),
    ('vier',            '',       '',     'Number',   'zahlen',            7, 'main'),
    ('fünf',            '',       '',     'Number',   'zahlen',            7, 'main'),
    ('sechs',           '',       '',     'Number',   'zahlen',            7, 'main'),
    ('sieben',          '',       '',     'Number',   'zahlen',            7, 'main'),
    ('acht',            '',       '',     'Number',   'zahlen',            7, 'main'),
    ('neun',            '',       '',     'Number',   'zahlen',            7, 'main'),
    ('zehn',            '',       '',     'Number',   'zahlen',            7, 'main'),
    ('elf',             '',       '',     'Number',   'zahlen',            7, 'main'),
    ('zwölf',           '',       '',     'Number',   'zahlen',            7, 'main'),
    ('dreizehn',        '',       '',     'Number',   'zahlen',            7, 'main'),
    ('vierzehn',        '',       '',     'Number',   'zahlen',            7, 'main'),
    ('fünfzehn',        '',       '',     'Number',   'zahlen',            7, 'main'),
    ('sechzehn',        '',       '',     'Number',   'zahlen',            7, 'main'),
    ('siebzehn',        '',       '',     'Number',   'zahlen',            7, 'main'),
    ('achtzehn',        '',       '',     'Number',   'zahlen',            7, 'main'),
    ('neunzehn',        '',       '',     'Number',   'zahlen',            7, 'main'),
    ('zwanzig',         '',       '',     'Number',   'zahlen',            7, 'main'),
    ('einundzwanzig',   '',       '',     'Number',   'zahlen',            7, 'main'),
    ('dreißig',         '',       '',     'Number',   'zahlen',            7, 'main'),
    ('vierzig',         '',       '',     'Number',   'zahlen',            7, 'main'),
    ('fünfzig',         '',       '',     'Number',   'zahlen',            7, 'main'),
    ('sechzig',         '',       '',     'Number',   'zahlen',            7, 'main'),
    ('siebzig',         '',       '',     'Number',   'zahlen',            7, 'main'),
    ('achtzig',         '',       '',     'Number',   'zahlen',            7, 'main'),
    ('neunzig',         '',       '',     'Number',   'zahlen',            7, 'main'),
    ('hundert',         '',       '',     'Number',   'zahlen',            7, 'main'),
    ('hunderteins',     '',       '',     'Number',   'zahlen',            7, 'main'),
    ('zweihundert',     '',       '',     'Number',   'zahlen',            7, 'main'),
    ('tausend',         '',       '',     'Number',   'zahlen',            7, 'main'),
    ('zweitausendeins', '',       '',     'Number',   'zahlen',            7, 'main'),
    ('Million',         'die',    '-en',  'Noun',     'zahlen',            7, 'main'),
    ('erste',           '',       '',     'Number',   'zahlen',            7, 'main'),
    ('zweite',          '',       '',     'Number',   'zahlen',            7, 'main'),
    ('dritte',          '',       '',     'Number',   'zahlen',            7, 'main'),
    ('vierte',          '',       '',     'Number',   'zahlen',            7, 'main'),
    ('erstens',         '',       '',     'Adverb',   'zahlen',            7, 'main'),
    ('zweitens',        '',       '',     'Adverb',   'zahlen',            7, 'main'),
    ('drittens',        '',       '',     'Adverb',   'zahlen',            7, 'main'),
    ('viertens',        '',       '',     'Adverb',   'zahlen',            7, 'main'),
    ('einmal',          '',       '',     'Adverb',   'zahlen',            7, 'main'),
    ('zweimal',         '',       '',     'Adverb',   'zahlen',            7, 'main'),
    ('dreimal',         '',       '',     'Adverb',   'zahlen',            7, 'main'),
    ('viermal',         '',       '',     'Adverb',   'zahlen',            7, 'main'),
    # ── PAGE 7: Uhrzeit ──────────────────────────────────────────────────────
    ('Uhrzeit',         'die',    '',     'Noun',     'uhrzeit',           7, 'section_title'),
    ('Sekunde',         'die',    '-n',   'Noun',     'uhrzeit',           7, 'main'),
    ('Minute',          'die',    '-n',   'Noun',     'uhrzeit',           7, 'main'),
    ('Stunde',          'die',    '-n',   'Noun',     'uhrzeit',           7, 'main'),
    # ── PAGE 7: Wochentage ───────────────────────────────────────────────────
    ('Wochentag',       'der',    '-e',   'Noun',     'woche',             7, 'section_title'),
    ('Wochenende',      'das',    '-n',   'Noun',     'woche',             7, 'main'),
    ('Montag',          'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Dienstag',        'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Mittwoch',        'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Donnerstag',      'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Freitag',         'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Samstag',         'der',    '',     'Noun',     'woche',             7, 'main'),
    ('Sonntag',         'der',    '',     'Noun',     'woche',             7, 'main'),
    ('montags',         '',       '',     'Adverb',   'woche',             7, 'sub'),
    ('dienstags',       '',       '',     'Adverb',   'woche',             7, 'sub'),
    ('mittwochs',       '',       '',     'Adverb',   'woche',             7, 'sub'),
    ('donnerstags',     '',       '',     'Adverb',   'woche',             7, 'sub'),
    ('freitags',        '',       '',     'Adverb',   'woche',             7, 'sub'),
    ('samstags',        '',       '',     'Adverb',   'woche',             7, 'sub'),
    ('sonntags',        '',       '',     'Adverb',   'woche',             7, 'sub'),
    ('Arbeitstag',      'der',    '-e',   'Noun',     'woche',             7, 'main'),
    ('Werktag',         'der',    '-e',   'Noun',     'woche',             7, 'sub'),
    # ── PAGE 7: Zeitmaße ─────────────────────────────────────────────────────
    ('Zeitmaß',         'das',    '-e',   'Noun',     'zeitmaße',          7, 'section_title'),
    ('Woche',           'die',    '-n',   'Noun',     'zeitmaße',          7, 'main'),
    ('Jahr',            'das',    '-e',   'Noun',     'zeitmaße',          7, 'main'),
]

# ─── HELPERS ──────────────────────────────────────────────────────────────────

def clean(s):
    return re.sub(r'\s+', ' ', s or '').strip()


RE_NOUN_WORD = re.compile(
    r'^(der|die|das)\s+([A-ZÄÖÜa-zäöüß][\wäöüÄÖÜß\-/()\'.]*)'
)

RE_REFLEXIVE = re.compile(
    r'^\(sich\)\s+(\w[\wäöüÄÖÜß\-]*)'
)

# Lines/phrases to skip
SKIP_PHRASES = {
    'wortliste', 'alphabetischer wortschatz', 'wortgruppen', 'wortgruppenliste',
    'literatur', 'vorwort', 'themen', 'inventare',
}

# Page header pattern for A2: "8 WORTLISTEA2_Wortliste_03_200616" merged with content
RE_A2_PAGE_HEADER = re.compile(r'^\d+\s+WORTLIST\w+\d{6}')

SEPARABLE_PARTICLES = {
    'an', 'ab', 'auf', 'aus', 'bei', 'ein', 'fest', 'hin', 'los', 'mit',
    'nach', 'vor', 'weg', 'weiter', 'zu', 'zurück', 'zusammen', 'durch',
    'her', 'herunter', 'herauf', 'raus', 'rein', 'hoch', 'nieder',
}


def extract_noun_plural(rest_after_word):
    """Extract plural suffix from text following the noun word."""
    if not rest_after_word:
        return ''
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


def is_infinitive(word):
    """True if word looks like a German infinitive (ends in -en, -eln, -ern)."""
    w = word.rstrip(',-')
    return bool(re.search(r'(en|eln|ern)$', w)) or w in ('sein', 'tun', 'haben')


def parse_verb_main_line(s):
    """
    Parse a verb main entry line. Returns (infinitive, present_form, reflexive_bool).
    Examples:
      "anfangen,  Hier..."           → ("anfangen", "", False)
      "ändern, ändert,  Das..."      → ("ändern", "ändert", False)
      "anrufen, ruft an,  Kann..."   → ("anrufen", "ruft an", False)
      "(sich) anmelden,  Wo..."      → ("anmelden", "", True)
    """
    reflexive = False
    if s.startswith('(sich)'):
        reflexive = True
        s = re.sub(r'^\(sich\)\s*,?\s*', '', s).strip()

    parts = [p.strip() for p in s.split(',')]

    # First part = infinitive
    first_tokens = parts[0].split() if parts else []
    infinitive = first_tokens[0] if first_tokens else ''
    infinitive = infinitive.strip(',-')

    # Second part: check if it could be a present tense form
    present = ''
    if len(parts) >= 2:
        second = parts[1].strip()
        if second and second[0].islower():
            sec_tokens = second.split()
            if sec_tokens:
                first_of_sec = sec_tokens[0].rstrip(',')
                # If it's not an infinitive itself, it's the present form
                if not is_infinitive(first_of_sec):
                    p_toks = []
                    for t in sec_tokens[:3]:
                        t_clean = t.rstrip(',')
                        if t_clean[0].isupper():
                            break
                        p_toks.append(t_clean)
                    present = ' '.join(p_toks)

    return infinitive, present, reflexive


def extract_continuation_forms(s):
    """
    From a continuation line (present or present+perfect), extract:
    (present_form, perfect_form).
    Examples:
      "fängt an,     Der Unterricht..."   → ("fängt an", "")
      "macht an, hat angemacht"           → ("macht an", "hat angemacht")
      "füllt aus, hat ausgefüllt"         → ("füllt aus", "hat ausgefüllt")
    """
    parts = [p.strip() for p in s.split(',')]

    # First part = present tense form
    first_tokens = parts[0].split()
    p_toks = []
    for t in first_tokens[:3]:
        t_clean = t.rstrip(',')
        if t_clean and t_clean[0].isupper():
            break
        if t_clean:
            p_toks.append(t_clean)
    present = ' '.join(p_toks)

    # Look for perfect form (hat/ist + participle) in subsequent parts
    perfect = ''
    for part in parts[1:]:
        part = part.strip()
        if part.startswith(('hat ', 'ist ')):
            perf_tokens = part.split()
            if len(perf_tokens) >= 2:
                # Strip trailing article merged without space (PDF artifact):
                # e.g. "geantwortetdie" → "geantwortet"
                participle = re.sub(r'(die|der|das|den|dem|eine?[nmrs]?)$', '', perf_tokens[1])
                perfect = perf_tokens[0] + ' ' + (participle or perf_tokens[1])
            break

    return present, perfect


def extract_perfect_from_line(s):
    """Extract perfect form from a line starting with hat/ist."""
    tokens = s.split()
    if len(tokens) >= 2:
        # Strip trailing article merged without space (PDF artifact)
        participle = re.sub(r'(die|der|das|den|dem|eine?[nmrs]?)$', '', tokens[1])
        return tokens[0] + ' ' + (participle or tokens[1])
    return tokens[0] if tokens else ''


def looks_like_verb_entry(s):
    """True if s looks like a new verb main entry (lowercase + comma + infinitive ending)."""
    if not s:
        return False
    if s.startswith('(sich)'):
        # Must be followed by a word that ends in -en (real infinitive),
        # not a preposition complement like "(sich) (über)"
        after_sich = re.sub(r'^\(sich\)\s*,?\s*', '', s).strip()
        if after_sich.startswith('('):
            return False  # "(sich) (über)," is a preposition note, not a verb entry
        return True
    if s[0].isupper():
        return False
    # Must have a comma (verb entries always have comma after infinitive)
    if ',' not in s:
        return False
    first_token = s.split(',')[0].strip().split()[0] if s else ''
    first_token = first_token.rstrip(',')
    return is_infinitive(first_token)


def looks_like_present_continuation(s):
    """
    True if s looks like a present tense continuation (not a new infinitive).
    Used when we're already inside a verb entry (state IN_VERB).
    """
    if not s or s[0].isupper():
        return False
    if s.startswith('(sich)'):
        return False
    if ',' not in s:
        return False
    first_token = s.split(',')[0].strip().split()[0] if s else ''
    first_token = first_token.rstrip(',')
    # NOT an infinitive → it's a conjugated form
    return not is_infinitive(first_token)


def looks_like_perfect_continuation(s):
    return s.startswith(('hat ', 'ist '))


def detect_word_type(word, article):
    if article:
        return 'Noun'
    w = word.lower().rstrip('-')
    if re.search(r'(eln|ern|[^e]en)$', w):
        return 'Verb'
    return 'Other'


def is_section_letter(s):
    return bool(re.match(r'^[A-Za-z]$', s))


def should_skip_line(s):
    sl = s.lower().strip()
    if sl in SKIP_PHRASES:
        return True
    if re.match(r'^alphabetische', sl):
        return True
    if re.match(r'^goethe-zertifikat', sl, re.I):
        return True
    if re.match(r'^wortliste$', sl):
        return True
    return False


# ─── PAGE PARSER ──────────────────────────────────────────────────────────────

def parse_page(raw_text, page_num, current_section):
    """
    Parse one page of the A2 alphabetical word list using a state machine.
    Returns (list_of_row_dicts, updated_section).
    """
    # Pre-process: split into lines with leading whitespace count
    lines = []
    for raw_line in raw_text.split('\n'):
        line = re.sub(r'\t+', ' ', raw_line)

        # Strip A2 page header merged with content
        # e.g. "8 WORTLISTEA2_Wortliste_03_200616hat angeboten"
        hdr_m = RE_A2_PAGE_HEADER.match(line.strip())
        if hdr_m:
            line = line.strip()[hdr_m.end():]  # keep remainder after header

        leading = len(line) - len(line.lstrip(' '))
        s = line.strip()
        if s:
            lines.append((leading, s))

    rows = []

    # State machine
    # state: 'NONE' or 'IN_VERB'
    state = 'NONE'
    pending_verb = None  # dict with word, verb_present, verb_perfect, section

    def emit_pending():
        nonlocal pending_verb
        if pending_verb:
            rows.append(pending_verb)
            pending_verb = None

    i = 0
    while i < len(lines):
        leading, s = lines[i]

        # ── Skip known non-word lines ───────────────────────────────────────
        if should_skip_line(s):
            emit_pending()
            state = 'NONE'
            i += 1
            continue

        # ── Skip parenthetical compound lists "(fahren, gehen, ...)" ───────
        if s.startswith('(') and not s.startswith('(sich)'):
            i += 1
            continue

        # ── Section letter header ──────────────────────────────────────────
        if is_section_letter(s):
            emit_pending()
            state = 'NONE'
            current_section = s.upper()
            i += 1
            continue

        # ── Handle merged section-letter + entry (PDF artifact) ────────────
        if leading == 0:
            merged_art = re.match(r'^([A-Z])(der|die|das)\s', s)
            if merged_art:
                emit_pending()
                state = 'NONE'
                current_section = merged_art.group(1)
                s = s[1:]
            else:
                merged_word = re.match(r'^([A-Z])([a-zäöüß]{2,})', s)
                if merged_word and merged_word.group(2)[0] == merged_word.group(1).lower():
                    emit_pending()
                    state = 'NONE'
                    current_section = merged_word.group(1)
                    s = s[1:]

        # ── Example continuation lines (20+ spaces) → skip ─────────────────
        if leading >= 20:
            i += 1
            continue

        # ── Lines with 1–19 leading spaces: skip (example/continuation) ────
        if leading >= 1:
            i += 1
            continue

        # ── 0-indent lines: main entries and verb continuations ─────────────
        # State: IN_VERB → check if this line is a continuation
        if state == 'IN_VERB' and pending_verb is not None:
            # Noun entries (der/die/das …) always end the verb context,
            # even though "die/der/das" starts with a lowercase letter.
            if RE_NOUN_WORD.match(s):
                emit_pending()
                state = 'NONE'
                # Fall through to process this noun as a new entry

            elif looks_like_perfect_continuation(s):
                # Perfect tense form: "hat angefangen"
                if not pending_verb['verb_perfect']:
                    pending_verb['verb_perfect'] = extract_perfect_from_line(s)
                # Check if a noun sub-entry merged on same line after "hat angemacht"
                # e.g. "ist angekommen die Ankunft, -¨e"
                noun_after = re.search(r'\s+(der|die|das)\s+([A-ZÄÖÜ]\w+)', s)
                if noun_after:
                    emit_pending()
                    state = 'NONE'
                    # Parse that noun as a new sub-entry
                    art2 = noun_after.group(1)
                    word2 = noun_after.group(2)
                    rest2 = s[noun_after.end():]
                    plural2 = extract_noun_plural(rest2)
                    rows.append({
                        'level': LEVEL, 'source_page': page_num,
                        'section': current_section, 'entry_type': 'main',
                        'word': word2, 'article': art2, 'plural': plural2,
                        'word_type': 'Noun', 'verb_present': '', 'verb_perfect': '',
                    })
                else:
                    emit_pending()
                    state = 'NONE'
                i += 1
                continue

            elif looks_like_present_continuation(s):
                # Present tense form continuation
                pres, perf = extract_continuation_forms(s)
                if pres and not pending_verb['verb_present']:
                    pending_verb['verb_present'] = pres
                if perf and not pending_verb['verb_perfect']:
                    pending_verb['verb_perfect'] = perf
                if perf:
                    # Perfect found on same line → emit
                    emit_pending()
                    state = 'NONE'
                i += 1
                continue

            else:
                # Not a continuation → emit verb and fall through to process as new entry
                emit_pending()
                state = 'NONE'
                # (do NOT increment i; re-process this line)

        # ── Process 0-indent line as a new entry ────────────────────────────

        # NOUN: der/die/das Word [, plural]
        noun_m = RE_NOUN_WORD.match(s)
        if noun_m:
            article, word = noun_m.group(1), noun_m.group(2)
            rest = s[noun_m.end():]
            plural = extract_noun_plural(rest)
            rows.append({
                'level': LEVEL, 'source_page': page_num,
                'section': current_section, 'entry_type': 'main',
                'word': word, 'article': article, 'plural': plural,
                'word_type': 'Noun', 'verb_present': '', 'verb_perfect': '',
            })
            i += 1
            continue

        # VERB: lowercase word with comma, looks like infinitive
        if looks_like_verb_entry(s):
            infinitive, present, reflexive = parse_verb_main_line(s)
            if infinitive and len(infinitive) <= 50:
                pending_verb = {
                    'level': LEVEL, 'source_page': page_num,
                    'section': current_section, 'entry_type': 'main',
                    'word': infinitive, 'article': '', 'plural': '',
                    'word_type': 'Verb', 'verb_present': present, 'verb_perfect': '',
                }
                state = 'IN_VERB'
                i += 1
                continue

        # STRAY PERFECT FORM (e.g. at page start): "hat angeboten"
        if looks_like_perfect_continuation(s):
            # Skip stray perfect forms when not in verb state
            i += 1
            continue

        # WORD STEM: like "ander-", "all-", "zurück-" (single token only, not hyphenated line-breaks)
        if s and s[0].islower() and s.endswith('-') and ',' not in s and ' ' not in s:
            word = s.rstrip('-')
            if word and len(word) >= 2:
                rows.append({
                    'level': LEVEL, 'source_page': page_num,
                    'section': current_section, 'entry_type': 'main',
                    'word': word, 'article': '', 'plural': '',
                    'word_type': 'Other', 'verb_present': '', 'verb_perfect': '',
                })
            i += 1
            continue

        # OTHER LOWERCASE WORD (adverb, adjective, particle, etc.)
        # No comma → not a verb → include as Other
        if s and s[0].islower() and ',' not in s:
            tokens = s.split()
            word = tokens[0] if tokens else ''
            if word and len(word) <= 40 and not word.startswith('http'):
                wtype = detect_word_type(word, '')
                rows.append({
                    'level': LEVEL, 'source_page': page_num,
                    'section': current_section, 'entry_type': 'main',
                    'word': word, 'article': '', 'plural': '',
                    'word_type': wtype, 'verb_present': '', 'verb_perfect': '',
                })
            i += 1
            continue

        i += 1

    # Emit any pending verb at end of page
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

        # 1. Thematic sections (pages 5–7)
        print('Processing thematic sections (pages 5–7) …')
        for r in THEMATIC_ROWS:
            word, article, plural, wtype, section, page, entry_type = r
            all_rows.append({
                'level':        LEVEL,
                'source_page':  page,
                'section':      section,
                'entry_type':   entry_type,
                'word':         word,
                'article':      article,
                'plural':       plural,
                'word_type':    wtype,
                'verb_present': '',
                'verb_perfect': '',
            })

        # 2. Alphabetical sections (pages 8–31 = indices 7–30)
        current_section = 'A'
        for idx in range(7, 31):
            page_num = idx + 1
            print(f'  Page {page_num} (section {current_section}) …', end=' ')
            text = reader.pages[idx].extract_text() or ''
            page_rows, current_section = parse_page(text, page_num, current_section)
            print(f'{len(page_rows)} entries')
            all_rows.extend(page_rows)

        # 3. Post-process: filter out artifact rows and fix section labels
        ARTIFACT_WORDS = {'ist/hat', 'hat/ist', 'der/die', 'die/der'}
        all_rows = [
            row for row in all_rows
            if not (row['word'] and row['word'][0] in '()')
            and row['word'] not in ARTIFACT_WORDS
        ]
        for row in all_rows:
            # Clear verb forms that contain "/" (these are phrase artifacts, not conjugations)
            if '/' in row.get('verb_perfect', ''):
                row['verb_perfect'] = ''
            if '/' in row.get('verb_present', ''):
                row['verb_present'] = ''
            # Fix section labels from word's first letter for alphabetical entries
            if int(row['source_page']) >= 8 and row['word']:
                row['section'] = row['word'][0].upper()

        # 4. Write CSV
        fieldnames = [
            'id', 'level', 'source_page', 'section', 'entry_type',
            'word', 'article', 'plural', 'word_type',
            'verb_present', 'verb_perfect',
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

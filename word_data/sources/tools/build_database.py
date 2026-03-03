#!/usr/bin/env python3
"""
build_database.py
=================
Downloads open-source German vocabulary datasets and builds the app's JS data files.

Data sources:
  1. hermitdave/FrequencyWords  – de_50k.txt  (50k German words + frequency)
  2. freedict deu-tur            – german-turkish.txt (German-Turkish)
  3. TU-Chemnitz beolingus       – de-en.txt.gz (411k German-English entries)
  4. kennethsible/goethe-wortliste – sorted.txt (Goethe B1 official word list)

License notes:
  - FrequencyWords: CC-BY 4.0
  - FreeDict deu-tur: GPL
  - TU-Chemnitz ding: GPL v2+
  - kennethsible/goethe-wortliste: educational / Goethe Institut material
"""

import os
import re
import json
import gzip
import urllib.request
import sys
from collections import defaultdict

# ─────────────────────────── CONFIG ────────────────────────────────────────────

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))  # tools/
SOURCES    = os.path.join(BASE_DIR, "..")                 # sources/
RAW_DIR    = os.path.join(SOURCES, "raw")
OUT_DIR    = os.path.join(SOURCES, "goethe-institut")
DICT_DIR   = os.path.join(SOURCES, "dictionary")

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(DICT_DIR, exist_ok=True)

URLS = {
    "frequency":    "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/de/de_50k.txt",
    "de_tur":       "https://raw.githubusercontent.com/freedict/fd-dictionaries/master/deu-tur/german-turkish.txt",
    "de_en":        "https://ftp.tu-chemnitz.de/pub/Local/urz/ding/de-en-devel/de-en.txt.gz",
    "goethe_b1":    "https://raw.githubusercontent.com/kennethsible/goethe-wortliste/main/sorted.txt",
}
FILES = {
    "frequency":    os.path.join(RAW_DIR, "de_50k.txt"),
    "de_tur":       os.path.join(RAW_DIR, "german-turkish.txt"),
    "de_en":        os.path.join(RAW_DIR, "de-en.txt.gz"),
    "goethe_b1":    os.path.join(RAW_DIR, "goethe_b1_sorted.txt"),
}

# CEFR level frequency rank boundaries
LEVEL_BOUNDS = {
    "A1": (1,    600),
    "A2": (601,  1500),
    "B1": (1501, 3500),
    "B2": (3501, 7000),
}

# ─────────────────── PERSIAN (FARSI) SEED TRANSLATIONS ─────────────────────────
# Hand-curated common German→Farsi for the most frequent ~400 words
# (No free German-Farsi corpus exists; this seed covers daily essentials)
FA_SEED: dict[str, str] = {
    # Pronouns & articles
    "ich": "من", "du": "تو", "er": "او (مذکر)", "sie": "او (مؤنث) / آن‌ها",
    "es": "آن", "wir": "ما", "ihr": "شما (غیررسمی)", "Sie": "شما (رسمی)",
    "der": "اِل (مذکر)", "die": "اِل (مؤنث/جمع)", "das": "اِل (خنثی)",
    "ein": "یک (مذکر/خنثی)", "eine": "یک (مؤنث)", "kein": "هیچ",
    # Common verbs
    "sein": "بودن", "haben": "داشتن", "werden": "شدن", "können": "توانستن",
    "müssen": "باید / مجبور بودن", "wollen": "خواستن", "sollen": "باید (از بیرون)",
    "dürfen": "اجازه داشتن", "mögen": "دوست داشتن", "möchten": "می‌خواستم",
    "gehen": "رفتن", "kommen": "آمدن", "machen": "کردن / ساختن",
    "sagen": "گفتن", "sehen": "دیدن", "geben": "دادن", "nehmen": "گرفتن",
    "wissen": "دانستن", "denken": "فکر کردن", "glauben": "باور کردن",
    "stehen": "ایستادن", "sitzen": "نشستن", "liegen": "دراز کشیدن",
    "laufen": "دویدن / راه رفتن", "schreiben": "نوشتن", "lesen": "خواندن",
    "sprechen": "صحبت کردن", "erzählen": "تعریف کردن", "fragen": "پرسیدن",
    "antworten": "جواب دادن", "helfen": "کمک کردن", "arbeiten": "کار کردن",
    "spielen": "بازی کردن", "lernen": "یاد گرفتن", "kaufen": "خریدن",
    "verkaufen": "فروختن", "essen": "خوردن", "trinken": "نوشیدن",
    "schlafen": "خوابیدن", "wohnen": "زندگی کردن (در جایی)", "leben": "زندگی کردن",
    "lieben": "دوست داشتن / عاشق بودن", "kennen": "شناختن", "brauchen": "نیاز داشتن",
    "finden": "پیدا کردن / فکر کردن", "verstehen": "فهمیدن", "hören": "شنیدن",
    "zeigen": "نشان دادن", "bringen": "آوردن", "lassen": "گذاشتن / اجازه دادن",
    "bleiben": "ماندن", "fahren": "رانندگی کردن / سفر کردن", "reisen": "سفر کردن",
    "öffnen": "باز کردن", "schließen": "بستن", "starten": "شروع کردن",
    "beginnen": "شروع کردن", "enden": "تمام شدن", "warten": "صبر کردن",
    "suchen": "دنبال گشتن", "zählen": "شمردن", "rechnen": "حساب کردن",
    "kochen": "آشپزی کردن", "putzen": "تمیز کردن", "waschen": "شستن",
    "bezahlen": "پرداخت کردن", "einladen": "دعوت کردن",
    # Common nouns
    "Mann": "مرد", "Frau": "زن", "Kind": "بچه", "Kinder": "بچه‌ها",
    "Familie": "خانواده", "Mutter": "مادر", "Vater": "پدر",
    "Bruder": "برادر", "Schwester": "خواهر", "Freund": "دوست (مذکر)",
    "Freundin": "دوست (مؤنث)", "Mensch": "انسان", "Person": "شخص",
    "Haus": "خانه", "Wohnung": "آپارتمان", "Zimmer": "اتاق",
    "Schule": "مدرسه", "Universität": "دانشگاه", "Arbeit": "کار",
    "Beruf": "شغل", "Büro": "دفتر", "Geschäft": "فروشگاه / کار",
    "Stadt": "شهر", "Land": "کشور / روستا", "Straße": "خیابان",
    "Weg": "راه", "Auto": "ماشین", "Bus": "اتوبوس", "Zug": "قطار",
    "Flugzeug": "هواپیما", "Bahnhof": "ایستگاه قطار", "Flughafen": "فرودگاه",
    "Tag": "روز", "Nacht": "شب", "Morgen": "صبح", "Abend": "عصر",
    "Woche": "هفته", "Monat": "ماه", "Jahr": "سال",
    "Montag": "دوشنبه", "Dienstag": "سه‌شنبه", "Mittwoch": "چهارشنبه",
    "Donnerstag": "پنجشنبه", "Freitag": "جمعه", "Samstag": "شنبه", "Sonntag": "یکشنبه",
    "Januar": "ژانویه", "Februar": "فوریه", "März": "مارس",
    "April": "آوریل", "Mai": "مه", "Juni": "ژوئن",
    "Juli": "ژوئیه", "August": "اوت", "September": "سپتامبر",
    "Oktober": "اکتبر", "November": "نوامبر", "Dezember": "دسامبر",
    "Essen": "غذا", "Trinken": "نوشیدنی", "Wasser": "آب", "Brot": "نان",
    "Milch": "شیر", "Kaffee": "قهوه", "Tee": "چای", "Bier": "آبجو",
    "Wein": "شراب", "Fleisch": "گوشت", "Obst": "میوه", "Gemüse": "سبزیجات",
    "Geld": "پول", "Preis": "قیمت", "Euro": "یورو",
    "Zeit": "وقت / زمان", "Uhr": "ساعت", "Stunde": "ساعت",
    "Minute": "دقیقه", "Sekunde": "ثانیه",
    "Name": "اسم", "Sprache": "زبان", "Wort": "کلمه", "Satz": "جمله",
    "Buch": "کتاب", "Brief": "نامه", "Zeitung": "روزنامه",
    "Telefon": "تلفن", "Handy": "موبایل", "Computer": "کامپیوتر",
    "Internet": "اینترنت", "Film": "فیلم", "Musik": "موسیقی",
    "Sport": "ورزش", "Spiel": "بازی", "Urlaub": "تعطیلات",
    "Farbe": "رنگ", "Nummer": "شماره", "Größe": "اندازه",
    "Hund": "سگ", "Katze": "گربه", "Vogel": "پرنده",
    "Baum": "درخت", "Blume": "گل", "Garten": "باغ",
    "Sonne": "خورشید", "Mond": "ماه (آسمان)", "Stern": "ستاره",
    "Regen": "باران", "Schnee": "برف", "Wind": "باد", "Wetter": "آب و هوا",
    "Kopf": "سر", "Hand": "دست", "Auge": "چشم", "Ohr": "گوش",
    "Mund": "دهان", "Nase": "بینی", "Herz": "قلب",
    "Arzt": "دکتر", "Krankenhaus": "بیمارستان", "Gesundheit": "سلامتی",
    "Problem": "مشکل", "Frage": "سوال", "Antwort": "جواب",
    "Idee": "ایده", "Meinung": "نظر", "Fehler": "خطا / اشتباه",
    # Common adjectives
    "gut": "خوب", "schlecht": "بد", "groß": "بزرگ", "klein": "کوچک",
    "neu": "جدید", "alt": "قدیمی / پیر", "jung": "جوان", "schön": "زیبا",
    "wichtig": "مهم", "richtig": "درست", "falsch": "غلط",
    "einfach": "ساده", "schwer": "سخت / سنگین", "leicht": "آسان / سبک",
    "schnell": "سریع", "langsam": "آهسته", "viel": "زیاد", "wenig": "کم",
    "hoch": "بلند", "tief": "عمیق / پایین", "lang": "طولانی", "kurz": "کوتاه",
    "weit": "دور", "nah": "نزدیک", "früh": "زود", "spät": "دیر",
    "warm": "گرم", "kalt": "سرد", "hell": "روشن", "dunkel": "تاریک",
    "laut": "بلند (صدا)", "leise": "آرام (صدا)", "stark": "قوی", "schwach": "ضعیف",
    "gleich": "مساوی / همان", "anders": "متفاوت", "möglich": "ممکن",
    "nötig": "لازم", "fertig": "آماده / تمام", "bereit": "آماده",
    "interessant": "جالب", "lustig": "خنده‌دار", "traurig": "غمگین",
    "glücklich": "خوشحال", "müde": "خسته", "krank": "بیمار", "gesund": "سالم",
    # Common adverbs / prepositions / conjunctions
    "nicht": "نه / نمی", "auch": "هم / هم‌چنین", "nur": "فقط",
    "noch": "هنوز / دیگر", "schon": "قبلاً / دیگر", "immer": "همیشه",
    "nie": "هرگز", "oft": "اغلب", "manchmal": "گاهی", "jetzt": "الان",
    "dann": "بعد", "hier": "اینجا", "dort": "آنجا", "da": "آنجا / چون",
    "so": "اینطور", "wie": "چطور / مثل", "was": "چه", "wer": "چه کسی",
    "wo": "کجا", "wann": "کِی", "warum": "چرا", "wie viel": "چقدر",
    "und": "و", "oder": "یا", "aber": "اما", "wenn": "اگر / وقتی",
    "dass": "که (接)", "weil": "چون / زیرا", "obwohl": "اگرچه",
    "mit": "با", "ohne": "بدون", "für": "برای", "gegen": "علیه / در برابر",
    "über": "درباره / بالای", "unter": "زیر", "vor": "جلوی / قبل از",
    "nach": "بعد از / به سمت", "bei": "نزد / کنار", "von": "از",
    "zu": "به", "an": "کنار / در", "auf": "روی", "in": "در",
    "aus": "از داخل", "durch": "از طریق / توسط", "um": "دور / برای / ساعت",
    "bis": "تا", "seit": "از زمانی", "ab": "از این به بعد",
    "ja": "بله", "nein": "نه", "bitte": "لطفاً / خواهش می‌کنم",
    "danke": "ممنون", "Entschuldigung": "ببخشید", "Hallo": "سلام",
    "Tschüss": "خداحافظ", "Auf Wiedersehen": "خداحافظ (رسمی)",
    "Guten Morgen": "صبح بخیر", "Guten Tag": "روز بخیر", "Guten Abend": "عصر بخیر",
    "Gute Nacht": "شب بخیر",
    # Numbers
    "null": "صفر", "eins": "یک", "zwei": "دو", "drei": "سه",
    "vier": "چهار", "fünf": "پنج", "sechs": "شش", "sieben": "هفت",
    "acht": "هشت", "neun": "نه", "zehn": "ده", "elf": "یازده",
    "zwölf": "دوازده", "zwanzig": "بیست", "dreißig": "سی",
    "hundert": "صد", "tausend": "هزار", "Million": "میلیون",
}

# ─────────────────────────── DOWNLOAD ──────────────────────────────────────────

def download_file(key: str) -> str:
    url  = URLS[key]
    path = FILES[key]
    if os.path.exists(path):
        print(f"  [skip] {os.path.basename(path)} already downloaded")
        return path
    print(f"  [download] {url}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r, open(path, "wb") as f:
            data = r.read()
            f.write(data)
        print(f"  [ok] {os.path.basename(path)} ({len(data):,} bytes)")
    except Exception as e:
        print(f"  [error] {key}: {e}")
        return ""
    return path

# ─────────────────────────── PARSERS ───────────────────────────────────────────

def parse_frequency(path: str) -> dict[str, int]:
    """Returns {word: rank_1based}"""
    freq: dict[str, int] = {}
    with open(path, encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if parts:
                freq[parts[0]] = i
    return freq


def parse_goethe_b1(path: str) -> set[str]:
    """Returns set of lemma strings from the Goethe B1 official word list."""
    words: set[str] = set()
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            # Lines like: "haben, hat, hatte, hat gehabt" → lemma = "haben"
            # Also: "ein-" (dash = particle) → "ein"
            lemma = re.split(r"[,\-\s]", line)[0].strip().lower()
            if lemma:
                words.add(lemma)
    return words


def parse_de_tur(path: str) -> dict[str, list[str]]:
    """Returns {german_lower: [turkish_translation, ...]}"""
    result: dict[str, list[str]] = defaultdict(list)
    with open(path, encoding="utf-8") as f:
        for line in f:
            if line.startswith("#"):
                continue
            parts = line.strip().split("\t")
            if len(parts) >= 2:
                german = parts[0].strip()
                turkish = parts[1].strip()
                if german and turkish:
                    key = german.lower()
                    if turkish not in result[key]:
                        result[key].append(turkish)
    return dict(result)


def _clean_de_term(s: str) -> str:
    """Strip grammar tags, bracketed info, special chars to get clean German."""
    # Remove content in braces {…} and brackets […]
    s = re.sub(r'\{[^}]*\}', '', s)
    s = re.sub(r'\[[^\]]*\]', '', s)
    # Remove parenthetical
    s = re.sub(r'\([^)]*\)', '', s)
    # Remove trailing punctuation / special chars
    s = re.sub(r'[<>;,]+', '', s)
    return s.strip()


def _extract_grammar(s: str) -> str:
    """Extract grammar tag from German entry: Noun/Verb/Adjective/Adverb/Other."""
    if re.search(r'\{[mfn]\}|\{[mfn]pl\}|\{[mfn],', s):
        return "Noun"
    if re.search(r'\{v[it]?\}|\bvt\b|\bvi\b', s):
        return "Verb"
    if re.search(r'\{adj\}', s):
        return "Adjective"
    if re.search(r'\{adv\}', s):
        return "Adverb"
    return "Other"


def _extract_noun_gender(s: str) -> str:
    m = re.search(r'\{([mfn])\}', s)
    return m.group(1) if m else ""


def parse_de_en(path: str) -> dict[str, dict]:
    """
    Returns {german_lemma_lower: {word, type, gender, meanings_en: []}}
    Parses the TU-Chemnitz ding format:
      German {grammar} | alt :: English | alt_en
    """
    result: dict[str, dict] = {}

    def _open(p):
        if p.endswith(".gz"):
            return gzip.open(p, "rt", encoding="utf-8", errors="replace")
        return open(p, encoding="utf-8", errors="replace")

    with _open(path) as f:
        for line in f:
            if line.startswith("#") or "::" not in line:
                continue
            de_part, en_part = line.strip().split("::", 1)
            # Take only first German form (before first |)
            de_first = de_part.split("|")[0].strip()
            # Take only first English form (before first |)
            en_first = en_part.split("|")[0].strip()
            en_first = _clean_de_term(en_first)
            if not en_first:
                continue

            gram = _extract_grammar(de_first)
            gender = _extract_noun_gender(de_first)
            clean_de = _clean_de_term(de_first)
            if not clean_de:
                continue
            # For nouns, clean might be "das Haus" or just "Haus"
            # Strip leading articles
            m = re.match(r'^(?:der|die|das|ein|eine)\s+(.+)', clean_de, re.I)
            if m:
                clean_de = m.group(1).strip()
            key = clean_de.lower()
            if key not in result:
                result[key] = {
                    "word":       clean_de,
                    "type":       gram,
                    "gender":     gender,
                    "meanings_en": [],
                }
            # Clean English meaning
            en_clean = en_first.strip(" .")
            if en_clean and en_clean not in result[key]["meanings_en"]:
                result[key]["meanings_en"].append(en_clean)

    return result


# ─────────────────────────── LEVEL ASSIGNMENT ──────────────────────────────────

def assign_level(rank: int, in_goethe_b1: bool) -> str | None:
    if rank <= 600:
        return "A1"
    if rank <= 1500:
        return "A2"
    if rank <= 3500 or in_goethe_b1:
        return "B1"
    if rank <= 7000:
        return "B2"
    return None


# ─────────────────────────── EXAMPLE SENTENCES ─────────────────────────────────

# Small set of hand-crafted example sentences for common verbs/nouns
EXAMPLES: dict[str, str] = {
    "sein":  "Ich bin Student.",
    "haben": "Sie hat ein Buch.",
    "werden": "Er wird Arzt.",
    "können": "Kannst du mir helfen?",
    "müssen": "Ich muss jetzt gehen.",
    "gehen": "Wir gehen in die Schule.",
    "kommen": "Er kommt aus Deutschland.",
    "machen": "Was machst du?",
    "sagen": "Was sagst du?",
    "sehen": "Ich sehe das Haus.",
    "geben": "Gib mir bitte das Buch.",
    "wohnen": "Ich wohne in Berlin.",
    "arbeiten": "Sie arbeitet in einem Büro.",
    "lernen": "Wir lernen Deutsch.",
    "sprechen": "Sprichst du Englisch?",
    "essen": "Was isst du zum Frühstück?",
    "trinken": "Ich trinke gerne Kaffee.",
    "kaufen": "Wo kann ich das kaufen?",
    "Mann": "Der Mann heißt Thomas.",
    "Frau": "Die Frau arbeitet als Ärztin.",
    "Kind": "Das Kind spielt im Garten.",
    "Haus": "Wir wohnen in einem großen Haus.",
    "Auto": "Das Auto ist rot.",
    "Schule": "Die Schule beginnt um acht Uhr.",
    "Arbeit": "Die Arbeit macht Spaß.",
    "Tag": "Einen schönen Tag!",
    "gut": "Das Essen ist sehr gut.",
    "groß": "Berlin ist eine große Stadt.",
    "klein": "Das Zimmer ist klein.",
    "neu": "Ich habe ein neues Buch.",
}


# ─────────────────────────── JS BUILDER ────────────────────────────────────────

JS_HEADER = """// AUTO-GENERATED by build_database.py — DO NOT EDIT MANUALLY
// Sources: FrequencyWords (CC-BY 4.0), TU-Chemnitz/ding (GPL v2),
//          FreeDict deu-tur (GPL), kennethsible/goethe-wortliste
(function () {
  if (!window._GS) window._GS = [];
  window._GS.push({
    WORD_BANK: [
"""

JS_FOOTER = """    ],  // end WORD_BANK
    VOCAB_CARDS: {}
  });
})();
"""

JS_HEADER_WITH_CARDS = """// AUTO-GENERATED by build_database.py — DO NOT EDIT MANUALLY
(function () {
  if (!window._GS) window._GS = [];
  window._GS.push({
    WORD_BANK: [
"""


def entry_to_js(e: dict, indent: int = 6) -> str:
    pad = " " * indent
    lines = [f"{pad}{{"]
    def esc(s): return str(s).replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")
    lines.append(f'{pad}  source:     "{esc(e["source"])}",')
    lines.append(f'{pad}  type:       "{esc(e["type"])}",')
    lines.append(f'{pad}  word:       "{esc(e["word"])}",')
    lines.append(f'{pad}  meaning_en: "{esc(e["meaning_en"])}",')
    lines.append(f'{pad}  meaning_tr: "{esc(e["meaning_tr"])}",')
    lines.append(f'{pad}  meaning_fa: "{esc(e["meaning_fa"])}",')
    lines.append(f'{pad}  cases:      {json.dumps(e.get("cases", {}), ensure_ascii=False)},')
    lines.append(f'{pad}  plural:     "{esc(e.get("plural", ""))}",')
    lines.append(f'{pad}  level:      "{esc(e["level"])}",')
    lines.append(f'{pad}  example:    "{esc(e.get("example", ""))}",')
    lines.append(f"{pad}}},")
    return "\n".join(lines)


import random as _random

def _pick_distractors(correct_word: str, same_type_words: list[str], n: int = 3) -> list[str]:
    """Pick n distinct wrong-answer German words of the same type."""
    candidates = [w for w in same_type_words if w != correct_word]
    _random.shuffle(candidates)
    return candidates[:n]


def build_vocab_cards(entries: list[dict], level: str) -> list[dict]:
    """Generate vocab quiz cards — each card has 4 choices."""
    _random.seed(42)  # reproducible
    pool = [e for e in entries if e["level"] == level]
    # Index words by type for distractor selection
    by_type: dict[str, list[str]] = {}
    for e in pool:
        by_type.setdefault(e["type"], []).append(e["word"])

    # Pick up to 40 cards spread evenly through the pool
    step = max(1, len(pool) // 40)
    chosen = pool[::step][:40]

    cards = []
    for e in chosen:
        if e["type"] not in ("Noun", "Verb", "Adjective"):
            continue
        distractors = _pick_distractors(e["word"], by_type.get(e["type"], []))
        if len(distractors) < 3:
            # fall back to any words
            distractors = _pick_distractors(e["word"], [x["word"] for x in pool])
        choices = [e["word"]] + distractors[:3]

        if e["type"] == "Noun":
            q_en = f'What is the German word for "{e["meaning_en"]}"?'
            q_tr = f'"{e["meaning_en"]}" için Almanca kelime nedir?'
            q_fa = f'کلمه آلمانی برای "{e["meaning_en"]}" چیست؟'
        elif e["type"] == "Verb":
            q_en = f'Which verb means "{e["meaning_en"]}"?'
            q_tr = f'"{e["meaning_en"]}" anlamına gelen fiil hangisi?'
            q_fa = f'کدام فعل به معنی "{e["meaning_en"]}" است؟'
        else:
            q_en = f'Which word means "{e["meaning_en"]}"?'
            q_tr = f'"{e["meaning_en"]}" anlamına gelen kelime hangisi?'
            q_fa = f'کدام کلمه به معنی "{e["meaning_en"]}" است؟'

        card = {
            "source":    e["source"],
            "badgeType": e["type"].lower(),
            "badgeLabel": level,
            "question": {"en": q_en, "tr": q_tr, "fa": q_fa},
            "main":     e["word"],
            "sub":      {"en": e["meaning_en"], "tr": e["meaning_tr"], "fa": e["meaning_fa"]},
            "answer":   e["word"],
            "choices":  choices,
        }
        cards.append(card)
    return cards


def cards_to_js(cards: list[dict], level: str, indent: int = 6) -> str:
    pad = " " * indent
    lines = [f'      "{level}": [']
    for c in cards:
        lines.append(f"{pad}  {{")
        def esc(s): return str(s).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}    source:    "{esc(c["source"])}",')
        lines.append(f'{pad}    badgeType: "{esc(c["badgeType"])}",')
        lines.append(f'{pad}    badgeLabel:"{esc(c["badgeLabel"])}",')
        lines.append(f'{pad}    question:  {json.dumps(c["question"], ensure_ascii=False)},')
        lines.append(f'{pad}    main:      "{esc(c["main"])}",')
        lines.append(f'{pad}    sub:       {json.dumps(c["sub"], ensure_ascii=False)},')
        lines.append(f'{pad}    answer:    "{esc(c["answer"])}",')
        lines.append(f'{pad}    choices:   {json.dumps(c["choices"], ensure_ascii=False)},')
        lines.append(f"{pad}  }},")
    lines.append(f"      ],")
    return "\n".join(lines)


# ─────────────────────────── MAIN ──────────────────────────────────────────────

def main():
    print("=" * 60)
    print("German Vocabulary Database Builder")
    print("=" * 60)

    # 1. Download
    print("\n[1/5] Downloading raw data...")
    for key in URLS:
        download_file(key)

    # 2. Parse
    print("\n[2/5] Parsing frequency list...")
    freq = parse_frequency(FILES["frequency"])
    print(f"  {len(freq):,} frequency entries loaded")

    print("[2/5] Parsing Goethe B1 word list...")
    goethe_b1 = parse_goethe_b1(FILES["goethe_b1"])
    print(f"  {len(goethe_b1):,} B1 lemmas loaded")

    print("[2/5] Parsing German-Turkish dictionary...")
    de_tur = parse_de_tur(FILES["de_tur"])
    print(f"  {len(de_tur):,} German-Turkish entries loaded")

    print("[2/5] Parsing TU-Chemnitz German-English dictionary (large, please wait)...")
    de_en = parse_de_en(FILES["de_en"])
    print(f"  {len(de_en):,} German-English entries loaded")

    # 3. Build entries
    print("\n[3/5] Building word entries...")
    SOURCE = "TU-Chemnitz / FreeDict / FrequencyWords"
    all_entries: list[dict] = []
    seen: set[str] = set()

    for word_lower, rank in sorted(freq.items(), key=lambda x: x[1]):
        if rank > 8000:
            break
        in_b1  = word_lower in goethe_b1
        level  = assign_level(rank, in_b1)
        if level is None:
            continue

        # Look up in de_en
        de_info = de_en.get(word_lower)
        if de_info is None:
            # Try with capital (noun)
            de_info = de_en.get(word_lower.capitalize())
        if de_info is None:
            continue

        # Deduplicate
        canon = word_lower
        if canon in seen:
            continue
        seen.add(canon)

        # English meaning
        meanings_en = de_info["meanings_en"]
        if not meanings_en:
            continue
        meaning_en = "; ".join(meanings_en[:3])  # take up to 3

        # Turkish meaning
        tur_list = de_tur.get(word_lower) or de_tur.get(word_lower.capitalize()) or []
        meaning_tr = "; ".join(tur_list[:3]) if tur_list else ""

        # Persian meaning
        meaning_fa = FA_SEED.get(de_info["word"], "") or FA_SEED.get(word_lower, "")

        # Determine display word: prefer capitalized noun, else freq-list word
        display_word = de_info["word"]

        entry = {
            "source":     SOURCE,
            "type":       de_info["type"] if de_info["type"] != "Other" else "Other",
            "word":       display_word,
            "meaning_en": meaning_en,
            "meaning_tr": meaning_tr,
            "meaning_fa": meaning_fa,
            "cases":      {},
            "plural":     "",
            "level":      level,
            "example":    EXAMPLES.get(display_word, EXAMPLES.get(word_lower, "")),
        }
        all_entries.append(entry)

    # Sort by level order then alphabetical
    level_order = {"A1": 0, "A2": 1, "B1": 2, "B2": 3}
    all_entries.sort(key=lambda e: (level_order.get(e["level"], 9), e["word"].lower()))

    counts = {lvl: sum(1 for e in all_entries if e["level"] == lvl) for lvl in ("A1","A2","B1","B2")}
    print(f"  A1: {counts['A1']}  A2: {counts['A2']}  B1: {counts['B1']}  B2: {counts['B2']}")
    print(f"  Total: {len(all_entries)} words")

    # 4. Write per-level JS files
    print("\n[4/5] Writing per-level JS files...")
    for level in ("A1", "A2", "B1", "B2"):
        level_entries = [e for e in all_entries if e["level"] == level]
        cards = build_vocab_cards(level_entries, level)
        out_path = os.path.join(OUT_DIR, f"{level.lower()}_words.js")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(f"// AUTO-GENERATED — {len(level_entries)} {level} words\n")
            f.write("// Sources: TU-Chemnitz/ding (GPL v2), FreeDict deu-tur (GPL), FrequencyWords (CC-BY 4.0)\n")
            f.write("(function () {\n")
            f.write("  if (!window._GS) window._GS = [];\n")
            f.write("  window._GS.push({\n")
            f.write("    WORD_BANK: [\n")
            for e in level_entries:
                f.write(entry_to_js(e))
                f.write("\n")
            f.write("    ],\n")
            f.write("    VOCAB_CARDS: {\n")
            f.write(cards_to_js(cards, level))
            f.write("\n    }\n")
            f.write("  });\n")
            f.write("})();\n")
        print(f"  Wrote {out_path} ({len(level_entries)} words, {len(cards)} cards)")

    # 5. Write full dictionary file (all levels + extras up to rank 15000)
    print("\n[5/5] Writing full dictionary file...")
    dict_entries = list(all_entries)  # start with CEFR words

    # Add beyond-B2 words from de_en (rank 7001–20000) for dictionary search
    for word_lower, rank in sorted(freq.items(), key=lambda x: x[1]):
        if rank <= 7000 or rank > 20000:
            continue
        if word_lower in seen:
            continue
        de_info = de_en.get(word_lower) or de_en.get(word_lower.capitalize())
        if not de_info or not de_info["meanings_en"]:
            continue
        seen.add(word_lower)
        meaning_en = "; ".join(de_info["meanings_en"][:3])
        tur_list = de_tur.get(word_lower) or de_tur.get(word_lower.capitalize()) or []
        meaning_tr = "; ".join(tur_list[:3]) if tur_list else ""
        meaning_fa = FA_SEED.get(de_info["word"], "")
        dict_entries.append({
            "source":     SOURCE,
            "type":       de_info["type"] if de_info["type"] != "Other" else "Other",
            "word":       de_info["word"],
            "meaning_en": meaning_en,
            "meaning_tr": meaning_tr,
            "meaning_fa": meaning_fa,
            "cases":      {},
            "plural":     "",
            "level":      "C1",   # beyond CEFR scope → use C1 as "dictionary" marker
            "example":    "",
        })

    dict_entries.sort(key=lambda e: e["word"].lower())
    dict_path = os.path.join(DICT_DIR, "dictionary.js")
    with open(dict_path, "w", encoding="utf-8") as f:
        f.write(f"// AUTO-GENERATED — {len(dict_entries)} total dictionary entries\n")
        f.write("// Sources: TU-Chemnitz/ding (GPL v2), FreeDict deu-tur (GPL), FrequencyWords (CC-BY 4.0)\n")
        f.write("(function () {\n")
        f.write("  if (!window._GS) window._GS = [];\n")
        f.write("  window._GS.push({\n")
        f.write("    WORD_BANK: [\n")
        for e in dict_entries:
            f.write(entry_to_js(e))
            f.write("\n")
        f.write("    ],\n")
        f.write("    VOCAB_CARDS: {}\n")
        f.write("  });\n")
        f.write("})();\n")
    print(f"  Wrote {dict_path} ({len(dict_entries)} entries)")

    print("\n✅ Done! Summary:")
    for level in ("A1", "A2", "B1", "B2"):
        print(f"   {level}: {counts[level]} words")
    print(f"   Dictionary: {len(dict_entries)} entries total")
    print("\nNext steps:")
    print("  1. Add script tags to german_vocab_gamehtml.html")
    print("  2. Run loader.js last to merge all data into APP_DATA")


if __name__ == "__main__":
    main()

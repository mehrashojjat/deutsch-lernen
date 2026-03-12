#!/usr/bin/env python3
"""
Assigns difficulty (1=easy, 2=medium, 3=hard) to B1-level German vocabulary.
Criteria (relative to B1):
  1 = easy: very frequent, common even at A1/A2, basic vocabulary
  2 = medium: typical B1 vocabulary, moderate complexity
  3 = hard: administrative, abstract, technical, compound, less common
Distribution target: roughly even thirds (~1424 each of 4272 words).
Heuristic fallback: <=5 chars -> 1, 6-8 chars -> 2, >=9 chars -> 3
"""
import csv

OVERRIDES = {

    # ---- ABBREVIATIONS ----
    'Abo': 2, 'Akku': 2, 'Azubi': 2, 'EG': 1,

    # ---- ANGLIZISMEN ----
    'Baby': 1, 'Babysitter': 2, 'Band': 2, 'Camp': 2,
    'übergeordneten': 3, 'Smartphone': 2, 'Song': 2, 'Swimmingpool': 3,

    # ---- ANWEISUNGSSPRACHE ----
    'Aufgabe': 2, 'ankreuzen': 2, 'Antwortbogen': 3, 'Anzeige': 2,
    'richtig': 1, 'Durchsage': 3, 'Einleitung': 3, 'Folie': 1,
    'Hilfsmittel': 3, 'Kommentar': 2, 'lösen': 2, 'Moderator': 3,
    'Modul': 2, 'Präsentation': 3, 'Punkt': 1, 'Rückmeldung': 3,
    'Struktur': 3, 'Textaufbau': 3, 'übertragen': 3, 'zuordnen': 3,

    # ---- HIMMELSRICHTUNGEN ----
    'Norden': 2, 'Osten': 2, 'Süden': 2, 'Westen': 2, '-östlich': 3,
    'Deutsche': 1, 'Europa': 1, 'Europäerin': 3, 'europäisch': 3,
    'Österreicher': 3, 'Österreich': 2,

    # ---- JAHRESZEITEN ----
    'Frühling': 2, 'Sommer': 1,

    # ---- LÄNDER ----
    'Türkei': 2, 'Ukraine': 2, 'Ukrainer': 3,

    # ---- MONATE ----
    'Januar': 2, 'Februar': 3,

    # ---- POLITISCHE BEGRIFFE ----
    'Bund': 2, 'Bundeskanzler': 3, 'Bundeskanzlerin': 3,
    'Bundespräsident': 3, 'Bundespräsidentin': 3,
    'Bürgermeister': 3, 'Bürgermeisterin': 3,
    'Ministerin': 3, 'Parlament': 3, 'Partei': 3, 'Staat': 2,

    # ---- TAGESZEITEN ----
    'Tag': 1, 'Morgen': 1, 'morgen': 1, 'Mittag': 2,

    # ---- TIERE ----
    'Affe': 2,

    # ---- UHRZEIT ----
    'zehn': 1, 'halb': 1,

    # ---- WÄHRUNGEN ----
    'Bankwesen': 3,

    # ---- WOCHENTAGE ----
    'Wochentag': 3, 'Wochenende': 3, 'Dienstag': 3, 'Mittwoch': 2,

    # ---- ZEITANGABEN ----
    'Sekunde': 2, 'Minute': 1, 'stündlich': 3,

    # ============================================================
    # CAT2 (6-8 chars) -> difficulty 1  (very common basic words)
    # ============================================================
    'machen': 1,    # 14 rows
    'lassen': 1,    # 11 rows
    'können': 1,    # 9 rows
    'kommen': 1,    # 6 rows
    'wirklich': 1,  # 4 rows

    # ============================================================
    # CAT3 (>=9 chars) -> difficulty 1  (extremely common)
    # ============================================================
    'besonders': 2,   # 5 rows - common but complex enough for 2
    'natürlich': 1,   # very frequent

    # ============================================================
    # CAT3 (>=9 chars) -> difficulty 2  (common but long)
    # ============================================================
    'vergessen': 2,   # 6 rows - very common B1 verb
    'kostenlos': 2,   # 3 rows - common adjective
    'einkaufen': 2,   # common separable verb

    # ============================================================
    # CAT2 (6-8 chars) -> difficulty 3  (admin/abstract/technical)
    # ============================================================

    # -- A --
    'Absicht': 3, 'Antrag': 3, 'Auftrag': 3, 'Ausdruck': 3,
    'Auftritt': 3, 'Ausweis': 3, 'Aktion': 3, 'Alltag': 3,
    'Appetit': 3, 'Aprikose': 3, 'abwärts': 3, 'aufwärts': 3,

    # -- B --
    'Beamte': 3, 'Beamtin': 3, 'Bedarf': 3, 'Behörde': 3,
    'Beitrag': 3, 'Bereich': 3, 'Bescheid': 3, 'berühmt': 3,
    'Betrag': 3, 'Betrieb': 3, 'Biologie': 3, 'Buffet': 3,
    'Bürger': 3, 'Bürgerin': 3, 'beißen': 3, 'bremsen': 3,

    # -- C --
    'Cousin': 3, 'Cousine': 3,

    # -- D --
    'Denkmal': 3, 'Dessert': 3, 'Dialekt': 3, 'digital': 3,
    'Diplom': 3, 'Distanz': 3, 'Dokument': 3, 'Drogerie': 3,

    # -- E --
    'EC-Karte': 3, 'Ehepaar': 3, 'Einbruch': 3, 'Einfall': 3,
    'Einfluss': 3, 'einsam': 3, 'elegant': 3, 'Empfang': 3,
    'Energie': 3, 'Enkelin': 3, 'Ereignis': 3, 'Experte': 3,
    'extrem': 3,

    # -- F --
    'Fabrik': 3, 'Fahrzeug': 3, 'Faktor': 3, 'Fläche': 3,
    'Fieber': 3, 'Freiheit': 3, 'Friede': 3, 'Fundbüro': 3,
    'fürchten': 3,

    # -- G --
    'Galerie': 3, 'Garantie': 3, 'Gebäude': 3, 'Gebühr': 3,
    'Gebirge': 3, 'Gefühl': 3, 'Gehalt': 3, 'Gesetz': 3,
    'Gewalt': 3, 'Gewinn': 3, 'Gewissen': 3, 'Gewitter': 3,
    'giftig': 3, 'Grafik': 3, 'Grenze': 3, 'Grippe': 3,
    'gründen': 3,

    # -- H --
    'halbtags': 3, 'Handel': 3, 'handeln': 3, 'heimlich': 3,
    'Heimat': 3, 'Herkunft': 3, 'Hoffnung': 3,

    # -- I --
    'Imbiss': 3, 'Import': 3, 'Inserat': 3, 'Institut': 3,

    # -- J --
    'Jugend': 3,

    # -- K --
    'Kabine': 3, 'Kandidat': 3, 'Kantine': 3, 'Kapitel': 3,
    'Käuferin': 3, 'klagen': 3, 'Klinik': 3, 'kräftig': 3,
    'Kreuzung': 3, 'Kritik': 3, 'kritisch': 3, 'kündigen': 3,

    # -- L --
    'Ladung': 3, 'Laufwerk': 3, 'Lösung': 3,

    # -- M --
    'Magazin': 3, 'Mahnung': 3, 'Malerin': 3, 'männlich': 3,
    'Material': 3, 'Medizin': 3, 'Mehrheit': 3, 'Meister': 3,
    'Metall': 3, 'Metzger': 3, 'Mieter': 3, 'Mieterin': 3,
    'Migrant': 3, 'Mobilbox': 3, 'Modell': 3, 'Motorrad': 3,

    # -- N --
    'Nachteil': 3, 'Netzwerk': 3, 'Notfall': 3,

    # -- P --
    'Parfüm': 3, 'peinlich': 3, 'Pflaume': 3, 'Pflicht': 3,
    'Protest': 3, 'Prozess': 3, 'Prüfung': 3,

    # -- R --
    'Reaktion': 3, 'Realität': 3, 'Rechner': 3, 'Rechnung': 3,
    'Referat': 3, 'regional': 3, 'Reklame': 3, 'Rekord': 3,
    'Richter': 3,

    # -- S --
    'Saison': 3, 'Schalter': 3, 'Schinken': 3, 'Schuld': 3,
    'Schulden': 3, 'schuldig': 3, 'Schulter': 3, 'Schüssel': 3,
    'Sender': 3, 'Seminar': 3, 'Sendung': 3, 'siezen': 3,
    'sinnlos': 3, 'sinnvoll': 3, 'Sportart': 3, 'Spritze': 3,
    'stehlen': 3, 'Stempel': 3, 'Steuer': 3, 'Steuern': 3,
    'Störung': 3, 'Streik': 3, 'streiken': 3, 'Strumpf': 3,
    'Studie': 3, 'Student': 3, 'Studium': 3, 'stürzen': 3,
    'Symbol': 3, 'System': 3,

    # -- T --
    'Technik': 3, 'Teilzeit': 3, 'Theorie': 3, 'Therapie': 3,
    'tödlich': 3, 'Tourist': 3,

    # -- U --
    'Umtausch': 3, 'Urkunde': 3, 'Ursache': 3, 'Urteil': 3,

    # -- V --
    'Verbot': 3, 'verboten': 3, 'Verdacht': 3, 'Verein': 3,
    'Verlust': 3, 'Vertrag': 3, 'virtuell': 3, 'Vitamin': 3,
    'Vollzeit': 3, 'Vorwahl': 3,

    # -- W --
    'Wahrheit': 3, 'Wirkung': 3, 'Wohnsitz': 3,

    # -- Z --
    'Zahlung': 3, 'Zinsen': 3, 'Zufall': 3, 'Zukunft': 3,
    'Zustand': 3, 'Zweifel': 3, 'zweifeln': 3,

    # -- misc --
    'Gitarre': 3,

    # ============================================================
    # Additional CAT2 (6-8 chars) -> difficulty 3
    # ============================================================
    # Administrative/formal verbs:
    'abwesend': 3, 'abhängig': 3, 'abbiegen': 3, 'absagen': 3,
    'Absender': 3, 'absolut': 3,
    # B1 vocabulary nouns/adj:
    'Ansage': 3, 'Beratung': 3, 'Bewegung': 3, 'Dienst': 3,
    'Meinung': 3, 'Ordnung': 3, 'Stimmung': 3, 'Vortrag': 3,
    'Freizeit': 3, 'Leistung': 3, 'Bericht': 3, 'Beweis': 3,
    'Abteilung': 3, 'Ausbildung': 3, 'Ergebnis': 3,
}



def get_difficulty(word, word_type):
    w = word.strip()
    if w in OVERRIDES:
        return OVERRIDES[w]
    wl = len(w)
    if wl <= 5:
        return 1
    elif wl <= 8:
        return 2
    else:
        return 3


def main():
    input_file = '/home/user/deutsch-lernen/word_data/quiz_csv/b1.csv'
    rows = []
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        if header and header[-1] == 'difficulty':
            header = header[:-1]
        header.append('difficulty')
        rows.append(header)
        for row in reader:
            if len(row) == len(header):
                row = row[:-1]
            word = row[5] if len(row) > 5 else ''
            word_type = row[8] if len(row) > 8 else ''
            difficulty = get_difficulty(word, word_type)
            row.append(str(difficulty))
            rows.append(row)

    with open(input_file, 'w', encoding='utf-8', newline='') as f:
        csv.writer(f).writerows(rows)

    counts = {1: 0, 2: 0, 3: 0}
    for row in rows[1:]:
        d = int(row[-1])
        counts[d] = counts.get(d, 0) + 1
    total = sum(counts.values())
    print(f"Total: {total}")
    for d in [1, 2, 3]:
        pct = counts[d] / total * 100
        print(f"  Difficulty {d}: {counts[d]} ({pct:.1f}%)")


if __name__ == '__main__':
    main()

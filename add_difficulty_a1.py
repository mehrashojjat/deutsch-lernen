#!/usr/bin/env python3
"""Add difficulty column (1-3) to A1 German vocabulary CSV."""

import csv

# Comprehensive difficulty override table
# 1 = easy, 2 = medium, 3 = harder (within A1 level)
OVERRIDES = {
    # === Numbers ===
    'Zahlen': 1,
    'eins': 1, 'zwei': 1, 'drei': 1, 'vier': 1, 'fünf': 1, 'sechs': 1,
    'sieben': 1, 'acht': 1, 'neun': 1, 'zehn': 1, 'elf': 1, 'zwölf': 1,
    'dreizehn': 2, 'vierzehn': 2, 'fünfzehn': 2, 'sechzehn': 2, 'siebzehn': 2,
    'achtzehn': 2, 'neunzehn': 2, 'zwanzig': 2, 'dreißig': 2, 'vierzig': 2,
    'fünfzig': 2, 'sechzig': 2, 'siebzig': 2, 'achtzig': 2, 'neunzig': 2,
    'hundert': 2, 'hunderteins': 3, 'zweihundert': 3, 'tausend': 2,
    'Million': 3, 'Milliarde': 3,
    'einundzwanzig': 3,
    # Ordinals
    'erste': 2, 'zweite': 2, 'dritte': 2, 'vierte': 2,

    # === Time ===
    'halb': 1, 'Viertel': 2,
    'Uhrzeit': 2, 'Sekunde': 1, 'Minute': 1, 'Stunde': 1,
    'Zeitmaß': 3, 'Zeitangabe': 3,
    'Tag': 1, 'Woche': 1, 'Jahr': 1, 'Monat': 2,
    'Wochentag': 3, 'Monatsname': 3, 'Tageszeit': 3, 'Wochenende': 3,
    'Sonnabend': 2,
    'Morgen': 1, 'Vormittag': 2, 'Mittag': 1, 'Nachmittag': 2, 'Abend': 1, 'Nacht': 1,

    # Months
    'Januar': 2, 'Februar': 2, 'März': 1, 'April': 1, 'Mai': 1, 'Juni': 2,
    'Juli': 2, 'August': 2, 'September': 2, 'Oktober': 2, 'November': 2, 'Dezember': 2,

    # Seasons
    'Jahreszeit': 3, 'Frühling': 2, 'Frühjahr': 2, 'Sommer': 1, 'Herbst': 1, 'Winter': 1,

    # === Currency & Measures ===
    'Währung': 2, 'Euro': 1, 'Cent': 1,
    'Maß': 2, 'Gewicht': 2, 'Meter': 1, 'Zentimeter': 2, 'Kilometer': 2,
    'Quadratmeter': 3, 'Grad': 1, 'Prozent': 2, 'Liter': 1, 'Gramm': 1,
    'Pfund': 2, 'Kilogramm': 3,

    # === Countries & Nationalities ===
    'Land': 1, 'Ländername': 3, 'Nationalität': 3,
    'Deutschland': 2, 'Deutschen': 2, 'Europa': 2, 'Europäer': 3, 'europäisch': 3,

    # === Colors ===
    'Farbe': 1, 'schwarz': 1, 'grau': 1, 'blau': 1, 'grün': 1, 'weiß': 1,
    'rot': 1, 'gelb': 1, 'braun': 1,

    # === Compass directions ===
    'Himmelsrichtung': 3, 'Norden': 2, 'Süden': 2, 'Westen': 2, 'Osten': 2,

    # === A1 rebalance: words moved 2→3 for better distribution ===
    # Compound nouns / specific vocabulary
    'Bäckerei': 3, 'Brötchen': 3, 'Frühstück': 3, 'Gepäck': 3, 'Getränk': 3,
    'Hähnchen': 3, 'Kleidung': 3, 'Möbel': 3, 'Schrank': 3, 'Schinken': 3,
    'Zeitung': 3, 'Wohnung': 3,
    # Abstract / evaluative adjectives
    'gültig': 3, 'günstig': 3, 'lustig': 3, 'möglich': 3, 'ruhig': 3, 'wichtig': 3,
    # Abstract nouns
    'Blick': 3, 'Firma': 3, 'Größe': 3, 'Gruppe': 3, 'Heimat': 3,
    'Kollege': 3, 'Konto': 3, 'Moment': 3, 'Ordnung': 3, 'Pause': 3,
    'Prüfung': 3, 'Raum': 3, 'Sprache': 3, 'Stelle': 3, 'Termin': 3, 'Thema': 3,
    'Urlaub': 3,
    # Evaluative / adverbial
    'leider': 3, 'wichtig': 3, 'herzlich': 3,
    # Complex verbs
    'benutzen': 3,
    # Less common / formal
    'Kiosk': 3, 'Partner': 3, 'Partnerin': 3, 'Kurs': 3,
    # Days of week (heuristic fallback fixes)
    'Montag': 1, 'Dienstag': 2, 'Mittwoch': 2, 'Donnerstag': 2, 'Freitag': 1,
    'Samstag': 1, 'Sonntag': 1, 'Anfang': 2, 'zwischen': 2,
    # Additional 2→3 moves for balance
    'Gemüse': 3, 'Hilfe': 3, 'hinten': 3, 'Koffer': 3,
    'Maschine': 3, 'Miete': 3, 'mieten': 3, 'seit': 3, 'sofort': 3,
    'Schild': 3, 'stellen': 3, 'bezahlen': 3, 'bestellen': 3, 'besuchen': 3,
    'Beruf': 3, 'Lokal': 3, 'Lkw': 3, 'Flasche': 3,
    # 1→2 moves for balance (less basic than pure beginner words)
    'Arzt': 2, 'Jacke': 2, 'Job': 2, 'Foto': 2, 'Film': 2,
    'Fisch': 2, 'Eltern': 2, 'Garten': 2, 'bald': 2, 'Feuer': 2,
    # Further 2→3 moves for balance
    'Apartment': 3, 'Appetit': 3, 'Datum': 3, 'Drucker': 3, 'drücken': 3,
    'Dusche': 3, 'duschen': 3, 'fremd': 3, 'freuen': 3, 'Handy': 3,
    'Herd': 3, 'kriegen': 3, 'Lied': 3, 'Schüler': 3, 'sitzen': 3,
    'Satz': 3, 'Ecke': 3, 'daneben': 3, 'Bogen': 3, 'normal': 3,

    # === A ===
    'ab': 1, 'aber': 1, 'abfahren': 3, 'Abfahrt': 3,
    'abgeben': 3, 'abholen': 3, 'Absender': 3, 'Achtung': 2, 'Adresse': 2,
    'all-': 2, 'allein': 2, 'also': 1, 'alt': 1, 'Alter': 2,
    'an': 1, 'anbieten': 3, 'Angebot': 2, 'ander-': 2, 'anfangen': 3,
    'anklicken': 3, 'ankommen': 3, 'Ankunft': 3, 'ankreuzen': 3, 'anmachen': 3,
    'anmelden': 3, 'Anrede': 3, 'anrufen': 3, 'Anruf': 2, 'Anruf-': 2,
    'Ansage': 3, 'Anschluss': 3, 'an sein': 3, 'antworten': 2, 'Antwort': 2,
    'Anzeige': 3, 'anziehen': 3, 'Apfel': 1,
    'arbeiten': 2, 'Arbeit': 2, 'arbeitslos': 3, 'Arbeitsplatz': 3,
    'Arm': 1, 'auch': 1, 'auf': 1, 'Aufgabe': 3, 'aufhören': 3,
    'auf sein': 3, 'aufstehen': 3, 'Aufzug': 3, 'Auge': 1, 'aus': 1,
    'Ausflug': 3, 'ausfüllen': 3, 'Ausgang': 3, 'Auskunft': 3, 'Ausland': 3,
    'Ausländer': 3, 'ausländisch': 3, 'ausmachen': 3, 'Aussage': 3, 'aussehen': 3,
    'aus sein': 3, 'aussteigen': 3, 'Ausweis': 3, 'ausziehen': 3,
    'Autobahn': 3, 'Automat': 3, 'automatisch': 3,

    # === B ===
    'Baby': 1, 'Bad': 1, 'baden': 2, 'Bahn': 1, 'Bahnhof': 2,
    'Bahnsteig': 3, 'Balkon': 2, 'Banane': 1, 'Bank': 1, 'bar': 2,
    'Bauch': 1, 'Baum': 1, 'Beamte': 3, 'bedeuten': 3, 'beginnen': 2,
    'bei': 1, 'beide': 2, 'Bein': 1, 'Beispiel': 2, 'bekannt': 2, 'bekommen': 2,
    'besetzt': 2, 'besichtigen': 3, 'besser': 2,
    'best-': 2, 'Bett': 1,
    'Bier': 1, 'Bild': 1, 'billig': 2, 'Birne': 2, 'bis': 1, 'bisschen': 2,
    'bitte': 1, 'Bitte': 1, 'bitten': 2, 'bitter': 2, 'bleiben': 2, 'Bleistift': 3,
    'Blume': 1, 'böse': 2, 'brauchen': 2, 'breit': 2,
    'Brief': 2, 'Briefmarke': 3, 'bringen': 2, 'Brot': 1,
    'Bruder': 1, 'Buch': 1, 'Buchstabe': 3, 'buchstabieren': 3, 'Bus': 1, 'Butter': 1,

    # === C ===
    'Café': 1, 'CD': 1, 'Chef': 1, 'circa': 2, 'ca.': 2, 'Computer': 2,

    # === D ===
    'da': 1, 'Dame': 2, 'danken': 2, 'Dank': 1, 'danke': 1,
    'dann': 1, 'dauern': 2, 'dein-': 2, 'denn': 2, 'der': 1, 'die': 1,
    'das': 1, 'dich': 1, 'dies-': 1, 'dir': 1, 'Disco': 2, 'Doktor': 2,
    'Doppelzimmer': 3, 'Dorf': 2, 'dort': 1, 'draußen': 2, 'drucken': 2,
    'durch': 1, 'Durchsage': 3, 'dürfen': 2,
    'Durst': 2,

    # === E ===
    'Ehefrau': 3, 'Ehemann': 3, 'Ei': 1, 'eilig': 2, 'ein-': 1,
    'einfach': 2, 'Eingang': 2, 'einkaufen': 3, 'einladen': 3, 'Einladung': 3,
    'einmal': 2, 'einsteigen': 3, 'Eintritt': 3, 'Einzelzimmer': 3,
    'E-Mail': 2, 'Empfänger': 3, 'empfehlen': 3, 'enden': 2, 'Ende': 2,
    'entschuldigen': 3, 'Entschuldigung': 3, 'er': 1, 'Ergebnis': 3, 'erklären': 3,
    'erlauben': 3, 'Erwachsene': 3, 'erzählen': 3, 'es': 1, 'essen': 1,
    'Essen': 1, 'euer': 2,

    # === F ===
    'fahren': 1, 'Fahrer': 2, 'Fahrkarte': 3, 'Fahrrad': 3, 'falsch': 2,
    'Familie': 1, 'Familienname': 3, 'Familienstand': 3, 'Fax': 2,
    'Feierabend': 3, 'Feiertag': 3, 'feiern': 2, 'fehlen': 2, 'Fehler': 2,
    'fernsehen': 3, 'fertig': 2, 'Fieber': 2,
    'finden': 1, 'Fleisch': 2,
    'fliegen': 2, 'abfliegen': 3, 'Abflug': 3, 'Flughafen': 3, 'Flugzeug': 3,
    'Formular': 3, 'fragen': 1, 'Frage': 1, 'Frau': 1, 'frei': 1,
    'Freizeit': 3, 'Freund': 1, 'früher': 2,
    'frühstücken': 3, 'Führung': 3, 'für': 1, 'Fuß': 1, 'Fußball': 2,

    # === G ===
    'Gast': 2, 'geben': 1, 'geboren': 2, 'Geburtsjahr': 3,
    'Geburtsort': 3, 'Geburtstag': 3, 'gefallen': 2, 'gegen': 2, 'gehen': 1,
    'gehören': 2, 'Geld': 1, 'gerade': 2,
    'geradeaus': 3, 'gern': 2, 'Geschäft': 2, 'Geschenk': 2, 'Geschwister': 3,
    'Gespräch': 3, 'gestern': 2, 'gestorben': 3, 'Gewicht': 2,
    'gewinnen': 2, 'Glas': 1, 'glauben': 2, 'gleich': 2, 'Gleis': 2,
    'Glück': 2, 'glücklich': 2, 'Glückwunsch': 3, 'gratulieren': 3,
    'grillen': 2, 'groß': 1, 'Großeltern': 3, 'Großmutter': 3,
    'Großvater': 3, 'Gruß': 2, 'gut': 1,

    # === H ===
    'Haar': 1, 'haben': 1, 'Halbpension': 3, 'Halle': 2, 'hallo': 1,
    'halten': 2, 'Haltestelle': 3, 'Hand': 1, 'Haus': 1,
    'Hausaufgabe': 3, 'Hausfrau': 3, 'Hausmann': 3, 'heiraten': 2,
    'heißen': 2, 'helfen': 2, 'hell': 1, 'Herr': 1,
    'heute': 1, 'hier': 1, 'Hobby': 2, 'hoch': 1,
    'Hochzeit': 3, 'holen': 2, 'hören': 1, 'Hotel': 2, 'Hund': 1, 'Hunger': 2,

    # === I ===
    'ich': 1, 'ihr': 1, 'ihm': 1, 'ihn': 1, 'immer': 1, 'in': 1,
    'Information': 3, 'international': 3, 'Internet': 2,

    # === J ===
    'ja': 1, 'jed': 2, 'jetzt': 1, 'Jugendliche': 3,
    'jung': 1, 'Junge': 1,

    # === K ===
    'Kaffee': 1, 'kaputt': 2, 'Karte': 1, 'Kartoffel': 2, 'Kasse': 2, 'kaufen': 1,
    'kein': 1, 'kennen': 1, 'kennenlernen': 3, 'Kind': 1, 'Kindergarten': 3,
    'Kino': 1, 'klar': 1, 'Klasse': 2, 'klein': 1,
    'kochen': 2, 'kommen': 1, 'können': 1,
    'Kopf': 1, 'kosten': 2, 'krank': 1, 'Küche': 1, 'Kuchen': 1,
    'Kugelschreiber': 3, 'Kühlschrank': 3, 'kulturell': 3, 'kümmern': 3,
    'Kunde': 2, 'kurz': 1,

    # === L ===
    'lachen': 2, 'Laden': 2, 'lang': 1, 'lange': 2, 'langsam': 2,
    'laufen': 2, 'laut': 1, 'leben': 1, 'Leben': 2, 'Lebensmittel': 3, 'ledig': 2,
    'legen': 2, 'Lehrer': 1, 'leicht': 1, 'leise': 2, 'lernen': 1,
    'lesen': 1, 'letzt': 2, 'Leute': 1, 'Licht': 1, 'lieb': 1, 'lieben': 2,
    'lieber': 2, 'Lieblings-': 3, 'liegen': 2, 'links': 2,
    'Lösung': 3,

    # === M ===
    'machen': 1, 'Mädchen': 1, 'man': 1, 'Mann': 1, 'männlich': 3,
    'Meer': 1, 'mehr': 1, 'mein': 1, 'meist': 2, 'Mensch': 1,
    'Milch': 1, 'mit': 1, 'mitbringen': 3, 'mitkommen': 3,
    'mitmachen': 3, 'mitnehmen': 3, 'Mitte': 2, 'möchten': 1,
    'mögen': 2, 'morgen': 1, 'müde': 2, 'Mund': 1,
    'müssen': 1, 'Mutter': 1,

    # === N ===
    'nach': 1, 'nächst': 2, 'Name': 1, 'nehmen': 1, 'nein': 1, 'neu': 1,
    'nicht': 1, 'nichts': 2, 'nie': 1, 'noch': 1, 'Nummer': 1, 'nur': 1,

    # === O ===
    'oben': 2, 'Obst': 1, 'oder': 1, 'öffnen': 2, 'geöffnet': 2, 'oft': 1,
    'ohne': 1, 'Öl': 1, 'Oma': 1, 'Opa': 1, 'Ort': 2,

    # === P ===
    'Papier': 1, 'Papiere': 2, 'Party': 1,
    'Pass': 2, 'Platz': 1, 'Polizei': 2,
    'Pommes frites': 2, 'Post': 1, 'Postleitzahl': 3, 'Praktikum': 3, 'Praxis': 3,
    'Preis': 2, 'Problem': 2, 'Prospekt': 3, 'pünktlich': 3,

    # === R ===
    'Rad fahren': 3, 'rauchen': 2, 'Rechnung': 3, 'rechts': 2,
    'regnen': 2, 'Regen': 2, 'Reis': 1, 'reisen': 2, 'Reise': 2, 'Reisebüro': 3,
    'Reiseführer': 3, 'reparieren': 3, 'Reparatur': 3, 'Restaurant': 2,
    'Rezeption': 3, 'richtig': 2, 'riechen': 2,

    # === S ===
    'Saft': 1, 'sagen': 1, 'Salat': 1, 'Salz': 1, 'S-Bahn': 2,
    'Schalter': 3, 'scheinen': 2, 'schicken': 2,
    'schlafen': 1, 'schlecht': 1, 'schließen': 2, 'geschlossen': 2, 'Schluss': 2,
    'Schlüssel': 2, 'schmecken': 2, 'schnell': 1, 'schon': 1, 'schön': 1,
    'schreiben': 1, 'Schuh': 1, 'Schule': 1,
    'schwer': 2, 'Schwester': 1, 'schwimmen': 2, 'Schwimmbad': 3, 'See': 1,
    'sehen': 1, 'Sehenswürdigkeit': 3, 'sehr': 1, 'sein': 1,
    'selbstständig': 3, 'sich': 1, 'sie': 1, 'Sie': 1, 'so': 1,
    'Sofa': 1, 'Sohn': 1, 'sollen': 2, 'Sonne': 1, 'spät': 2,
    'später': 2, 'Speisekarte': 3, 'spielen': 1, 'Sport': 1,
    'sprechen': 1, 'Stadt': 1, 'stehen': 2, 'Stock': 2,
    'Straße': 1, 'Straßenbahn': 3, 'studieren': 3, 'Studium': 3, 'Student': 3,
    'Stunde': 1, 'suchen': 1,

    # === T ===
    'tanzen': 2, 'Tasche': 1, 'Taxi': 1, 'Tee': 1, 'Teil': 2, 'telefonieren': 3,
    'Telefon': 2, 'Test': 1, 'teuer': 2, 'Text': 2,
    'Ticket': 2, 'Tisch': 1, 'Tochter': 1, 'Toilette': 1, 'Tomate': 1, 'tot': 2,
    'treffen': 2, 'Treppe': 2, 'trinken': 1, 'tschüss': 1, 'tun': 1,

    # === U ===
    'über': 1, 'übernachten': 3, 'überweisen': 3, 'Uhr': 1, 'um': 1,
    'umziehen': 3, 'und': 1, 'unser': 2, 'unten': 2, 'unter': 1, 'Unterricht': 3,
    'unterschreiben': 3, 'Unterschrift': 3,

    # === V ===
    'Vater': 1, 'verboten': 3, 'verdienen': 3, 'Verein': 3, 'verheiratet': 3,
    'verkaufen': 2, 'Verkäufer': 3, 'vermieten': 3, 'Vermieter': 3, 'verstehen': 3,
    'Verwandte': 3, 'viel': 1, 'vielleicht': 2, 'von': 1, 'vor': 1, 'Vorname': 3,
    'Vorsicht': 3, 'vorstellen': 3, 'Vorwahl': 3,

    # === W ===
    'wandern': 2, 'wann': 1, 'warten': 2, 'warum': 1, 'was': 1, 'was für ein': 2,
    'waschen': 2, 'Wasser': 1, 'weh tun': 2, 'weiblich': 3, 'Wein': 1, 'weit': 2,
    'weiter': 2, 'welch': 2, 'Welt': 1, 'wenig': 2, 'wer': 1, 'werden': 2,
    'Wetter': 1, 'wie': 1, 'wiederholen': 3, 'Wiederhören': 3,
    'Wiedersehen': 3, 'wie viel': 2, 'willkommen': 3, 'Wind': 1, 'wir': 1,
    'wissen': 2, 'wo': 1, 'woher': 2, 'wohin': 2, 'wohnen': 1,
    'wollen': 1, 'Wort': 1, 'wunderbar': 2,

    # === Z ===
    'zahlen': 2, 'Zeit': 1, 'zurzeit': 2, 'Zigarette': 2, 'Zimmer': 1,
    'Zoll': 3, 'zu': 1, 'zufrieden': 3, 'Zug': 1, 'zurück': 2, 'zusammen': 2,
}


def get_difficulty(word, word_type):
    """Return difficulty 1-3 for a German word."""
    w = word.strip()

    # Exact override
    if w in OVERRIDES:
        return OVERRIDES[w]

    # Heuristic fallback based on length
    wl = len(w)
    if wl <= 4:
        return 1
    elif wl <= 7:
        return 2
    else:
        return 3


def main():
    input_file = '/home/user/deutsch-lernen/word_data/quiz_csv/a1.csv'

    rows = []
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        header.append('difficulty')
        rows.append(header)

        for row in reader:
            if len(row) >= 9:
                word = row[5]
                word_type = row[8]
            elif len(row) >= 6:
                word = row[5]
                word_type = ''
            else:
                rows.append(row)
                continue
            difficulty = get_difficulty(word, word_type)
            row.append(str(difficulty))
            rows.append(row)

    with open(input_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    # Report distribution
    dist = {1: 0, 2: 0, 3: 0}
    for row in rows[1:]:
        if row:
            try:
                d = int(row[-1])
                dist[d] = dist.get(d, 0) + 1
            except (ValueError, IndexError):
                pass
    total = sum(dist.values())
    print(f"Done! Total rows: {total}")
    print(f"  1 (easy):   {dist[1]:3d}  ({dist[1]/total*100:.1f}%)")
    print(f"  2 (medium): {dist[2]:3d}  ({dist[2]/total*100:.1f}%)")
    print(f"  3 (hard):   {dist[3]:3d}  ({dist[3]/total*100:.1f}%)")


if __name__ == '__main__':
    main()

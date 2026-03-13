#!/usr/bin/env python3
"""
Categorize German vocabulary from all_words.csv into 21 semantic categories.
Processes in batches of 300 rows, appends to categorized_words.csv,
updates categorization_progress.json, and commits after each batch.
"""

import csv, json, os, subprocess

# ── Output paths ────────────────────────────────────────────────────────────
BASE       = "/home/user/deutsch-lernen"
INPUT_CSV  = f"{BASE}/word_data/all_words.csv"
OUTPUT_CSV = f"{BASE}/word_data/categorized_words.csv"
PROGRESS   = f"{BASE}/word_data/categorization_progress.json"
SRC_DIR    = f"{BASE}/word_data/quiz_csv"
BATCH_SIZE = 300

# ── Approved categories ──────────────────────────────────────────────────────
CATEGORIES = [
    "Numbers & Quantities", "Time & Calendar", "Family & Relationships",
    "Body & Health", "Food & Drink", "Home & Living", "Clothing & Appearance",
    "Work & Careers", "Education & Learning", "Travel & Tourism",
    "Transportation", "Shopping & Finance", "Language, Communication & Media",
    "Nature, Weather & Animals", "Sports & Leisure", "Arts & Culture",
    "Technology & Devices", "Society, Law & Politics",
    "Emotions & Personal Traits", "Places & Geography", "Grammar & Core Verbs",
]

# ── Section → Category (named sections from source CSVs) ────────────────────
SECTION_CAT = {
    "zahlen":           "Numbers & Quantities",
    "masse":            "Numbers & Quantities",
    "zeitmaße":         "Numbers & Quantities",
    "waehrungen":       "Shopping & Finance",
    "monat":            "Time & Calendar",
    "monatsnamen":      "Time & Calendar",
    "woche":            "Time & Calendar",
    "tageszeiten":      "Time & Calendar",
    "uhrzeit":          "Time & Calendar",
    "jahreszeiten":     "Time & Calendar",
    "zeitangaben":      "Time & Calendar",
    "feiertage":        "Time & Calendar",
    "familienmitglieder":"Family & Relationships",
    "familienstand":    "Family & Relationships",
    "berufe":           "Work & Careers",
    "schule":           "Education & Learning",
    "bildungseinrichtungen":"Education & Learning",
    "schulnoten":       "Education & Learning",
    "laender":          "Places & Geography",
    "himmelsrichtungen":"Places & Geography",
    "farben":           "Grammar & Core Verbs",
    "tiere":            "Nature, Weather & Animals",
    "abkuerzungen":     "Language, Communication & Media",
    "anweisungssprache":"Language, Communication & Media",
    "anglizismen":      "Language, Communication & Media",
    "politische_begriffe":"Society, Law & Politics",
}

# ── Comprehensive word → category dictionary ─────────────────────────────────
W = {}  # will be populated below

def add(cat, *words):
    for w in words:
        W[w] = cat

# Numbers & Quantities
add("Numbers & Quantities",
    "eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn",
    "elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn",
    "achtzehn","neunzehn","zwanzig","einundzwanzig","dreißig","vierzig",
    "fünfzig","sechzig","siebzig","achtzig","neunzig","hundert","hunderteins",
    "zweihundert","tausend","zweitausendeins","Million","Milliarde",
    "Prozent","Anzahl","Zahl","Zahlen","zählen","Gramm","Kilogramm","Pfund",
    "Liter","Zentimeter","Meter","Kilometer","Quadratmeter","Grad","Maß",
    "Menge","Summe","Durchschnitt","Mehrheit","Minderheit","Rappen","Cent",
    "Distanz","Länge","Breite","Höhe","Tiefe","Fläche","Hälfte","Viertel",
    "Rest","Zeitmaß","Zeitangabe","Monatsname","statistisch","Statistik",
    "minimal","maximal","insgesamt","circa","ca.","zahlreich","mehrere","null",
    "einmal","zweimal","dreimal","viermal","Anteil","Ränge","Kilowatt",
    "dritte","vierte","erste","zweite","zwölfte","drittens","viertens",
    "erstens","zweitens","Zählen","Betrag","Gesamtzahl","Nummer",
)

# Time & Calendar
add("Time & Calendar",
    "Uhr","Uhrzeit","Minute","Sekunde","Stunde","Tag","Woche","Monat","Jahr",
    "Jahrzehnt","Jahrhundert","Tageszeit","Wochentag","Jahreszeit","Datum",
    "Zeitpunkt","Dauer","Augenblick","Moment","Januar","Februar","März",
    "April","Mai","Juni","Juli","August","September","Oktober","November",
    "Dezember","Montag","Dienstag","Mittwoch","Donnerstag","Freitag",
    "Samstag","Sonnabend","Sonntag","Morgen","Mittag","Nachmittag","Abend",
    "Nacht","Mitternacht","Frühling","Frühjahr","Sommer","Herbst","Winter",
    "Kalender","Frist","Termin","Terminkalender","Stundenplan","Werktag",
    "Arbeitstag","Feierabend","Feiertag","Wochenende","Zeit","Neujahr",
    "Silvester","Ostern","Weihnachten","Tagesablauf","Beginn","Anfang","Ende",
    "gestern","heute","vorgestern","übermorgen","früher","vorhin","nachher",
    "damals","inzwischen","mittlerweile","bisher","bald","sofort","täglich",
    "monatlich","wöchentlich","stündlich","jährlich","montags","dienstags",
    "mittwochs","donnerstags","freitags","samstags","sonntags","morgens",
    "mittags","nachmittags","abends","nachts","tagsüber","früh","spät",
    "pünktlich","rechtzeitig","Geburtsjahr","Jahrzahl","Karneval",
    "Ferien","Schulferien","Termin","morgen",
)

# Family & Relationships
add("Family & Relationships",
    "Familie","Mutter","Vater","Bruder","Schwester","Kind","Sohn","Tochter",
    "Großmutter","Großvater","Großeltern","Oma","Opa","Enkel","Enkelin",
    "Tante","Onkel","Neffe","Nichte","Cousin","Cousine","Eltern","Baby",
    "Geschwister","Verwandte","Angehörige","Familienmitglied","Ehemann",
    "Ehefrau","Ehepaar","Partner","Partnerin","Freund","Freundin","Bekannte",
    "Beziehung","Hochzeit","Scheidung","Trennung","Jugendliche","Mama","Papa",
    "Mädchen","Junge","Herr","Dame","Familien-","Familienname","Familienstand",
    "Personenstand","Nachwuchs","Kindheit","Jugend","Jugend-","Babysitter",
    "Senioren","Rentner","Rentnerin","Pensionist","Erwachsene","Generation",
    "Paar","heiraten","verheiratet","ledig","geschieden","Lebenspartner",
    "Freunden","Verwandtschaft","verloben","verwitwet","unverheiratet",
)

# Body & Health
add("Body & Health",
    "Körper","Kopf","Arm","Bein","Hand","Finger","Auge","Ohr","Mund","Nase",
    "Hals","Schulter","Rücken","Bauch","Herz","Haut","Haar","Bart","Lippe",
    "Muskel","Zahn","Knie","Atem","Krankheit","Gesundheit","Fieber","Grippe",
    "Erkältung","Husten","Schnupfen","Schmerz","Schmerzen","Verletzung",
    "Medikament","Pille","Tablette","Salbe","Spritze","Tropfen","Pflaster",
    "Operation","Therapie","Infektion","Virus","Arzt","Ärztin","Krankenhaus",
    "Klinik","Notaufnahme","Krankenpfleger","Krankenschwester","Krankenwagen",
    "Krankenkasse","Arztpraxis","Untersuchung","Rezept","Notfall","Patient",
    "Patientin","Doktor","Doktorin","Kranke","Diät","Ernährung","Vitamin",
    "Schmerzmittel","Wunde","Suchtmittel","Sucht","Zigarette","Raucherin",
    "Nichtraucher","Nichtraucherin","krank","gesund","verletzt","erkältet",
    "erschöpft","schwach","atmen","husten","bluten","schmerzen","operieren",
    "untersuchen","behandeln","Pflege","Pfleger","Pflegerin","Altenheim",
    "Altersheim","Blutder","Zahnbürste","Zahncreme / -pasta","Zahnpasta",
    "Kranken-","Arzt","schwanger","blind","taub","Erkältung","Impfung",
    "Schnupfen","Wunde","Verbände","Tropfen","Ärztinnen","erkältest",
    "gehustet","Sanitäter","Erste-Hilfe","Schmerzmittel",
)

# Food & Drink
add("Food & Drink",
    "Essen","Lebensmittel","Brot","Brötchen","Butter","Käse","Wurst",
    "Schinken","Fleisch","Hackfleisch","Fisch","Ei","Rind","Hähnchen",
    "Hähnchen / Hühnchen","Salat","Gemüse","Kartoffel","Tomate","Karotte",
    "Möhre","Zwiebel","Pilz","Bohne","Apfel","Birne","Banane","Aprikose",
    "Orange","Pflaume","Frucht","Obst","Milch","Kaffee","Tee","Saft","Bier",
    "Wein","Mineralwasser","Mineral-","Limonade","Kakao","Suppe","Kuchen",
    "Torte","Braten","Schnitzel","Nudel","Reis","Kloß","Pommes",
    "Pommes frites","Pizza","Snack","Dessert","Nachspeise","Mahlzeit",
    "Frühstück","Mittagessen","Appetit","Zucker","Salz","Mehl","Essig",
    "Margarine","Öl","Konfitüre","Soße / Sauce","Speisekarte","Menü",
    "Portion","Zutaten","Buffet","Durst","Hunger","Getränk","Getränke",
    "Restaurant","Café","Kaffeehaus","Kantine","Mensa","Gaststätte",
    "Gasthaus","Imbiss","Bordbistro","Speisewagen","Koch","Köchin","Bäcker",
    "Bäckerin","Bäckerei","Metzger","Metzgerin","Kellner","Kellnerin",
    "Teller","Tasse","Glas","Flasche","Topf","Pfanne","Messer","Gabel",
    "Löffel","Schüssel","Dose","Büchse","kochen","backen","braten",
    "schneiden","zubereiten","schmecken","riechen","essen","trinken",
    "frühstücken","servieren","grillen","lecker","salzig","süß","bitter",
    "sauer","scharf","Trinkgeld","Gebäck","Paradeiser","Mate","Geschirr",
    "Alkohol","Wasser","Dressing","Soße","bestellen","Ober",
)

# Home & Living
add("Home & Living",
    "Wohnung","Haus","Zimmer","Wohnzimmer","Küche","Bad","Schlafzimmer",
    "Keller","Dach","Balkon","Terrasse","Garten","Hof","Möbel","Bett","Sofa",
    "Sessel","Stuhl","Tisch","Schrank","Regal","Lampe","Spiegel","Teppich",
    "Decke","Fenster","Tür","Wand","Klingel","Herd","Kühl-","Kühlschrank",
    "Dusche","Badewanne","Steckdose","Stecker","Heizung","Klimaanlage",
    "Schlüssel","Briefkasten","Aufzug","Treppe","Flur","Etage","Stockwerk",
    "Erdgeschoss","EG","Haushalt","Miete","Hausmeister","Hausmeisterin",
    "Einrichtung","Treppenhaus","Apartment","Hausfrau","Hausmann","Wohnort",
    "Wohnsitz","Wohnungen","Vermieter","Vermieterin","Mieter","Mieterin",
    "Umzug","Fernbedienung","Waschmittel","Wäsche","Bürste","Nadel","Nagel",
    "Hammer","Zange","Müll","Müllabfuhr","Abfall","Abfalleimer","Reinigung",
    "Grundstück","Brunnen","wohnen","einrichten","renovieren","einziehen",
    "ausziehen","umziehen","putzen","waschen","aufräumen","staubsaugen",
    "Anlage","Lager","Gebäude","Zuhause","Heimat","Garderobe","Kamin",
    "Vase","Kerze","Topfpflanze","Staubsauger","Bügeleisen","Waschmaschine",
    "Werkzeug","Abfalleimer","Mülleimer","Loch","Schraube","Bohrmaschine",
    "Gartenschlauch","Kiste","Kasten","Sack","Tüte","Besen",
)

# Clothing & Appearance
add("Clothing & Appearance",
    "Kleidung","Kleid","Hose","Hemd","Bluse","Jacke","Mantel","Pullover",
    "Strumpf","Stiefel","Schuh","Jeans","Kostüm","Anzug","Hut","Mütze",
    "Ring","Kette","Schmuck","Brille","Kosmetik","Creme","Parfüm","Mode",
    "Größe","Farbe","Frisur","Friseur","Friseurin","Wolle","Stoff","Leder",
    "Kunststoff","anziehen","ausziehen","tragen","passen","nähen","bügeln",
    "elegant","modisch","Schal","Tasche","Gürtel","Krawatte","schminken",
    "rasieren","kämmen","Unterwäsche","Socke","Handschuh","Kleidergröße",
)

# Work & Careers
add("Work & Careers",
    "Arbeit","Beruf","Stelle","Job","Karriere","Ausbildung","Lehre","Lehrling",
    "Azubi","Auszubildende","Praktikum","Praktikant","Praktikantin","Bewerbung",
    "Lebenslauf","Gehalt","Lohn","Chef","Chefin","Kollege","Kollegin",
    "Abteilung","Firma","Betrieb","Werkstatt","Fabrik","Büro","Arbeitsplatz",
    "Arbeitsstelle","Arbeitslosigkeit","Arbeitserlaubnis","Kündigung","Rente",
    "Teilzeit","Vollzeit","Mitarbeiter","Mitarbeiterin","Angestellte","Beamte",
    "Beamtin","Handwerker","Handwerkerin","Mechaniker","Mechanikerin",
    "Ingenieur","Journalist","Journalistin","Lehrer","Lehrerin","Direktor",
    "Direktorin","Kursleiter","Verkäufer","Verkäuferin","Kaufmann","Kauffrau",
    "Fachmann","Fachfrau","Fachleute","Aushilfe","Sozialarbeiter",
    "Sozialarbeiterin","Anwältin","Polizist","Polizistin","Beratung",
    "Besprechung","Konferenz","Auftrag","Projekt","Vertrag","Streik",
    "Gewerkschaft","Betriebsrat","Betriebsrätin","Arbeiter","Arbeiterin",
    "Beschäftigung","Tätigkeit","arbeiten","kündigen","verdienen","einstellen",
    "entlassen","leiten","Vorstellungsgespräch","Überstunde","Qualifikation",
    "Weiterbildung","Fortbildung","Meister","Profi","Unternehmer",
    "Unternehmerin","Hersteller","Händler","Händlerin","Vertreter",
    "Vertreterin","Berater","Beraterin","Trainer","Trainerin","Maler",
    "Malerin","Musiker","Musikerin","Schauspieler","Schauspielerin","Fotograf",
    "Autor","Autorin","Schriftsteller","Schriftstellerin","Wissenschaftler",
    "Wissenschaftlerin","Professor","Experte","Spezialist","Spezialistin",
    "Lehrstelle","Personal","berufstätig","arbeitslos","Auftritt",
    "Serviceangestellte","Profisportlerin","Sportler","Sportlerin",
    "Manager","Führung","Personalien","Arbeitstag","Feierabend",
    "bewerben","Inserat","Annonce","Stellenangebot","Kursleiter",
    "Sozialkunde","Techniker","Technikerin","Experte",
)

# Education & Learning
add("Education & Learning",
    "Schule","Klasse","Klassenarbeit","Klassenfahrt","Fach","Schulfach",
    "Hausaufgabe","Hausaufgaben","Prüfung","Note","Zeugnis","Schüler",
    "Schülerin","Universität","Studium","Student","Studentin","Studierende",
    "Kurs","Intensivkurs","Heft","Stift","Bleistift","Kugelschreiber","Kuli",
    "Tafel","Bibliothek","Mathematik","Biologie","Chemie","Physik","Geografie",
    "Geschichte","Sozialkunde","Latein","Deutsch","Englisch","Französisch",
    "Fremdsprache","Muttersprache","Zweitsprache","Alphabet","Buchstabe",
    "Abitur","Diplom","Zertifikat","Seminar","Nachhilfe","Referat","Studie",
    "Modul","Semester","Lernerin","studieren","prüfen","unterrichten","üben",
    "wiederholen","Test","Quiz","Leistung","Kenntnisse","Theorie","Übung",
    "Wiederholung","Kindergarten","Stipen-","Bildung","Aufgabe","lernen",
    "Kursbuch","Lehrwerk","Lehrmittel","Stunde","Unterricht",
    "Nachhilfeunterricht","Hausarbeit","Stundenplan","Schulfach",
)

# Travel & Tourism
add("Travel & Tourism",
    "Urlaub","Ausflug","Rundfahrt","Rundgang","Sehenswürdigkeit","Sehens-",
    "Tourist","Touristin","Tourismus","Reisebüro","Reiseführer","Ausland",
    "Pass","Reservierung","Koffer","Gepäck","Stadtplan","Ticket","Führung",
    "Camp","Jugendherberge","Jugend-","Halbpension","Übernachtung","Rezeption",
    "reisen","verreisen","buchen","reservieren","Abenteuer","Unterkunft",
    "Hotel","Pension","Reise","Karte","einchecken",
)

# Transportation
add("Transportation",
    "Auto","Bus","Bahn","S-Bahn","U-Bahn","Straßenbahn","Tram","Zug","ICE",
    "Fahrrad","Motorrad","Lkw","Fahrzeug","Kraftfahrzeug","Taxi","Schiff",
    "Fähre","Flugzeug","Autobahn","Haltestelle","Gleis","Bahnsteig",
    "Einbahnstraße","Kreuzung","Ampel","Stau","Führerschein","Fahrplan",
    "Fahrkarte","Verspätung","Umleitung","Bremse","Motor","Reifen","Benzin",
    "Tankstelle","Garage","Fahrer","Fahrerin","Fahrt","Rückfahrt","Ausfahrt",
    "Einfahrt","Abfahrt","Ankunft","Abflug","Flughafen","Bahnhof","Hafen",
    "Rad fahren","Radfahrer","Radfahrerin","Fußgänger","Fußgängerin",
    "Fußgängerzone","Bürgersteig","Gehweg","Strecke","Entfernung","Richtung",
    "fahren","fliegen","ankommen","abfahren","abbiegen","parken","überholen",
    "bremsen","tanken","Verkehr","Verkehrsmittel","Transport","Stewardess",
    "Passagier","Passagierin","Durchsage","Zoll","Flug","losfahren",
    "umsteigen","einsteigen","aussteigen","Geschwindigkeits-","Tempo",
    "Lautsprecher","Ansage","Zug","Umweg","Strecke","Kfz","PKW","LKW",
    "Straße","Weg","Brücke","Tunnel","Ampel","Kreisverkehr","Vorfahrt",
)

# Shopping & Finance
add("Shopping & Finance",
    "Einkauf","Kaufhaus","Supermarkt","Markt","Laden","Geschäft","Drogerie",
    "Buchhandlung","Flohmarkt","Einkaufs-","Preis","Kosten","Gebühr","Betrag",
    "Rechnung","Quittung","Zahlung","Kasse","Bargeld","Münze","Geld","Euro",
    "Franken","Kreditkarte","EC-Karte","Girokonto","Chipkarte","Bank",
    "Bankleitzahl","Konto","Einzahlung","Überweisung","Geldautomat","Rabatt",
    "Sonderangebot","Angebot","Ware","Einkommen","Steuer","Steuern","Zinsen",
    "Währung","Schulden","Kredit","Taschengeld","Mahnung","Bankwesen",
    "Kunde","Kundin","Käuferin","Schaufenster","Ermäßigung","kaufen",
    "verkaufen","bezahlen","einkaufen","tauschen","wechseln","umtauschen",
    "sparen","teuer","billig","günstig","kostenlos","gratis","preiswert",
    "Ausgabe","Konsum","Portmonee","Geldbörse","Brieftasche","Kauf","Import",
    "Handel","zahlen","sparsam","Steuerklasse","Mehrwertsteuer","Pfand",
    "Kassenbon","Schlange","Sonderpreis","Einkaufszettel",
)

# Language, Communication & Media
add("Language, Communication & Media",
    "Telefon","Handy","Smartphone","Anruf","E-Mail","SMS","Brief","Post",
    "Fax","Internet","Webseite","Homepage","Nachricht","Sendung","Sender",
    "Absender","Absenderin","Empfänger","Adresse","Postleitzahl","Briefmarke",
    "Briefkasten","Briefumschlag","Gespräch","Kommunikation","Antwort",
    "Frage","Antrag","Formular","Anmeldung","Auskunft","Information",
    "Mitteilung","Meldung","Bericht","Interview","Reportage","Reporter",
    "Reporterin","Zeitung","Zeitschrift","Magazin","Presse","Artikel",
    "Anzeige","Inserat","Radio","Fernsehen","Fernseher","Kanal","Programm",
    "Medien","Anrufbeantworter","Mobilbox","Mobil-","Rufnummer","Vorwahl",
    "Neuigkeit","Kommentar","Diskussion","Forum","Blog","Chat","Link","Klick",
    "Online","telefonieren","chatten","mailen","senden","empfangen","anrufen",
    "zuhören","Einschreiben","Paket","Nachsenden","Publikum","Zuhörer",
    "Zuhörerin","Zuschauer","Zuschauerin","Hörer","Hörerin","Leser",
    "Leserin","Moderator","Sprache","Wort","Satz","Text","Aussprache",
    "Grammatik","Übersetzung","Übersetzer","Übersetzerin","Anrede",
    "Überschrift","Beschreibung","Erklärung","Anleitung","Wörterbuch",
    "Lexikon","Textaufbau","Einleitung","Abschnitt","Zeile","Kapitel",
    "Seite","Bogen","Blatt","Zeichen","Symbol","Abkürzung","Dialekt",
    "Akzent","Sprachkurs","Ausdrucksweise","Anweisungssprache",
    "buchstabieren","übersetzen","korrigieren","ergänzen","unterstreichen",
    "markieren","zuordnen","Werbung","Reklame","Broschüre","Prospekt",
    "Katalog","Annonce","Anruf-","Rückmeldung","Aussage","Antwortbogen",
    "dahinbuchstabieren","Nachrichten","Pressemitteilung","Flyer","Plakat",
    "Aushang","schreiben","lesen","hören","sprechen","Briefkopf",
    "Päckchen","Paketpost","Poststempel","Neuigkeiten","Meldung",
    "Nachricht","Empfangsbestätigung","Rückmeldung","Ansage","Infoblatt",
    "Anschreiben","Antragsformular","Formblatt","Stempel","Einschreiben",
)

# Nature, Weather & Animals
add("Nature, Weather & Animals",
    "Natur","Wetter","Sonne","Regen","Schnee","Wind","Sturm","Gewitter",
    "Nebel","Hitze","Kälte","Temperatur","Blitz","Donner","Erde","Fluss",
    "See","Meer","Ozean","Nordsee","Ostsee","Donau","Berg","Gebirge","Tal",
    "Hügel","Wald","Wiese","Feld","Sand","Stein","Baum","Blume","Pflanze",
    "Luft","Landschaft","Wetterbericht","Wettervorhersage","Klima","Umwelt",
    "Umweltschutz","Umweltverschmutzung","Ernte","Landwirtschaft","Bauer",
    "Bauernhof","Küste","Ufer","Insel","Wolke","Eis","Frost","Wärme",
    "sonnig","bewölkt","regnen","schneien","windig","donnern","blitzen",
    "neblig","hageln","feucht","warm","heiß","mild","pflanzen","gießen",
    "wachsen","blühen","Gras","Rasen","Holz","Zweig","Ast","Tier","Hund",
    "Katze","Vogel","Fisch","Pferd","Kuh","Schwein","Elefant","Affe","Bär",
    "Zoo","Tierpark","füttern","Tierarzt","Stall","trocken",
    "Naturkatastrophe","Erdbeben","Überschwemmung","Jahreszeit",
)

# Sports & Leisure
add("Sports & Leisure",
    "Sport","Sportart","Fußball","Basketball","Tennis","Volleyball","Ski",
    "Ski / Schi","Schwimmbad","Hallenbad","Swimmingpool","Stadion",
    "Spielplatz","Fitness-Studio","Hobby","Spiel","Spielzeug","Freizeit",
    "Wanderung","Spaziergang","Spazier-","Radfahrer","Radfahrerin","Training",
    "Ball","Mannschaft","Spieler","Spielerin","Sieger","Siegerin","Verlierer",
    "Verliererin","Gewinn","Rekord","Wettbewerb","Fan","Festival","Fest",
    "Party","Disco","Diskothek","Club","Zirkus","Aktivität","schwimmen",
    "laufen","joggen","klettern","tanzen","spielen","wandern","zelten",
    "tauchen","reiten","trainieren","gewinnen","verlieren","siegen",
    "kämpfen","aktiv","sportlich","Bewegung","Pokal","Meisterschaft",
    "Turnhalle","Sportverein","Freizeitpark","Vergnügungspark","Bowlen",
    "Kegeln","Radtour","Ausflug",
)

# Arts & Culture
add("Arts & Culture",
    "Musik","Instrument","Gitarre","Klavier","Flöte","Sänger","Sängerin",
    "Konzert","Band","Oper","Orchester","Lied","Song","Film","Kino","Kunst",
    "Künstler","Künstlerin","Künstlerinnen","Fotografie","Fotoapparat",
    "Kamera","Roman","Gedicht","Erzählung","Theater","Museum","Galerie",
    "Ausstellung","Denkmal","Grafik","Plakat","Poster","Krimi","Literatur",
    "Szene","Bühne","Rolle","Star","Veranstaltung","Veranstal-","Unterhaltung",
    "Humor","Witz","Fantasie","Phantasie / Fantasie","Fantasie / Phantasie",
    "malen","zeichnen","singen","fotografieren","basteln","aufführen",
    "kreativ","musikalisch","kulturell","traditionell","Tradition","Folklore",
    "Religion","Kirche","Feier","Bild","Skulptur","Zeichnung","Gemälde",
    "Architektur","Comic","Kulturzentrum","Vernissage","Premiere","Probe",
)

# Technology & Devices
add("Technology & Devices",
    "Computer","PC","Laptop","Tablet","Bildschirm","Tastatur","Monitor",
    "Festplatte","CD","E-Book","Kabel","Akku","Batterie","Netzwerk","App",
    "Datei","Daten","Laufwerk","Digital","Drucker","Kopierer","Automat",
    "Maschine","Gerät","Apparat","Technik","Technologie","installieren",
    "herunterladen","hochladen","speichern","klicken","tippen","drucken",
    "aufladen","einschalten","ausschalten","anmachen","ausmachen","digital",
    "elektronisch","elektrisch","automatisch","virtuell","ausdrucken",
    "Strom","Netz","System","Software","Hardware","Programm","Server",
    "Datenbank","Chip","Mikrofon","Lautsprecher","Kopfhörer","USB",
    "Anschluss","Verbindung","WLAN","Bluetooth","Hotspot","QR-Code",
    "Scan","Scanner","Roboter","Drohne","GPS",
)

# Society, Law & Politics
add("Society, Law & Politics",
    "Gesellschaft","Staat","Bevölkerung","Bürger","Bürgerin","Bürgermeister",
    "Bürgermeisterin","Nationalität","Integration","Migration","Migrant",
    "Ausländer","Ausländerin","ausländisch","Asyl","Flucht","Politik",
    "Politiker","Politikerin","Partei","Parlament","Regierung","Minister",
    "Ministerin","Bundeskanzler","Bundeskanzlerin","Bundespräsident",
    "Bundespräsidentin","Gesetz","Recht","Polizei","Gericht","Richter",
    "Richterin","Anwältin","Behörde","Verwaltung","Rathaus","Botschaft",
    "Gemeinde","Verein","Organisation","Versammlung","Demonstration","Protest",
    "Abstimmung","Wahl","wählen","Demokratie","Freiheit","Gleichberechtigung",
    "Pflicht","Strafe","Strafzettel","Verbrecher","Verbrecherin","Dieb",
    "Einbrecher","Einbrecherin","Einbruch","Kriminalpolizei","Gefängnis",
    "Urteil","Verdacht","Zeuge","Zeugin","Opfer","Täter","Täterin","Schaden",
    "Sicherheit","Region","Zone","Grenze","Versicherung","Versichertenkarte",
    "Rentenversicherung","Sozialhilfe","Förderung","Unterstützung",
    "Einbürgerung","Einwohner","Einwohnerin","Öffentlichkeit","öffentlich",
    "staatlich","national","international","europäisch","politisch",
    "gesetzlich","rechtlich","Ausweis","Urkunde","Unterschrift","Stempel",
    "Genehmigung","Erlaubnis","Verbot","strafbar","verboten","verhaften",
    "verhaftet","verurteilen","verurteilt","Krieg","Friede","Bund","Gewalt",
    "Krise","Bürgerrechte","Menschenrechte","Grundgesetz","Bundesland",
    "Ministerium","Amt","Behördengang","Aufenthaltsgenehmigung","Asylantrag",
)

# Emotions & Personal Traits
add("Emotions & Personal Traits",
    "Gefühl","Emotion","Freude","Trauer","Angst","Wut","Liebe","Hass",
    "Sorge","Hoffnung","Enttäuschung","Überraschung","Stimmung","Laune",
    "Mut","Stolz","Neid","Dankbarkeit","Mitgefühl","Scham","Sehnsucht",
    "glücklich","traurig","ärgerlich","wütend","froh","begeistert",
    "enttäuscht","überrascht","ängstlich","nervös","aufgeregt","entspannt",
    "ruhig","zufrieden","unzufrieden","einsam","verliebt","dankbar",
    "freundlich","höflich","ehrlich","fair","treu","mutig","intelligent",
    "klug","dumm","faul","fleißig","zuverlässig","selbstständig",
    "optimistisch","sympathisch","neugierig","geduldig","großzügig",
    "arrogant","bescheiden","humorvoll","ernst","streng","locker",
    "Charakter","Persönlichkeit","Verhalten","Gewissen","Respekt",
    "Vertrauen","Glaube","Überzeugung","Wert","Verantwortung","freuen",
    "ärgern","fürchten","lieben","hassen","hoffen","wünschen","träumen",
    "sorgen","zweifeln","leiden","lachen","weinen","lächeln","Träne",
    "amüsiert","befreit","beruhigen","entschuldigen","genießen","schämen",
    "Langeweile","Neugier","Enttäuschung","Begeisterung","Erleichterung",
    "Überzeugung","Zuversicht","Vertrauen","Misstrauen","Eifersucht",
    "selbstbewusst","unsicher","optimistisch","pessimistisch","kreativ",
    "fantasievoll","humorvoll","sentimental","empfindlich","sensibel",
)

# Places & Geography
add("Places & Geography",
    "Stadt","Dorf","Ort","Hauptstadt","Metropole","Vorort","Zentrum",
    "Stadtteil","Viertel","Bezirk","Platz","Gasse","Ecke","Brücke","Turm",
    "Schloss","Burg","Dom","Markt","Marktplatz","Park","Deutschland",
    "Österreich","Schweiz","Luxemburg","Europa","Türkei","Ukraine","Norden",
    "Süden","Osten","Westen","Himmelsrichtung","Atlas","Geografie","Kontinent",
    "Inland","Geburtsort","Bundesland","Kreis","Gebiet","Gegend","Luxemburger",
    "Luxemburgerin","österreichisch","schweizerisch","Österreicher",
    "Österreicherin","Schweizer","Schweizerin","Ländername","luxemburgisch",
    "Stadtplan","Europäer","Europäerin","europäisch","Stadtmitte","Landkarte",
    "Region","Gemeinde","Landkreis","Metropolregion","Ballungsgebiet",
)

# Grammar & Core Verbs
add("Grammar & Core Verbs",
    # Conjunctions
    "aber","als","also","auch","außerdem","bevor","bis","da","dabei","dafür",
    "dagegen","daher","dahin","damit","danach","dann","darum","dass","denn",
    "deshalb","deswegen","doch","ebenfalls","ebenso","entweder","falls",
    "jedoch","nachdem","nun","obwohl","oder","seit","seitdem","sobald",
    "sodass","sogar","solange","sondern","sowieso","sowohl","trotzdem","und",
    "während","weil","wenn","zumal","allerdings","andererseits","einerseits",
    "hingegen","immerhin","indem","nämlich","schließlich","sofern",
    # Prepositions / particles
    "ab","an","auf","aus","außer","außerhalb","bei","durch","entlang","für",
    "gegen","gegenüber","hinter","in","innerhalb","mit","nach","neben",
    "ohne","per","über","um","unter","von","vor","zu","zwischen","entgegen",
    "anstatt","statt","laut","gemäß","dank","trotz","wegen","aufgrund",
    "zufolge","mithilfe","anhand","bezüglich","hinsichtlich",
    # Pronouns / determiners
    "all","all-","alle","aller","allem","alles","alle","beiden","der","die",
    "das","dem","den","des","dieser","dieses","diesem","diesen","du","er",
    "es","etwas","euer","ich","ihm","ihn","ihnen","ihr","irgend-","irgendein",
    "irgendwann","irgendwo","jed","jeden","jedes","jemand","jemandem","man",
    "mein","meine","meinem","meinen","meiner","nichts","niemand","nirgends",
    "nirgendwo","selbst","sie","uns","unser","unsere","unseren","wer","was",
    "welch","welchem","weltweit","wen","wir","Sie","Ihnen","ihn","sie",
    "sein","ihr","ihr-","dein","dein-","ander","ander-","andere","anderen",
    "anderer","anderes","solch","jener","jene","jenes","manch","manch-",
    "sämtliche","einige","etliche","viele","wenige","manche","beide",
    "meiner","deiner","seiner","ihrer","unserer","eurer",
    # Modal & auxiliary verbs
    "können","müssen","sollen","wollen","dürfen","mögen","möchte","möchten",
    "lassen","sein","haben","werden","sein",
    # High-frequency general verbs
    "gehen","kommen","geben","nehmen","stehen","sitzen","liegen","sagen",
    "wissen","denken","glauben","sehen","hören","finden","bringen","halten",
    "heißen","helfen","kennen","legen","nennen","schauen","sprechen",
    "stellen","suchen","tun","verstehen","machen","bleiben","zeigen",
    "fragen","antworten","lassen","bleiben","passieren","meinen","gelten",
    "erhalten","entstehen","bilden","bedeuten","bestehen","scheinen",
    "setzen","führen","folgen","bieten","verlassen","dienen","nutzen",
    "brauchen","beginnen","erscheinen","starten","enden","öffnen",
    "schließen","funktionieren","klappen","schaffen","erreichen","verbringen",
    # Colors
    "rot","blau","grün","gelb","schwarz","weiß","grau","braun","lila",
    "orange","rosa","bunt","beige","golden","silbern",
    # Degree / manner adverbs
    "sehr","ganz","gar","kaum","fast","eigentlich","vielleicht",
    "wahrscheinlich","sicher","bestimmt","natürlich","wirklich","tatsächlich",
    "überhaupt","endlich","bereits","immer","nie","oft","manchmal","selten",
    "meistens","normalerweise","usw.","d.h.","z.B.","etc.","so","ebenso",
    "genau","genauso","ziemlich","eher","ungefähr","fast","kaum","knapp",
    "nur","bloß","wenigstens","mindestens","höchstens","insbesondere",
    "besonders","vor allem","nochmals","nochmal","erneut","wieder","weiter",
    "noch","schon","erst","dann","danach","vorher","nachher","seitdem",
    "gleichzeitig","trotzdem","dennoch","jedoch","allerdings",
    # Particles / interjections
    "ach","ja","nein","bitte","danke","hallo","tschüss","na","ok","super",
    "prima","leider","leider","doch","schon","mal","denn","halt","eben",
    "eh","nu","nä","ne","je","immerhin",
    # Fragments / morphemes
    "-chen","-en","-lich","-schaft","-ung","-ner","-nen","-nung","-ment",
    "-weisung","-östlich","-losigkeit","-eterin","-te","-ten","-ter",
    "-tern","-sten","ge-","un-","Über-","ab-","an-","auf-","aus-",
    "be-","ent-","er-","ver-","zer-","miss-",
    # Common German adverbs of direction
    "hin","her","raus","rein","rauf","runter","weg","hinaus","herein",
    "hinein","heraus","hinauf","herunter","vorwärts","rückwärts","aufwärts",
    "abwärts","links","rechts","geradeaus","oben","unten","vorne","hinten",
    "innen","außen","nebenan","drinnen","draußen","überall","nirgendwo",
    "irgendwo","woher","wohin","wo","wann","warum","wie","wer","was",
    # Common question words
    "wieso","weshalb","wozu","womit","wofür","woran","wobei","worüber",
    "worum","woraus","wonach","wovor","wohinter","woneben","wozwischen",
    # Generic sentence connectors often taught as grammar
    "zum Beispiel","das heißt","und so weiter","beziehungsweise","bzw.",
    "etc.","usw.","zb.","nämlich","nochmals","andererseits","einerseits",
    # Abbreviations sometimes left in alphabet sections
    "WC","PC","CD","SMS","EC-Karte",
    # Other function structures
    "Ich","Sie","Er","Es","Wir","Ihr","Man",
)

# ── Build word → section lookup from source CSVs ─────────────────────────────
def build_section_lookup():
    """Returns dict: word -> best section (prefer named over alphabetical)."""
    lookup = {}  # word -> (section, word_type)
    for fname in ("a1.csv", "a2.csv", "b1.csv"):
        path = os.path.join(SRC_DIR, fname)
        with open(path, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                word    = row["word"].strip()
                section = row["section"].strip()
                wtype   = row.get("word_type", "").strip()
                prev = lookup.get(word)
                if prev is None:
                    lookup[word] = (section, wtype)
                else:
                    # prefer named sections over single-letter (alphabetical)
                    prev_sec = prev[0]
                    if len(section) > 2 and len(prev_sec) <= 2:
                        lookup[word] = (section, wtype)
    return lookup

# ── Main categorization function ─────────────────────────────────────────────
def categorize(word, section="", word_type=""):
    # 1) Named section → direct mapping
    if section and len(section) > 2 and section in SECTION_CAT:
        return SECTION_CAT[section]

    # 2) Word dictionary
    if word in W:
        return W[word]

    # 3) Pattern-based fallbacks
    # Morpheme fragments
    if word.startswith("-"):
        return "Grammar & Core Verbs"

    # Word_type hints
    if word_type in ("Number",):
        return "Numbers & Quantities"
    if word_type in ("Month", "Weekday"):
        return "Time & Calendar"
    if word_type == "Abbreviation":
        return "Language, Communication & Media"

    # Suffix-based guesses for compound nouns (German: head-final)
    lower = word.lower()
    compound_suffixes = {
        "arbeit": "Work & Careers",
        "arzt": "Body & Health",
        "ärztin": "Body & Health",
        "bahn": "Transportation",
        "baum": "Nature, Weather & Animals",
        "buch": "Language, Communication & Media",
        "büro": "Work & Careers",
        "dienst": "Work & Careers",
        "fahrt": "Transportation",
        "geld": "Shopping & Finance",
        "haus": "Home & Living",
        "karte": "Travel & Tourism",
        "kind": "Family & Relationships",
        "kraft": "Work & Careers",
        "kurs": "Education & Learning",
        "lehrer": "Work & Careers",
        "lehrerin": "Work & Careers",
        "markt": "Shopping & Finance",
        "mittel": "Body & Health",
        "platz": "Places & Geography",
        "recht": "Society, Law & Politics",
        "schule": "Education & Learning",
        "sport": "Sports & Leisure",
        "stelle": "Work & Careers",
        "straße": "Transportation",
        "tag": "Time & Calendar",
        "technik": "Technology & Devices",
        "ung": "Grammar & Core Verbs",
        "verkehr": "Transportation",
        "wetter": "Nature, Weather & Animals",
        "wohnung": "Home & Living",
        "zeit": "Time & Calendar",
    }
    for suffix, cat in compound_suffixes.items():
        if lower.endswith(suffix) and len(word) > len(suffix):
            return cat

    # Lowercase word ending in -ieren/-ieren → often a verb; default grammar
    if lower.endswith("ieren") or lower.endswith("isieren"):
        return "Grammar & Core Verbs"

    # Default
    return "Grammar & Core Verbs"

# ── Batch processor ───────────────────────────────────────────────────────────
def load_progress():
    if os.path.exists(PROGRESS):
        with open(PROGRESS, encoding="utf-8") as f:
            return json.load(f)
    return None

def save_progress(processed_rows, total_rows, status="running"):
    data = {
        "total_rows": total_rows,
        "processed_rows": processed_rows,
        "last_processed_row": processed_rows,
        "batch_size": BATCH_SIZE,
        "status": status,
    }
    with open(PROGRESS, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def git_commit(start_row, end_row):
    msg = f"categorization batch {start_row}-{end_row}"
    subprocess.run(["git", "-C", BASE, "add",
                    "word_data/categorized_words.csv",
                    "word_data/categorization_progress.json"],
                   check=True)
    subprocess.run(["git", "-C", BASE, "commit", "-m", msg], check=True)
    print(f"  Committed: {msg}")

def main():
    # Load word → section lookup
    print("Building section lookup from source CSVs…")
    sec_lookup = build_section_lookup()

    # Load all rows
    with open(INPUT_CSV, encoding="utf-8") as f:
        all_rows = list(csv.DictReader(f))
    total = len(all_rows)
    print(f"Total rows to process: {total}")

    # Resume logic
    progress = load_progress()
    start_idx = 0
    output_exists = os.path.exists(OUTPUT_CSV)

    if progress and progress.get("status") != "done":
        start_idx = progress["processed_rows"]
        print(f"Resuming from row {start_idx + 1}")
    elif progress and progress.get("status") == "done":
        print("Already complete.")
        return

    # Process batches
    for batch_start in range(start_idx, total, BATCH_SIZE):
        batch_end = min(batch_start + BATCH_SIZE, total)
        batch = all_rows[batch_start:batch_end]

        rows_1indexed_start = batch_start + 1
        rows_1indexed_end   = batch_end
        print(f"Processing rows {rows_1indexed_start}–{rows_1indexed_end}…", end=" ")

        # Categorize
        out_rows = []
        for row in batch:
            word = row["word"].strip()
            sec, wtype = sec_lookup.get(word, ("", ""))
            theme = categorize(word, sec, wtype)
            out_rows.append({
                "id":         row["id"],
                "word":       row["word"],
                "difficulty": row["difficulty"],
                "level":      row["level"],
                "theme":      theme,
            })

        # Append to output CSV
        write_header = not output_exists
        with open(OUTPUT_CSV, "a", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["id","word","difficulty","level","theme"])
            if write_header:
                writer.writeheader()
                output_exists = True
            writer.writerows(out_rows)

        processed = batch_end
        status = "done" if processed >= total else "running"
        save_progress(processed, total, status)

        git_commit(rows_1indexed_start, rows_1indexed_end)
        print(f"done ({len(out_rows)} rows).")

    print(f"\nAll {total} rows categorized → {OUTPUT_CSV}")

if __name__ == "__main__":
    main()

import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 3 fixes – rows 551-750
# Only rows that actually need changing are listed.
# Run this script to patch the CSV directly (streams row-by-row, no full load).
updates = {
    # --- " - " dash patterns converted to single clean sentences ---
    "557": "Bitte stoeren Sie mich nicht, wenn ich konzentriert arbeite.",
    "565": "Er bat sie, es noch einmal zu erklaeren, weil er es nicht verstanden hatte.",
    "567": "Das war eine sehr gute und kreative Idee.",
    "577": "Sie arbeitet als Lehrerin an einer Grundschule in Berlin.",
    "596": "Dieser Sessel ist so bequem, dass ich gar nicht aufstehen moechte.",
    "608": "Sie bat ihn, spaeter zurueckzurufen, da sie gerade beschaeftigt war.",
    "615": "Das Angebot gilt nur bis Sonntag, denn es ist zeitlich beschraenkt.",
    "623": "Der Preis ist zu hoch, weil er falsch berechnet wurde.",
    "638": "Bitte bewegen Sie sich nicht, waehrend ich das Foto mache.",
    "649": "Ich wuensche dir gute Besserung und hoffe, dass du bald wieder gesund bist.",
    "654": "Er kommt bestimmt noch, er ist nur ein bisschen spaet dran.",
    "658": "Das neue Auto haben wir erst letzte Woche gekauft.",
    "660": "Jemanden zu betruegen ist falsch, egal um welche Summe es geht.",
    "663": "Er hat seinen Schluessel vergessen und steht jetzt vor verschlossener Tuer.",
    "670": "Als er nach Hause kam, hoerte er, dass seine Mutter angerufen hatte.",
    "680": "Sie suchte Hilfe, weil sie das Problem nicht verstand.",
    "682": "Er sah so blass aus, dass alle dachten, er sei krank.",
    "688": "Als es anfing zu blitzen und zu donnern, gingen alle schnell rein.",
    "695": "Die Wunde blutet noch, du solltest schnell ein Pflaster draufmachen.",
    "703": "Das Hemd hat nur fuenf Euro gekostet, weil es stark im Angebot war.",
    "716": "Er ist immer puenktlich und kommt nie zu spaet.",
    "718": "Die Wunde blutete stark, sodass ein Arzt gerufen werden musste.",
    "750": "Ich brauche dringend eine neue Jacke, denn diese ist schon sehr alt und abgenutzt.",
    # --- grammar / other fixes ---
    "581": "Mozart ist einer der beruehmtesten Komponisten der Welt.",  # removed hidden soft-hyphen
    "684": "Bleib noch ein bisschen, die Party faengt gerade erst an.",  # merged two-sentence Q&A
    "685": "Ich nehme lieber einen Bleistift, damit ich Fehler leicht ausradieren kann.",  # removed repeated word
    "696": "Nach dem Unfall musste ihm sofort Blut abgenommen werden.",  # grammar: er → ihm
}

# --- Batch 3b fixes – rows 751-950 ---
updates.update({
    # --- " - " dash patterns ---
    "755": "Die Bremsen des Fahrrads sind kaputt, sodass es zur Werkstatt muss.",
    "767": "Bitte sprechen Sie leise, denn das Baby schlaeft.",
    "768": "Er sieht heute so muede aus, als haette er schlecht geschlafen.",
    "777": "Das Licht im Wohnzimmer ist so dunkel, dass ich eine hellere Lampe brauche.",
    "786": "Weil er in Bayern aufgewachsen ist, spricht er Dialekt.",
    "805": "Wir fahren um acht Uhr los, also bitte sei puenktlich.",
    "815": "Das war zu viel fuer mich, ich brauche jetzt eine Pause.",
    "818": "Er ruft mich so dauernd an, dass es mir langsam laestig wird.",
    "833": "Das Cafe ist gleich daneben, du kannst es von hier aus sehen.",
    "837": "Ich bedanke mich herzlich fuer die nette Einladung.",
    "843": "Heute haben wir den vierzehnten Maerz.",
    "855": "Er hat so gut gespielt, dass alle beeindruckt waren.",
    "864": "Ich komme gleich, warte bitte noch einen Moment.",
    "871": "Der Weg zur Schule ist sehr kurz, nur zwei Kilometer.",
    "876": "Ein starkes Gewitter mit Donner und Blitz zog ueber die Stadt.",
    "885": "Bitte sprechen Sie deutlicher, damit ich Sie gut verstehen kann.",
    "894": "Beim letzten Mal hatte er Pech, aber diesmal hat er die Pruefung bestanden.",
    "914": "Er antwortet auf die Frage, wie es ihm geht, immer mit 'Sehr gut, danke.'",
    "924": "Ich habe ihn gerade eben noch hier gesehen.",
    "925": "Nach dem Essen wuenschen wir uns gegenseitig guten Appetit.",
    "928": "Die Situation ist ernst, deshalb muss er dringend zum Arzt.",
    "933": "Der Drucker ist kaputt und muss ersetzt werden.",
    "936": "Es war wirklich dumm von mir, das haette ich besser wissen sollen.",
    "937": "Es ist draussen schon dunkel, deshalb sollten wir nach Hause gehen.",
    "938": "Das Buch ist ziemlich duenn und hat nicht viele Seiten.",
    "940": "Das Zimmer wird gut geheizt und ist angenehm warm und gemuetlich.",
    "942": "Er hat alles bereits verstanden und muss es nicht wiederholt bekommen.",
    "945": "Das ist nicht richtig gemacht, du musst es noch einmal neu machen.",
    # --- Büro fix (950 and 662 which also uses Buero) ---
    "950": "Er kommt um neun Uhr morgens ins Büro.",
    "662": "Sie arbeitet im Büro im dritten Stock.",
})

tmp = CSV_PATH + '.tmp'
updated = 0

with open(CSV_PATH, newline='', encoding='utf-8') as fin, \
        open(tmp, 'w', newline='', encoding='utf-8') as fout:
    reader = csv.DictReader(fin)
    writer = csv.DictWriter(fout, fieldnames=reader.fieldnames)
    writer.writeheader()
    for row in reader:
        if row['id'] in updates:
            row['example_de'] = updates[row['id']]
            updated += 1
        writer.writerow(row)

os.replace(tmp, CSV_PATH)
print(f"Updated {updated} rows.")


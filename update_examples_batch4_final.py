import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 4 final fill – all remaining 26 empty rows in 951-1200
updates = {
    "959":  "Kannst du mir bitte helfen, den schweren Koffer zu tragen?",              # mir – me (dative)
    "960":  "Er hat sich gestern ein neues Fahrrad gekauft.",                          # gekauft – bought
    "965":  "Sie hat ein kleines Café in der Innenstadt eröffnet.",                    # ein – a/one (article)
    "996":  "Ich lerne seit drei Jahren Deutsch und spreche es schon recht gut.",      # ich – I
    "1005": "Er ist der dritte Teilnehmer, der die Prüfung bestanden hat.",            # -ter – ordinal suffix (-ter, as in drit-ter)
    "1040": "Sie wartet an der Bushaltestelle auf den nächsten Bus.",                  # an – at/on
    "1046": "Ich habe ihr eine Geburtstagskarte geschrieben und sie abgeschickt.",     # ich – I
    "1050": "Nach der Arbeit gehe ich noch kurz einkaufen.",                           # nach – after/to
    "1058": "Das ist mir wichtig, denn ich möchte immer pünktlich sein.",             # mir – to me
    "1089": "Die Veranstaltung beginnt um sieben Uhr abends.",                        # um – at (time)
    "1107": "Von der Brücke hat man einen schönen Blick über die ganze Stadt.",       # über – over
    "1110": "Er wohnt in einem kleinen Apartment im dritten Stock.",                  # einem – a/one (dative article)
    "1140": "Sie kommt aus Spanien und lebt seit zwei Jahren in Deutschland.",        # aus – from
    "1142": "Mit diesem Ticket kannst du alle öffentlichen Verkehrsmittel nutzen.",   # diesem – this
    "1143": "Die Archäologen funden während der Ausgrabung alte Münzen.",             # funden – found (archaic/regional past pl. of finden)
    "1144": "Das Konzert war sehr schön, alle Zuschauer haben begeistert geklatscht.", # sehr – very
    "1145": "Die freiwilligen Helfer taten alles, um den Betroffenen zu helfen.",     # taten – did (past pl. of tun)
    "1150": "Das Hotel liegt genau da, neben dem großen Park.",                       # da – there
    "1152": "Ich freue mich sehr, dich nach so langer Zeit wiederzusehen.",           # ich – I
    "1154": "Was hast du am Wochenende vor?",                                         # was – what
    "1160": "Möchtest du lieber Kaffee oder Tee zum Frühstück?",                     # oder – or
    "1189": "Das Essen im Restaurant war sehr gut und auch nicht zu teuer.",          # sehr – very
    "1190": "Er kauft jeden Morgen frisches Brot und Butter beim Bäcker.",            # und – and
    "1191": "Die Kinder laufen um den Park und spielen dabei Fangen.",               # um – around
    "1197": "Nach dem langen Wandertag war sie völlig erschöpft und schlief sofort ein.", # schöpft – exhausted (erschöpft)
    "1198": "Das Wetter gestern war wunderbar, deshalb haben wir einen Ausflug gemacht.", # war – was
}

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

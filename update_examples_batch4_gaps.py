import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 4 gap-fill: all missed real vocabulary in rows 951-1200
# Skipped rows are true function-word/fragment entries:
#   ich (996,1046,1152), mir (959,1058), ein (965), einem (1110), diesem (1142),
#   aus (1140), über (1107), um (1089,1091), nach (1050), oder (1160), da (1150),
#   was (1154), und (1190), sehr (1144,1189), war (1198),
#   -ter (1005), funden (1143), taten (1145), schöpft (1197)
updates = {
    "953":  "Das neue Sofa ist viel angenehmer als das alte.",                              # angenehmer – more pleasant
    "954":  "Das Dokument ist bereits ausgedruckt und liegt auf deinem Schreibtisch.",      # ausgedruckt – printed out
    "958":  "Der vordere Eingang des Gebäudes ist für Besucher reserviert.",               # vorderen – front
    "962":  "In Deutschland kann man fast überall mit der EC-Karte bezahlen.",             # man – one/you (impersonal)
    "992":  "Ich brauche nur eins von diesen Formularen, bitte.",                          # eins – one
    "994":  "Letzte Nacht ist jemand in unser Büro eingebrochen.",                        # eingebrochen – broken in
    "995":  "Unsere Mannschaft hat das Fußballspiel mit zwei zu eins gewonnen.",           # gewonnen – won
    "998":  "Was machst du morgen Nachmittag, hast du schon Pläne?",                      # machen – to make/do
    "999":  "Das Rezept ist sehr einfach: nur drei Zutaten, und fertig.",                 # einfach – simple
    "1000": "Könnten Sie mir bitte sagen, wo der nächste Bahnhof ist?",                   # bitte – please
    "1002": "Er ist immer pünktlich und kommt nie zu spät.",                              # immer – always
    "1006": "Ich würde eher zu Hause bleiben als bei diesem Wetter ausgehen.",            # eher – rather
    "1007": "Er hat sein Geld ehrlich verdient und spart jeden Monat etwas.",             # verdient – earned
    "1009": "Eigentlich wollte sie Lehrerin werden, aber jetzt arbeitet sie als Ärztin.", # eigentlich – actually
    "1030": "Wir sind uns einig: das Projekt beginnt nächste Woche.",                     # einig – united/agreed
    "1038": "Er hat alles sorgfältig eingepackt, bevor er das Paket abschickte.",        # einpacken – to pack
    "1039": "Die neue Wohnung ist bereits schön eingerichtet und bezugsfertig.",         # eingerichtet – furnished
    "1041": "Kannst du bitte ein bisschen langsamer sprechen?",                          # bisschen – a little
    "1042": "Vergiss nicht, das Licht einzuschalten, wenn es draußen dunkel wird.",      # einschalten – to switch on
    "1043": "Der Preis beträgt fünfzig Euro, einschließlich aller Gebühren.",            # einschließlich – including
    "1044": "Er ist sehr geschickt mit den Händen und repariert alles selbst.",          # geschickt – skillful
    "1047": "Die Passagiere steigen am Bahnsteig drei in den Zug ein.",                  # einsteigen – to board
    "1048": "Wir haben eine neue Nachbarin, die erst letzte Woche eingezogen ist.",      # neue – new
    "1049": "Im vollen Bus fand er keinen freien Sitzplatz mehr.",                       # vollen – full
    "1051": "Die Schule hat neue Regeln eingeführt, um den Alltag zu verbessern.",       # einführen – to introduce
    "1052": "Viele Schüler haben die Prüfung mit guten Noten bestanden.",               # viele – many
    "1053": "Sie geht jeden Freitag einkaufen und kauft frisches Obst und Gemüse.",     # einkaufen – to go shopping
    "1054": "Kannst du mir bitte erklären, wie dieses Gerät funktioniert?",             # können – can
    "1055": "Im Supermarkt kann man frische Lebensmittel zu günstigen Preisen kaufen.", # man – one
    "1056": "Hast du den neuen Film im Kino schon gesehen?",                            # gesehen – seen
    "1057": "Er ist es gewohnt, früh aufzustehen, weil er Bäcker ist.",                 # gewohnt – used to/accustomed
    "1087": "Das Seil wurde fest um den Baumstamm gebunden.",                           # fest – firm/fixed/solid
    "1088": "Nach langer Diskussion haben wir uns für den zweiten Plan entschieden.",   # entschieden – decided
    "1090": "Wir haben das schwierige Problem zusammen gelöst.",                        # zusammen – together
    "1091": "Er möchte Ingenieur werden und studiert dafür Maschinenbau.",              # werden – to become
    "1092": "Das Dorf liegt weit entfernt vom nächsten Supermarkt.",                    # entfernt – distant/removed
    "1094": "Die Bank ist uns entgegengekommen und hat den Kredit genehmigt.",          # entgegenkommen – to meet halfway
    "1095": "Sie spricht noch wenig Deutsch, aber sie lernt sehr schnell.",             # wenig – little
    "1096": "Sie kann sehr gut Klavier spielen und gibt auch Unterricht.",              # können – can
    "1098": "Das Ergebnis der Wahl war überraschend für alle Experten.",               # überraschend – surprising
    "1099": "Kannst du bitte die Hausaufgaben machen, bevor wir fernsehen?",           # machen – to make/do
    "1100": "Sie geht jeden Monat zum Arzt für eine kurze Kontrolluntersuchung.",      # Arzt – doctor
    "1102": "Ich habe sie seit drei Wochen nicht mehr gesehen.",                       # gesehen – seen
    "1103": "Nächste Woche beginnt das neue Semester an der Universität.",             # nächste – next
    "1104": "Die elektrische Zahnbürste ist gründlicher als eine normale.",            # elektrische – electric
    "1105": "Das Haus wird mit elektrischer Energie aus Solaranlagen geheizt.",        # elektrisch – electric
    "1106": "Sie bearbeitet täglich viele Anträge in ihrer Abteilung.",               # bearbeiten – to work on/process
    "1108": "Er hat das Paket persönlich an der Haustür empfangen.",                  # empfangen – to receive
    "1109": "Die Kunden sind sehr zufrieden mit dem neuen Kundenservice.",            # zufrieden – satisfied
    "1120": "Diese Aufgabe erfordert viel Geduld und Konzentration.",                 # erfordern – to require/demand
    "1127": "Das Fußballspiel endete unentschieden mit einem Tor pro Mannschaft.",    # unentschieden – drawn
    "1141": "Hast du schon eine Antwort auf deine Bewerbung bekommen?",               # bekommen – to get
    "1146": "Er hat ihr die gute Neuigkeit persönlich mitgeteilt.",                   # persönlich – personal
    "1147": "Ich war sehr überrascht, als ich meinen alten Freund auf der Straße traf.", # überrascht – surprised
    "1148": "Er hat eine Auszeichnung für seine hervorragende Arbeit erhalten.",      # erhalten – to receive
    "1149": "Jeder Arbeitnehmer muss monatlich Steuern an den Staat zahlen.",        # Steuern – taxes
    "1151": "Die Lehrerin hat entschieden, die Prüfung auf nächste Woche zu verschieben.", # entschieden – decided
    "1153": "Beide Kinder haben die Prüfung mit sehr guten Noten bestanden.",        # beiden – both
    "1155": "Sie war entschlossen, das Projekt trotz der Schwierigkeiten fertigzustellen.", # entschlossen – determined
    "1156": "Entschuldigung, ich störe dich nicht lange, ich habe nur eine kurze Frage.", # störe – disturb
    "1157": "Das Museum liegt direkt im Zentrum der Stadt, nah am Hauptbahnhof.",    # Zentrum – center
    "1158": "Er war enttäuscht, weil er die gewünschte Stelle nicht bekommen hatte.", # enttäuscht – disappointed
    "1159": "Sie war enttäuscht von dem Film, da sie mehr erwartet hatte.",           # enttäuscht – disappointed
    "1161": "Das Land hat sich in den letzten Jahren wirtschaftlich stark entwickelt.", # entwickelt – developed
    "1162": "Im Herbst fallen die bunten Blätter von den Bäumen.",                   # fallen – to fall
    "1188": "Alles hat wunderbar geklappt, die Feier war ein großer Erfolg.",        # geklappt – worked out
    "1192": "Es ist wichtig, jeden Tag genug Wasser zu trinken.",                    # wichtig – important
    "1193": "Hast du andere Pläne für das Wochenende, oder kommst du mit uns?",     # andere – other
    "1194": "Ich bin noch nicht fertig, ich brauche noch etwa zehn Minuten.",       # noch – still
    "1195": "Wie kann ich Sie am besten erreichen, per Telefon oder per E-Mail?",   # erreichen – to reach
    "1196": "Ich habe heute noch nichts gegessen und bin sehr hungrig.",            # nichts – nothing
    "1199": "Der Hund hat das Kind erschreckt, als er plötzlich laut bellte.",     # schrecken – to frighten
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

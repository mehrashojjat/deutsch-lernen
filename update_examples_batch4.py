import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 4: rows 951-1200
# Only meaningful vocabulary entries are listed (filler/fragment rows are skipped).
# Examples reflect the word's meaning, are B1-level, single clean sentences.
updates = {
    "951": "Der Arzt muss dringend angerufen werden, die Situation ist ernst.",           # dringend – urgent
    "952": "Es regnet draußen, deshalb spielen die Kinder drinnen.",                     # drinnen – inside
    "955": "Was meinst du damit? Ich verstehe dich nicht.",                              # meinen – to think/mean
    "956": "Bitte drücken Sie den Knopf, um die Tür zu öffnen.",                        # drücken – to press
    "957": "Dieses Gerät kann Fotos direkt auf das Handy übertragen.",                  # Gerät – device
    "961": "Er hat wenig Zeit, weil er viel zu tun hat.",                               # wenig – little/few
    "963": "Sie war in großer Eile und vergaß ihr Portemonnaie zu Hause.",              # Eile – hurry/haste
    "964": "Ich muss eilig los, mein Zug fährt in zehn Minuten.",                       # eilig – urgent/in a hurry
    "966": "In dieser Einbahnstraße darf man nur in eine Richtung fahren.",             # Einbahnstraße – one-way street
    "967": "Jemand ist nachts in das Geschäft eingebrochen und hat Geld gestohlen.",    # einbrechen – to break in
    "968": "Der Einbrecher wurde von der Polizei kurz nach der Tat festgenommen.",      # Einbrecher – burglar (male)
    "969": "Die Einbrecherin wurde auf frischer Tat ertappt.",                          # Einbrecherin – burglar (female)
    "970": "Der Einbruch in die Bank wurde von einer Kamera aufgezeichnet.",            # Einbruch – burglary/break-in
    "971": "Das Ergebnis war eindeutig: Team A hat klar gewonnen.",                     # eindeutig – clear/unambiguous
    "972": "Er hat beim Vorstellungsgespräch einen sehr guten Eindruck gemacht.",       # Eindruck – impression
    "973": "Einerseits möchte sie reisen, andererseits hat sie Angst vor dem Fliegen.", # einerseits – on the one hand
    "974": "Die Aufgabe ist einfach, du brauchst nur ein bisschen Geduld.",             # einfach – simple/easy
    "975": "Bitte blockieren Sie die Einfahrt nicht mit Ihrem Auto.",                   # Einfahrt – driveway/entrance
    "976": "Mir ist plötzlich eine gute Idee eingefallen.",                             # einfallen – to occur to/come to mind
    "977": "Er hatte den Einfall, das Treffen im Park stattfinden zu lassen.",          # Einfall – idea/flash of inspiration
    "978": "Die Medien haben großen Einfluss auf die öffentliche Meinung.",             # Einfluss – influence
    "979": "Das ist kein echter Lederrucksack, sondern ein billiges Imitat.",           # echt – real/genuine
    "980": "Ich zahle meistens mit EC-Karte, weil ich wenig Bargeld dabei habe.",      # EC-Karte – debit card
    "981": "Wir treffen uns an der Ecke neben der Bäckerei.",                           # Ecke – corner
    "982": "Der Tisch hat eine eckige Form und passt gut in das Zimmer.",               # eckig – angular/square
    "983": "Es ist mir egal, ob wir Pizza oder Pasta bestellen.",                       # egal – doesn't matter
    "984": "Sie sind seit zwanzig Jahren verheiratet und haben eine glückliche Ehe.",   # Ehe – marriage
    "985": "Seine Ehefrau arbeitet als Ärztin in einem Krankenhaus.",                   # Ehefrau – wife
    "986": "Das Ehepaar feierte seinen dreißigsten Hochzeitstag.",                      # Ehepaar – married couple
    "987": "Ich schlafe eher früh, meistens schon um zehn Uhr.",                        # eher – rather/sooner
    "988": "Sei bitte ehrlich mit mir und sag mir, was du wirklich denkst.",            # ehrlich – honest
    "989": "Zum Frühstück esse ich ein gekochtes Ei mit Toast.",                        # Ei – egg
    "990": "Jeder hat das Recht auf eine eigene Meinung.",                              # eigen – own/personal
    "991": "Er hat eigentlich vor zu kochen, aber am Ende haben sie Pizza bestellt.",   # eigentlich – actually/in fact
    "993": "Ich brauche dringend eine neue Winterjacke.",                               # brauchen – to need
    "997": "Das Essen war ziemlich gut, aber etwas zu teuer.",                          # ziemlich – quite/fairly
    "1001": "Bitte freihalten – dieser Parkplatz ist nur für Anwohner.",               # freihalten – to keep free
    "1003": "Ich denke oft daran, wie es wäre, in einem anderen Land zu leben.",       # denken – to think
    "1004": "Sie schwimmt jeden Morgen dreißig Minuten im Hallenbad.",                 # schwimmen – to swim
    "1008": "Wir besuchen nächste Woche meinen Onkel in München.",                     # besuchen – to visit
    "1010": "Vergiss nicht, deine Sachen einzupacken, bevor wir losfahren.",           # einpacken – to pack
    "1011": "Wir möchten die neue Wohnung gemütlich einrichten.",                      # einrichten – to furnish/set up
    "1012": "Die Einrichtung des Büros ist modern und funktional.",                    # Einrichtung – furnishings/facility
    "1013": "Er fühlt sich einsam, seit er in die neue Stadt gezogen ist.",            # einsam – lonely
    "1014": "Kannst du bitte das Radio einschalten? Ich möchte die Nachrichten hören.", # einschalten – to switch on
    "1015": "Der Preis versteht sich einschließlich Mehrwertsteuer.",                  # einschließlich – including
    "1016": "Das Paket wurde als Einschreiben verschickt, damit es sicher ankommt.",   # Einschreiben – registered letter
    "1017": "Bitte steigen Sie schnell ein, der Zug fährt gleich ab.",                 # einsteigen – to board/get in
    "1018": "Die Firma stellt dieses Jahr zwanzig neue Mitarbeiter ein.",              # einstellen – to hire/adjust
    "1019": "Bitte tragen Sie sich in die Liste ein, wenn Sie teilnehmen möchten.",   # eintragen – to enter/register
    "1020": "Es ist ein unerwartetes Problem eingetreten, das wir lösen müssen.",     # eintreten – to enter/occur
    "1021": "Der Eintritt ins Museum ist für Kinder unter zwölf Jahren kostenlos.",   # Eintritt – admission/entry
    "1022": "Bist du einverstanden, oder hast du noch Fragen dazu?",                  # einverstanden – agreed
    "1023": "Die Stadt hat über zwei Millionen Einwohner.",                            # Einwohner – resident/inhabitant
    "1024": "Die Einwohnerin beschwerte sich über den Lärm in der Nachbarschaft.",    # Einwohnerin – resident (female)
    "1025": "Er hat noch einen Satz in den Text eingefügt.",                           # einfügen – to insert/add
    "1026": "Das neue Produkt wurde letzten Monat auf dem Markt eingeführt.",         # einführen – to introduce/import
    "1027": "Die Einführung in das Thema war klar und leicht verständlich.",          # Einführung – introduction
    "1028": "Der Eingang des Gebäudes ist auf der linken Seite.",                     # Eingang – entrance
    "1029": "Die Schuluniformen sind einheitlich in allen Klassen.",                   # einheitlich – uniform/standardized
    "1031": "Am Samstag gehe ich immer einkaufen und erledige meinen Wocheneinkauf.", # einkaufen – to go shopping
    "1032": "Ich muss noch schnell einen Einkauf im Supermarkt erledigen.",           # Einkauf – shopping/purchase
    "1033": "Mit einem höheren Einkommen könnte er sich eine größere Wohnung leisten.", # Einkommen – income
    "1034": "Er hat seine Freunde zum Geburtstag eingeladen.",                        # einladen – to invite
    "1035": "Danke für die Einladung, ich komme gerne zur Party.",                    # Einladung – invitation
    "1036": "Ich war einmal in Japan und möchte unbedingt wiederkommen.",             # einmal – once/one day
    "1037": "Der Arzt hat mir gesagt, ich soll diese Tabletten dreimal täglich einnehmen.", # einnehmen – to take (medicine)
    "1045": "Die Feuerwehr wurde eingesetzt, um den Brand zu löschen.",               # einsetzen – to use/deploy
    "1059": "Am Ende des Films war ich sehr überrascht.",                             # Ende – end
    "1060": "Die endgültige Entscheidung liegt beim Chef.",                           # endgültig – final/definitive
    "1061": "Nach langer Suche hat sie endlich ihre Schlüssel gefunden.",             # endlich – finally/at last
    "1062": "Solar-Energie ist eine umweltfreundliche Alternative zu Öl und Gas.",   # Energie – energy
    "1063": "Meine Enkelin besucht mich jeden Sonntag zum Mittagessen.",             # Enkelin – granddaughter
    "1064": "Die Forscher haben eine neue Tierart im Regenwald entdeckt.",           # entdecken – to discover
    "1065": "Der Arzt hat die Wunde sorgfältig gereinigt und das Pflaster entfernt.", # entfernen – to remove
    "1066": "Die Entfernung zwischen den beiden Städten beträgt etwa 200 Kilometer.", # Entfernung – distance
    "1067": "Der Chef ist uns entgegengekommen und hat die Arbeitszeit verkürzt.",   # entgegenkommen – to meet halfway
    "1068": "Das Paket enthält alle notwendigen Teile für die Montage.",             # enthalten – to contain
    "1069": "Wir sind den Fluss entlang spaziert.",                                  # entlang – along
    "1070": "Der Mitarbeiter wurde entlassen, weil er wiederholt zu spät kam.",      # entlassen – to dismiss
    "1071": "Nach der Entlassung aus dem Krankenhaus brauchte er noch Erholung.",    # Entlassung – dismissal/discharge
    "1072": "Er hat eine Einzahlung von 500 Euro auf sein Konto gemacht.",           # Einzahlung – deposit (money)
    "1073": "Die Aufgaben können einzeln oder in der Gruppe gelöst werden.",         # einzeln – single/individual
    "1074": "Er erklärte jeden Schritt in allen Einzelheiten.",                      # Einzelheit – detail
    "1075": "Das ist der einzige Schlüssel, bewahr ihn also gut auf.",              # einzig – only/sole
    "1076": "Sie zieht nächsten Monat in ihre neue Wohnung ein.",                   # einziehen – to move in
    "1077": "Im Sommer essen wir gern Eis am Stiel.",                               # Eis – ice cream
    "1078": "Früher reisten die Menschen oft mit der Eisenbahn.",                   # Eisenbahn – railway
    "1079": "Sie trug ein elegantes Kleid zur Hochzeitsfeier.",                     # elegant – elegant
    "1080": "Das elektrische Fahrrad wird immer beliebter in der Stadt.",           # elektrisch – electric
    "1081": "Er liest Bücher am liebsten auf seinem elektronischen Lesegerät.",     # elektronisch – electronic
    "1082": "Seine Eltern leben auf dem Land und fahren selten in die Stadt.",      # Eltern – parents
    "1083": "Der Empfang im Hotel war freundlich und sehr professionell.",          # Empfang – reception/welcome
    "1084": "Der Empfänger des Pakets muss den Erhalt persönlich bestätigen.",      # Empfänger – recipient (male)
    "1085": "Kannst du mir ein gutes Restaurant in der Innenstadt empfehlen?",      # empfehlen – to recommend
    "1086": "Ich bin Ihrer Empfehlung gefolgt und habe das Buch gekauft.",          # Empfehlung – recommendation
    "1093": "Ich habe ihn sofort erkannt, obwohl er sich verändert hatte.",         # erkennen – to recognize
    "1097": "Die Firma wurde entlassen, weil sie den Vertrag nicht erfüllt hatte.", # entlassen – to dismiss/fire
    "1101": "Er erzählte uns eine lustige Geschichte aus seiner Kindheit.",         # erzählen – to tell/narrate
    "1111": "Die Arztpraxis befindet sich im Erdgeschoss des Gebäudes.",            # Erdgeschoss – ground floor
    "1112": "Die Geburt ihres Kindes war das schönste Ereignis in ihrem Leben.",   # Ereignis – event/occurrence
    "1113": "Ich habe erfahren, dass die Stelle bereits vergeben ist.",             # erfahren – to learn/find out
    "1114": "Sie hat viel Erfahrung im Umgang mit Kindern.",                       # Erfahrung – experience
    "1115": "Alexander Graham Bell hat das Telefon erfunden.",                      # erfinden – to invent
    "1116": "Die Erfindung des Internets hat die Welt verändert.",                 # Erfindung – invention
    "1117": "Nach langer Arbeit hatte das Projekt endlich großen Erfolg.",         # Erfolg – success
    "1118": "Sie ist eine sehr erfolgreiche Unternehmerin.",                       # erfolgreich – successful
    "1119": "Ein Führerschein ist für diese Stelle erforderlich.",                 # erforderlich – necessary/required
    "1121": "Sie hat ihren Traum erfüllt und ist Ärztin geworden.",               # erfüllen – to fulfill
    "1122": "Bitte ergänzen Sie die fehlenden Wörter im Text.",                    # ergänzen – to complement/add to
    "1123": "Das Ergebnis der Prüfung wird morgen bekanntgegeben.",               # Ergebnis – result/outcome
    "1124": "Ich habe heute eine E-Mail von meiner alten Freundin erhalten.",     # erhalten – to receive
    "1125": "Die Mieten in der Stadt wurden dieses Jahr erneut erhöht.",          # erhöhen – to raise/increase
    "1126": "Die Entscheidung, das Projekt abzubrechen, war sehr schwer.",        # Entscheidung – decision
    "1128": "Sie war entschlossen, das Studium trotz der Schwierigkeiten abzuschließen.", # entschlossen – determined
    "1129": "Entschuldigen Sie bitte, können Sie mir sagen, wo der Bahnhof ist?", # entschuldigen – to excuse/apologize
    "1130": "Entschuldigung, ich habe Ihren Namen vergessen.",                    # Entschuldigung – apology/excuse me
    "1131": "Den alten Fernseher muss man umweltgerecht entsorgen.",              # entsorgen – to dispose of
    "1132": "Nach der langen Wanderung haben wir uns am See entspannt.",          # entspannen – to relax
    "1133": "Beim Kochen entsteht manchmal viel Rauch, wenn man das Öl zu heiß erhitzt.", # entstehen – to arise
    "1134": "Es enttäuscht mich, dass du nicht zur Party gekommen bist.",         # enttäuschen – to disappoint
    "1135": "Die Enttäuschung war groß, als sie die Absage bekam.",               # Enttäuschung – disappointment
    "1136": "Entweder rufst du mich an, oder du schickst mir eine Nachricht.",   # entweder – either
    "1137": "Das Kind entwickelt sich gut und lernt schnell.",                    # entwickeln – to develop
    "1138": "Die Entwicklung neuer Technologien geht sehr schnell voran.",        # Entwicklung – development
    "1139": "Die Kinder spielen gerne draußen auf der Erde.",                     # Erde – earth/ground
    "1163": "Die neue App erleichtert das tägliche Planen erheblich.",            # erleichtern – to make easier
    "1164": "Studenten bekommen oft eine Ermäßigung beim Eintritt ins Museum.",   # Ermäßigung – discount/reduction
    "1165": "Eine ausgewogene Ernährung ist wichtig für die Gesundheit.",         # Ernährung – nutrition/diet
    "1166": "Das Gespräch über Geld war ernst, aber notwendig.",                  # ernst – serious
    "1167": "Er machte einen ernsthaften Versuch, seinen Fehler zu korrigieren.", # ernsthaft – serious/earnest
    "1168": "Im Herbst beginnt die Ernte der Äpfel und Weintrauben.",             # Ernte – harvest
    "1169": "Das neue Café wurde gestern im Stadtzentrum eröffnet.",              # eröffnen – to open/inaugurate
    "1170": "Die Eröffnung des neuen Theaters fand mit einem großen Fest statt.", # Eröffnung – opening/inauguration
    "1171": "Ich konnte den letzten Zug noch rechtzeitig erreichen.",             # erreichen – to reach/achieve
    "1172": "Nach dem langen Arbeitstag war sie völlig erschöpft.",               # erschöpft – exhausted
    "1173": "Der laute Knall hat mich mitten in der Nacht erschreckt.",           # erschrecken – to frighten/be startled
    "1174": "Das alte Gerät muss durch ein neueres Modell ersetzt werden.",       # ersetzen – to replace
    "1175": "Er brachte einen Ersatz mit, falls der Stift nicht funktioniert.",  # Ersatz – replacement/substitute
    "1176": "Ein Urlaub am Meer bietet perfekte Erholung vom Alltag.",           # Erholung – recovery/relaxation
    "1177": "Ich erinnere mich noch gut an meinen ersten Schultag.",             # erinnern – to remember
    "1178": "Diese Fotos wecken schöne Erinnerungen an unsere Reise.",           # Erinnerung – memory/reminder
    "1179": "Ich bin leider erkältet und bleibe heute zu Hause.",                # erkältet – having a cold
    "1180": "Mit einer Erkältung solltest du viel schlafen und Tee trinken.",    # Erkältung – cold (illness)
    "1181": "Ich habe ihn sofort an seiner Stimme erkannt.",                     # erkennen – to recognize
    "1182": "Kannst du mir bitte erklären, wie diese Maschine funktioniert?",   # erklären – to explain
    "1183": "Seine Erklärung war so klar, dass alle sofort verstanden haben.",  # Erklärung – explanation
    "1184": "Meine Eltern haben mir erlaubt, bis Mitternacht aufzubleiben.",    # erlauben – to allow/permit
    "1185": "Du brauchst eine Erlaubnis, um dieses Dokument zu unterschreiben.", # Erlaubnis – permission
    "1186": "Ich habe zum ersten Mal einen echten Schneesturm erlebt.",         # erleben – to experience
    "1187": "Das Konzert war für alle Besucher ein unvergessliches Erlebnis.",  # Erlebnis – experience/adventure
    "1200": "Dieses alte Telefon muss durch ein neues Modell ersetzt werden.",  # ersetzen – to replace
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

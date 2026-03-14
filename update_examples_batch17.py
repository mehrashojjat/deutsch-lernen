import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 17: IDs 4201–4268 (final batch)
updates = {
    "4201": "Es gibt noch freie Plätze im Kurs.",                                       # plätze
    "4202": "Ich bekomme nächste Woche mein Gehalt.",                                   # bekomme
    "4203": "Er muss früh aufstehen.",                                                   # muss
    "4204": "Er hat die Hausaufgaben gemacht.",                                          # gemacht
    "4205": "Er zündet ein Zündholz an, um die Kerze anzuzünden.",                     # Zündholz
    "4206": "Er kommt gut mit seinem neuen Kollegen zurecht.",                          # zurechtkommen
    "4207": "Er kommt zurück nach Hause.",                                              # zurück
    "4208": "Er ist zurzeit in Wien.",                                                   # zurzeit (dup)
    "4209": "Er sagte zu, zum Essen zu kommen.",                                        # zusagen
    "4210": "Sie essen zusammen zu Abend.",                                             # zusammen
    "4211": "Die Zusammenarbeit zwischen den Abteilungen läuft gut.",                   # Zusammenarbeit
    "4212": "Er fasst den Text in wenigen Sätzen zusammen.",                            # zusammenfassen
    "4213": "Er erklärt den Zusammenhang zwischen Ursache und Wirkung.",               # Zusammenhang
    "4214": "Er braucht zusätzliche Informationen.",                                    # zusätzlich
    "4215": "Er schaut dem Handwerker zu.",                                             # zuschauen
    "4216": "Die Zuschauer applaudieren laut.",                                         # Zuschauer
    "4217": "Eine Zuschauerin fragt nach dem Ende des Stücks.",                        # Zuschauerin
    "4218": "Für Gepäck über zehn Kilo gibt es einen Zuschlag.",                      # Zuschlag
    "4219": "Es war ein reiner Zufall, dass sie sich begegnet haben.",                 # Zufall
    "4220": "Er findet zufällig sein altes Tagebuch.",                                 # zufällig
    "4221": "Er ist mit seiner Arbeit sehr zufrieden.",                                # zufrieden
    "4222": "Der Zugang zum Gebäude ist nur mit Ausweis möglich.",                    # Zugang
    "4223": "Das Museum ist für alle zugänglich.",                                     # zugänglich
    "4224": "Er nimmt den Zug nach Frankfurt.",                                        # Zug
    "4225": "Es geht alles ruhig und ordentlich zu.",                                  # zugehen
    "4226": "Sein Zuhause ist eine gemütliche Wohnung.",                               # Zuhause
    "4227": "Er hört dem Dozenten aufmerksam zu.",                                     # zuhören
    "4228": "Die Zuhörer hörten gespannt zu.",                                         # Zuhörer
    "4229": "Eine Zuhörerin stellt eine Frage.",                                       # Zuhörerin
    "4230": "Er macht sich Sorgen um die Zukunft.",                                    # Zukunft
    "4231": "Zukünftige Probleme lassen sich jetzt noch lösen.",                      # zukünftig
    "4232": "Er kam zuletzt an der Prüfung durch.",                                    # zuletzt
    "4233": "Er macht die Tür zu.",                                                    # zumachen
    "4234": "Er kommt zumindest einmal pro Woche vorbei.",                            # zumindest
    "4235": "Zunächst liest er die Anleitung.",                                        # zunächst
    "4236": "Ich lerne jeden Tag Deutsch.",                                            # ich
    "4237": "Die Männer spielen Fußball im Park.",                                     # Männer
    "4238": "Ich komme gleich.",                                                       # komme
    "4239": "Er arbeitet und studiert gleichzeitig.",                                  # und
    "4240": "Er ist zu einer Party eingeladen.",                                       # eingeladen
    "4241": "Er hat gut gespielt.",                                                    # gespielt
    "4242": "Das Paar lebt getrennt.",                                                 # getrennt
    "4243": "Er schreibt einen Brief an seinen Freund.",                               # schreiben
    "4244": "Er fasst die wichtigsten Punkte zusammen.",                               # zusammenfassen (dup)
    "4245": "Er erklärt diesen Vorschlag ausführlich.",                               # diesen
    "4246": "Er braucht zusätzliche Zeit.",                                            # zusätzlich (dup)
    "4247": "Er schaut das Spiel im Fernsehen.",                                       # schaue
    "4248": "Er wünscht ihr eine gute Reise.",                                        # gute
    "4249": "Er gibt ihr das Buch.",                                                   # ihr
    "4250": "Das Buch hat mir gut gefallen.",                                          # gefallen
    "4251": "Wir haben uns zufällig getroffen.",                                       # getroffen
    "4252": "Er soll das Paket bekommen.",                                             # bekommen
    "4253": "Diese Aufgabe ist schwierig.",                                            # schwierig
    "4254": "Das Präfix en- gibt dem Wort eine neue Bedeutung.",                       # en- (contextual)
    "4255": "Er hat den Film schon gesehen.",                                          # gesehen
    "4256": "Er zweifelt an seiner Entscheidung.",                                     # zweifeln
    "4257": "Er hat keinen Zweifel, dass er recht hat.",                              # Zweifel
    "4258": "Er schneidet die Zwiebel in kleine Stücke.",                             # Zwiebel
    "4259": "Er wird gezwungen, das Formular zu unterschreiben.",                     # zwingen
    "4260": "Er fährt zu seinem Freund.",                                             # zu
    "4261": "Der Arzt prüft den Zustand des Patienten.",                             # Zustand
    "4262": "Er ist für den Einkauf zuständig.",                                     # zuständig
    "4263": "Er stimmt dem Plan zu.",                                                 # zustimmen
    "4264": "Er braucht die Zustimmung seiner Eltern.",                              # Zustimmung
    "4265": "Er kauft alle Zutaten für den Kuchen.",                                 # Zutaten
    "4266": "Er hat viele Freunde.",                                                  # haben
    "4267": "Er beschloss, umzukehren und nach Hause zu gehen.",                     # umzukehren
    "4268": "Die beiden Kinder spielen zusammen.",                                   # beiden
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

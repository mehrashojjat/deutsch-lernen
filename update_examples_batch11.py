import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 11: IDs 2701–2950
updates = {
    "2701": "Er muss jetzt gehen, bevor es zu spät ist.",                                   # gehen / sein
    "2702": "Als Pensionist verbringt er viel Zeit in seinem Garten.",                      # Pensionist
    "2703": "Sein Deutsch ist perfekt, man hört keinen Akzent.",                            # perfekt
    "2704": "Er möchte das Thema persönlich mit dem Chef besprechen.",                      # persönlich
    "2705": "Beim Einwohnermeldeamt muss man seine Personalien angeben.",                   # Personalien
    "2706": "Der Personenstand muss auf dem Formular korrekt eingetragen werden.",          # Personenstand
    "2707": "Das Personal des Hotels war freundlich und hilfsbereit.",                      # Personal
    "2708": "Sie brät das Ei in einer beschichteten Pfanne.",                               # Pfanne
    "2709": "Das Gemüse wurde fein geschnitten und in die Suppe gegeben.",                  # geschnitten
    "2710": "Er würde lieber zu Hause bleiben als ausgehen.",                               # lieber
    "2711": "Sie kommt jeden Dienstag zum Deutschkurs.",                                    # sie
    "2712": "Er hat das Abendessen selbst gemacht.",                                        # gemacht
    "2713": "Nach dem Unterricht gehen die Schüler nach Hause.",                           # nach
    "2714": "Die Reise ist für den Sommer geplant.",                                        # geplant
    "2715": "Wir haben genug Essen für alle Gäste vorbereitet.",                           # genug
    "2716": "Er hat das Studium ohne Unterbrechung angefangen.",                            # angefangen
    "2717": "Sie möchte einen Kaffee und ein Stück Kuchen.",                               # möchte
    "2718": "Er kommt aus der Schweiz.",                                                    # aus
    "2719": "Sie ist letzten Monat pensioniert worden.",                                    # pensioniert
    "2720": "Er muss sich online beim Kurs anmelden.",                                      # anmelden
    "2721": "Viele Leute besuchen das Musikfestival jedes Jahr.",                           # viele
    "2722": "Meine Mutter kocht immer sehr lecker.",                                        # meine
    "2723": "Er kann gut Spanisch sprechen.",                                               # sprechen
    "2724": "Das Mikrofon nimmt die Stimme klar und deutlich auf.",                        # aufnehmen
    "2725": "Bitte alle richtigen Antworten im Formular ankreuzen.",                       # ankreuzen
    "2726": "Er möchte nach dem Kurs noch etwas essen.",                                   # möchte (dup)
    "2727": "Die Praxis des Arztes ist montags bis freitags geöffnet.",                    # Praxis
    "2728": "Er übt Klavier in der Praxis täglich zwei Stunden.",                          # Praxis (dup)
    "2729": "Der Preis des Tickets ist dieses Jahr stark gestiegen.",                      # Preis
    "2730": "In diesem Supermarkt findet man viele preiswerte Produkte.",                  # preiswert
    "2731": "Die Presse berichtete ausführlich über den Skandal.",                         # Presse
    "2732": "Das war prima! Du hast das wirklich toll gemacht.",                           # prima
    "2733": "Er bevorzugt private Krankenversicherung gegenüber gesetzlicher.",           # privat
    "2734": "Das kostet fünf Euro pro Person.",                                             # pro
    "2735": "Sie möchte gerne das neue Restaurant probieren.",                             # probieren
    "2736": "Probier die Suppe mal, sie schmeckt ausgezeichnet.",                          # probieren (dup)
    "2737": "Das ist kein großes Problem, wir lösen es schnell.",                          # Problem
    "2738": "Die Fabrik produziert täglich tausend Autos.",                                # produzieren
    "2739": "Dieses Produkt ist umweltfreundlich und günstig.",                            # Produkt
    "2740": "Die Produktion wurde wegen Materialmangels unterbrochen.",                    # Produktion
    "2741": "Der Professor hält täglich Vorlesungen an der Universität.",                  # Professor
    "2742": "Als Profi weiß er genau, wie man mit schwierigen Situationen umgeht.",       # Profi
    "2743": "Der Politiker sprach über seine neuen wirtschaftlichen Pläne.",               # Politiker
    "2744": "Die Politikerin kämpft für bessere Bildung in der Region.",                  # Politikerin
    "2745": "Das ist eine politische Entscheidung, die alle betrifft.",                    # politisch
    "2746": "Die Polizei kam schnell nach dem Notruf.",                                    # Polizei
    "2747": "Der Polizist hielt das Auto an und kontrollierte die Papiere.",              # Polizist
    "2748": "Die Polizistin half dem verlorenen Kind, seine Eltern zu finden.",           # Polizistin
    "2749": "Er bestellt immer Pommes als Beilage zum Burger.",                            # Pommes
    "2750": "Dieser Sänger ist bei Jugendlichen sehr populär.",                            # populär
    "2751": "Sie packt ihre Schulsachen in die Tasche.",                                   # Tasche
    "2752": "Er bestellt eine große Portion Pasta mit Tomatensauce.",                      # Portion
    "2753": "Der Brief wurde heute mit der Post geschickt.",                                # Post
    "2754": "Bitte gib deine Postleitzahl ein, um den Versand zu berechnen.",             # Postleitzahl
    "2755": "Er macht ein Praktikum in einer großen Anwaltskanzlei.",                     # Praktikum
    "2756": "Der Praktikant übernimmt erste kleine Aufgaben im Büro.",                    # Praktikant
    "2757": "Die Praktikantin hilft bei der Organisation von Veranstaltungen.",           # Praktikantin
    "2758": "Dieses Tool ist sehr praktisch für tägliche Aufgaben.",                      # praktisch
    "2759": "Er soll das neue Projekt vor dem Team präsentieren.",                         # präsentieren
    "2760": "Er kaufte eine Eintrittskarte.",                                              # eine
    "2761": "Es gibt vieles, das ich noch lernen möchte.",                                 # vieles
    "2762": "Das Büro ist am Wochenende geschlossen.",                                    # geschlossen
    "2763": "Die Temperaturen sind im Sommer stark gestiegen.",                           # gestiegen
    "2764": "Das Essen war prima, ich habe alles aufgegessen.",                            # prima (dup)
    "2765": "Meine Schwester wohnt in München.",                                           # meine (dup)
    "2766": "Er kann fließend Englisch sprechen.",                                         # sprechen (dup)
    "2767": "Das war ein privates Gespräch, bitte erzähl es nicht weiter.",               # privat (dup)
    "2768": "Er hat das Buch einmal gelesen und verschenkt.",                              # einmal
    "2769": "Er ist müde, aber er macht weiter.",                                          # aber
    "2770": "Viele Studenten lernen Deutsch als Fremdsprache.",                            # viele (dup)
    "2771": "Er studiert Informatik an der Universität Köln.",                             # Universität
    "2772": "Wir reden über das Thema nächste Woche.",                                    # über
    "2773": "Es regnet heute den ganzen Tag.",                                             # es
    "2774": "Der Film ist bei Kindern sehr populär.",                                      # populär (dup)
    "2775": "Er kaufte ein neues Fahrrad.",                                                # ein
    "2776": "Er ist größer als sein jüngerer Bruder.",                                    # als
    "2777": "Die App ist praktisch und einfach zu bedienen.",                             # praktisch (dup)
    "2778": "Sie kauften ein Haus auf dem Land.",                                         # ein (dup)
    "2779": "Er schläft im Zug während der langen Fahrt.",                                # im
    "2780": "Er fuhr quer durch Deutschland von Nord nach Süd.",                          # quer
    "2781": "Bitte heb die Quittung auf, falls du das Produkt zurückgeben musst.",       # Quittung
    "2782": "Das Quiz im Unterricht hat Spaß gemacht.",                                   # Quiz
    "2783": "Er bekommt zehn Prozent Rabatt als Stammkunde.",                             # Rabatt
    "2784": "Er fährt jeden Tag mit dem Rad zur Arbeit.",                                 # Rad
    "2785": "Als Radfahrer kennt er alle Fahrradwege in der Stadt.",                      # Radfahrer
    "2786": "Die Radfahrerin trägt immer einen Helm.",                                    # Radfahrerin
    "2787": "Er hört morgens immer Nachrichten im Radio.",                               # Radio
    "2788": "Das Buch steht am Rand des Regals.",                                         # Rand
    "2789": "Er mäht jeden Samstag den Rasen im Garten.",                                # Rasen
    "2790": "Er rasiert sich jeden Morgen vor dem Frühstück.",                           # rasieren
    "2791": "Ich rate dir, mehr Wasser zu trinken.",                                     # raten
    "2792": "Er bat seinen Vater um Rat bei der Entscheidung.",                          # Rat
    "2793": "Das Rätsel war schwer, aber er hat es gelöst.",                             # Rätsel
    "2794": "Der Bürgermeister arbeitet im Rathaus.",                                    # Rathaus
    "2795": "Er raucht trotz ärztlichem Rat immer noch.",                                # rauchen
    "2796": "Die Profisportlerin trainiert täglich mehrere Stunden.",                    # Profisportlerin
    "2797": "Das Programm beginnt um zwanzig Uhr.",                                      # Programm
    "2798": "Das Projekt muss bis Ende des Monats abgeschlossen sein.",                  # Projekt
    "2799": "Der Prospekt zeigt alle Angebote des Reiseveranstalters.",                  # Prospekt
    "2800": "Die Bürger protestierten gegen die geplante Straße.",                       # protestieren
    "2801": "Der Protest gegen die Schließung des Krankenhauses war laut.",              # Protest
    "2802": "Der Prozess dauerte mehrere Monate bis zum Urteil.",                        # Prozess
    "2803": "Er muss die Ausweise der Besucher prüfen.",                                 # prüfen
    "2804": "Der Techniker hat alle Geräte geprüft.",                                    # geprüft
    "2805": "Die Prüfung findet am Freitag um neun Uhr statt.",                         # Prüfung
    "2806": "Das Publikum applaudierte nach der Vorstellung laut.",                      # Publikum
    "2807": "Er zieht einen warmen Pullover an, weil es kalt ist.",                     # Pullover
    "2808": "Der Lehrer machte einen Punkt auf dem Whiteboard.",                         # Punkt
    "2809": "Er ist immer pünktlich zu Meetings.",                                       # pünktlich
    "2810": "Das Kind spielt den ganzen Tag mit seiner Puppe.",                          # Puppe
    "2811": "Er putzt jeden Morgen die Zähne.",                                          # putzen
    "2812": "Er braucht bestimmte Qualifikationen für diesen Job.",                      # Qualifikation
    "2813": "Die Qualität dieser Produkte ist sehr hoch.",                               # Qualität
    "2814": "Er hat das ganze Buch in einer Nacht gelesen.",                             # ganze
    "2815": "Er geht zur Arbeit.",                                                        # zur
    "2816": "Sie gehen jeden Freitag auf den Markt, um frisches Gemüse zu kaufen.",     # kaufen
    "2817": "Er hat das dreimal wiederholt.",                                            # mal
    "2818": "Ich rate euch, frühzeitig am Bahnhof zu sein.",                            # raten (dup)
    "2819": "Ich habe vergessen, das Licht auszumachen.",                               # habe
    "2820": "Er kaufte einen neuen Laptop für die Arbeit.",                             # einen
    "2821": "Er trifft sie am Nachmittag am Bahnhof.",                                  # am
    "2822": "Er arbeitet und verdient sein Geld selbst.",                               # und
    "2823": "Das Paket ist von einem Freund in Berlin.",                                # von
    "2824": "Er hat die Fahrprüfung beim ersten Versuch bestanden.",                    # bestanden
    "2825": "Wir haben schon mit dem Chef gesprochen.",                                 # gesprochen
    "2826": "Sie putzt die Wohnung vor dem Besuch der Eltern.",                         # putzen (dup)
    "2827": "Er redet gerne über Fußball.",                                              # reden
    "2828": "Die Rede des Bürgermeisters dauerte eine halbe Stunde.",                   # Rede
    "2829": "Der Händler reduzierte die Preise zum Ende der Saison.",                   # reduzieren
    "2830": "Er hält nächste Woche ein Referat über den Klimawandel.",                  # Referat
    "2831": "Das Kochbuch steht im Regal neben dem Herd.",                              # Regal
    "2832": "Es gibt eine Regel: Handy aus während des Unterrichts.",                   # Regel
    "2833": "Er schläft regelmäßig acht Stunden pro Nacht.",                            # regelmäßig
    "2834": "Die Angelegenheit wurde freundschaftlich geregelt.",                        # regeln
    "2835": "Es hat die ganze Nacht geregnet.",                                          # regnen
    "2836": "Der Regen hört nicht auf.",                                                  # Regen
    "2837": "Diese Region im Süden ist für ihren Wein bekannt.",                        # Region
    "2838": "Regional produzierte Lebensmittel sind frischer.",                         # regional
    "2839": "Er ist reich und kann sich alles leisten.",                                 # reich
    "2840": "Das Geld reicht nicht für den ganzen Monat.",                              # reichen
    "2841": "Die Äpfel sind jetzt reif und bereit zum Pflücken.",                       # reif
    "2842": "Der Reifen des Autos war platt und musste gewechselt werden.",             # Reifen
    "2843": "Er saß in der ersten Reihe beim Konzert.",                                 # Reihe
    "2844": "Die Raucherin versuchte, mit dem Rauchen aufzuhören.",                     # Raucherin
    "2845": "Der Raum war voller Menschen.",                                              # Raum
    "2846": "Geh raus, die Luft ist frisch heute.",                                     # raus
    "2847": "Er reagierte ruhig auf die schlechten Neuigkeiten.",                       # reagieren
    "2848": "Die Reaktion auf das neue Gesetz war gemischt.",                            # Reaktion
    "2849": "Das Vorhaben konnte leider nicht realisiert werden.",                      # realisieren
    "2850": "In der Realität ist es schwieriger als geplant.",                          # Realität
    "2851": "Sein Plan ist realistisch und gut durchdacht.",                            # realistisch
    "2852": "Für das Projekt braucht er ausführliche Recherche.",                       # Recherche
    "2853": "Er rechnet schnell im Kopf, ohne Taschenrechner.",                         # rechnen
    "2854": "Der Rechner in der Schule ist sehr langsam.",                              # Rechner
    "2855": "Die Rechnung vom Restaurant ist höher als erwartet.",                      # Rechnung
    "2856": "Jeder hat das Recht auf Bildung.",                                          # Recht
    "2857": "Die rechtlichen Grundlagen müssen geklärt werden.",                        # rechtlich
    "2858": "Du hast recht, das war ein Fehler.",                                       # recht
    "2859": "An der Kreuzung muss er rechts abbiegen.",                                 # rechts
    "2860": "Er fand den Hinweis sehr recht.",                                           # recht (dup)
    "2861": "Er ist nie pünktlich zu Verabredungen.",                                   # pünktlich (dup)
    "2862": "Das Ticket war stark reduziert.",                                           # reduziert
    "2863": "Sie bestellten eine Flasche Wasser.",                                       # eine
    "2864": "Du musst die Verkehrsregeln immer beachten.",                              # beachten
    "2865": "Er kommt aus einer kleinen Stadt in Bayern.",                              # aus
    "2866": "Er nimmt täglich eine Aspirin-Tablette.",                                  # nehmen
    "2867": "Er gibt dem Lehrer den Aufsatz.",                                          # den
    "2868": "Es hat gestern den ganzen Tag geregnet.",                                  # geregnet
    "2869": "Sie fahren morgen früh los.",                                               # fahren
    "2870": "Er hilft ihr.",                                                              # mir
    "2871": "Er sitzt gern in der Sonne.",                                               # sitzen
    "2872": "Komm rauf, wir sind oben!",                                                 # rauf
    "2873": "Er hat schon alles für die Reise vorbereitet.",                            # schon
    "2874": "Er weiß nicht, wie er das Problem lösen soll.",                            # to (contextual)
    "2875": "Es ist noch Milch im Kühlschrank.",                                        # noch
    "2876": "Er hat nicht genug Zeit für alles.",                                       # nicht
    "2877": "Das ist nicht das, was ich erwartet habe.",                               # nicht (dup)
    "2878": "Sie haben viel Geld haben.",                                               # haben
    "2879": "Er kommt gerne vorbei, wenn er in der Nähe ist.",                         # vorbeikomme
    "2880": "Biegen Sie an der Ampel rechts ab.",                                       # rechts (dup)
    "2881": "Er hat sich den Arm gebrochen.",                                           # gebrochen
    "2882": "Die Reportage über das Leben in der Arktis war sehr beeindruckend.",      # Reportage
    "2883": "Der Reporter stellte dem Politiker schwierige Fragen.",                   # Reporter
    "2884": "Die Reporterin interviewte die Überlebenden des Unfalls.",                # Reporterin
    "2885": "Er hat einen Tisch im Restaurant für Samstag reserviert.",                # reservieren
    "2886": "Die Reservierung wurde online bestätigt.",                                  # Reservierung
    "2887": "Er genießt großen Respekt bei seinen Kollegen.",                           # Respekt
    "2888": "Der Rest der Gruppe kam später an.",                                        # Rest
    "2889": "Das Restaurant in der Altstadt hat ausgezeichnetes Essen.",               # Restaurant
    "2890": "Der Feuerwehrmann rettete das Kind aus dem brennenden Haus.",             # retten
    "2891": "Der Arzt schrieb ein Rezept für Antibiotika.",                            # Rezept
    "2892": "Bitte melden Sie sich an der Rezeption an.",                              # Rezeption
    "2893": "Verben haben im Infinitiv die Endung -en.",                               # -en (contextual)
    "2894": "Der Richter verkündete das Urteil am Ende des Prozesses.",               # Richter
    "2895": "Die Richterin legte großen Wert auf Gerechtigkeit.",                      # Richterin
    "2896": "Er macht alles richtig und ohne Fehler.",                                  # richtig
    "2897": "In welcher Richtung liegt der Bahnhof?",                                  # Richtung
    "2898": "Er riecht die frischen Blumen sofort.",                                   # riechen
    "2899": "Er schenkte ihr einen goldenen Ring zum Jubiläum.",                       # Ring
    "2900": "Das Wasser soll rein und ohne Chemikalien sein.",                         # rein
    "2901": "Er reinigt regelmäßig seine Brille.",                                     # reinigen
    "2902": "Er bringt seinen Anzug zur Reinigung.",                                   # Reinigung
    "2903": "Er kocht Reis mit Gemüse als Beilage.",                                   # Reis
    "2904": "Sie reist gerne nach Asien.",                                              # reisen
    "2905": "Die Reise nach Spanien war wunderschön.",                                  # Reise
    "2906": "Er buchte die Reise beim Reisebüro in der Innenstadt.",                   # Reisebüro
    "2907": "Sie reitet jeden Morgen auf ihrem Pferd.",                                # reiten
    "2908": "Die Reklame im Fernsehen war sehr kreativ.",                               # Reklame
    "2909": "Der Sportler hat einen neuen Rekord aufgestellt.",                        # Rekord
    "2910": "Er bekommt eine monatliche Rente vom Staat.",                             # Rente
    "2911": "Er arbeitet bei einem Unternehmen in der Innenstadt.",                    # in
    "2912": "Sie ist seit zwei Jahren pensioniert.",                                    # pensioniert (dup)
    "2913": "Der Rentner verbringt seinen Urlaub in Italien.",                         # Rentner
    "2914": "Die Rentnerin engagiert sich als Ehrenamtliche im Verein.",               # Rentnerin
    "2915": "Er gibt das Auto in die Werkstatt, um es reparieren zu lassen.",         # reparieren
    "2916": "Ich habe den Film schon gesehen.",                                         # gesehen
    "2917": "Er bringt seiner Frau Blumen mit.",                                       # bringen
    "2918": "Er hat sein Ziel trotz aller Schwierigkeiten erreicht.",                  # erreicht
    "2919": "Er gibt dir das Buch zurück.",                                             # dir
    "2920": "Du kannst mich jederzeit anrufen.",                                       # du
    "2921": "Wir haben schon mit dem Kunden gesprochen.",                              # gesprochen (dup)
    "2922": "Die frischen Blumen riechen wunderbar.",                                  # riechen (dup)
    "2923": "Das Konzert war riesig groß und hatte tausende Besucher.",               # riesig
    "2924": "Er hat seinen alten Freund nach Jahren wiedergefunden.",                  # wiedergefunden
    "2925": "Er trinkt jeden Abend ein Glas Wasser vor dem Schlafen.",                # trinken
    "2926": "Er lässt die Kinder draußen spielen.",                                    # lassen
    "2927": "Das Hotel war sehr teuer, aber sehr komfortabel.",                        # teuer
    "2928": "Er hat das Hotelzimmer gebucht.",                                         # gebucht
    "2929": "Er hat seinen neuen Chef beim Meeting kennengelernt.",                    # kennengelernt
    "2930": "Er hat das Ticket bereits gebucht.",                                      # gebucht (dup)
    "2931": "Der Vortrag war sehr informativ.",                                         # sehr
    "2932": "Es ist wichtig, täglich Deutsch zu üben.",                                # wichtig
    "2933": "Er möchte mehr über das Thema erfahren.",                                 # mehr
    "2934": "Die Rundfahrt durch die Altstadt dauerte zwei Stunden.",                  # Rundfahrt
    "2935": "Der Saal war für die Feier festlich dekoriert.",                          # Saal
    "2936": "Das ist keine Kleinigkeit, das ist eine ernste Sache.",                   # Sache
    "2937": "Er trägt die Einkäufe in einem großen Sack nach Hause.",                 # Sack
    "2938": "Er trinkt mittags immer einen frischen Orangensaft.",                     # Saft
    "2939": "Was hast du gesagt? Ich habe dich nicht gehört.",                        # sagen
    "2940": "Er hat die Bücher auf den Tisch gelegt.",                                 # die
    "2941": "Die Saison für Erdbeeren beginnt im Mai.",                                # Saison
    "2942": "Er bestellt einen gemischten Salat als Vorspeise.",                       # Salat
    "2943": "Der Arzt empfahl eine Salbe gegen das Ekzem.",                            # Salbe
    "2944": "Das Essen braucht noch etwas Salz.",                                      # Salz
    "2945": "Die Suppe ist sehr salzig.",                                               # salzig
    "2946": "Er sammelt alte Briefmarken als Hobby.",                                   # sammeln
    "2947": "Sämtliche Dokumente müssen bis Freitag eingereicht werden.",              # sämtliche
    "2948": "Die Kinder bauten eine große Sandburg am Strand.",                        # Sand
    "2949": "Sie hat eine zentrale Rolle in dem Theaterstück.",                        # Rolle
    "2950": "Er liest gerade einen spannenden Roman.",                                  # Roman
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

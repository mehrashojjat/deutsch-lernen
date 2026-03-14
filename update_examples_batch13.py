import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 13: IDs 3201–3450
updates = {
    "3201": "Die Sicherheit der Passagiere hat oberste Priorität.",                          # Sicherheit
    "3202": "Er sichert täglich seine Daten auf einer externen Festplatte.",                # sichern
    "3203": "Er hat sich das Bein beim Skifahren gebrochen.",                               # Bein
    "3204": "Er freut sich auf das Wiedersehen mit seiner Familie.",                        # freuen
    "3205": "Im Büro siezt man sich.",                                                       # siezen
    "3206": "Er ist erkältet und bleibt zuhause.",                                          # erkältet
    "3207": "Er wohnt schon lange in dieser Stadt.",                                        # lange
    "3208": "Er sitzt hinten im Bus.",                                                       # hinten
    "3209": "Das Geschenk ist fürs neue Jahr.",                                             # fürs
    "3210": "Er kann gut Deutsch sprechen.",                                                 # kann
    "3211": "Er hat mich heute angerufen.",                                                  # mich
    "3212": "Jetzt ist der richtige Moment, um zu handeln.",                                # jetzt
    "3213": "Das ist nicht die richtige Adresse.",                                          # nicht
    "3214": "Er möchte seine Großeltern am Wochenende besuchen.",                          # besuchen
    "3215": "Er schickt das Paket per Express.",                                             # per
    "3216": "Bitte nachsenden, falls der Empfänger umgezogen ist.",                        # nachsenden
    "3217": "Er fährt immer mit dem Zug zur Arbeit.",                                       # mit
    "3218": "Er kommt statt um neun erst um zehn.",                                        # statt
    "3219": "Das Museum ist dienstags bis sonntags geöffnet.",                             # geöffnet
    "3220": "Er hat soviel gelernt, dass er die Prüfung bestanden hat.",                   # soviel
    "3221": "So machen wir das.",                                                            # so
    "3222": "Er kommt sowieso nicht pünktlich.",                                            # sowieso
    "3223": "Sowohl er als auch seine Schwester sprechen Englisch.",                       # sowohl
    "3224": "Der Sozialarbeiter hilft Familien in schwierigen Situationen.",               # Sozialarbeiter
    "3225": "Die Sozialarbeiterin betreut obdachlose Jugendliche.",                        # Sozialarbeiterin
    "3226": "Das Buch ist sehr spannend und man kann es kaum weglegen.",                   # spannend
    "3227": "Er spart jeden Monat einen Teil seines Gehalts.",                             # sparen
    "3228": "Er hat in diesem Jahr viel Geld gespart.",                                    # gespart
    "3229": "Sie ist sehr sparsam und kauft nur das Nötigste.",                            # sparsam
    "3230": "Das Spiel hat uns viel Spaß gemacht.",                                        # Spaß
    "3231": "Er kommt immer zu spät zu Meetings.",                                         # spät
    "3232": "Der Antrag muss spätestens bis Freitag eingereicht werden.",                  # spätestens
    "3233": "Sie gehen jeden Abend spazieren.",                                             # spazieren
    "3234": "Er geht gerne im Park spazieren.",                                             # spazieren (dup)
    "3235": "Nach dem Essen macht er einen kurzen Spaziergang.",                           # Spaziergang
    "3236": "Er speichert alle wichtigen Dateien in der Cloud.",                           # speichern
    "3237": "Er spricht leise, sodass die anderen schlafen können.",                       # sodass
    "3238": "Er liegt auf dem Sofa und schaut fern.",                                      # Sofa
    "3239": "Bitte komm sofort, es ist dringend!",                                         # sofort
    "3240": "Das ist die sogenannte grüne Energie.",                                       # sogenannt
    "3241": "Er spricht sogar besser Deutsch als sein Lehrer.",                            # sogar
    "3242": "Sein Sohn studiert Medizin an der Universität.",                              # Sohn
    "3243": "Solange er lebt, wird er nie aufhören zu lernen.",                           # solange
    "3244": "Solche Fehler sollte man vermeiden.",                                         # solch
    "3245": "Er soll morgen früh im Büro sein.",                                           # sollen
    "3246": "Er hätte das früher machen gesollt.",                                        # gesollt
    "3247": "Er nutzt das Sonderangebot, um günstig einzukaufen.",                        # Sonderangebot
    "3248": "Er ist nicht traurig, sondern glücklich.",                                    # sondern
    "3249": "Die Sonne scheint heute den ganzen Tag.",                                     # Sonne
    "3250": "Das Wetter ist sonnig und warm.",                                              # sonnig
    "3251": "Er muss aufpassen, sonst verpasst er den Zug.",                              # sonst
    "3252": "Er sorgt dafür, dass alles rechtzeitig fertig ist.",                         # sorgen
    "3253": "Sie macht sich Sorgen um ihren kranken Vater.",                              # Sorge
    "3254": "Die Soße zum Steak war fantastisch.",                                         # Soße / Sauce
    "3255": "Heute hat er keine Schule.",                                                  # heute
    "3256": "Das Wetter ist heute schlecht.",                                              # schlecht
    "3257": "Er unterschreibt den Vertrag.",                                               # unterschreiben
    "3258": "Er versucht, mehr Geld zu sparen.",                                           # sparen (dup)
    "3259": "Das Konzert war sehr laut.",                                                  # sehr
    "3260": "Er hat das ganze Budget verbraucht.",                                         # verbraucht
    "3261": "Ich gehe jetzt einkaufen.",                                                   # ich
    "3262": "Er ist besonders gut in Mathematik.",                                         # besonders
    "3263": "Er möchte Arzt werden.",                                                      # werden
    "3264": "Er ist schon früh gegangen.",                                                 # gegangen
    "3265": "Die Schule beginnt ab dem ersten September.",                                 # ab
    "3266": "Das genannte Dokument liegt im Büro.",                                        # genannte
    "3267": "Er hat sogar den schwierigsten Teil gelöst.",                                 # sogar (dup)
    "3268": "Er legt das Buch auf den Tisch.",                                             # auf
    "3269": "Er kommt morgen Abend an.",                                                   # morgen
    "3270": "Er ist einverstanden mit dem Plan.",                                          # einverstanden
    "3271": "Der Preis wurde stark reduziert.",                                            # reduziert
    "3272": "Er isst kein Fleisch, sondern nur Gemüse.",                                  # sondern (dup)
    "3273": "Das Wetter scheint sich zu verbessern.",                                      # scheint
    "3274": "Das Hotel lag zentral gelegen.",                                              # gelegen
    "3275": "Er geht jeden Tag zur Arbeit.",                                               # er
    "3276": "Er hat zu wenig Zeit.",                                                       # zu
    "3277": "Er hat keine Zeit.",                                                           # keine
    "3278": "Der Sportler springt über die Hürde.",                                       # springen
    "3279": "Der Arzt gibt ihm eine Spritze gegen die Schmerzen.",                        # Spritze
    "3280": "Nach dem Essen spült er das Geschirr.",                                      # spülen
    "3281": "Die Polizei folgt der Spur des Verdächtigen.",                               # Spur
    "3282": "Er spürt, dass etwas nicht stimmt.",                                         # spüren
    "3283": "Das neue Stadion fasst fünfzigtausend Zuschauer.",                           # Stadion
    "3284": "Die Stadt hat viele Parks und Grünflächen.",                                 # Stadt
    "3285": "Die städtische Bibliothek ist kostenlos nutzbar.",                           # städtisch
    "3286": "Mit dem Stadtplan findet er sich gut zurecht.",                              # Stadtplan
    "3287": "Er stammt aus einer kleinen Stadt in Bayern.",                               # stammen
    "3288": "Er telefoniert ständig während der Arbeitszeit.",                            # ständig
    "3289": "Er erklärt seinen Standpunkt klar und deutlich.",                            # Standpunkt
    "3290": "Der Star wurde am Flughafen von vielen Fans empfangen.",                    # Star
    "3291": "Das Rennen startet um zehn Uhr.",                                            # starten
    "3292": "Er schaut die Speisekarte durch und bestellt dann.",                         # Speisekarte
    "3293": "Im Speisewagen des Zuges gibt es warmes Essen.",                            # Speisewagen
    "3294": "Er ist ein Spezialist auf dem Gebiet der Herzchirurgie.",                   # Spezialist
    "3295": "Die Spezialistin berät die Patienten bei komplexen Fällen.",                # Spezialistin
    "3296": "Dieser Kurs ist speziell für Anfänger konzipiert.",                         # speziell
    "3297": "Er schaut in den Spiegel bevor er das Haus verlässt.",                      # Spiegel
    "3298": "Das Spiel beginnt um sieben Uhr abends.",                                   # Spiel
    "3299": "Der Spieler schoss das entscheidende Tor.",                                  # Spieler
    "3300": "Die Spielerin gewann das Turnier mit großem Abstand.",                      # Spielerin
    "3301": "Kinder spielen nachmittags auf dem Spielplatz.",                            # Spielplatz
    "3302": "Er kauft ein neues Spielzeug für sein Kind.",                               # Spielzeug
    "3303": "Der spitze Bleistift ist ideal zum Schreiben.",                             # spitz
    "3304": "Er treibt jeden Tag Sport.",                                                 # Sport
    "3305": "Schwimmen ist eine beliebte Sportart.",                                     # Sportart
    "3306": "Der Sportler trainiert täglich mehrere Stunden.",                           # Sportler
    "3307": "Die Sportlerin hat eine Goldmedaille gewonnen.",                            # Sportlerin
    "3308": "Er ist sehr sportlich und läuft jeden Morgen.",                             # sportlich
    "3309": "Deutsch ist eine wichtige Sprache in Europa.",                              # Sprache
    "3310": "Er lernt Spanisch als Fremdsprache.",                                       # Fremdsprache
    "3311": "Seine Muttersprache ist Arabisch.",                                         # Muttersprache
    "3312": "Er spricht Deutsch als Zweitsprache.",                                      # Zweitsprache
    "3313": "Sie sprechen täglich miteinander.",                                         # sprechen
    "3314": "Er ist gegen Lärm in der Bibliothek.",                                     # gegen
    "3315": "Er geht jeden Tag zur Schule.",                                             # gehen
    "3316": "Er wohnt in der Stadt direkt am Fluss.",                                    # Stadt (dup)
    "3317": "Die Donau fließt durch Wien.",                                              # Donau
    "3318": "Seiner Meinung nach ist das die beste Lösung.",                            # meiner
    "3319": "Du hast recht, das war ein Fehler.",                                        # recht
    "3320": "Er ist besonders gut in Fremdsprachen.",                                    # besonders (dup)
    "3321": "Der Arzt verschreibt ihm ein Medikament gegen Kopfschmerzen.",             # verschreiben
    "3322": "Er ist sehr geschickt mit Technik.",                                        # geschickt
    "3323": "Das Geschenk ist für seine Mutter.",                                        # für
    "3324": "Er kann Deutsch und Englisch sprechen.",                                    # können
    "3325": "Er hat vier Kinder.",                                                        # vier
    "3326": "Bildung ist eine wichtige Grundlage für Erfolg.",                          # -ung (contextual)
    "3327": "Er spricht sehr gut Deutsch.",                                              # sprechen (dup)
    "3328": "Er warf einen Stein ins Wasser.",                                           # Stein
    "3329": "Er bewirbt sich auf eine freie Stelle als Buchhalter.",                    # Stelle
    "3330": "Er stellt das Gepäck neben die Tür.",                                      # stellen
    "3331": "Er bringt den Brief zur Post und lässt ihn stempeln.",                    # Stempel
    "3332": "Er ist krank und befürchtet, dass er bald sterben könnte.",               # sterben
    "3333": "Sein Vater ist letztes Jahr gestorben.",                                   # gestorben
    "3334": "Am Abend leuchten die Sterne am Himmel.",                                  # Stern
    "3335": "Er zahlt jeden Monat seine Steuern pünktlich.",                           # Steuer
    "3336": "Die Stewardess erklärt die Sicherheitsregeln im Flugzeug.",               # Stewardess
    "3337": "Er braucht einen neuen Stift, weil der alte leer ist.",                   # Stift
    "3338": "Der Text hat einen stilistischen Fehler.",                                 # stilistisch
    "3339": "Er ist still und stört niemanden.",                                        # still
    "3340": "Er braucht feste Stiefel für die Wanderung.",                             # Stiefel
    "3341": "Die Station ist fünf Minuten vom Hotel entfernt.",                        # Station
    "3342": "Die Statistik zeigt, dass die Preise gestiegen sind.",                   # Statistik
    "3343": "Er analysiert die statistischen Daten des Projekts.",                    # statistisch
    "3344": "Er kommt statt um acht erst um neun.",                                    # statt (dup)
    "3345": "Das Konzert findet nächste Woche statt.",                                 # stattfinden
    "3346": "Wegen des Staus kommt er zu spät zur Arbeit.",                            # Stau
    "3347": "Er wischt den Staub von den Regalen.",                                    # Staub
    "3348": "Er staubsaugt jeden Samstag die Wohnung.",                                # staubsaugen
    "3349": "Die Biene sticht ihn in die Hand.",                                       # stechen
    "3350": "Er steckt den Schlüssel in das Schloss.",                                 # stecken
    "3351": "Er sucht eine freie Steckdose, um das Handy zu laden.",                  # Steckdose
    "3352": "Der Stecker passt nicht in die Steckdose.",                               # Stecker
    "3353": "Er steht jeden Morgen um sechs Uhr auf.",                                 # stehen
    "3354": "Jemand hat sein Fahrrad gestohlen.",                                      # stehlen
    "3355": "Die Preise steigen jedes Jahr.",                                          # steigen
    "3356": "Das ist nicht möglich.",                                                   # nicht (dup)
    "3357": "Das ist nicht richtig.",                                                   # nicht (dup)
    "3358": "Er hat schon gegessen.",                                                   # schon
    "3359": "Kannst du bitte leiser sein?",                                             # leiser
    "3360": "Wir möchten eine Reservierung machen.",                                   # möchten
    "3361": "Er hat die Vase auf den Tisch gestellt.",                                 # gestellt
    "3362": "Er ist der letzte in der Schlange.",                                       # letzter
    "3363": "Er muss heute noch die Rechnung zahlen.",                                 # zahlen
    "3364": "Er lernt und schläft regelmäßig.",                                        # und
    "3365": "Die Mieten steigen in der Stadt immer weiter.",                           # steigen (dup)
    "3366": "Er sitzt gerne draußen im Café.",                                         # sitzen
    "3367": "Er steigt an der nächsten Haltestelle aus.",                             # aussteigen
    "3368": "Er kauft eine Tageszeitung.",                                             # eine
    "3369": "Er trifft sie am Bahnhof.",                                               # am
    "3370": "Er arbeitet noch an dem Bericht.",                                        # noch
    "3371": "Er gibt den Kindern das Geld.",                                            # den
    "3372": "Er aß das Abendessen alleine.",                                            # ass
    "3373": "Komm doch mal vorbei!",                                                    # doch
    "3374": "Der Stecker steckt in der Steckdose.",                                    # steckt
    "3375": "Das Buch liegt auf dem Tisch.",                                            # auf
    "3376": "Er hat schon alles vorbereitet.",                                          # schon (dup)
    "3377": "Die Temperatur ist stark gestiegen.",                                      # gestiegen
    "3378": "Die Mitarbeiter streiken für höhere Löhne.",                              # streiken
    "3379": "Der Streik der Busfahrer dauerte drei Tage.",                             # Streik
    "3380": "Die zwei Brüder streiten ständig miteinander.",                           # streiten
    "3381": "Der Streit zwischen den Nachbarn wurde schließlich beigelegt.",          # Streit
    "3382": "Der Lehrer ist streng, aber gerecht.",                                    # streng
    "3383": "Er leidet unter Stress bei der Arbeit.",                                  # Stress
    "3384": "Der Strom ist ausgefallen.",                                               # Strom
    "3385": "Er hängt die nassen Strümpfe zum Trocknen auf.",                         # Strumpf
    "3386": "Er schneidet sich ein Stück Kuchen ab.",                                  # Stück / -stück
    "3387": "Die Studie zeigt den Zusammenhang zwischen Schlaf und Gesundheit.",      # Studie
    "3388": "Er studiert Informatik an der Technischen Universität.",                 # studieren
    "3389": "Der Student liest die ganze Nacht für die Prüfung.",                     # Student
    "3390": "Die Studentin hat eine Eins in ihrer Abschlussarbeit bekommen.",         # Studentin
    "3391": "Die Studierenden diskutieren über aktuelle politische Themen.",          # Studierende (male)
    "3392": "Die Studierende engagiert sich im Studentenrat.",                        # Studierende (female)
    "3393": "Das Studium dauert in Deutschland mindestens drei Jahre.",               # Studium
    "3394": "Das Studio hat modernste Aufnahmeausrüstung.",                           # Studio
    "3395": "Er ist eine Stufe weiter im Sprachkurs.",                                # Stufe
    "3396": "Er zieht einen Stuhl an den Tisch und setzt sich.",                     # Stuhl
    "3397": "Das stimmt, du hast völlig recht.",                                       # stimmen
    "3398": "Die Stimmung auf der Party war ausgelassen.",                             # Stimmung
    "3399": "Er wohnt im dritten Stock.",                                              # Stock
    "3400": "Das Büro befindet sich im zweiten Stockwerk.",                           # Stockwerk
    "3401": "Das Kleid ist aus einem weichen Stoff gemacht.",                         # Stoff
    "3402": "Er ist stolz auf seinen Sohn.",                                           # stolz
    "3403": "Das Auto stoppt an der roten Ampel.",                                    # stoppen
    "3404": "Bitte stör mich nicht beim Lernen.",                                     # stören
    "3405": "Es gab eine Störung im Netz.",                                            # Störung
    "3406": "Er stößt aus Versehen die Vase um.",                                     # stoßen
    "3407": "Als Strafe muss er nachsitzen.",                                          # Strafe
    "3408": "Das Fahren ohne Führerschein ist strafbar.",                             # strafbar
    "3409": "Er bekommt einen Strafzettel, weil er falsch geparkt hat.",             # Strafzettel
    "3410": "Sie verbringen den Urlaub am Strand.",                                   # Strand
    "3411": "Er wohnt in einer ruhigen Straße.",                                      # Straße
    "3412": "Die Straßenbahn fährt alle zehn Minuten.",                              # Straßenbahn
    "3413": "Die Strecke von München nach Berlin ist sehr lang.",                    # Strecke
    "3414": "Er strengt sich täglich an, um besser zu werden.",                      # strengen
    "3415": "Er spart Geld für den Urlaub.",                                          # sparen (dup)
    "3416": "Arbeitslosigkeit ist ein ernstes Problem.",                              # -losigkeit (contextual)
    "3417": "Er hat ein abgeschlossenes Studium in Wirtschaft.",                     # abgeschlossenes
    "3418": "Er bietet Online-Kurse an.",                                             # kurse
    "3419": "Er ist stumm und kommuniziert mit Gebärdensprache.",                    # stumm
    "3420": "Heute geht es ihm besser als gestern.",                                  # besser
    "3421": "Das Wetter war gestern gut.",                                             # war
    "3422": "Er trifft sie bei der Arbeit.",                                           # bei (dup)
    "3423": "Das Geräusch stört ihn beim Schlafen.",                                  # stört
    "3424": "Ich habe das Formular ausgefüllt.",                                       # habe
    "3425": "Er hat das Auto vor dem Eingang geparkt.",                               # geparkt
    "3426": "Er ist schon nach Hause gegangen.",                                       # gegangen (dup)
    "3427": "Er schaut in die Tabelle, um die Ergebnisse zu vergleichen.",           # Tabelle
    "3428": "Der Arzt empfiehlt ihm, die Tablette täglich zu nehmen.",               # Tablette
    "3429": "Sein Tagesablauf beginnt immer mit einer Tasse Kaffee.",                # Tagesablauf
    "3430": "Das Dorf liegt in einem ruhigen Tal.",                                   # Tal
    "3431": "Er hält an der Tankstelle an, um zu tanken.",                           # Tankstelle
    "3432": "Seine Tante besucht ihn jedes Jahr im Sommer.",                         # Tante
    "3433": "Sie tanzen zusammen auf der Hochzeitsfeier.",                            # tanzen
    "3434": "Der Tanz war elegant und professionell.",                               # Tanz
    "3435": "Er legt sein Handy in die Tasche.",                                     # Tasche
    "3436": "Er bekommt zwanzig Euro Taschengeld pro Woche.",                        # Taschengeld
    "3437": "Er nimmt ein Taschentuch und putzt sich die Nase.",                     # Taschentuch
    "3438": "Er trinkt eine Tasse Kaffee am Morgen.",                                # Tasse
    "3439": "Er tippt schnell auf der Tastatur.",                                     # Tastatur
    "3440": "Er drückt die falsche Taste und löscht das Dokument.",                 # Taste
    "3441": "Die Tat war geplant und kein Zufall.",                                  # Tat
    "3442": "Der Täter wurde vom Zeugen erkannt.",                                   # Täter
    "3443": "Die Täterin wurde nach einer Woche gefasst.",                           # Täterin
    "3444": "Als Tätigkeit gibt er Lehrer an.",                                      # Tätigkeit
    "3445": "Der Sturm hat mehrere Bäume umgeworfen.",                               # Sturm
    "3446": "Er stürzt beim Radfahren und verletzt sich das Knie.",                  # stürzen
    "3447": "Er sucht seinen Schlüssel überall.",                                    # suchen
    "3448": "Alkohol kann zu einer Sucht führen.",                                   # Sucht
    "3449": "Er ist süchtig nach Kaffee.",                                            # süchtig
    "3450": "Alkohol und Zigaretten sind Suchtmittel.",                              # Suchtmittel
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

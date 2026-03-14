import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 10: IDs 2451–2700
updates = {
    "2451": "Er ist noch nicht fertig mit dem Bericht.",                                     # noch
    "2452": "Sein Rücken schmerzt seit dem schweren Umzug.",                                # schmerzen
    "2453": "Die Ergebnisse sind besser als erwartet.",                                     # sind
    "2454": "Der Zug ist gerade pünktlich angekommen.",                                    # angekommen
    "2455": "Er hat mittlerweile eine neue Wohnung in der Stadt gefunden.",                # mittlerweile
    "2456": "Das Konzert war sehr gut und alle waren begeistert.",                         # sehr
    "2457": "Sie muss kurz nachdenken, bevor sie antwortet.",                             # nachdenken
    "2458": "Die Nachfrage nach günstigen Wohnungen ist gestiegen.",                      # Nachfrage
    "2459": "Er kommt nachher vorbei, sobald er fertig ist.",                             # nachher
    "2460": "Sie nimmt Nachhilfe in Mathematik, um ihre Noten zu verbessern.",           # Nachhilfe
    "2461": "Hast du meine Nachricht auf dem Handy erhalten?",                           # Nachricht
    "2462": "Er schlägt das unbekannte Wort im Wörterbuch nach.",                        # nachschlagen
    "2463": "Als Nachspeise bestellen wir Schokoladenmousse.",                           # Nachspeise
    "2464": "Der nächste Zug fährt in zehn Minuten.",                                    # nächst
    "2465": "Ein Nachteil dieser Wohnung ist der fehlende Keller.",                      # Nachteil
    "2466": "Sie freuen sich auf den Nachwuchs, das Baby kommt im März.",                # Nachwuchs
    "2467": "Sie näht mit einer feinen Nadel und dünnem Faden.",                         # Nadel
    "2468": "Er schlägt einen Nagel in die Wand, um das Bild aufzuhängen.",             # Nagel
    "2469": "Die Schule liegt nah beim Bahnhof.",                                       # nah
    "2470": "In der Nähe des Parks gibt es viele schöne Cafés.",                        # Nähe
    "2471": "Sie näht das Kleid selbst für die Hochzeit.",                              # nähen
    "2472": "Er hat die Wunde sorgfältig genäht.",                                      # genäht
    "2473": "Beim Zahnarzt muss er den Mund weit aufmachen.",                           # Mund
    "2474": "Die mündliche Prüfung war schwieriger als die schriftliche.",              # mündlich
    "2475": "Er findet eine alte Münze in seinem Portemonnaie.",                        # Münze
    "2476": "Das Museum ist dienstags geschlossen.",                                    # Museum
    "2477": "Sie hört morgens immer klassische Musik.",                                # Musik
    "2478": "Er ist sehr musikalisch und spielt mehrere Instrumente.",                 # musikalisch
    "2479": "Der Musiker trat beim Stadtfest vor vielen Zuschauern auf.",              # Musiker
    "2480": "Die Musikerin hat ihr erstes Album veröffentlicht.",                      # Musikerin
    "2481": "Nach dem Sport taten ihm die Muskeln weh.",                              # Muskel
    "2482": "Er muss morgen früh aufstehen, weil der Zug um sechs Uhr fährt.",        # müssen
    "2483": "Sie hatte den Mut, ihre Meinung laut zu sagen.",                         # Mut
    "2484": "Nach der Arbeit geht er immer einkaufen.",                               # nach
    "2485": "Sein Nachbar hat ihm geholfen, die schweren Möbel zu tragen.",           # Nachbar
    "2486": "Die Nachbarin brachte ihr einen Topf Suppe, als sie krank war.",         # Nachbarin
    "2487": "Er muss jetzt sofort losgehen.",                                         # muss
    "2488": "Er ist sehr groß für sein Alter.",                                       # groß
    "2489": "Das habe ich schon gehört.",                                             # gehört
    "2490": "Hast du das schon gesehen?",                                             # du
    "2491": "Die leckere Torte wurde von allen Gästen gelobt.",                       # leckere
    "2492": "Er hat das Lied einmal gehört und sofort auswendig gelernt.",            # einmal
    "2493": "Das Projekt wurde durch EU-Mittel gefördert.",                           # gefördert
    "2494": "Er schlägt mit dem Hammer den Nagel in die Wand.",                       # schlagen
    "2495": "Sie schneidet das Fleisch vor dem Kochen in kleine Stücke.",             # schneiden
    "2496": "Was soll ich heute zum Mittagessen machen?",                             # machen
    "2497": "Er überweist jeden Monat die Miete auf das Konto des Vermieters.",       # überweisen
    "2498": "Sie arbeitet halbtags und kümmert sich nachmittags um die Kinder.",      # arbeiten
    "2499": "Wenn das Wetter gut ist, fahren wir ans Meer.",                          # wenn
    "2500": "Er hat sich schnell mit seinen neuen Kollegen angefreundet.",            # anfreunden
    "2501": "Wir müssen uns beeilen, sonst verpassen wir den Bus.",                  # beeilen
    "2502": "Wie nennt man dieses Gerät auf Deutsch?",                               # nennen
    "2503": "Der Zahnarzt traf den Nerv und es war sehr schmerzhaft.",               # Nerv
    "2504": "Er war vor der Prüfung sehr nervös.",                                   # nervös
    "2505": "Der neue Mitarbeiter ist sehr nett und hilfsbereit.",                   # nett
    "2506": "Das Netz des Fischers war voller Fische.",                              # Netz
    "2507": "Er hat ein großes berufliches Netzwerk aufgebaut.",                     # Netzwerk
    "2508": "Sie haben ein neues Restaurant in der Innenstadt eröffnet.",            # neu
    "2509": "Hast du schon die Neuigkeiten gehört? Er hat einen Sohn bekommen.",     # Neuigkeit
    "2510": "Das neugierige Kind fragte seinen Vater nach allem.",                   # neugierig
    "2511": "Ich habe ihn neulich im Supermarkt getroffen.",                        # neulich
    "2512": "Das ist nicht korrekt, bitte überprüfe es nochmal.",                   # nicht
    "2513": "Seine Nichte besucht ihn jeden Sommer.",                               # Nichte
    "2514": "Im Nichtraucherabteil fühlt er sich viel wohler.",                    # Nichtraucher
    "2515": "Als Nichtraucherin stört sie der Zigarettenrauch sehr.",              # Nichtraucherin
    "2516": "Wie ist Ihr Name? Mein Name ist Schmidt.",                            # Name
    "2517": "Beim Anmelden muss man den Familiennamen angeben.",                   # Familienname
    "2518": "Ihr Vorname ist Maria und ihr Nachname ist Müller.",                  # Vorname
    "2519": "Das ist eine nationale Angelegenheit.",                               # national
    "2520": "In der Natur erholt man sich viel besser als in der Stadt.",         # Natur
    "2521": "Natürlich helfe ich dir, das ist selbstverständlich.",               # natürlich
    "2522": "Der dichte Nebel machte das Fahren auf der Autobahn gefährlich.",    # Nebel
    "2523": "Es war neblig und kalt, man sah kaum fünfzig Meter weit.",          # neblig
    "2524": "Das Café liegt neben der Bibliothek.",                               # neben
    "2525": "Die Familie nebenan macht manchmal laute Musik.",                    # nebenan
    "2526": "Er arbeitet nebenbei als Taxifahrer.",                               # nebenbei
    "2527": "Er ist stolzer Onkel, sein Neffe wurde diese Woche geboren.",        # Neffe
    "2528": "Das Ergebnis des Tests war negativ.",                                # negativ
    "2529": "Nimm bitte deinen Mantel mit, es wird kalt.",                       # nehmen
    "2530": "Er ist erst seit einem Monat hier.",                                # erst
    "2531": "Wie nennt man das auf Englisch?",                                   # nennen
    "2532": "Wie geht es dir? Es geht mir gut.",                                # geht
    "2533": "Sie war nervös vor dem wichtigen Gespräch.",                        # nervös
    "2534": "Die Fenster wurden fest geschlossen.",                              # schlossen
    "2535": "Das Programm wurde erweitert und hat nun mehr Funktionen.",         # erweitert
    "2536": "Er kaufte einen neuen Stift.",                                      # einen
    "2537": "Das Essen war schlecht und er hat nicht alles gegessen.",           # schlecht
    "2538": "Das stimmt, du hast völlig recht.",                                # stimmt
    "2539": "Das ist meiner Meinung nach die beste Lösung.",                    # meiner
    "2540": "Er möchte mehr Zeit für seine Familie haben.",                     # mehr
    "2541": "Das Wort ist freundlich und bedeutet so viel wie sanft.",         # -lich (suffix, contextual)
    "2542": "Sie ist erkältet und bleibt heute zu Hause.",                     # erkältet
    "2543": "Er hat ganz vergessen, den Brief abzuschicken.",                  # ganz
    "2544": "Der Sturm war stark und hat Schäden an den Häusern verursacht.",  # stark
    "2545": "Das ist nicht das, was ich bestellt habe.",                       # nicht
    "2546": "Sei vorsichtig beim Überqueren der stark befahrenen Straße.",     # vorsichtig
    "2547": "Der Student stellt eine interessante Frage.",                     # st- (contextual)
    "2548": "Er jobbt nebenbei als Kellner.",                                  # nebenbei (dup)
    "2549": "Er arbeitet im Supermarkt bei der Frischetheke.",                 # bei
    "2550": "Er hat in der Prüfung eine sehr gute Note bekommen.",            # Note
    "2551": "Notiere bitte alle wichtigen Informationen aus dem Meeting.",     # notieren
    "2552": "Eine Entschuldigung ist in diesem Fall dringend nötig.",         # nötig
    "2553": "Sie schrieb sich eine Notiz, um den Termin nicht zu vergessen.", # Notiz
    "2554": "Nun ist es Zeit, das Projekt abzuschließen.",                    # nun
    "2555": "Er kann nur Deutsch und ein wenig Englisch.",                    # nur
    "2556": "Sie nutzt die Mittagspause, um spazieren zu gehen.",             # nutzen
    "2557": "Ihr Rat hat mir sehr genützt.",                                  # nützen
    "2558": "Dieses Wörterbuch ist sehr nützlich beim Lernen.",              # nützlich
    "2559": "Er hat nichts davon gewusst.",                                   # nichts
    "2560": "Sie ist nie zu spät, immer pünktlich.",                         # nie
    "2561": "Der niedrige Preis hat viele Kunden angelockt.",                # niedrig
    "2562": "Niemand hat seine Frage beantwortet.",                          # niemand
    "2563": "Er hat nirgends seinen Schlüssel gefunden.",                    # nirgends
    "2564": "Sein Portemonnaie war nirgendwo zu finden.",                    # nirgendwo
    "2565": "Ich bin noch nicht fertig mit dem Aufsatz.",                    # noch
    "2566": "Sie wartet noch auf ihre Bestellung.",                          # noch (dup)
    "2567": "Könnten Sie das nochmals wiederholen, bitte?",                 # nochmals
    "2568": "Das ist ein ganz normaler Arbeitstag für ihn.",                # normal
    "2569": "Normalerweise fährt er mit dem Fahrrad zur Arbeit.",           # normalerweise
    "2570": "Sie wurde mit starken Schmerzen in die Notaufnahme gebracht.", # Notaufnahme
    "2571": "Im Brandfall bitte den Notausgang benutzen.",                  # Notausgang
    "2572": "Im Notfall wähle sofort den Notruf 110 oder 112.",             # Notfall
    "2573": "Er hat eine Anfrage an die Behörde gestellt.",                 # eine
    "2574": "Ein neues Formular ist nicht nötig, das alte reicht.",        # nötig (dup)
    "2575": "Er hat sich geirrt und entschuldigte sich sofort.",           # geirrt
    "2576": "Diese Wohnung ist kleiner als die alte.",                     # kleiner
    "2577": "Ich habe nur noch etwas Kleingeld dabei.",                    # nur (dup)
    "2578": "Es tut mir leid, ich habe deinen Geburtstag vergessen.",      # leid
    "2579": "Er lernt und arbeitet gleichzeitig.",                         # und
    "2580": "Er hat das Medikament pünktlich genommen.",                   # genommen
    "2581": "Das Buch ist sehr nützlich für Deutschlernende.",             # nützlich (dup)
    "2582": "Das Haus steht am Rand des Waldes.",                          # Rand
    "2583": "Bitte warten Sie einen Moment, ich verbinde Sie.",            # bitte
    "2584": "Sie geht jeden Samstag einkaufen.",                           # einkaufen
    "2585": "Er arbeitet in der Nachtschicht.",                            # arbeitet
    "2586": "Er hat fünf verschiedene Sprachen gelernt.",                  # fünf
    "2587": "Die Fahrt dauert etwa zwei Stunden.",                         # dauert
    "2588": "Er kommt jeden Tag mit dem Bus zur Schule.",                  # kommt
    "2589": "Das ist ganz normal und kein Grund zur Sorge.",               # normal
    "2590": "Sie lernen, die Verbendungen richtig zu schreiben.",          # -en (contextual)
    "2591": "Er geht öfter ins Fitnessstudio als früher.",                # oft/öfter
    "2592": "Er geht nie ohne seinen Regenschirm aus dem Haus.",          # ohne
    "2593": "Sein Ohr tut weh, er geht zum Arzt.",                        # Ohr
    "2594": "Die Oma backt jeden Sonntag frischen Kuchen für die Kinder.", # Oma
    "2595": "Sein Onkel hat ihm viel über das Leben erzählt.",            # Onkel
    "2596": "Sie gehen einmal im Monat in die Oper.",                     # Oper
    "2597": "Der Arzt operierte das Knie erfolgreich.",                   # operieren
    "2598": "Die Operation verlief ohne Komplikationen.",                  # Operation
    "2599": "Die Organisation sammelt Spenden für die Opfer des Erdbebens.", # Opfer
    "2600": "Er ist immer optimistisch, auch in schwierigen Situationen.", # optimistisch
    "2601": "Sie isst morgens gerne eine Orange zum Frühstück.",          # Orange
    "2602": "Das Orchester spielte ein Konzert von Mozart.",              # Orchester
    "2603": "Ich weiß nicht, ob er heute kommt.",                        # ob
    "2604": "Die Bücher stehen oben im Regal.",                          # oben
    "2605": "Er wohnt im oberen Stockwerk.",                             # ober
    "2606": "Der Ober brachte die Speisekarte an den Tisch.",           # Ober
    "2607": "Das ist das Buch, das ich gesucht habe.",                  # das/der
    "2608": "Im Sommer gibt es viel frisches Obst auf dem Markt.",       # Obst
    "2609": "Möchtest du Kaffee oder Tee?",                              # oder
    "2610": "Die Tür ist offen, komm einfach rein.",                     # offen
    "2611": "Der Park ist öffentlich und für alle zugänglich.",          # öffentlich
    "2612": "Der Politiker wandte sich an die Öffentlichkeit.",          # Öffentlichkeit
    "2613": "Der Verlag wird das Buch nächsten Monat veröffentlichen.",  # veröffentlichen
    "2614": "Der Zug war offenbar zu spät, alle Passagiere warteten.",   # offenbar
    "2615": "Das ist ein offizielles Dokument von der Behörde.",        # offiziell
    "2616": "Das Museum ist bis achtzehn Uhr geöffnet.",                # geöffnet
    "2617": "Wann können sie kommen?",                                  # kommen
    "2618": "Er ist schon weggefahren, du hast ihn verpasst.",          # weggefahren
    "2619": "Was soll ich aus diesen alten Zutaten machen?",            # machen
    "2620": "Er ist geworden, was er immer werden wollte.",             # geworden
    "2621": "Das ist nicht richtig, überprüfe es bitte nochmal.",       # nicht
    "2622": "Das Buch liegt oben auf dem Schrank.",                     # oben
    "2623": "Die Wohnung wird an Studenten vermietet.",                 # vermietet
    "2624": "Sie hat heute keine Zeit.",                                # sie
    "2625": "Wir fahren morgen früh los.",                              # wir
    "2626": "Das Paket ist noch nicht angekommen.",                     # noch
    "2627": "Mit offenem Herzen begegnet man anderen besser.",          # offenem
    "2628": "Die Ausstellung ist bis Sonntag offen.",                   # offen (dup)
    "2629": "Der öffentliche Nahverkehr ist in dieser Stadt sehr gut.", # öffentlichen
    "2630": "Das ist leider nicht möglich.",                           # nicht
    "2631": "Er schreibt eine interessante Geschichte.",               # -te (contextual)
    "2632": "Die Geschwister streiten sich oft um das Spielzeug.",     # streiten
    "2633": "Das Geschäft ist sonntags geschlossen.",                  # geschlossen
    "2634": "Er schickte das Paket per Express.",                      # Paket
    "2635": "Er druckt das Dokument auf weißem Papier.",               # Papier
    "2636": "Sie kauft auf dem Markt frische Tomaten.",                # Tomate
    "2637": "Er trinkt gerne Mate-Tee im Sommer.",                    # Mate
    "2638": "Die zwei Projekte laufen parallel.",                      # parallel
    "2639": "Sie trägt ein elegantes Parfüm.",                        # Parfüm
    "2640": "Er sucht lange nach einem freien Parkplatz.",            # parken
    "2641": "Das Auto steht geparkt vor dem Supermarkt.",             # geparkt
    "2642": "Er hat einen neuen Geschäftspartner gefunden.",          # Partner
    "2643": "Sie veranstalten eine Party für zwanzig Personen.",      # Party
    "2644": "An der Grenze muss man den Pass vorzeigen.",             # Pass
    "2645": "Der Passagier vergaß seinen Koffer im Zug.",             # Passagier
    "2646": "Die Passagierin fragte nach dem Gate-Nummer.",           # Passagierin
    "2647": "Das Hemd passt gut, die Größe stimmt.",                  # passen
    "2648": "Was ist auf dem Weg zum Bahnhof passiert?",             # passieren
    "2649": "Er hört zu passiv zu und beteiligt sich nicht.",         # passiv
    "2650": "Sein Zimmer ist immer ordentlich aufgeräumt.",            # ordentlich
    "2651": "Sie geht einmal pro Woche in die Arztpraxis zur Kontrolle.", # Arztpraxis
    "2652": "In dem Ordner sind alle wichtigen Dokumente abgelegt.",   # Ordner
    "2653": "Es herrscht Ordnung in seinem Büro.",                     # Ordnung
    "2654": "Sie haben das Fest sehr gut organisiert.",                # organisieren
    "2655": "Die Organisation hilft Flüchtlingen bei der Integration.", # Organisation
    "2656": "Das Original hängt im Museum, hier ist nur eine Kopie.", # Original
    "2657": "Der original Schwarzwälder Kirschtorte hat einen besonderen Geschmack.", # original
    "2658": "Er kennt jeden Ort in dieser Region.",                   # Ort
    "2659": "Er wohnt in einem ruhigen Vorort der Großstadt.",        # Vorort
    "2660": "Der Wohnort muss auf dem Formular angegeben werden.",    # Wohnort
    "2661": "Der Atlantische Ozean ist der zweitgrößte Ozean der Welt.", # Ozean
    "2662": "Das Paar tanzte gemeinsam auf dem Marktplatz.",          # Paar
    "2663": "Er gab ihr ein Geschenk zum Geburtstag.",                # gab
    "2664": "Er lässt das Auto in der Werkstatt.",                    # lassen
    "2665": "Sie sollen um zehn Uhr im Büro sein.",                  # sollen
    "2666": "Wir fahren morgen ans Meer.",                            # morgen
    "2667": "Er hat nichts gesagt und einfach den Raum verlassen.",   # nichts
    "2668": "Er ist nicht krank, sondern nur müde.",                  # sondern
    "2669": "Das war sehr laut, kannst du bitte leiser sein?",        # sehr
    "2670": "Das Café ist montags geschlossen.",                      # geschlossen
    "2671": "Ich habe vergessen, den Brief abzuschicken.",           # habe
    "2672": "Ich gehe jetzt nach Hause.",                            # ich
    "2673": "Das war echt gut, danke für das Essen.",                # gut
    "2674": "Bitte gib das Formular bis Freitag ab.",                # abgeben
    "2675": "Das Paket kam von meiner Tante.",                       # von
    "2676": "Er kaufte ein Ticket für die Bahn.",                    # ein
    "2677": "Das Hähnchen ist ein leckeres Gericht.",               # -chen (contextual)
    "2678": "Er braucht noch ein paar Minuten.",                     # paar
    "2679": "Im Frühling pflanzt sie Tomaten im Garten.",           # pflanzen
    "2680": "Die Pflanze braucht viel Licht und Wasser.",           # Pflanze
    "2681": "Er klebt ein Pflaster auf die kleine Wunde.",          # Pflaster
    "2682": "Pflaumen schmecken süß und saftig.",                   # Pflaume
    "2683": "Der Pfleger kümmert sich liebevoll um die alten Patienten.", # Pfleger
    "2684": "Die Pflegerin hilft den Bewohnern beim Anziehen.",     # Pflegerin
    "2685": "Es ist seine Pflicht als Bürger, wählen zu gehen.",    # Pflicht
    "2686": "Kinder haben eine lebhafte Phantasie.",                # Phantasie/Fantasie
    "2687": "Sie nimmt täglich eine Pille gegen ihre Migräne.",     # Pille
    "2688": "Im Wald findet man viele essbare Pilze.",              # Pilz
    "2689": "Sie bestellen jeden Freitagabend Pizza.",              # Pizza
    "2690": "Er plant einen Ausflug ans Meer für das Wochenende.   ", # planen
    "2691": "Sie hat einen genauen Plan für ihre Reise.",           # Plan
    "2692": "Die Planung des Projekts dauerte mehrere Wochen.",     # Planung
    "2693": "Plastik ist schlecht für die Umwelt.",                 # Plastik
    "2694": "Ist der Platz hier noch frei?",                       # Platz
    "2695": "Die Patientin wurde nach der Operation schnell gesund.  ", # Patientin
    "2696": "Es war ihm sehr peinlich, als er das falsche Zimmer betrat.", # peinlich
    "2697": "Sie übernachten in einer kleinen Pension am See.",     # Pension
    "2698": "Er ist mit sechzig Jahren pensioniert worden.",        # pensioniert
    "2699": "Sie ist seit letztem Jahr pensioniert und reist viel.", # pensioniert (dup)
    "2700": "Er muss jetzt gehen, sonst verpasst er den Zug.",      # gehen/sein
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

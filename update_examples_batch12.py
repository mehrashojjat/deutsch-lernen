import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 12: IDs 2951–3200
updates = {
    "2951": "Sie kaufte eine rote Rose für ihre Mutter.",                                    # Rose
    "2952": "Die Rückfahrt war angenehmer als die Hinfahrt.",                               # Rückfahrt
    "2953": "Nach seiner Rückkehr aus dem Urlaub hat er viel aufzuholen.",                  # Rückkehr
    "2954": "Er fährt rückwärts in die Parklücke.",                                         # rückwärts
    "2955": "Sein Rücken schmerzt nach dem langen Arbeitstag.",                             # Rücken
    "2956": "Sie ruft ihren Namen laut, damit er sie hört.",                                # rufen
    "2957": "Kannst du mir deine Rufnummer geben?",                                         # Rufnummer
    "2958": "Er braucht nach der Arbeit Ruhe.",                                             # Ruhe
    "2959": "Die Kinder spielen ruhig in ihrem Zimmer.",                                    # ruhig
    "2960": "Der Tisch hat eine runde Form.",                                               # rund
    "2961": "Er spricht fließend Englisch und Spanisch.",                                   # sprechen
    "2962": "Er kaufte einen neuen Rucksack.",                                              # einen
    "2963": "Er hat alles ruhig und gelassen aufgenommen.",                                 # gelassen
    "2964": "Er hat ein Paket von seiner Schwester bekommen.",                              # bekommen
    "2965": "Er stellt die Vase auf das Fensterbrett hin.",                                 # hinstellen
    "2966": "Er hat ein gutes Buch gelesen.",                                               # ein
    "2967": "Das Ticket ist teurer als letztes Jahr.",                                      # teurer
    "2968": "Das Essen war gut und reichhaltig.",                                           # gut
    "2969": "Er meint, das sei die beste Lösung.",                                          # meinen
    "2970": "Er hat ein großes Haus am Stadtrand.",                                         # großes
    "2971": "Er ist mit dem Auto zur Arbeit gefahren.",                                     # gefahren
    "2972": "Er hilft anderen, ohne etwas dafür zu erwarten.",                             # anderen
    "2973": "Wir haben viel Zeit miteinander verbracht.",                                   # haben
    "2974": "Er kann auch Französisch sprechen.",                                           # auch
    "2975": "Bleib ruhig, es wird alles gut.",                                              # ruhig (dup)
    "2976": "Sie kaufte einen neuen Pullover.",                                             # einen (dup)
    "2977": "Die Kinder schauen dem Straßenmusiker zu.",                                    # zuschauen
    "2978": "Er schaut sich die Schuhe im Schaufenster an.",                               # Schaufenster
    "2979": "Der Schauspieler spielt die Hauptrolle in dem Film.",                         # Schauspieler
    "2980": "Er schneidet eine Scheibe Brot für das Frühstück ab.",                       # Scheibe
    "2981": "Er ist geschieden und lebt alleine.",                                          # geschieden
    "2982": "Nach der Scheidung zog sie in eine neue Stadt.",                              # Scheidung
    "2983": "Er bezahlt mit einem Fünfzig-Euro-Schein.",                                   # Schein
    "2984": "Er scheint erschöpft zu sein.",                                               # scheinen
    "2985": "Zum Geburtstag schenkt er ihr Blumen.",                                       # schenken
    "2986": "Er braucht eine Schere, um das Papier zu schneiden.",                         # Schere
    "2987": "Kannst du mir bitte das Paket schicken?",                                     # schicken
    "2988": "Er schiebt den Einkaufswagen durch den Supermarkt.",                          # schieben
    "2989": "Das Bild hängt schief an der Wand.",                                          # schief
    "2990": "Er schießt den Ball ins Tor.",                                                 # schießen
    "2991": "Das Schiff fährt morgen früh aus dem Hafen.",                                 # Schiff
    "2992": "Die Sängerin hat eine wunderschöne Stimme.",                                  # Sängerin
    "2993": "Nach dem Essen war er satt und zufrieden.",                                   # satt
    "2994": "Der Lehrer erklärt den Satz an der Tafel.",                                   # Satz
    "2995": "Das Geschirr ist sauber und bereit für den Tisch.",                           # sauber
    "2996": "Der Orangensaft ist zu sauer für ihn.",                                       # sauer
    "2997": "Er kauft eine Schachtel Pralinen für seine Freundin.",                        # Schachtel
    "2998": "Schade, dass du nicht mitkommen kannst!",                                     # schade
    "2999": "Zu viel Zucker kann der Gesundheit schaden.",                                 # schaden
    "3000": "Der Unfall verursachte großen Schaden am Auto.",                              # Schaden
    "3001": "Zu viel Alkohol ist schädlich für die Leber.",                                # schädlich
    "3002": "Er schaffte es, das schwierige Projekt alleine zu beenden.",                  # schaffen
    "3003": "Er schaltet das Licht aus, bevor er schläft.",                                # schalten
    "3004": "Am Schalter kann man Fahrkarten kaufen.",                                     # Schalter
    "3005": "Das Curry ist sehr scharf.",                                                   # scharf
    "3006": "Im Sommer sitzt er gerne im Schatten eines Baumes.",                         # Schatten
    "3007": "Er schätzt die Kosten auf etwa fünfhundert Euro.",                           # schätzen
    "3008": "Er schaut dem Koch beim Kochen zu.",                                          # zuschauen (dup)
    "3009": "Die Kinder waren gestern in der Schule.",                                     # waren
    "3010": "Er muss jetzt sofort nach Hause.",                                            # muss
    "3011": "Er lässt das Fenster offen.",                                                 # lassen
    "3012": "Sie wechselt jeden Monat die Bettwäsche.",                                    # wechseln
    "3013": "Er versucht es wieder und gibt nicht auf.",                                   # wieder
    "3014": "Das Konzert war sehr gut.",                                                    # war
    "3015": "Er schenkt ihr ein Buch zu Weihnachten.",                                    # schenken (dup)
    "3016": "Die Ladung des Lastwagens war sehr schwer.",                                  # Ladung
    "3017": "Er ist sehr geschickt mit den Händen.",                                       # geschickt
    "3018": "Er ist schon nach Hause gegangen.",                                           # gegangen
    "3019": "Der Torwart hat den Ball weit geschossen.",                                   # geschossen
    "3020": "Das ist wirklich beeindruckend.",                                             # wirklich
    "3021": "Du kannst das schaffen!",                                                     # kannst
    "3022": "Rauchen kann der Gesundheit schaden.",                                        # schaden (dup)
    "3023": "Er muss zu viel arbeiten.",                                                   # zu
    "3024": "Sie bereiten das Essen für die Gäste vor.",                                   # bereiten
    "3025": "Er schaltet das Radio an.",                                                   # schalten (dup)
    "3026": "Sie schaltet den Computer aus.",                                              # schalten (dup)
    "3027": "Das Messer ist sehr scharf.",                                                 # scharf (dup)
    "3028": "Es war keine schlimme Verletzung, nur ein Kratzer.",                         # schlimm
    "3029": "Das alte Schloss thront auf dem Hügel.",                                     # Schloss
    "3030": "Am Ende des Films kommt der Schluss überraschend.",                          # Schluss
    "3031": "Er hat seinen Schlüssel verloren und kann nicht rein.",                      # Schlüssel
    "3032": "Der Weg durch den Wald ist sehr schmal.",                                    # schmal
    "3033": "Der Kuchen schmeckt wunderbar.",                                              # schmecken
    "3034": "Er hat starke Schmerzen im Bauch.",                                          # Schmerz
    "3035": "Der Arzt verschreibt ein Schmerzmittel gegen die Kopfschmerzen.",           # Schmerzmittel
    "3036": "Sie schminkt sich für die Feier.",                                            # schminken
    "3037": "Sie trägt keinen teuren Schmuck, nur eine Silberkette.",                    # Schmuck
    "3038": "Er putzt die Schuhe, weil sie voller Schmutz sind.",                        # Schmutz
    "3039": "Das Glas ist schmutzig und muss gespült werden.",                            # schmutzig
    "3040": "Industrieabwasser kann Flüsse verschmutzen.",                               # verschmutzen
    "3041": "Der erste Schnee des Winters liegt auf den Dächern.",                       # Schnee
    "3042": "Es beginnt zu schneien.",                                                     # schneien
    "3043": "Er schneidet das Gemüse für die Suppe.",                                     # schneiden
    "3044": "Der Chef schimpft, wenn Mitarbeiter zu spät kommen.",                       # schimpfen
    "3045": "Er legt ein paar Scheiben Schinken auf das Brot.",                          # Schinken
    "3046": "Er vergisst seinen Schirm zuhause, obwohl es regnet.",                      # Schirm
    "3047": "Er schläft mindestens sieben Stunden pro Nacht.",                           # schlafen
    "3048": "Ein tiefer Schlaf hilft beim Erholen.",                                     # Schlaf
    "3049": "Er schlägt den Nagel mit dem Hammer in die Wand.",                         # schlagen
    "3050": "Er gibt dem Lehrer die Hausaufgaben.",                                       # der
    "3051": "Er liest das Buch auf der Bank.",                                            # das
    "3052": "Eine lange Schlange bildete sich vor dem Eingang.",                          # Schlange
    "3053": "Die Figur der Tänzerin ist schlank.",                                        # schlank
    "3054": "Das Wetter ist heute schlecht.",                                             # schlecht
    "3055": "Er schließt die Tür hinter sich.",                                           # schließen
    "3056": "Bist du fertig? Wir können jetzt gehen.",                                   # fertig
    "3057": "Er wurde schließlich für den Job ausgewählt.",                               # schließlich
    "3058": "Er hat eine Erkältung bekommen.",                                            # bekommen (dup)
    "3059": "Schließlich hat er die richtige Antwort gefunden.",                         # schließlich (dup)
    "3060": "Wir haben die Ausstellung besichtigt.",                                      # besichtigt
    "3061": "Das Telefon klingelt.",                                                       # klingelt
    "3062": "Ich habe heute keine Zeit.",                                                  # ich
    "3063": "Das können wir gemeinsam lösen.",                                            # können
    "3064": "Der Sportler schlägt einen neuen Rekord.",                                   # schlagen (dup)
    "3065": "Er kommt erst aus dem Urlaub zurück.",                                       # aus
    "3066": "Er ist krank und bleibt zuhause.",                                           # krank
    "3067": "Das Schreiben des Textes war anspruchsvoll.",                                # ank (contextual)
    "3068": "Das Essen schmeckte schlecht.",                                              # schlecht (dup)
    "3069": "Er hatte einen schlecht bezahlten Job.",                                    # schlecht (dup)
    "3070": "Er hört dich nicht.",                                                         # dich
    "3071": "Er hat das ganze Wochenende gelernt.",                                       # ganz
    "3072": "Das Geschäft ist am Sonntag geschlossen.",                                   # geschlossen (dup)
    "3073": "Er schließt das Fahrrad vor der Bank ab.",                                   # abschließen
    "3074": "Er schrie laut um Hilfe.",                                                    # schreien
    "3075": "Die Schrift auf dem Schild ist sehr klein.",                                 # Schrift
    "3076": "Die Prüfung war schriftlich, keine mündliche.",                             # schriftlich
    "3077": "Der Schriftsteller hat mehrere Romane veröffentlicht.",                     # Schriftsteller
    "3078": "Die Schriftstellerin erhielt einen Literaturpreis.",                        # Schriftstellerin
    "3079": "Mit jedem Schritt kommt er dem Ziel näher.",                                # Schritt
    "3080": "Er kauft neue Schuhe für den Winter.",                                       # Schuh
    "3081": "Er trägt keine Schuld an dem Unfall.",                                       # Schuld
    "3082": "Er ist schuld daran, dass es so weit kam.",                                  # schuld
    "3083": "Er hat Schulden und muss sparen.",                                            # Schulden
    "3084": "Sie fühlt sich schuldig, weil sie gelogen hat.",                             # schuldig
    "3085": "Die Kinder gehen montags bis freitags zur Schule.",                          # Schule
    "3086": "Der Schüler hat die Aufgabe richtig gelöst.",                                # Schüler
    "3087": "Die Schülerin ist die Beste in der Klasse.",                                 # Schülerin
    "3088": "Er hat sich die Schulter beim Sport verletzt.",                              # Schulter
    "3089": "Die Schüssel ist voller frischer Salat.",                                   # Schüssel
    "3090": "Sonnencreme schützt die Haut vor UV-Strahlen.",                             # schützen
    "3091": "Er bestellt Schnitzel mit Pommes und Salat.",                               # Schnitzel
    "3092": "Er hat Schnupfen und hustet seit drei Tagen.",                              # Schnupfen
    "3093": "Er hat schon alles vorbereitet.",                                            # schon
    "3094": "Die Aussicht vom Berg ist wirklich schön.",                                  # schön
    "3095": "Er hängt seine Jacke in den Schrank.",                                       # Schrank
    "3096": "Er hat einen Schrecken bekommen, als das Licht ausging.",                   # Schreck(en)
    "3097": "Das Erdbeben war schrecklich und hat viel Schaden angerichtet.",           # schrecklich
    "3098": "Er schreibt täglich in sein Tagebuch.",                                     # schreiben
    "3099": "Er schreibt die wichtigsten Punkte auf.",                                   # aufschreiben
    "3100": "Das Baby schrie die ganze Nacht.",                                           # schreien (dup)
    "3101": "Die Zuschauer haben laut geschrien.",                                        # geschrien
    "3102": "Er liest jeden Abend ein Buch.",                                             # lesen
    "3103": "Er isst immer eine halbe Portion.",                                          # halben
    "3104": "Die schriftliche Hausaufgabe muss bis morgen abgegeben werden.",           # schriftliche
    "3105": "Das ist nicht korrekt.",                                                      # nicht
    "3106": "Er kommt nicht rechtzeitig an.",                                             # nicht (dup)
    "3107": "Der Arzt hat die Rechnung noch nicht bezahlt.",                              # bezahlt
    "3108": "Bitte sei leise, die Kinder schlafen.",                                     # bitte
    "3109": "Er kommt morgen wieder vorbei.",                                             # wieder
    "3110": "Er gibt dem Kind den Ball zurück.",                                           # den
    "3111": "Er schüttelt den Kopf, um Nein zu sagen.",                                  # schütteln
    "3112": "Ist das möglich?",                                                            # möglich
    "3113": "Er läuft sehr schnell.",                                                      # schnell
    "3114": "Er hat den Teller leer gegessen.",                                           # gegessen
    "3115": "Er liest täglich die Zeitung.",                                              # lesen (dup)
    "3116": "Das Konzert war sehr schön.",                                                # sehr
    "3117": "Er muss auf den Bus warten.",                                                # warten
    "3118": "Er hat schon die Hausaufgaben gemacht.",                                     # schon (dup)
    "3119": "Er möchte am liebsten zu Hause bleiben.",                                    # bleiben
    "3120": "Er bekommt eine E-Mail mit den Details.",                                    # bekommen (dup)
    "3121": "Er möchte mehr Verantwortung übernehmen.",                                   # mehr
    "3122": "Er hat alle Termine aufgeschrieben.",                                         # aufgeschrieben
    "3123": "Das war sehr nett von ihm.",                                                  # sehr (dup)
    "3124": "Er wäscht sich die Hände mit Seife.",                                       # Seife
    "3125": "Ich möchte Arzt sein.",                                                       # sein
    "3126": "Er wohnt seit fünf Jahren in Berlin.",                                       # seit
    "3127": "Seitdem er Deutsch lernt, liest er deutsche Bücher.",                       # seitdem
    "3128": "Auf Seite zwanzig findest du die Antwort.",                                  # Seite
    "3129": "Der Sekretär nimmt alle Anrufe für den Chef entgegen.",                     # Sekretär
    "3130": "Die Sekretärin organisiert alle Termine.",                                   # Sekretärin
    "3131": "Er handelt stets nach seinem eigenen Willen.",                               # selb
    "3132": "Er macht alles selbst, ohne Hilfe.",                                         # selbst
    "3133": "Er erledigt die Reparatur selber.",                                          # selber
    "3134": "Er ist selbstständig und hat eine eigene Firma.",                            # selbstständig
    "3135": "Das ist selbstverständlich, wir helfen ihm gerne.",                         # selbstverständlich
    "3136": "Nach der langen Krankheit fühlt er sich noch schwach.",                     # schwach
    "3137": "Sie ist im fünften Monat schwanger.",                                        # schwanger
    "3138": "Während der Schwangerschaft achtet sie besonders auf ihre Ernährung.",     # Schwangerschaft
    "3139": "Er schweigt lieber, als einen Streit anzufangen.",                          # schweigen
    "3140": "Das Paket ist schwer und kann nicht alleine getragen werden.",              # schwer
    "3141": "Er versteht sich gut mit seiner Schwester.",                                 # Schwester
    "3142": "Die Aufgabe ist schwierig, aber lösbar.",                                   # schwierig
    "3143": "Er begegnet täglich neuen Schwierigkeiten bei der Arbeit.",                 # Schwierigkeit
    "3144": "Er schwimmt jeden Morgen dreißig Minuten im See.",                          # schwimmen
    "3145": "Das Schwimmbad ist sommers täglich geöffnet.",                              # Schwimmbad
    "3146": "Er schwitzt beim Sport sehr viel.",                                          # schwitzen
    "3147": "Der See liegt mitten im Wald.",                                              # See (lake)
    "3148": "Die See war ruhig, ideal für Segler.",                                       # See (sea)
    "3149": "Die Nordsee ist bekannt für ihre Gezeiten.",                                # Nordsee
    "3150": "Die Ostsee ist flacher als die Nordsee.",                                   # Ostsee
    "3151": "Er sieht das Problem klar und deutlich.",                                   # sehen
    "3152": "Er läuft schnell, um den Bus zu erwischen.",                                # schnell (dup)
    "3153": "Er schläft noch, stör ihn nicht.",                                          # noch
    "3154": "Er hat sich über das Geschenk sehr gefreut.",                               # gefreut
    "3155": "Er kommt übermorgen zurück.",                                               # übermorgen
    "3156": "Das Licht ist an.",                                                           # an
    "3157": "Das Licht ist aus.",                                                          # aus
    "3158": "Ich gehe jetzt schlafen.",                                                    # ich (dup)
    "3159": "Er reist in ein fremdes Land.",                                              # land
    "3160": "Er wohnt seit Jahren in Deutschland.",                                       # wohne
    "3161": "Du hast das wirklich gut gemacht.",                                          # du
    "3162": "Er macht sich selbstständig und eröffnet ein Café.",                        # selbstständig (dup)
    "3163": "Als Selbstständiger zahlt er selbst Steuern.",                              # selbstständig (dup)
    "3164": "Er zog fort und ließ alles hinter sich.",                                   # fort
    "3165": "Er hat mich angerufen.",                                                      # mich
    "3166": "Kannst du mir helfen?",                                                       # helfen
    "3167": "Sie ist schwanger und bekommt das Baby im Juni.",                            # schwanger (dup)
    "3168": "Freundschaft ist eine starke Verbindung zwischen Menschen.",                # -schaft (contextual)
    "3169": "Er gibt den Kindern das Buch.",                                              # den (dup)
    "3170": "Er kaufte einen neuen Stift.",                                               # einen (dup)
    "3171": "Er hat beim Marathon stark geschwitzt.",                                     # geschwitzt
    "3172": "Er wohnt seit vielen Jahren in dieser Stadt.",                               # Jahre
    "3173": "Die Mannschaft siegt im letzten Spiel der Saison.",                         # siegen
    "3174": "Der Sieg der Heimmannschaft war überwältigend.",                            # Sieg
    "3175": "Der Sieger bekommt eine goldene Medaille.",                                  # Sieger
    "3176": "Die Siegerin wurde laut bejubelt.",                                          # Siegerin
    "3177": "Im Büro siezt man sich, im privaten duzt man sich.",                        # siezen
    "3178": "Er singt gerne im Chor.",                                                     # singen
    "3179": "Der Chor hat das Lied wunderschön gesungen.",                               # gesungen
    "3180": "Die Temperaturen sinken im Winter unter null Grad.",                        # sinken
    "3181": "Der Sinn des Lebens ist ein altes philosophisches Thema.",                  # Sinn
    "3182": "Es ist sinnlos, darüber zu streiten.",                                      # sinnlos
    "3183": "Es ist sinnvoll, regelmäßig Sport zu treiben.",                             # sinnvoll
    "3184": "Die aktuelle Situation ist kompliziert.",                                    # Situation
    "3185": "Er hat stundenlang auf der Parkbank gesessen.",                              # gesessen
    "3186": "Der Sitz des Unternehmens ist in München.",                                 # Sitz
    "3187": "Er fährt jeden Winter Ski in den Alpen.",                                   # Ski / Schi
    "3188": "So war das nicht gemeint.",                                                   # so
    "3189": "Er ruft an, sobald er ankommt.",                                             # sobald
    "3190": "Er geht selten ins Kino.",                                                   # selten
    "3191": "Der Mann verhält sich seltsam.",                                             # seltsam
    "3192": "Er belegt dieses Fach im zweiten Semester.",                                # Semester
    "3193": "Er nimmt an einem Seminar über Kommunikation teil.",                        # Seminar
    "3194": "Der Sender überträgt das Konzert live.",                                    # Sender
    "3195": "Die Sendung beginnt um zwanzig Uhr.",                                       # Sendung
    "3196": "Das Programm ist speziell für Senioren geeignet.",                         # Senioren
    "3197": "Der Service in diesem Hotel ist ausgezeichnet.",                            # Service
    "3198": "Die Serviceangestellte beantwortet alle Fragen freundlich.",               # Serviceangestellte
    "3199": "Er sitzt bequem im Sessel und liest ein Buch.",                             # Sessel
    "3200": "Die Brücke ist sicher und für alle Fahrzeuge geeignet.",                   # sicher
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

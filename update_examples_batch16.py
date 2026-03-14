import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 16: IDs 3951–4200
updates = {
    "3951": "Er hat vor, nächstes Jahr nach Kanada zu ziehen.",                            # vorhaben
    "3952": "Er hat vorher nie in einer Großstadt gewohnt.",                               # vorher
    "3953": "Er hat vorhin angerufen, aber du warst nicht da.",                           # vorhin
    "3954": "Solche Fehler kommen häufig im Alltag vor.",                                  # vorkommen
    "3955": "Ich wohne seit drei Jahren in Berlin.",                                       # wohne
    "3956": "Er schläft noch, obwohl es schon neun Uhr ist.",                             # noch
    "3957": "Was soll ich mit den übrig gebliebenen Zutaten machen?",                     # machen
    "3958": "Die Benutzung des Lifts ist nur für Personen mit Behinderung erlaubt.",      # Benutzung
    "3959": "Die Straße ist nach dem Regen sehr glatt.",                                   # glatt
    "3960": "Das ist nicht das, was er erwartet hat.",                                    # nicht
    "3961": "Das Gespräch mit dem Chef war sehr angenehm.",                               # gespräch
    "3962": "Er weiß, dass er einen Fehler gemacht hat.",                                 # dass
    "3963": "Er kauft ein neues Heft für die Schule.",                                    # ein
    "3964": "Das Restaurant ist am Montag geschlossen.",                                  # geschlossen
    "3965": "Das Lied gehört zu seinen Lieblingsmelodien.",                               # gehört
    "3966": "Er ist schon angekommen.",                                                    # gekommen
    "3967": "Das Kind schläft schon seit zwei Stunden.",                                  # schlafen
    "3968": "Erziehung spielt eine wichtige Rolle in der Entwicklung.",                   # -ung (contextual)
    "3969": "Die Veranstaltung ist schon vorbei.",                                        # vorbei
    "3970": "Er braucht noch ein paar Minuten.",                                          # paar
    "3971": "Er hilft beim Bereiten des Abendessens.",                                    # bereiten
    "3972": "Sie bereiten sich auf die Prüfung vor.",                                     # bereiten (dup)
    "3973": "Er steht vor dem Eingang und wartet.",                                       # vor
    "3974": "Ich gehe jetzt nach Hause.",                                                  # ich
    "3975": "Was soll er tun?",                                                            # solls
    "3976": "Der Händler bietet eine breite Auswahl an Waren an.",                        # Ware
    "3977": "Die Suppe ist warm und schmeckt köstlich.",                                   # warm
    "3978": "Im Winter vermisst er die Wärme des Sommers.",                               # Wärme
    "3979": "Das Schild warnt vor Glatteis.",                                              # warnen
    "3980": "Er wartet seit einer Stunde auf den Bus.",                                   # warten
    "3981": "Warum bist du so spät?",                                                      # warum
    "3982": "Was hast du heute gemacht?",                                                  # was
    "3983": "Was soll ich als nächstes tun?",                                             # was (dup)
    "3984": "Er wäscht sich jeden Morgen die Hände.",                                     # waschen
    "3985": "Er hängt die Wäsche draußen auf.",                                           # Wäsche
    "3986": "Er kauft neues Waschmittel im Supermarkt.",                                  # Waschmittel
    "3987": "Er trinkt täglich achtzehn Gläser Wasser.",                                  # Wasser
    "3988": "Er wechselt regelmäßig das Öl im Auto.",                                    # wechseln
    "3989": "Er weckt seinen Sohn jeden Morgen um sieben Uhr.",                          # wecken
    "3990": "Der Wecker klingelt um sechs Uhr morgens.",                                  # Wecker
    "3991": "Er schreibt die Zeile waagerecht auf das Papier.",                           # waagerecht
    "3992": "Er ist wach und bereit für den neuen Tag.",                                  # wach
    "3993": "Die Kinder wachsen schnell.",                                                 # wachsen
    "3994": "Er fährt mit seinem Wagen zur Arbeit.",                                      # Wagen
    "3995": "Er wählt die beste Option aus.",                                              # wählen
    "3996": "Die freie Wahl des Berufs ist ein Grundrecht.",                              # Wahl
    "3997": "Er ist wahnsinnig stolz auf seinen Sohn.",                                   # wahnsinnig
    "3998": "Das ist eine wahr Geschichte.",                                               # wahr
    "3999": "Er sagt immer die Wahrheit.",                                                 # Wahrheit
    "4000": "Er hört Musik, während er lernt.",                                            # während
    "4001": "Es wird wahrscheinlich morgen regnen.",                                       # wahrscheinlich
    "4002": "Er macht einen Spaziergang im Wald.",                                        # Wald
    "4003": "Er hängt das Bild an die Wand.",                                             # Wand
    "4004": "Sie wandern jeden Sonntag in den Bergen.",                                   # wandern
    "4005": "Die Wanderung dauerte fünf Stunden.",                                        # Wanderung
    "4006": "Er sucht sein warmes Jacke.",                                                 # warmen
    "4007": "Das Wetter ist heute schön.",                                                 # ist
    "4008": "Er hat das Auto gewaschen.",                                                  # gewaschen
    "4009": "Er hängt die Jacke an den Haken auf.",                                      # aufhängen
    "4010": "Er wohnt hier seit drei Jahren.",                                             # hier
    "4011": "Er hat sechs Geschwister.",                                                   # sechs
    "4012": "Er muss jetzt los.",                                                          # jetzt
    "4013": "Er lernt und arbeitet gleichzeitig.",                                        # und
    "4014": "Er kommt statt um acht um neun.",                                            # statt
    "4015": "Es freut mich sehr.",                                                         # es
    "4016": "Möchtest du Kaffee oder Tee?",                                               # oder
    "4017": "Er liebt sie wahnsinnig.",                                                    # wahnsinnig (dup)
    "4018": "Das ist unsere gemeinsame Entscheidung.",                                    # unsere
    "4019": "Er ist noch nicht fertig.",                                                   # noch
    "4020": "Das Licht ist an.",                                                           # an
    "4021": "Er hört seiner Mutter aufmerksam zu.",                                       # hört
    "4022": "Er wendet sich an den Experten.",                                             # wenden
    "4023": "Er hat wenig Zeit für Hobbys.",                                               # wenig / wenige
    "4024": "Er hat wenigstens versucht, pünktlich zu sein.",                             # wenigstens
    "4025": "Er möchte Arzt werden.",                                                      # werden
    "4026": "Er wirft den Ball weit.",                                                     # werfen
    "4027": "Das Werk des Künstlers wurde weltweit ausgestellt.",                         # Werk
    "4028": "Das Auto muss in die Werkstatt.",                                             # Werkstatt
    "4029": "Er braucht das richtige Werkzeug für die Reparatur.",                        # Werkzeug
    "4030": "Diese alte Münze ist viel wert.",                                             # wert
    "4031": "Der Wert des Hauses ist gestiegen.",                                         # Wert
    "4032": "Diese alten Aktien sind jetzt wertlos.",                                     # wertlos
    "4033": "Das Gemälde ist sehr wertvoll.",                                             # wertvoll
    "4034": "Er ist weg, bevor jemand etwas bemerkt.",                                   # weg
    "4035": "Wegen der Krankheit kann er nicht zur Arbeit gehen.",                       # wegen
    "4036": "Das ist eine weibliche Endung im Deutschen.",                               # weiblich
    "4037": "Das Kissen ist sehr weich und bequem.",                                      # weich
    "4038": "Er bleibt zuhause, weil er krank ist.",                                     # weil
    "4039": "Er bestellt ein Glas Rotwein zum Essen.",                                   # Wein
    "4040": "Er wohnt weit weg vom Stadtzentrum.",                                        # weit / weiter
    "4041": "Er besucht einen Kurs zur Weiterbildung.",                                   # Weiterbildung
    "4042": "Er möchte die ganze Welt bereisen.",                                         # Welt
    "4043": "Das Produkt wird weltweit verkauft.",                                        # weltweit
    "4044": "Der Kurs wird online angeboten.",                                            # angeboten
    "4045": "Hier darf man nicht parken.",                                                 # dürfen
    "4046": "Wenn das Wetter gut ist, gehen wir spazieren.",                             # wenn
    "4047": "Du wirst es schaffen!",                                                       # wirst
    "4048": "Er hat verrückte Ideen, aber sie funktionieren.",                           # verrückt
    "4049": "Er hat den Ball weit geworfen.",                                             # geworfen
    "4050": "Er kommt statt per Zug mit dem Auto.",                                      # statt
    "4051": "Das ist sein Geld wert.",                                                    # wert (dup)
    "4052": "Er kommt von der Arbeit.",                                                   # von
    "4053": "Er kommt leider nicht.",                                                     # leider
    "4054": "Das Wetter war gestern sehr angenehm.",                                     # angenehm
    "4055": "Er erklärt die Grammatikregel verständlich.",                               # erklären
    "4056": "Das ist nicht das, was er gemeint hat.",                                    # nicht
    "4057": "Ich bin sehr glücklich.",                                                    # bin
    "4058": "Guten Morgen, wie geht es Ihnen?",                                          # guten
    "4059": "Er sucht eine neue Wohnung.",                                               # neue
    "4060": "Das ist einfach zu lösen.",                                                  # einfach
    "4061": "Er bleibt ruhig in schwierigen Situationen.",                               # ruhig
    "4062": "Herzlich willkommen in unserem Deutschkurs!",                               # willkommen
    "4063": "Der Wind ist heute sehr stark.",                                             # Wind
    "4064": "Es ist windig und kalt.",                                                    # windig
    "4065": "Er winkt seinem Freund von weitem.",                                         # winken
    "4066": "Das Medikament wirkt schnell.",                                              # wirken
    "4067": "Die Wirkung des Medikaments lässt nach einer Stunde nach.",                 # Wirkung
    "4068": "Das ist wirklich eine tolle Leistung.",                                      # wirklich
    "4069": "In der Wirklichkeit ist es anders als im Film.",                            # Wirklichkeit
    "4070": "Der Wirt begrüßt seine Gäste herzlich.",                                    # Wirt
    "4071": "Die deutsche Wirtschaft ist eine der stärksten weltweit.",                  # Wirtschaft
    "4072": "Er weiß alles über die Geschichte Deutschlands.",                           # wissen
    "4073": "Sein Wissen über Chemie ist beeindruckend.",                                # Wissen
    "4074": "Die Wissenschaft hat viele Fortschritte gemacht.",                          # Wissenschaft
    "4075": "Der Wissenschaftler forscht an neuen Medikamenten.",                        # Wissenschaftler
    "4076": "Die Wissenschaftlerin erhielt den Nobelpreis.",                             # Wissenschaftlerin
    "4077": "Er erzählt gerne Witze.",                                                    # Witz
    "4078": "Wo ist das nächste Krankenhaus?",                                           # wo
    "4079": "Das Wetter ist heute perfekt zum Spazierengehen.",                          # Wetter
    "4080": "Der Wetterbericht sagt Regen voraus.",                                      # Wetterbericht
    "4081": "Laut Wettervorhersage wird es morgen sonnig.",                              # Wettervorhersage
    "4082": "Es ist wichtig, täglich zu üben.",                                          # wichtig
    "4083": "Er widerspricht dem Vorschlag des Chefs.",                                  # widersprechen
    "4084": "Wie geht es dir?",                                                           # wie
    "4085": "Er macht denselben Fehler wieder.",                                          # wieder
    "4086": "Er wiederholt den Satz dreimal.",                                           # wiederholen
    "4087": "Die Wiederholung hilft beim Lernen.",                                       # Wiederholung
    "4088": "Er wiegt jeden Morgen seine Zutaten.",                                      # wiegen
    "4089": "In der Natur lebt das wilde Tier frei.",                                    # wild
    "4090": "Die Kinder spielen auf der grünen Wiese.",                                  # Wiese
    "4091": "Die Kinder winkten dem Clown zu.",                                          # winkten
    "4092": "Das Appartement ist sehr komfortabel eingerichtet.",                        # -ment (contextual)
    "4093": "Das hat er wirklich gut gemacht.",                                           # wirklich (dup)
    "4094": "Das stimmt wirklich nicht.",                                                 # wirklich (dup)
    "4095": "Das Café schließt um neun Uhr.",                                            # um
    "4096": "Er liest ein Buch über Philosophie.",                                       # über
    "4097": "Er ist seit zehn Jahren verheiratet.",                                      # verheiratet
    "4098": "Er trifft seinen alten Schulfreund.",                                       # treffen
    "4099": "Er hat laut gelacht.",                                                       # gelacht
    "4100": "Er kommt immer zu spät.",                                                   # spät
    "4101": "Das Wetter ist schön und warm.",                                            # schön
    "4102": "Er hat das Lied schon gehört.",                                             # gehört
    "4103": "Die Wäsche ist trocken.",                                                   # trocken
    "4104": "Er ist müde, aber er macht weiter.",                                        # aber
    "4105": "Der Zug hatte spät Abfahrt.",                                               # spät (dup)
    "4106": "Wen hast du heute getroffen?",                                              # wen
    "4107": "Ist das möglich?",                                                           # möglich
    "4108": "Er fragt, ob er helfen kann.",                                              # fragen
    "4109": "Er wünscht sich ein neues Fahrrad zum Geburtstag.",                        # wünschen
    "4110": "Sein größter Wunsch ist eine Weltreise.",                                  # Wunsch
    "4111": "Er isst gerne Bratwurst.",                                                   # Wurst
    "4112": "Er ist wütend, weil sein Auto nicht anspringt.",                           # wütend
    "4113": "Er schreibt die Zahl falsch.",                                               # Zahl
    "4114": "Die Anzahl der Bewerber war sehr hoch.",                                    # Anzahl
    "4115": "Er erhält zahlreiche Bewerbungen.",                                          # zahlreich
    "4116": "Er zahlt die Rechnung mit Karte.",                                           # zahlen
    "4117": "Die Zahlung muss bis Freitag erfolgen.",                                    # Zahlung
    "4118": "Die Kinder zählen von eins bis zehn.",                                     # zählen
    "4119": "Er geht zum Zahnarzt wegen Zahnschmerzen.",                                 # Zahn
    "4120": "Er putzt zweimal täglich seine Zähne mit Zahncreme.",                      # Zahncreme / -pasta
    "4121": "Er braucht eine Zange, um den Nagel zu ziehen.",                           # Zange
    "4122": "Ein rotes Licht ist ein Zeichen für Gefahr.",                              # Zeichen
    "4123": "Er wohnt seit einem Jahr in Hamburg.",                                      # wohnen
    "4124": "Den Wohnort muss man im Formular angeben.",                                 # Wohnort
    "4125": "Er meldet seinen neuen Wohnsitz beim Einwohnermeldeamt an.",               # Wohnsitz
    "4126": "Sie suchen eine neue Wohnung.",                                             # Wohnung
    "4127": "Er sitzt abends gerne im Wohnzimmer und liest.",                           # Wohnzimmer
    "4128": "Die Wolken verdunkeln den Himmel.",                                         # Wolke
    "4129": "Es ist bewölkt und kühl.",                                                  # bewölkt
    "4130": "Der Pullover ist aus reiner Wolle.",                                        # Wolle
    "4131": "Er will unbedingt Schauspieler werden.",                                    # wollen
    "4132": "Worüber habt ihr euch unterhalten?",                                        # worüber
    "4133": "Worum geht es in dem Gespräch?",                                            # worum
    "4134": "Er vergisst selten ein Wort.",                                              # Wort
    "4135": "Das Wort ist schwer zu übersetzen.",                                        # Wort (dup)
    "4136": "Er schlägt das unbekannte Wort im Wörterbuch nach.",                       # Wörterbuch
    "4137": "Er hat eine tiefe Wunde am Knie.",                                          # Wunde
    "4138": "Es ist ein Wunder, dass er den Unfall überlebt hat.",                      # Wunder
    "4139": "Das Konzert war wunderbar.",                                                 # wunderbar
    "4140": "Das Wetter war gestern sehr schön.",                                        # war
    "4141": "Er hat das Ticket bereits gekauft.",                                        # gekauft
    "4142": "Er wohnt hier in der Nähe.",                                                # hier
    "4143": "Er steht früh auf.",                                                         # früh
    "4144": "Der Zug ist los.",                                                           # los
    "4145": "Er kommt immer zu spät.",                                                   # immer
    "4146": "Er musste früh aufstehen.",                                                 # musste
    "4147": "Er kam sofort nach Hause.",                                                 # sofort
    "4148": "Du brauchst das Formular.",                                                  # brauchst
    "4149": "Er hat mich gebeten, ihm zu helfen.",                                       # mich
    "4150": "Die Feier ist für nächste Woche geplant.",                                 # geplant
    "4151": "Er kommt möglichst früh an.",                                               # möglichst
    "4152": "Er schaut abends gerne fern.",                                              # fern
    "4153": "Er hat gesagt, dass er kommt.",                                             # gesagt
    "4154": "Er schlägt das Wort im Wörterbuch nach.",                                  # nachschlagen
    "4155": "Er verbindet die zwei Kabel.",                                              # verbinden
    "4156": "Er bezahlt alles bar.",                                                     # bares
    "4157": "Er zieht nächsten Monat in eine neue Wohnung.",                            # ziehen
    "4158": "Sein Ziel ist es, Deutsch fließend zu sprechen.",                          # Ziel
    "4159": "Das Restaurant ist ziemlich teuer.",                                        # ziemlich
    "4160": "Er raucht täglich eine Zigarette.",                                         # Zigarette
    "4161": "Er mietet ein Zimmer in einer WG.",                                         # Zimmer
    "4162": "Er achtet auf die Zinsen beim Kredit.",                                    # Zinsen
    "4163": "Die Kinder freuen sich auf den Zirkus.",                                   # Zirkus
    "4164": "Im Formular muss man den Familienstand angeben.",                          # Familienstand
    "4165": "An der Grenze musste er Zoll zahlen.",                                     # Zoll
    "4166": "Das Parken in der roten Zone ist verboten.",                               # Zone
    "4167": "Er bereitet das Abendessen sorgfältig zu.",                               # zubereiten
    "4168": "Er nimmt keinen Zucker in seinen Kaffee.",                                 # Zucker
    "4169": "Er zeichnet einen Plan des Hauses.",                                       # zeichnen
    "4170": "Die Zeichnung des Kindes ist sehr kreativ.",                               # Zeichnung
    "4171": "Er zeigt ihm den Weg zum Bahnhof.",                                       # zeigen
    "4172": "Er schreibt seinen Namen in die erste Zeile.",                            # Zeile
    "4173": "Er hat keine Zeit zum Kochen.",                                            # Zeit
    "4174": "Zu diesem Zeitpunkt war er noch nicht zuhause.",                          # Zeitpunkt
    "4175": "Er ist zurzeit sehr beschäftigt.",                                         # zurzeit
    "4176": "Er liest in seiner Freizeit Zeitschriften.",                              # Zeitschrift
    "4177": "Er kauft jeden Morgen eine Zeitung.",                                     # Zeitung
    "4178": "Er zeltet gerne im Sommer in den Bergen.",                                # zelten
    "4179": "Das Hotel liegt sehr zentral.",                                            # zentral
    "4180": "Das Zentrum der Stadt ist immer belebt.",                                 # Zentrum
    "4181": "Der Sturm zerstörte viele Häuser.",                                       # zerstören
    "4182": "Er hat ein Zertifikat in Buchhaltung erworben.",                          # Zertifikat
    "4183": "Er schreibt eine Notiz auf einem Zettel.",                                # Zettel
    "4184": "Der Zeuge sah alles vom Fenster aus.",                                    # Zeuge
    "4185": "Die Zeugin bestätigte die Aussage des Mannes.",                           # Zeugin
    "4186": "Er geht ins Theater.",                                                     # ins
    "4187": "Er wartet auf seinen Freund.",                                             # warten
    "4188": "Das Essen wird pünktlich serviert.",                                       # serviert
    "4189": "Das ist mein Buch.",                                                       # mein
    "4190": "Er gibt den Kindern das Geld.",                                            # den
    "4191": "Er kreuzt die richtige Antwort an.",                                       # ankreuzen
    "4192": "Er muss jetzt los.",                                                       # jetzt
    "4193": "Er kauft eine Tageszeitung.",                                              # eine
    "4194": "Das Verb kochen hat die Endung -nen.",                                    # -nen (contextual)
    "4195": "Er kauft frisches Obst auf dem Markt.",                                   # kaufen
    "4196": "Die Ampel ist gerade auf Grün.",                                          # gerade
    "4197": "Er zeigt dem Gast den Weg.",                                              # zeige
    "4198": "Er erklärt die Aufgabe auf einfache Weise.",                              # Weise
    "4199": "Er nimmt das Buch vom Regal.",                                            # nehmen
    "4200": "Er wohnt in einer kleinen Stadt.",                                        # in
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

import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 8: IDs 1951–2200
updates = {
    "1951": "Während des Karnevals tragen viele Menschen bunte Kostüme.",                    # Karneval
    "1952": "In der Silvesternacht feiern viele Menschen bis tief in die Nacht.",           # nacht
    "1953": "In meinem Eintopf kommen immer Kartoffeln und Karotten.",                      # Karotte
    "1954": "Ich schicke dir eine Postkarte aus dem Urlaub.",                               # Karte
    "1955": "Mit der Chipkarte kann man kontaktlos bezahlen.",                              # Chipkarte
    "1956": "Er hat seine Fahrkarte am Automaten gekauft.",                                 # Fahrkarte
    "1957": "Kartoffeln sind in Deutschland eines der beliebtesten Grundnahrungsmittel.",   # Kartoffel
    "1958": "Er biss in den Apfel und fand ihn sehr saftig.",                              # dapfel (apple)
    "1959": "In Deutschland gibt es über dreihundert verschiedene Käsesorten.",            # Käse
    "1960": "Er trug einen Kasten Wasser aus dem Keller nach oben.",                       # Kasten
    "1961": "Der Kasten mit den Werkzeugen steht in der Garage.",                          # Kasten (dup)
    "1962": "Im Katalog fand sie das passende Modell und bestellte es sofort.",            # Katalog
    "1963": "Das Erdbeben war eine echte Katastrophe für die gesamte Region.",             # Katastrophe
    "1964": "Der Kauf eines Hauses will gut geplant sein.",                                # Kauf
    "1965": "Er lernt Italienisch und übt täglich das Sprechen.",                          # sprechen
    "1966": "Sie hat keins der angebotenen Bücher interessiert.",                          # keins
    "1967": "Das Café hat ein gemütliches Ambiente.",                                      # gemütliches
    "1968": "Er kann nicht schlafen, weil es zu laut ist.",                               # nicht
    "1969": "Er versucht sein Deutsch täglich zu verbessern.",                             # verbessern
    "1970": "Viele Menschen reisen im Sommer an die See.",                                 # viele
    "1971": "Er hat das Buch dort auf dem Tisch liegenlassen.",                           # dort
    "1972": "Die Aufgabe ist leicht, wenn man die Regel kennt.",                          # leicht
    "1973": "Sie ist schon gegangen, bevor ich angekommen bin.",                          # gegangen
    "1974": "Deutschland ist für seine Ingenieure weltbekannt.",                          # deutschland
    "1975": "Er möchte ein Fahrrad kaufen, aber die Preise sind hoch.",                  # kaufen
    "1976": "Er hat heute endlich die Zusage für den Job bekommen.",                      # bekommen
    "1977": "Er hat das Essen schon bestellt, bevor die anderen ankamen.",               # bestellt
    "1978": "Er kaufte ein Brot und ein Glas Marmelade.",                                # ein
    "1979": "Er drückte auf die Klingel, aber niemand öffnete die Tür.",               # Klingel
    "1980": "Die Musik klingt sehr schön und beruhigend.",                              # klingen
    "1981": "Er wurde nach dem Unfall sofort in eine Klinik gebracht.",                # Klinik
    "1982": "Zu einem bayerischen Braten gehören traditionell Klöße.",                 # Kloß
    "1983": "Sie ist sehr klug und findet immer schnell eine Lösung.",                # klug
    "1984": "Er kam knapp fünf Minuten zu spät zum Vorstellungsgespräch.",            # knapp
    "1985": "Nach der Arbeit treffen sie sich manchmal in der Kneipe.",               # Kneipe
    "1986": "Er hat sich beim Laufen das Knie verletzt.",                             # Knie
    "1987": "Das Hemd hat einen losen Knopf, den sie festnähen muss.",               # Knopf
    "1988": "Sie kocht jeden Sonntag eine große Mahlzeit für die ganze Familie.",     # kochen
    "1989": "Der Koch bereitet das Gericht frisch zu.",                              # Koch
    "1990": "Die Köchin hat das Restaurant mit ihren Rezepten bekannt gemacht.",     # Köchin
    "1991": "Er packte seinen Koffer sorgfältig, damit nichts zerdrückt wird.",      # Koffer
    "1992": "Sein Kollege hilft ihm immer, wenn er Fragen hat.",                     # Kollege
    "1993": "Seine Kollegin erklärte ihm die neue Software.",                        # Kollegin
    "1994": "Sie legt sich gerne auf das weiche Kissen auf dem Sofa.",              # Kissen
    "1995": "Er klagt ständig über Rückenschmerzen.",                               # klagen
    "1996": "Hat die Präsentation gut geklappt? Ja, alles lief prima.",             # klappen
    "1997": "Ist das klar? Ich habe die Aufgabe noch nicht ganz verstanden.",       # klar
    "1998": "Die Situation muss dringend geklärt werden.",                          # klären
    "1999": "Morgen schreibt die Klasse eine Klassenarbeit in Mathe.",              # Klassenarbeit
    "2000": "Er spielt seit seiner Kindheit Klavier und gibt nun Unterricht.",      # Klavier
    "2001": "Er klebt das Poster mit Tesafilm an die Wand.",                       # kleben
    "2002": "Sie trägt ein rotes Kleid zur Hochzeitsfeier.",                       # Kleid
    "2003": "Die Wohnung ist klein, aber sehr gemütlich eingerichtet.",            # klein
    "2004": "Im Sommer klettern die Kinder gerne auf den großen Baum im Garten.", # klettern
    "2005": "Klicke auf den grünen Button, um die Anmeldung abzuschließen.",      # klicken
    "2006": "Mit einem Klick auf das Symbol öffnet sich das Programm.",           # Klick
    "2007": "Das Klima in dieser Region ist warm und feucht.",                    # Klima
    "2008": "Im Sommer ist die Klimaanlage im Büro unverzichtbar.",               # Klimaanlage
    "2009": "Er blieb kranken Tags zu Hause und ruhte sich aus.",                 # kranken (filler)
    "2010": "Das ist besonders wichtig für Reisende ohne Vorkenntnisse.",         # besonders
    "2011": "Er spart jeden Monat etwas Geld für den nächsten Urlaub.",           # sparen
    "2012": "Das Abendessen hat nur fünfzehn Euro gekostet.",                     # gekostet
    "2013": "Er trinkt morgens immer einen Kaffee und ein Glas Wasser.",          # trinken
    "2014": "Ich kann leider nicht zum Treffen kommen.",                          # kann
    "2015": "Sie müssen bis spätestens Freitag den Bericht abgeben.",             # müssen
    "2016": "Er kocht abends immer etwas Frisches für seine Familie.",            # kochen (dup)
    "2017": "Sie kauft lieber günstige als teure Sachen.",                        # teuren
    "2018": "Die Kinder schlafen in der langen Autofahrt immer ein.",             # schlafen
    "2019": "Das hat prima geklappt, ich bin sehr zufrieden.",                    # prima
    "2020": "Bitte erkläre mir das in klarer und einfacher Sprache.",             # klare
    "2021": "Wir sehen uns bald, ich freue mich schon.",                          # bald
    "2022": "Er lernt jeden Tag neue Vokabeln auf der App.",                      # lernen
    "2023": "Sie trinkt am liebsten warme Milch vor dem Schlafen.",               # warme
    "2024": "Er ist noch nie so hoch geklettert.",                                # geklettert
    "2025": "Hast du schon gefrühstückt?",                                        # du
    "2026": "Wer bewusst konsumiert, schützt die Umwelt.",                        # konsumieren
    "2027": "Der Konsum von Zucker sollte reduziert werden.",                     # Konsum
    "2028": "Er hat den Kontakt zu seinen alten Schulfreunden verloren.",         # Kontakt
    "2029": "Bitte gib mir deine Kontonummer, damit ich das Geld überweisen kann.", # Konto
    "2030": "Sein Gehalt wird jeden Monat auf das Girokonto überwiesen.",         # Girokonto
    "2031": "Der Zollbeamte kontrollierte alle Gepäckstücke am Flughafen.",       # kontrollieren
    "2032": "Die Kontrolle der Passagiere am Eingang dauerte lange.",             # Kontrolle
    "2033": "Das Konzert im Stadtpark war ausverkauft.",                          # Konzert
    "2034": "Ich habe Kopfschmerzen und muss mich hinlegen.",                     # Kopf
    "2035": "Sie machte eine Kopie des Dokuments, bevor sie es abgab.",           # Kopie
    "2036": "Der Kopierer im Büro ist wieder kaputt.",                            # Kopierer
    "2037": "Sport ist gut für den Körper und auch für die Seele.",               # Körper
    "2038": "Körperliche Arbeit kann sehr erschöpfend sein.",                     # körperlich
    "2039": "Der Lehrer korrigierte die Aufsätze über das Wochenende.",           # korrigieren
    "2040": "Kannst du bitte um zehn Uhr kommen?",                               # kommen
    "2041": "Gute Kommunikation ist das Fundament einer guten Beziehung.",        # Kommunikation
    "2042": "Das Zimmer ist komplett möbliert und sofort einzugsbereit.",         # komplett
    "2043": "Die Situation ist sehr kompliziert und schwer zu lösen.",            # kompliziert
    "2044": "Beide Seiten einigten sich auf einen Kompromiss.",                   # Kompromiss
    "2045": "Die internationale Konferenz findet dieses Jahr in Berlin statt.",   # Konferenz
    "2046": "Zum Frühstück isst sie gerne Brot mit Konfitüre.",                  # Konfitüre
    "2047": "Der König erschien auf dem Balkon und grüßte die Menge.",           # König
    "2048": "Das kleine Unternehmen leidet unter der starken Konkurrenz.",        # Konkurrenz
    "2049": "Er kann fließend Deutsch und Englisch sprechen.",                    # können
    "2050": "Er möchte mehr Zeit mit seiner Familie verbringen.",                 # mehr
    "2051": "Das Buch liegt auf dem Tisch.",                                      # auf
    "2052": "Sie hat mich nach dem Weg gefragt.",                                 # mich
    "2053": "Er ist noch nicht fertig mit der Aufgabe.",                          # noch
    "2054": "Ich suche meinen Schlüssel.",                                        # meinen
    "2055": "Er kommt aus einer kleinen Stadt in Bayern.",                        # aus
    "2056": "Bitte korrigiere den Fehler im Bericht.",                            # korrigieren (dup)
    "2057": "Er hat das mal versucht, aber es hat nicht geklappt.",               # mal
    "2058": "Sie hat viel Arbeit und schafft es kaum, pünktlich zu sein.",        # viel
    "2059": "Er sucht schon seit Wochen eine neue Wohnung.",                      # suchen
    "2060": "Wann bist du nach Hause gekommen?",                                  # gekommen
    "2061": "Er hat seinen Termin wieder vergessen.",                             # vergessen
    "2062": "Die neue Wohnung ist schön eingerichtet.",                           # eingerichtet
    "2063": "Er brachte einen Blumenstrauß mit.",                                 # einen
    "2064": "Die Eltern bringen ihre Kinder täglich in die Schule.",             # -tern (fragment contextual)
    "2065": "Es ist Zeit, weiterzumachen.",                                       # zu
    "2066": "Die Firma hat Angst vor der wachsenden Konkurrenz.",                 # Konkurrenz (dup)
    "2067": "Er hat die Hälfte seiner Ersparnisse für die Reise ausgegeben.",    # Hälfte
    "2068": "Ich möchte aus alten Materialien etwas Neues machen.",              # machen
    "2069": "Er muss den schweren Karton ins Lager tragen.",                     # tragen
    "2070": "Sie fahren jeden Sommer gemeinsam in den Urlaub.",                  # fahren
    "2071": "Es regnet schon seit drei Tagen ununterbrochen.",                   # regnet
    "2072": "Können Sie mit Kreditkarte zahlen oder nur bar?",                   # Kreditkarte
    "2073": "Der Landkreis besteht aus mehreren kleinen Gemeinden.",             # Kreis
    "2074": "Er machte ein Kreuz auf dem Formular neben seiner Antwort.",        # Kreuz
    "2075": "An der Kreuzung musst du rechts abbiegen.",                         # Kreuzung
    "2076": "Der Erste Weltkrieg begann im Jahr 1914.",                          # Krieg
    "2077": "Er kriegt seinen Lohn immer am Ende des Monats.",                   # kriegen
    "2078": "Die Kriminalpolizei ermittelt im Fall des verschwundenen Gemäldes.",# Kriminalpolizei
    "2079": "Ich lese gerne Krimis, weil die Spannung mich fesselt.",            # Krimi
    "2080": "Die wirtschaftliche Krise traf viele Familien hart.",               # Krise
    "2081": "Die Kritik an dem neuen Plan war sehr scharf.",                     # Kritik
    "2082": "Er betrachtete die Situation kritisch und machte Verbesserungsvorschläge.", # kritisch
    "2083": "Die Küche ist modern ausgestattet und hat einen großen Herd.",      # Küche
    "2084": "Zum Kaffee gibt es frischen Kuchen vom Bäcker.",                   # Kuchen
    "2085": "Er schreibt alles mit einem Kugelschreiber in sein Notizheft.",    # Kugelschreiber
    "2086": "Hast du einen Kuli dabei? Ich muss etwas aufschreiben.",           # Kuli
    "2087": "Der Abend ist kühl, zieh dir eine Jacke an.",                      # kühl
    "2088": "Die Milch steht im Kühlschrank, auf der untersten Ablage.",        # Kühlschrank
    "2089": "Die Kosten für das Projekt sind höher als geplant.",               # Kosten
    "2090": "Der Eintritt in die Ausstellung ist heute kostenlos.",             # kostenlos
    "2091": "Wie viel kostet die Zugfahrt nach Hamburg?",                       # kosten
    "2092": "Möchten Sie den Kuchen probieren, bevor Sie ihn bestellen?",       # probieren
    "2093": "Sie trug ein elegantes Kostüm zur Präsentation.",                  # Kostüm
    "2094": "Nach langer Krankheit hat sie langsam wieder Kraft.",              # Kraft
    "2095": "Ein kräftiger Wind fegte durch die Straßen der Stadt.",            # kräftig
    "2096": "Für ein Kraftfahrzeug braucht man einen gültigen Führerschein.",   # Kraftfahrzeug
    "2097": "Der Kranke lag seit einer Woche im Bett.",                         # Kranke (male)
    "2098": "Die Kranke erholt sich langsam nach ihrer Operation.",             # Kranke (female)
    "2099": "Er wurde mit dem Krankenwagen ins Krankenhaus gebracht.",          # Krankenhaus
    "2100": "Die Krankenkasse übernimmt die Kosten für die Behandlung.",        # Krankenkasse
    "2101": "Der Krankenpfleger kümmerte sich rührend um die Patientin.",       # Krankenpfleger
    "2102": "Die Krankenschwester brachte dem Patienten seine Medizin.",        # Krankenschwester
    "2103": "Als er zusammenbrach, rief jemand sofort den Krankenwagen.",       # Krankenwagen
    "2104": "Die Krankheit brach plötzlich aus und verbreitete sich schnell.",  # Krankheit
    "2105": "Sie ist sehr kreativ und malt in ihrer Freizeit.",                 # kreativ
    "2106": "Sie hat das Buch in der Buchhandlung gekauft.",                    # gekauft
    "2107": "Er bekommt täglich viele E-Mails von Kunden.",                     # bekommen
    "2108": "Beim Verlassen der Autobahn musst du rechts abbiegen.",            # rechts
    "2109": "In diesem Fall bitte ich um etwas Geduld.",                        # diesem
    "2110": "Könnten Sie mir bitte helfen?",                                    # bitte
    "2111": "Es war eine schwere Entscheidung, aber er bereut sie nicht.",      # schweren
    "2112": "Sie bekommt jeden Monat Kindergeld.",                              # bekommen (dup)
    "2113": "Ich arbeite an einem neuen Projekt.",                              # an
    "2114": "Das Paket kommt von meiner Tante.",                                # von
    "2115": "Das Museum ist kostenlos, der Eintritt ist frei.",                 # kostenlos (dup)
    "2116": "Im Urlaub lernte er das Tauchen.",                                 # tauchen
    "2117": "Meine Schwester studiert Medizin in Heidelberg.",                  # schwester
    "2118": "Er rief laut nach Hilfe.",                                         # rufen
    "2119": "Er erkannte mich sofort.",                                         # mich
    "2120": "Das kreative Team entwickelte neue Ideen für das Produkt.",        # kreativ (dup)
    "2121": "Dieses Modell ist das beliebteste in unserem Sortiment.",          # dieses
    "2122": "Er gab ihr zum Abschied einen Kuss auf die Wange.",                # Kuss
    "2123": "Die Küste der Nordsee ist für ihre rauen Winde bekannt.",          # Küste
    "2124": "Das ist es nicht wert, sich darüber aufzuregen.",                  # wert
    "2125": "Sie lächelt immer freundlich, wenn sie Gäste begrüßt.",           # lächeln
    "2126": "Alle lachten, als er die lustige Geschichte erzählte.",           # lachen
    "2127": "Sie hat über den Witz so sehr gelacht, dass ihr die Augen tränten.", # gelacht
    "2128": "In dem kleinen Laden gibt es alles, was man für den Alltag braucht.", # Laden
    "2129": "Die Wohnung befindet sich in einer ruhigen Lage am Stadtrand.",   # Lage
    "2130": "Das Lager ist voll mit Waren für die Weihnachtssaison.",          # Lager
    "2131": "Die Lampe in seinem Zimmer gibt ein warmes und gemütliches Licht.", # Lampe
    "2132": "Er reist in viele Länder und lernt dabei andere Kulturen kennen.", # Land
    "2133": "Die Landwirtschaft in dieser Region ist auf Getreide spezialisiert.", # Landwirtschaft
    "2134": "Die Landschaft am Rhein ist besonders im Herbst wunderschön.",    # Landschaft
    "2135": "Das Flugzeug landete trotz des Nebels sicher.",                   # landen
    "2136": "Das Museum zeigt kulturelle Besonderheiten aus aller Welt.",      # kulturell
    "2137": "Der Kunde fragte nach dem Preis des neuen Modells.",              # Kunde
    "2138": "Die Kundin beschwerte sich über den Kundenservice.",              # Kundin
    "2139": "Er hat nach zehn Jahren seinen Job gekündigt.",                   # kündigen
    "2140": "Die Kündigung muss schriftlich und fristgerecht eingereicht werden.", # Kündigung
    "2141": "Er interessiert sich sehr für moderne Kunst.",                    # Kunst
    "2142": "Der Künstler stellt seine Werke in einer bekannten Galerie aus.", # Künstler
    "2143": "Die Künstlerin malt vor allem Porträts und Landschaften.",        # Künstlerin
    "2144": "Das Blumenbouquet bestand aus künstlichen Blumen.",              # künstlich
    "2145": "Produkte aus Kunststoff sind leicht, aber nicht immer umweltfreundlich.", # Kunststoff
    "2146": "Sie belegt einen Sprachkurs, um ihr Deutsch zu verbessern.",     # Kurs
    "2147": "Der Kursleiter erklärte die Aufgaben verständlich.",             # Kursleiter (male)
    "2148": "Die Kursleiterin organisierte das Abschlussfest für die Gruppe.", # Kursleiter (female)
    "2149": "Fahr vorsichtig durch diese enge Kurve.",                        # Kurve
    "2150": "Sie schreibt kurze, aber präzise E-Mails.",                      # kurz
    "2151": "Er hat kürzlich eine neue Stelle angetreten.",                   # kürzlich
    "2152": "Sie arbeitet in einem kleinen Café.",                            # sie
    "2153": "Alle Schüler haben die Aufgabe pünktlich abgegeben.",           # alle
    "2154": "Sie lächelt, wenn sie an die Ferien denkt.",                    # lächeln (dup)
    "2155": "Sie haben zusammen gelacht und viel Spaß gehabt.",              # gelacht (dup)
    "2156": "Er wohnt im Zentrum der Stadt.",                                # im
    "2157": "Eine zentralere Lage wäre besser für das Unternehmen.",         # zentraler
    "2158": "Er ist so müde, dass er kaum sprechen kann.",                   # so
    "2159": "Er hat das Buch in der Schultasche.",                          # in
    "2160": "Sie wollen gemeinsam ein Restaurant eröffnen.",                 # wollen
    "2161": "Das Flugzeug ist pünktlich gelandet.",                         # gelandet
    "2162": "Die neue Wohnung liegt zwischen Park und See.",                 # zwischen
    "2163": "Das Meeting beginnt um neun Uhr.",                             # um
    "2164": "Das Essen war köstlich und gut gewürzt.",                      # Essen
    "2165": "Ich habe vergessen, die Tür abzuschließen.",                  # habe
    "2166": "Er ist sehr zufrieden mit seinem neuen Job.",                  # zufrieden
    "2167": "Sie hat den Vertrag nach langer Überlegung gekündigt.",        # gekündigt
    "2168": "Die Künstlerinnen stellten gemeinsam in der Galerie aus.",    # Künstlerinnen
    "2169": "Er ist einer der besten Schüler in der Klasse.",              # einer
    "2170": "Die Türklingel hat geklingelt, aber niemand war draußen.",    # geklingelt
    "2171": "Bist du gestern Abend nach Hause gekommen?",                  # gekommen
    "2172": "Sie ist letzte Woche in eine neue Wohnung gezogen.",          # gezogen
    "2173": "Er lässt das Auto in der Werkstatt reparieren.",              # lassen
    "2174": "Sie haben lange miteinander gesprochen.",                     # gesprochen
    "2175": "Das Laufwerk speichert alle Daten des Computers.",            # Laufwerk
    "2176": "Er ist guter Laune, weil er eine Gehaltserhöhung bekommen hat.", # Laune
    "2177": "Der Lautsprecher des Handys ist kaputt.",                    # Lautsprecher
    "2178": "Das Abendessen war sehr lecker, ich bin satt.",              # lecker
    "2179": "Er lebt seit zehn Jahren in Berlin.",                        # leben
    "2180": "Er hat lange in Spanien gelebt.",                           # gelebt
    "2181": "Das Leben auf dem Land ist ruhiger als in der Stadt.",      # Leben
    "2182": "Für die Bewerbung brauchst du einen aktuellen Lebenslauf.", # Lebenslauf
    "2183": "Im Supermarkt kauft sie wöchentlich frische Lebensmittel.", # Lebensmittel
    "2184": "Die Handtasche ist aus echtem Leder und sehr hochwertig.", # Leder
    "2185": "Sie ist ledig und wohnt allein in einer Zweizimmerwohnung.", # ledig
    "2186": "Die Batterie ist leer, ich muss das Handy laden.",         # leer
    "2187": "Er legt das Buch auf den Tisch.",                          # legen
    "2188": "Sie hat die Jacke über den Stuhl gelegt.",                 # gelegt
    "2189": "Er absolviert eine Lehre als Elektriker.",                 # Lehre
    "2190": "Sie sucht eine Lehrstelle als Kauffrau.",                  # Lehrstelle
    "2191": "Der Film ist lang und dauert über drei Stunden.",          # lang
    "2192": "Die Länge des Tisches beträgt zwei Meter.",               # Länge
    "2193": "Fahre bitte langsam, die Straße ist sehr eng.",           # langsam
    "2194": "Er hatte das Problem längst erkannt, bevor andere es sahen.", # längst
    "2195": "Das Buch ist langweilig, ich habe es nach zwanzig Seiten wegelegt.", # langweilig
    "2196": "An verregneten Tagen kommt schnell die Langeweile.",       # Langeweile
    "2197": "Der Lärm auf der Baustelle ist sehr störend.",            # Lärm
    "2198": "Er lässt die Kinder nicht alleine draußen spielen.",      # lassen
    "2199": "Ein großer Laster blockierte die Straße.",                # Laster
    "2200": "Er ist heute früh viele Kilometer gelaufen.",             # gelaufen
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

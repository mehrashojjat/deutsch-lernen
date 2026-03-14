import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 9: IDs 2201–2450
updates = {
    "2201": "Ich bin heute sehr müde, weil ich kaum geschlafen habe.",                      # bin
    "2202": "Sie hat neues Geschirr für die Küche gekauft.",                               # neues
    "2203": "Er hatte keine Zeit, den Bericht rechtzeitig abzugeben.",                    # hatte
    "2204": "Die Kinder lernen in der Schule sprechen und schreiben.",                    # sprechen
    "2205": "Er hat lange in Kanada gelebt und spricht fließend Englisch.",               # gelebt
    "2206": "Das ist nicht der richtige Weg, das Problem zu lösen.",                      # nicht
    "2207": "Er stellt mir sein neuen Kollegen vor.",                                     # neuen
    "2208": "Was soll ich aus diesem alten Stoff machen?",                               # machen
    "2209": "Bitte anschnallen, wir fahren gleich los.",                                 # anschnallen
    "2210": "Nach dem Schnitt sind die Haare etwas kürzer als gewünscht.",               # kürzer
    "2211": "Die Arbeit macht ihm viel Spaß.",                                           # Arbeit
    "2212": "Sie müssen noch eine Stunde warten, bis der Arzt Zeit hat.",                # warten
    "2213": "Sie hat lange auf eine Antwort gewartet.",                                  # lange
    "2214": "Er lernt Russisch und übt täglich das Sprechen.",                           # sprechen (dup)
    "2215": "Das war ein schrecklichen Unfall auf der Autobahn.",                        # schrecklichen
    "2216": "Er hat das Kind allein zu Hause gelassen.",                                 # gelassen
    "2217": "Sie schneidet das Gemüse für den Salat.",                                   # schneiden
    "2218": "Lass mich bitte ausreden, ich bin noch nicht fertig.",                      # lassen
    "2219": "Das ist nicht so einfach, wie es aussieht.",                               # nicht (dup)
    "2220": "Die Lernerin macht täglich Fortschritte im Deutschkurs.",                  # Lernerin
    "2221": "Er liest jeden Abend vor dem Schlafen.",                                   # lesen
    "2222": "Der Leser schrieb einen ausführlichen Kommentar zum Artikel.",             # Leser
    "2223": "Die Leserin empfahl das Buch ihren Freundinnen.",                          # Leserin
    "2224": "Das war der letzte Zug des Abends.",                                      # letzt
    "2225": "Viele Leute warten auf den Bus.",                                         # Leute
    "2226": "Im Lexikon fand er die Bedeutung des unbekannten Wortes.",                # Lexikon
    "2227": "Sie liebt ihren Beruf und geht jeden Tag gerne zur Arbeit.",              # lieben
    "2228": "Sei lieb zu deinen Geschwistern.",                                        # lieb
    "2229": "Liebe ist die stärkste Kraft der Welt.",                                  # Liebe
    "2230": "Dieses Lied kannte sie schon aus ihrer Kindheit.",                        # Lied
    "2231": "Das Paket wird morgen an Ihre Adresse geliefert.",                        # liefern
    "2232": "Die Bestellung wurde pünktlich geliefert.",                               # geliefert
    "2233": "Die Lieferung kam einen Tag früher als erwartet.",                        # Lieferung
    "2234": "Das Buch liegt auf dem Nachttisch neben dem Bett.",                       # liegen
    "2235": "Der Lehrling lernt in der Bäckerei das Handwerk von Grund auf.",          # Lehrling
    "2236": "Die Tasche ist leicht, obwohl viel drin ist.",                            # leicht
    "2237": "Er leidet seit Jahren an Rückenproblemen.",                               # leiden
    "2238": "Leider kann ich heute nicht kommen.",                                     # leider
    "2239": "Kann ich mir dein Fahrrad leihen?",                                      # leihen
    "2240": "Bitte sprich leise, das Baby schläft.",                                  # leise
    "2241": "Sie kann sich das teure Auto nicht leisten.",                            # leisten
    "2242": "Seine schulische Leistung hat sich dieses Jahr deutlich verbessert.",    # Leistung
    "2243": "Sie leitet eine Abteilung mit zwanzig Mitarbeitern.",                    # leiten
    "2244": "Der Leiter des Teams traf alle wichtigen Entscheidungen.",               # Leiter (male)
    "2245": "Die Leiterin des Projekts präsentierte die Ergebnisse.",                 # Leiterin (female)
    "2246": "Er übernahm die Leitung des Unternehmens nach dem Tod seines Vaters.",  # Leitung
    "2247": "Er kletterte die Leiter hinauf, um die Lampe zu wechseln.",             # Leiter (ladder)
    "2248": "Er lernt Spanisch, weil er nach Südamerika reisen möchte.",             # lernen
    "2249": "Sie hat das Rezept auswendig gelernt.",                                  # gelernt
    "2250": "Er kennt die rechten Regeln und hält sich immer daran.",                # rechten
    "2251": "Das Ergebnis war so gut, dass alle überrascht waren.",                  # so
    "2252": "Mach bitte das Licht aus, wenn du das Zimmer verlässt.",               # Licht
    "2253": "Wir fahren morgen früh in den Urlaub.",                                # wir
    "2254": "Das Konzert war sehr gut.",                                             # sehr
    "2255": "Es ist zu spät, um noch ins Kino zu gehen.",                           # zu
    "2256": "Er hat viel Zeit damit verbracht, das Problem zu lösen.",              # viel
    "2257": "Er kaufte ein Eis und genoss es im Park.",                             # ein
    "2258": "Sie hat viel zu tun und kaum Zeit zum Ausruhen.",                      # viel (dup)
    "2259": "Er reist am liebsten allein.",                                         # allein
    "2260": "Er gab ihr einen Strauß roter Rosen.",                                # einen
    "2261": "Kann ich dir irgendwie helfen?",                                       # helfen
    "2262": "Er muss dringend zum Arzt gehen.",                                     # muss
    "2263": "Kann ich mir dieses Buch ausleihen?",                                  # ausleihen
    "2264": "Könntest du bitte etwas leiser sprechen?",                            # leiser
    "2265": "Das ist nicht einfach, ich brauche mehr Zeit.",                        # nicht (dup)
    "2266": "Er kann sich diesen Luxus finanziell leisten.",                        # leisten (dup)
    "2267": "Das war ganz anders, als er es erwartet hatte.",                       # ganz
    "2268": "Alle Plätze im Zug waren besetzt.",                                    # besetzt
    "2269": "Sie lässt die Kinder abends allein zu Hause.",                        # lassen (dup)
    "2270": "Er öffnete das Fenster, um frische Luft hereinzulassen.",             # Fenster
    "2271": "Im Frühling ist die Luft frisch und sauber.",                         # Luft
    "2272": "Man sollte niemals lügen.",                                           # lügen
    "2273": "Er hat eine Lüge erzählt und wurde dabei erwischt.",                 # Lüge
    "2274": "Ich habe Lust, heute Abend ins Kino zu gehen.",                      # Lust
    "2275": "Der lustige Film ließ alle herzlich lachen.",                         # lustig
    "2276": "Was soll ich heute zum Abendessen machen?",                          # machen
    "2277": "Das Mädchen spielt mit seiner Puppe im Garten.",                     # Mädchen
    "2278": "Er liest gerne Reisemagazine in seiner Freizeit.",                   # Magazin
    "2279": "Er hat Magenschmerzen und kann kaum essen.",                         # Magen
    "2280": "Er achtet auf eine magere Ernährung und vermeidet Fett.",            # mager
    "2281": "Guten Appetit! Die Mahlzeit ist fertig.",                            # Mahlzeit
    "2282": "Er hat eine Mahnung wegen einer unbezahlten Rechnung erhalten.",     # Mahnung
    "2283": "Im Sommer trinkt sie gerne kalte Limonade.",                         # Limonade
    "2284": "Welche Linie fährt zum Hauptbahnhof?",                              # Linie
    "2285": "Biegen Sie links ab und dann geradeaus.",                            # links
    "2286": "Klick auf diesen Link, um die Seite zu öffnen.",                    # link
    "2287": "Sie hat sich die Lippen mit rotem Lippenstift bemalt.",             # Lippe
    "2288": "Der Lehrer lobte die Schüler für ihre guten Leistungen.",           # loben
    "2289": "Er hat ein Loch in seinem Schuh.",                                  # Loch
    "2290": "Die Atmosphäre in dem kleinen Café war locker und entspannt.",      # locker
    "2291": "Zum Essen brauche ich einen Löffel.",                               # Löffel
    "2292": "Sein Lohn reicht nicht, um alle Rechnungen zu bezahlen.",           # Lohn
    "2293": "In dem netten Lokal gibt es sehr gutes Bier.",                      # Lokal
    "2294": "Los, wir müssen sofort aufbrechen!",                                # los
    "2295": "Er fuhr um sieben Uhr morgens los.",                                # losfahren
    "2296": "Er löschte versehentlich die wichtige Datei.",                      # löschen
    "2297": "Sie versuchte, das komplizierte Problem zu lösen.",                 # lösen
    "2298": "Ich brauche noch etwas Zeit, um die Aufgabe zu erledigen.",        # brauche
    "2299": "Hast du schon alles gemacht, was du tun solltest?",                # gemacht
    "2300": "Heute ist es sehr warm, fast dreißig Grad.",                       # warm
    "2301": "Was kann ich für dich machen?",                                    # machen (dup)
    "2302": "Das Geschäft ist sonntags geschlossen.",                           # geschlossen
    "2303": "Er hat nichts gesagt und einfach den Raum verlassen.",            # nichts
    "2304": "Er hat das Buch einmal gelesen und war begeistert.",              # einmal
    "2305": "An der Kreuzung müssen Sie links abbiegen.",                      # abbiegen
    "2306": "Gehen Sie bitte zum Schalter.",                                   # zum
    "2307": "Sie kommt morgen um neun Uhr.",                                   # sie
    "2308": "Er kocht und sie deckt den Tisch.",                               # und
    "2309": "Ein Besuch der Ausstellung lohnt sich sehr.",                     # lohnt
    "2310": "Er richtete sich ein gemütliches Arbeitszimmer ein.",             # gemütliches
    "2311": "Ich brauche einen Kugelschreiber zum Unterschreiben.",            # brauche (dup)
    "2312": "Das ist euer Hund, stimmt's?",                                   # euer
    "2313": "Die Maschine produziert täglich mehrere tausend Flaschen.",       # Maschine
    "2314": "Das Material ist hochwertig und sehr langlebig.",                 # Material
    "2315": "Die alte Mauer aus Stein trennt die beiden Gärten.",             # Mauer
    "2316": "Das Zimmer hat maximal zehn Personen Platz.",                    # maximal
    "2317": "Der Mechaniker reparierte das Auto in wenigen Stunden.",         # Mechaniker
    "2318": "Die Mechanikerin überprüfte die Bremsen des Fahrzeugs.",         # Mechanikerin
    "2319": "In den modernen Medien verbreiten sich Nachrichten sehr schnell.", # Medien
    "2320": "Er nimmt täglich ein Medikament gegen seinen Blutdruck.",        # Medikament
    "2321": "Sie studiert Medizin und möchte Ärztin werden.",                 # Medizin
    "2322": "Im Urlaub schläft er gerne direkt am Meer.",                     # Meer
    "2323": "Zum Backen braucht man Mehl, Eier und Zucker.",                  # Mehl
    "2324": "Er möchte mehr schlafen, weil er immer müde ist.",               # mehr
    "2325": "Es gibt mehrere Möglichkeiten, dieses Problem zu lösen.",        # mehrere
    "2326": "Die Mehrheit der Bevölkerung unterstützt die neue Regelung.",    # Mehrheit
    "2327": "Er hat die Aufgabe zum dritten Mal gelöst.",                     # Mal
    "2328": "Sie malt gerne Landschaften und Stillleben.",                    # malen
    "2329": "Der Maler hat das Wohnzimmer in einem freundlichen Gelb gestrichen.", # Maler
    "2330": "Die Malerin stellt ihre Bilder in einer kleinen Galerie aus.",   # Malerin
    "2331": "Man sollte regelmäßig frische Luft schnappen.",                  # man
    "2332": "Manch ein Schüler hat Angst vor dem Vortrag.",                   # manch
    "2333": "Das Formular hat ein Feld für das männliche Geschlecht.",        # männlich
    "2334": "Die Mannschaft gewann das Spiel trotz schwieriger Bedingungen.", # Mannschaft
    "2335": "Es wird kälter, also ziehe ich meinen Mantel an.",               # Mantel
    "2336": "Sie benutzt Margarine statt Butter beim Backen.",                # Margarine
    "2337": "Er kauft nur Produkte von bekannten Marken.",                    # Marke
    "2338": "Bitte markiere die wichtigen Sätze im Text.",                   # markieren
    "2339": "Jeden Samstag gehen sie auf den Markt, um frisches Gemüse zu kaufen.", # Markt
    "2340": "Er reist immer mit dem Zug.",                                    # mit
    "2341": "Der Motor springt nicht an, ich muss starten.",                  # starten
    "2342": "Sie hat das Abendessen schnell gemacht.",                        # gemacht (dup)
    "2343": "Er ist alleine auf den Baum geklettert.",                       # geklettert
    "2344": "Sie haben zwei Zimmer in dem Hotel gebucht.",                    # zwei
    "2345": "Der Schreiner kann das kaputte Regal reparieren.",              # reparieren
    "2346": "Er arbeitet bei einer kleinen Firma in der Innenstadt.",        # bei
    "2347": "Sie wohnen in einem großes Haus auf dem Land.",                 # großes
    "2348": "Der Arzt hat ihm ein Medikament für den Husten verschrieben.",  # verschrieben
    "2349": "Er hat fünf Sprachen gelernt und spricht alle gut.",            # fünf
    "2350": "Sie hat ihm beim Umzug geholfen.",                              # geholfen
    "2351": "Er ist noch müde von der langen Reise.",                       # noch
    "2352": "Das war die beste Entscheidung meines letzten Jahres.",        # letzten
    "2353": "Niemand hat bemerkt, dass sie früher gegangen war.",           # niemand
    "2354": "Er lebt in einem kleinen Dorf in der Nähe von München.",      # in
    "2355": "Die Mutter lässt die Kinder nicht alleine in den Park gehen.", # lassen (dup)
    "2356": "Im Ausverkauf ist alles viel billiger als sonst.",             # billiger
    "2357": "Er geht ins Schwimmbad, um seine Bahnen zu ziehen.",          # ins
    "2358": "Sie hat keine Zeit für lange Spaziergänge.",                  # keine
    "2359": "Er schneidet das Brot mit einem scharfen Messer.",            # Messer
    "2360": "Das Geländer ist aus Metall und sehr stabil.",                # Metall
    "2361": "Berlin ist eine europäische Metropole mit vielen Sehenswürdigkeiten.", # Metropole
    "2362": "Beim Metzger kauft er immer frisches Fleisch.",               # Metzger
    "2363": "Die Miete für diese Wohnung beträgt achthundert Euro.",       # Miete
    "2364": "Der Mieter beschwerte sich über den Lärm der Nachbarn.",      # Mieter
    "2365": "Die Mieterin zahlt ihre Miete immer pünktlich.",              # Mieterin
    "2366": "Der Migrant hat sich schnell integriert.",                    # Migrant
    "2367": "Das Thema Migration ist in Europa sehr aktuell.",             # Migration
    "2368": "Sie trinkt jeden Morgen ein Glas warme Milch.",               # Milch
    "2369": "Das Wetter ist mild und angenehm für diese Jahreszeit.",      # mild
    "2370": "Die Minderheit der Bevölkerung spricht eine andere Sprache.", # Minderheit
    "2371": "Er schläft mindestens sieben Stunden pro Nacht.",             # mindestens
    "2372": "Nach dem Sport trinkt er gerne ein Glas Mineralwasser.",      # Mineralwasser
    "2373": "Der Unterschied ist minimal und kaum zu erkennen.",           # minimal
    "2374": "Sie mischt Mehl und Wasser, um den Teig zu machen.",        # mischen
    "2375": "Meinetwegen kannst du das Fenster aufmachen.",               # meinetwegen
    "2376": "Meiner Meinung nach ist das die beste Lösung.",              # Meinung
    "2377": "Er ist meistens pünktlich, nur selten kommt er zu spät.",    # meist(ens)
    "2378": "Er hat den Meister im Handwerk nach vielen Jahren Erfahrung erworben.", # Meister
    "2379": "Sie meldete sich krank, weil sie Fieber hatte.",            # melden
    "2380": "Die Meldung über den Unfall verbreitete sich schnell.",      # Meldung
    "2381": "Eine große Menge Menschen versammelte sich auf dem Platz.",  # Menge
    "2382": "In der Mensa isst man günstig zu Mittag.",                  # Mensa
    "2383": "Jeder Mensch hat das Recht auf ein würdiges Leben.",        # Mensch
    "2384": "Es war ein menschlicher Fehler, kein technisches Problem.", # menschlich
    "2385": "Das Menü des Restaurants wechselt mit den Jahreszeiten.",   # Menü
    "2386": "Er hat nicht gemerkt, dass die Tür offen stand.",          # merken
    "2387": "Sie verhält sich sehr merkwürdig, seit dem Gespräch.",      # merkwürdig
    "2388": "Auf der Messe präsentierte er sein neues Produkt.",         # Messe
    "2389": "Alle Mitarbeiter sind pünktlich erschienen.",               # sind
    "2390": "Der Zug fährt sehr schnell und ist in einer Stunde da.",    # schnell
    "2391": "Sie hat das Fahrrad für eine Woche gemietet.",              # gemietet
    "2392": "Das Auto wurde für die ganze Reise gemietet.",              # gemietet (dup)
    "2393": "Bitte warten Sie einen Moment.",                            # bitte
    "2394": "Der Wein hat einen milderen Geschmack als letztes Jahr.",   # milder
    "2395": "Man muss mindestens achtzehn Jahre alt sein.",              # mindestens (dup)
    "2396": "Wir haben keine Zeit mehr.",                                # haben
    "2397": "Hast du schon gegessen?",                                  # hast
    "2398": "Viele Menschen besuchen jedes Jahr das Museum.",           # viele
    "2399": "Er kaufte einen Hut im Kaufhaus.",                         # einen
    "2400": "Er hat sich beim Einwohnermeldeamt gemeldet.",             # gemeldet
    "2401": "Sie lebt in einer großen Stadt.",                          # große
    "2402": "Die Stadt wächst jedes Jahr um mehrere tausend Einwohner.", # Stadt
    "2403": "Das ist ganz anders als ich gedacht hatte.",               # anders
    "2404": "Sie stammt aus einem kleinen Dorf in Österreich.",         # aus
    "2405": "Er ist so freundlich, dass alle ihn mögen.",               # so
    "2406": "Er vergesse manchmal wichtige Termine.",                   # vergesse
    "2407": "Sie interessiert sich sehr für Mode und verfolgt die neuesten Trends.", # Mode
    "2408": "Das ist das neueste Modell und sehr beliebt.",             # Modell
    "2409": "Das Gebäude wurde modern renoviert.",                       # modern
    "2410": "Er mag Kaffee sehr und trinkt täglich drei Tassen.",       # mögen
    "2411": "Es ist möglich, dass er morgen kommt.",                    # möglich
    "2412": "Es gibt keine andere Möglichkeit, das Problem zu lösen.",  # Möglichkeit
    "2413": "Schreib bitte so deutlich wie möglichst.",                 # möglichst
    "2414": "Möhren sind gut für die Augen.",                          # Möhre
    "2415": "Er hat nur einen Moment Zeit, dann muss er weiter.",       # Moment
    "2416": "Der Mond leuchtet hell in der Nacht.",                    # Mond
    "2417": "Der Monitor ist kaputt, ich sehe nur ein schwarzes Bild.", # Monitor
    "2418": "Der Motor des Autos macht ein seltsames Geräusch.",        # Motor
    "2419": "Er fährt lieber Motorrad als Auto.",                       # Motorrad
    "2420": "Er gibt sich viel Mühe beim Lernen.",                     # Mühe
    "2421": "Bitte wirf den Müll in den richtigen Behälter.",          # Müll
    "2422": "Die Müllabfuhr kommt jeden Mittwoch.",                    # Müllabfuhr
    "2423": "Der Mitarbeiter des Jahres wurde mit einem Preis ausgezeichnet.", # Mitarbeiter
    "2424": "Die Mitarbeiterin kümmerte sich sehr gut um die Kunden.", # Mitarbeiterin
    "2425": "Das Café liegt in der Mitte der Stadt.",                  # Mitte
    "2426": "Bitte teilen Sie mir Ihre Entscheidung so bald wie möglich mit.", # mitteilen
    "2427": "Es gibt kein Mittel gegen diese Erkältung.",              # Mittel
    "2428": "Mitten in der Nacht wachte er von einem lauten Geräusch auf.", # mitten
    "2429": "Die mittlere Generation trägt oft die größte Verantwortung.", # mittler
    "2430": "Er hat mittlerweile einen neuen Job gefunden.",           # mittlerweile
    "2431": "Sie kaufte neue Möbel für das Wohnzimmer.",              # Möbel
    "2432": "Die Wohnung ist möbliert und sofort bewohnbar.",         # möbliert
    "2433": "Ich möchte bitte ein Glas Wasser.",                     # möchten
    "2434": "Er ist sehr mobil und reist viel für die Arbeit.",      # mobil
    "2435": "Bitte hinterlassen Sie eine Nachricht in meiner Mobilbox.", # Mobilbox
    "2436": "Seine Mobilität hat sich nach dem Unfall stark verbessert.", # Mobilität
    "2437": "Er kaufte ein Ticket für das Konzert.",                 # ein
    "2438": "Er hat den Kuchen ganz alleine gegessen.",              # ganz
    "2439": "Die Kinder lernen sprechen durch viel Übung.",          # sprechen (dup)
    "2440": "Er geht jetzt zum Arzt.",                               # zum
    "2441": "Wir haben alle Zeit der Welt.",                         # haben (dup)
    "2442": "Sie reisen mehrere Wochen durch Europa.",               # mehrere (dup)
    "2443": "Er wohnt seit Jahren im selben Viertel.",               # im
    "2444": "Sie hat das letzte Exemplar im Laden gekauft.",         # gekauft
    "2445": "Das ist nicht richtig, du hast einen Fehler gemacht.",  # nicht (dup)
    "2446": "Wir gehen jetzt essen, kommst du mit?",                 # wir
    "2447": "Er geht raus, um frische Luft zu schnappen.",           # raus
    "2448": "Ich warte schon seit einer Stunde auf dich.",           # ich
    "2449": "Willst du mit mir ins Kino gehen?",                     # mit
    "2450": "Er gibt den Kindern den Ball.",                         # den
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

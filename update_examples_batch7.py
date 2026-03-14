import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 7: IDs 1701–1950
updates = {
    "1701": "Das Geschäft ist am Sonntag geschlossen.",                                      # geschlossen
    "1702": "Er will ein kleines Holzhaus im Garten bauen.",                                 # bauen
    "1703": "Der Held der Geschichte rettete das ganze Dorf vor der Flut.",                  # Held
    "1704": "Die Heldin des Romans kämpft mutig für die Gerechtigkeit.",                     # Heldin
    "1705": "Kannst du mir bitte helfen, den schweren Koffer zu tragen?",                    # helfen
    "1706": "Er rief um Hilfe, als er im Fluss nicht mehr schwimmen konnte.",               # Hilfe
    "1707": "Das Zimmer ist sehr hell, weil es große Fenster hat.",                         # hell
    "1708": "Er zieht immer ein weißes Hemd zur Arbeit an.",                               # Hemd
    "1709": "Sie hat das Hähnchen im Ofen mit Kräutern und Knoblauch gebacken.",           # Hähnchen
    "1710": "Komm her, ich möchte dir etwas Wichtiges zeigen.",                             # her
    "1711": "Die größte Herausforderung war es, alle Fristen einzuhalten.",                 # Herausforderung
    "1712": "Welcher Herkunft bist du? Ich bin in der Türkei geboren.",                    # Herkunft
    "1713": "Herr Schmidt, ich habe Ihren Anruf leider verpasst.",                         # Herr
    "1714": "Diese Fabrik stellt täglich tausende Flaschen her.",                          # herstellen
    "1715": "Der Hersteller bietet eine zweijährige Garantie auf das Gerät.",              # Hersteller
    "1716": "Sie hat ein kleines Haus am Stadtrand gekauft.",                              # Haus
    "1717": "Er hat vergessen, seine Hausaufgaben zu machen.",                             # Hausaufgabe
    "1718": "Die Hausfrau erledigt täglich viele Aufgaben in Haushalt und Garten.",        # Hausfrau
    "1719": "Er ist Hausmann und kümmert sich liebevoll um die Kinder.",                   # Hausmann
    "1720": "Ihr Mann arbeitet als Arzt in einem großen Krankenhaus.",                     # mann
    "1721": "Sie führen einen gemeinsamen Haushalt und teilen sich alle Kosten.",          # Haushalt
    "1722": "Der Hausmeister reparierte das defekte Schloss an der Eingangstür.",          # Hausmeister
    "1723": "Die Hausmeisterin überprüft regelmäßig alle Räume des Gebäudes.",             # Hausmeisterin
    "1724": "Nach einem langen Tag in der Sonne wurde seine Haut rot.",                    # Haut
    "1725": "Er hob den schweren Karton vom Boden und trug ihn ins Regal.",               # heben
    "1726": "Sie schrieb die Notizen in ihr neues Heft.",                                  # Heft
    "1727": "Seine Heimat ist ein kleines Dorf in den bayerischen Alpen.",                 # Heimat
    "1728": "Er hat heimlich die Überraschungsparty organisiert.",                         # heimlich
    "1729": "Im Sommer ist es in der Stadt sehr heiß.",                                    # heiß
    "1730": "Wie heißt du? Ich heiße Maria.",                                              # heißen
    "1731": "Im Winter muss man die Wohnung täglich heizen.",                              # heizen
    "1732": "Die Heizung ist ausgefallen, deshalb ist es in der Wohnung sehr kalt.",      # Heizung
    "1733": "Wir sehen uns nächsten Dienstag.",                                            # nächsten
    "1734": "Das Fahrrad wurde gestohlen, obwohl es angeschlossen war.",                   # gestohlen
    "1735": "Der Raum ist hell und freundlich eingerichtet.",                              # hell
    "1736": "Sie hat ein neues Kleid für die Hochzeit gekauft.",                           # gekauft
    "1737": "Er kann Englisch und Spanisch sprechen.",                                     # sprechen
    "1738": "Er wartet an der Ecke auf seinen Freund.",                                    # an
    "1739": "Sie muss sich beeilen, sonst kommt sie zu spät.",                            # sich
    "1740": "Ich freue mich sehr auf den Urlaub.",                                         # ich
    "1741": "Er hob die Hand, um eine Frage zu stellen.",                                  # heben (dup)
    "1742": "Das Heim für ältere Menschen liegt direkt am Park.",                          # Heim
    "1743": "Wie heißt die Hauptstadt von Österreich? Sie heißt Wien.",                    # heißt
    "1744": "Das Schloss ist ein historisches Gebäude aus dem 16. Jahrhundert.",          # historisch
    "1745": "Bei dieser Hitze trinkt man besonders viel Wasser.",                         # Hitze
    "1746": "Kochen ist ihr liebstes Hobby, sie macht jeden Sonntag etwas Neues.",        # Hobby
    "1747": "Der Berg ist sehr hoch und man braucht gute Ausrüstung zum Wandern.",        # hoch
    "1748": "Die Höhe des Turms beträgt über dreihundert Meter.",                         # Höhe
    "1749": "Er hat ein neues Video hochgeladen und viele Kommentare bekommen.",          # hochladen
    "1750": "Ich kann höchstens dreißig Euro für das Geschenk ausgeben.",                 # höchstens
    "1751": "Zur Hochzeit kamen über hundert Gäste aus der ganzen Welt.",                # Hochzeit
    "1752": "Die Kinder spielen nachmittags im Hof des Wohnhauses.",                     # Hof
    "1753": "Auf dem Bauernhof gibt es Kühe, Schweine und Hühner.",                      # Bauernhof
    "1754": "Er hofft, dass er die Prüfung beim ersten Versuch besteht.",                # hoffen
    "1755": "Hoffentlich wird das Wetter am Wochenende besser.",                         # hoffentlich
    "1756": "Trotz vieler Rückschläge hat er seine Hoffnung nie aufgegeben.",            # Hoffnung
    "1757": "Man sollte immer höflich sein, auch wenn man gestresst ist.",               # höflich
    "1758": "Er holte die Kinder nach der Schule ab.",                                   # holen
    "1759": "Das Haus ist aus Holz gebaut und sieht sehr gemütlich aus.",               # Holz
    "1760": "Er hat ein krankes Herz und muss regelmäßig zum Arzt.",                    # Herz
    "1761": "Sie hat ihn herzlich zum Geburtstag gratuliert.",                          # herzlich
    "1762": "Das Wetter ist heute herrlich, über zwanzig Grad und Sonnenschein.",        # heute
    "1763": "Die heutige Veranstaltung beginnt um neun Uhr.",                           # heutig
    "1764": "Hier riecht es sehr gut, hast du gerade gekocht?",                         # hier
    "1765": "Komm hierher, ich habe etwas Interessantes gefunden.",                     # hierher
    "1766": "Der Himmel ist blau und es gibt keine einzige Wolke.",                     # Himmel
    "1767": "Hinten im Rucksack ist noch Platz für das Brot.",                         # hinten
    "1768": "Hinter dem Haus gibt es einen großen Garten.",                            # hinter
    "1769": "Er hinterließ eine kurze Nachricht auf dem Anrufbeantworter.",            # hinterlassen
    "1770": "Er lief hinterher, weil er den Bus fast verpasst hatte.",                # hinterher
    "1771": "Der Lehrer wies die Schüler auf den Fehler in der Aufgabe hin.",         # hinweisen
    "1772": "Der Rabatt gilt höchstens für zehn Artikel pro Person.",                 # höchstens (dup)
    "1773": "Die Stadt ist viel größer als erwartet.",                                # groß (filler)
    "1774": "Er hat fünfzig Bücher in seinem Regal stehen.",                          # fünfzig
    "1775": "Sie ist immer gut gelaunt und lächelt viel.",                            # immer
    "1776": "Er kommt aus dem Ausland und hat sich schnell eingelebt.",               # aus
    "1777": "Er schläft nachmittags gerne eine kurze Stunde.",                        # nachmittags
    "1778": "Er ist schon wieder zurück von der Dienstreise.",                        # zurück
    "1779": "Sie will nicht mehr, sie hat mehr als genug getan.",                     # mehr
    "1780": "Die Wohnung liegt im dritten Stockwerk des Gebäudes.",                   # -nung (fragment, contextual)
    "1781": "Bitte hinterlasse eine Nachricht, wenn du anrufst.",                     # hinterlassen (dup)
    "1782": "Es gibt noch Karten für das Konzert nächsten Freitag.",                  # gibt
    "1783": "Kannst du mir bitte helfen, den Koffer zu tragen?",                      # kannst
    "1784": "Er hat aus Versehen sein Handy vom Tisch runtergeworfen.",               # runterwerfen
    "1785": "Er hat seinen Termin vergessen und musste neu vereinbaren.",             # vergessen
    "1786": "Das Auto steht vorne vor dem Gebäude.",                                  # vorne
    "1787": "Das Haus hat drei Etagen und einen schönen Garten.",                     # Haus (dup)
    "1788": "Das ist nicht das richtige Formular für diesen Antrag.",                 # nicht
    "1789": "Sie hat dem Kind eine Nachricht hinterlassen.",                          # hinterlassen (dup)
    "1790": "Er hat hart gelernt und die Prüfung bestanden.",                         # gelernt
    "1791": "Er sagte, dass er morgen kommt.",                                        # dass
    "1792": "Das Import-Geschäft handelt mit Waren aus Asien.",                       # Import
    "1793": "Er lebt in einer kleinen Stadt in Bayern.",                               # in
    "1794": "Indem er mehr übte, wurde er immer besser.",                             # indem
    "1795": "Er kam nicht zur Arbeit, weil er eine Infektion hatte.",                 # Infektion
    "1796": "Bitte informieren Sie mich, sobald das Paket ankommt.",                  # informieren
    "1797": "Auf dieser Webseite findet man viele nützliche Informationen.",          # Information
    "1798": "Der Ingenieur entwarf eine neue Brücke über den Fluss.",                 # Ingenieur
    "1799": "Der Inhalt des Buches hat mich sehr beeindruckt.",                       # Inhalt
    "1800": "Das Frühstück ist inklusive im Preis des Hotelzimmers.",                 # inklusive
    "1801": "Von innen sieht das Haus viel größer aus als von außen.",               # innen
    "1802": "Sie hat einen inneren Konflikt und weiß nicht, was sie tun soll.",      # inner
    "1803": "Die Hörerin stellte nach dem Vortrag eine interessante Frage.",         # Hörerin
    "1804": "Der Zuhörer lauschte dem Konzert aufmerksam.",                          # Zuhörer
    "1805": "Sie hat eine neue schwarze Hose für die Arbeit gekauft.",               # Hose
    "1806": "Vom Hügel aus hat man einen wunderschönen Blick über das Tal.",        # Hügel
    "1807": "Er hat einen guten Humor und bringt alle immer zum Lachen.",            # Humor
    "1808": "Nach dem langen Wandern hatte er großen Hunger.",                       # Hunger
    "1809": "Er ist hungrig und freut sich auf das Mittagessen.",                    # hungrig
    "1810": "Der Autofahrer hupte, weil die Ampel schon lange grün zeigte.",        # hupen
    "1811": "Er hustet seit einer Woche, aber er geht nicht zum Arzt.",             # husten
    "1812": "Sie hat Husten und Schnupfen und bleibt deshalb zu Hause.",            # Husten
    "1813": "Er trägt immer einen Hut, wenn er in die Sonne geht.",                # Hut
    "1814": "Im Urlaub übernachteten sie in einer kleinen Hütte in den Bergen.",   # Hütte
    "1815": "Am Bahnhof gibt es einen Imbiss, wo man günstig essen kann.",         # Imbiss
    "1816": "Es wird von Tag zu Tag schlimmer, wir müssen dringend handeln.",       # schlimmer
    "1817": "Die Aufgabe ist zu schwierig für einen Anfänger.",                    # zu
    "1818": "Er muss gleich gehen, sonst verpasst er den Bus.",                    # gehen
    "1819": "Er hat sie einmal im Jahr auf der Messe getroffen.",                  # einmal
    "1820": "Er geht ins Kino, wenn er einen freien Abend hat.",                   # ins
    "1821": "Hier ist das Büro des Direktors.",                                    # hier (dup)
    "1822": "Sie lernt individuell und macht eigene Notizen.",                     # individuell
    "1823": "Er zeigt mir sein neuen Plan für das Projekt.",                       # neuen
    "1824": "Er hat über seine Erfahrungen in Australien berichtet.",              # über
    "1825": "Das war genau das, was ich gesucht habe.",                            # genau
    "1826": "Er hat einen langen Bericht abgegeben.",                              # einen
    "1827": "Er möchte ein gutes Leben führen.",                                   # sein
    "1828": "Das Paket muss innerhalb von drei Tagen ankommen.",                   # innerhalb
    "1829": "Sie wollte aus Pappe ein kleines Haus machen.",                       # machen
    "1830": "Sie hat die Brille endlich unter dem Sofa gefunden.",                 # gefunden
    "1831": "Das ist ein sehr schönes Bild.",                                      # sch (fragment, contextual)
    "1832": "Er hat die Prüfung bestanden und ist jetzt sehr froh.",               # hat
    "1833": "Das Restaurant ist nicht weit von hier.",                             # nicht
    "1834": "Heute habe ich keine Zeit für einen langen Spaziergang.",             # habe
    "1835": "Hast du heute schon gefrühstückt?",                                   # du
    "1836": "Er hat die ganze Nacht gehustet und konnte kaum schlafen.",           # gehustet
    "1837": "Er wohnt schon seit Jahren in dieser Stadt.",                         # in (dup)
    "1838": "Das neue Fahrrad ist ideal für lange Touren in den Bergen.",          # ideal
    "1839": "Ich finde diesen Vorschlag sehr interessant.",                        # finde
    "1840": "Inzwischen hat sie sich gut in der neuen Stadt eingelebt.",           # inzwischen
    "1841": "Irgendwas stimmt hier nicht, aber ich kann es nicht erklären.",       # irgend-
    "1842": "Hast du irgendein Buch dabei, das ich lesen kann?",                  # irgendein
    "1843": "Irgendwann möchte ich nach Australien reisen.",                       # irgendwann
    "1844": "Ja, ich komme morgen zum Kurs.",                                      # ja
    "1845": "Er zieht sich die Jacke an, weil es draußen kalt ist.",              # Jacke
    "1846": "Er kaufte am Kiosk einen Snack für unterwegs.",                       # Snack
    "1847": "Er ist ein biss müde, aber macht trotzdem weiter.",                   # biss
    "1848": "Je mehr man übt, desto besser wird man.",                             # je
    "1849": "Sie trägt am liebsten Jeans und ein T-Shirt.",                        # Jeans
    "1850": "Sie hat das Inserat in der Zeitung gelesen und sich sofort gemeldet.", # Inserat
    "1851": "Die Reise hat insgesamt zwei Wochen gedauert.",                       # insgesamt
    "1852": "Er hat ein neues Programm auf seinem Laptop installiert.",            # installieren
    "1853": "Sie studiert am Institut für Germanistik an der Uni.",                # Institut
    "1854": "Er spielt mehrere Instrumente, darunter Geige und Klavier.",          # Instrument
    "1855": "Die Integration der neuen Mitarbeiter verlief sehr reibungslos.",     # Integration
    "1856": "Sie ist sehr intelligent und lernt schnell.",                         # intelligent
    "1857": "Künstliche Intelligenz verändert viele Bereiche unseres Alltags.",    # Intelligenz
    "1858": "Das Training war intensiv, aber sehr effektiv.",                      # intensiv
    "1859": "Sie belegte einen Intensivkurs in Deutsch, um schnell Fortschritte zu machen.", # Intensivkurs
    "1860": "Er interessiert sich sehr für Geschichte und liest viele Bücher darüber.", # interessieren
    "1861": "Das Buch ist sehr interessant, ich kann es kaum weglegen.",           # interessant
    "1862": "Sie hat großes Interesse an Kunst und besucht regelmäßig Galerien.", # Interesse
    "1863": "Er ist an der deutschen Kultur sehr interessiert.",                   # interessiert
    "1864": "Interkulturelles Verständnis ist wichtig für ein gutes Zusammenleben.", # interkulturell
    "1865": "Das Unternehmen ist international tätig und hat Büros in zehn Ländern.", # international
    "1866": "Sie hat heute etwas interessantes in der Zeitung gelesen.",           # interessantes
    "1867": "Dank intensivem Training können wir bald fließend sprechen.",        # können
    "1868": "Ich habe den Film schon gesehen.",                                    # gesehen
    "1869": "Er ist nicht krank, sondern nur müde.",                               # sondern
    "1870": "Er hat sich geirrt und musste seine Aussage korrigieren.",            # geirrt
    "1871": "Da es regnete, blieben alle drinnen.",                                # da
    "1872": "Wie es ihm geht? Es geht ihm heute besser.",                          # geht
    "1873": "Der neue Park liegt zwischen dem Rathaus und der Bibliothek.",        # zwischen
    "1874": "Er bekommt monatlich sein Gehalt auf das Konto überwiesen.",          # bekommt
    "1875": "Das neue Modell ist besser als das alte.",                            # besser
    "1876": "Er kauft jeden Tag frische Brötchen für das Frühstück.",              # für
    "1877": "Sie lebt in einer kleinen Wohnung im Zentrum.",                       # kleinen
    "1878": "Die Kinder sind gut integriert und haben viele Freunde gefunden.",   # integriert
    "1879": "Mit mehr Übung wird es besser.",                                      # besser (dup)
    "1880": "Er hat einen guten Ruf als zuverlässiger Mitarbeiter.",               # gut
    "1881": "Er kaufte einen Blumenstrauß für seine Mutter.",                      # einen
    "1882": "Sie ist sehr interessiert an neuen Technologien.",                    # interessiert (dup)
    "1883": "Er hat den Artikel in der Zeitung gelesen.",                          # gelesen
    "1884": "Sie kommt aus einer kleinen Stadt aus dem Norden.",                   # aus
    "1885": "Das interkulturelle Treffen hat alle Beteiligten bereichert.",        # interkulturell (dup)
    "1886": "Sie nimmt an einem interkulturellen Austauschprogramm teil.",         # interkulturelles
    "1887": "Alle Mitarbeiter sind sehr engagiert und fleißig.",                   # sind
    "1888": "Er ist in der ganzen Stadt als guter Arzt bekannt.",                  # bekannt
    "1889": "Das Ladekabel liegt auf dem Schreibtisch neben dem Laptop.",         # Kabel
    "1890": "Sie zog sich in der Kabine um, bevor sie ins Hallenbad ging.",        # Kabine
    "1891": "Möchten Sie einen Kaffee oder lieber Tee?",                           # Kaffee
    "1892": "Das gemütliche Kaffeehaus am Stadtrand lädt zum Verweilen ein.",     # Kaffeehaus
    "1893": "Die Kinder trinken morgens gerne warmen Kakao.",                      # Kakao
    "1894": "Im Winter ist es draußen sehr kalt.",                                 # kalt
    "1895": "Die Kälte in dieser Region kann im Winter bis auf minus zwanzig Grad fallen.", # Kälte
    "1896": "Der Fotograf nutzt eine hochwertige Kamera für seine Aufnahmen.",    # Kamera
    "1897": "Die Mannschaft kämpft bis zum letzten Moment und verliert knapp.",   # kämpfen
    "1898": "Der Kampf gegen die Armut erfordert internationale Zusammenarbeit.", # Kampf
    "1899": "Der Schiffskanal verbindet die zwei benachbarten Städte miteinander.", # Kanal
    "1900": "Der Kandidat stellte sich kurz vor und beantwortete alle Fragen.",   # Kandidat
    "1901": "In der Firmenkantine können Mitarbeiter günstig zu Mittag essen.",   # Kantine
    "1902": "Das erste Kapitel des Buches hat mich sofort begeistert.",           # Kapitel
    "1903": "Jedes Kind in der Klasse hat einen anderen Lernstil.",               # jedes
    "1904": "Er war müde, jedoch hat er pünktlich die Aufgabe abgegeben.",        # jedoch
    "1905": "Warst du jemals in Japan? Ich noch nicht.",                          # jemals
    "1906": "Hat jemand meine Schlüssel gesehen?",                               # jemand
    "1907": "Wir müssen jetzt aufbrechen, sonst verpassen wir den Zug.",         # jetzt
    "1908": "Jeder Schüler bekommt jeweils ein Exemplar des Buches.",            # jeweils
    "1909": "Der Journalist interviewte den Minister live im Fernsehen.",          # Journalist
    "1910": "Die Journalistin berichtete über die Lage in der Krisenregion.",    # Journalistin
    "1911": "In seiner Jugend spielte er im Stadtpark täglich Fußball.",         # Jugend
    "1912": "Viele Jugendliche verbringen viel Zeit mit dem Smartphone.",        # Jugendliche (male)
    "1913": "Die Jugendliche lernte drei Sprachen gleichzeitig.",                # Jugendliche (female)
    "1914": "Sie übernachteten günstig in einer Jugendherberge am Stadtrand.",   # Jugendherberge
    "1915": "Er ist noch jung, hat aber schon viel Erfahrung.",                  # jung
    "1916": "Der kleine Junge weinte, weil er sein Eis fallen gelassen hatte.",  # Junge
    "1917": "Das Gerät gerät nicht in Betrieb, weil der Strom fehlt.",           # gerät
    "1918": "Sie fährt täglich mit dem Bus zur Schule.",                         # mit
    "1919": "Er muss sein Handy noch laden, bevor er das Haus verlässt.",        # laden
    "1920": "Er kaufte ein Buch und ein Magazin.",                               # ein
    "1921": "Er will etwas essen, bevor die Veranstaltung beginnt.",             # essen
    "1922": "Er spricht zwei Sprachen und lernt gerade eine dritte.",            # zwei
    "1923": "Er macht das anders als alle anderen, und das macht ihn besonders.", # anders
    "1924": "Kann ich mir dein Fahrrad leihen? Meins ist kaputt.",               # leihen
    "1925": "Sie geht dreimal die Woche ins Fitness-Studio.",                    # Fitness-Studio
    "1926": "Er erzählte meinem Bruder die Geschichte.",                         # meinem
    "1927": "Sie macht das immer anders als erwartet.",                          # anders (dup)
    "1928": "Der Kurs findet donnerstags um neun Uhr statt.",                    # donnerstags
    "1929": "Er will Arzt werden und studiert Medizin.",                         # werden
    "1930": "Das Paket ist für dich, es kam heute Morgen an.",                   # für (dup)
    "1931": "Ich bin sehr gespannt auf den neuen Film.",                         # ich
    "1932": "Er suchte die getippte Seite im Heft.",                            # -te (fragment contextual)
    "1933": "Die Käuferin verhandelte den Preis und bekam einen Rabatt.",        # Käuferin
    "1934": "Er spricht kaum, weil er sehr schüchtern ist.",                    # kaum
    "1935": "Ich habe kein Geld mehr dabei.",                                   # kein
    "1936": "Im Keller lagern viele alte Kisten und Möbel.",                    # Keller
    "1937": "Der Kellner brachte die Bestellung in wenigen Minuten.",           # Kellner
    "1938": "Die Kellnerin empfahl uns das Tagesgericht.",                      # Kellnerin
    "1939": "Ich kenne ihn schon seit vielen Jahren.",                          # kennen
    "1940": "Sie lernten sich auf einer Konferenz kennen.",                     # kennenlernen
    "1941": "Kennst du die Regel? Ich kenne sie nicht.",                        # kennen (dup)
    "1942": "Für diese Stelle braucht man gute Kenntnisse in Englisch.",       # Kenntnisse
    "1943": "Das Kennzeichen des Autos beginnt mit den Buchstaben M für München.", # Kennzeichen
    "1944": "Der Strom ist ausgefallen, deshalb haben wir Kerzen angezündet.",  # Kerze
    "1945": "Das Kind besucht seit diesem Jahr den Kindergarten.",              # Kindergarten
    "1946": "Er erinnert sich gerne an seine glückliche Kindheit.",            # Kindheit
    "1947": "Am Freitagabend gehen sie meist ins Kino.",                       # Kino
    "1948": "Am Kiosk kauft er jeden Morgen eine Zeitung.",                    # Kiosk
    "1949": "Das Gerät ist kaputtgegangen, wir brauchen ein neues.",           # kaputtgehen
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

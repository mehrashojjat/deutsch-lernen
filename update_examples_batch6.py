import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 6: IDs 1451–1699
updates = {
    "1451": "In der Fußgängerzone darf kein Auto fahren, nur Fußgänger sind erlaubt.",      # Fußgängerzone
    "1452": "Sie füttern die Enten jeden Morgen am Teich im Park.",                          # füttern
    "1453": "Er hat die falsche Gabel benutzt, beim Dessert nimmt man die kleinere.",        # Gabel
    "1454": "In der Galerie werden Werke junger Künstler aus der Region ausgestellt.",        # Galerie
    "1455": "Sie hat das Buch ganz gelesen, ohne einmal aufzuhören.",                        # ganz
    "1456": "Er interessiert sich gar nicht für Fußball.",                                   # gar
    "1457": "Das Auto steht in der Garage, damit es nicht im Regen nass wird.",              # Garage
    "1458": "Der Hersteller garantiert, dass das Gerät fünf Jahre lang funktioniert.",       # garantieren
    "1459": "Wenn das Produkt kaputt geht, greife ich auf die Garantie zurück.",             # Garantie
    "1460": "Bitte hänge deinen Mantel an die Garderobe im Flur.",                          # Garderobe
    "1461": "Er hat sich beim Chef über die schlechten Arbeitsbedingungen beschwert.",       # beschwert
    "1462": "Kannst du mir bitte das Salz geben?",                                           # geben (dup)
    "1463": "Wir haben lange über das Thema diskutiert.",                                    # über
    "1464": "Sie hat die letzten zwei Wochen mit ihrer Familie verbracht.",                  # verbracht
    "1465": "Er gebraucht das Wörterbuch regelmäßig beim Schreiben von Texten.",            # gebrauchen (dup)
    "1466": "Sie hat sich ein neues Fahrrad gekauft.",                                       # gekauft
    "1467": "Er hat einen langen Brief an seine Eltern geschrieben.",                        # einen
    "1468": "Jeden Tag gehe ich zum Stall, um die Pferde zu füttern.",                      # füttern (dup)
    "1469": "Hast du heute schon gegessen? Die Küche schließt gleich.",                     # gegessen
    "1470": "Ich habe meinen Regenschirm im Bus vergessen.",                                 # vergessen
    "1471": "Ich lerne seit einem Jahr Deutsch.",                                            # ich
    "1472": "Er hat das Glas ganz ausgetrunken.",                                            # ganz (dup)
    "1473": "Bitte schalte das Gerät aus, wenn du es nicht benutzt.",                       # Gerät (dup)
    "1474": "Du musst das Formular bis Freitag beim Amt abgeben.",                          # abgeben
    "1475": "Sein Gehalt reicht nicht, um die hohe Miete zu bezahlen.",                    # Gehalt
    "1476": "Sie hat das Geheimnis ihrer besten Freundin verraten.",                        # Geheimnis
    "1477": "Die Informationen sind geheim und dürfen nicht weitergegeben werden.",         # geheim
    "1478": "Wir gehen heute Abend zusammen ins Kino.",                                     # gehen
    "1479": "Dieses Fahrrad gehört meiner Schwester.",                                      # gehören
    "1480": "Die Kinder spielen auf dem Bürgersteig vor dem Haus.",                        # Bürgersteig
    "1481": "Er hebt jeden Montag am Geldautomaten Bargeld ab.",                           # Geldautomat
    "1482": "Ihre Geldbörse war nicht mehr in der Tasche.",                                # Geldbörse
    "1483": "Er suchte überall nach seinem Portmonee, fand es aber unter dem Sofa.",       # Portmonee
    "1484": "Diese Gelegenheit, ins Ausland zu gehen, kommt nicht so schnell wieder.",      # Gelegenheit
    "1485": "Es gelang ihr, die schwierige Prüfung beim ersten Versuch zu bestehen.",      # gelingen
    "1486": "Dieses Auto ist für Familien mit kleinen Kindern gut geeignet.",              # geeignet
    "1487": "Bei Überschwemmungen besteht große Gefahr für die Anwohner.",                 # Gefahr
    "1488": "Das ist eine gefährliche Straße, weil es keine Beleuchtung gibt.",           # gefährlich
    "1489": "Der neue Park hat mir auf Anhieb sehr gut gefallen.",                         # gefallen (dup)
    "1490": "Er wurde wegen Diebstahls zu zwei Jahren Gefängnis verurteilt.",             # Gefängnis
    "1491": "Ich hatte das Gefühl, dass etwas nicht stimmte.",                            # Gefühl
    "1492": "Der Mannschaft gelang es, den stärksten Gegner zu besiegen.",               # Gegner
    "1493": "In dieser Gegend gibt es viele alte Gebäude und historische Straßen.",      # Gegend
    "1494": "Im Gegensatz zu seinem Bruder ist er sehr ruhig und zurückhaltend.",       # Gegensatz
    "1495": "Er hat einen schweren Gegenstand vom Regal genommen.",                      # Gegenstand
    "1496": "Ich sage das Gegenteil von dem, was er gesagt hat.",                        # Gegenteil
    "1497": "Sie holt die Post täglich aus dem Briefkasten.",                            # Post
    "1498": "Das ist nicht der richtige Weg zum Bahnhof.",                               # nicht
    "1499": "Er hat ein Stück Kuchen gegessen.",                                         # ein
    "1500": "Sie hat niemandem von ihrem Plan erzählt.",                                 # niemandem
    "1501": "Ich komme nicht mit, ich bin zu müde.",                                     # nicht (dup)
    "1502": "Er hat mir das Geld zurückgegeben, das ich ihm geliehen hatte.",            # gegeben
    "1503": "Das ist unsere neue Wohnung, wir sind erst letzte Woche eingezogen.",       # unsere
    "1504": "Er hat drei Sprachen gelernt und spricht alle fließend.",                   # drei
    "1505": "Sie gehen jeden Abend zusammen spazieren.",                                 # gehen (dup)
    "1506": "Der Angeklagte wurde wegen Betrugs vom Gericht verurteilt.",               # verurteilt
    "1507": "Ich habe noch keine Zeit gehabt, den Bericht zu schreiben.",               # habe
    "1508": "Das Hotel war sehr sauber und das Personal sehr freundlich.",               # sehr (dup)
    "1509": "Er weiß nicht, ob sein Zug pünktlich fährt.",                             # sein
    "1510": "Mit starkem Regen ist heute Abend zu rechnen.",                            # starkem
    "1511": "Die Aufgabe war ziemlich schwierig, aber sie hat sie gelöst.",             # ziemlich
    "1512": "Sie hat ein Glas Wasser getrunken.",                                       # ein (dup)
    "1513": "Ach, ich habe das völlig vergessen!",                                      # ach
    "1514": "Das Buch liegt auf dem Tisch neben dem Laptop.",                           # liegen
    "1515": "Das Risiko ist gering, wenn man sich an die Regeln hält.",                # gering
    "1516": "Sie hilft gerne anderen Menschen und macht das ehrenamtlich.",             # gern/gerne
    "1517": "Die Gesamtkosten des Projekts lagen über dem Budget.",                    # gesamt-
    "1518": "Das kleine Geschäft in unserer Straße verkauft frisches Brot.",           # Geschäft
    "1519": "Sie hat zum Geburtstag ein schönes Geschenk von ihrer Schwester bekommen.", # Geschenk
    "1520": "Nach der Scheidung ist er wieder in seine Heimatstadt gezogen.",          # geschieden
    "1521": "Nach dem Abendessen spülte er das Geschirr.",                             # Geschirr
    "1522": "Das Formular hat ein Pflichtfeld für das Geschlecht.",                    # Geschlecht
    "1523": "Auf dieser Straße gilt ein Geschwindigkeitslimit von dreißig km/h.",     # Geschwindigkeits-
    "1524": "Sie hat zwei Geschwister, einen Bruder und eine Schwester.",              # Geschwister
    "1525": "In einer modernen Gesellschaft müssen alle gleich behandelt werden.",     # Gesellschaft
    "1526": "Das neue Gesetz tritt ab dem ersten Januar in Kraft.",                   # Gesetz
    "1527": "Sie hat ein freundliches Gesicht und lächelt immer.",                    # Gesicht
    "1528": "Sie frühstücken jeden Morgen gemeinsam, das ist ihre Tradition.",       # gemeinsam
    "1529": "Die Gemeinschaft im Dorf hilft sich gegenseitig bei Problemen.",        # Gemeinschaft
    "1530": "Sie isst täglich frisches Gemüse, weil es gesund ist.",                # Gemüse
    "1531": "Das kleine Café hat eine gemütliche Atmosphäre mit weichen Sesseln.",   # gemütlich
    "1532": "Genau das habe ich gemeint, du hast es richtig verstanden.",            # genau
    "1533": "Sie ist genauso groß wie ihre Mutter.",                                 # genauso
    "1534": "Das Bauvorhaben wurde von der Gemeinde genehmigt.",                    # genehmigen
    "1535": "Jede Generation hat ihre eigenen Herausforderungen und Chancen.",      # Generation
    "1536": "Im Urlaub genießen wir den Strand und die warme Sonne.",              # genießen
    "1537": "Haben wir genug Milch, oder soll ich noch welche kaufen?",            # genug
    "1538": "Ein leichtes Frühstück genügt mir morgens.",                          # genügen
    "1539": "Am Flughafen muss er sein Gepäck am Schalter aufgeben.",             # Gepäck
    "1540": "Er ist gerade am Telefonieren, er ruft dich gleich zurück.",         # gerade
    "1541": "Gehen Sie immer geradeaus, dann sehen Sie die Post auf der rechten Seite.", # geradeaus
    "1542": "Das Gerät ist einfach zu bedienen und hat viele nützliche Funktionen.", # Gerät
    "1543": "Er hat sich beim Kochen die Hand verbrannt.",                         # beim
    "1544": "Die Unterschiede zwischen den Modellen sind gering, aber vorhanden.  ", # geringe
    "1545": "Wir haben viel Zeit und sollten sie sinnvoll nutzen.",                # haben
    "1546": "Sie hat einen neuen Job gefunden und fängt nächsten Monat an.",       # einen
    "1547": "Er hat alle seine alten Bücher an die Bibliothek verschenkt.",        # verschenkt
    "1548": "Das Wetter ist heute herrlich, die Sonne scheint.",                   # ist
    "1549": "Wie ist das nur geschehen? Niemand hat etwas bemerkt.",               # geschehen
    "1550": "Sie kommt immer zu spät, das ist ihr größtes Problem.",               # immer
    "1551": "Das Formular fragt, ob die Person weiblich oder männlich ist.",       # weiblich
    "1552": "Im Sportverein gibt es mehr männliche als weibliche Mitglieder.",     # männlich
    "1553": "Er ist wohl krank, weil er heute nicht gekommen ist.",                # wohl
    "1554": "Die Gruppe hat beschlossen, das Projekt gemeinsam zu beenden.",       # beschlossen
    "1555": "Er arbeitet als Mechaniker und repariert Autos.",                     # als
    "1556": "Ich helfe dir gerne beim Umzug am Wochenende.",                       # helfe
    "1557": "Kannst du mit mir zum Supermarkt kommen?",                            # mit
    "1558": "Man sollte immer pünktlich zu Terminen erscheinen.",                  # man
    "1559": "Im Sommer genießen sie den Abend auf der Terrasse.",                  # genießen (dup)
    "1560": "Er hat die Situation gelassen hingenommen und sich keine Sorgen gemacht.", # gelassen
    "1561": "Sie kaufen oft gebrauchte Möbel, weil das viel günstiger ist.",       # gebraucht
    "1562": "Er gießt die Blumen jeden zweiten Tag.",                              # gießen
    "1563": "Der Wein wurde in große Fässer gegossen.",                            # gegossen
    "1564": "Diese Pilze enthalten Gift und dürfen nicht gegessen werden.",        # Gift
    "1565": "Die Schlange ist giftig, man sollte ihr nicht zu nahe kommen.",      # giftig
    "1566": "Er spielt seit seiner Kindheit Gitarre und tritt in einer Band auf.", # Gitarre
    "1567": "Pass auf, das Glas fällt gleich vom Tisch.",                         # Glas
    "1568": "Im Winter ist der Bürgersteig oft glatt und man kann leicht ausrutschen.", # glatt
    "1569": "Ich glaube, dass er morgen kommt, aber ich bin nicht sicher.",       # glauben
    "1570": "Er kommt gleich zurück, warte noch einen Moment.",                   # gleich
    "1571": "Danke für die Einladung! Gleichfalls!",                              # gleichfalls
    "1572": "In diesem Betrieb werden alle Mitarbeiter gleichberechtigt behandelt.", # gleichberechtigt
    "1573": "Er kann gleichzeitig Musik hören und arbeiten.",                      # gleichzeitig
    "1574": "Der Zug fährt von Gleis sieben ab.",                                 # Gleis
    "1575": "Sie hatte großes Glück, dass sie den letzten Bus noch erwischt hat.", # Glück
    "1576": "Er war glücklich, als er die Prüfung bestanden hatte.",               # glücklich
    "1577": "Herzlichen Glückwunsch zur bestandenen Prüfung!",                    # Glückwunsch
    "1578": "Das Armband ist aus echtem Gold und sehr wertvoll.",                  # Gold
    "1579": "Gestern hat es den ganzen Tag geregnet.",                            # gestern
    "1580": "Er ernährt sich gesund und macht regelmäßig Sport.",                 # gesund
    "1581": "Gesundheit ist das Wichtigste im Leben.",                            # Gesundheit
    "1582": "Was möchten Sie als Getränk? Wasser oder Saft?",                    # Getränk
    "1583": "Häusliche Gewalt ist ein ernstes Problem und muss gemeldet werden.", # Gewalt
    "1584": "Die Gewerkschaft kämpft für bessere Löhne und kürzere Arbeitszeiten.", # Gewerkschaft
    "1585": "Sie prüfte das Gewicht des Gepäcks, bevor sie es einpackte.",        # Gewicht
    "1586": "Unser Team hat das Turnier nach einem spannenden Finale gewonnen.",  # gewinnen
    "1587": "Der Gewinn aus dem Verkauf wird für einen guten Zweck gespendet.",   # Gewinn
    "1588": "Er hat ein gutes Gewissen, weil er immer ehrlich ist.",              # Gewissen
    "1589": "Das Gewitter gestern Nacht war sehr laut und hat viele geweckt.",    # Gewitter
    "1590": "Man gewöhnt sich schnell an den neuen Arbeitsweg.",                  # gewöhnen
    "1591": "Es ist eine schlechte Gewohnheit, zu spät zu essen.",               # Gewohnheit
    "1592": "Er ist an lange Arbeitstage gewohnt und klagt nie.",                 # gewohnt
    "1593": "Gewöhnlich stehe ich um sieben Uhr auf.",                           # gewöhnlich
    "1594": "So ein Fehler kann man leicht korrigieren, wenn man aufpasst.",     # man (filler)
    "1595": "Ich muss denken, bevor ich antworte.",                              # denken
    "1596": "Du kannst aus den alten Holzbrettern ein Regal machen.",            # machen
    "1597": "Er brachte einen leckeren Kuchen zur Party mit.",                   # einen
    "1598": "Das Konzert war sehr gut und alle waren begeistert.",               # sehr (dup)
    "1599": "Sie hat neues Geschirr gekauft und freut sich sehr darüber.",       # neues
    "1600": "Ich habe nur noch ein bisschen Zeit, dann muss ich los.",           # nur
    "1601": "Wer nicht aufgibt, gewinnt am Ende.",                              # gewinnt
    "1602": "Sie achtet auf eine gesunde Ernährung und schläft viel.",           # gesund (dup)
    "1603": "Man muss auf die Regeln achten, damit alles reibungslos funktioniert.", # achten
    "1604": "So ein Problem vorkommt in jedem Betrieb früher oder später.",      # vorkommt
    "1605": "Er öffnet das Fenster, weil es zu warm ist.",                       # öffnen
    "1606": "Der Erfolg hängt von der eigenen Motivation ab.",                   # hängt
    "1607": "Mit viel Training kann man auch gegen starke Gegner gewinnen.",     # gewinnen (dup)
    "1608": "Das Wort besteht aus dem Präfix ge- und dem Verb.",                 # ge- (prefix)
    "1609": "Was macht er gerade? Er macht gerade seine Hausaufgaben.",          # macht
    "1610": "Er ist an das frühe Aufstehen gewöhnt.",                           # gewöhnt (dup)
    "1611": "Es fällt ihr schwer, morgens früh aufzustehen.",                   # aufzustehen
    "1612": "Ich muss zur Post gehen, um das Paket abzuschicken.",              # Post (dup)
    "1613": "Sie geht jeden Tag zur Arbeit, auch wenn sie müde ist.",           # jeden
    "1614": "Er geht nach der Arbeit immer spazieren.",                         # gehen (dup)
    "1615": "Sie haben ein Grundstück am See gekauft und wollen dort bauen.",   # Grundstück
    "1616": "Die Gruppe besteht aus zehn Studenten aus verschiedenen Ländern.", # Gruppe
    "1617": "Man grüßt sich in Deutschland oft mit einem Handschlag.",          # grüßen
    "1618": "Er schickte seiner Oma einen herzlichen Gruß aus dem Urlaub.",     # Gruß
    "1619": "Die Kinder gucken nach dem Abendessen häufig fern.",               # gucken
    "1620": "Das Ticket ist nur heute gültig und kann nicht verlängert werden.", # gültig
    "1621": "Im Supermarkt ist vieles günstiger als im kleinen Laden.",         # günstig
    "1622": "Jeden Morgen macht sie Gymnastik, um fit zu bleiben.",             # Gymnastik
    "1623": "Sie bürstet ihr Haar jeden Abend, bevor sie schlafen geht.",      # Haar
    "1624": "Haben Sie morgen Nachmittag Zeit für ein kurzes Gespräch?",       # haben
    "1625": "Die Präsentation enthält eine Grafik mit den Verkaufszahlen.",    # Grafik
    "1626": "Ich möchte dir herzlich zum Abitur gratulieren.",                 # gratulieren
    "1627": "Die Gratulation seiner Kollegen hat ihn sehr gefreut.",           # Gratulation
    "1628": "Der Eintritt in die Ausstellung ist gratis.",                     # gratis
    "1629": "Er griff nach seiner Tasche, als er das Café verließ.",          # greifen
    "1630": "An der Grenze müssen alle Reisenden ihren Ausweis zeigen.",      # Grenze
    "1631": "Im Sommer grillen wir oft im Garten mit Freunden.",              # grillen
    "1632": "Er hat einen neuen Grill gekauft und lädt alle zum Grillfest ein.", # Grill
    "1633": "Sie hat die Grippe und liegt seit drei Tagen im Bett.",          # Grippe
    "1634": "Er ist sehr groß und trägt Kleidung in Größe XL.",              # groß (dup)
    "1635": "Welche Größe haben Sie? Ich brauche ein Hemd in Größe M.",      # Größe
    "1636": "Sie gründete ihr eigenes Unternehmen nach dem Studium.",         # gründen
    "1637": "Was ist der Grund dafür, dass du zu spät gekommen bist?",       # Grund
    "1638": "Man muss den Teppich regelmäßig reinigen.",                     # reinigen
    "1639": "Ich hätte gerne ein Zimmer mit einem Einzelbett.",              # ein (filler)
    "1640": "Hast du schon deine Hausaufgaben gemacht?",                     # hast
    "1641": "Ich bin müde, doch ich muss noch den Bericht fertig schreiben.", # doch
    "1642": "Ihr Personalausweis ist nicht mehr gültig und muss erneuert werden.", # gültig (dup)
    "1643": "Die Wohnung ist klein, aber sehr hell und praktisch.",          # wohnung
    "1644": "Das war ein wirklich gutes Essen, ich bin sehr zufrieden.",     # gut
    "1645": "Überall in der Stadt sieht man Plakate für die neue Ausstellung.", # überall
    "1646": "Wir fahren morgen früh los, damit wir rechtzeitig ankommen.",   # fahren
    "1647": "Er hat das Rennen gewonnen und ist sehr stolz darauf.",         # gewonnen
    "1648": "Wir treffen uns um vier Uhr vor dem Kino.",                    # wir
    "1649": "Sie wollen im Sommer nach Spanien reisen.",                    # wollen
    "1650": "Er macht das nicht, weil er keine Zeit hat.",                  # nicht (dup)
    "1651": "Nach der Pause fängt der Kurs wieder an.",                     # wieder
    "1652": "Die Firma wurde vor über hundert Jahren gegründet.",           # gegründet
    "1653": "In welchem Land wohnst du gerade?",                           # welchem
    "1654": "Sie beschwerte sich bei der Rezeption über den Lärm.",        # beschweren
    "1655": "Ich warte jeden Morgen an der Haltestelle auf den Bus.",      # Haltestelle
    "1656": "Er nahm den Hammer und schlug den Nagel in die Wand.",        # Hammer
    "1657": "Sie hat ihre Hand beim Kochen verbrannt.",                    # Hand
    "1658": "Der Handwerker hat die Küche in zwei Tagen fertig installiert.", # Handwerker
    "1659": "Die Handwerkerin reparierte das Dach schnell und zuverlässig.", # Handwerkerin
    "1660": "Er handelt stets ehrlich und denkt immer zuerst an andere.",  # handeln
    "1661": "Der internationale Handel ist ein wichtiger Teil der deutschen Wirtschaft.", # Handel
    "1662": "Der Händler bietet verschiedene Modelle zu günstigen Preisen an.", # Händler
    "1663": "Die Händlerin präsentierte ihre neueste Kollektion auf der Messe.", # Händlerin
    "1664": "Ich habe mein Handy zu Hause vergessen und kann nicht erreichbar sein.", # Handy
    "1665": "Das Bild hängt an der Wand über dem Sofa.",                   # hängen
    "1666": "Das Brot ist sehr hart, weil es schon zwei Tage alt ist.",   # hart
    "1667": "Er hasst es, früh aufzustehen, aber sein Job fordert es.",   # hassen
    "1668": "Das alte Gebäude sieht hässlich aus und soll abgerissen werden.", # hässlich
    "1669": "Häufige Pausen beim Lernen verbessern das Behalten des Stoffs.", # häufig
    "1670": "Berlin ist die Hauptstadt Deutschlands und ein wichtiges Kulturzentrum.", # Hauptstadt
    "1671": "Das Schiff liegt im Hafen und wird gerade beladen.",          # Hafen
    "1672": "Es hagelt stark, deshalb bleiben alle drinnen.",              # hageln
    "1673": "Er isst gerne Hähnchen mit Pommes frites und Salat.",        # Hähnchen/Hühnchen
    "1674": "Kannst du mir halb sechs abholen? Ich bin dann fertig.",     # halb
    "1675": "Das Hotel bietet Halbpension an, Frühstück und Abendessen sind inklusive.", # Halbpension
    "1676": "Sie arbeitet halbtags als Lehrerin und kümmert sich nachmittags um die Kinder.", # halbtags
    "1677": "Er hat die Hälfte seines Gehalts für die Reise gespart.",    # Hälfte
    "1678": "Die Sporthalle wird für Konzerte und Basketballspiele genutzt.", # Halle
    "1679": "Im Winter gehen wir ins Hallenbad, weil der See zu kalt ist.", # Hallenbad
    "1680": "Hallo! Wie kann ich Ihnen helfen?",                          # hallo
    "1681": "Er hat Halsschmerzen und kann kaum schlucken.",              # Hals
    "1682": "Dieses Produkt ist sehr haltbar und kann bis zu zwei Jahre gelagert werden.", # haltbar
    "1683": "Der Bus hält direkt vor unserer Schule.",                    # halten
    "1684": "Wir machen das zusammen, das wird besser klappen.",          # wir
    "1685": "Er kaufte einen Tisch für sein neues Arbeitszimmer.",        # einen
    "1686": "Ich muss jetzt gehen, sonst verpasse ich meinen Zug.",       # jetzt
    "1687": "Das Geschäft handelt mit antiken Möbeln und alten Büchern.", # handelt
    "1688": "Er arbeitet viel und ist dabei immer ruhig und freundlich.", # und
    "1689": "Sie wünscht dir gutes Gelingen bei deiner Prüfung.",        # gutes
    "1690": "Ich erkläre dir in Ruhe, wie das funktioniert.",             # dir
    "1691": "Kannst du mir bitte die Flasche Wasser geben?",              # geben (dup)
    "1692": "Er muss jeden Tag um sechs Uhr aufstehen.",                  # muss
    "1693": "Sie wollte unbedingt an dem Projekt teilnehmen.",            # unbedingt
    "1694": "Nach einer halben Stunde war das Meeting beendet.",          # halben
    "1695": "Das ist leider nicht möglich, tut mir leid.",               # nicht (dup)
    "1696": "Er bekommt jeden Monat sein Gehalt auf das Konto überwiesen.", # bekommt
    "1697": "Die schönste Zeit ist leider schon vorbei.",                 # vorbei
    "1698": "Nur wer fleißig lernt, kann die Prüfung bestehen.",         # nur (dup)
    "1699": "Sie erklärte dir Schritt für Schritt, wie man das Rezept zubereitet.", # dir
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

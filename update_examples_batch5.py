import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 5: next 250 empty rows (IDs 1201–1450)
updates = {
    "1201": "Er kaufte einen neuen Laptop, weil der alte kaputt war.",                      # einen – one/a
    "1202": "Der neue Film hat mir sehr gut gefallen.",                                     # gefallen – liked
    "1203": "Der Preis für das Ticket wurde um zehn Prozent erhöht.",                      # erhöht – increased
    "1204": "Nach dem Urlaub am Meer fühlt sie sich erholt und voller Energie.",           # erholt – recovered
    "1205": "Er ist noch jung und läuft sehr schnell.",                                    # schnell – fast
    "1206": "Ich brauche dringend etwas zu essen, ich habe seit heute früh nichts gegessen.", # brauche – need
    "1207": "Hast du den Brief schon in den Briefkasten eingeworfen?",                     # den – the (acc.)
    "1208": "Sie ist erkältet und bleibt heute zu Hause.",                                 # erkältet – having a cold
    "1209": "Er hat den Mann sofort an seinem markanten Hut erkannt.",                     # erkennen – to recognize
    "1210": "Hast du diesen Film schon gesehen?",                                          # diesen – this
    "1211": "Hast du die Hausaufgaben schon gemacht?",                                     # gemacht – done
    "1212": "Er ist viel größer als sein jüngerer Bruder.",                               # als – as/when
    "1213": "Er hat sich bei der Rezeption nach den Öffnungszeiten erkundigt.",           # erkundigt – inquired
    "1214": "Ich habe lange auf den Zug gewartet, aber er kam nicht.",                    # lange – for a long time
    "1215": "Ich komme eventuell morgen Abend zu deiner Party.",                          # eventuell – possibly/perhaps
    "1216": "Ich werde dir ewig dankbar sein für deine Hilfe.",                           # ewig – eternal/forever
    "1217": "Der Experte erklärte die Situation sehr klar und verständlich.",             # Experte – expert (male)
    "1218": "Sie hat extra früh aufgehört zu arbeiten, um die Feier vorzubereiten.",      # extra – extra/additionally
    "1219": "Das Wetter war extrem heiß, über vierzig Grad im Schatten.",                 # extrem – extreme/extremely
    "1220": "In dieser Fabrik werden täglich tausende Autos hergestellt.",                # Fabrik – factory
    "1221": "Deutsch ist mein Lieblingsfach in der Schule.",                              # Fach – subject/compartment
    "1222": "Der Fachmann hat den defekten Heizkessel repariert.",                        # Fachmann – specialist (male)
    "1223": "Die Fachfrau hat das Problem sofort erkannt und gelöst.",                    # Fachfrau – specialist (female)
    "1224": "Für dieses Projekt brauchen wir erfahrene Fachleute aus verschiedenen Bereichen.", # Fachleute – specialists
    "1225": "Sie hat die Fähigkeit, auch in stressigen Situationen ruhig zu bleiben.",   # Fähigkeit – ability/skill
    "1226": "Wir fahren jeden Sommer mit dem Auto in den Urlaub nach Italien.",          # fahren – to drive/travel
    "1227": "Er ist noch nie Motorrad gefahren.",                                         # gefahren – driven
    "1228": "Wir nehmen die Fähre über den See, weil es keine Brücke gibt.",             # Fähre – ferry
    "1229": "Er musste einen ausführlichen Bericht für seinen Chef erstellen.",           # erstellen – to create/compile
    "1230": "Die Kinder sind schnell erwachsen geworden.",                                # erwachsen – to grow up
    "1231": "Der Eintritt ist für Erwachsene zehn Euro und für Kinder fünf Euro.",       # Erwachsene – adult
    "1232": "Ich erwarte dich um sieben Uhr vor dem Kino.",                              # erwarten – to expect
    "1233": "Sie erzählte uns eine spannende Geschichte aus ihrer Kindheit.",            # erzählen – to tell/narrate
    "1234": "Seine Erzählung über die Reise war so lebendig, dass alle gespannt zuhörten.", # Erzählung – story/narrative
    "1235": "Eltern erziehen ihre Kinder zur Selbstständigkeit und Höflichkeit.",        # erziehen – to raise/educate
    "1236": "Eine gute Erziehung legt den Grundstein für das spätere Leben.",            # Erziehung – upbringing/education
    "1237": "Das Buch liegt auf dem Tisch, aber es gehört mir nicht.",                  # es – it
    "1238": "Er isst jeden Abend um sechs Uhr mit seiner Familie.",                     # essen – to eat
    "1239": "Das Essen in diesem Restaurant ist frisch und sehr lecker.",               # Essen – food/meal
    "1240": "Sie verwendet Essig und Öl als Salatdressing.",                            # Essig – vinegar
    "1241": "Das Büro befindet sich auf der dritten Etage.",                            # Etage – floor/storey
    "1242": "Ich habe den ganzen Tag gearbeitet und bin jetzt sehr müde.",              # ich – I
    "1243": "Hast du etwas Zeit für mich? Ich muss dir etwas Wichtiges sagen.",        # etwas – something/a little
    "1244": "Ich habe heute noch keine Zeit gehabt, die E-Mails zu lesen.",            # habe – have
    "1245": "Die Post ist links, gleich nach der Ampel.",                               # links – on the left
    "1246": "Er arbeitet am besten am frühen Morgen.",                                  # am – at the
    "1247": "Nach der Pause beginnt der Unterricht wieder.",                            # wieder – again
    "1248": "Sie ist immer pünktlich, egal wie früh der Termin ist.",                  # immer – always
    "1249": "Du musst die Aufgaben bis Freitag abgeben.",                              # musst – must
    "1250": "Die Veranstaltung fängt um drei Uhr nachmittags an.",                     # um – around/at
    "1251": "Mein Fahrrad ist kaputt, ich muss es zur Werkstatt bringen.",             # kaputt – broken
    "1252": "Der Kaffee ist zu heiß, warte noch ein paar Minuten.",                   # zu – too/to
    "1253": "Meine Lieblingsfarbe ist Blau, weil sie mich an den Himmel erinnert.",   # Farbe – color
    "1254": "Sie trägt gern farbige Kleidung, am liebsten in Rot und Orange.",        # farbig – colorful/colored
    "1255": "Aus Hackfleisch kann man Burger, Frikadellen oder Bolognese machen.",    # Hackfleisch – minced meat
    "1256": "Er ist fast immer pünktlich, nur selten kommt er ein paar Minuten zu spät.", # fast – almost
    "1257": "Er ist sehr faul und macht nie Sport.",                                   # faul – lazy
    "1258": "Am Wochenende darf ich am liebsten einfach zuhause faulenzen.",          # faulenzen – to laze around
    "1259": "Jeder macht mal Fehler, wichtig ist, daraus zu lernen.",                 # Fehler – mistake/error
    "1260": "Sie feiern heute den Geburtstag ihrer Tochter mit der ganzen Familie.", # feiern – to celebrate
    "1261": "Die Feier war sehr schön, alle Gäste hatten viel Spaß.",               # Feier – celebration/party
    "1262": "Nach dem Feierabend geht er oft mit Kollegen auf ein Bier.",            # Feierabend – end of work
    "1263": "An diesem Feiertag sind alle Geschäfte geschlossen.",                   # Feiertag – public holiday
    "1264": "Die Kühe grasen auf dem Feld hinter dem Bauernhof.",                   # Feld – field
    "1265": "Bitte mach das Fenster zu, es zieht.",                                 # Fenster – window
    "1266": "Der Fahrer hält an der roten Ampel und wartet.",                       # Fahrer – driver (male)
    "1267": "Er kauft seine Fahrkarte immer am Automaten im Bahnhof.",              # Fahrkarte – ticket (transport)
    "1268": "Im Fahrplan steht, dass der nächste Zug um achtzehn Uhr fährt.",      # Fahrplan – timetable/schedule
    "1269": "Sie fährt jeden Tag mit dem Fahrrad zur Arbeit.",                      # Fahrrad – bicycle
    "1270": "Dieses Fahrzeug verbraucht wenig Kraftstoff und ist sehr sparsam.",    # Fahrzeug – vehicle
    "1271": "Das Spiel war fair, beide Mannschaften haben sich gut verhalten.",     # fair – fair
    "1272": "Der wichtigste Faktor beim Abnehmen ist eine ausgewogene Ernährung.", # Faktor – factor
    "1273": "Im Herbst fallen die Blätter von den Bäumen.",                        # fallen – to fall
    "1274": "Die Miete ist am ersten des Monats fällig.",                          # fällig – due/payable
    "1275": "Falls du Hilfe brauchst, ruf mich bitte an.",                        # falls – in case/if
    "1276": "Die Antwort war falsch, deshalb musste er die Aufgabe wiederholen.", # falsch – wrong/incorrect
    "1277": "Er kommt aus einer großen Familie mit fünf Geschwistern.",           # Familie – family
    "1278": "Beim Ausfüllen des Formulars gibt man auch seinen Familienstand an.", # Familienstand – marital status
    "1279": "Die Katze fängt gerne Mäuse im Garten.",                            # fangen – to catch
    "1280": "Kinder haben eine lebhafte Fantasie und erfinden tolle Geschichten.", # Fantasie – fantasy/imagination
    "1281": "Sie ist sehr fleißig und macht immer ihre Hausaufgaben pünktlich.",  # fleißig – hardworking (duplicate)
    "1282": "Am Sonntag möchte ich den ganzen Tag zuhause faulenzen.",           # faulenzen – to laze around (duplicate)
    "1283": "Mir fehlt noch ein Dokument für den Antrag.",                       # fehlt – missing/absent
    "1284": "Hast du das Formular schon gemacht und abgeschickt?",               # gemacht – done
    "1285": "Die Archäologen funden während der Grabung alte Scherben.",         # funden – found (regional past pl.)
    "1286": "Wir haben gestern meinen Abschluss groß gefeiert.",                 # gefeiert – celebrated
    "1287": "Kannst du bitte das Fenster aufmachen, es ist sehr warm hier.",     # aufmachen – to open
    "1288": "Er wurde beim Sport verletzt und trägt jetzt einen Verband.",       # verletzt – injured
    "1289": "Das war ein faires Spiel, keine Fouls und keine Beschwerden.",      # fair – fair (duplicate)
    "1290": "Bei starker Sonne ist ein hoher Schutzfaktor wichtig.",            # schutzfaktor – protection factor
    "1291": "Er hat das Buch einmal gelesen und es danach verschenkt.",          # einmal – once
    "1292": "Das bunte Blumenmuster hat mir sofort gefallen.",                   # gefallen – liked (duplicate)
    "1293": "Null Fehler zu machen ist in dieser Prüfung das Ziel.",            # zero
    "1294": "Die Rechnung ist seit zwei Wochen fällig, bezahl sie bitte.",      # fällig – due (duplicate)
    "1295": "Bitte kreuzen Sie die richtige Antwort an.",                       # ankreuzen – to tick
    "1296": "Nach dem Regen war die Luft feucht und warm.",                     # feucht – damp/humid
    "1297": "Das Feuer im Kamin macht den Raum gemütlich und warm.",           # Feuer – fire
    "1298": "Er hat sein Feuerzeug vergessen und kann sich keine Kerze anzünden.", # Feuerzeug – lighter
    "1299": "Die Feuerwehr hat den Brand in der Nacht schnell gelöscht.",       # Feuerwehr – fire brigade
    "1300": "Sie hat hohes Fieber und liegt seit gestern im Bett.",            # Fieber – fever
    "1301": "Wir haben gestern Abend einen spannenden Film im Kino gesehen.",  # Film – film/movie
    "1302": "Er hat seinen Studienabschluss durch ein Stipendium finanziert.", # finanzieren – to finance
    "1303": "Die finanzielle Lage der Familie hat sich nach dem Jobverlust verschlechtert.", # finanziell – financial
    "1304": "Ich finde meine Schlüssel nie, wenn ich sie brauche.",           # finden – to find
    "1305": "Er hat sich beim Kochen am Finger geschnitten.",                  # Finger – finger
    "1306": "Die Firma hat dieses Jahr zwanzig neue Mitarbeiter eingestellt.", # Firma – company/firm
    "1307": "Die Fläche des Zimmers beträgt zwanzig Quadratmeter.",           # Fläche – area/surface
    "1308": "Bitte keine Plastikflaschen in den Glascontainer werfen.",        # Flasche – bottle
    "1309": "Der Fleck auf dem Hemd lässt sich mit Wasser nicht entfernen.",  # Fleck – stain/spot
    "1310": "Sie isst kein Fleisch und ernährt sich vegetarisch.",            # Fleisch – meat
    "1311": "Die Metzgerin berät die Kunden täglich über frische Fleischwaren.", # Metzgerin – butcher (female)
    "1312": "Ein fleißiger Schüler wiederholt den Lernstoff regelmäßig.",     # fleißig – hardworking
    "1313": "Wo ist die Fernbedienung? Ich möchte den Kanal wechseln.",       # Fernbedienung – remote control
    "1314": "Die Kinder sehen abends gerne fern.",                            # fernsehen – to watch TV
    "1315": "Im Fernsehen gab es heute eine interessante Dokumentation.",     # Fernsehen – television
    "1316": "Unser alter Fernseher ist kaputt, wir brauchen einen neuen.",    # Fernseher – TV set
    "1317": "Bist du fertig? Wir sollten gleich losfahren.",                  # fertig – finished/ready
    "1318": "Das Regal ist fest an der Wand befestigt.",                      # fest – firm/fixed/solid
    "1319": "Das Stadtfest findet jedes Jahr im Sommer auf dem Marktplatz statt.", # Fest – festival/celebration
    "1320": "Er hat alle seine Fotos auf einer externen Festplatte gespeichert.", # Festplatte – hard drive
    "1321": "Halt dich fest, die Kurve kommt gleich.",                        # festhalten – to hold on
    "1322": "Der Termin für das Meeting wurde auf Freitag festgelegt.",       # festlegen – to set/determine
    "1323": "Der Verdächtige wurde von der Polizei festgenommen.",            # festnehmen – to arrest
    "1324": "Die Teilnehmerzahl für den Kurs wurde auf zwanzig Personen festgesetzt.", # festsetzen – to set/determine
    "1325": "Es steht fest, dass die Veranstaltung nächste Woche stattfindet.", # feststehen – to be certain
    "1326": "Der Arzt stellte fest, dass der Patient Fieber hatte.",          # feststellen – to determine/notice
    "1327": "Das Essen war sehr fett, ich fühle mich jetzt unwohl.",         # fett – fat/greasy
    "1328": "Von hier oben sieht man, wie groß die Stadt wirklich ist.",     # groß – big
    "1329": "Er hat heute endlich eine Antwort auf seine Bewerbung bekommen.", # bekommen – to get
    "1330": "Sieh dir dieses alte Foto an, das bin ich als Kind.",           # ansehen – to look at
    "1331": "Das Projekt wurde durch öffentliche Mittel finanziert.",        # finanzieren – to finance (duplicate)
    "1332": "Dieses Modell ist besser als das alte.",                        # besser – better
    "1333": "Hast du mein Portemonnaie irgendwo gefunden?",                  # gefunden – found
    "1334": "Er hat das geliehene Buch nach zwei Wochen zurückgegeben.",    # zurückgeben – to give back
    "1335": "Er trainiert immer hart und gibt nie auf.",                    # immer – always (duplicate)
    "1336": "Ich gehe jetzt einkaufen, soll ich etwas mitbringen?",        # gehe – go
    "1337": "Das war total anders, als ich es erwartet hatte.",            # total – total/completely
    "1338": "Er hat ein neues Handy bekommen und ist sehr glücklich.",      # neue – new
    "1339": "Ich bin noch nicht fertig mit dem Bericht.",                  # noch – still
    "1340": "Sie wohnen in einem großes Haus am Stadtrand.",               # großes – big
    "1341": "Das Datum für die Prüfung wurde schon festgelegt.",           # festgelegt – set/determined
    "1342": "Der Täter wurde noch am selben Abend festgenommen.",          # festgenommen – arrested
    "1343": "Das ist das Ergebnis des letzten Tests.",                     # des – of the
    "1344": "Ich bin müde, aber ich mache trotzdem weiter.",               # aber – but
    "1345": "Die Forschung an neuen Krebsmedikamenten macht große Fortschritte.", # Forschung – research
    "1346": "Sie macht gute Fortschritte beim Deutschlernen.",            # Fortschritt – progress
    "1347": "Die Fortsetzung des Films war leider nicht so spannend wie der erste Teil.", # Fortsetzung – continuation
    "1348": "Im Forum hat er viele nützliche Tipps für seine Reise gefunden.", # Forum – forum
    "1349": "Sie fotografiert gerne Landschaften und Tiere.",             # fotografieren – to photograph
    "1350": "Kannst du mir bitte das Foto schicken, das du gestern gemacht hast?", # Foto – photo
    "1351": "Er hat seinen alten Fotoapparat reparieren lassen.",         # Fotoapparat – camera
    "1352": "Der Fotograf hat die Hochzeit professionell dokumentiert.",  # Fotograf – photographer (male)
    "1353": "Sie hat Fotografie studiert und arbeitet jetzt für eine Zeitung.", # Fotografie – photography
    "1354": "Er fragte den Kellner, ob der Tisch noch frei sei.",        # fragen – to ask
    "1355": "Ich habe noch eine Frage wegen des Termins.",               # Frage – question
    "1356": "Die Frau an der Kasse war sehr freundlich.",                # Frau – woman/Mrs.
    "1357": "Der Junge war frech zu seiner Lehrerin und musste sich entschuldigen.", # frech – cheeky
    "1358": "Ist dieser Platz noch frei?",                               # frei – free/vacant
    "1359": "Sie arbeitet im größten Bürogebäude der Stadt.",            # im – in the
    "1360": "Redefreiheit ist eine wichtige Grundlage der Demokratie.",  # Freiheit – freedom/liberty
    "1361": "In meiner Freizeit lese ich gerne Kriminalromane.",         # Freizeit – free time/leisure
    "1362": "Sie ist sehr flexibel und kann jederzeit einspringen.",     # flexibel – flexible
    "1363": "Wir fliegen nächste Woche nach Mallorca in den Urlaub.",    # fliegen – to fly
    "1364": "Das Kind floh aus dem Zimmer, als der Hund bellte.",       # fliehen – to flee/escape
    "1365": "Die Flucht aus dem Gebäude gelang ihnen durch den Hinterausgang.", # Flucht – flight/escape
    "1366": "Der Fluss fließt ruhig durch die Wiesen und Felder.",      # fließen – to flow
    "1367": "Sie spricht fließend Spanisch, weil sie zwei Jahre in Madrid gelebt hat.", # fließend – fluent
    "1368": "Auf dem Flohmarkt haben wir alte Bücher und Kleider günstig gefunden.", # Flohmarkt – flea market
    "1369": "Sie spielt seit acht Jahren Flöte in einem Orchester.",    # Flöte – flute
    "1370": "Der Flughafen ist sehr groß und hat drei Terminals.",      # Flughafen – airport
    "1371": "Das Flugzeug startete trotz des Nebels pünktlich.",        # Flugzeug – airplane
    "1372": "Deine Jacke hängt im Flur an der Garderobe.",             # Flur – hallway/corridor
    "1373": "Der Hund folgt seinem Besitzer überall hin.",             # folgen – to follow
    "1374": "Das Trinken während des Fahrens kann schlimme Folgen haben.", # Folge – consequence
    "1375": "Die folgende Übung ist etwas schwieriger als die vorherige.", # folgend – following/next
    "1376": "Die Gewerkschaft forderte bessere Arbeitsbedingungen.",    # fordern – to demand
    "1377": "Die Forderung nach mehr Lohn wurde vom Chef abgelehnt.",  # Forderung – demand/requirement
    "1378": "Die Regierung fördert die Nutzung erneuerbarer Energien.", # fördern – to promote/support
    "1379": "Dank der staatlichen Förderung konnte das Theater renoviert werden.", # Förderung – funding/support
    "1380": "Das Formular hat eine ungewöhnliche Form, fast wie ein Dreieck.", # Form – form/shape
    "1381": "Wir sehen uns nächsten Montag.",                          # nächsten – next
    "1382": "Ich möchte ein Ticket für den Zug kaufen.",               # kaufen – to buy
    "1383": "Sie hat alles sorgfältig gemacht und nichts vergessen.",  # gemacht – done
    "1384": "Ich habe die Aufgabe verstanden und kann sie erklären.",  # verstanden – understood
    "1385": "Du kannst zwischen Tee und Kaffee wählen.",               # wählen – to choose
    "1386": "Wir möchten in einem kleinen Hotel in der Altstadt übernachten.", # übernachten – to stay overnight
    "1387": "Die Stadt wächst jedes Jahr, weil viele Menschen aus dem Land zuziehen.", # Stadt – city
    "1388": "Er muss die Tabletten dreimal täglich einnehmen.",        # einnehmen – to take medicine
    "1389": "Der Ausflug war ein voller Erfolg für alle Beteiligten.", # word was "-ten" fragment, use as ordinal context
    "1390": "Er kann sehr schnell tippen und macht dabei kaum Fehler.", # kann – can
    "1391": "Morgen frühstücke ich in Ruhe, ich habe keinen frühen Termin.", # frühstücken – to have breakfast
    "1392": "Zum Frühstück gibt es Brötchen, Käse und frischen Orangensaft.", # Frühstück – breakfast
    "1393": "Ich fühle mich heute nicht gut und möchte lieber zu Hause bleiben.", # fühlen – to feel
    "1394": "Der Manager führt das Team seit drei Jahren sehr erfolgreich.", # führen – to lead/guide
    "1395": "Um in Deutschland Auto zu fahren, braucht man einen Führerschein.", # Führerschein – driving license
    "1396": "Wir haben eine Führung durch das Schloss gemacht und viel gelernt.", # Führung – guided tour/leadership
    "1397": "Ich habe meine Tasche im Bus vergessen und gehe jetzt zum Fundbüro.", # Fundbüro – lost and found
    "1398": "Die neue Waschmaschine funktioniert einwandfrei.",         # funktionieren – to work/function
    "1399": "Er kauft jeden Tag Brötchen für die ganze Familie.",      # für – for
    "1400": "Sie hat freiwillig beim Aufräumen nach dem Fest geholfen.", # freiwillig – voluntary
    "1401": "Die Kinder bereiteten ihrer Mutter eine große Freude.",   # Freude – joy/pleasure
    "1402": "Er ist mein bester Freund, wir kennen uns seit der Grundschule.", # Freund – friend/boyfriend
    "1403": "Die Mitarbeiterin war sehr freundlich und hat uns gut geholfen.", # freundlich – friendly
    "1404": "Unsere Freundschaft begann in der Schule und hält bis heute.", # Freundschaft – friendship
    "1405": "Sie hofft auf Frieden in der Welt und engagiert sich für dieses Ziel.", # Friede – peace
    "1406": "Mir friert es, kannst du bitte das Fenster schließen?",  # frieren – to freeze/be cold
    "1407": "Auf dem Markt kann man frisches Gemüse direkt vom Bauern kaufen.", # frisch – fresh
    "1408": "Der Friseur hat ihr die Haare sehr schön geschnitten.",  # Friseur – hairdresser (male)
    "1409": "Die Friseurin empfahl ihr eine neue Haarfarbe.",        # Friseurin – hairdresser (female)
    "1410": "Ihre neue Frisur steht ihr sehr gut.",                  # Frisur – hairstyle
    "1411": "Die Frist für die Abgabe der Bewerbung endet am Freitag.", # Frist – deadline/period
    "1412": "Sie ist sehr froh, dass die Prüfung gut gelaufen ist.", # froh – happy/glad
    "1413": "Die Kinder sangen fröhliche Lieder auf dem Schulausflug.", # fröhlich – cheerful/merry
    "1414": "Diese tropische Frucht schmeckt süß und ist sehr saftig.", # Frucht – fruit
    "1415": "Sie steht früh auf, um vor der Arbeit noch joggen zu gehen.", # früh – early
    "1416": "Wann bist du heute Morgen aufgestanden? Ich bin um sechs gekommen.", # gekommen – come
    "1417": "Er hat mich nach dem Weg gefragt.",                     # mich – me
    "1418": "Das Café ist um diese Uhrzeit meistens voll.",          # ist – is
    "1419": "Das Museum ist am Montag geschlossen.",                 # Museum – museum
    "1420": "Ich lerne seit einem Jahr Klavier und mache gute Fortschritte.", # seit – since/for
    "1421": "An dem Automaten kann man Fahrkarten und Snacks kaufen.", # Automat – vending machine
    "1422": "Das Konzert war sehr schön, alle haben es genossen.",   # sehr – very
    "1423": "Ich kann leider nicht kommen, ich habe schon einen anderen Termin.", # kann – can
    "1424": "Er hat das Fahrrad für drei Monate gemietet.",          # gemietet – rented
    "1425": "Zum Glück hat alles gut geklappt und das Fest war ein voller Erfolg.", # geklappt – worked out
    "1426": "Ich habe mich sehr gefreut, als ich das Paket bekommen habe.", # gefreut – pleased
    "1427": "Der größte Teil des Weges liegt hinter uns.",           # -sten (superlative suffix, as in größ-sten)
    "1428": "Er hat schon zwei Wochen lang nicht mehr angerufen.",   # hat – has
    "1429": "Nach dem Sturm wurde ein starker Ast vom Baum gerissen.", # starker – stronger/strong
    "1430": "In der Küche riecht es nach Gas, ich öffne sofort das Fenster.", # Gas – gas
    "1431": "Das alte Gasthaus am Dorfplatz serviert traditionelle Gerichte.", # Gasthaus – inn/pub
    "1432": "Die Gaststätte in der Altstadt ist immer gut besucht.", # Gaststätte – restaurant/pub
    "1433": "Das Gebäude wurde im Jahr 1900 gebaut und steht noch heute.", # Gebäude – building
    "1434": "Kannst du mir bitte das Salz geben?",                   # geben – to give
    "1435": "Das frische Gebäck beim Bäcker riecht immer wunderbar.", # Gebäck – pastry/baked goods
    "1436": "Im Gebiet rund um den See gibt es viele seltene Vogelarten.", # Gebiet – area/region
    "1437": "Im Sommer wandern wir gerne im Gebirge.",               # Gebirge – mountains
    "1438": "Sie wurde in München geboren und ist dort aufgewachsen.", # geboren – born
    "1439": "Wann bist du geboren? Ich bin im März 1990 geboren.",   # geboren – born (duplicate)
    "1440": "Er gebraucht das Wörterbuch oft beim Schreiben von Texten.", # gebrauchen – to use
    "1441": "Bitte lies die Gebrauchsanweisung, bevor du das Gerät einschaltest.", # Gebrauchsanweisung – manual
    "1442": "Die Gebühr für die Verlängerung des Reisepasses beträgt sechzig Euro.", # Gebühr – fee/charge
    "1443": "Die Geburt des Kindes hat die ganze Familie sehr glücklich gemacht.", # Geburt – birth
    "1444": "Herzlichen Glückwunsch zum Geburtstag!",                # Geburtstag – birthday
    "1445": "Er hat in der Schule ein Gedicht auswendig gelernt und vorgetragen.", # Gedicht – poem
    "1446": "Viele Menschen fürchten sich vor Spinnen.",             # fürchten – to fear/be afraid of
    "1447": "Er hat sich beim Volleyball den Fuß verstaucht.",       # Fuß – foot
    "1448": "Fußball ist in Deutschland die beliebteste Sportart.",  # Fußball – football/soccer
    "1449": "Der Fußgänger überquerte die Straße bei Grün.",        # Fußgänger – pedestrian (male)
    "1450": "Die Fußgängerin fragte nach dem Weg zur nächsten U-Bahn-Station.", # Fußgängerin – pedestrian (female)
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

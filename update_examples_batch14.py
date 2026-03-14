import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 14: IDs 3451–3700
updates = {
    "3451": "Die Summe aller Ausgaben beträgt dreihundert Euro.",                           # Summe
    "3452": "Das neue Restaurant ist super, ich empfehle es weiter.",                       # super
    "3453": "Er geht jeden Samstag in den Supermarkt.",                                     # Supermarkt
    "3454": "Sie kocht eine heiße Suppe für den kranken Vater.",                           # Suppe
    "3455": "Die Erdbeeren sind sehr süß.",                                                 # süß
    "3456": "Das rote Kreuz ist ein bekanntes Symbol.",                                     # Symbol
    "3457": "Der neue Kollege ist sympathisch und hilfsbereit.",                            # sympathisch
    "3458": "Das System muss regelmäßig aktualisiert werden.",                             # System
    "3459": "Die Szene im zweiten Akt war sehr bewegend.",                                  # Szene
    "3460": "Er schaut in die Tabelle, um die Noten zu vergleichen.",                      # Tabelle
    "3461": "Der Lehrer schreibt das Wort an die Tafel.",                                  # Tafel
    "3462": "Er hat viel zu tun.",                                                          # haben
    "3463": "Sie haben die ganze Nacht getanzt.",                                          # getanzt
    "3464": "Er hat das ganze Projekt selbst übernommen.",                                 # ganz
    "3465": "Das Fahrrad ist kaputt und muss repariert werden.",                           # kaputt
    "3466": "Er drückt den Knopf und die Tür öffnet sich.",                               # drücken
    "3467": "Er ist gefasst und ruhig trotz der schlechten Nachrichten.",                  # gefasst
    "3468": "Was soll ich heute zum Abendessen machen?",                                   # machen
    "3469": "Ich habe das schon erledigt.",                                                 # habe
    "3470": "Das ist nicht das Richtige.",                                                  # nicht
    "3471": "Er hat zu viel gegessen.",                                                     # zu
    "3472": "Der Supermarkt hat heute bis zwanzig Uhr geöffnet.",                         # Supermarkt (dup)
    "3473": "Der neue Nachbar ist sympathisch.",                                            # sympathisch (dup)
    "3474": "Es ist kalt heute.",                                                           # es
    "3475": "Er legt das Essen auf den Teller.",                                           # Teller
    "3476": "Die Temperatur ist heute auf dreißig Grad gestiegen.",                       # Temperatur
    "3477": "Er fährt immer zu schnell, er muss das Tempo reduzieren.",                   # Tempo
    "3478": "Der neue Teppich im Wohnzimmer ist sehr weich.",                             # Teppich
    "3479": "Er hat einen Termin beim Zahnarzt für nächsten Dienstag.",                   # Termin
    "3480": "Er trägt alle Termine in seinen Terminkalender ein.",                        # Terminkalender
    "3481": "Im Sommer frühstücken sie auf der Terrasse.",                                # Terrasse
    "3482": "Das Unternehmen testet das neue Produkt vor der Markteinführung.",          # testen
    "3483": "Er hat den Test bestanden und bekommt den Führerschein.",                   # Test
    "3484": "Das Hotel ist teuer, aber sehr komfortabel.",                               # teuer
    "3485": "Er liest den Text laut vor der Klasse.",                                    # Text
    "3486": "Das ist theoretisch möglich, aber in der Praxis schwierig.",               # theoretisch
    "3487": "Die Theorie wird in der Praxis getestet.",                                  # Theorie
    "3488": "Er geht zweimal pro Woche zur Therapie.",                                   # Therapie
    "3489": "Das Wasser im See ist sehr tief.",                                          # tief
    "3490": "Er liebt Tiere und hat einen Hund und eine Katze.",                        # Tier
    "3491": "Er war tatsächlich überrascht vom Ergebnis.",                              # tatsächlich
    "3492": "Er ist taub auf einem Ohr.",                                               # taub
    "3493": "Er taucht im Urlaub gerne im Meer.",                                       # tauchen
    "3494": "Er tauscht sein altes Handy gegen ein neueres.",                           # tauschen
    "3495": "Die Technik hat sich in den letzten Jahren stark verändert.",              # Technik
    "3496": "Er löst das technische Problem schnell.",                                  # technisch
    "3497": "Die neue Technologie macht vieles einfacher.",                             # Technologie
    "3498": "Er trinkt morgens immer eine Tasse Tee.",                                  # Tee
    "3499": "Er teilt das Essen gleichmäßig auf alle auf.",                             # teilen
    "3500": "Er liest den ersten Teil des Buches.",                                     # Teil
    "3501": "Der zweite Teil des Films war besser als der erste.",                      # Teil (dup)
    "3502": "Sie arbeitet nur in Teilzeit, weil sie Kinder hat.",                       # Teilzeit
    "3503": "Er nimmt an dem Kurs aktiv teil.",                                         # teilnehmen
    "3504": "Die Teilnahme am Kurs ist freiwillig.",                                    # Teilnahme
    "3505": "Jeder Teilnehmer bekommt ein Zertifikat.",                                 # Teilnehmer
    "3506": "Die Teilnehmerin stellte am Ende viele Fragen.",                           # Teilnehmerin
    "3507": "Er telefoniert jeden Sonntag mit seinen Eltern.",                          # telefonieren
    "3508": "Er hat das Ticket online gekauft.",                                        # gekauft
    "3509": "Er schafft es, alle Aufgaben rechtzeitig zu erledigen.",                  # schaffen
    "3510": "Die Leute standen Schlange vor dem Konzert.",                              # standen
    "3511": "Er versteht vieles noch nicht.",                                           # vieles
    "3512": "Er hat schon alle Hausaufgaben gemacht.",                                  # schon
    "3513": "Das Essen ist sehr lecker.",                                               # sehr
    "3514": "Obwohl er müde war, hat er weitergemacht.",                               # obwohl
    "3515": "Er ist auf einem Ohr taub.",                                               # taub (dup)
    "3516": "Er kauft eine Fahrkarte am Automaten.",                                    # eine
    "3517": "Beim ersten Versuch hat er die Prüfung bestanden.",                       # ersten
    "3518": "Er trainiert regelmäßig, um fit zu bleiben.",                             # regelmäßig
    "3519": "Der Kurs ist kostenlos und für alle offen.",                              # kostenlos
    "3520": "Er kommt pünktlich zur Verabredung.",                                     # kommen
    "3521": "Das ist ein traditionelles deutsches Gericht.",                           # traditionell
    "3522": "Er trägt jeden Tag eine Krawatte zur Arbeit.",                            # tragen
    "3523": "Er trainiert jeden Tag zwei Stunden Fußball.",                            # trainieren
    "3524": "Der Trainer gibt dem Team taktische Anweisungen.",                        # Trainer
    "3525": "Die Trainerin motiviert die Sportlerinnen vor dem Wettkampf.",            # Trainerin
    "3526": "Das harte Training hat sich gelohnt.",                                    # Training
    "3527": "Er fährt mit der Tram direkt zur Uni.",                                   # Tram
    "3528": "Sie weinte, eine Träne lief ihr über die Wange.",                        # Träne
    "3529": "Der Transport der Waren dauert drei Tage.",                               # Transport
    "3530": "Er träumt davon, einmal durch die ganze Welt zu reisen.",                # träumen
    "3531": "Sein Traum ist es, Musiker zu werden.",                                   # Traum
    "3532": "Er ist traurig, weil sein bester Freund umgezogen ist.",                 # traurig
    "3533": "Er trifft seine Freunde am Wochenende.",                                  # treffen
    "3534": "Der Treffpunkt ist am Brunnen vor dem Rathaus.",                          # Treffpunkt
    "3535": "Er treibt regelmäßig Sport.",                                             # treiben
    "3536": "Die Eltern haben sich getrennt.",                                         # trennen
    "3537": "Nach der Trennung zog sie in eine neue Stadt.",                           # Trennung
    "3538": "Die Kinder besuchen den Tierpark am Wochenende.",                        # Tierpark
    "3539": "Er gibt ihr einen Tipp, wie sie besser Deutsch lernen kann.",            # Tipp
    "3540": "Er tippt schnell und fehlerfrei.",                                        # tippen
    "3541": "Er hat die Antwort schnell getippt.",                                    # getippt
    "3542": "Er deckt den Tisch für das Abendessen.",                                 # Tisch
    "3543": "Seine Tochter hat gerade ihr Abitur gemacht.",                           # Tochter
    "3544": "Der Tod seines Vaters hat ihn sehr getroffen.",                          # Tod
    "3545": "Ein Sturz von dieser Höhe wäre tödlich.",                               # tödlich
    "3546": "Die Toilette ist am Ende des Flurs.",                                    # Toilette
    "3547": "Er schneidet frische Tomaten für den Salat.",                            # Tomate
    "3548": "Er kocht die Nudeln in einem großen Topf.",                              # Topf
    "3549": "Der Ball flog direkt ins Tor.",                                           # Tor
    "3550": "Zum Geburtstag gibt es eine Schokoladentorte.",                          # Torte
    "3551": "Der Baum ist tot, er bekommt keine Blätter mehr.",                      # tot
    "3552": "Bei dem Unfall gab es einen Toten.",                                     # Tote (male)
    "3553": "Die Tote wurde am Morgen gefunden.",                                     # Tote (female)
    "3554": "Das Konzert war total ausverkauft.",                                     # total
    "3555": "Der Tourismus ist ein wichtiger Wirtschaftszweig.",                     # Tourismus
    "3556": "Der Tourist fragt nach dem Weg zum Museum.",                            # Tourist
    "3557": "Die Touristin kauft Souvenirs auf dem Markt.",                          # Touristin
    "3558": "Die Kiste ist schwer und schwer zu tragen.",                            # schwer
    "3559": "Er fährt mit seinem Freund mit.",                                       # mitfahren
    "3560": "Er hat seine Nachbarin im Supermarkt getroffen.",                       # getroffen
    "3561": "Er zieht sich schnell an.",                                             # sich
    "3562": "Er kommt jeden Tag pünktlich.",                                         # kommt
    "3563": "Die Aufgabe ist schwierig, aber machbar.",                              # schwierig
    "3564": "Das Paar ist geschieden.",                                               # geschieden
    "3565": "Wir warten auf den Bus.",                                               # wir
    "3566": "Ich finde das sehr interessant.",                                       # finde
    "3567": "Er hat das Buch einmal gelesen.",                                       # einmal
    "3568": "Der Unfall war tödlich.",                                               # tödlich (dup)
    "3569": "Er muss jeden Tag Medikamente nehmen.",                                 # müssen
    "3570": "Er möchte mehr Zeit draußen verbringen.",                               # möchte
    "3571": "Er schießt beim Fußball auf das Tor.",                                  # schießen
    "3572": "Das ist unsere neue Wohnung.",                                          # unsere
    "3573": "Er ist ein interessanter Typ.",                                          # Typ
    "3574": "Es ist typisch für ihn, immer zu spät zu kommen.",                     # typisch
    "3575": "Er fährt mit der U-Bahn zur Arbeit.",                                   # U-Bahn
    "3576": "Diese Übung hilft ihm, die Grammatik zu festigen.",                     # Übung
    "3577": "Er liest ein Buch über die Geschichte Deutschlands.",                  # über
    "3578": "Er findet überall Fehler in den Texten.",                              # überall
    "3579": "Das Auto hat fast einen Fußgänger überfahren.",                        # überfahren
    "3580": "Er kann das überhaupt nicht verstehen.",                               # überhaupt
    "3581": "Er überholt das langsame Auto auf der Autobahn.",                      # überholen
    "3582": "Er überlegt lange, bevor er eine Entscheidung trifft.",               # überlegen
    "3583": "Das Treppenhaus ist sauber und hell.",                                 # Treppenhaus
    "3584": "Er tritt vorsichtig auf die Bremse.",                                  # treten
    "3585": "Der Hund ist treu und verlässt seinen Besitzer nie.",                 # treu
    "3586": "Er trinkt nach dem Sport viel Wasser.",                               # trinken
    "3587": "Er lässt dem Kellner ein gutes Trinkgeld.",                           # Trinkgeld
    "3588": "Die Wäsche ist trocken und kann abgenommen werden.",                  # trocken
    "3589": "Er trocknet das Geschirr nach dem Spülen ab.",                        # trocknen
    "3590": "Der Arzt gibt ihm Augentropfen.",                                     # Tropfen
    "3591": "Er geht auf dem Gehweg und nicht auf der Straße.",                   # Gehweg
    "3592": "Trotz des schlechten Wetters gingen sie spazieren.",                 # trotz
    "3593": "Was soll ich jetzt tun?",                                             # tun
    "3594": "Bitte die Tür schließen.",                                            # Tür
    "3595": "Von dem alten Turm hat man einen schönen Ausblick.",                 # Turm
    "3596": "Du hast das wunderbar gemacht.",                                      # du
    "3597": "Es ist typisch deutsch, pünktlich zu sein.",                         # typisch (dup)
    "3598": "Er übt täglich Klavier.",                                             # übe
    "3599": "Er muss die Rechnung noch bezahlen.",                                # bezahlen
    "3600": "Das Auto hat fast ein Kind überfahren.",                             # überfahren (dup)
    "3601": "Das stimmt nicht.",                                                   # nicht
    "3602": "Er muss früh aufstehen.",                                             # muss
    "3603": "Er geht in den Laden, um Milch zu kaufen.",                          # kaufen
    "3604": "Er arbeitet und lernt gleichzeitig.",                                # und
    "3605": "Er steigt in den Bus.",                                               # steigen
    "3606": "Er schläft die ganze Nacht durch.",                                  # ganz
    "3607": "Du kannst jetzt gehen.",                                              # du (dup)
    "3608": "Das ist nicht das, was er wollte.",                                  # nicht (dup)
    "3609": "Er ist schon früh gegangen.",                                        # gegangen
    "3610": "Er schwimmt jeden Morgen im See.",                                   # schwimmen
    "3611": "Er hat das Buch im Laden gekauft.",                                  # gekauft (dup)
    "3612": "Er schaut oben nach, ob das Fenster offen ist.",                    # oben
    "3613": "Er hat alles getan, was nötig war.",                                # getan
    "3614": "Das sieht sehr gut aus.",                                            # sieht
    "3615": "Er überzeugt seinen Chef, das Projekt zu genehmigen.",              # überzeugen
    "3616": "Er handelt immer nach seiner Überzeugung.",                         # Überzeugung
    "3617": "Es ist üblich, beim Betreten einer Wohnung die Schuhe auszuziehen.", # üblich
    "3618": "Es ist noch Brot übrig, möchtest du es haben?",                    # übrig
    "3619": "Übrigens, morgen ist die Abgabefrist.",                             # übrigens
    "3620": "Er sitzt am Ufer des Sees und angelt.",                             # Ufer
    "3621": "Die Uhr an der Wand zeigt neun Uhr an.",                           # Uhr
    "3622": "Er kommt um drei Uhr an.",                                          # um
    "3623": "Er umarmt seinen Vater am Flughafen.",                             # umarmen
    "3624": "Die Kinder laufen um den Springbrunnen.",                          # um (dup)
    "3625": "Er dreht sich um, als er seinen Namen hört.",                      # umdrehen
    "3626": "Die Umfrage zeigt, dass die meisten Menschen zufrieden sind.",     # Umfrage
    "3627": "Umgekehrt wäre es einfacher gewesen.",                             # umgekehrt
    "3628": "Wegen Bauarbeiten gibt es eine Umleitung.",                        # Umleitung
    "3629": "Er hat das Ticket umsonst bekommen.",                              # umsonst
    "3630": "Er kommt übermorgen zurück.",                                      # übermorgen
    "3631": "Er übernachtet in einem Hotel in der Innenstadt.",                 # übernachten
    "3632": "Die Übernachtung kostet achtzig Euro pro Nacht.",                  # Übernachtung
    "3633": "Er übernimmt mehr Verantwortung im neuen Job.",                    # übernehmen
    "3634": "Er überprüft alle Dokumente vor der Abgabe.",                      # überprüfen
    "3635": "Er überquert die Straße an der Ampel.",                            # überqueren
    "3636": "Die Nachricht hat alle überrascht.",                               # überraschen
    "3637": "Die Überraschungsparty war ein voller Erfolg.",                    # Überraschung
    "3638": "Er redet so lange, bis er sie überredet hat.",                    # überreden
    "3639": "Die Überschrift des Artikels ist kurz und prägnant.",             # Überschrift
    "3640": "Er übersetzt den deutschen Text ins Englische.",                  # übersetzen
    "3641": "Der Übersetzer arbeitet für das Gericht.",                        # Übersetzer
    "3642": "Die Übersetzerin übersetzt Bücher aus dem Japanischen.",          # Übersetzerin
    "3643": "Die Übersetzung war sehr genau und flüssig.",                     # Übersetzung
    "3644": "Er macht regelmäßig Überstunden, um das Projekt abzuschließen.", # Überstunde
    "3645": "Er hat ein Buch über die Geschichte Roms gelesen.",               # über (dup)
    "3646": "Er übertreibt manchmal, wenn er Geschichten erzählt.",           # übertreiben
    "3647": "Er überweist jeden Monat die Miete.",                             # überweisen
    "3648": "Die Überweisung ist eingegangen.",                                # Überweisung
    "3649": "Meine Eltern kommen morgen zu Besuch.",                           # meine
    "3650": "Er geht jeden Abend spazieren.",                                  # gehen
    "3651": "Er kommt um sieben Uhr.",                                         # um (dup)
    "3652": "Was soll ich aus diesem Stoff machen?",                          # machen
    "3653": "Er legt das Buch auf den Tisch.",                                # auf
    "3654": "Sie verbrachten einen schönen Urlaub.",                          # schöne
    "3655": "Er isst erst und kommt dann.",                                   # dann
    "3656": "Die Kinder sind draußen.",                                       # sind
    "3657": "Er lernt auch am Wochenende.",                                   # auch
    "3658": "Er hat gestern in einem Hotel übernachtet.",                     # übernachtet
    "3659": "Bildung ist wichtig für die Entwicklung.",                       # -ung (contextual)
    "3660": "Er hat die Aufgabe richtig gelöst.",                             # richtig
    "3661": "Er überquert die Brücke zu Fuß.",                               # überqueren (dup)
    "3662": "Er gibt den Kindern das Geld.",                                  # den
    "3663": "Er geht zum Supermarkt.",                                        # zum
    "3664": "Er übersetzt den Satz ins Französische.",                        # übersetzen (dup)
    "3665": "Er arbeitet hart, um sein Ziel zu erreichen.",                   # arbeiten
    "3666": "Das Ergebnis war gut.",                                           # gut
    "3667": "Man soll nicht lügen.",                                           # man
    "3668": "Er hat den Betrag überwiesen.",                                  # überwiesen
    "3669": "Er muss die Rechnung bezahlen.",                                 # bezahlen (dup)
    "3670": "Die Anweisung war klar und verständlich.",                       # -weisung (contextual)
    "3671": "Er studiert an der Universität Wien.",                           # Universität
    "3672": "Das Licht ist unten an der Treppe.",                             # unten
    "3673": "Das Buch liegt unter dem Tisch.",                               # unter
    "3674": "Er wohnt unter dem Dach.",                                       # unter (dup)
    "3675": "Er unterbricht das Gespräch, um ans Telefon zu gehen.",         # unterbrechen
    "3676": "Das Theaterstück unterhält das Publikum bestens.",              # unterhalten
    "3677": "Die Unterhaltung nach dem Essen war sehr angenehm.",            # Unterhaltung
    "3678": "Er sucht eine günstige Unterkunft für die Reise.",              # Unterkunft
    "3679": "Er reicht alle Unterlagen für den Antrag ein.",                 # Unterlagen
    "3680": "Es ist verboten, das Rauchen in öffentlichen Räumen zu unterlassen.", # unterlassen
    "3681": "Er unternimmt am Wochenende gerne Ausflüge.",                   # unternehmen
    "3682": "Der Unternehmer gründete seine Firma mit dreißig Jahren.",      # Unternehmer
    "3683": "Die Unternehmerin führt ein erfolgreiches Marketingunternehmen.", # Unternehmerin
    "3684": "Er unterrichtet Deutsch an einer Mittelschule.",                # unterrichten
    "3685": "Der Unterricht beginnt um acht Uhr.",                           # Unterricht
    "3686": "Das Parken ist hier untersagt.",                                # untersagt
    "3687": "Er kann gut zwischen den zwei Dialekten unterscheiden.",        # unterscheiden
    "3688": "Es gibt einen großen Unterschied zwischen den beiden Varianten.", # Unterschied
    "3689": "Er tauscht das kaputte Gerät im Laden um.",                     # umtauschen
    "3690": "Der Umtausch ist innerhalb von vierzehn Tagen möglich.",        # Umtausch
    "3691": "Wir müssen mehr für die Umwelt tun.",                           # Umwelt
    "3692": "Er engagiert sich aktiv für den Umweltschutz.",                # Umweltschutz
    "3693": "Die Umweltverschmutzung schadet der Gesundheit.",              # Umweltverschmutzung
    "3694": "Er zieht nächsten Monat in eine neue Wohnung um.",             # umziehen
    "3695": "Der Umzug war anstrengend, aber es lohnte sich.",              # Umzug
    "3696": "Das Wort unglaublich beginnt mit dem Präfix un-.",             # un-
    "3697": "Er muss das unbedingt heute noch erledigen.",                  # unbedingt
    "3698": "Er arbeitet und lebt in München.",                              # und
    "3699": "Er hatte einen Unfall auf dem Weg zur Arbeit.",                # Unfall
    "3700": "Das Hotel liegt ungefähr zehn Kilometer vom Zentrum entfernt.", # ungefähr
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

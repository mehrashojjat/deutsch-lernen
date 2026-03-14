import csv
import os

CSV_PATH = '/Users/mehrashojjat/Desktop/Works/MI/DL/word_data/quiz_csv/b1.csv'

# Batch 15: IDs 3701–3950
updates = {
    "3701": "Das ist ein ungewöhnliches Verhalten für ihn.",                                # ungewöhnlich
    "3702": "Man sollte die Regeln immer respektieren.",                                    # man
    "3703": "Die Schuhe stehen unten an der Treppe.",                                      # unten
    "3704": "Das ist eine wichtige Entscheidung.",                                          # wichtige
    "3705": "Ich spreche jeden Tag ein bisschen Deutsch.",                                  # spreche
    "3706": "Das Theaterstück unterhält das Publikum wunderbar.",                          # unterhalten
    "3707": "Er unterhält sich gerne mit seinen Nachbarn.",                                # unterhalten (dup)
    "3708": "Er liest und schreibt täglich.",                                              # und
    "3709": "Er arbeitet und lernt gleichzeitig.",                                         # und (dup)
    "3710": "Er bringt die Post jeden Morgen.",                                            # Post
    "3711": "Es ist verboten, das Rauchen in der Bibliothek zu unterlassen.",             # unterlassen
    "3712": "Er unternimmt gerne Ausflüge in die Natur.",                                  # unternehmen
    "3713": "Er wartet bis zehn Uhr auf Sie.",                                             # bis
    "3714": "Das Ticket hat er umsonst bekommen.",                                         # umsonst
    "3715": "Er macht weiter, obwohl er müde ist.",                                        # weiter
    "3716": "Er ist letzten Monat umgezogen.",                                             # umgezogen
    "3717": "Er hat mich gebeten, ihm zu helfen.",                                         # mich
    "3718": "Er spricht sehr gut Englisch.",                                               # sprechen
    "3719": "Er ist müde, aber er gibt nicht auf.",                                        # aber
    "3720": "Die alte Ruine wirkt in der Dunkelheit unheimlich.",                          # unheimlich
    "3721": "Er stellt die Vase mit den frischen Blumen auf den Tisch.",                  # Vase
    "3722": "Sein Vater bringt ihn jeden Morgen zur Schule.",                             # Vater
    "3723": "Sie verabreden sich für Samstagnachmittag.",                                  # verabreden
    "3724": "Sie sind für achtzehn Uhr verabredet.",                                       # verabredet
    "3725": "Er hat eine Verabredung mit seiner Freundin im Café.",                       # Verabredung
    "3726": "Er verabschiedet sich von seinen Kollegen.",                                  # verabschieden
    "3727": "Der Abschied am Bahnhof war sehr emotional.",                                 # Abschied
    "3728": "Die Stadt hat sich in den letzten Jahren stark verändert.",                   # verändern
    "3729": "Die Veranstaltung findet auf dem Marktplatz statt.",                         # Veranstaltung
    "3730": "Er trägt große Verantwortung als Teamleiter.",                               # Verantwortung
    "3731": "Er möchte sein Deutsch verbessern.",                                          # verbessern
    "3732": "Das Rauchen ist in diesem Gebäude verboten.",                                 # verbieten
    "3733": "Das Verbot des Alkohols gilt ab dreiundzwanzig Uhr.",                        # Verbot
    "3734": "Das Betreten des Geländes ist verboten.",                                    # verboten
    "3735": "Er verbindet die beiden Kabel miteinander.",                                  # verbinden
    "3736": "Er unterschreibt den Vertrag.",                                               # unterschreiben
    "3737": "Er braucht seine Unterschrift auf dem Formular.",                            # Unterschrift
    "3738": "Er unterstreicht die wichtigen Wörter im Text.",                             # unterstreichen
    "3739": "Die Organisation unterstützt Kinder aus schwierigen Verhältnissen.",         # unterstützen
    "3740": "Er braucht die Unterstützung seiner Familie.",                               # Unterstützung
    "3741": "Der Arzt untersucht den Patienten gründlich.",                               # untersuchen
    "3742": "Die Untersuchung ergab keine ernsten Befunde.",                              # Untersuchung
    "3743": "Er ist viel unterwegs und selten zuhause.",                                  # unterwegs
    "3744": "Er rahmt die Urkunde und hängt sie an die Wand.",                            # Urkunde
    "3745": "Er macht im Sommer drei Wochen Urlaub in Griechenland.",                    # Urlaub
    "3746": "Die Ursache des Unfalls ist noch unklar.",                                   # Ursache
    "3747": "Starke Winde verursachen oft Schäden an Häusern.",                          # verursachen
    "3748": "Das Gebäude war ursprünglich ein Kloster.",                                  # ursprünglich
    "3749": "Das Urteil des Richters wurde in der Zeitung veröffentlicht.",               # Urteil
    "3750": "Er liest am liebsten abends.",                                               # liebsten
    "3751": "Er geht zur Arbeit.",                                                         # zur
    "3752": "Wir sind für morgen Abend verabredet.",                                      # verabredet (dup)
    "3753": "Ich bin sehr froh, dich zu sehen.",                                          # bin
    "3754": "Er reist mit dem Zug.",                                                       # mit
    "3755": "Die neuen Nachbarn sind sehr nett.",                                         # nett
    "3756": "Er verabschiedet sich herzlich von seinen Gästen.",                         # verabschieden (dup)
    "3757": "Ihm fiel das Buch aus der Hand.",                                            # fiel
    "3758": "Das Wort endet auf -sen.",                                                    # sen (contextual)
    "3759": "Das Produkt wurde verbessert.",                                              # verbessert
    "3760": "Das Parken hier ist verboten.",                                              # verboten (dup)
    "3761": "Biegen Sie rechts ab.",                                                       # rechts
    "3762": "Er unterstreicht die falschen Antworten.",                                   # unterstreichen (dup)
    "3763": "Er kann gut Englisch sprechen.",                                             # können
    "3764": "Er lässt sein Auto in der Werkstatt.",                                       # lassen
    "3765": "Das ist eine neue Art, das Problem zu lösen.",                              # Art
    "3766": "Er kommt pünktlich an.",                                                     # komme
    "3767": "Er isst mittags immer warm.",                                                # essen
    "3768": "Er bekommt jeden Monat sein Gehalt.",                                        # bekommen
    "3769": "Er arbeitet hart, um seine Ziele zu erreichen.",                            # hart
    "3770": "Er ist vergnügt und lacht viel.",                                           # vergnügt
    "3771": "Er vergrößert das Bild auf seinem Bildschirm.",                             # vergrößern
    "3772": "Die Polizei verhaftet den Verdächtigen.",                                   # verhaften
    "3773": "Sein Verhalten war respektlos.",                                             # Verhalten
    "3774": "Das Verhältnis zwischen den beiden ist angespannt.",                        # Verhältnis
    "3775": "Er ist seit zehn Jahren verheiratet.",                                      # verheiratet
    "3776": "Er versucht, den Streit zu verhindern.",                                    # verhindern
    "3777": "Er verkauft seine alte Kamera online.",                                     # verkaufen
    "3778": "Der Verkäufer hilft ihm bei der Auswahl.",                                  # Verkäufer
    "3779": "Der Verkehr in der Stadt ist zur Stoßzeit sehr dicht.",                     # Verkehr
    "3780": "Das öffentliche Verkehrsmittel ist billiger als das Auto.",                 # Verkehrsmittel
    "3781": "Der Verlag veröffentlicht jedes Jahr zwanzig neue Bücher.",                 # Verlag
    "3782": "Er verlängert sein Visum um drei Monate.",                                  # verlängern
    "3783": "Er verlässt die Wohnung früh morgens.",                                    # verlassen
    "3784": "Das Auto verbraucht viel Benzin.",                                          # verbrauchen
    "3785": "Der Verbrecher wurde von der Polizei gefasst.",                             # Verbrecher
    "3786": "Die Verbrecherin wurde zu fünf Jahren verurteilt.",                        # Verbrecherin
    "3787": "Das Feuer verbrennt das trockene Laub.",                                    # verbrennen
    "3788": "Er verbringt den Abend mit seiner Familie.",                               # verbringen
    "3789": "Es besteht der Verdacht, dass er gelogen hat.",                            # Verdacht
    "3790": "Sein Verhalten war verdächtig.",                                            # verdächtig
    "3791": "Er verdient sein Geld als Musiker.",                                        # verdienen
    "3792": "Er ist Mitglied in einem Sportverein.",                                    # Verein
    "3793": "Sie vereinbaren einen Termin für nächste Woche.",                          # vereinbaren
    "3794": "Er lernt viel über die Vergangenheit Deutschlands.",                       # Vergangenheit
    "3795": "Er hat vergeblich versucht, das Problem zu lösen.",                        # vergeblich
    "3796": "Er vergisst oft, wo er seinen Schlüssel gelassen hat.",                   # vergessen
    "3797": "Er vergleicht die Preise in verschiedenen Läden.",                        # vergleichen
    "3798": "Im Vergleich zu letztem Jahr sind die Preise gestiegen.",                 # Vergleich
    "3799": "Er trifft ihn beim Einkaufen.",                                            # beim
    "3800": "Komm herein, die Tür ist offen.",                                          # herein
    "3801": "Das Verhalten des Fremden war merkwürdig.",                               # merkwürdig
    "3802": "Er hat die schwierigen Aufgaben gelöst.",                                  # schwierigen
    "3803": "Er meint, das sei die beste Entscheidung.",                               # meinen
    "3804": "Sie ist glücklich verheiratet.",                                           # verheiratet (dup)
    "3805": "Er tut alles, um den Unfall zu verhindern.",                              # verhindern (dup)
    "3806": "Er bittet seinen Vater um Hilfe.",                                        # helfen
    "3807": "Er reist mit dem Auto.",                                                   # mit (dup)
    "3808": "Der Chef verlangt pünktliche Abgabe der Berichte.",                       # verlangt
    "3809": "Er lässt das Kind alleine spielen.",                                      # lassen (dup)
    "3810": "Kann ich dir helfen?",                                                     # helfe
    "3811": "Er antwortet direkt und ehrlich.",                                        # direkt
    "3812": "Der Verdächtige wurde verhaftet.",                                        # verhaftet
    "3813": "Das Haus ist niedergebrannt und verbrannt.",                              # verbrannt
    "3814": "Ich gehe nur kurz einkaufen.",                                            # ich
    "3815": "Ich habe den Film schon gesehen.",                                        # gesehen
    "3816": "Das Gerät dient zur Messung der Temperatur.",                             # dient
    "3817": "Er hilft diesem Kind.",                                                    # diesem
    "3818": "Er versucht, ihn anzurufen.",                                             # anzurufen
    "3819": "Er ist nach dem Konzert sehr vergnügt.",                                  # vergnügt (dup)
    "3820": "Er ist verpflichtet, die Regeln einzuhalten.",                            # verpflichtet
    "3821": "Er verrät das Geheimnis nicht.",                                          # verraten
    "3822": "Er verreist nächste Woche nach Italien.",                                 # verreisen
    "3823": "Er hat eine verrückte Idee, aber es funktioniert.",                      # verrückt
    "3824": "Die Versammlung findet um neunzehn Uhr im Gemeinschaftsraum statt.",     # Versammlung
    "3825": "Das Meeting wurde auf nächste Woche verschoben.",                        # verschieben
    "3826": "Sie haben verschiedene Meinungen zu diesem Thema.",                      # verschieden
    "3827": "Der Arzt verschreibt ihm ein Antibiotikum.",                             # verschreiben
    "3828": "Der Schlüssel ist verschwunden.",                                        # verschwinden
    "3829": "Er versichert, dass er die Wahrheit sagt.",                             # versichern
    "3830": "Er legt die Versichertenkarte an der Rezeption vor.",                   # Versichertenkarte
    "3831": "Er hat eine Krankenversicherung.",                                       # Versicherung
    "3832": "Der Zug hat zwanzig Minuten Verspätung.",                               # Verspätung
    "3833": "Er verspricht, pünktlich zu sein.",                                     # versprechen
    "3834": "Er hat sich beim Sport das Knie verletzt.",                             # verletzen
    "3835": "Die Verletzung ist zum Glück nicht ernst.",                             # Verletzung
    "3836": "Er ist verliebt in seine Nachbarin.",                                   # verliebt
    "3837": "Er verliert oft seine Schlüssel.",                                      # verlieren
    "3838": "Der Verlierer nimmt die Niederlage sportlich.",                         # Verlierer
    "3839": "Die Verliererin gratuliert der Gewinnerin.",                            # Verliererin
    "3840": "Der Verlust seiner Stelle war ein großer Schock.",                     # Verlust
    "3841": "Er versucht, Stress zu vermeiden.",                                    # vermeiden
    "3842": "Er vermietet seine Wohnung während des Urlaubs.",                      # vermieten
    "3843": "Er muss die Miete an den Vermieter überweisen.",                       # Vermieter
    "3844": "Die Vermieterin klingelt, um die Schlüssel zu übergeben.",             # Vermieterin
    "3845": "Die Vermietung der Wohnung läuft über eine Agentur.",                  # Vermietung
    "3846": "Er vermisst seine Familie sehr.",                                       # vermissen
    "3847": "Die Arbeitsvermittlung hilft ihm, einen Job zu finden.",               # Vermittlung
    "3848": "Er vermutet, dass sie ihn belogen hat.",                               # vermuten
    "3849": "Er kommt vermutlich heute Abend an.",                                  # vermutlich
    "3850": "Er ist sehr vernünftig und denkt immer nach.",                         # vernünftig
    "3851": "Er verpackt das Geschenk in buntes Papier.",                           # verpacken
    "3852": "Er hat den letzten Bus verpasst.",                                     # verpassen
    "3853": "Er meldet sich krank bei seinem Chef.",                                # melden
    "3854": "Er ist der Beste in der Klasse.",                                      # ist
    "3855": "Er hat den Termin versäumt.",                                          # versäumt
    "3856": "Er verschiebt das Treffen auf nächste Woche.",                        # verschieben (dup)
    "3857": "Die zwei Häuser sind sehr verschieden.",                               # verschieden (dup)
    "3858": "Das Verb kochen gehört zu den -nen-Verben.",                          # -nen (contextual)
    "3859": "Er hat sich das Medikament verschrieben.",                            # verschrieben
    "3860": "Du kannst mich jederzeit anrufen.",                                   # du
    "3861": "Er hat eine gute Versicherung.",                                      # Versicherung (dup)
    "3862": "Gründung ist eine wichtige Etappe.",                                  # -ung (contextual)
    "3863": "Er hat mich gestern angerufen.",                                      # mich (dup)
    "3864": "Die Asche des Lagerfeuers war noch warm.",                            # asche (contextual)
    "3865": "Das Theaterstück war sehr gut.",                                      # sehr
    "3866": "Er versucht, Konflikte zu vermeiden.",                                # vermeiden (dup)
    "3867": "Er vermietet Zimmer an Studenten.",                                   # vermieten (dup)
    "3868": "Er kann gut kochen.",                                                  # kann
    "3869": "Die Vermittlung durch das Arbeitsamt war hilfreich.",                 # Vermittlung (dup)
    "3870": "Er fragt den Lehrer nach dem Weg.",                                   # fragen
    "3871": "Er kommt von der Arbeit nach Hause.",                                 # von
    "3872": "Er kommt morgen.",                                                    # kommen
    "3873": "Er hat den Zug verpasst.",                                            # verpasst
    "3874": "Er verzeiht ihr den Fehler.",                                         # verzeihen
    "3875": "Er verzichtet auf Zucker, weil er Diät macht.",                       # verzichten
    "3876": "Er schaut das Video noch einmal.",                                    # Video
    "3877": "Er hat viele Bücher gelesen.",                                        # viel / viele
    "3878": "Vielleicht kommt er heute Abend noch vorbei.",                        # vielleicht
    "3879": "Er kommt eine Viertelstunde zu spät.",                               # Viertel
    "3880": "Er nimmt an einem virtuellen Meeting teil.",                          # virtuell
    "3881": "Sein Computer wurde von einem Virus befallen.",                       # Virus
    "3882": "Er nimmt täglich Vitamine zum Frühstück.",                           # Vitamin
    "3883": "Der Zug war voll und er musste stehen.",                              # voll
    "3884": "Er arbeitet in Vollzeit.",                                            # Vollzeit
    "3885": "Er ist völlig erschöpft nach dem langen Tag.",                       # völlig
    "3886": "Er kommt von der Uni.",                                               # von
    "3887": "Das ist das Buch, das er empfohlen hat.",                            # das
    "3888": "Das Kind versteckt sich hinter dem Sofa.",                           # verstecken
    "3889": "Er versteht die Erklärung gut.",                                     # verstehen
    "3890": "Er versucht, die Aufgabe selbst zu lösen.",                          # versuchen
    "3891": "Der erste Versuch war nicht erfolgreich.",                           # Versuch
    "3892": "Er verteilt die Aufgaben gleichmäßig im Team.",                      # verteilen
    "3893": "Er unterschreibt den Vertrag sorgfältig.",                           # Vertrag
    "3894": "Er vertraut seinem Freund vollständig.",                             # vertrauen
    "3895": "Das Vertrauen zwischen ihnen ist sehr groß.",                        # Vertrauen
    "3896": "Er vertritt seinen Chef, wenn dieser im Urlaub ist.",               # vertreten
    "3897": "Der Vertreter kommt jeden Monat zu einem Besuch.",                  # Vertreter
    "3898": "Die Vertreterin übernimmt alle Aufgaben des Chefs.",                # Vertreterin
    "3899": "Er ist die Vertretung für seinen erkrankten Kollegen.",             # Vertretung
    "3900": "Der Richter verurteilt den Täter zu zwei Jahren Haft.",             # verurteilen
    "3901": "Die Verwaltung des Unternehmens sitzt in Hamburg.",                 # Verwaltung
    "3902": "Sie sind miteinander verwandt.",                                    # verwandt
    "3903": "Er trifft seinen Verwandten auf dem Familientreffen.",              # Verwandte (male)
    "3904": "Die Verwandte bringt ihm jeden Monat frisches Gemüse.",            # Verwandte (female)
    "3905": "Er verwechselt oft die Wörter ähnlicher Bedeutung.",               # verwechseln
    "3906": "Er kann sehr gut zeichnen.",                                        # können (dup)
    "3907": "Das Interview wurde aufgenommen.",                                  # aufgenommen
    "3908": "Er schläft noch.",                                                   # noch
    "3909": "Sie nehmen an einem virtuellen Kurs teil.",                         # virtuellen
    "3910": "Er schreibt in meinem Notizbuch.",                                  # meinem
    "3911": "Er gibt dem Kind das Spielzeug.",                                   # geben
    "3912": "Er isst jeden Tag zu Mittag.",                                      # essen (dup)
    "3913": "Er kommt immer pünktlich.",                                         # immer
    "3914": "Das Glas ist vollen Wein.",                                         # vollen
    "3915": "Er kommt heute nach Hause.",                                        # heute
    "3916": "Der Schlüssel ist versteckt.",                                      # versteckt
    "3917": "Das Konzert war sehr gut.",                                         # sehr (dup)
    "3918": "Er hat zu viel gegessen.",                                          # zu (dup)
    "3919": "Er suche nach seiner Brille.",                                      # suche
    "3920": "Er fährt ohne sein Ticket.",                                        # ohne
    "3921": "Er verteilt die Flugblätter.",                                      # verteilen (dup)
    "3922": "Er schreibt täglich in sein Tagebuch.",                             # schreiben
    "3923": "Er macht das Licht aus.",                                           # machen
    "3924": "Ich gehe jetzt schlafen.",                                          # ich (dup)
    "3925": "Die Buchhalterin prüft die Zahlen.",                               # -eterin (contextual)
    "3926": "Er hilft jemandem, der in Not ist.",                               # jemandem
    "3927": "Der Lehrer liest den Kindern eine Geschichte vor.",                # vorlesen
    "3928": "Er wohnt in einem Vorort von Berlin.",                             # Vorort
    "3929": "Er schlägt vor, das Treffen zu verschieben.",                      # vorschlagen
    "3930": "Der Vorschlag klang gut und wurde angenommen.",                    # Vorschlag
    "3931": "Er hält sich an die Vorschriften.",                                # Vorschrift
    "3932": "Vorsicht, nasse Böden!",                                           # Vorsicht
    "3933": "Sei vorsichtig beim Überqueren der Straße.",                       # vorsichtig
    "3934": "Er stellt sich dem Team vor.",                                     # vorstellen
    "3935": "Die Vorstellung des neuen Direktors war sehr professionell.",      # Vorstellung
    "3936": "Er bereitet sich auf das Vorstellungsgespräch vor.",               # Vorstellungsgespräch
    "3937": "Ein Vorteil vom Homeoffice ist die kurze Fahrtzeit.",              # Vorteil
    "3938": "Er hält einen Vortrag über erneuerbare Energien.",                # Vortrag
    "3939": "Er wählt die Vorwahl für Berlin.",                                 # Vorwahl
    "3940": "Er macht ihr den Vorwurf, nicht ehrlich gewesen zu sein.",        # Vorwurf
    "3941": "Er kommt fünf Minuten vor dem Termin an.",                        # vor
    "3942": "Er bezahlt die Zimmer im Voraus.",                                # voraus
    "3943": "Die Voraussetzung für den Job ist ein abgeschlossenes Studium.",  # Voraussetzung
    "3944": "Der Zug kommt voraussichtlich um dreizehn Uhr an.",               # voraussichtlich
    "3945": "Die Veranstaltung ist schon vorbei.",                             # vorbei
    "3946": "Er bereitet sich auf die Prüfung gut vor.",                       # vorbereiten
    "3947": "Die Vorbereitung auf das Gespräch hat sich gelohnt.",             # Vorbereitung
    "3948": "Er steht an der vorderen Kasse.",                                 # vorder
    "3949": "Er hat Vorfahrt an der Kreuzung.",                                # Vorfahrt
    "3950": "Vorgestern hat er seinen alten Freund getroffen.",                # vorgestern
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

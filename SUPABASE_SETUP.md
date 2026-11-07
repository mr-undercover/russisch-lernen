# Kontosynchronisierung einrichten (Supabase)

Die App bleibt eine statische PWA. Für Konten wird ein kostenloses Supabase-Projekt benötigt; dieses Repository enthält keine privaten Schlüssel und erstellt kein Projekt automatisch.

## Einrichtung

1. Erstelle ein Supabase-Projekt und bestätige die gewünschte E-Mail-Auth-Konfiguration.
2. Öffne den SQL Editor und führe `supabase/migrations/202611070001_user_progress.sql` aus.
3. Kopiere Project URL und den **publishable/anon key** aus den Project API Settings in `js/supabase-config.js` (`url` und `anonKey`). Niemals `service_role` im Browser verwenden.
4. Ergänze in Supabase Auth → URL Configuration deine veröffentlichte App-URL bei Site URL und Redirect URLs. Für Passwort-Reset muss die App über HTTPS oder localhost laufen; Datei-Direktstart hat keine stabile Redirect-URL.
5. Lade die geänderten Dateien mit der bestehenden GitHub-/Hosting-Pipeline hoch. Die Auth-Bibliothek wird über jsDelivr geladen; Offline-Lernen bleibt verfügbar, Konten benötigen eine Verbindung.

Die Tabelle `public.user_progress` speichert einen JSONB-Fortschrittsstand je Auth-User. RLS erlaubt nur Zugriff auf die eigene `user_id`. `sync_user_progress` führt Objektfelder serverseitig zusammen; gleichzeitige Änderungen desselben Einzelwertes verwenden den zuletzt gespeicherten Wert. Die gesamte Fortschrittsstruktur ist weiterhin vom Client bearbeitbar. Für manipulationssichere XP, Einkäufe oder verifizierte Leistungsnachweise wären serverseitige Lernereignisse/RPCs erforderlich; diese Migration schützt die Datensichtbarkeit, validiert aber keine Spielregeln.

Vorhandene anonyme Browserdaten werden nicht automatisch in ein Konto kopiert, damit keine Daten verschiedener Personen auf demselben Gerät vermischt werden. Der Import vorhandener lokaler Browserdaten in ein Konto erfolgt bewusst erst über „Lokalen Lernstand in dieses Konto übernehmen“ nach der Anmeldung.

Die Demo verwendet einen flüchtigen Beispielstand im Arbeitsspeicher. Verlassen stellt den vorherigen Stand wieder her und löst keine Cloud-Synchronisierung aus.

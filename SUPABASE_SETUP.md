# Kontosynchronisierung einrichten (Supabase)

Die App bleibt eine statische PWA. Für Konten wird ein kostenloses Supabase-Projekt benötigt; dieses Repository enthält keine privaten Schlüssel und erstellt kein Projekt automatisch.

## Einrichtung

1. Erstelle ein Supabase-Projekt und bestätige die gewünschte E-Mail-Auth-Konfiguration.
2. Öffne den SQL Editor und führe zuerst `supabase/migrations/202611070001_user_progress.sql`, danach die neue Migration `supabase/migrations/202611070002_secure_wallet.sql` aus. v1 legt die Grundtabelle an; v2 migriert bestehende XP und Shop-Daten in den geschützten Kontostand und sperrt direkte Client-Schreibrechte. Führe v2 nicht vor v1 aus.
3. Kopiere Project URL und den **publishable/anon key** aus den Project API Settings in `js/supabase-config.js` (`url` und `anonKey`). Niemals `service_role` im Browser verwenden.
4. Ergänze in Supabase Auth → URL Configuration deine veröffentlichte App-URL bei Site URL und Redirect URLs. Für Passwort-Reset muss die App über HTTPS oder localhost laufen; Datei-Direktstart hat keine stabile Redirect-URL.
5. Lade die geänderten Dateien mit der bestehenden GitHub-/Hosting-Pipeline hoch. Die Auth-Bibliothek wird über jsDelivr geladen; Offline-Lernen bleibt verfügbar, Konten benötigen eine Verbindung.

Die Tabelle `public.user_progress` speichert den JSONB-Lernstand je Auth-User. v2 ergänzt `account_state`, `xp_transactions`, `shop_catalog`, `user_purchases`, `learning_questions`, `learning_sessions`, `learning_session_answers`, `learning_session_mistakes` und `lesson_rewards`. Eigene Fortschrittsdaten sind per RLS auf den jeweiligen Auth-User begrenzt. Direkte Schreibrechte für den Client sind entzogen; Fortschritt läuft über `sync_user_progress`, XP über verifizierte Quiz-/Lektions-RPCs und Käufe über `purchase_shop_item`. Shoppreise kommen aus dem Serverkatalog. XP-Belohnungen sind auf 300 pro Tag begrenzt; die Sitzung muss alle Fragen enthalten, bevor sie abgeschlossen werden kann.

`SECURITY DEFINER`-Funktionen setzen einen festen `search_path`, prüfen `auth.uid()` und sind nur für angemeldete Nutzer freigegeben. Die Antworten/Schlüssel in `learning_questions` sind nicht direkt lesbar. Die App muss nach Ausführung der neuen Migration neu veröffentlicht werden, damit sie die neuen RPCs aufruft.

Vorhandene anonyme Browserdaten werden nicht automatisch in ein Konto kopiert, damit keine Daten verschiedener Personen auf demselben Gerät vermischt werden. Der einmalige Import über „Lokalen Lernstand in dieses Konto übernehmen“ erhält Lernfortschritt und Spaced-Repetition-Daten, überträgt aber absichtlich keine lokalen XP oder Shopgegenstände. Bestehende XP und Käufe eines Kontos werden beim v2-Backfill erhalten.

Die Demo verwendet einen flüchtigen Beispielstand im Arbeitsspeicher. Verlassen stellt den vorherigen Stand wieder her und löst keine Cloud-Synchronisierung aus.

## Einschränkungen für neue Inhalte

Die v2-Migration enthält verifizierbare Antwortschlüssel für den eingebauten Kurs, Wortschatz und das Alphabettraining. Neue oder benutzerdefinierte Fragen müssen vor Account-XP-Freigabe ebenfalls mit stabilen Frage-IDs und geprüften Lösungsschlüsseln serverseitig ergänzt werden. Nicht bekannte Fragen können in einem angemeldeten Konto keine XP aus einer verifizierten Sitzung erzeugen.

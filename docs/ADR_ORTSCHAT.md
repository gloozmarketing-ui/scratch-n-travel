# ADR-002: Orts-Chat & Präsenz-Modell (SNT-340 / SNT-341)

> **Status:** AKZEPTIERT (Empfehlung Modell B)  
> **Datum:** 2026-10-08  
> **Entscheider:** Antigravity / Gemini & Scratch'n'Travel Architecture  
> **Kontext:** SNT-340, SNT-341 (Vorbereitung für SNT-342 bis SNT-346)  
> **Ziel:** Spontaner lokaler Austausch an Orten ohne Stalking-Gefahr, ohne Echtzeit-Präsenz-Tracking und ohne unmoderierte Massengruppen.

---

## 1. Kontext & Problemstellung

Reisende und Locals möchten sich an Orten (Secret Spots, Treffpunkten, Stadtvierteln) über aktuelle Bedingungen austauschen (z. B. *"Ist der Sonnenuntergang heute gut sichtbar?"*, *"Gibt es Bauarbeiten am Pfad?"*, *"Wer ist heute beim Beach-Volleyball?"*).

Klassische Ansätze aus Social Apps (z. B. Tinder/Telegram/Jodel) bringen jedoch erhebliche Sicherheits- und Datenschutzprobleme:
1. **Live-Standortübertragung & Stalking:** Wenn sichtbar ist, wer sich gerade exakt wo aufhält, entsteht eine erhebliche Gefahr für Alleinreisende (insb. FLINTA-Personen).
2. **Belästigung & Spam:** Offene Gruppenchats ohne Vertrauensschwellen ziehen Krypto-Bots, Verkaufs-Spam und unerwünschte Kontaktversuche an.
3. **DSGVO & Batterieverbrauch:** Kontinuierliches Geofencing im Hintergrund verletzt Datenschutzstandards und entleert Smartphone-Akkus.

---

## 2. Bewertete Alternativen (A / B / C)

| Kriterium | Modell A: Live-Radar & Echtzeit-Präsenz | Modell B (GEWÄHLT): Asynchroner Orts-Kanal (5 km Radius) | Modell C: Geschlossene 1:1 Chats nur nach Meetup |
|---|---|---|---|
| **Konzept** | Live-Standortübertragung ("X Personen in 200m Umkreis") | Temporäre Kanäle pro Spot/Ort, an Ort gebunden (nicht an Person) | Kein offener Chat; Chat nur nach gegenseitiger Meetup-Teilnahme |
| **Präsenz-Tracking** | Ja (Live-GPS kontinuierlich) | **Nein (Null Hintergrund-Tracking, keine Entfernungsanzeige)** | Nein |
| **Radius** | Dynamisch (100 m – 30 km) | **Fester Schutzradius (max. 5 km)** | Keiner |
| **Stalking-Risiko** | Extrem hoch (Gefahr für Alleinreisende) | **Minimal (Beitrag gehört zum Ort, nicht zum Standort)** | Keine |
| **Trust-Barriere** | Keine oder niedrig | **Schreiben nur mit Kanal-Token + Trust ≥ 1** | Sehr hoch (nur nach Meetup) |
| **DSGVO-Konformität** | Problematisch (Bewegungsprofile) | **100% datensparsam & einwilligungsbasiert** | Vollständig konform |
| **Community-Nutzen** | Oberflächlich / Dating-Gefahr | **Fokus auf Ort, Sicherheit & konkreten Tipp** | Sehr träge, kein spontaner Austausch |

---

## 3. Entscheidung: Modell B — Asynchroner Orts-Kanal (`place_channels`)

Wir entscheiden uns verbindlich für **Modell B**.

### Kernprinzipien von Modell B:
1. **Der Kanal gehört dem Ort, nicht den Personen:**
   - Es gibt keine Anzeige wie *"Igor ist 300 Meter entfernt"*.
   - Ein Kanal (`place_channels`) ist an eine `place_id` (Spot oder Stadtteil) gekoppelt.
2. **Kein Live-Tracking / Kurzlebiges Kanal-Token:**
   - Ein Nutzer erhält ein Schreib-Token ausschließlich aktiv durch Aufruf des Geo-RPC (`register_channel`), wenn er sich innerhalb des 5-km-Radius befindet.
   - Das Token verfällt serverseitig automatisch nach **15 Minuten** (`valid_until = now() + interval '15 minutes'`).
   - Keine Hintergrund-Ortung, kein GPS-Streaming.
3. **Trust & Safety Gate:**
   - **Lesen:** Öffentlich lesbar (für Transparenz und Information).
   - **Schreiben:** Erfordert gültiges Kanal-Token, `chat_consent` und Trust-Tier ≥ `member` (verifiziertes Basisprofil, keine Wegwerf-Bots).
   - **Antworten/Interagieren:** Trust-Punkte schützen vor Übergriffen.
4. **Anti-Missbrauch & DSGVO:**
   - Rate-Limits: Max. 5 Posts pro Stunde je Nutzer pro Kanal.
   - Block/Report: Jeder Beitrag hat einen direkten Melde-Dialog (`ReportDialog`); gemeldete Beiträge werden bei 3 Reports vorläufig verborgen.
   - Blockierte Nutzer (`blocks`-Tabelle) sehen die Beiträge des Blockierenden nicht.

---

## 4. Konkrete Architektur & Tabellenstruktur (SNT-342 / SNT-343)

### 4.1 Tabellen (Additive Migration — berührt keine bestehenden Tabellen!)
1. **`public.place_channels`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `place_id UUID NOT NULL` (Referenz auf `secret_spots(id)` oder Orts-ID)
   - `created_by UUID REFERENCES profiles(id) ON DELETE SET NULL`
   - `city VARCHAR(100) NOT NULL`
   - `valid_until TIMESTAMPTZ NOT NULL`
   - `created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`

2. **`public.chat_posts`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `channel_id UUID NOT NULL REFERENCES place_channels(id) ON DELETE CASCADE`
   - `author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
   - `body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000)`
   - `trust_tier VARCHAR(20) DEFAULT 'member'`
   - `is_flagged BOOLEAN DEFAULT FALSE`
   - `reports_count INT DEFAULT 0`
   - `created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`

3. **`public.chat_consent`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `place_id UUID NOT NULL`
   - `user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
   - `allowed BOOLEAN DEFAULT TRUE`
   - `granted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`
   - `revoked_at TIMESTAMPTZ`
   - `UNIQUE(place_id, user_id)`

### 4.2 Geo-RPC (`register_channel`) — `SECURITY DEFINER`
- Signatur: `register_channel(p_place_id UUID, p_lat NUMERIC, p_lng NUMERIC) RETURNS JSONB`
- Prüft:
  - Nutzer ist authentifiziert (`auth.uid() IS NOT NULL`).
  - Distanz zwischen `(p_lat, p_lng)` und Ort-Koordinaten beträgt ≤ 5.0 km (Haversine-Formel in SQL).
  - Erstellt oder erneuert Kanal-Eintrag mit Ablaufzeit `now() + interval '15 minutes'`.
  - Liefert signierten Token-Payload zurück.

---

## 5. Auswirkungen & Nachweiskette

- **SNT-342 (Migration):** Erstellt die 3 Tabellen additiv ohne `ALTER TABLE` auf Alttabellen.
- **SNT-343 (Geo-RPC):** Implementiert `register_channel` mit 15-Minuten-Gültigkeit und 5-km-Schutzgrenze.
- **SNT-344 (RLS):** Policies für SELECT (public), INSERT (validiert Token + Consent), UPDATE/DELETE (nur Autor).
- **SNT-345 (Missbrauchstests):** Negative Tests in `scripts/test_rls.js` für 5-km-Verletzung, Rate-Limits und Reports.
- **SNT-346 (UI):** Chat-Komponente mit `TrustBadge`, Melde-Dialog und Consent-Banner ohne Entfernungsanzeige.

---

## 6. Verifikation (Definition of Done für SNT-340 / SNT-341)

- [x] ADR-002 vollständig formuliert und in `docs/ADR_ORTSCHAT.md` abgelegt.
- [x] A/B/C-Alternativenmatrix mit Begründung für Modell B dokumentiert.
- [x] Schnittstellen und Tabellendefinitionen für SNT-342 bis SNT-346 definiert.
- [x] Keine Sicherheits- oder DSGVO-Konflikte mit `user_global` oder `AGENTS.md`.

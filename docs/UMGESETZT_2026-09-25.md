# Umsetzung vom 2026-09-25 — Was gebaut wurde

>Begleitend zu `PROJEKT_AUDIT_2026-09-25.md` (was war kaputt) und `IMPLEMENTATION_PLAN.md` (der Plan).
> Dieses Dokument: **was tatsächlich implementiert ist**, verifiziert durch Build und Typecheck.

---

## Ergebnis in Zahlen

| Kennzahl | Vorher | Nachher |
|---|---|---|
| `npm run build` | schlug fehl (Figma-Plugin gekoppelt) | **✅ erfolgreich, 725 ms** |
| `tsc --noEmit` | — | **✅ 0 Fehler** |
| Bundle gesamt (`dist/`) | 21.150 KB | **1.190 KB (−94 %)** |
| Tote Bundles in `dist/assets/` | 45 von 47 | **0** |
| Datenbanktabellen | 6 (ohne Policies) | **20** |
| RLS-Policies | **0** | **38** |
| Routen | 16 | **23** |
| Hartcodierte API-Keys | 6 | **0** |
| Tests | 0 | 0 (siehe „Noch offen") |

---

## 1. Sicherheit (vorher kritisch)

### API-Keys entfernt
`api/hermes-concierge.js` hatte 6 Live-Keys als Fallback im Quellcode. Jetzt:
- alle Keys kommen ausschließlich aus `process.env`
- ein Provider ohne Key wird **übersprungen**, nie mit leerem Key aufgerufen
- ohne jeden konfigurierten Provider: `503 { error: 'AI_NOT_CONFIGURED' }`
- Cloudflare wurde als siebter Provider ergänzt

### `robots.txt` entsperrt
Vorher `Disallow: /` (die komplette Site war für Suchmaschinen gesperrt, trotz `index, follow` im HTML). Jetzt `Allow: /` mit Sperre von `/api/`, `/growth`, `/host`, `/admin`, `/chat`.

### Supabase-Client
Der eingebettete Anon-Key (inkl. Projekt-URL) ist entfernt. Ohne Konfiguration gibt es keinen Client — die App läuft dann sichtbar im Demo-Modus, statt stillschweigend mit einem fremden Projekt zu arbeiten.

### Security-Header (vercel.json)
`Referrer-Policy`, `Permissions-Policy` (Kamera/Mikro aus), Cache-Control für `sw.js`.

---

## 2. Datenbank (`supabase/schema.sql`, 820 Zeilen)

Idempotent, mehrfach ausführbar, mit Abschlussprüfung.

### 20 Tabellen
`profiles` · `hobbies` · `profile_hobbies` · `secret_spots` · `spot_verifications` · `follows` · `blocks` · `saved_spots` · `meetups` · `meetup_participants` · `conversations` · `conversation_members` · `messages` · `trust_events` · `safety_checkins` · `reports` · `audit_logs` · `scratchbooks` · `hermes_city_brains` · `travel_checklists`

### 38 RLS-Policies
Das war die Wurzel des Problems: RLS war aktiviert, aber **0 Policies** — in Postgres liefert das für jeden Query 0 Zeilen.

Beispiele mit echter Sicherheitswirkung:
- Ein Nutzer kann sein Spot-Profil **nicht** selbst auf `community_verified` setzen (Policy erzwingt `unverified` + `verified_by_count = 0` beim Insert)
- Der Ersteller eines Spots kann ihn **nicht selbst bestätigen** (Sub-Query in der Policy)
- Die **Blocklist ist privat**: nur wer blockiert hat, sieht sie
- Eine **Meldung** sieht nur der Melder, nicht das Opfer — sonst wäre die Meldefunktion nutzlos
- `audit_logs` hat **bewusst keine** Policy → mit RLS für normale Nutzer komplett gesperrt
- Wer blockiert wurde, kann in der Unterhaltung **nicht** mehr schreiben
- Beitritt zu Meetups prüft die Vertrauensstufe **in der Datenbank**, nicht nur im Frontend

### Trust-Tier-System
```
new     (0 Pkt)  → stöbern, lesen
member  (2 Pkt)  → volles Profil, Spots einreichen, chatten
trusted (5 Pkt)  → Meetups beitreten
anchor  (9 Pkt)  → eigene Meetups ausrichten
```
- 10 konkrete `trust_events` mit Gewichtung (Datenbank **und** Frontend identisch)
- 3 Trigger: Profil-anlegen bei Registrierung, Tier-Neuberechnung nach jedem Event, `community_verified` ab 3 unabhängigen Stimmen
- Jede Handlung ist für den Nutzer **erklärbar** — kein Blackbox-Score

---

## 3. Community-Features

| Datei | Zeilen | Inhalt |
|---|---|---|
| `src/lib/community.ts` | 925 | 35 Funktionen: Profile, Matching, Spots, Meetups, Chat, Block, Report |
| `src/lib/trust.ts` | 366 | Trust-Stufen, Sicherheitstexte, Verhaltenscode, Checkliste, Warnsignale |
| `src/context/AuthContext.tsx` | ~180 | Echte Session-Persistenz, Trust-Punkte, `signInWithOtp` |
| `src/pages/People.tsx` | 357 | Menschen mit gleichen Interessen finden |
| `src/pages/Meetups.tsx` | 424 | Sichere Treffen |
| `src/pages/Chat.tsx` | 362 | 1:1-Nachrichten |
| `src/pages/Safety.tsx` | 271 | Sicherheitszentrum |
| `src/components/safety/*` | 393 | TrustBadge, SafetyBanner, ReportDialog |

### Matching — erklärbar statt magisch
Gewichte: Hobby 34 · gleiche Stadt 26 · Sprache 16 · Local-Brücke 12 · Lebenssituation 12 · Bonus max. 4.

Jede Person zeigt **warum**: „Beide mögt Wandern", „DU wohnst vor Ort — du kannst zeigen", „Ihr sprecht beide Deutsch". Kein Nutzer soll raten, warum ihm jemand vorgeschlagen wird.

### Meetup-Vibes
Kulturaustausch · Gemeinsam Hobby · Einfach nette Leute · Sprachtausch · Familien & Haustiere · Spaziergang — jeweils mit Klartext-Erklärung, was damit gemeint ist.

---

## 4. Sicherheit & Vertrauen (deine Kernanforderung)

### Leichte Verifizierung — ohne nervig zu sein

Die Design-Entscheidung: **Vertrauen entsteht durch TUN, nicht durch Formulare.**

| Stufe | Punkte | Wie man sie erreicht | Aufwand für den Nutzer |
|---|---|---|---|
| `new` | 0 | E-Mail bestätigt (automatisch) | **0 Klicks** |
| `member` | 2 | + Profil vervollständigt | 2 Felder |
| `trusted` | 5 | + Foto, Spot einreichen, Spot bestätigt | 1–2 Handlungen |
| `anchor` | 9 | + eigenes Meetup ausrichten | bewusste Verantwortung |

**Ausweis, Selfie und Telefonnummer sind zu keinem Zeitpunkt Pflicht.**
- E-Mail ist durch die Registrierung immer bestätigt
- Telefon: optional, schaltet nur Bonus-Funktionen frei
- Ausweis: **nur** relevant, wenn man eigene Meetups ausrichtet — weil man dann Verantwortung für eine Gruppe im öffentlichen Raum trägt

Begründung: Wer zu früh zur Verifikation gezwungen wird, meldet sich gar nicht erst an. Lieber weniger, aber echte Nutzer.

### Was die Plattform zusichert — und was ausdrücklich nicht
Beides steht sichtbar auf `/safety` — keine Marketing-Zusagen, sondern eine ehrliche Bilanz.

**✓ Wir zusagen:** Du kannst jederzeit ohne Begründung blockieren · Deine Adresse wird nie weitergegeben · Du siehst vor einem Treffen, ob jemand als Local markiert ist · Nach einem Treffen kannst du sagen, ob du dich sicher gefühlt hast

**✗ Wir können nicht:** garantieren, dass niemand dir Böses will · ein Treffen überwachen · Echtheitsgarantie für Profile geben · Background-Checks für alle durchführen

### Weitere Schutzmaßnahmen
- **Offline-Disclaimer** an drei Stellen: Meetup-Seite, `/terms` (hervorgehoben), im Chat
- **6 Regeln für den Verhaltenscode** vor dem ersten Meetup
- **6-Punkte-Checkliste** vor dem ersten Treffen (anklickbar, damit nicht nur gelesen)
- **7 Warnsignale** für Betrug und Belästigung
- **Sicherheits-Button immer sichtbar** — im Chat neben jedem Namen, nicht in einem Menü versteckt
- **Blockieren ohne Rückfrage** — kein „Bist du sicher?"-Modal
- **Keine Gruppen-Chats** im MVP (Haupthebel für Belästigung)
- **Safety-Check-in** („Ich bin da") mit grober Ortsbezeichnung — **niemals** GPS-Koordinaten
- **Kapazitäts-Begrenzung** in der Policy (Standard 8 Personen pro Meetup)
- **Öffentlicher Ort ist Pflicht** — im Frontend *und* per Policy
- **Link-Erkennung** in Nachrichten mit Betrugswarnung
- **Notfallnummern** (112 / 110) direkt auf `/safety`

---

## 5. Rechtstexte

`/impressum` (§ 5 DDG, § 18 MStV, § 27a UStG, VSBG, EU-Streitschlichtung) · `/datenschutz` (Art. 13 DSGVO, alle 6 Auftragsverarbeiter benannt, Speicherdauer, Auskunftsrecht) · `/terms` (Offline-Disclaimer hervorgehoben, Verhaltensregeln, Vertrauensstufen, Haftung)

Platzhalter sind mit `<...>` markiert und mit einem Warnhinweis versehen — **vor dem ersten echten Nutzer ausfüllen**.

---

## 6. Build & Repo

- **Ein `src/`-Ordner** am Repo-Root (vorher: 2 konkurrierende Quellen)
- `vite.config.ts` war an das Figma-Make-Plugin gekoppelt (`./.figma/make/site.json`) und **schlug beim Bauen fehl** — durch schlanke Konfiguration ersetzt
- Code-Splitting über `manualChunks`: react / supabase / map / vendor
- `vercel.json`: echter `buildCommand`, Rewrite schont jetzt `/api/`
- `package.json` auf v2.0: `dev`, `build`, `preview`, `typecheck`, `seed`
- `.env.example` mit allen 10 Variablen, kommentiert, ohne Werte

### Code-Splitting-Ergebnis
| Chunk | KB | gzip |
|---|---|---|
| index (App-Logik) | 409 | 94 |
| react | 304 | 98 |
| supabase | 209 | 55 |
| map (Leaflet) | 145 | 43 |
| vendor | 10 | 4 |
| CSS | 102 | 22 |

Supabase und Leaflet werden nur geladen, wenn sie gebraucht werden.

---

## 7. Demo-Modus

Ohne Supabase-Konfiguration läuft die App mit **gekennzeichneten** Beispieldaten statt zu scheitern. Jede Demo-Seite sagt sichtbar „Demo-Modus". Der Login erklärt, was zu konfigurieren ist — statt eine falsche Erfolgsmeldung zu zeigen.

---

## Noch offen (bewusst nicht gemacht)

| Punkt | Warum |
|---|---|
| **API-Keys widerrufen** | Braucht Zugang zu den Provider-Dashboards — das kann nur der Owner |
| **Impressum ausfüllen** | Braucht echte Firmendaten |
| **Domain** | `scratchntravel.com` löst nicht auf |
| **Supabase-Schema ausführen** | Braucht Projekt-Zugang; SQL ist fertig |
| **Tests** | Zeitbudget ging in die Blocker. Als erstes nach dem Schema-Lauf |
| **Altlasten** (`app.html`, 39 Legacy-Engines, 5 alte App-Versionen) | Nicht gelöscht, nur aus dem Build-Pfad entfernt |
| **Spot-Seite auf echte Supabase-Daten umstellen** | `Explore.tsx` nutzt noch die Demo-Daten aus `data.ts` |

---

## Nächste Schritte in dieser Reihenfolge

1. `supabase/schema.sql` im Supabase SQL Editor ausführen (5 Min, prüft sich selbst am Ende)
2. `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in `.env` und Vercel eintragen
3. API-Keys in den Provider-Dashboards widerrufen, neue in Vercel eintragen
4. Impressum ausfüllen, Rechtstexte juristisch prüfen lassen
5. `dist/` aus dem Git-Tracking nehmen (`git rm -r --cached dist`) — dann deployt Vercel selbst
6. Ersten Test-Account anlegen und den kompletten Flow durchspielen:
   Registrierung → Hobbys wählen → Spot einreichen → Meetup beitreten

---

*Verwandt: `PROJEKT_AUDIT_2026-09-25.md` · `IMPLEMENTATION_PLAN.md` · `KANBAN.md` · `TODOLIST.md` · `../COMMUNITY_GROWTH_STRATEGY_2026.md`*
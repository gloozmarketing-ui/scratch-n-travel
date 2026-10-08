# 🔄 ÜBERGABE an Antigravity (Gemini 3.8) — Scratch'n'Travel

> **Stand:** 2026-10-08 · **Commit:** `f6543d3` · **Branch:** `main` (clean)
> **Letzte Commits:** `f6543d3` (POD-Flag + Give&Take) → `1a96a66` (KANBAN/TODO-Sync)
> → `21c469d` (RLS-Live-Fix) → `423fb7e` (SNT-301…305 Submit-Kette) → `4582513` (RLS-Recursion-Fix)
> **Lesereihenfolge für Gemini:** diese Datei → `docs/KANBAN.md` → `docs/TODOLIST.md` → `docs/IMPLEMENTATION_PLAN.md`

---

## 1. Copy-Paste-Einstiegsprompt für Antigravity

```text
Du übernimmst Scratch'n'Travel auf Stand f6543d3 (main, clean).
Lies docs/UEBERGABE_AN_ANTIGRAVITY_2026-10-08.md vollständig, dann
docs/KANBAN.md, docs/TODOLIST.md, docs/IMPLEMENTATION_PLAN.md (Anhang A+B).

Regeln:
1. Eine KANBAN-Karte wandert nur nach rechts, wenn ihr VERIFY erfüllt ist.
2. Vor jedem Commit: npm run check:all MUSS grün sein (61 Tests).
3. Keine neuen Env-Variablen ohne .env.example-Eintrag mit Platzhalter.
4. Keine Fiktion: keine erfundenen Ratings, Counts, Testimonials.
   Unsichere Zahlen als [UNVERIFIED] markieren.
5. Single-Brain-Prinzip: 1 Stadt (Lissabon) mit echter Community vor 12 leeren.
6. POD/Merch bleibt versteckt hinter VITE_POD_ENABLED (Default aus) — nur
   öffnen wenn Owner es anordnet.
7. Commit-Format: type(scope): SNT-XXX Kurzbeschreibung (z.B. feat(chat): SNT-342 ...)

Starte mit: git status, npm run check:all, dann TODOLIST „DIESE WOCHE" von oben
nach unten. Melde nach jedem Schritt SPEC → VERIFY → SHIP.
```

---

## 2. Aktueller Stand (Was ist wahr am 2026-10-08)

### 2.1 Repo & Deploy
- **Stack:** React 19 + Vite 8 + TS 5.7 + Tailwind 4 + react-router 7 + Supabase 2 + Leaflet 1.9
- **Root `package.json`:** `type: module`. Ausnahme: `scripts/package.json` = commonjs,
  `api/package.json` = commonjs (Fix 2026-09-30, sonst `require is not defined`).
- **Vercel:** `vercel.json` → build `npm run build`, output `dist`, SPA-Rewrite
  `/((?!api/).*) → /index.html`, Security-Header + Cache-Header gesetzt.
- **API (CommonJS, je maxDuration):** `create-checkout-session`, `create-merch-checkout-session`,
  `stripe-webhook` (30s), `pod-orders` (30s), `hermes-concierge` (15s, 503 ohne Key).
- **Deployments getrennt (SNT-102 ✅):** Prod = echter Titel, Staging = noindex.

### 2.2 Was funktioniert (verifiziert)
| Bereich | Nachweis |
|---|---|
| Secrets aus Code + Historie entfernt | `4c26c94`, Push Protection grün |
| 6 API-Endpunkte (kein 500) | `04a10f9`, live 405/400/200 |
| Route-Splitting + lazy Leaflet (432→169 KB, gzip 100→32 KB) | `3eb6c12` |
| CI-Gate `check:all` + Bundle-Budget + `check:seo` (8 Checks) | grün, 61 Tests |
| Auth: `signInWithOtp` + `onAuthStateChange`, `RequireAuth` für 6 Routen | SNT-209 ✅ |
| Schema live: 60 RLS-Policies greifen, `test_rls.js` **13 PASS / 0 FAIL / 1 SKIP** | SNT-331/333 ✅ 2026-10-06 |
| Community Submit-Kette SNT-301…305: `submitSpot` mit `created_by`, Pflichtfelder, Rate-Limit 5/Tag, Explore-Fallback | `423fb7e` ✅ |
| POD versteckt (SNT-373 ✅), Give&Take-Sektion + Pricing-Banner (SNT-374 ✅) | `f6543d3` ✅ |
| Footer-Rechtstexte §5 DDG, Error-Boundary, `npm run smoke` (45 Live-Checks) | ✅ |

### 2.3 Was bewusst OFFEN ist (Blocker → nur Owner)
1. **SNT-101 Rest:** 6 Keys widerrufen (Zenmux, Requesty, Cerebras, Vercel-AI, Cloudflare, Printful).
2. **SNT-332:** `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in **Vercel-Env** (lokal in `.env` ✅, live fehlt → Demo-Modus).
3. **SNT-334:** `pg_cron` im Dashboard aktivieren (sonst Fotos ewig `in_delay`).
4. **SNT-108/109:** Domain-Entscheidung (`scratchntravel.com` vs. Vercel-URL), danach Search Console + Sitemap.
5. **SNT-363…365:** Printify-Keys → echte IDs → Musterbestellung (geparkt bis Nutzer da).

## 3. Implementationsplan (konsolidiert für Gemini)

> Vollversion: `docs/IMPLEMENTATION_PLAN.md` (SPEC → PLAN → TASKS → VERIFY → SHIP pro Task).
> Hier die operative Kurzform in strikter Reihenfolge. Kritischer Pfad:
> **SNT-332 (Vercel-Env) → SNT-334 (pg_cron) → SNT-340…346 (Orts-Chat) → SNT-210/220 (Fundament schließen) → Verify-Rundgang.**

### 3.1 Architektur-Karte (wo liegt was)
```
src/
  routes.tsx            # 23 Routen, lazy + Suspense; 6 mit RequireAuth (passport, profile, host, people, meetups, chat)
  lib/features.ts       # POD_ENABLED = VITE_POD_ENABLED === 'true' (Build-Zeit-Flag)
  lib/community.ts      # submitSpot (created_by, Pflichtfelder, 5/Tag), Präsenz-Basis
  lib/analytics.ts      # track() — stumm ohne VITE_PLAUSIBLE_DOMAIN, 9/12 Events verdrahtet
  context/AuthContext.tsx # signInWithOtp + onAuthStateChange + RequireAuth (Demo-Modus: erklärt statt blockiert)
  pages/  Home, Explore, Meetups, People, Chat, Safety, Pricing, BadgesPage, Login, ...
supabase/schema.sql     # 60 RLS-Policies, created_by-FKs, SECURITY DEFINER Helper (4582513, Anti-Rekursion)
api/ (commonjs)         # hermes-concierge (503 ohne Key), stripe-*, pod-orders, merch-checkout
scripts/                # check:all-Kette + Hermes-Crons (Achtung: ESM (.mjs) vs CJS (.cjs/.js) beachten!)
  check_schema.mjs / audit_ui.mjs / check_seo.mjs / check_bundle_budget.cjs
  test_rls.js (13/0/1 live) / test_trust.js (34) / test_photo_safety.js / smoke_live.mjs (45 Checks)
  hermes_travel_seeder.js / hermes_daily_spots_generator.js / hermes_social_growth_engine.js / ...
.github/workflows/
  deploy.yml            # NUR Push → Deploy (kein Cron, SNT-404)
  hermes-automation.yml # ALLE 3 Crons: tägl. 06:00 UTC, Mo 04:00 + 08:00 UTC + manuell
```

### 3.2 Befehls-Matrix (immer in dieser Reihenfolge)
```bash
npm run check:all   # TYPECHECK + schema + ui + seo + photo + trust → MUSS 0 sein (61 Tests)
npm run build       # Vite-Build (~2,9 s), Chunk-Budget prüfen
npm run smoke       # 45 Live-Checks gegen Prod (ohne Playwright)
node scripts/test_rls.js   # nur mit SUPABASE_URL + SUPABASE_SERVICE_KEY sinnvoll (live 13/0/1)
```

### 3.3 Phasen-Plan (Spec → Verify → Ship pro Stufe)
| Stufe | Karten | SPEC (wahr danach) | VERIFY | SHIP |
|---|---|---|---|---|
| **0a Owner** | SNT-101, 332, 334, 108/109 | Keys tot, App live mit Auth, Fotos altern, Domain fix | Concierge ≠ deterministic; Login-Maske live; `in_delay` löst sich; Search Console grün | kein Code, nur Dashboards |
| **1 Chat-Kern** | SNT-341 ADR → 342 → 343 → 344 → 345 → 346 | Orts-Chat aus echten Meetups/Check-ins, Consent pro Ort, melde-/sperrbar | Migration läuft; Post nur mit Consent; Report/Block wirkt; Smoke grün | `feat(chat): SNT-34x …` je Karte |
| **2 Fundament** | SNT-210 (Foto-Reveal), SNT-220 (Recht prüfen) | Fotos monetarisierbar ohne Fiktion; Texte juristisch abgenommen | Reveal klickbar + TTL; Freigabe-Mail/Notiz in Docs | `feat(photo)`, `docs(legal)` |
| **3 Rest P1** | SNT-340 braucht kein Code (nur Ableitung prüfen) | keine Karteileiche | Grep: keine toten Verweise | Doku |
| **4 System** | SNT-411 Fonts 4→2 | Lighthouse-Font-Budget eingehalten | `check:bundle` + Lighthouse | `perf(fonts)` |
| **5 Verify** | T-006 | v1-Launch-fähig | `check:all` + Browser-Rundgang Login→Reload→Logout | `docs(kanban)` |

### 3.4 Vergangene Fallen (nicht wiederholen)
- Root-`type: module` + CJS in `api/`/`scripts/` → **immer passendes `package.json` (`commonjs`) prüfen.**
- `git add -A` in Cron-Workflows → **nie** (überschreibt fremde Änderungen, Fix 2026-09-30).
- Echte Zeilenumbrüche in JS-Strings (`hermes_seo_growth_engine.js`) → Syntax-Tod, lief nie wieder.
- `app.html` + `dist/` + `assets/`-Bundles gehören **nicht** ins Git (Build-Artefakte).
- Keine erfundenen Zahlen (Ratings, Uplifts, „60 %") — `[UNVERIFIED]` oder weglassen (SNT-403).

## 4. KANBAN-Snapshot (für Gemini: Ausgangslage, nicht zum Neu-Erfinden)

> Quelle der Wahrheit bleibt `docs/KANBAN.md`. Hier nur die Arbeitsmenge.

| Spalte | Inhalt (Stand 2026-10-08) |
|---|---|
| ✅ DONE | 77 Karten (alle Blocker-Code-Teile, Schema-RLS live, Community-Submit, POD-Flag, Give&Take, CI-Gates) |
| 🔴 TODO P0 | SNT-108/109 (Domain+SEO, 1,5 h), SNT-332/334 (Vercel-Env + pg_cron, 0,5 h) — **beide Owner** |
| 🟡 TODO P1 | SNT-210 (Foto-Reveal, 6 h), SNT-220 (Recht, 3 h Owner), **SNT-340…346 (Orts-Chat, 13 h — dein Hauptauftrag)** |
| 🟢 TODO P2 | Filtersortierung Host (2 h), Trust-/Safety (6 h), i18n DE/EN (6 h), Stadtseite (3 h), Foto-Moderation (3 h), Checklisten (3 h), Guide-Grab (2 h) + Fans (1 h) + Plausible (1 h) + SNT-411 Fonts (1 h) |
| ⚪ BACKLOG P3 | Magazin-Pipeline SNT-501…513 (~31 h + 5 h/Woche manuell), City-Brains ×12, A/B-Funnel |
| ⛔ BLOCKED | SNT-332/334 (Vercel-Env + Dashboard), SNT-363…365 (Printify-Keys), SNT-501+ (erst nach Phase 0–3) |
| 🗑️ WONTFIX | `app.html`, 36 Legacy-Engines (→ `legacy/`), `dist/`-Bundles, Duplikat-`assets/` |

**Offen gesamt:** 43 Karten · **~88 h + Community-Zeit** (4 h erste 5 Locals + 4 h Meetup #1 — kein Code-Ersatz).

## 5. TODOLIST-Sync (deine Abarbeitungsreihenfolge)

> Vollversion: `docs/TODOLIST.md`. Regel: **nur die oberste Liste ist diese Woche relevant.**

1. **Owner-Bloker (nicht du, nur anstoßen):** Keys widerrufen → Vercel-Env (`VITE_SUPABASE_*`) → Deploy → `pg_cron` → Domain.
2. **Dein Hauptauftrag:** SNT-341 ADR (30 min) → SNT-342 Migration (3 h) → SNT-343 UI (4 h) → SNT-344 Consent (3 h) → SNT-345 Safety (2 h) → SNT-346 Test (1 h).
3. **Danach:** SNT-210 Foto-Reveal (6 h) → SNT-411 Fonts (1 h) → T-006 Verify-Rundgang.
4. **Bewusst NICHT:** neue Städte, Merch-Ausbau, neue Social-Kanäle, KI-Skills, Zahlungsmodell, Rebranding, Podcast, 2. City Brain (→ TODOLIST „Parkiert").
5. **Gestrichen (nie machen):** KI-Post-Massen, Confidence-Scores ohne Daten, 10 Spots/Tag, Fake-Reviews, Fake-Scarcity (§5 UWG!), 5 Kanäle parallel.

## 6. Restliches (damit nichts liegen bleibt)

### 6.1 Sofort-Start (erste 60 Min in Antigravity)
1. `git status` + `git log --oneline -5` (Erwartung: `f6543d3`, clean).
2. `npm run check:all` (Erwartung: grün, 61 Tests) — wenn rot: **stoppen, erst reparieren.**
3. `.env` prüfen: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` gesetzt? (Wenn nein → Owner fragen, im Demo-Modus weiterarbeiten.)
## 7. Open-Task-Specs (alle noch offenen Karten, vollständig ausgearbeitet)

> Quelle der Wahrheit: `docs/KANBAN.md` (Stand 2026-10-06, ← `4b69f5c`).
> Jede Karte: SPEC → VERIFY → SHIP. PLANs/TASKS sind die Gedankengutspalte.
> **Keine neuen Zahlen ohne Daten** — `[UNVERIFIED]` anhängen, wenn ungeprüft.
> Ziel: in GitHub-Issues/ADRs umwandeln, nicht in Markdown-Karten.

### A. Owner-Blocker (Tag 1, nicht per Agent lösbar — nur koordinieren, dann Agent)

#### A.1 SNT-101 Rest — 6 alte Keys widerrufen + neue in Vercel
- **SPEC:** Kein alter Key (Zenmux, Requesty, Cerebras, Vercel-AI-Gateway, Cloudflare, Printful)
  darf noch bei seinen Providern leben. Danach: neue Keys + Vercel-Env.
- **VERIFY:** `POST /api/hermes-concierge` mit `{"prompt":"test"}` → `provider` ≠ `hermes_deterministic`
  (ist `ai_deterministic` oder 503, stimmt's noch), Login-Maske zeigt keine Keys.
- **SHIP:** Kein Code. Nur Kanban-Zeile (✅) + Status-Blocker in TODOLIST.

#### A.2 SNT-332 — Vercel-Env `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- **SPEC:** Beide Variablen im Vercel-Project-Env; Deploy neu; Login-Maske ohne Demo-Hinweis.
- **VERIFY:** `Login.tsx` lädt ohne `VITE_DEMO_MODE` Hinweis; `npm run smoke` Login-Check grün.
- **SHIP:** Kein Code. Nur Dashboard-Env + Deploy-Twig.

#### A.3 SNT-334 — `pg_cron` im Dashboard aktivieren
- **SPEC:** Extension aktiviert; tägliche Jobs laufen (z. B. `spot_daily_limit` und Foto-`visible`).
- **VERIFY:** `SELECT * FROM pg_cron.job;` > 0; Foto undurchsichtig → `visible` nach Trigger.
- **SHIP:** Kein Code. Nur Dashboard-Extension + Test-Zeile.

#### A.4 SNT-108/109 — Domain-Entscheidung (kaufen vs. Vercel-URL kanonisch)
- **SPEC:** Entscheidung fällt; danach `scratchntravel.com` (oder kanonisch) → Search Console mit
  Token `ad062dfe6cb025cf` bestätigen + Sitemap einreichen.
- **VERIFY:** `https://scratchntravel.com` (oder kanonisch) → HTTP 200, `<link rel="canonical">` stimmt.
- **SHIP:** DNS/Eintrag und Routing. Kein Coding.

### B. Orts-Chat (P1, 13h — Hauptauftrag für Gemini, alle abhängig von A.1…A.3 vorher)

#### B.1 SNT-340/341 — ADR "Orts-Chat" schreiben (2h, 👤 V → A)
- **SPEC:** Dokumentiert A/B/C-Entscheidung. Empfehlung: **B** (Orts-Chat, Kreis 5 km, keine
  Echtzeit-Präsenz, kein Tracking, keine Gruppen). Enthält Alternativenmatrix + Begründung.
- **VERIFY:** `docs/ADR_ORTSCHAT.md` liegt vor, Entscheidung klar, Auswirkung auf SNT-342+ nachweisbar.
- **SHIP:** docs/ADR_ORTSCHAT.md + Git + Kanban-Zeile.

#### B.2 SNT-342 — additive Migration `place_channels`, `chat_posts`, `chat_consent` (3h)
- **SPEC:** Keine existierende Tabelle berührt! `place_channels(id uuid pk, place_id uuid,
  created_by uuid, valid_until timestamptz, created_at)`; `chat_posts(id, channel_id, author_id,
  body, trust_level int, created_at)`; `chat_consent(id, place_id, user_id, allowed bool,
  granted_at, revoked_at)`.
- **VERIFY:** `npm run check:schema` grün; `test_rls.js` = 13/0/1 unverändert; kein `ALTER TABLE`.
- **SHIP:** `supabase/migrations/*_001_place_channels.sql` + PR + Commit.

#### B.3 SNT-343 — Geo-RPC `SECURITY DEFINER` vergibt kurzlebiges Kanal-Token (2h)
- **SPEC:** `register_channel(place_id, user_id) → token text` (uuidv4), `valid_until = now() + '15 min'`,
  nur für authentifizierte Nutzer, `place_id` gehört zu Nutzer-Stadt.
- **VERIFY:** SQL-Tests: Token läuft ab; ohne Token: INSERT → 0 Zeilen; anderes Place: kein Token.
- **SHIP:** Migrationsdatei + PR.

#### B.4 SNT-344 — RLS: öffentlich lesen, Schreiben nur mit Token, Antwortende brauchen Trust (2h)
- **SPEC:** `chat_posts`: SELECT public; INSERT validiert Token + Consent; UPDATE/DELETE nur Autor
  oder Trust ≥ 2.
- **VERIFY:** `test_rls.js` → 14/0/1 (eine neue Assertion je Fall); `npm run check:all` grün.
- **SHIP:** Migration + Test-Erweiterung + PR.

#### B.5 SNT-345 — Missbrauchstests (Radius, Rate-Limit, Block, Report) (2h)
- **SPEC:** 4 Szenarien: (1) Post außerhalb 5 km blockiert, (2) 5 Kontakte/Tag, (3) Blind-Report
  löst Queue aus, (4) Sperrung verhindert Weiterleiten.
- **VERIFY:** Alle 4 grün als eigene `test_rls.js`-Sektion + `README` dokumentiert.
- **SHIP:** docs + PR.

#### B.6 SNT-346 — UI nach Muster `Chat.tsx` (TrustBadge, ReportDialog, Consent-Info) (4h)
- **SPEC:** Chat-Header, TrustBadge, ReportDialog, Consent-Info; **kein** Gruppen-Chat,
  **keine** Echtzeit-Präsenz, **keine** Entfernungsanzeige.
- **VERIFY:** UI-Audit grün + `npm run check:all` + `smoke` Login → Chat → Logout.
- **SHIP:** `feat(chat): SNT-346 UI-Orts-Chat` + PR.

#### D.1 SNT-307 — 3-Bestätigungen-Schwelle (2h)
- **SPEC:** Ein Spot zählt als `verified` nach 3 unabhängigen, nicht-creator-Voten aus derselben Stadt.
- **VERIFY:** 2 Stimmen → `verified = false`; 3. → `true`; Creator kann nicht für sich stimmen.
- **SHIP:** Migrations-DML (Spalte `verified` unter `spot_verifications`) + PR.

#### D.2 SNT-308 — Anti-Spoofing (1 Stimme/User, kein Creator-Votum) (1h)
- **SPEC:** Jeder Nutzer max. 1 Stimme pro Spot; Creator (certified_stops) kann nicht schon abgeben.
- **VERIFY:** Test-Skript: 2 Accounts → 1 Stimme pro Spot; Creator-Vote wird ignoriert.
- **SHIP:** SQL Constraint + Test + PR.

#### D.3 SNT-309 — `follows` + `messages` + `message_reports` (4h)
- **SPEC:** Follows (User↔User), Nachrichten (Text, optional Bild via SNT-330), Reports (User→Admin).
- **VERIFY:** Test-Skript: Follow, Post, Report → 300/201; Report markiert Konversation.
- **SHIP:** Migrationsdatei + PR.

#### D.4 SNT-310 — Kontext-basierte Kontaktaufnahme (2h)
- **SPEC:** Kontakt wird nur auf Basis von geteilten Referenzen (Stadt, Spot, Veranstaltung) angezeigt —
  kein globales "Neue Nachrichten" für alle.
- **VERIFY:** Keine globalen Listen; nur kontextgeneigte Kontakte sichtbar.
- **SHIP:** UI + RLS + PR.

#### D.5 SNT-311 — Rate-Limits 5 Kontakte/Tag, 20 Msg/Stunde (1h)
- **SPEC:** Geschwindigkeitskontrolle auf Ebene von `messages`; Limit wird im UI sichtbar gemeldet.
- **VERIFY:** `test_rls.js` + eigene Rate-Limit-Tests: 21. Msg → 429; nächste Stunde → wieder OK.
- **SHIP:** Policy/Trigger + PR.

#### D.6 SNT-312 — Block/Report in jeder Konversation (1,5h)
- **SPEC:** Sperrung blockiert Posts, Follows, Messages; Report erzeugt Admin-Mail (URL).
- **VERIFY:** Block-Admin-Monitor: Post/Vote/Kontakt nach Block → 403; Report-Log gepflegt.
- **SHIP:** Migration + PR.

#### D.7 SNT-313 — Moderations-Queue (Link-/Spam-Filter) (2h)
- **SPEC:** Reports und verdächtige Links landen in einer Moderations-Queue; kein automatisches

### 8. Gemini-Tag-Runbook (operative Anleitung für Tag 1–5)

#### Tag 1 — Owner-Blocker abbauen, ADR ableiben
- 08:00 `git status` + `git log --oneline -5` (Erwartung: `4b69f5c`, clean) + `npm run check:all` (muss grün sein).
- 08:30 Owner-Fragen an den Owner (6 Punkte, Abschnitt 6.3) — nur die klarsten beantworten.
- 10:00 SNT-341 ADR-002 schreiben (`docs/ADR_ORTSCHAT.md`) — Entscheidung B + Begründung.
- 12:00 Owner-Debatte ADR; danach SNT-340/341 als ✅ + Kanban/Zoom-Update.
- 13:00 Owner-Blocker eigenständig anpacken (Keys, Vercel-Env, pg_cron, Domain) oder exakt beantragen.
- 16:00 Tag-Briefing (10 min Schriftlich): was ist geklärt, was bleibt Owner, wer macht was morgen.

#### Tag 2 — Orts-Chat-Migration + UI (abhängig von Tag-1-Handler)
- 09:00 SNT-342 Additive Migration `place_channels` + `chat_posts` + `chat_consent`.
- 12:00 SNT-343 Geo-RPC `SECURITY DEFINER` (Kanal-Token, 15 min Gültigkeit).
- 14:00 SNT-344 RLS-Policies + Erweiterung `test_rls.js` → Ziel 14/0/1.
- 16:00 SNT-345 Missbrauchstests Radius/Rate-Limit/Block/Report → alle grün.
- 17:00 SNT-346 UI `TrustBadge`, `ReportDialog`, Consent-Info (ohne Gruppen-/Presence-Funktionen).
- 18:00 `npm run check:all` + `smoke` + PR (kein Merge bis Owner Chesse).

#### Tag 3 — Verifikation + Merge + nächste Runde
- 09:00 `check:all` + `npm run build` + `npm run smoke`.
- 10:00 PR-Reviews (nur autorisierte Menschen/owner) + Merge.
- 11:00 Kanban-Karte rechts + TODOLIST `- [x]` + Commit-Spinne.
- 12:00 Tag-Briefing schreiben (Fiktions-Nachweis, Verify-Zahlen).
- 12:00 Kein Code mehr nach 13:00, außer als "lede"-Fix.

#### Tag 4–5 — Community-Kern P2 (SNT-307…313) nach ERFULLUNG von SNT-344/345/346
- 09:00 SNT-307/308 (Bestätigungsschwelle + Anti-Spoofing) — sql-first.
- 12:00 SNT-309/310 (follows/messages + kontextbezogene Kontakte).
- 14:00 SNT-311/312/313 (Rate-Limits, Block/Report, Moderations-Queue).
- 16:00 Tag-Briefing + PR-Nächste-Vorlage.

### 9. Gemini-Cheat-Sheet (Entwicklungen, Commands, häufige Fehler)

#### 9.1 Befehlsreihenfolge (überall, bei jedem Commit)
```bash
git status        # nie blind committen
npm run check:all # MUST grün (61 Tests) → sonst kein Commit
npm run build     # Vite-Build (≈2,9 s)
npm run smoke     # Live-Checks (45)
node scripts/test_rls.js   # nur mit SUPABASE_URL + SERVICE_KEY; Ziel 13/0/1, später 14/1
supabase status   # oder clis: acht auf migrations, pg_cron
```

#### 9.2 Wichtige Dateien (je nach Task)
| Bereich | Datei |
|---|---|
| Räumliche Kind-Teile | `src/lib/features.ts`, `src/context/AuthContext.tsx` |
| Community-Submit | `src/lib/community.ts`, `src/pages/Explore.tsx` |
| RLS-Policies | `supabase/schema.sql` (60 Policies) |
| Migrationen | `supabase/migrations/*_<nummer>_<kurz>.sql` |
| CI/Gates | `.github/workflows/deploy.yml`, `hermes-automation.yml` |
| Makros | `scripts/check_schema.mjs`, `scripts/audit_ui.mjs`, `scripts/test_rls.js` |
| Env | `.env.example`, Vercel Dashboard Env |

#### 9.3 Häufige Fehler (Nicht-Wiederholen)
- Root-`type: module` + CommonJS in `api/`/`scripts/` → `package.json` prüfen.
- `git add -A` in Cron-Workflows → **nie** (überschreibt fremde Änderungen).
- Echte Zeilenumbrüche in JS-Strings → Syntax-Tod; `.mjs`/`.cjs` prüfen.
- `dist/`/`app.html` ins Git → Build-Artefakte, ignoriert.
- Lines mit `UNVERIFIED`, `[UNVERIFIED]` etc.

#### 9.4 Verhaltensregeln für Gemini
1. **NIE** erfundene Zahlen (Ratings, Counts, "60 %") ohne Daten; `[UNVERIFIED]` anhängen.
2. **EINE** Stadt mit echter Community wirken (Lisbon), vor 12 leeren.
3. **KEIN** Code für `VITE_POD_ENABLED`**(POD-Merch ist gesperrt)** — nur Env + Deploy.
4. **CHECK-ALL** als Nachschiebefehler: `check:all` grün **nach** jeder Änderung.
5. **KANN NICHT** Beschwerden/Chats ohne Trennung (B-Lösung) oder ohne Consent.

### 10. Anlagen (Ergänzt)
* `KANBAN.md` (77 ✅ / 43 offen)
* `TODOLIST.md` (Woche + Parkiert + Falsche Todos)
* `IMPLEMENTATION_PLAN.md` (T-001…T-403 + Anhang A–C)
* `PROJEKT_AUDIT_2026-09-25.md` · `.env.example` (Platzhalter only)
* **Neu:** `docs/WORKPLAN_2026-10-08.md` — vollständig ausgearbeitete Open-Tasks (SPEC/VERIFY/SHIP)
* **Neu:** `docs/UEBERGABE_AN_ANTIGRAVITY_2026-10-08.md` — Stand `4b69f5c` + Open-Task-Specs + Tag-Runbook

  Löschen ohne menschliches Review (soweit möglich).
- **VERIFY:** Queue wächst bei 3 Reports; Admin kann "review" → Post bleibt sichtbar.
- **SHIP:** Queue-Tabelle + UI + PR.

### E. Bewusst geparkt / abhängig von Owner-Entscheidungen
- SNT-363/364/365/366/367 — Merch-POD (Printify-Keys, IDs, Musterbestellung, Stripe, Versand) — **blocked** bis Owner entscheidet.
- SNT-375 — Aktivitäts-Freemium (wer aktiv gibt, bekommt Pro frei) — nach SNT-374.
- SNT-411 — Fonts 4→2 — **blockiert durch Design-Entscheidung** (Caveat/Nunito/Fraunces tragen die Marke).


### C. Fundament (P1)

#### C.1 SNT-220 — Rechtstexte juristisch prüfen lassen (2h, 👤 V)
- **SPEC:** Impressum/Datenschutz/AGB/Safety werden von einem Anwalt auf § 5 DDG, § 18 MStV,
  VSBG geprüft; ggf. Textänderung im Rücksprache-Fluss.
- **VERIFY:** Rechtstexte 200 + Inhalt + Rechtsbericht als Dokument im `docs/`.
- **SHIP:** docs/ + PR.

#### C.2 SNT-210 — Supabase-Env in GitHub Secrets + Vercel (20 min, 👤 V)
- **SPEC:** Nur bei CI-Bedarf in GitHub Secrets; Vercel-Env via A.2. Lokal `.env` bleibt.
- **VERIFY:** `npm run check:all` unverändert; kein Secret im Repository.
- **SHIP:** Dashboard-Secrets + PR-Doku.

### D. Community-Kern P2 (in Abhängigkeit von B/C) — restliche 12h

4. SNT-341 ADR schreiben (`docs/ADR/ADR-002-orts-chat-praesenz.md`, Entscheidung A/B/C + Begründung).
5. Erst danach Code (SNT-342 Migration als `supabase/migrations/*_place_channels.sql`).

### 6.2 Datei-Anlage-Checkliste (Gemini: nach jedem Schritt abhaken)
- [ ] KANBAN-Karte nach rechts + ✅-Zeile mit Datum/Commit ergänzt
- [ ] TODOLIST-Checkbox gesetzt (`- [x]`)
- [ ] `npm run check:all` grün **nach** der Änderung (nicht nur davor)
- [ ] Commit `type(scope): SNT-XXX …` + Push
- [ ] Bei Schema-Änderung: `supabase/schema.sql` **und** Migrationsdatei konsistent

### 6.3 Offene Fragen an den Owner (gesammelt, einmal fragen)
- Vercel-Env (`VITE_SUPABASE_*`) eingetragen? (SNT-332)
- `pg_cron` aktiviert? (SNT-334)
- Domain: kaufen oder Vercel-URL kanonisch? (SNT-108)
- Rechtstexte-Prüfung beauftragt? (SNT-220)
- Printify-Keys vorhanden oder POD weiter geparkt? (SNT-363)
- Präsenz-Modell A/B/C für Orts-Chat? (SNT-341 — Vorschlag: B)

### 6.4 Kill-Kriterien (Anhang C, monatlich prüfen)
Weniger als 50 % „würde wiederkommen" nach Meetup #1 → stoppen. Nach 90 Tagen:
< 40 aktive Locals **oder** D30 < 10 % → stoppen. Mehrheit Bot-Accounts → Automation stoppen.
**Ein Kill-Kriterium ist Information, kein Scheitern.**

### 6.5 Erste Antwort, die Gemini liefern soll
```text
Verstanden: Stand f6543d3, check:all [grün/rot + Befund], .env [vollständig/fehlt X].
Blocker an Owner: [Liste]. Ich starte mit SNT-341 (ADR-002) und liefere SPEC → VERIFY → SHIP.
```

---

*Anlagen: `KANBAN.md` (77 ✅ / 43 offen) · `TODOLIST.md` (Woche + Parkiert + Falsche Todos) ·*
*`IMPLEMENTATION_PLAN.md` (T-001…T-403 + Anhang A–C) · `PROJEKT_AUDIT_2026-09-25.md` · `.env.example` (Platzhalter only)*


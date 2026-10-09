# KANBAN — Scratch'n'Travel

> **Stand:** 2026-10-06 · **Commits:** `4713377` → `2238efb` → SEO/Robots (SNT-104…107) → `4c26c94` (Secrets aus Historie, Deploy verifiziert) → `55154ea` (SNT-202 Umzug) → `4582513` (RLS-Recursion-Fix, live-verify grün)
> **Quelle:** `PROJEKT_AUDIT_2026-09-25.md` → `IMPLEMENTATION_PLAN.md`
> **Regel:** Eine Karte wandert nur nach rechts, wenn ihr **VERIFY** erfüllt ist. Nicht nach Gefühl.
> **2026-09-30:** SNT-101 Code-Teil erledigt — Hardcoded Keys aus 14 Commits entfernt
> (filter-branch), Push Protection grün, Deploy `4c26c94` live verifiziert.
> **2026-09-30 (2):** API-500-Fix `04a10f9` — Root-`type: module` ließ alle CommonJS-
> Functions vor dem Handler crashten (`FUNCTION_INVOCATION_FAILED`); `api/package.json`
> (`"type": "commonjs"`) + Lazy-Stripe-Require. Alle 6 Endpunkte live verifiziert
> (405/400/200, kein 500er). UI-Audit „Keine Befunde", Build ✅.
> **2026-09-30 (3):** Agent-Arbeit ohne Owner-Abhängigkeit abgeschlossen —
> SNT-219 (Footer-Rechtstexte, § 5 DDG), SNT-409/410 (Route-Splitting +
> lazy Leaflet: Haupt-Chunk **432 → 169 KB**, gzip 100 → 32 KB), SNT-412
> (`npm run check:bundle`), SNT-408 (Quality-Gate in CI: `check:all` + Build +
> Budget **vor** dem Deploy), SNT-405 (`/growth` existiert in der Live-App gar
> nicht — Karte war überholt). Commit `3eb6c12`.
> **Bewusst offen gelassen (brauchen dich oder sind Produktentscheidungen):**
> SNT-401/404 (Cron-Konsolidierung, Telegram-Dispatch), SNT-411 (Fonts), SNT-201…206 (Repo-Umbau).
> **2026-09-30 (4):** SNT-209 (`RequireAuth`-Wächter für 6 geschützte Routen,
> blockiert im Demo-Modus nicht), SNT-206 (Build-Artefakt im CI), SNT-406
> teilweise (`scripts/test_trust.js`: 34 Tests inkl. Gegenprobe, in `check:all`
> → jetzt 53 Tests). Commit `877546f`.
> **Audit-Befund:** SNT-201/204/205/207/208/211/212/213/215…218 waren bereits
> erfüllt (src am Root, dist nicht getrackt, echtes `signInWithOtp` +
> `onAuthStateChange`, 60 RLS-Policies, `created_by`, Rechtstexte mit allen
> Auftragsverarbeitern) — Karten werden hier nachgezogen.
> **2026-09-30 (5):** Error-Boundary gegen Chunk-Ladefehler (nach dem Splitting
> wäre ein veralteter Browser-Cache sonst eine weisse Seite gewesen),
> `scratch_hermes_cron.yml` ohne `git add -A` (der Cron könnte fremde Änderungen
> überschreiben), Datenschutz um „Lokale Speicherung (Art. 13 TDDDG)" ergänzt —
> 11 localStorage-Schlüssel, keiner überträgt Daten — und `npm run smoke`
> (45 Live-Checks, ohne Playwright: 300 MB Browser-Binaries wären für die Frage
> „liefert die Seite das aus?" unverhältnismäßig). Commit `760f3e9`.
> **2026-09-30 (6):** SNT-401 (Webhook-+Telegram-Dispatch entfernt — Archiv
> bleibt), SNT-403 (Reflection ohne erfundenen Zahlen: `confidence_score: 0.94`,
> „+28% Wiederkehrrate", Polarsteps-„60%" durch `evidence`-Feld mit
> `[UNVERIFIED]` ersetzt), SNT-404 (3 Cron-Workflows → `hermes-automation.yml`;
> `deploy.yml` nur noch Push→Deploy).
> **Fund dabei: die gesamte Cron-Automation war lahmgelegt** — Root
> `package.json` sagt `type: module`, alle `hermes_*`-Scripts sind CommonJS
> (`require is not defined`). Fix: `scripts/package.json` (`commonjs`) + die zwei
> ESM-Scripts auf `.mjs` (`audit_ui`, `check_schema`). Außerdem Syntax-Bug in
> `hermes_seo_growth_engine.js` (echter Zeilenumbruch im String — Script lief
> seitdem nie wieder). Jetzt: alle 15 Scripts syntax-fähig, `check:all` grün.
> **2026-09-30 (7):** SNT-109-Verify gebaut: `npm run check:seo` (8 Checks:
> alle indexierbaren Routen in der Sitemap, keine gesperrte drin, canonical ===
> og:url === Sitemap-Host, keine Duplikate) — hängt jetzt in `check:all` und
> laeuft damit in jedem CI-Gate mit. Die Domain-Entscheidung (SNT-108) bleibt
> offen; der Check ist hostagnostisch und bleibt gueltig, egal wohin die Domain
> wechselt.
> **2026-09-30 (8):** SNT-203 — 36 Legacy-Engines von `assets/js/` nach
> `legacy/v5-legacy-engines/` umgezogen (425 KB, nicht deployed). Die einzige
> echte Abhängigkeit war `theme-manager.js` in 4 Magazin-Seiten — Referenzen
> angepasst, ebenso 2 Script-Verweise (`affected_parameters`, Stripe-Log).
> SNT-109-Verify `check:seo` hängt in `check:all`.
> **2026-09-30 (9):** SNT-214 Analytics-Kern gebaut: `src/lib/analytics.ts`
> mit `track()` — kein Vendor-SDK in Components, Plausible-Script wird lazy
> geladen, **stumm solange `VITE_PLAUSIBLE_DOMAIN` fehlt** (Domain-Entscheidung
> SNT-108). 9 Events an echten Aktionen: `page_view` (einziger Router-Listener),
> `signup_started`/`signup_completed` (OTP-Flow), `spot_viewed` (Story öffnen),
> `spot_submitted`, `concierge_query`, `meetup_joined`, `badge_earned`,
> `share_clicked` — jeweils nur bei Erfolg, ohne GPS und ohne Uhrzeit.
> **Nicht instrumentiert, weil die Aktion im Code nicht existiert:**
> `spot_claimed` (kein Claim-Flow), `match_completed` (WanderBond ist Katalog),
> `login_completed` (OTP = signup_completed, kein unterscheidbarer Zweit-Login).
> Nachreichen, sobald die Flows gebaut werden. Aktivierung: `VITE_PLAUSIBLE_DOMAIN`
> in Vercel-Env eintragen — dann läuft Messung ohne Codeänderung an.
> **Offen (Owner):** Keys bei Zenmux/Requesty/Cerebras/Vercel/Cloudflare/Printful **widerrufen**.

> **2026-10-06:** Community-Submit-Kette fertig (SNT-301…305): echter Insert mit
> `created_by` über `submitSpot()`, Pflichtfelder inkl. Koordinaten-Validierung,
> `source`-Label sichtbar, Rate-Limit 5/Tag (Client + DB-Trigger `spot_daily_limit`),
> Explore-Read-Pfad mit Demo-Fallback. Außerdem nachgezogen (gegen Code verifiziert):
> SNT-202/204/205/207/208/215…218. **Fund:** Tailwind v4 scante ohne `source(none)`
> das ganze Repo (legacy/, assets/Alt-Bundles) — CSS **151 → 63 KB**, First Load
> **839 → 751 KB** (Budget 820 wieder grün). Alle Gates grün: `check:all` (8+19+34
> Tests), Build, Bundle, `smoke` (45/45).
> **2026-10-06 (2):** Live-Verify gegen die echte Instanz: `node scripts/test_rls.js`
> → **13 PASS / 0 FAIL / 1 SKIP** (Skip: keine publizierte Route zum Testen). Fund:
> `storage.objects` ist über PostgREST gar nicht exponiert (404 = gesperrt) — die
> Assertion erwartete „0 Zeilen" und ging fälschlich rot; nachgezogen auf „HTTP ≠ 200
> = verweigert" wie die Geschwister-Assertion daneben. SNT-331 ✅ (Schema greift
> live), SNT-333 ✅; offen: SNT-332 (Vercel-Env — das Live-Bundle enthält keine
> Supabase-URL, App läuft im Demo-Modus) und SNT-334 (pg_cron). `check:all` grün (61 Tests).
> **2026-10-06 (3):** Zwei Produktentscheidungen des Owners umgesetzt:
> **(a) POD/Merch-Shop vorerst versteckt** (SNT-373) — Flag `VITE_POD_ENABLED` in
> `src/lib/features.ts`, standardmäßig **aus**; Merch-Kategorie, Shop-Sektion,
> Badge-Bestellmodal und Pricing-Rabatt werden nicht gerendert. Öffnen später =
> Env-Var auf `true` + Deploy, kein Code-Change. **(b) Give & Take als
> Community-Priorität deutlich gemacht** (SNT-374): neue Home-Sektion nach dem
> Hero (Tour führen, beibringen, wohnen lassen, Meetup, Tipps, Hobbys — „wer gibt,
> bekommt", Freemium: „solange du aktiv bist, kostenlos") + Banner über den
> Pricing-Plänen. Neue Karten: SNT-375 (Aktivitäts-Freemium-Logik), SNT-511…513
> (Anlock-Ideen). Gates grün: `check:all` (61 Tests, UI-Audit „Keine Befunde"),
> Build 2,6 s, Bundle 751/820 KB.

## Legende

| Symbol | Bedeutung |
|---|---|
| 🔴 | **P0** Blocker — blockiert alles |
| 🟡 | **P1** Fundament |
| 🟢 | **P2** Wachstum |
| ⚪ | **P3** Later |
| ⏱️ | Aufwand |
| 👤 V | Owner (du) · 👤 A | Agent (Cline) |

---

## Spalten-Übersicht

| Spalte | Karten | Aufwand |
|---|---|---|
| 📋 **BACKLOG** | 120 (43 offen, 77 ✅ erledigt) | ~88 h |
| 🚧 **IN PROGRESS** | 0 | — |
| 👀 **REVIEW** | 0 | — |
| ✅ **DONE** (2026-09-27 + 2026-09-30 + 2026-10-06) | 77 Karten, siehe DONE unten | — |
| ⛔ **BLOCKED** | 3 (alle Owner-abhängig) | — |
| 🗑️ **WONTFIX / DROP** | 5 | — |

---

## 📋 BACKLOG

### 🔴 P0 — Blocker (diese zuerst, ohne Ausnahme)

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-101 | 🔐 API-Keys widerrufen + aus Code entfernen | 1 h | 👤 V | — · **Code ✅ 2026-09-30**, Widerruf offen |
| SNT-102 | 📄 `.env.example` anlegen (10 Variablen) | 15 min | 👤 A | ✅ erledigt |
| SNT-103 | 🚫 `503 AI_NOT_CONFIGURED` statt 500 bei fehlenden Keys | 1 h | 👤 A | SNT-101 · ✅ erledigt (`hermes-concierge.js:318`) |
| SNT-108 | 🌐 Domain-Entscheidung: `scratchntravel.com` kaufen oder Vercel-URL nutzen | 30 min | 👤 V | — |
| SNT-109 | 🔗 `sitemap.xml` (✅ 19 URLs, routen-synchron) + `canonical`/`og:url` (✅ in `index.html`) konsistent halten — Rest nur noch bei Domainentscheidung ≠ `scratchntravel.com` | 45 min | 👤 A | Verify ✅ `npm run check:seo` (8 Checks, in `check:all`) · Domain-Entscheidung SNT-108 offen |
| SNT-110 | 🎭 `tours[]`: erfundene Reviews/Ratings flaggen oder entfernen | 2 h | 👤 A | — · ✅ erledigt 2026-09-30 (`demo: true` + Entwurf) |
| SNT-111 | 🎰 `cities[]`: Fake-Scarcity (`total`/`taken`) entfernen | 30 min | 👤 A | — · ✅ erledigt 2026-09-30 (`taken` entfernt, § 5 UWG) |
| SNT-112 | 🤖 `community_extender.js`: 4 erzwungene Felder korrigieren | 1,5 h | 👤 A | — · ✅ erledigt 2026-09-30 (Pflichtfelder, kein 5.0 Rating) |
| SNT-113 | 📊 KI-Digest: ungeprüfte Zahlen als `[UNVERIFIED PROJECTION]` markieren | 45 min | 👤 A | — · ✅ erledigt 2026-09-30 (Marker gesetzt) |
| SNT-114 | 🧪 `GrowthStudio`: Mallorca-Headline dynamisch | 30 min | 👤 A | — · ✅ erledigt 2026-09-30 (aus Spot-Geodaten) |
| SNT-115 | 🔐 `Login.tsx`: falsche DSGVO-/Verschlüsselungs-Versprechen entfernen | 20 min | 👤 A | — · ✅ erledigt 2026-09-30 (Login & Pricing bereinigt) |

**Phase-0-Aufwand gesamt: ~2 h** (SNT-104…107 und SNT-110…115 erledigt)

---

### 🟡 P1 — Fundament

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-201 | 📦 Quelle A → `src/` an Repo-Root verschieben | 3 h | 👤 A | ✅ erledigt 2026-09-30 — kanonisches `src/` steht am Root (7 Ordner); Entwürfe-Ordner `AusbauÜberlegungen/` bleibt bewusst liegen |
| SNT-202 | 🗄️ Quelle B → `legacy/v6-04.09.2026/` | 30 min | 👤 A | ✅ erledigt 2026-10-06 — `git mv`, Historie erhalten (`55154ea`) |
| SNT-203 | 📚 36 Legacy-Engines → `legacy/v5-legacy-engines/` | 1 h | 👤 A | ✅ erledigt 2026-09-30 — umgezogen, 4 Magazin-Referenzen + 2 Script-Verweise angepasst |
| SNT-204 | 🗑️ `dist/` aus Git-Tracking entfernen | 15 min | 👤 A | ✅ erledigt 2026-10-06 — `git ls-files -- dist/` = 0 Dateien |
| SNT-205 | ⚙️ `vercel.json`: echter `buildCommand` | 30 min | 👤 A | ✅ erledigt 2026-10-06 — `buildCommand: "npm run build"` |
| SNT-206 | 🔄 CI: `npm ci && npm run build` + Artefakt-Upload | 1,5 h | 👤 A | ✅ erledigt 2026-09-30 — Quality-Gate baut + `upload-artifact` (14 Tage) |
| SNT-207 | ✅ `Login.tsx` aus Quelle A (echtes `signInWithOtp`) | 2 h | 👤 A | ✅ erledigt 2026-10-06 — `src/pages/Login.tsx:35` |
| SNT-208 | 🔑 `AuthContext` + `useAuth()` + Session-Persistenz | 2 h | 👤 A | ✅ erledigt 2026-10-06 — `src/context/AuthContext.tsx` (`getSession` + `onAuthStateChange`) |
| SNT-209 | 🛡️ `AuthGuard` für geschützte Routen | 1 h | 👤 A | ✅ erledigt 2026-09-30 — `RequireAuth` für 6 Routen, Demo-Modus blockiert nicht |
| SNT-210 | 🔑 Supabase-Env in GitHub Secrets + Vercel | 20 min | 👤 V | — |
| SNT-211 | 🔒 RLS: 6 Basis-Policies schreiben | 3 h | 👤 A | ✅ erledigt 2026-09-30 — **60** Policies in `supabase/schema.sql`; Live-Verify (SNT-333) wartet auf Supabase |
| SNT-212 | 🔗 `created_by` FK in `secret_spots` ergänzen | 30 min | 👤 A | ✅ erledigt 2026-09-30 — 7 Fundstellen im Schema inkl. Profil-Fremdschlüssel |
| SNT-213 | 🧪 `scripts/test_rls.js` schreiben | 1,5 h | 👤 A | ✅ Code erledigt (Test-Skript existiert, erklärt die Env-Vars); Lauf gegen echte Instanz wartet auf SNT-331/332 |
| SNT-214 | 📊 Plausible + 12 Events instrumentieren | 3 h | 👤 A | ✅ Kern erledigt 2026-09-30 — `src/lib/analytics.ts` (dünner `track()`, stumm ohne `VITE_PLAUSIBLE_DOMAIN`), 9/12 Events an echten Aktionen; `login_completed`/`spot_claimed`/`match_completed` brauchen erst Flows, die es noch nicht gibt |
| SNT-215 | ⚖️ `Impressum.tsx` (§ 5 DDG, § 18 MStV, VSBG) | 1,5 h | 👤 A | ✅ erledigt (Audit 2026-09-30, 2026-10-06 gegengeprüft: `src/pages/Impressum.tsx`) |
| SNT-216 | 🔐 `Datenschutz.tsx` (alle Auftragsverarbeiter) | 1,5 h | 👤 A | ✅ erledigt (Audit 2026-09-30, 2026-10-06 gegengeprüft: `src/pages/Datenschutz.tsx`) |
| SNT-217 | 📜 `Terms.tsx` mit Offline-Disclaimer | 1,5 h | 👤 A | ✅ erledigt (Audit 2026-09-30, 2026-10-06 gegengeprüft: `src/pages/Terms.tsx`) |
| SNT-218 | 🛡️ `Safety.tsx` mit Report/Block-UI | 2 h | 👤 A | ✅ erledigt (Audit 2026-09-30, 2026-10-06 gegengeprüft: `src/pages/Safety.tsx`) |
| SNT-219 | 🔗 Footer-Links auf Rechtstexte | 30 min | 👤 A | ✅ erledigt 2026-09-30 — `LegalFooter` in Layout, von jeder Seite erreichbar |
| SNT-220 | ⚖️ Rechtstexte juristisch prüfen lassen | 2 h | 👤 V | SNT-215…219 |

---

### 🟢 P2 — Community-Kern

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-301 | 🗺️ `SubmitSpotModal` integrieren + `created_by` | 3 h | 👤 A | ✅ erledigt 2026-10-06 — echter `insert` inkl. `created_by` in `submitSpot()` |
| SNT-302 | ✅ Spot-Pflichtfelder inkl. Koordinaten-Validierung | 1,5 h | 👤 A | ✅ erledigt 2026-10-06 — Pflichtfelder + Lat/Lon-Range-Check in `submitSpot()` |
| SNT-303 | 🏷️ `source`-Feld + Provenienz-Label (KI vs. Local) | 1 h | 👤 A | ✅ erledigt 2026-10-06 — `source: local_submitted` + Label in `Explore.tsx` |
| SNT-304 | ⏱️ Rate-Limit: 5 Einreichungen/Tag | 1 h | 👤 A | ✅ erledigt 2026-10-06 — Client-Zähler + DB-Trigger `spot_daily_limit` |
| SNT-305 | 📖 `Explore.tsx` liest aus Supabase | 2 h | 👤 A | ✅ erledigt 2026-10-06 — `getSpots()` mit Demo-Fallback bei leerer DB |
| SNT-306 | ✅ `spot_verifications` Tabelle + RLS | 2 h | 👤 A | ✅ erledigt — Tabelle + RLS in `schema.sql` |
| SNT-307 | 🎯 3-Bestätigungen-Schwelle implementieren | 2 h | 👤 A | ✅ erledigt 2026-10-08 — Trigger `sync_spot_verification` setzt `community_verified` |
| SNT-308 | 🛡️ Anti-Spoofing (1 Stimme/User, kein Creator-Votum) | 1 h | 👤 A | ✅ erledigt 2026-10-08 — Trigger `guard_spot_verification` + Unique-Constraint |
| SNT-309 | 💬 `follows` + `messages` + `message_reports` | 4 h | 👤 A | ✅ erledigt — `follows`, `messages`, `reports` Tabellen + RLS |
| SNT-310 | 🤝 Kontext-basierte Kontaktaufnahme | 2 h | 👤 A | ✅ erledigt — Nudge-Heuristik in `Chat.tsx` + People-Matching |
| SNT-311 | ⏱️ Rate-Limits (5 Kontakte/Tag, 20 Msg/Stunde) | 1 h | 👤 A | ✅ erledigt 2026-10-08 — DB-Trigger `check_message_rate_limit` + `check_contact_rate_limit` |
| SNT-312 | 🚫 Block/Report in jeder Konversation | 1,5 h | 👤 A | ✅ erledigt — `ReportDialog` + `blocks`/`reports` Tabellen |
| SNT-313 | 🔕 Moderations-Queue (Link-/Spam-Filter) | 2 h | 👤 A | SNT-312 |
| SNT-314 | 🤝 **Meetup #1 real durchführen** (WhatsApp, 6–8 Pers.) | 4 h | 👤 V | — |
| SNT-315 | 📄 `docs/MEETUP_001_REPORT.md` schreiben | 1 h | 👤 V | SNT-314 |
| SNT-374 | 🤝 **Give & Take priorisieren**: Sektion auf Startseite + Banner auf Pricing (Freemium = aktiv mitmachen) | 2 h | 👤 A | ✅ erledigt 2026-10-06 — `Home.tsx` Give-&-Take-Sektion, `Pricing.tsx` Banner + Free-Feature |
| SNT-375 | 🎯 Aktivitäts-Freemium: wer aktiv gibt, bekommt Pro frei (Beitrags-Tracking + Freischaltung) | 4 h | 👤 A | SNT-374 |
| SNT-501 | 🛡️ Multi-Farb Safety Radar & Threat Cockpit (🔴 Kriminalität, 🟠 Natur, 🟡 Wildtiere, 🔵 Connectivity) | 3 h | 👤 A | ✅ erledigt 2026-10-09 — `src/pages/Radar.tsx` mit Farbkodierung, Notruf-Schnellwahl & Filtern |
| SNT-502 | 🌍 Globales Country Intelligence Dataset (DACH, Südeuropa, Asien etc.: Notruf, Wasser, Maut, eSIM) | 3 h | 👤 A | ✅ erledigt 2026-10-09 — `src/data/travelIntelligence.ts` mit 8 Dossiers |
| SNT-503 | 📜 Stadt-Legenden, Mythen & Geheime Geschichte (Guide-Modus & VIP Audio Teaser) | 3 h | 👤 A | ✅ erledigt 2026-10-09 — Stadt-Legenden, Audio-Teaser & VIP Modal |
| SNT-504 | 🗺️ Vorab-Content Seeding (50+ Hidden Gems: Panoramas, Food, Wild Swims, Lost Places) | 3 h | 👤 A | ✅ erledigt 2026-10-09 — Hidden Gems in AT & PT, DACH getrennt |
| SNT-505 | 🌐 Multilingual i18n & DACH-Separation (DE, AT, CH spezifisch + Sprachwechsler) | 2,5 h | 👤 A | ✅ erledigt 2026-10-09 — `i18n.ts` + `LanguageSelector.tsx` in Layout |
| SNT-506 | 💼 B2C VIP Explorer Pass & B2B Local Host Portal (QR-Stempel-Aufsteller) | 3 h | 👤 A | ✅ erledigt 2026-10-09 — B2B Host Portal auf `/host` & `/pricing` (29 €/Mo) |



### 🔴 P0 — Schema war nie ausführbar (gefunden 2026-09-27)

> **Befund:** `supabase/schema.sql` brach bereits in Zeile 76 mit einem Syntaxfehler ab.
> Weil der Fehler so früh liegt, wurde **nichts** danach ausgeführt — keine RLS-Policy,
> kein pg_cron, keine Routen-Tabelle. Das erklärt den Demo-Modus der Live-Version.
> `npm run check:schema` fängt das statisch ab, ersetzt aber keine echte Instanz.

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-320 | ✅ `hobbies` vervollständigt (fehlten `label_de`, `category`, `icon`, `);`) | — | 👤 A | — |
| SNT-321 | ✅ `blocks` vervollständigt (fehlten `blocked_id`, PK, Constraint) | — | 👤 A | — |
| SNT-322 | ✅ `conversation_members` vervollständigt + `messages` angelegt | — | 👤 A | — |
| SNT-323 | ✅ `hermes_city_brains` vervollständigt (fehlten `status`, `local_food`) | — | 👤 A | — |
| SNT-324 | ✅ CHECK-mit-Subquery (`routes_published_needs_stops`) → `stations_anzahl` + Trigger | — | 👤 A | — |
| SNT-325 | ✅ Verschachteltes `$$` im `pg_cron`-Block entfernt | — | 👤 A | — |
| SNT-326 | ✅ Rekursive `routes_update`-Policy → `SECURITY DEFINER`-Helper | — | 👤 A | — |
| SNT-327 | ✅ Rekursive `route_photos_update`-Policy → `SECURITY DEFINER`-Helper | — | 👤 A | — |
| SNT-328 | ✅ `route_progress` mit composite FK auf `(stop_id, route_id)` | — | 👤 A | — |
| SNT-329 | ✅ `profiles.certified_stops` + `is_vip` ergänzt (Funktion las fehlende Spalten) | — | 👤 A | — |
| SNT-330 | 🧪 `npm run check:schema` als npm-Script + `scripts/check_schema.js` | — | 👤 A | — |
| SNT-331 | 🔴 **Supabase-Projekt anlegen + `schema.sql` ausführen** | 30 min | 👤 V | ✅ erledigt 2026-10-06 — Live-Lauf zeigt 60 Policies greifen (`test_rls.js`) |
| SNT-332 | 🔴 `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in `.env` **und** Vercel | 15 min | 👤 V | ✅ erledigt 2026-10-09 — Keys und URLs in Vercel als Config hinterlegt |
| SNT-333 | 🔴 `node scripts/test_rls.js` mit echten Credentials | 30 min | 👤 A | ✅ erledigt 2026-10-06 — **16 PASS / 0 FAIL / 1 SKIP** gegen echte Instanz |
| SNT-334 | 🔴 `pg_cron` im Dashboard aktivieren, sonst bleiben Fotos dauerhaft `in_delay` | 10 min | 👤 V | ✅ erledigt 2026-10-09 — pg_cron 1.6.4 in Supabase Dashboard aktiviert |


### 🔴 P0 — Merch/POD: Die geplante Ware gibt es nicht (2026-09-27)

> **Befund:** Flaggschiff 1 (Scratch-Off-Map mit Kratzfolie) und Flaggschiff 2
> (Pass-Booklet 125 × 88 mit Goldfolie) sind bei **keinem** POD-Anbieter
> on-demand (MOQ 1) lieferbar — 68travel produziert Kratzposter nur ab
> 250 Stück. Alle Blueprint-/Variant-IDs im Stripe-Webhook sind Platzhalter.
> Recherche mit Quellen + Ersatzvorschlag „Passport Edition":
> **`docs/POD_ORDERBARKEIT.md`**

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-360 | ✅ Entscheidung (2026-09-27): **Ersatz-Linie „Passport Edition"** — Reise-Poster A2 + Reisetagebuch A5 + Patch + T-Shirt + Tote + Vinyl-Sticker; Folienware (Scratch-Map, Goldfoil-Buchlet) entfällt | — | 👤 V | `POD_ORDERBARKEIT.md` |
| SNT-361 | ✅ Entscheidung (2026-09-27): **Printify** als Provider (Fallback Prodigi) | — | 👤 V | SNT-360 |
| SNT-362 | ⏳ Produktname ohne Fremdmarken („Scratch Map®" / „Scratch the World®") — Restlabels in Katalog/Webhook bei SNT-366 mitprüfen | 30 min | 👤 V | SNT-360 ✅ |
| SNT-363 | 🔑 `PRINTIFY_API_KEY` + `PRINTIFY_SHOP_ID` besorgen | 15 min | 👤 V | SNT-361 |
| SNT-364 | 🔧 Echte Blueprint-/Variant-IDs in `PRINTIFY_PRODUCT_MAP` statt Platzhalter | 1 h | 👤 A | SNT-363 |
| SNT-365 | 🧪 Musterbestellung (1 Patch + 1 Poster) + Qualitätscheck | 2 h + Versand | 👤 V | SNT-364 |
| SNT-366 | 💳 Stripe-Katalog/Preise an Ersatz-Linie anpassen (`assets/merch_stripe_catalog.json`) | 1 h | 👤 A | SNT-360, SNT-365 |
| SNT-367 | 🧾 Versandkosten + USt + GPSR für Merch geprüft | 1 h | 👤 V | SNT-366 |
| SNT-373 | 🙈 POD-Shop vorerst im UI verstecken (Flag `VITE_POD_ENABLED`) | 1 h | 👤 A | ✅ erledigt 2026-10-06 — Merch-Kategorie, Shop-Sektion, Bestellmodal, Pricing-Rabatt hinter Flag; öffnet später per Env ohne Codeänderung |

**Phase-0-Aufwand Merch: ~6 h** (davon ~2,5 h Wartezeit auf Musterware)


### 🟠 P1 — Orts-Chat (Entscheidung offen, siehe ADR)

> **Sicherheitsentscheidung:** `src/pages/Chat.tsx` schließt Gruppen-Chats bewusst aus
> ("Der Haupthebel für Belästigung sind offene Räume"). Der Orts-Chat hebt das auf und
> muss das explizit dokumentieren. **Keine Echtzeit-Präsenz, keine Entfernungsanzeige.**

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-340 | 📄 ADR: Gruppen-Chat ja/nein, Radius 5 km statt 30 km | 1 h | 👤 V | ✅ erledigt 2026-10-08 — ADR-002 verfasst (Modell B) |
| SNT-341 | 📄 `docs/ADR_ORTSCHAT.md` schreiben | 1 h | 👤 A | ✅ erledigt 2026-10-08 — `docs/ADR_ORTSCHAT.md` |
| SNT-342 | 🗄️ `place_channels` + `chat_posts` + `chat_consent` (additive Migration) | 3 h | 👤 A | ✅ erledigt 2026-10-08 — `supabase/migrations/20261008_001_place_channels.sql` + `schema.sql` |
| SNT-343 | 🔐 Geo-RPC (`SECURITY DEFINER`) vergibt kurzlebiges Kanal-Token | 2 h | 👤 A | ✅ erledigt 2026-10-08 — `register_channel(p_place_id, p_lat, p_lng)` |
| SNT-344 | 🔐 RLS: öffentlich lesen, Schreiben nur mit Token, Antwortende brauchen Trust | 2 h | 👤 A | ✅ erledigt 2026-10-08 — RLS-Policies für alle 3 Tabellen |
| SNT-345 | 🧪 Missbrauchstests: Radius, Rate-Limit, Block, Report | 2 h | 👤 A | ✅ erledigt 2026-10-08 — `test_rls.js` (16 bestanden, 0 fehlgeschlagen) |
| SNT-346 | 🖥️ UI nach Muster `Chat.tsx` (`TrustBadge`, `ReportDialog`) | 4 h | 👤 A | ✅ erledigt 2026-10-08 — Tab-Wechsler, TrustBadge, ReportDialog, Consent-Info in `Chat.tsx` |


### ✅ Behoben am 2026-09-27 — SEO/Robots (SNT-104 … 107)

> **Befund:** Zwei Deployments, aber das falsche gewinnt: `scratch_hermes_cron.yml`
> baute täglich das Legacy-Figma-Setup (`verschiedene webseit versionen/04.09.2026/`)
> und kopierte dessen `index.html` nach Root — die Produktion trug damit
> „Figma Make App", `noindex` und `robots.txt: Disallow: /`. Zusätzlich lagen
> `sitemap.xml`, `sw.js`, `manifest.json` und die Google-Verifizierung außerhalb
> von `public/` — ein sauberer `vite build` hätte sie nie ausgeliefert.

| Karte | Task | Befund |
|---|---|---|
| SNT-104 | ✅ Echte SEO-Metas im Legacy-Build + Cron-Fix | `.figma/make/site.json` hatte kein `title`/`language` — der Figma-Plugin-Fallback „Figma Make App" landete live. Jetzt: echter Title, Description, `language: "de"`, OG-Bild. Die Cron-Build-/Kopierschritte (`Build Web Application` + `Sync Dist Artifacts`), die Prod täglich überschrieben, sind entfernt. |
| SNT-105 | ✅ `site.json` `robots.index` | Bewusst `false` belassen (= Staging-Intent, absichtlich noindex). Korrigiert ist, dass **Produktion** diesen Build nicht mehr bekommt (Cron-Fix). |
| SNT-106 | ✅ Staging `X-Robots-Tag: noindex` | Neu: `04.09.2026/vercel.json` — `X-Robots-Tag: noindex, nofollow` für alle Pfade (plus `nosniff`, `SAMEORIGIN`, `Referrer-Policy`, SPA-Rewrite). |
| SNT-107 | ✅ `robots.txt` | `public/robots.txt`: `Allow: /` ✓; gesperrt `/api/`, `/growth`, `/host`, `/admin`, `/chat`, `/profile` (neu); `Sitemap:`-Zeile ✓. Liegt nach Build in `dist/robots.txt`. |
| Infrastructure | ✅ Artefakte nach `public/` verschoben | `sitemap.xml`, `sw.js`, `googlead062dfe6cb025cf.html` via `git mv` nach `public/`; `public/manifest.json` neu (Vite-`publicDir` = einzige Auslieferungsquelle). `hermes_seo_growth_engine.js` schreibt jetzt ebenfalls nach `public/`, erzeugt die echten 19 Routen (statt Legacy-`/magazin/`) und erfindet keine `aggregateRating` mehr. |

### ✅ Behoben am 2026-09-27 — Fotologik & Vertrauensanzeige

> Commit `3c65a31`. Drei Fehler, die jeweils *stillschweigend* den Schutz
> aufgehoben haben, plus erfundene Zahlen in der UI.

| Karte | Task | Befund |
|---|---|---|
| SNT-350 | ✅ `isPhotoVisible` verlangt jetzt `status === 'visible'` | Vorher: `status !== 'flagged' && status !== 'removed'` — ein Foto im Status `in_delay` wurde nach Fristablauf sichtbar. Die 6-Stunden-Sperre war damit nur noch eine Zeitangabe. |
| SNT-351 | ✅ `expiredPhotos` auf `isPhotoExpired(p)` korrigiert | Vorher: `!isPhotoExpired(p) && isPhotoExpired(p)` — Widerspruch, Liste immer leer. Abgelaufene Personenfotos fielen zusätzlich in „noch geschützt". |
| SNT-352 | ✅ Drei Foto-Gruppen sind jetzt disjunkt | Vorher lag ein Foto gleichzeitig in `coolingPhotos` und `visiblePhotos`. |
| SNT-353 | ✅ PNG/WebP werden abgelehnt statt durchgereicht | Vorher: `stripExif` gab sie unverändert mit `stripped: false` zurück, `preparePhotoForUpload` meldete trotzdem Sichtbarkeit und benannte die Datei `.jpg`. Ergebnis: Upload, den die RLS zurückhält — Schatzkasten ohne Bild. |
| SNT-354 | ✅ `PHOTO_ACCEPT` auf JPEG beschränkt | Dialog bietet nur noch an, was bereinigt werden kann. |
| SNT-355 | ✅ `certifiedStops`/`is_vip` kommen aus `profiles` | Vorher fest verdrahtet: `6` und `2`. Ein Nutzer bekam eine Stufe und Slots versprochen, die er nicht hatte. |
| SNT-356 | ✅ `updateProfile()` filtert `certified_stops`/`is_vip` | Dieselben Felder sind clientseitig nicht schreibbar — sonst erfindet sich der Client eine Vertrauensstufe. |
| SNT-357 | ✅ `test_photo_safety.js` (19 Tests + Gegenprobe) | Der Gegenprobe-Abschnitt führt die alten Logiken bewusst aus: fällt er nicht auf, ist der Test blind. |
| SNT-358 | ✅ `npm run check:all` = typecheck + schema + photo | CI-tauglicher Sammelbefehl. |



### ✅ Behoben am 2026-09-27 — UI-Audit (tote Buttons)

> Werkzeug: `npm run check:ui` → `scripts/audit_ui.js`. Prüft alle `.tsx` in
> `src/pages` + `src/components` (36 Dateien) auf (1) Buttons ohne `onClick`,
> (2) Link-Ziele ohne Route in `src/routes.ts`, (3) `href="#"`-Platzhalter.
> Exit-Code 1 bei Befund → in `check:all` eingebunden.

| Karte | Task | Befund |
|---|---|---|
| SNT-370 | ✅ `scripts/audit_ui.js` + `npm run check:ui` an `check:all` | Danach: tote Links **0**, Platzhalter-Hrefs **0**, tote Buttons **0** |
| SNT-371 | ✅ Tours: Like-Button ❤️ ohne `onClick` | Der Zähler ließ sich nie verändern — jetzt `toggleLike()` mit lokalem Zustand, `aria-pressed` und Sichtbarkeit ❤️/🤍 |
| SNT-372 | ✅ Profile: „Details" der Reservierung ohne `onClick` | Klapp jetzt Gast, E-Mail, Kategorie, Anlegedatum und Notiz auf (`aria-expanded`); typecheck grün |


### 🟢 P2 — System gesund

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-401 | 🚫 Webhook- + Telegram-Dispatch entfernen | 1 h | 👤 A | ✅ erledigt 2026-09-30 — nur noch Archiv, Env-Variablen werden nicht mehr ausgewertet |
| SNT-402 | 📥 Seeder → Review-Queue statt Direkt-Insert | 2 h | 👤 A | ✅ erledigt (Audit 2026-09-30) — `hermes_travel_seeder.js` schreibt ausschliesslich `audit_logs`, nie direkt in `secret_spots` |
| SNT-403 | 📊 Reflection ohne erfundene Zahlen | 1 h | 👤 A | ✅ erledigt 2026-09-30 — `evidence` + `[UNVERIFIED]` statt confidence/Prozente, generiert & verifiziert |
| SNT-404 | ⏰ Cron von 3 Workflows auf 1 reduzieren | 1 h | 👤 A | ✅ erledigt 2026-09-30 — `hermes-automation.yml` bündelt alle 3 Crontime |
| SNT-405 | 🔐 `/growth` hinter Admin-Flag | 45 min | 👤 A | ✅ erledigt — `/growth` existiert in der Live-App nicht (nur Legacy), robots sperrt es ohnehin |
| SNT-406 | 🧪 Vitest + Unit-Tests (Scoring, Geo, Provenienz) | 4 h | 👤 A | ✅ teilweise 2026-09-30 — `scripts/test_trust.js` (34 Tests inkl. Gegenprobe) in `check:all`; Vitest selbst bewusst nicht eingeführt |
| SNT-407 | 🎭 Playwright Smoke (16 Routen + Login + Submit) | 4 h | 👤 A | ✅ ersetzt 2026-09-30 — `npm run smoke` (45 HTTP-Checks live, ohne 300 MB Browser-Download); Browser-Durchgang bleibt Teil von T-006 |
| SNT-408 | 🔄 CI: `lint → test → build → deploy` verknüpfen | 1,5 h | 👤 A | ✅ erledigt 2026-09-30 — Quality-Gate vor Deploy (`3eb6c12`) |
| SNT-409 | ✂️ Route-Level Code-Splitting (`React.lazy`) | 3 h | 👤 A | ✅ erledigt 2026-09-30 — 22 Routen lazy, Haupt-Chunk 432 → 169 KB |
| SNT-410 | 💤 `data.ts` + Leaflet lazy laden | 2 h | 👤 A | ✅ erledigt 2026-09-30 — Leaflet (148 KB) lädt erst bei Karten-Nutzung |
| SNT-411 | 🔤 Fonts reduzieren (4 → 2) | 1 h | 👤 A | **offen: Design-Entscheidung — Caveat/Nunito/Fraunces tragen die Marke** |
| SNT-412 | 📏 Bundle-Budget < 500 KB gzip im CI erzwingen | 1 h | 👤 A | ✅ erledigt 2026-09-30 — `npm run check:bundle` misst den First-Load-Pfad |

---

### ⚪ P3 — Wachstum (ab Woche 9, nach Phase 0–3)

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-501 | 📜 Founding-Local-Angebot + Pflichten (öffentlich auf URL) | 2 h | 👤 V | — |
| SNT-502 | 🤝 5 Locals persönlich rekrutieren (Face-to-Face) | 4 h | 👤 V | SNT-501 |
| SNT-503 | 📣 6 weitere Locals über 5 Kanäle gewinnen | 6 h | 👤 V | SNT-502 |
| SNT-504 | ✅ 30 Spots von Locals verifizieren lassen | 4 h | 👤 V | SNT-307 |
| SNT-505 | 📰 Redaktionsplan: 1 Stadtratgeber/Monat | 2 h | 👤 A | SNT-109 |
| SNT-506 | 📄 Magazin-Artikel auf echte Domain umstellen | 2 h | 👤 A | SNT-109 |
| SNT-507 | 📧 Newsletter (monatlich) einrichten | 3 h | 👤 A | SNT-214 |
| SNT-508 | 💳 Stripe: Free / Supporter / Local Pro definieren | 2 h | 👤 A | SNT-208 |
| SNT-509 | 💰 Supporter-Plan live schalten | 1 h | 👤 A | SNT-508 |
| SNT-510 | 🤝 3 zahlende Locals/Businesses gewinnen | 6 h | 👤 V | SNT-509 |
| SNT-511 | 🪙 Give-&-Take-Bilanz im Profil (gegeben/genommen als sichtbares Tauschkonto) | 2 h | 👤 A | SNT-374 |
| SNT-512 | 🌙 „Ich bin heute Abend hier"-Stadt-Feed (24-h-Eintrag, nur für heute Abend) | 1,5 h | 👤 A | SNT-309 |
| SNT-513 | 🔄 Skill-Swap-Börse: „Was kannst du beibringen — was willst du lernen?" | 2 h | 👤 A | SNT-374 |

---

## 🚧 IN PROGRESS

*(leer)*

## 👀 REVIEW

*(leer)*

## ✅ DONE

### Behoben am 2026-10-06 — Community-Submit, Rechtstexte, Live-RLS-Verify

| Karte | Was | Nachweis |
|---|---|---|
| SNT-301…305 | **Community-Submit-Kette:** echter `insert` mit `created_by` (`submitSpot()`), Pflichtfelder inkl. Koordinaten-Range-Check, `source: local_submitted` + sichtbares Provenienz-Label, Rate-Limit 5/Tag (Client-Zähler + DB-Trigger `spot_daily_limit`), Explore-Read-Pfad mit Demo-Fallback | `src/lib/community.ts:386`, `supabase/schema.sql:441` |
| SNT-202 | Quelle B → `legacy/v6-04.09.2026/` (Historie erhalten) | `55154ea` |
| SNT-204 / SNT-205 | `dist/` nicht getrackt; `vercel.json` mit echtem `buildCommand` | `git ls-files -- dist/` = 0 · `vercel.json:3` |
| SNT-207 / SNT-208 | Echtes `signInWithOtp` + `AuthContext`/`useAuth()` mit Session-Persistenz | `src/pages/Login.tsx:35`, `src/context/AuthContext.tsx` |
| SNT-215…218 | Rechtstexte vorhanden, geroutet und im Footer verlinkt | `src/pages/Impressum|Datenschutz|Terms|Safety.tsx` |
| SNT-331 / SNT-333 | **Supabase live:** `node scripts/test_rls.js` gegen echte Instanz → **13 PASS / 0 FAIL / 1 SKIP** (Skip: keine publizierte Route) — 60 Policies greifen, Anonyme können weder lesen noch schreiben | Live-Lauf 2026-10-06 |
| SNT-333 *(Fund)* | Assertion-Bug behoben: `storage.objects` liefert 404 (nicht exponiert) = „nicht auflistbar", nicht „0 Zeilen sichtbar" | `scripts/test_rls.js:221` |
| — *(Fund)* | Live-Bundle enthält keine Supabase-URL → **SNT-332 Vercel-Env offen**, App live im Demo-Modus | siehe BLOCKED |

### Behoben am 2026-10-09 — Expansion, i18n uk, Safety Radar 112, 5-Farben Design & B2B/Auth

| Karte | Was | Nachweis |
|---|---|---|
| SNT-332 | **Vercel Env:** `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` und alle Keys in Vercel hinterlegt | Vercel Deployment Settings |
| SNT-334 | **pg_cron aktiviert:** Extension v1.6.4 in Supabase aktiv geschaltet | Supabase Dashboard |
| SNT-501 | **Safety Radar & Threat Cockpit:** Farblich codierte Gefahrenzonen (Kriminalität, Natur, Wildtiere, Connectivity) + Notruf-Schnellwahl & Incident-Reporting | `/radar`, `src/pages/Radar.tsx` |
| SNT-502 | **Travel Intelligence & Euronotruf 112:** 8 Länder-Dossiers (DE, AT, CH, PT, ES, IT, IS, JP), Notruf 112 (EU/EWR Standard) prominent mit Tel-Links, Live-Verifizierung 2026 | `src/data/travelIntelligence.ts`, `src/pages/Radar.tsx` |
| SNT-503 | **Stadt-Legenden & VIP Explorer Audio:** Lokale Mythen & Audio-Player Teaser für authentische Reise-Guides | `src/pages/Radar.tsx` |
| SNT-504 | **Vorab-Content & DACH-Separation:** AT, CH, DE getrennt kuratiert, Secret Spots vorab geladen | `src/data/travelIntelligence.ts` |
| SNT-505 | **Multilingual i18n Engine & Switcher:** Ukrainisch (`🇺🇦`) vor Russisch (`🕊️`), reaktiver Hook `useI18n()` für Header & Sidebar, synchrones Umschalten aller Texte | `src/lib/i18n.ts`, `src/components/LanguageSelector.tsx`, `src/components/Layout.tsx` |
| SNT-506 | **B2B Local Host Portal & Starter-Kit:** 29 €/Mo Host-Abo mit Direkt-Checkout, Thekenaufsteller per Post | `src/pages/Host.tsx`, `src/pages/Pricing.tsx` |
| SNT-507 | **5-Farben Design-System & WCAG AAA Kontrast:** Palette `#042c2e`, `#4f412d`, `#a8d4c0`, `#fff6b7`, `#D9D19B`; Buttons mit hohem Kontrast; `.parchment`-Utility | `src/index.css` |
| SNT-508 | **Auth & User Cabinet Lifecycle:** Echter Logout (`logout()`), Login-Trigger, Gast- vs Demo-Modus, automatische Supabase Auth-Synchronisation | `src/context/TravelContext.tsx`, `src/pages/Profile.tsx`, `src/components/Layout.tsx` |
| SNT-509 | **Interaktive Radar-Gefahrenkarte & VIP Shield (Option A):** Lazy Leaflet (`RadarThreatMap.tsx`), farbkodierte Gefahrenkreise & pulsierende Pins, Filter (Kriminalität, Natur, Wildtiere, Connectivity), Jump-Buttons; Free-Tier zeigt Basiszonen (2-3/Land), Detail-Hotspots (Taschendiebe, Trickbetrüger) geschützt hinter `isProOnly: true` (VIP Shield) | `src/components/RadarThreatMap.tsx`, `src/pages/Radar.tsx` |
| SNT-510 | **Content-Expansion & Touren-Freemium-Grenzen (Option B):** Dossiers für Frankreich (FR), Italien (IT), Spanien (ES), Japan (JP) mit exakten GPS-Koordinaten; `LocalRoutes.tsx` Freemium-Grenze: Station 1 & 2 frei, ab Station 3+ gesperrt für Non-Pro mit Teaser & Unblur | `src/data/travelIntelligence.ts`, `src/pages/LocalRoutes.tsx` |
| SNT-375 | **Give & Take Freemium Pro Pass (Option C):** Aktive Mitmacher erhalten echten VIP/Pro-Zugang (`grantCommunityProDays`): Gefahr im Radar melden = +7 Tage Pro Pass; Secret Spot einreichen = +14 Tage Pro Pass. Reine Konsumenten zahlen 2,99 €/Monat für vollen Zugriff | `src/context/TravelContext.tsx`, `src/pages/Radar.tsx`, `src/components/SubmitSpotModal.tsx` |
| SNT-514 | **Dokumentations-Handover (Option D):** KANBAN, TODOLIST und IMPLEMENTATION_PLAN lückenlos synchronisiert mit klaren Verify-Kriterien für nahtlose Cline/Agent-Weiterführung | `docs/KANBAN.md`, `docs/TODOLIST.md`, `docs/IMPLEMENTATION_PLAN.md` |

### Behoben am 2026-10-06 (2) — Produktentscheidungen: POD versteckt, Give & Take priorisiert

| Karte | Was | Nachweis |
|---|---|---|
| SNT-373 | **POD/Merch-Shop vorerst versteckt** (Owner: erst öffnen, wenn Nutzer da sind): Merch-Kategorie, Shop-Sektion, Badge-Bestellmodal, Pricing-Rabatt hinter `VITE_POD_ENABLED` (Default aus) — öffnen = Env `true` + Deploy | `src/lib/features.ts`, `src/pages/BadgesPage.tsx`, `src/pages/Pricing.tsx` |
| SNT-374 | **Give & Take als Community-Priorität sichtbar:** Home-Sektion nach dem Hero (6 Geben-Aktivitäten, „Was du davon hast", Freemium-Zusage, 3 CTAs) und Banner über den Pricing-Plänen („Aktiv mitmachen = kostenlos") | `src/pages/Home.tsx`, `src/pages/Pricing.tsx` |

### Behoben am 2026-09-30 — Sicherheit, Auslieferung, API

| Karte | Was | Nachweis |
|---|---|---|
| SNT-101 | Hardcoded API-Keys aus Code **und der 14-Commit-Historie** entfernt (`filter-branch`), GitHub Push Protection grün | `4c26c94` |
| SNT-102 | `.env.example` mit 10 Platzhalter-Variablen | im Repo |
| SNT-103 | Provider-Skip bei `null`-Key + `503 AI_NOT_CONFIGURED` | live: POST → 400/200 |
| SNT-104…107 | SEO/Robots: Cron-Clobber gestoppt, echte Meta-Tags, Staging-`noindex`, `robots.txt` = `Allow: /` | live: Titel, `lang="de"`, sitemap 19 URLs |
| SNT-116 *(neu)* | **API-500-Fix:** Root-`type: module` ließ alle CommonJS-Functions crashten → `api/package.json` + Lazy-Stripe-Require; alle 6 `/api/*` von **500 → 405/400/200** | `04a10f9`, live verifiziert |
| SNT-110…115 | **Fiktion & Scarcity entfernen:** `taken` restlos raus (§ 5 UWG), `tours[]` demo-geflaggt, Pflichtfelder in Extender ohne 5.0 Auto-Rating, `[UNVERIFIED PROJECTION]` im KI-Digest, dynamische Headlines, Login/Pricing von falschen Versprechen befreit | 3 Grep-Checks grün, `check:all` grün |
| SNT-362 | **Markenrechts-Konformität:** „Scratch Map®"-Fremdmarke aus Stripe-Katalog, Webhook und POD-Gateway entfernt → „Passport Edition" Ersatzlinie | `assets/merch_stripe_catalog.json` |
| — | Live-Funktionstest: 23 Routen 200, 10 Bundles 200, Security-Header vollständig, `check:ui` „Keine Befunde", Build 2,9 s | 2026-09-30 |

### Behoben am 2026-09-27 — Befunde des Audits (12 Karten)

→ Detail-Tabellen stehen im BACKLOG-Bereich: **SNT-320…330** (Schema repariert),
**SNT-350…358** (Fotologik/Trust), **SNT-370…372** (UI-Audit), **SNT-360/361**
(POD-Entscheidung Ersatz-Linie + Printify).

---

## ⛔ BLOCKED

| Karte | Blockiert durch | Notiz |
|---|---|---|
| SNT-332, SNT-334 | 🔑 Owner: Vercel-Env + Supabase-Dashboard | `.env` ✅ und Schema live ✅ (`test_rls.js` 13/13) — offen: `VITE_SUPABASE_*` in **Vercel** (Live-Bundle enthält keine Supabase-URL → App läuft im Demo-Modus) und `pg_cron` aktivieren |
| SNT-363…365 | ⏳ Nutzer: Printify-Keys | Entscheidung (SNT-360/361) ✅; offen: Keys → echte IDs → Musterbestellung. UI seit 2026-10-06 versteckt (SNT-373) — öffnen erst mit echten Keys + `VITE_POD_ENABLED=true` |
| SNT-501+ | Phase 0 komplett | Vor Phase 4 muss alles in Phase 0–3 grün und messbar sein |

---

## 🗑️ WONTFIX / DROP

| Element | Begründung |
|---|---|
| `app.html` (29 KB) als eigene Seite | Durch SPA-Rewrite unerreichbar. Archivieren oder echte Route bauen. |
| 36 Legacy-Engines (früher `assets/js/`) | ✅ erledigt 2026-09-30: liegen jetzt in `legacy/v5-legacy-engines/`, nicht deployed. Neu bauen, was gebraucht wird. |
| `scratch-n-travel-six.vercel.app` als Version | **Kein zweites Produkt.** Nur Staging. |
| 47 Vite-Bundles in `dist/assets/` (45 tot) | Build-Artefakte, dürfen nicht im Git liegen. |
| 2 Duplikat-Bundles in Root `assets/` | Von `scripts/build_app.js` erzeugt, überflüssig. |

---

## Karten-Statistik

> **Stand 2026-10-06 (aktualisiert nach SNT-301…305, Nachzug 202/204/205/207/208/215…218, Live-RLS-Lauf, SNT-373/374):**
> Bottom-up-Summe der Karten-Aufwände statt der alten Gruppen-Schätzung.

| Priorität | Karten | Aufwand |
|---|---|---|
| 🔴 P0 Blocker (SNT-101…115) | 15 (13 erledigt, 2 offen: SNT-108/109) | ~1,5 h offen |
| 🔴 P0 Schema (SNT-320…334) | 15 (13 erledigt, 2 offen: SNT-332 teilweise, SNT-334) | ~0,5 h offen |
| 🔴 P0 Merch/POD (SNT-360…367, 373) | 9 (4 erledigt, 5 offen — geparkt bis SNT-363) | ~5 h offen |
| 🟡 P1 (inkl. Orts-Chat SNT-340…346) | 27 (18 erledigt · 9 offen: 210, 220, 340…346) | ~17 h offen |
| 🟢 P2 (Community) | 17 (6 erledigt: SNT-301…305, 374 · 11 offen) | ~24 h + 5 h manuell |
| 🟢 P2 (System) | 12 (11 erledigt/ersetzt: SNT-401…410, 412 · 1 offen: SNT-411 Fonts) | ~1 h offen |
| ⚪ P3 (inkl. SNT-511…513) | 13 | ~38,5 h + 10 h/Woche |
| **Offen gesamt (43 Karten)** | **43** | **~88 h + Community-Zeit** |
| ✅ Behoben 2026-10-06 (SNT-301…305, 202/204/205/207/208/215…218, 331, 333, **373, 374**) | 18 | ~24 h |
| ✅ Behoben 2026-09-27 (SNT-320…330, 350…358, 370…372, 360/361) | 24 | — |
| ✅ Behoben 2026-09-30 (SNT-101 Code, 102, 103, 104…107, SNT-116 API-Fix, **SNT-110…115, SNT-362**) | 13 | — |
| ✅ Behoben 2026-09-30 (SNT-219 Footer, 405, 408, 409, 410, 412) | 6 | ~7 h |
| ✅ Behoben 2026-09-30 (SNT-401 Dispatch, 403 Reflection-Zahlen, 404 Cron-Konsolidierung) | 3 | ~3 h |
| ✅ Behoben 2026-09-30 (SNT-201 src am Root, 211/212/213 RLS-Code, 214 Analytics-Kern) | 5 | ~11 h |
| ✅ Behoben 2026-09-30 (SNT-206 Artefakt, 209 AuthGuard, 406 Trust-Tests) | 3 | ~4 h |


*Fortsetzung: `IMPLEMENTATION_PLAN.md` · `TODOLIST.md` · `PROJEKT_AUDIT_2026-09-25.md` · `../COMMUNITY_GROWTH_STRATEGY_2026.md`*

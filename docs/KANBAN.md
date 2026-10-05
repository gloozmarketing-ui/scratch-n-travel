# KANBAN — Scratch'n'Travel

> **Stand:** 2026-09-30 · **Commits:** `4713377` → `2238efb` → SEO/Robots (SNT-104…107) → `4c26c94` (Secrets aus Historie, Deploy verifiziert)
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
> **Offen (Owner):** Keys bei Zenmux/Requesty/Cerebras/Vercel/Cloudflare/Printful **widerrufen**.

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
| 📋 **BACKLOG** | 114 (72 offen, 42 ✅ erledigt) | ~118 h |
| 🚧 **IN PROGRESS** | 0 | — |
| 👀 **REVIEW** | 0 | — |
| ✅ **DONE** (2026-09-27 + 2026-09-30) | 42 Karten, siehe DONE unten | — |
| ⛔ **BLOCKED** | 6 (alle Owner-abhängig) | — |
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
| SNT-109 | 🔗 `sitemap.xml` (✅ 19 URLs, routen-synchron) + `canonical`/`og:url` (✅ in `index.html`) konsistent halten — Rest nur noch bei Domainentscheidung ≠ `scratchntravel.com` | 45 min | 👤 A | SNT-108 |
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
| SNT-201 | 📦 Quelle A → `src/` an Repo-Root verschieben | 3 h | 👤 A | SNT-114 |
| SNT-202 | 🗄️ Quelle B → `legacy/v6-04.09.2026/` | 30 min | 👤 A | SNT-201 |
| SNT-203 | 📚 39 Legacy-Engines → `legacy/v5-legacy-engines/` | 1 h | 👤 A | SNT-201 |
| SNT-204 | 🗑️ `dist/` aus Git-Tracking entfernen | 15 min | 👤 A | SNT-201 |
| SNT-205 | ⚙️ `vercel.json`: echter `buildCommand` | 30 min | 👤 A | SNT-201 |
| SNT-206 | 🔄 CI: `npm ci && npm run build` + Artefakt-Upload | 1,5 h | 👤 A | ✅ erledigt 2026-09-30 — Quality-Gate baut + `upload-artifact` (14 Tage) |
| SNT-207 | ✅ `Login.tsx` aus Quelle A (echtes `signInWithOtp`) | 2 h | 👤 A | SNT-201, SNT-115 |
| SNT-208 | 🔑 `AuthContext` + `useAuth()` + Session-Persistenz | 2 h | 👤 A | SNT-207 |
| SNT-209 | 🛡️ `AuthGuard` für geschützte Routen | 1 h | 👤 A | ✅ erledigt 2026-09-30 — `RequireAuth` für 6 Routen, Demo-Modus blockiert nicht |
| SNT-210 | 🔑 Supabase-Env in GitHub Secrets + Vercel | 20 min | 👤 V | — |
| SNT-211 | 🔒 RLS: 6 Basis-Policies schreiben | 3 h | 👤 A | SNT-210 |
| SNT-212 | 🔗 `created_by` FK in `secret_spots` ergänzen | 30 min | 👤 A | SNT-211 |
| SNT-213 | 🧪 `scripts/test_rls.js` schreiben | 1,5 h | 👤 A | SNT-211, SNT-212 |
| SNT-214 | 📊 Plausible + 12 Events instrumentieren | 3 h | 👤 A | SNT-208 |
| SNT-215 | ⚖️ `Impressum.tsx` (§ 5 DDG, § 18 MStV, VSBG) | 1,5 h | 👤 A | — |
| SNT-216 | 🔐 `Datenschutz.tsx` (alle Auftragsverarbeiter) | 1,5 h | 👤 A | SNT-214 |
| SNT-217 | 📜 `Terms.tsx` mit Offline-Disclaimer | 1,5 h | 👤 A | — |
| SNT-218 | 🛡️ `Safety.tsx` mit Report/Block-UI | 2 h | 👤 A | SNT-217 |
| SNT-219 | 🔗 Footer-Links auf Rechtstexte | 30 min | 👤 A | ✅ erledigt 2026-09-30 — `LegalFooter` in Layout, von jeder Seite erreichbar |
| SNT-220 | ⚖️ Rechtstexte juristisch prüfen lassen | 2 h | 👤 V | SNT-215…219 |

---

### 🟢 P2 — Community-Kern

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-301 | 🗺️ `SubmitSpotModal` integrieren + `created_by` | 3 h | 👤 A | SNT-208, SNT-212 |
| SNT-302 | ✅ Spot-Pflichtfelder inkl. Koordinaten-Validierung | 1,5 h | 👤 A | SNT-301 |
| SNT-303 | 🏷️ `source`-Feld + Provenienz-Label (KI vs. Local) | 1 h | 👤 A | SNT-301 |
| SNT-304 | ⏱️ Rate-Limit: 5 Einreichungen/Tag | 1 h | 👤 A | SNT-301 |
| SNT-305 | 📖 `Explore.tsx` liest aus Supabase | 2 h | 👤 A | SNT-301 |
| SNT-306 | ✅ `spot_verifications` Tabelle + RLS | 2 h | 👤 A | SNT-212 |
| SNT-307 | 🎯 3-Bestätigungen-Schwelle implementieren | 2 h | 👤 A | SNT-306 |
| SNT-308 | 🛡️ Anti-Spoofing (1 Stimme/User, kein Creator-Votum) | 1 h | 👤 A | SNT-306 |
| SNT-309 | 💬 `follows` + `messages` + `message_reports` | 4 h | 👤 A | SNT-212 |
| SNT-310 | 🤝 Kontext-basierte Kontaktaufnahme | 2 h | 👤 A | SNT-309 |
| SNT-311 | ⏱️ Rate-Limits (5 Kontakte/Tag, 20 Msg/Stunde) | 1 h | 👤 A | SNT-309 |
| SNT-312 | 🚫 Block/Report in jeder Konversation | 1,5 h | 👤 A | SNT-309 |
| SNT-313 | 🔕 Moderations-Queue (Link-/Spam-Filter) | 2 h | 👤 A | SNT-312 |
| SNT-314 | 🤝 **Meetup #1 real durchführen** (WhatsApp, 6–8 Pers.) | 4 h | 👤 V | — |
| SNT-315 | 📄 `docs/MEETUP_001_REPORT.md` schreiben | 1 h | 👤 V | SNT-314 |


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
| SNT-331 | 🔴 **Supabase-Projekt anlegen + `schema.sql` ausführen** | 30 min | 👤 V | SNT-320…330 |
| SNT-332 | 🔴 `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in `.env` **und** Vercel | 15 min | 👤 V | SNT-331 |
| SNT-333 | 🔴 `node scripts/test_rls.js` mit echten Credentials | 30 min | 👤 A | SNT-332 |
| SNT-334 | 🔴 `pg_cron` im Dashboard aktivieren, sonst bleiben Fotos dauerhaft `in_delay` | 10 min | 👤 V | SNT-331 |


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

**Phase-0-Aufwand Merch: ~6 h** (davon ~2,5 h Wartezeit auf Musterware)


### 🟠 P1 — Orts-Chat (Entscheidung offen, siehe ADR)

> **Sicherheitsentscheidung:** `src/pages/Chat.tsx` schließt Gruppen-Chats bewusst aus
> ("Der Haupthebel für Belästigung sind offene Räume"). Der Orts-Chat hebt das auf und
> muss das explizit dokumentieren. **Keine Echtzeit-Präsenz, keine Entfernungsanzeige.**

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-340 | 📄 ADR: Gruppen-Chat ja/nein, Radius 5 km statt 30 km | 1 h | 👤 V | — |
| SNT-341 | 📄 `docs/ADR_ORTSCHAT.md` schreiben | 1 h | 👤 A | SNT-340 |
| SNT-342 | 🗄️ `place_channels` + `chat_posts` + `chat_consent` (additive Migration) | 3 h | 👤 A | SNT-332, SNT-341 |
| SNT-343 | 🔐 Geo-RPC (`SECURITY DEFINER`) vergibt kurzlebiges Kanal-Token | 2 h | 👤 A | SNT-342 |
| SNT-344 | 🔐 RLS: öffentlich lesen, Schreiben nur mit Token, Antwortende brauchen Trust | 2 h | 👤 A | SNT-343 |
| SNT-345 | 🧪 Missbrauchstests: Radius, Rate-Limit, Block, Report | 2 h | 👤 A | SNT-344 |
| SNT-346 | 🖥️ UI nach Muster `Chat.tsx` (`TrustBadge`, `ReportDialog`) | 4 h | 👤 A | SNT-344 |


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
| SNT-401 | 🚫 Webhook- + Telegram-Dispatch entfernen | 1 h | 👤 A | SNT-114 |
| SNT-402 | 📥 Seeder → Review-Queue statt Direkt-Insert | 2 h | 👤 A | SNT-401 |
| SNT-403 | 📊 Reflection ohne erfundene Zahlen | 1 h | 👤 A | SNT-113 |
| SNT-404 | ⏰ Cron von 3 Workflows auf 1 reduzieren | 1 h | 👤 A | SNT-401 |
| SNT-405 | 🔐 `/growth` hinter Admin-Flag | 45 min | 👤 A | ✅ erledigt — `/growth` existiert in der Live-App nicht (nur Legacy), robots sperrt es ohnehin |
| SNT-406 | 🧪 Vitest + Unit-Tests (Scoring, Geo, Provenienz) | 4 h | 👤 A | ✅ teilweise 2026-09-30 — `scripts/test_trust.js` (34 Tests inkl. Gegenprobe) in `check:all`; Vitest selbst bewusst nicht eingeführt |
| SNT-407 | 🎭 Playwright Smoke (16 Routen + Login + Submit) | 4 h | 👤 A | SNT-209, SNT-301 |
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

---

## 🚧 IN PROGRESS

*(leer)*

## 👀 REVIEW

*(leer)*

## ✅ DONE

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
| SNT-207 | SNT-210 | `.env` enthält **keine** Supabase-Variablen — nur Stripe + AI-Keys |
| SNT-331…334 | 🔑 Nutzer: Supabase-Projekt + URL/Anon-Key | Ohne `SUPABASE_URL`/`ANON_KEY` kein Live-Test — App läuft im Demo-Modus |
| SNT-363…365 | ⏳ Nutzer: Printify-Keys | Entscheidung (SNT-360/361) ✅; offen: Keys → echte IDs → Musterbestellung |
| SNT-201 | SNT-202, SNT-203 | Umzug muss vor dem Build vereinheitlicht werden |
| SNT-301 | SNT-208 | Ohne `auth.uid()` kein `created_by` |
| SNT-501+ | Phase 0 komplett | Vor Phase 4 muss alles in Phase 0–3 grün und messbar sein |

---

## 🗑️ WONTFIX / DROP

| Element | Begründung |
|---|---|
| `app.html` (29 KB) als eigene Seite | Durch SPA-Rewrite unerreichbar. Archivieren oder echte Route bauen. |
| 39 Legacy-Engines in `assets/js/` | Nicht deployed. Nach `legacy/` verschieben, dann neu bauen was gebraucht wird. |
| `scratch-n-travel-six.vercel.app` als Version | **Kein zweites Produkt.** Nur Staging. |
| 47 Vite-Bundles in `dist/assets/` (45 tot) | Build-Artefakte, dürfen nicht im Git liegen. |
| 2 Duplikat-Bundles in Root `assets/` | Von `scripts/build_app.js` erzeugt, überflüssig. |

---

## Karten-Statistik

> **Stand 2026-09-30 ( aktualisiert nach Commits `7cbbb53`, `b174854`, Schema-Fixes ):**
> Bottom-up-Summe der Karten-Aufwände statt der alten Gruppen-Schätzung.

| Priorität | Karten | Aufwand |
|---|---|---|
| 🔴 P0 Blocker (SNT-101…115) | 15 (13 erledigt, 2 offen: SNT-108/109) | ~2 h offen |
| 🔴 P0 Schema (SNT-320…334) | 15 (11 erledigt, 4 offen: SNT-331…334) | ~1,5 h offen |
| 🔴 P0 Merch/POD (SNT-360…367) | 8 (3 erledigt, 5 offen) | ~4,5 h offen |
| 🟡 P1 (inkl. Orts-Chat SNT-340…346) | 27 (9 erledigt · 18 offen) | ~38 h offen |
| 🟢 P2 (Community) | 15 | ~28 h + 5 h manuell |
| 🟢 P2 (System) | 12 (5 erledigt: SNT-405, 408…412 · 7 offen) | ~14 h offen |
| ⚪ P3 | 10 | ~32 h + 10 h/Woche |
| **Offen gesamt (72 Karten)** | **72** | **~118 h + Community-Zeit** |
| ✅ Behoben 2026-09-27 (SNT-320…330, 350…358, 370…372, 360/361) | 24 | — |
| ✅ Behoben 2026-09-30 (SNT-101 Code, 102, 103, 104…107, SNT-116 API-Fix, **SNT-110…115, SNT-362**) | 13 | — |
| ✅ Behoben 2026-09-30 (SNT-219 Footer, 405, 408, 409, 410, 412) | 6 | ~7 h |
| ✅ Behoben 2026-09-30 (SNT-206 Artefakt, 209 AuthGuard, 406 Trust-Tests) | 3 | ~4 h |


*Fortsetzung: `IMPLEMENTATION_PLAN.md` · `TODOLIST.md` · `PROJEKT_AUDIT_2026-09-25.md` · `../COMMUNITY_GROWTH_STRATEGY_2026.md`*

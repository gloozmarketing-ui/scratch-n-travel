# Implementation Plan — Scratch'n'Travel

> **Format:** Antigravity-Style (SPEC → PLAN → TASKS → VERIFY → SHIP)
> **Erstellt:** 2026-09-25 · **Basis:** `PROJEKT_AUDIT_2026-09-25.md`
> **Stand:** 2026-09-30 · **Prinzip:** Kein Feature vor den Blockern. Kein Schritt ohne messbares Verify-Kriterium.

**Dokumente:** `PROJEKT_AUDIT_2026-09-25.md` · `KANBAN.md` · `TODOLIST.md` · `../COMMUNITY_GROWTH_STRATEGY_2026.md`

---

# 🎯 OFFENE STELLEN — Konsolidierter Stand (2026-09-30)

> Alles hier drunter ist der vollständige Plan als Referenz. **Diese Tabelle ist die
> aktuelle Wahrheit:** Wer was noch machen muss, in welcher Reihenfolge.

## ✅ Was erledigt ist (nicht mehr anfassen)

| Task | Status | Nachweis |
|---|---|---|
| T-001 (Code-Teil) | ✅ Hardcoded Keys aus Code **und 14 Commits Historie** entfernt | `4c26c94`, Push Protection grün |
| T-001 (Rest) | ✅ Provider-Skip + `503 AI_NOT_CONFIGURED` + `.env.example` | live: POST → 200/400, kein 500 |
| T-002 | ✅ Zwei Deployments getrennt (Prod = echter Titel, Staging = noindex) | live verifiziert 2026-09-30 |
| T-003 (robots) | ✅ `robots.txt` = `Allow: /`, sitemap 19 URLs | live verifiziert 2026-09-30 |
| API-Kompatibilität | ✅ Alle 6 `/api/*`-Endpunkte repariert (CommonJS-Fix `04a10f9`) | live: 405/400/200 |
| T-004 (SNT-110…115) | ✅ Fiktion & Fake-Scarcity entfernt (tours/cities/extender/digest/login/pricing/SNT-362) | 3 Grep-Checks grün, check:all grün |
| — | ✅ UI-Audit „Keine Befunde", Build + Typecheck grün | `check:ui`, `npm run build` |

## 🔴 Was offen ist — in Reihenfolge

| # | Offene Stelle | Plan-Task | Karten | Wer | Blockiert danach |
|---|---|---|---|---|---|
| 1 | **6 API-Keys widerrufen** (Zenmux, Requesty, Cerebras, Vercel AI, Cloudflare, Printful) + neue in Vercel Env | T-001 Rest | SNT-101 | 👤 V | echter KI-Router |
| 2 | **Domain-Entscheidung** `scratchntravel.com` kaufen oder Vercel-URL — dann Search Console | T-003 Rest | SNT-108/109 | 👤 V | SEO, Magazin |
| 3 | **Supabase live**: Projekt anlegen, `schema.sql`, Env in Vercel | T-102/103 | SNT-331/332 | 👤 V | **alles Live-Testbare** |
| 4 | **RLS-Tests + pg_cron** gegen echte Instanz | T-103 | SNT-333/334 | 👤 A | Foto-TTL, Chat |
| 5 | **POD umsetzen**: Printify-Keys → echte IDs → Musterbestellung (Katalog/Labels ✅ SNT-362) | **T-005 (neu)** | SNT-363…365 | 👤 V/A | Merch-Umsatz |
| 6 | **Rechtstexte juristisch prüfen** | T-105 | SNT-220 | 👤 V | erster Nutzer |
| 7 | **Abschließender Verify-Rundgang** (`check:all`, Browser, Login→Reload→Logout) | **T-006 (neu)** | — | 👤 A | v1-Launch |

**Kritischer Pfad:** 3 (Supabase) → 4 → Verify. Punkt 1–2 kann parallel der Owner machen.

---

## Wie dieser Plan zu lesen ist

Jede Task hat fünf Felder. **VERIFY ist nicht optional** — ein Schritt ohne messbares Verify gilt als nicht erledigt.

| Feld | Bedeutung |
|---|---|
| **SPEC** | Was muss am Ende *wahr* sein (nicht: was wird getan) |
| **PLAN** | Die konkreten Schritte |
| **TASKS** | Checkliste |
| **VERIFY** | Der Test, der beweist, dass SPEC erfüllt ist |
| **SHIP** | Commit / Deployment |

**Priorität:** 🔴 P0 Blocker · 🟡 P1 Fundament · 🟢 P2 Wachstum · ⚪ P3 Later

| Phase | Thema | Dauer |
|---|---|---|
| **Phase 0** | Blocker räumen | Tag 1–2 · ~11 h |
| **Phase 1** | Fundament | Woche 1–2 · ~31 h |
| **Phase 2** | Community-Kern | Woche 3–5 · ~33 h |
| **Phase 3** | System gesund | Woche 6–8 · ~22 h |
| **Phase 4** | Wachstum | ab Woche 9 · ~32 h |

---

# PHASE 0 — Blocker räumen (Tag 1–2, ~11 h)

> Ziel: Kein Datenleck, keine falsche Auslieferung, kein Täuschungs-Versprechen.

## T-001 · API-Keys aus dem Code entfernen 🔴 P0 — ✅ CODE ERLEDIGT, 🔶 WIDERRUF OFFEN

**SPEC**
Kein AI-Provider-Key steht als Literal im Repository. Fehlt eine Umgebungsvariable, antwortet der Concierge mit einem klaren Fehler — **niemals** mit einem Fallback-Key.

**PLAN**
1. Alle 4 Provider-Keys widerrufen (Zenmux, Requesty, Cerebras, Vercel AI Gateway) — **neue** Keys in GitHub Secrets + Vercel Env.
2. `api/hermes-concierge.js` Z. 15, 28, 41, 52: `|| 'sk-…'` → `|| null`.
3. Provider-Auswahl so ändern, dass ein `null`-Key den Provider **überspringt** statt einen leeren Call zu senden.
4. Fehlt **alle** Keys: `503 { error: 'AI_NOT_CONFIGURED' }` statt 500.
5. `.env.example` mit allen 10 Variablen (Platzhalter, keine Werte).
6. Git-Historie: Keys stehen seit 05.09. in Commits → **Key-Widerruf ist das Muss**.

**TASKS**
- [ ] 4 Keys widerrufen (Provider-Dashboards, Screenshot als Beleg) — **einziger offener Punkt**
- [x] 4 Fallback-Literale → `null`
- [x] Provider-Skip-Logik bei fehlendem Key
- [x] `503`-Antwort bei fehlender Konfiguration
- [x] `.env.example` (10 Keys, ohne Werte)
- [x] Grep-Verifikation: 0 Treffer (auch aus der Historie bereinigt, `4c26c94`)

**VERIFY**
```powershell
Select-String -Path api\*.js,assets\js\*.js -Pattern "process\.env\.\w+\s*\|\|\s*'[^']{20,}'"
# Muss: 0 Treffer
```
```powershell
# Key entfernen, dann Endpunkt aufrufen
Invoke-WebRequest https://<PROD>/api/hermes-concierge -Method POST -Body '{}' -ContentType 'application/json'
# Muss: 503 + AI_NOT_CONFIGURED, KEIN kostenpflichtiger Aufruf
```

**SHIP** `fix(security): remove hardcoded API keys, fail-closed on missing config`

---


## T-002 · Die zwei Deployments auflösen 🔴 P0 — ✅ ERLEDIGT (2026-09-30 live verifiziert)

**SPEC**
`scratch-n-travel-six.vercel.app` ist **kein zweites Produkt mehr**, sondern Staging derselben Codebase. Beide URLs liefern denselben Title, dasselbe `lang="de"`, und Produktion ist indexierbar.

**PLAN**
1. Rollen-Entscheidung dokumentieren: **`-six` = Staging**, Prod = alleinige öffentliche Domain.
2. `04.09.2026/index.html`: Figma-Platzhalter `<!-- figma:head-start -->` / `<!-- figma:title -->` durch **echte** Meta-Tags ersetzen (Vorlage: `AusbauÜberlegungen/Website analysis and badge creation/index.html`).
3. `04.09.2026/.figma/make/site.json`: `"robots": { "index": false }` entfernen, stattdessen per Env steuern.
4. Staging mit `X-Robots-Tag: noindex` Header absichern, damit es nie indexiert wird.
5. Rollen in `AGENTS.md` und README festhalten.

**TASKS**
- [x] `04.09.2026/index.html` auf echte SEO-Metas umgestellt
- [x] Staging-`noindex` via `vercel.json`-Header
- [x] Rollen-Doku in `AGENTS.md` + README
- [x] Live-Check beider URLs (2026-09-30 verifiziert)

**VERIFY**
```powershell
foreach($u in @('https://scratch-n-travel.vercel.app/','https://scratch-n-travel-six.vercel.app/')){
  $c=(Invoke-WebRequest $u -UseBasicParsing).Content
  "$u title=$([regex]::Match($c,'<title>(.*?)</title>').Groups[1].Value) noindex=$($c.Contains('noindex'))"
}
# Erwartung: beide = echter Titel, noindex=False
#            Six zusätzlich: X-Robots-Tag: noindex im Response-Header
```

**SHIP** `fix(deploy): real SEO meta in index.html, staging noindex via header`

---

## T-003 · `robots.txt` entsperren 🔴 P0 — ✅ ROBOTS ERLEDIGT, 🔶 DOMAIN OFFEN (SNT-108)

**SPEC**
Die Produktions-Site ist für Suchmaschinen zugänglich. `robots.txt` erlaubt Crawling und sperrt nur `/api/` und `/growth/`. `sitemap.xml` zeigt auf eine **existierende** Domain.

**PLAN**
1. Ausgangslage verifizieren (live: `User-agent: * / Disallow: /`).
2. Ersetzen durch:
   ```
   User-agent: *
   Allow: /
   Disallow: /api/
   Disallow: /growth

   Sitemap: https://<PROD-DOMAIN>/sitemap.xml
   ```
3. **Domain-Entscheidung:** `scratchntravel.com` löst **nicht auf** (DNS verifiziert). Entweder (a) Domain kaufen + auf Vercel routen, oder (b) Canonicals/Sitemaps auf die Vercel-URL umstellen. Langfristig ist (a) richtig.
4. `sitemap.xml`, `canonical` und `og:url` konsistent auf die gewählte Domain ziehen.
5. Search Console: Token `ad062dfe6cb025cf` liegt bereit → Property bestätigen.

**TASKS**
- [x] `robots.txt` (Root **und** `dist/`) korrigiert
- [ ] Domain-Entscheidung getroffen und umgesetzt — **einziger offener Punkt**
- [x] `sitemap.xml`, `canonical`, `og:url` konsistent

## T-004 · Erfundene Daten entfernen 🔴 P0 — ✅ ERLEDIGT (2026-09-30)

**SPEC**
Kein Element in der Oberfläche behauptet eine Zahl, ein Rating, eine Person oder eine Verknappung, die es nicht gibt. Fehlende Provenienz wird als solche angezeigt.

**PLAN**
1. `tours[]` in `data.ts`: Alle 10 Einträge mit erfundenen `creator`, `rating`, `reviews`, `likes` als `demo: true` markieren und im UI kennzeichnen — **oder** bis zum Relaunch aus der Oberfläche nehmen.
2. `cities[]`: `total`/`taken` entfernen. Künstliche Verknappung ist ein Dark Pattern und in DE angreifbar (§ 5 UWG).
3. `storyPins[]`: `locked`/`verified` prüfen — AI-Spots als „von Hermes generiert" kennzeichnen, nicht als „verifiziert".
4. `hermes_community_extender.js` (4 erzwungene Felder):
   - `rating: 5.0` → entfernen (kein Auto-Rating)
   - `coordinates || '38.7169° N, 9.1399° W'` → **Pflichtfeld** mit Validierung
   - `author || 'Community Explorer'` → **Pflichtfeld**
   - `country: 'Portugal / Europa'` → aus echten Geodaten ableiten
5. `HERMES_WEEKLY_REFLECTION_DIGEST.md` / `_REPORT.json`: `+28%`, `+42%`, `Confidence 0.94` als **`[UNVERIFIED PROJECTION]`** kennzeichnen.
6. `GrowthStudio.tsx`: `headline: 'Hör auf nach Mallorca…'` → aus `spot.country` generieren.
7. `Login.tsx`: „🔒 Encrypted locally" und „DSGVO compliant" entfernen oder erst nach echter Implementation wieder einfügen.

**TASKS**
- [x] `tours[]` Demo-geflaggt (`demo: true` in `data.ts` + UI-Kennzeichnung)
- [x] `cities[]` Fake-Scarcity (`taken`, Slots) restlos entfernt
- [x] `community_extender.js` 4 Felder korrigiert (Pflichtfelder `author`, `coordinates`, kein Auto-Rating `5.0`)
- [x] KI-Digest-Zahlen als `[UNVERIFIED PROJECTION]` markiert
- [x] `GrowthStudio` Headline dynamisch aus Geodaten
- [x] `Login.tsx` + `Pricing.tsx` DSGVO-/Verschlüsselungs-/BaFin-Versprechen bereinigt

**VERIFY**
```powershell
Select-String -Path scripts\*.js -Pattern 'rating:\s*5\.0'                                          # 0 Treffer
Select-String -Path 'verschiedene webseit versionen\04.09.2026\src\data\data.ts' -Pattern 'taken:' # 0 Treffer
Select-String -Path HERMES_WEEKLY_REFLECTION_*.md -Pattern '\+\d+%|Confidence Score 0\.9'            # nur mit [UNVERIFIED]-Marker
```
Manuell: `/pricing`, `/tours`, `/badges`, `/radar` im Browser — keine Zahl ohne Quelle.

**SHIP** `fix(trust): remove fabricated reviews, fake scarcity, auto-5-star ratings and unverified impact claims`

---

## T-005 · Merch-POD umsetzen (Printify) 🔴 P0 — 🔶 OFFEN (SNT-363…367)

**SPEC**
Die „Passport Edition"-Ersatz-Linie (Entscheidung SNT-360/361 steht) ist bei Printify real bestellbar: echte Produkt-/Variant-IDs statt Platzhalter, eine erfolgreiche Musterbestellung mit geprüfter Qualität, angepasster Stripe-Katalog, geprüfte Versandkosten/USt/GPSR.

**PLAN**
1. `PRINTIFY_API_KEY` + `PRINTIFY_SHOP_ID` im Printify-Dashboard erzeugen → Vercel-Env.
2. `PRINTIFY_PRODUCT_MAP` in `api/pod-orders.js`: Platzhalter-IDs durch echte Blueprint-/Variant-IDs ersetzen.
3. Produktname ohne Fremdmarken (SNT-362: keine „Scratch Map®"- etc. Angaben).
4. Musterbestellung: 1 Patch + 1 Poster → Lieferzeit + Druckqualität dokumentieren (`docs/POD_ORDERBARKEIT.md` ergänzen).
5. Stripe-Katalog (`assets/merch_stripe_catalog.json`) an die Ersatz-Linie angleichen.
6. Versandkosten, USt und GPSR-Regeln für Merch prüfen.

**TASKS**
- [ ] Printify-Keys in Vercel Env (SNT-363)
- [ ] Echte Blueprint-/Variant-IDs (SNT-364)
- [ ] Produktname ohne Fremdmarken (SNT-362)
- [ ] Musterbestellung + Qualitätscheck (SNT-365)
- [ ] Stripe-Katalog angleichen (SNT-366)
- [ ] Versand/USt/GPSR geprüft (SNT-367)

**VERIFY**
```powershell
# Echte Bestellung über die Live-URL auslösen (Testkarte), Antwort-Body prüfen:
Invoke-WebRequest https://scratch-n-travel.vercel.app/api/pod-orders -Method POST `
  -ContentType 'application/json' -Body '{"productSku":"SNT-PASS-LUX-01"}'
# Muss: 200 + orderReference; KEINE Platzhalter-IDs in der Vercel-Log
```
Musterware: Foto des Drucks in `docs/POD_ORDERBARKEIT.md`.

**SHIP** `feat(pod): real Printify product map, sample order verified, catalog aligned`

---

## T-006 · Abschließender Verify-Rundgang 🔴 P0 — 🔶 OFFEN (v1-Launch-Gate)

**SPEC**
Vor dem öffentlichen Launch gilt die App als „getestet": `check:all` ohne Befunde, manueller Rundgang über alle Routen ohne Konsolenfehler, ein echter Login überlebt Reload und Logout wirkt, Zahlungswege (Merch-Checkout, Beta-Pass) enden auf bestätigten Seiten.

**PLAN**
1. `npm run check:all` (typecheck + schema + ui + photo) — muss 0 liefern.
2. Browser-Rundgang über alle 23 Routen — Konsole leer, keine toten Buttons („Keine Befunde" aus `check:ui` bestätigen).
3. Echtes Supabase-Login → Reload → bleibt → Logout (setzt SNT-331/332 voraus).
4. Merch-Checkout im Testmodus + Beta-Pass-Flow klicken.
5. Lighthouse/Handy-Check: PWA-Install, Offline-Seite (`sw.js`).

**TASKS**
- [ ] `npm run check:all` = 0
- [ ] 23-Routen-Rundgang (Desktop + Handy) ohne Fehler
- [ ] Login → Reload → Logout (echte Session)
- [ ] Checkout-/Beta-Pas-Flow durchgeklickt
- [ ] PWA-Install + Offline-Test

**VERIFY**
```powershell
npm run check:all                 # Exit 0
# + manuelle Checkliste in docs/UEBERGABE ergänzen (Screenshots)
```

**SHIP** `chore(verify): full v1 acceptance run documented`

---

# PHASE 1 — Fundament (Woche 1–2, ~31 h)

> Ziel: Ein Nutzer kann sich **echt** anmelden, etwas **wirklich** speichern, und das ist **messbar**.

## T-101 · Eine einzige Quelle der Wahrheit 🔴 P1

**SPEC**
Es existiert genau **ein** `src/`-Ordner im Repo. Auf einem frischen Clone funktionieren `npm ci && npm run build`. Die CI baut exakt das, was deployed wird.

**PLAN**
1. **Quellentscheidung:** Quelle A (`Website analysis and badge creation`) ist funktional überlegen (Supabase, `Passport`, `WanderBond`) → **A wird kanonisch**.
2. `src/` an den Repo-Root ziehen (Verschieben, kein Kopieren). `package.json`, `vite.config.ts`, `tsconfig.json` folgen.
3. Quelle B nach `legacy/v6-04.09.2026/` verschieben — behalten, aber aus dem Build-Pfad.
4. `app.html` + `assets/js/` (39 Engines) nach `legacy/v5-legacy-engines/` verschieben. **Nicht löschen** — die Logik ist wertvoll.
5. `dist/` aus dem Git-Tracking nehmen (`git rm -r --cached dist`).
6. CI auf `npm ci && npm run build` umstellen, Artefakt per `actions/upload-artifact`, Vercel deployt das Artefakt.
7. `scripts/build_app.js` auf den neuen Root-Pfad umstellen.

**TASKS**
- [ ] Quelle A → `src/` an Root
- [ ] Quelle B → `legacy/`
- [ ] Legacy-Engines → `legacy/v5/`
- [ ] `dist/` aus Git-Tracking entfernt
- [ ] CI: echter Build + Artefakt-Upload
- [ ] `vercel.json`: `buildCommand` ergänzt
- [ ] `scripts/build_app.js` umgestellt

**VERIFY**
```powershell
git clone . ../clean-clone; cd ../clean-clone
npm ci && npm run build
Select-String -Path dist\index.html -Pattern 'Figma Make App'   # muss 0 Treffer geben
```
Repo-Größe nach dem Aufräumen: < 5 MB (statt 21 MB `dist`).

**SHIP** `refactor(repo): single source of truth at root, dist no longer committed`

---

## T-102 · Echtes Auth 🔴 P1

**SPEC**
Ein Nutzer kann sich mit Magic Link anmelden, seine Session überlebt einen Reload, und er kann sich abmelden. Ohne Session sieht der Nutzer den Login-Screen, keine Fake-„Willkommen"-Meldung.

**PLAN**
1. `src/services/supabase.ts` (existiert in Quelle A) übernehmen; `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in GitHub Secrets + Vercel.
2. `Login.tsx` aus Quelle A übernehmen (enthält `signInWithOtp` + `verifyOtp`).
3. **Session-Persistenz:** `supabase.auth.onAuthStateChange` → globaler `AuthContext` mit `useAuth()`.
4. `AuthGuard`-Wrapper für geschützte Routen (`/profile`, `/passport`, `/host`, `/growth`).
5. **Demo-Zugang nur im Demo-Modus:** `VITE_DEMO_MODE=true` → „Demo ansehen" **klar beschriftet**; in Prod aus.
6. Abmeldung implementieren (aktuell nur ein Link, kein Button = Bug).

**TASKS**
- [ ] Supabase-Env in Secrets + Vercel
- [ ] `AuthContext` + `useAuth()` Hook
- [ ] `signInWithOtp` / `verifyOtp` / `signOut` in `Login.tsx`
- [ ] `AuthGuard` für geschützte Routen
- [ ] `VITE_DEMO_MODE` mit sichtbarer Kennzeichnung
- [ ] Session überlebt Reload (manuell getestet)

**VERIFY**
1. Login mit echter E-Mail → Magic Link kommt an → Session aktiv
2. Reload → **bleibt angemeldet**
3. `/profile` ohne Session → Weiterleitung zu `/login`
4. Abmelden → `/profile` wieder gesperrt
5. In Prod ist **kein** Demo-Button sichtbar
6. `supabase.auth.getSession()` liefert eine Session (DevTools)

**SHIP** `feat(auth): real Supabase magic-link auth with session persistence and route guards`

---

- [ ] Search Console: Indexierung anstoßen

**VERIFY**
```powershell

## T-103 · RLS-Policies — Supabase benutzbar machen 🔴 P1

**SPEC**
Jede Tabelle hat eine korrekte RLS-Policy. Ein angemeldeter Nutzer kann sein eigenes Profil lesen und schreiben, und **nur** sein eigenes. Secret Spots sind für alle lesbar, aber nur der Besitzer ändert sie.

**PLAN**
> **Hintergrund:** `supabase_schema.sql:93-99` aktiviert RLS auf allen 6 Tabellen, definiert aber **0 Policies**. In Postgres liefert das für *jeden* Select/Insert/Update/Delete **0 Zeilen**. Die App funktioniert nur, weil sie ohnehin keine echten Queries absetzt — es ist eine Attrappe, kein Datenverlust.

1. Für jede der 6 Tabellen `CREATE POLICY`:
   - `profiles`: `SELECT` für `auth.uid() IS NOT NULL`; `INSERT/UPDATE/DELETE` nur `auth.uid() = id`
   - `secret_spots`: `SELECT` authentifiziert; `INSERT` nur `auth.uid() = created_by`; `UPDATE/DELETE` nur Besitzer
   - `travel_checklists`, `scratchbooks`: strikt owner-only
   - `hermes_city_brains`: `SELECT` authentifiziert, Schreiben nur `service_role`
   - `audit_logs`: **nur** `service_role` (nie von Clients lesbar)
2. `created_by uuid REFERENCES auth.users(id)` in `secret_spots` ergänzen — **fehlt aktuell komplett** (Grund, warum die Community-Extender keine echten User haben können).
3. Migration idempotent machen (`DROP POLICY IF EXISTS` vor `CREATE POLICY`).
4. `scripts/test_rls.js` schreiben, das mit dem `anon`-Key alle 6 Tabellen prüft.
5. **Neue Community-Tabellen** (Master-Plan §15) — erst nach dem RLS-Fix: `posts`, `comments`, `follows`, `messages`, `reports`, `meetups`.

**TASKS**
- [ ] 6 Basis-Policies
- [ ] `created_by` FK in `secret_spots`
- [ ] Idempotente Migration
- [ ] `scripts/test_rls.js`
- [ ] `anon`-Key-RLS-Test grün

**VERIFY**
```powershell
node scripts/test_rls.js
# anonym      -> 0 Zeilen (SELECT), kein INSERT
# angemeldet  -> eigenes Profil sichtbar, fremdes NICHT
# service_role -> voller Zugriff
```
Negativtest: Nutzer A versucht `UPDATE profiles SET ... WHERE id = <B>` → **0 Rows affected**.

**SHIP** `feat(db): add RLS policies, created_by FK and RLS test harness`

---

## T-104 · Analytics — ohne das ist alles andere blind 🟡 P1

**SPEC**
Jede Kernaktion erzeugt ein Event mit `user_id` (sobald vorhanden) und `city`. Retention (D1/D7/D30) und Signup-Conversion sind **berechenbar**, nicht geschätzt.

**PLAN**
1. Analytics wählen: **Plausible** (cookieless, DSGVO-freundlich, ~1 KB) — passt zum Markt und zum eigenen DSGVO-Versprechen.
2. `src/lib/analytics.ts` mit `track(event, props)` — dünne Wrapper, keine Vendor-SDKs in Components.
3. Mindestens 12 Events: `page_view`, `signup_started`, `signup_completed`, `login_completed`, `spot_viewed`, `spot_submitted`, `spot_claimed`, `match_completed`, `concierge_query`, `meetup_joined`, `badge_earned`, `share_clicked`.
4. Datenschutz: **keine** GPS-Koordinaten, **keine** exakten Zeiten, IP-Anonymisierung aktiv.
5. Domain-Property auf die **echte** Domain setzen (nicht auf `scratchntravel.com`, solange die nicht existiert).

**TASKS**
- [ ] Plausible-Script + Property
- [ ] `analytics.ts` Wrapper
- [ ] 12 Events instrumentiert
- [ ] Datenschutz-Absatz in der DSE
- [ ] Events im Plausible-Dashboard sichtbar

**VERIFY**
```powershell
$b = (Invoke-WebRequest https://<PROD>/assets/<bundle>.js -UseBasicParsing).Content
foreach($t in @('facebook.com/tr','doubleclick','hotjar','clarity')){ if($b.Contains($t)){ "FAIL: $t" } }
# PASS: keine Ausgabe
```
Dann: Signup im Browser durchlaufen → Event erscheint im Dashboard **innerhalb 60 s**.

**SHIP** `feat(analytics): privacy-first Plausible with 12 core events`

---

## T-105 · Rechtstexte & Sicherheits-UI 🟡 P1

**SPEC**
Jede Pflichtseite existiert, ist verlinkt und inhaltlich korrekt. Im Login stehen keine Behauptungen mehr, die nicht wahr sind.

**PLAN**
1. `src/pages/Impressum.tsx` — **§ 5 DDG**: Anbieter, ladungsfähige Adresse, Kontakt, USt-IdNr., Verantwortlicher § 18 MStV, EU-Streitschlichtung, Verbraucherstreitbeilegung.
2. `src/pages/Datenschutz.tsx` — DSGVO: Verantwortlicher, Rechtsgrundlagen, **Supabase** (Auftragsverarbeiter), **Stripe**, **Plausible**, **Leaflet/OpenStreetMap/Tile-Server**, Auskunftsrecht, Widerspruch, Löschung.
3. `src/pages/Terms.tsx` — AGB: **Offline-Disclaimer** (Pflicht laut Master-Plan), Verhaltensregeln, Report/Block, Haftungsausschluss.
4. `src/pages/Safety.tsx` — Report/Block-UI, Notfallhinweise.
5. In `Layout.tsx` Footer verlinken (verifiziert: **aktuell keine Legal-Links**).
6. `Login.tsx`: „DSGVO compliant" / „Encrypted locally" entfernen → durch korrekte Aussage ersetzen.

**TASKS**
- [ ] Impressum (§ 5 DDG, § 18 MStV, VSBG)
- [ ] Datenschutz (alle Auftragsverarbeiter benannt)
- [ ] AGB mit Offline-Disclaimer
- [ ] Safety-Seite mit Report/Block
- [ ] Footer-Links
- [ ] Login-Claims korrigiert

**VERIFY**
1. `/impressum`, `/datenschutz`, `/terms`, `/safety` liefern 200
2. Jeder Footer-Link führt zur Seite (kein `href="#"`)
3. Rechtstexte **vor** dem ersten echten Nutzer juristisch prüfen lassen
4. Abnahme: keine Aussage im Login, die nicht belegbar ist

**SHIP** `feat(legal): Impressum, Datenschutz, AGB with offline disclaimer, safety UI`

---

(Invoke-WebRequest https://<PROD>/robots.txt -UseBasicParsing).Content  # Allow: /
(Invoke-WebRequest https://<DOMAIN>/ -UseBasicParsing -TimeoutSec 20)   # muss 200 sein
```
Zusätzlich: Google Rich Results Test → JSON-LD fehlerfrei.

**SHIP** `fix(seo): unblock robots.txt, align canonical + sitemap on real domain`

---


# PHASE 2 — Community-Kern (Woche 3–5, ~33 h)

> Ziel: Aus einem Katalog wird ein Netzwerk. Ohne diese Features ist die Plattform ein Buch, kein Ort.

## T-201 · Secret Spots persistent machen 🟢 P2

**SPEC**
Ein eingereichter Spot überlebt einen Reload, ist einem echten User zugeordnet, erscheint im Explore und kann von anderen gesehen werden.

**PLAN**
1. `SubmitSpotModal` (Quelle A) an `src/` übernehmen.
2. `Insert` nach `secret_spots` mit `created_by = auth.uid()`.
3. Pflichtfelder: Titel, Beschreibung, **Koordinaten** (verifiziert im Geo-Bereich der Stadt), Kategorie, Foto-URL.
4. **Provenienz-Pflicht** (Lehre aus T-004): Jeder Spot trägt `source` ∈ `{local_submitted, ai_seeded, partner}` und ein sichtbares Label. AI-Seeded ≠ „verifiziert".
5. Read-Pfad: `Explore.tsx` lädt aus Supabase, `data.ts` nur als Fallback bei leerer DB.
6. Rate-Limiting: max 5 Einreichungen pro User pro Tag.

**TASKS**
- [ ] `SubmitSpotModal` integriert
- [ ] Insert mit `created_by`
- [ ] Pflichtfeld-Validierung (inkl. Koordinaten)
- [ ] `source`-Feld + sichtbares Label
- [ ] Read-Pfad in `Explore.tsx`
- [ ] Rate-Limit

**VERIFY**
1. Spot einreichen → Reload → **noch da**
2. Spot erscheint in `/explore` und auf der Karte
3. Konsole: `secret_spots.created_by` = eigene `auth.uid()`
4. Einreichen ohne Koordinaten → Formular blockt mit verständlicher Meldung
5. AI-Seeded-Spot zeigt „KI-generiert", nicht „verifiziert"

**SHIP** `feat(spots): persistent secret spots with created_by FK, provenance labels and rate limiting`

---

## T-202 · „Spot verifizieren" 🟢 P2

**SPEC**
Ein Local kann einen AI-generierten Spot als „ich kenne den" markieren. Ab 3 unabhängigen Bestätigungen wechselt der Status von `ai_seeded` auf `local_verified`.

**PLAN**
1. `spot_verifications`-Tabelle: `spot_id`, `user_id`, `created_at`, `UNIQUE(spot_id, user_id)`.
2. Zähler schaltet auf `local_verified`, sobald `count(distinct user_id) >= 3`.
3. UI: Auf der Spot-Detailseite „Ich kenne diesen Spot" für Locals.
4. **Anti-Spoofing:** 1 Stimme pro User, `UNIQUE`-Constraint, `user_id != spot.created_by`.
5. Audit-Log in `audit_logs` schreiben (Tabelle existiert bereits).

**TASKS**
- [ ] `spot_verifications` Tabelle + RLS
- [ ] `UNIQUE(spot_id, user_id)` Constraint
- [ ] Status-Übergang bei 3 Stimmen
- [ ] UI-Button + Flow
- [ ] Audit-Log-Eintrag

**VERIFY**
1. 3 verschiedene User bestätigen → Status wechselt auf `local_verified`
2. Derselbe User doppelt → abgelehnt (Constraint)
3. Der Spot-Ersteller selbst → keine Stimme
4. Anonyme User → abgelehnt

**SHIP** `feat(spots): local verification with 3-independent-confirmation threshold`

---

## T-203 · Nachrichten & Beziehungen 🟢 P2

**SPEC**
Zwei Nutzer, die sich auf einem Spot begegnet sind, können sich kontaktieren. Kein Swiping, keine Dating-Mechanik — Einladung mit Kontext.

**PLAN**
1. Tabellen: `follows`, `messages`, `message_reports` (jeweils mit RLS, `created_by`).
2. **Kontaktaufnahme nur mit Kontext:** „Ich war bei [Spot] am [Datum]" — kein Cold-Pitch.
3. Rate-Limit: 5 neue Kontakte pro Tag, 20 Nachrichten pro Stunde.
4. Sofortiges Blockieren/Reportieren in jeder Konversation.
5. Keine exakten Live-Standorte — nur Stadt/Ebene, wie im Master-Plan gefordert.
6. Moderation: Link-/Spam-Filter, manuelle Review-Queue.

**TASKS**
- [ ] 3 Tabellen + RLS
- [ ] Kontext-basierte Kontaktaufnahme
- [ ] Rate-Limits
- [ ] Block/Report in jeder Konversation
- [ ] Moderations-Queue

**VERIFY**
1. A folgt B → B sieht Follow
2. A schreibt B aus Spot-Kontext → Nachricht trifft an
3. B blockiert A → A kann nicht mehr schreiben
4. 21. Nachricht in der Stunde → abgelehnt
5. Exakte Koordinaten kommen im Chat **nicht** vor

**SHIP** `feat(social): context-based messaging, follows, blocking and moderation queue`

---

## T-204 · Der erste Meetup — manuell, nicht automatisch 🟢 P2

**SPEC**
Ein erstes Offline-Meetup mit 6–8 Personen in Lissabon findet statt, **bevor** irgendein Meetup-Feature gebaut wird. Ohne dieses Beweiserlebnis ist ein Meetup-Feature reine Spekulation.

**PLAN**
1. Meetup **ohne Software**: WhatsApp-Gruppe + fester Ort + fester Termin.
2. Einladungstext erklärt die Besonderheit: „Ein Local zeigt 3 Orte, die er sonst niemandem zeigt." Kein Pitch.
3. Vorab: kurzer Leitfaden (Sicherheit, Anfahrt, Erwartungen) + Notfallkontakt.
4. Nachher: **eine einzige** Frage an alle — „Würdest du wiederkommen?" — schriftlich festhalten.
5. Ergebnis als 1 Seite dokumentieren: Teilnehmerzahl, Dauer, Verbindungen, was schiefging.
6. **Erst danach** entscheiden, ob ein In-App-Meetup-Feature gebaut wird.

**TASKS**
- [ ] Termin, Ort, 6–8 Teilnehmer organisiert
- [ ] Einladungstext + Sicherheits-Leitfaden
- [ ] Durchgeführt und dokumentiert
- [ ] Ergebnis als 1-Seiten-Report
- [ ] Feature-Entscheidung dokumentiert

**VERIFY**
1. Meetup hat stattgefunden (Datum, Ort, Teilnehmerzahl)
2. „Würdest du wiederkommen?" bei **mindestens 50 %** = ja
3. Es entstand **mindestens eine** konkrete Verbindung
4. Feature-Entscheidung ist schriftlich festgehalten


# PHASE 3 — System gesund machen (Woche 6–8, ~22 h)

## T-301 · Automation bremsen 🟢 P2

**SPEC**
Die Hermes-Autopiloten erzeugen **Vorschläge**, keine Veröffentlichungen. Kein Skript kann Inhalt ohne menschliche Freigabe veröffentlichen.

**PLAN**
1. `hermes_social_growth_engine.js`: **Publikations-Pfad entfernen.** Webhook- und Telegram-Dispatch raus, nur noch Output als JSON nach `social_drafts/` (Entwurf, nicht Veröffentlichung).
2. `hermes_daily_spots_generator.js`: Output nur noch als **Vorschlag** in eine Review-Queue, nicht direkt in `secret_spots`.
3. `hermes_weekly_reflection.js`: **Alle Zahlen ohne Messdaten entfernen.** Stattdessen offene Fragen, Hypothesen, Widersprüche dokumentieren.
4. **Cron-Reduktion:** 3 Workflows → 1. Täglicher Autopilot (06:00) pausieren, bis Phase 4 steht.
5. `GrowthStudio`-Seite: aus dem öffentlichen Routing nehmen, hinter Admin-Flag legen (aktuell öffentlich unter `/growth` erreichbar).

**TASKS**
- [ ] Webhook-Dispatch entfernt
- [ ] Telegram-Dispatch entfernt
- [ ] Seeder → Review-Queue statt Direkt-Insert
- [ ] Reflection ohne erfundene Zahlen
- [ ] Cron von 3 auf 1 reduziert
- [ ] `/growth` hinter Admin-Flag

**VERIFY**
```powershell
Select-String -Path scripts\*.js -Pattern 'TELEGRAM|GROWTH_WEBHOOK_URL'
# Nur noch in dokumentierten, deaktivierten Pfaden
```
Manuell: Ein Spot-Vorschlag erzeugt **keinen** DB-Eintrag ohne Freigabe.

**SHIP** `fix(automation): proposals-only pipelines, remove auto-publish, consolidate cron`

---

## T-302 · Tests als Grundlage 🟢 P2

**SPEC**
Drei Test-Typen laufen in der CI: Unit (Datenlogik), Integration (Supabase-Policies), Smoke (Build + Routen). Ein roter Test blockiert den Deploy.

**PLAN**
1. **Vitest** für Unit: `hobby-dna`-Scoring, Geo-Validierung, Provenienz-Logik.
2. **Playwright** für Smoke: alle 16 Routen liefern 200, Login-Flow, Spot-Submit-Flow.
3. **RLS-Integrationstests** in CI gegen ein Test-Supabase-Projekt (aus T-103).
4. CI-Reihenfolge: `lint → test → build → deploy`. Kein Deploy bei rotem Test.
5. Coverage-Ziel für Phase 3: **40 %** der Kernlogik (Auth, Spots, RLS, Scoring).

**TASKS**
- [ ] Vitest + Unit-Tests (Kernlogik)
- [ ] Playwright + Smoke-Tests (16 Routen)
- [ ] RLS-Integrationstests in CI
- [ ] `lint → test → build → deploy` verknüpft
- [ ] Coverage-Reporting

**VERIFY**
```powershell
npm test         # alle grün
npm run test:e2e # 16 Routen 200, Login + Submit durchlaufen
```
Gegenprobe: Ein absichtlich eingebauter Fehler lässt den Deploy **fehlschlagen**.

**SHIP** `test: add vitest unit, playwright smoke and RLS integration suites in CI`

---

## T-303 · Performance & Bundle 🟢 P2

**SPEC**
Das Bundle bleibt unter 500 KB gzip. Der Nutzer sieht auf 4G eine interaktive Seite in unter 3 Sekunden.

**PLAN**
1. Aktuell: **1.003.786 Bytes** unkomprimiertes Single-Bundle. Hauptverdächtige: `data.ts` (107 KB) fest einkompiliert, Leaflet, 4 Google-Fonts.
2. **Data-Splitting:** `data.ts` (113 Hobbies, 10 Tours, alle `storyPins`) in einen lazy geladenen Chunk verschieben.
3. Fonts: auf 2 Familien reduzieren oder `font-display: swap` + Preload.
4. Leaflet lazy laden (nur auf `/explore`, `/radar`, `/passport`).
5. Route-Level-Code-Splitting mit `React.lazy` (16 Seiten → 16 Chunks).
6. Bundle-Analyse im CI, Budget als harte Grenze.

**TASKS**
- [ ] `data.ts` lazy geladen
- [ ] Leaflet lazy
- [ ] `React.lazy` für alle 16 Seiten
- [ ] Fonts reduziert
- [ ] Bundle-Budget im CI (< 500 KB gzip)

**VERIFY**
```powershell
Get-ChildItem dist\assets\index-*.js | Select-Object Name,Length
# Summe deutlich < 1.003.786
```
Lighthouse (4G-Throttling): Performance ≥ 85, LCP < 2,5 s.

**SHIP** `perf: route-level splitting, lazy data and map chunks, enforce bundle budget`

---

# PHASE 4 — Wachstum (ab Woche 9, ~32 h)

> Voraussetzung: Phase 0–3 abgeschlossen und **messbar** grün. Details in `../COMMUNITY_GROWTH_STRATEGY_2026.md`.

## T-401 · City #1: Lissabon besetzen ⚪ P3

**SPEC**
50 Founding Locals, 150 verifizierte Spots, 6 Meetups pro Monat — **von Hand rekrutiert**, nicht per Automation.

**TASKS**
- [ ] Founding-Local-Angebot + Pflichten schriftlich (öffentlich auf einer URL)
- [ ] 5 Locals persönlich rekrutiert (Face-to-Face)
- [ ] 6 weitere über 5 Kanäle gewonnen
- [ ] Erste 30 Spots von Locals verifiziert
- [ ] 4 Meetups durchgeführt

**VERIFY**
1. Jeder Founding Local hat ein Profil **mit Foto und echter Biografie**
2. Jeder Spot hat `local_verified`, nicht `ai_seeded`
3. 4 Meetups mit Teilnehmerzahlen dokumentiert

---

## T-402 · Content-Maschine anwerfen ⚪ P3

**SPEC**
Der Magazin-Bereich (4 Artikel, bereits gut) wird zum Einstiegspunkt: **1 Stadtratgeber pro Monat**, rein redaktionell, mit echten Local-Quellen.

**TASKS**
- [ ] Redaktionsplan (1 Thema/Monat, 2.000 Wörter, 1 Local-Quelle)
- [ ] SEO-Technik: echte Canonical-Domain, interne Verlinkung, `Article`-Schema.org
- [ ] 4 bestehende Magazin-Artikel auf die echte Domain umstellen
- [ ] Newsletter (1×/Monat) als Owned Channel

**VERIFY**
1. Nach 3 Monaten: 3 Rankings in den Top 10 für „<Stadt> Geheimtipps lokal"
2. 1 Newsletter-Abonnent pro 100 registrierte Nutzer
3. Jeder Artikel nennt **mindestens einen** echten Local mit Namen

---

## T-403 · Monetarisierung ehrlich testen ⚪ P3

**SPEC**
Premium ist **kein Paywall-Zwang**, sondern ein bezahlter Vorteil. Der Pilot startet mit bezahlenden Locals, nicht mit zahlenden Reisenden.

**TASKS**
- [ ] Stripe-Produkte definieren (Free / Supporter / Local Pro)
- [ ] Supporter-Plan live (€5–9/Monat: unbegrenzte Kontakte, Secret-Spot-Reveals)
- [ ] 3 bezahlende Locals oder Businesses gewonnen
- [ ] Abmelde-Grund erhoben (Re-Retention-Befragung)

**VERIFY**
1. Mindestens 3 echte Zahlungen
2. Genutztes Feature, das nur im bezahlten Plan liegt
3. Kein Nutzer hat sich über eine Paywall beschwert (Umfrage)

---

**SHIP** Dokumentiert in `docs/MEETUP_001_REPORT.md` (kein Code-Commit)


# Anhang A — Reihenfolge & Abhängigkeiten

```
PHASE 0 (Tag 1–2)          T-001 Keys ─┐
                                       ├─ T-002 Deployments ─┐
                                       └─ T-003 robots ─────┼─ T-004 Fiktion
                                                             │
PHASE 1 (Woche 1–2)         T-101 Single Source ─────────────┘
                                       │
                                       ├─ T-102 Auth ─── T-103 RLS
                                       ├─ T-104 Analytics
                                       └─ T-105 Recht
                                              │
PHASE 2 (Woche 3–5)         T-201 Spots ─┐
                                       ├─ T-202 Verify
                                       └─ T-203 Nachrichten
                          T-204 Meetup (parallel, ohne Code)
                                              │
PHASE 3 (Woche 6–8)         T-301 Automation ─┤
                                       T-302 Tests ─┘
                                       T-303 Performance
                                              │
PHASE 4 (ab Woche 9)        T-401 City ─ T-402 Content ─ T-403 Monetarisierung
```

**Kritischer Pfad:** T-101 → T-102 → T-103 → T-201 → T-202 → T-203.
Ohne Auth und RLS ist keine Community-Funktion testbar.

---

# Anhang B — Aufwand

| Phase | Inhalt | Aufwand | Kalender |
|---|---|---|---|
| 0 | 4 Blocker | ~11 h | 2 Tage |
| 1 | Fundament | ~31 h | 2 Wochen |
| 2 | Community-Kern | ~33 h | 3 Wochen |
| 3 | System gesund | ~22 h | 3 Wochen |
| 4 | Wachstum | ~32 h + 10 h/Woche | offen |
| **Gesamt** | | **~129 h** | **~10 Wochen** |

**Parallel nötig (nicht im Code-Budget):** 4 h für die ersten 5 Locals, 4 h für Meetup #1. Das ist die Zeit, die kein Code ersetzt.

---

# Anhang C — Kill-Kriterien

Das Experiment wird gestoppt, nicht gestreckt, wenn eines dieser Kriterien greift:

| Zeitpunkt | Stopp-Bedingung |
|---|---|
| Nach Meetup #1 | Weniger als 50 % sagen „würde wiederkommen" |
| Nach 90 Tagen | Weniger als 40 aktive Locals **oder** D30-Retention unter 10 % |
| Nach 90 Tagen | Kein Nutzer hat einer anderen Person außerhalb der Plattform geschrieben |
| Nach 180 Tagen | City Health Score (Lissabon) < 50 trotz dokumentierter Meetup-Serie |
| Jederzeit | Die Mehrheit der Registrierungen sind Bot-/Test-Accounts (→ Automation stoppen, nicht die Produktarbeit) |

> Ein Kill-Kriterium zu erreichen ist **Information, kein Scheitern.** Es ist die billigste Möglichkeit, eine falsche Richtung rechtzeitig zu verlassen.

---

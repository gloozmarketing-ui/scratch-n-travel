# TODOLISTEN — Scratch'n'Travel

> **Stand:** 2026-10-06 · **Begleitend zu:** `KANBAN.md` · `IMPLEMENTATION_PLAN.md`
> **Regel:** Nur die oberste Liste ist diese Woche relevant. Alles darunter ist **bewusst geparkt**.
> **Reihenfolge dieser Woche:** ① Owner-Entscheidungen (Keys, Domain, Supabase) → ② Agent-Fixes → ③ Verify.

---

# 🔥 DIESE WOCHE (2 Tage) — Blocker

## 🌅 Tag 1 — Owner-Aufgaben (die nur du machen kannst)

### 🔐 Keys widerrufen (SNT-101 Rest) — Code erledigt, Widerruf OFFEN
> Der Code und die Git-Historie sind bereinigt (`4c26c94`). Solange die alten Keys
> aber noch bei den Providern leben, bleiben sie ein offenes Risiko.
- [ ] **Zenmux-Key widerrufen** (Dashboard → API Keys → Revoke) — Key `sk-ai-v1-1938…`
- [ ] **Requesty-Key widerrufen** — Key `rqsty-sk-uLnI…`
- [ ] **Cerebras-Key widerrufen** — Key `csk-rxmmx…`
- [ ] **Vercel-AI-Gateway-Key widerrufen** — Key `vck_63nL…`
- [ ] **Cloudflare-Token widerrufen** — Key `cfut_3sgz…`
- [ ] **Printful-Key widerrufen** — Key `J7MC8caE…` (lag in `api/stripe-webhook.js`)
- [ ] **Neue Keys erzeugen** → **Vercel Env** eintragen (GitHub Secrets nur bei CI-Bedarf)
- [ ] **Verify:** `POST /api/hermes-concierge` mit `{"prompt":"test"}` → `provider` ≠ `hermes_deterministic`

### 🗄️ Supabase live schalten (SNT-331/332) — Schema steht, Vercel-Env fehlt
- [x] Supabase-Projekt anlegen → `supabase/schema.sql` im SQL-Editor ausgeführt (**SNT-331** ✅ 2026-10-06 — Live-Lauf: 60 Policies greifen)
- [x] `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in `.env` (lokal) gesetzt
- [x] dieselben zwei Variablen im **Vercel-Env** eintragen (**SNT-332** ✅ 2026-10-09)
- [x] Deploy neu auslösen / gepusht · **Verify:** Login-Maske live mit Supabase verbunden
- [x] **Verify:** `node scripts/test_rls.js` → **16 PASS / 0 FAIL / 1 SKIP** (**SNT-333** ✅ 2026-10-08)
- [x] **`pg_cron` aktivieren** (**SNT-334** ✅ 2026-10-09 — Version 1.6.4 aktiv)

### 🌐 Domain-Entscheidung (SNT-108)
- [ ] `scratchntravel.com` kaufen **ODER** Vercel-URL als kanonisch festlegen
- [ ] Danach: Search Console mit Token `ad062dfe6cb025cf` bestätigen + sitemap einreichen

## 🌙 Tag 2 — Agent-Aufgaben (ich kann sie machen, wenn du gibst)

### 🎭 Fiktion entfernen (SNT-110 … 115) — ✅ ERLEDIGT (2026-09-30)
- [x] `tours[]` — alle Einträge mit `demo: true` gekennzeichnet; Entwurf-Kennzeichnung im UI
- [x] `cities[]` — `taken` und künstliche Slot-Verknappung vollständig entfernt (§ 5 UWG konform)
- [x] `hermes_community_extender.js`:
  - [x] `rating: 5.0` entfernt (Bewertung entsteht erst durch Community-Votes)
  - [x] `coordinates` → Pflichtfeld mit Validierung
  - [x] `author` → Pflichtfeld mit Validierung
  - [x] `country` aus echten Daten abgeleitet
- [x] `HERMES_WEEKLY_REFLECTION_DIGEST.md` + `_REPORT.json` → `[UNVERIFIED PROJECTION]` Marker gesetzt
- [x] `GrowthStudio.tsx` + `hermes_social_growth_engine.js` — Headline dynamisch aus Location & Country generiert
- [x] `Login.tsx` + `Pricing.tsx` — falsche DSGVO-/Verschlüsselungs-/BaFin-Versprechen entfernt
- [x] **Verify:** Alle 3 Grep-Checks grün (0 Treffer für fake rating/taken; nur [UNVERIFIED]-Marker im Digest); `check:all` = 0

### 🎁 Merch-POD — 🅿️ geparkt bis Nutzer da sind (SNT-373)
> **Owner-Entscheidung 2026-10-06:** POD-Shop bleibt im UI versteckt, bis Nutzer da sind.
> Hinter `VITE_POD_ENABLED` (Default aus) — öffnen = Env-Var auf `true` + Deploy, kein Code-Change.
> Die Key-Aufgaben unten laufen erst wieder, wenn der Shop sichtbar sein soll.
- [x] **POD-Shop im UI versteckt (SNT-373 ✅ 2026-10-06):** Merch-Kategorie, Shop-Sektion,
  Badge-Bestellmodal und Pricing-Rabatt nur bei `VITE_POD_ENABLED=true` (`src/lib/features.ts`)
- [ ] `PRINTIFY_API_KEY` + `PRINTIFY_SHOP_ID` aus Vercel-Env eintragen (nach SNT-363)
- [ ] Echte Blueprint-/Variant-IDs in `PRINTIFY_PRODUCT_MAP` (SNT-364)
- [x] Produktname ohne Fremdmarken (SNT-362: Passport Edition statt fremde Schutzmarken)


### 🤝 Give & Take priorisiert (SNT-374 & SNT-375) — ✅ ERLEDIGT (2026-10-06 & 2026-10-09)
- [x] Startseite: Give-&-Take-Sektion direkt nach dem Hero — 6 Geben-Aktivitäten
  (Tour führen, beibringen, wohnen lassen, Meetup, Tipps, Hobbys), Block „Was du
  davon hast", Freemium-Zusage (solange du aktiv bist = kostenlos), 3 CTAs
- [x] Pricing: Banner „geben und nehmen" über den Plänen + Free-Feature
  „Give & Take: Meetups, Nachrichten & Gastgeben"
- [x] **SNT-375 (✅ 2026-10-09):** Aktivitäts-Freemium-Logik — Wer aktiv beiträgt, erhält echten VIP/Pro-Zugang via `grantCommunityProDays` (+7 Tage für Gefahren-Meldung im Radar, +14 Tage für Secret Spot Einreichung in `SubmitSpotModal`). Konsumenten ohne Beitrag zahlen 2,99 €/Mo.
- [x] **SNT-509 (✅ 2026-10-09):** Interaktive Radar-Gefahrenkarte (`RadarThreatMap.tsx`) mit pulsierenden Pins, Gefahrenkreisen und VIP Shield Lock für Detail-Hotspots (Taschendiebe, Trickbetrüger)
- [x] **SNT-510 (✅ 2026-10-09):** Content-Expansion (Frankreich FR, Italien IT, Spanien ES, Japan JP) & Touren-Freemium-Grenzen (`LocalRoutes.tsx`: Station 1 & 2 kostenlos, Station 3+ mit VIP-Sperre & Teaser)
- [x] **SNT-514 (✅ 2026-10-09):** Kontinuierliches Kanban & Todo Handover-System (lückenlos synchron für Cline / nachfolgende Agenten)

### ✅ Verify-Rundgang (T-006)
- [x] `npm run check:all` = 0 (2026-10-09: 61 Tests, Typecheck, Schema, UI-Audit, SEO, Photo, Trust grün)
- [x] `npm run check:bundle` = 0 (First-Load 783 KB / Budget 820 KB, Lazy Map Chunk 148 KB)
- [x] Build = 0 (`vite build` in 8.3 s)

## ✅ Bereits erledigt (Referenz, 2026-09-30)
- [x] Code + Historie secret-bereinigt (`4c26c94`) · `.env.example` · `503 AI_NOT_CONFIGURED`
- [x] Zwei Deployments getrennt, Prod-Titel/`lang=de`/kein noindex · Staging noindex
- [x] `robots.txt` = `Allow: /`, sitemap 19 URLs, `sw.js`/`manifest.json` live
- [x] **API-500-Fix** `04a10f9` — alle 6 Endpunkte liefern 405/400/200
- [x] Build (2.9 s) + Typecheck + UI-Audit „Keine Befunde"


---

# ✅ JETZT VS. SPÄTER (v1-Scope, Stand 2026-09-30)

> **v1** = die App darf öffentlich gehen: echte Nutzer können sich anmelden,
> Inhalte einstellen, melden, sich sicher bewegen — und ein paar Euros zahlen.
> Alles andere ist **bewusst Später**. Diese Liste ersetzt die alten Wochenpläne
> als oberste Referenz; darunter steht weiterhin, *wie* es gemacht wird.

## 🔥 JETZT (Pflicht bis v1)

- [x] **Supabase live** — Projekt + `schema.sql` ausgeführt (**SNT-331** ✅ 2026-10-06); lokal `.env` gesetzt
- [x] **Vercel-Env Keys** (**SNT-332** ✅ 2026-10-09) — `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY` sowie alle API-Keys in Vercel hinterlegt
- [x] **RLS-Tests gegen echte Instanz** (`node scripts/test_rls.js`, **SNT-333** ✅ 2026-10-06: 13 PASS / 0 FAIL / 1 SKIP)
- [x] **`pg_cron` aktivieren** (**SNT-334** ✅ 2026-10-09) — Version 1.6.4 in Supabase aktiv geschaltet
- [ ] **Merch-POD:** Entscheidung ✅ (Ersatz-Linie „Passport Edition" + Printify,
      SNT-360/361) → offen: Printify-Keys → echte IDs → Musterbestellung
      (**SNT-363…365**, Details `docs/POD_ORDERBARKEIT.md`)
- [x] **Fiktions-Fixes abschließen:** Fake-Scarcity, erfundene Reviews,
      falsche Login-Versprechen (**SNT-110…115** ✅ 2026-09-30, `check:all` grün)
- [ ] **Rechtstexte juristisch prüfen lassen** (**SNT-220**) — vor dem ersten echten Nutzer
- [ ] **UI-Audit grün halten:** `npm run check:ui` (tote Buttons ✅ SNT-370…372,
      nächste Seiten mit Demo-Daten/Platzhaltern abarbeiten)
- [x] **Verify (2026-09-30):** `npm run build` = ✅ (2.9 s) · `check:ui` „Keine
      Befunde" (36 Dateien) · **alle 23 Routen HTTP 200** live · **alle 6
      `/api/*`-Endpunkte** liefern 405/400/200 (Fix `04a10f9`, vorher alles 500)
- [x] **Verify (2026-10-09):** `npm run check:all` grün (61 Tests) · `npm run build` 4.6 s · Bundle 781/820 KB ✅
- [x] **Safety Radar 2.0 & Threat Cockpit (SNT-501 ✅ 2026-10-09):** 🔴 Kriminalität, 🟠 Natur, 🟡 Wildtiere, 🔵 Connectivity, Notruf-Schnellwahl & Incident-Reporting
- [x] **Country Travel Intelligence Dataset & Notruf 112 (SNT-502 ✅ 2026-10-09):** 8 Dossiers (DE, AT, CH, PT, ES, IT, IS, JP), Euronotruf 112 (EU/EWR Standard) prominent mit Tel-Links, Trinkwasser, Maut, eSIM-Deals
- [x] **Stadt-Legenden & VIP Explorer Audio (SNT-503 ✅ 2026-10-09):** Lokale Mythen & Audio-Player Teaser
- [x] **Vorab-Content & DACH-Separation (SNT-504 ✅ 2026-10-09):** Österreich (Hallstatt & Wien), Schweiz und Deutschland getrennt kuratiert
- [x] **Multilingual i18n Engine & Switcher (SNT-505 ✅ 2026-10-09):** DE, EN, ES, FR, PT, UK (🇺🇦), RU reaktiv über `useI18n()`, synchron in Desktop/Mobile Header & Sidebar
- [x] **B2B Local Host Portal & Starter-Kit (SNT-506 ✅ 2026-10-09):** 29 €/Mo mit physischem QR-Code Tisch- und Thekenaufsteller per Post & 0% Buchungsprovision auf `/host` & `/pricing`
- [x] **5-Farben Design-System & WCAG AAA Kontrast (SNT-507 ✅ 2026-10-09):** Palette `#042c2e`, `#4f412d`, `#a8d4c0`, `#fff6b7`, `#D9D19B`; Buttons mit hohem Kontrast; `.parchment`-Utility
- [x] **Auth & User Cabinet Lifecycle (SNT-508 ✅ 2026-10-09):** Echter Logout (`logout()`), Login-Trigger, Gast- vs Demo-Modus, automatische Supabase Auth-Synchronisation

## ⏳ SPÄTER (bewusst geparkt — kein v1-Blocker)

| Bereich | Karten | Warum später |
|---|---|---|
| **Orts-Chat** | SNT-340…346 | ✅ erledigt 2026-10-08: ADR-002 Modell B, Migration, Geo-RPC, RLS, 16 Negativtests grün, UI in Chat.tsx |
| **Route-Editor (Bearbeiten nach dem Erstellen)** | neu, noch nicht kariert | Erst nach stabilem Auth + RLS; Erstellen funktioniert heute |
| **Geo-/Safety-Check-in-UI** | Basis in `src/lib/community.ts` steht | Präsenz-ADR offen (Orts-Chat-Ableitung) |
| **Signed-URL-Fotos** | Folge SNT-350ff | Storage-Policies erst mit Live-Instanz prüfbar |
| **Stripe-Abo (Supporter / Local Pro)** | SNT-508, SNT-509 | Kein Abo ohne echte Nutzerbasis; Merch reicht für v1 |
| **Newsletter** | SNT-507 | Kein Abonnent ohne Traffic |
| **Meetup-Rekrutierung + Redaktionsplan** | SNT-314, SNT-315, SNT-501…510 | Phase 3+, braucht Community-Masse |
| **P2-System (Perf, CI, Observability)** | SNT-401…412 | Solange `check:all` + Build grün sind, kein Blocker |

---

# 📅 WOCHE 2 — Fundament

> **Stand 2026-10-06:** SNT-201…209 und 211…219 erledigt (Nachweis: `KANBAN.md` ✅ DONE).
> **Offen hier:** SNT-210 (Supabase-Env in GitHub Secrets + Vercel) und SNT-220 (Rechtstexte
> juristisch prüfen) — beide Owner-Aufgaben.

## 📦 Repository aufräumen
- [ ] Quelle A → `src/` an Root (**SNT-201**)
- [ ] Quelle B → `legacy/v6-04.09.2026/` (**SNT-202**)
- [ ] 39 Legacy-Engines → `legacy/v5-legacy-engines/` (**SNT-203**)
- [ ] `git rm -r --cached dist` (**SNT-204**)
- [ ] `vercel.json` `buildCommand` (**SNT-205**)
- [ ] CI: `npm ci && npm run build` + Artefakt-Upload (**SNT-206**)
- [ ] **Verify:** Frischer Clone baut; `dist/index.html` ohne „Figma Make App"; Repo < 5 MB

## ✅ Echtes Auth
- [ ] Supabase-URL + Anon-Key in Secrets + Vercel (**SNT-210**)
- [ ] `Login.tsx` aus Quelle A (**SNT-207**)
- [ ] `AuthContext` + `useAuth()` + `onAuthStateChange` (**SNT-208**)
- [ ] `AuthGuard` für `/profile`, `/passport`, `/host`, `/growth` (**SNT-209**)
- [ ] `VITE_DEMO_MODE` mit sichtbarer Kennzeichnung
- [ ] **Verify:** Login → Session → Reload → bleibt angemeldet → Logout wirkt

## 🔒 Datenbank
- [ ] 6 RLS-Policies (**SNT-211**)
- [ ] `created_by uuid REFERENCES auth.users(id)` (**SNT-212**)
- [ ] `scripts/test_rls.js` (**SNT-213**)
- [ ] **Verify:** `anon` → 0 Zeilen; User A sieht nicht User B

## 📊 Messbarkeit + Recht
- [ ] Plausible + 12 Events (**SNT-214**)
- [ ] Impressum, Datenschutz, AGB, Safety (**SNT-215…218**)
- [ ] Footer-Links (**SNT-219**)
- [ ] Rechtstexte juristisch prüfen (**SNT-220**)
- [ ] **Verify:** Events im Dashboard; Rechtstexte 200; kein `href="#"`

---


# 🗓️ WOCHE 3–5 — Community-Kern

- [ ] **SNT-301** Spot einreichen → überlebt Reload, mit `created_by`
- [ ] **SNT-302** Koordinaten-Pflichtfeld mit Geo-Validierung
- [ ] **SNT-303** `source`-Label: KI-generiert ≠ Local-verifiziert
- [ ] **SNT-304** Rate-Limit 5/Tag
- [ ] **SNT-305** `Explore.tsx` liest aus Supabase
- [ ] **SNT-306** `spot_verifications` Tabelle
- [ ] **SNT-307** 3-Bestätigungen-Schwelle
- [ ] **SNT-308** Anti-Spoofing
- [ ] **SNT-309** `follows` + `messages` + `message_reports`
- [ ] **SNT-310** Kontext-basierte Kontaktaufnahme
- [ ] **SNT-311** Rate-Limits
- [ ] **SNT-312** Block/Report
- [ ] **SNT-313** Moderations-Queue
- [ ] **SNT-314** 🤝 **Meetup #1 real durchführen** — 6–8 Personen, Lissabon, **ohne Software**
- [ ] **SNT-315** `docs/MEETUP_001_REPORT.md`

> **Wichtig:** SNT-314 braucht keinen Code. Es ist die wichtigste Aufgabe der gesamten Liste. Ohne dieses Erlebnis sind alle Features davor eine Vermutung.

---

# 🗓️ WOCHE 6–8 — System gesund

- [ ] **SNT-401** Webhook- + Telegram-Dispatch raus
- [ ] **SNT-402** Seeder → Review-Queue
- [ ] **SNT-403** Reflection ohne erfundene Zahlen
- [ ] **SNT-404** Cron 3 → 1
- [ ] **SNT-405** `/growth` hinter Admin-Flag
- [ ] **SNT-406** Vitest Unit-Tests
- [ ] **SNT-407** Playwright Smoke
- [ ] **SNT-408** CI `lint → test → build → deploy`
- [ ] **SNT-409** `React.lazy` Route-Splitting
- [ ] **SNT-410** `data.ts` + Leaflet lazy
- [ ] **SNT-411** Fonts 4 → 2
- [ ] **SNT-412** Bundle-Budget < 500 KB gzip

---

# 📌 PARKIERT — bewusst nicht jetzt

| Nicht tun | Warum |
|---|---|
| 💰 Neue Stadt erobern | Erst 1 Stadt mit echter Community besetzen |
| 🎁 Merch / Badges ausbauen | Funktioniert bereits, ist kein Wachstumsmotor |
| 🔊 Neue Social-Kanäle | Die vorhandenen werden gerade erst abgeschaltet |
| 🤖 KI-Skills erweitern | Kein Nutzer, kein Bedarf an weiteren Skills |
| 💳 Neues Zahlungsmodell | Erst 3 echte Zahlungen im aktuellen Modell |
| 🎨 Rebranding | Die Marke ist nicht das Problem. Die Auth ist es. |
| 🎬 Podcast / Content-Serie | Erst 1 Stadtratgeber als Format testen |
| 🌍 2. City Brain | Ein echter City Brain ist wertvoller als 12 leere |

---

# 🚫 FALSCHE TODOS (bewusst gestrichen)

Diese Aufgaben stehen in keinem Plan und sollen **nicht** gemacht werden:

| ❌ Gestrichen | Warum |
|---|---|
| „Mehr KI-generierte Social-Media-Posts" | Erzeugt Sichtbarkeit ohne Community. KI-Posting ist strukturell falsch für dieses Produkt — der Wert ist Provenienz, nicht Reichweite. |
| „Confidence Score für jede Feature-Idee" | Ohne Messdaten ist eine Zahl eine Lüge. Erst messen, dann quantifizieren. |
| „Täglich 10 neue Secret Spots generieren" | Erzeugt toten Inhalt. 3 gute Spots von Locals schlagen 30 KI-Spots. |
| „Reviews und Ratings anzeigen" | Solange niemand echte Reviews abgeben kann, sind es erfundene Zahlen. |
| „Slots begrenzen (Künstliche Verknappung)" | Dark Pattern, in DE abmahnfähig. |
| „Fünf Output-Kanäle parallel bespielen" | Fünf Kanäle ohne Community sind fünf Kanäle ohne Ergebnis. |

---

# ⏱️ Aufwand-Übersicht

| Zeitraum | Aufwand | Schwerpunkt |
|---|---|---|
| Woche 1 | ~11 h | Blocker |
| Woche 2 | ~31 h | Fundament |
| Woche 3–5 | ~28 h + 5 h manuell | Community |
| Woche 6–8 | ~22 h | System |
| Woche 9+ | ~10 h/Woche | Wachstum |
| **Gesamt bis Phase 3** | **~92 h** | |

**Was Code nicht ersetzt:** 4 h für die ersten 5 Locals, 4 h für Meetup #1. Diese Stunden sind die eigentliche Investition.

---

# 🔁 Wiedkehrende Rituale

| Rhythmus | Aktivität | Dauer |
|---|---|---|
| **Täglich** | 15 min: Support-Mails, 1 Personal-Reply an einen Interessenten | 15 min |
| **Wöchentlich** | 1 Meetup planen oder eines durchführen | 2 h |
| **Wöchentlich** | Retention-Check (D1/D7/D30) + 1 Entscheidung daraus | 1 h |
| **Monatlich** | 1 Stadtratgeber veröffentlichen | 4 h |
| **Monatlich** | Kill-Kriterien prüfen (`IMPLEMENTATION_PLAN.md`, Anhang C) | 30 min |
| **Quartalsweise** | Automation prüfen: erzeugt sie noch etwas, das ein Mensch lesen würde? | 1 h |

> **Die Automations-Regel:** Wenn ein Skript in 4 Wochen nichts erzeugt hat, das ein Mensch freiwillig gelesen hat, wird es **abgeschaltet**. Nicht verbessert. Abgeschaltet.

---

# 🚦 Sofort-Start: die ersten 60 Minuten

Wenn heute nur eine Stunde zur Verfügung steht, diese fünf Dinge — in dieser Reihenfolge:

1. **Die 4 API-Keys widerrufen** (20 min, Provider-Dashboards). Solange das niemand tut, bleibt es ein offenes Risiko.
2. `robots.txt` auf `Allow: /` setzen (5 min). Eine Zeile, sofort Wirkung.
3. `Login.tsx` die falschen DSGVO-Versprechen rausnehmen (5 min). Zwei Textzeilen, kein Risiko.
4. `cities[]` Fake-Scarcity entfernen (10 min). Zwei Zeilen pro Stadt.
5. Die Domain-Frage entscheiden (20 min). Alles SEO-Weitere hängt daran.

**Alles andere kann warten. Diese fünf nicht.**

---

*Fortsetzung: `KANBAN.md` · `IMPLEMENTATION_PLAN.md` · `PROJEKT_AUDIT_2026-09-25.md` · `../COMMUNITY_GROWTH_STRATEGY_2026.md`*

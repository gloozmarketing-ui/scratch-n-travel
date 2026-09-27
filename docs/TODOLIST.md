# TODOLISTEN — Scratch'n'Travel

> **Stand:** 2026-09-25 · **Begleitend zu:** `KANBAN.md` · `IMPLEMENTATION_PLAN.md`
> **Regel:** Nur die oberste Liste ist diese Woche relevant. Alles darunter ist **bewusst geparkt**.

---

# 🔥 DIESE WOCHE (2 Tage) — Blocker

## 🌅 Tag 1 — Sicherheit + Wahrheit

### 🔐 Keys (SNT-101 … 103)
- [ ] **Zenmux-Key widerrufen** (Dashboard → API Keys → Revoke) — Key `sk-ai-v1-1938…`
- [ ] **Requesty-Key widerrufen** — Key `rqsty-sk-uLnI…`
- [ ] **Cerebras-Key widerrufen** — Key `csk-rxmmx…`
- [ ] **Vercel-AI-Gateway-Key widerrufen** — Key `vck_63nL…`
- [ ] Neue Keys erzeugen, in **GitHub Secrets** + **Vercel Env** eintragen
- [ ] `api/hermes-concierge.js` Z. 15, 28, 41, 52: `|| '…'` → `|| null`
- [ ] Provider-Skip: fehlender Key → Provider wird übersprungen
- [ ] Alle Keys weg → `503 { error: 'AI_NOT_CONFIGURED' }`
- [ ] `.env.example` mit 10 Variablen anlegen
- [ ] **Verify:** Grep auf Key-Muster ergibt **0 Treffer**

### 🤖 Fiktion entfernen (SNT-110 … 115)
- [ ] `tours[]` — 10 Einträge prüfen, `demo: true` setzen oder entfernen
- [ ] `cities[]` — `total`/`taken` raus (Fake-Scarcity = § 5 UWG)
- [ ] `hermes_community_extender.js`:
  - [ ] `rating: 5.0` entfernen
  - [ ] `coordinates` → Pflichtfeld
  - [ ] `author` → Pflichtfeld
  - [ ] `country` aus echten Daten
- [ ] `HERMES_WEEKLY_REFLECTION_DIGEST.md` + `_REPORT.json` → `[UNVERIFIED PROJECTION]` Marker
- [ ] `GrowthStudio.tsx` — Headline aus `spot.country` generieren
- [ ] `Login.tsx` — „DSGVO compliant" / „Encrypted locally" raus
- [ ] **Verify:** Greps greifen nicht mehr; `/tours`, `/pricing`, `/badges` manuell geprüft

## 🌙 Tag 2 — Auslieferung + SEO

### 🌐 Zwei Deployments (SNT-104 … 106)
- [ ] `04.09.2026/index.html` — Figma-Platzhalter durch echte Meta-Tags ersetzen
- [ ] `.figma/make/site.json` — `"robots": { "index": false }` korrigieren/entfernen
- [ ] `vercel.json` — Staging (`-six`) mit `X-Robots-Tag: noindex`
- [ ] `AGENTS.md` + README — Rollen von Prod und Staging dokumentieren
- [ ] **Verify:** Beide URLs liefern Titel, `lang="de"`, kein `noindex`

### 📖 robots + Domain (SNT-107 … 109)
- [ ] `robots.txt` (Root + `dist/`): `Disallow: /` → `Allow: /`, `/api/` + `/growth/` sperren
- [ ] **Entscheidung:** `scratchntravel.com` kaufen ODER Vercel-URL als kanonisch
- [ ] `sitemap.xml`, `canonical`, `og:url` konsistent ziehen
- [ ] Search Console mit Token `ad062dfe6cb025cf` bestätigen
- [ ] **Verify:** `robots.txt` zeigt `Allow: /`; Domain antwortet mit 200

---

# ✅ JETZT VS. SPÄTER (v1-Scope, Stand 2026-09-27)

> **v1** = die App darf öffentlich gehen: echte Nutzer können sich anmelden,
> Inhalte einstellen, melden, sich sicher bewegen — und ein paar Euros zahlen.
> Alles andere ist **bewusst Später**. Diese Liste ersetzt die alten Wochenpläne
> als oberste Referenz; darunter steht weiterhin, *wie* es gemacht wird.

## 🔥 JETZT (Pflicht bis v1)

- [ ] **Supabase live** — Projekt anlegen, `supabase/schema.sql` ausführen,
      `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in `.env` und Vercel
      (**SNT-331, SNT-332**) — blockiert alles Live-Testbare
- [ ] **RLS-Tests gegen echte Instanz** (`node scripts/test_rls.js`, **SNT-333**)
- [ ] **`pg_cron` aktivieren** — sonst bleiben Fotos dauerhaft `in_delay` (**SNT-334**)
- [ ] **Merch-POD:** Entscheidung ✅ (Ersatz-Linie „Passport Edition" + Printify,
      SNT-360/361) → offen: Printify-Keys → echte IDs → Musterbestellung
      (**SNT-363…365**, Details `docs/POD_ORDERBARKEIT.md`)
- [ ] **Fiktions-Fixes abschließen:** Fake-Scarcity, erfundene Reviews,
      falsche Login-Versprechen (**SNT-110…115**)
- [ ] **Rechtstexte juristisch prüfen lassen** (**SNT-220**) — vor dem ersten echten Nutzer
- [ ] **UI-Audit grün halten:** `npm run check:ui` (tote Buttons ✅ SNT-370…372,
      nächste Seiten mit Demo-Daten/Platzhaltern abarbeiten)
- [ ] **Verify:** `npm run check:all` + `npm run build` = 0 · manueller
      Rundgang über alle 22 Routen · ein echter Login → Reload → Logout

## ⏳ SPÄTER (bewusst geparkt — kein v1-Blocker)

| Bereich | Karten | Warum später |
|---|---|---|
| **Orts-Chat** | SNT-340…346 | Sicherheits-ADR offen; braucht Live-Backend + Kanal-Token; kein Kern-Flow |
| **Route-Editor (Bearbeiten nach dem Erstellen)** | neu, noch nicht kariert | Erst nach stabilem Auth + RLS; Erstellen funktioniert heute |
| **Geo-/Safety-Check-in-UI** | Basis in `src/lib/community.ts` steht | Präsenz-ADR offen (Orts-Chat-Ableitung) |
| **Signed-URL-Fotos** | Folge SNT-350ff | Storage-Policies erst mit Live-Instanz prüfbar |
| **Stripe-Abo (Supporter / Local Pro)** | SNT-508, SNT-509 | Kein Abo ohne echte Nutzerbasis; Merch reicht für v1 |
| **Newsletter** | SNT-507 | Kein Abonnent ohne Traffic |
| **Meetup-Rekrutierung + Redaktionsplan** | SNT-314, SNT-315, SNT-501…510 | Phase 3+, braucht Community-Masse |
| **P2-System (Perf, CI, Observability)** | SNT-401…412 | Solange `check:all` + Build grün sind, kein Blocker |

---

# 📅 WOCHE 2 — Fundament

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

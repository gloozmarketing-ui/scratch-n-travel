# Projekt-Audit — Scratch'n'Travel

> **Datum:** 2026-09-25 · **Commit:** `27ba277` (main) · **Working Tree:** sauber
> **Methode:** Vollständige Dateisystem-Inventur (594 Dateien), Git-Historie, Byte-Level-Verifikation, Live-HTTP-Requests gegen beide Deployments, Source-Audit. Jede als **FACT** markierte Aussage wurde direkt verifiziert.

**Verwandte Dokumente:** `IMPLEMENTATION_PLAN.md` · `KANBAN.md` · `TODOLIST.md` · `../COMMUNITY_GROWTH_STRATEGY_2026.md`

---

## 0. Kurzfassung (Executive Summary)

Das Projekt ist **kein Softwareprodukt, sondern eine Sammlung von ~40 Commit-Nachrichten und 3 konkurrierenden App-Versionen**. Die Intention ist klar und gut (Social Layer of Travel). Die Umsetzung hat 5 Blocker, die alleine jede weitere Feature-Arbeit sinnlos machen:

| # | Blocker | Schwere | Beleg |
|---|---|---|---|
| **B1** | **Login ist eine Attrappe.** Kein `auth.signIn`, nur `setTimeout(1400)`. | **Kritisch** | `04.09.2026/src/pages/Login.tsx:16-19` |
| **B2** | **Supabase ist komplett dicht.** RLS aktiviert, **0 Policies**. | **Kritisch** | `supabase_schema.sql:93-99`, Policy-Count = 0 |
| **B3** | **`robots.txt` = `Disallow: /`** — die komplette Site ist für Suchmaschinen gesperrt, während das HTML `index, follow` behauptet. | **Kritisch** | Root + `dist/robots.txt`, live verifiziert |
| **B4** | **4 Live-API-Keys im Quellcode** (Zenmux, Requesty, Cerebras, Vercel). Unbeaufsichtigter Cron verbrennt sie. | **Kritisch** | `api/hermes-concierge.js:15,28,41,52` |
| **B5** | **Produktion abgeschottet.** Keine Analytics, keine Legal-Pages, kein Impressum, keine Tests, kein README. | **Hoch** | verifiziert: 0 Testdateien, kein Analytics im Bundle |

> **Das Wichtigste:** `scratch-n-travel.vercel.app` und `scratch-n-travel-six.vercel.app` sind **nicht zwei Versionen derselben App — es sind zwei komplett verschiedene Builds**, und der schlechtere ist der neuere.

---

## 1. Repository-Struktur (Inventur)

### 1.1 Top-Level

| Pfad | Dateien | Größe | Rolle | Bewertung |
|---|---|---|---|---|
| `api/` | 6 | 0,04 MB | Vercel Serverless Functions | 🔴 Keys im Code |
| `assets/` | 88 | 21,59 MB | Legacy-Engines + 47 Vite-Bundles | 🔴 45/47 tote Dateien |
| `dist/` | 54 | 21,15 MB | Deploy-Output (Pre-built) | 🔴 Falscher `index.html` |
| `scripts/` | 10 | 0,08 MB | Hermes-Automation, Build | 🔴 Falsifiziert Daten |
| **`src/`** | — | — | **Existiert nicht am Root** | 🔴 Zwei App-Quellen |
| `AusbauÜberlegungen/` | 134 | 24,73 MB | **App-Quelle A** + Skills + Pläne | ✅ Beste Version |
| `verschiedene webseit versionen/` | 396 | 9,00 MB | **App-Quelle B** + 5 Varianten | ⚠️ B ist die deployed |
| `.github/workflows/` | 3 | 0,01 MB | Deploy + 2× Cron | 🔴 Deploy baut nicht |
| `magazin/` | 4 | 0,02 MB | SEO-Artikel (Deutsch) | ✅ Brauchbar |
| `obsidian_vault/` | 3 | 0,00 MB | Brand Design Tokens | ✅ |
| `social_drafts/`, `social_campaigns/` | 4 | 0,04 MB | KI-Social-Content | 🔴 Falsch generiert |
| `seeded_cities/` | 1 | 0,00 MB | 1 City Brain (Lissabon) | ⚠️ 1 von 12 |
| `.agents/` | 11 | 0,05 MB | Skills für *Kontenlage.de* | ⚠️ Fremdprojekt |

**FACT:** Am Root liegt **kein `src/`-Ordner und kein `tsconfig.json`**. `package.json` verweist auf `AusbauÜberlegungen/…`, die CI baut aus `verschiedene webseit versionen/04.09.2026`. Drei Anlaufstellen, eine `npm run build`.

### 1.2 Die zwei App-Quellen im Vergleich

| Merkmal | **Quelle A**<br>`AusbauÜberlegungen/`<br>`Website analysis and badge creation` | **Quelle B**<br>`verschiedene webseit`<br>`versionen/04.09.2026` |
|---|---|---|
| Seiten | **16** | 15 |
| Besondere Seiten | `Passport.tsx`, `WanderBond.tsx` | `GrowthStudio.tsx` (Marketing-Tool) |
| **Supabase-Service** | ✅ `src/services/supabase.ts` | ❌ **fehlt komplett** |
| **Echtes Auth** | ✅ `signInWithOtp` + `verifyOtp` | ❌ `setTimeout`-Fake |
| `data.ts` | 57,8 KB | **107,1 KB** |
| Abhängigkeiten | + `@supabase/supabase-js`, `canvas-confetti` | keine Supabase |
| `npm run dev` zeigt auf | ✅ **diese** (`package.json`) | diese (CI) |

> **Die Ironie:** Die deployed Version (B) ist diejenige **ohne** Supabase. Die funktionsfähigere Version (A) liegt ungenutzt in `AusbauÜberlegungen/`.
> **FACT:** `package.json` `"dev"` → Quelle A. CI (`scratch_hermes_cron.yml:52`) → Quelle B. Lokal testet man A, live läuft B.

---


## 2. Die beiden Websites — Vergleich

Beide URLs wurden per HTTP abgerufen und die Antworten verglichen.

### 2.1 Ergebnis

| | `scratch-n-travel.vercel.app` | `scratch-n-travel-six.vercel.app` |
|---|---|---|
| Rolle (laut `.agents/AGENTS.md`) | "Original Production Domain" | "CLI Mirror Domain" |
| HTML-Größe | **4.914 Bytes** | **913 Bytes** |
| `<title>` | `Scratch'n'Travel — Luxury Social Travel, Secret Spots & WanderBond™ DNA` | 🔴 **`Figma Make App`** |
| `<meta robots>` | `index, follow, max-image-preview:large…` | 🔴 **`noindex, nofollow`** |
| `description` | Verifizierte Geheimtipps, 130-Hobby DNA, 460+ Badges | 🔴 *"This web application allows users to explore travel destinations…"* |
| Canonical | `https://scratchntravel.com/` | ❌ keiner |
| OpenGraph / Twitter Card | ✅ vollständig (1200×630) | ❌ nur `og:title`/`og:description` |
| JSON-LD Schema.org | ✅ `@graph` WebApplication + Organization | ❌ keiner |
| Google-Site-Verification | ✅ `ad062dfe6cb025cf` | ❌ fehlt |
| Service Worker | ✅ registriert | ❌ fehlt |
| Fonts (Cinzel, Caveat, Inter, JetBrains) | ✅ preconnect + load | ❌ |
| Bundle | `index-B28FDYYC.js` (1.003.786 B) | `index-CHcFiRDP.js` (679.905 B) |
| Sprache | `lang="de"` | `lang="en"` |
| **In Google indexierbar?** | ❌ **Nein** (robots.txt) | ❌ **Nein** (noindex) |

### 2.2 Die Ursache — verifiziert

Root-`index.html` und `dist/index.html` sind **byte-identisch** (SHA-256 `658E0C5A…`):

```html
<title>Figma Make App</title>
<meta name="robots" content="noindex, nofollow">
<script type="module" crossorigin src="/assets/index-CHcFiRDP.js"></script>
```

Das ist der **Figma-Make-Scaffold-Default**, der entsteht, wenn der Build die `<!-- figma:head-start -->`-Platzhalter in `04.09.2026/index.html` nicht auflöst. Bestätigt durch `.figma/make/site.json`:

```json
{ "description": "This web application allows users to explore travel destinations…",
  "robots": { "index": false } }
```

**Der gute HTML-Build existiert nur an einer Stelle:**
`AusbauÜberlegungen/Website analysis and badge creation/dist/index.html` → referenziert `index-B28FDYYC.js` + `index-DciLDuNN.css`. Genau diese Dateien liegen in `dist/assets/`. **Die gute Ausgabe ist vorhanden — sie wird nur nicht deployed.**

> **FACT:** `Get-FileHash dist/index.html` == `Get-FileHash index.html` == `658E0C5A3FC47D8D02610F29DAE2C7569640A071B7666AEBAD3BDB13DFD70B94`

### 2.3 Der Widerspruch, der alles blockiert

```html
<!-- PROD index.html -->
<meta name="robots" content="index, follow, max-image-preview:large, …">

<!-- PROD robots.txt, live abgerufen -->
User-agent: *
Disallow: /
```

Die Site **behauptet** indexierbar zu sein und **verbietet** es gleichzeitig. `robots.txt` gewinnt. Zusätzlich zeigt `sitemap.xml` auf `https://scratchntravel.com/` — **eine Domain, die nicht auflöst** (DNS-Fehler verifiziert). Die gesamte SEO-Strategie (Sitemap, Canonical, OG-URLs, GSC-Verification) zeigt ins Leere.

### 2.4 Verlust durch den `-six`-Mirror

Der Mirror ist nicht nur hässlicher, er ist **funktional kaputt**: kein Service Worker, keine Canonical-URL, kein `lang="de"`, kein Schema.org. Wer über den Mirror linkt, verlinkt eine Seite, die Google nie indexieren kann und die kein Deutsch kann.

---


## 3. Was wurde umgesetzt — und was nicht

### 3.1 Umgesetzt und funktionsfähig ✅

| Feature | Beleg |
|---|---|
| Vite + React 19 + Tailwind v4 Build-Pipeline | läuft, Bundle 1,0 MB |
| 15–16 Seiten mit Routing (`react-router-dom` 7) | `src/routes.ts`, alle liefern HTTP 200 |
| Leaflet-Karten (`LeafletMap.tsx`) | produktiv |
| **1.003.786 Byte** Single-Bundle | produktiv |
| Schema.org JSON-LD, OG, Twitter Cards, GSC-Token | in Prod-HTML |
| PWA: `manifest.json`, `sw.js`, Apple-Meta | produktiv |
| Stripe Checkout (3 Endpoints) + Webhook | `api/stripe-*.js` |
| Printful/Printify Merch-Dispatch | `api/create-merch-checkout-session.js` |
| Supabase-Schema (6 Tabellen) | DDL existiert — **aber unbenutzbar, s. B2** |
| Multi-Provider-AI-Router (7 Provider) | `api/hermes-concierge.js` |
| Seed-/Growth-Skripte (10 Stück) | laufen per Cron |
| Magazin: 4 SEO-Artikel | gut, deutsch |
| Observidian Brand Design System | 3 Dokumente |

### 3.2 Gebaut, aber funktional tot ⚠️

| Feature | Problem |
|---|---|
| **39 Legacy-Engines** in `assets/js/` (Gamification, Passport, Wallet, B2B, i18n, Merch, Hazard…) | 🔴 **Keine einzige ist im Deploy.** `dist/assets/js` existiert nicht. Prod-HTML referenziert sie nicht. |
| `app.html` (29 KB, Vanilla-JS-Dashboard) | 🔴 `/app.html` liefert HTTP 200, **aber die SPA-Shell** (4.914 B), nicht die Datei. Der `vercel.json`-Rewrite fängt sie ab. Unerreichbar. |
| Supabase Auth | 🔴 In Quelle A vorhanden, in der deployed Quelle B **nicht vorhanden** |
| `assets/css/main.css`, `components.css` | 🔴 Nicht im Deploy |
| Stripe-Wallet, Tier-Guard, Family-Pet | 🔴 Nur in Legacy, nicht deployed |

> **Das bedeutet:** 39 Engine-Dateien mit zusammen ~380 KB Feature-Logik liegen im Repo und werden **nie an einen Nutzer ausgeliefert**. Der Commit-Verlauf zeigt, dass sie früher deployed waren (`feat(v5.0)`, `feat(v6.0)`) und dann durch den Figma-Make-Build **ersetzt** wurden.

### 3.3 Nie gebaut ❌

Aus Master-Plan v2.0, Module A–G — Status zum Zeitpunkt des Audits:

| Modul | Status | Beleg |
|---|---|---|
| **A. Local Secrets** | 🟡 Frontend-only, hardcoded | `storyPins` in `data.ts`, keine Tabelle |
| **B. Hobby DNA / WanderBond** | 🟡 Taxonomie + UI, kein Matching | `hobbiesList` (113 Hobby), kein Score-Algorithmus |
| **C. Local Circles / I'm Here** | ❌ **Nicht gebaut** | Keine Tabelle, keine Route |
| **D. Local Verification** | 🔴 **Falsifiziert** | `hermes_community_extender.js`: `rating: 5.0` hardcoded, Koordinaten-Default Lissabon für *jede* Stadt, `author: 'Community Explorer'` |
| **E. Local Creator** | ❌ **Nicht gebaut** | — |
| **F. B2B & Group Travel** | 🟡 Nur Legacy-`b2b-host-portal.js` (nicht deployed) | — |
| **G. AI Local Concierge** | 🟡 Endpoint lebt (GET → 405 = korrekt, POST nötig) | `api/hermes-concierge.js` |

**Datenbank-Lücke:** `supabase_schema.sql` hat **6 Tabellen** (`profiles`, `secret_spots`, `travel_checklists`, `scratchbooks`, `hermes_city_brains`, `audit_logs`). Es fehlen **jede** Tabelle für: `posts`, `comments`, `follows`, `messages`, `reports`, `meetups`, `circles`, `tours`, `badges`, `reviews`. **Die Community existiert nicht im Datenmodell.**

### 3.4 Erfundene Daten — dokumentierte Fiktion 🔴

Dies ist der schwerwiegendste Vertrauensbruch, weil er **sichtbar** ist:

```ts
// src/data/data.ts — tours[]
{ title: 'Lisboa Hidden Viewpoints Loop', creator: 'Ana & Carlos',
  rating: 4.9, reviews: 88, likes: 234 }        // ← 88 Reviews von 2 erfundenen Personen
{ title: 'Kyoto Secret Temples…', creator: 'Kenji & Sarah',
  rating: 4.9, reviews: 156, likes: 420 }
```

```ts
// src/data/data.ts — cities[]
{ name: 'Lisbon', total: 8, taken: 5, tier: 'Gold' }
// → 8 Slots, 5 belegt = künstliche Verknappung (Dark Pattern)
```

```ts
// src/pages/GrowthStudio.tsx — hardcodiert für JEDEN Spot:

## 4. Security & Compliance — Fundstellen

### 4.1 🔴 KRITISCH: 4 Live-API-Keys im Quellcode

`api/hermes-concierge.js` — als Fallback hardcoded, d. h. **sie greifen auch ohne Umgebungsvariable**:

| Zeile | Provider | Prefix |
|---|---|---|
| 15 | Zenmux AI | `sk-ai-v1-1938d8bd…` |
| 28 | Requesty Router | `rqsty-sk-uLnIojt+…` |
| 41 | Cerebras | `csk-rxmmxmrv8…` |
| 52 | Vercel AI Gateway | `vck_63nLwA8X…` |

**Risiko:** `scratch_hermes_cron.yml` läuft **täglich um 06:00 UTC** und ruft `hermes_daily_spots_generator.js` + `hermes_social_growth_engine.js` auf. Ein Key-Leak pro Lauf = **kostenpflichtiger Missbrauch durch Dritte**. `.env` ist korrekt in `.gitignore` — die Keys stehen trotzdem **im Repo und in der Git-Historie**.

> **FACT:** Alle 4 Muster per Regex `process\.env\.\w+\s*\|\|\s*'…'` verifiziert. Der Master-Plan selbst fordert in Zeile 2075 *"Keine hardcodierten Keys"* — die Regel ist bekannt und verletzt.

### 4.2 🟡 Kein Analytics auf einer Site mit Geo-Targeting

Absenz im Prod-Bundle (verifiziert): `posthog`, `plausible`, `gtag`, `googletagmanager`, `clarity`, `matomo`, `umami`, `mixpanel`, `hotjar`, `facebook.com/tr`. Vorhanden: nur `sentry` (Error-Tracking). **Man kann nicht messen, ob irgendetwas funktioniert.**

### 4.3 🟡 Rechtlicher Rahmen nicht vorhanden

| Anforderung | Status |
|---|---|
| Impressum (DE-Anbieterpflicht § 5 DDG) | ❌ fehlt |
| Datenschutzerklärung / Privacy Policy | ❌ fehlt |
| AGB / Terms of Service | ❌ nur `href="#"` in `Login.tsx` |
| Löschkonzept / Account-Löschung | ❌ fehlt |
| Consent-Management (DSGVO) | ❌ fehlt |
| Offline-Disclaimer (im Plan als "Minimum Viable Safety" geffordert) | ❌ fehlt |

> `Login.tsx` verspricht: *"No tracking cookies. DSGVO compliant. 🔒 Encrypted locally"* — bei **null** Verschlüsselung und **null** Tracking-Statements. Das ist eine irreführende Behauptung im eigenen UI.

---

## 5. Build- & Deploy-Kette — defekt

```
git push
   ↓
deploy.yml: "vercel build --prod"      ← baut NICHTS, keine Build-Config
   ↓
Vercel: outputDirectory = "dist"       ← nimmt das committete, veraltete dist/
```

**Drei Defekte in der Kette:**

1. **Kein Build im Deploy.** `deploy.yml:24` ruft `vercel build --prod` ohne vorher `npm run build`. `vercel.json` hat kein `buildCommand`. Vercel liefert aus, was in `dist/` liegt.

## 6. Git-Historie — was passiert ist

40+ Commits, alle mit `feat:`-Prefix. Das Muster:

- **19.08.–05.09.** Aufbau einer umfangreichen Legacy-App (`app.html` + 39 Engines) — B2B-Portal, Gamification, Wallet, i18n, Merch.
- **05.09.** `feat: add multi-provider AI router` — 7 Provider, 4 Keys hardcoded.
- **11.09.** `fix(routing): configure clean SPA catch-all rewrite` — `vercel.json`-Rewrite, der seither auch `/app.html` und alle API-Pfade verschluckt.
- **15.09.** Letzter Commit. `index.html` und `dist/index.html` sind heute beide der Figma-Placeholder.

**Drei Generationen, keine davon abgeschlossen:**

| Gen | Ort | Status |
|---|---|---|
| 1 | `app.html` + `assets/js/` (39 Engines) | Abgelöst, **nicht deployed** |
| 2 | `AusbauÜberlegungen/…` (Quelle A) | Funktionalste, **nie deployed** |
| 3 | `verschiedene webseit versionen/04.09.2026` (Quelle B) | **Deployed**, am schlechtesten |

---

## 7. Fehlende Projektinfrastruktur

| Artefakt | Status | Warum es zählt |
|---|---|---|
| `README.md` | ❌ | Kein Onboarding für Entwickler |
| `LICENSE` | ❌ | `package.json` sagt MIT, Datei fehlt |
| `.env.example` | ❌ | Keine Doku der 10 benötigten Variablen |
| `CONTRIBUTING.md` | ❌ | — |
| `SECURITY.md` | ❌ | Bei 4 geleakten Keys besonders relevant |
| **Tests** | ❌ **0 Testdateien** im gesamten Repo | Kein Regressionsschutz |
| `tsconfig.json` (Root) | ❌ | Root ist nicht bau-fähig |
| `docs/` | ❌ | Diese Analyse schafft Abhilfe |
| Analytics | ❌ | Keine Datenlage |
| Feature-Flags | ❌ | `GrowthStudio` (Marketing-Tool) ist **öffentlich** unter `/growth` erreichbar |

---

## 8. Gesamtbewertung

### Was wirklich gut ist
- **Produktvision:** „Don't just visit a place. Become part of it." — klar, differenziert, in allen Plänen konsistent.
- **Rechtliche Architektur:** Kein P2P-Zahlungsverkehr (ZAG/PSD2-Vermeidung) — **genau richtig** für ein Travel-Social-Netzwerk.
- **Nische:** Familien + Haustiere + barrierefrei ist ein echtes, underserved Segment.
- **POD-Setup:** Printful + Printify dual dispatch ist fertig konfiguriert.
- **Quellcode:** Sauber, kommentiert, konsistent. Kein technischer Schulden-Zins.

### Was wirklich schlecht ist
- **Es gibt kein Produkt, nur Präsentationen.** 1,0 MB Bundle, das eine totgepunktete `if/else`-Demo ausspielt.
- **Die Automatisierung ist gegen das Produkt gerichtet.** 3 GitHub-Actions, 10 Hermes-Skripte, 129 „Skills" — erzeugen Content über ein Produkt, das niemand benutzen kann.
- **Es wird aktiv in die Irre geführt.** Erfundene Reviews, künstliche Verknappung, frei erfundene Impact-Zahlen mit Confidence Scores.
- **Falsche Sicherheit.** Hardcoded Keys + unbeaufsichtigter Cron + RLS ohne Policies.

### Die eine Frage, die entscheidet
> **Will das Projekt ein AI-Content-Generierungsprojekt sein, das nebenbei eine App hat — oder eine Community-Plattform?**

Alle Investitionen der letzten Wochen (Skills, Social-Engine, POD, Stripe, SEO) fließen in die erste Richtung. Die geplante Produktvision und **jede** Zeile des Community-Strategiedokuments gehören zur zweiten. Das muss entschieden werden, bevor ein weiteres Feature gebaut wird.

---

*Fortsetzung: `IMPLEMENTATION_PLAN.md` · `KANBAN.md` · `TODOLIST.md` · `../COMMUNITY_GROWTH_STRATEGY_2026.md`*

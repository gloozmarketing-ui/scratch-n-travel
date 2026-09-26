# Übergabe — Stand 26.09.2026

Alles, was ohne Repo-Zugang erledigt werden konnte, ist erledigt und
verifiziert. Der Rest braucht Owner-Zugriff.

---

## A. Erledigt und verifiziert

### A1. Sicherheitslücken (echte Bugs, nicht Kosmetik)

| Problem | Fundstelle | Status |
|---|---|---|
| `?tester=andrey` loggt ein — per URL Master-Zugang | `src/pages/Login.tsx` | entfernt |
| Jeder 6-stellige Code wurde akzeptiert (Demo-Fallback) | `src/pages/Login.tsx` | entfernt |
| Sichtbarer Button „🔒 Privater Tester-Zugang" | `src/pages/Login.tsx` | entfernt |
| `loginAsTester` vergab Level 25 + 184 Badges ohne Auth | `TravelContext.tsx` | gelöscht |

Ohne Backend ist der Login jetzt **ehrlich deaktiviert** und erklärt das,
statt eine Maske zu zeigen, die nichts tut.

### A2. PWA war komplett kaputt

`manifest.json` zeigte auf `start_url: /app.html` und Icons, die es im
Vite-Build nicht gibt. Der Service Worker nutzte `cache.addAll()` —
**all-or-nothing**: ein einziger 404 verhinderte die Installation.

- Manifest zeigt auf `/`, Icons liegen jetzt in `public/`
- Service Worker v5: Precache einzeln mit Fehlertoleranz
- Navigationen liefern immer frisches `index.html` (kein Cache-Stuck)
- `/api/` und `/auth/` werden nie gecacht

### A3. `index.html` blockierte den Light Mode

`<body class="bg-[#0C1825] text-[#F4E4C1]">` erzwang Navy-Gold **hart**,
unabhängig vom Theme. Zusätzlich wurden die alten Fonts doppelt geladen.

- Body-Klassen entfernt, Farben kommen aus `index.css`
- Doppelte Font-Ladung weg
- `user-scalable=no` entfernt (verstieß gegen WCAG 1.4.4 — Zoom blockiert)
- Meta/OG/JSON-LD: erfundene Claims („460+ Badges", „130-Hobby DNA",
  „Luxury Social Travel") durch die tatsächliche Positionierung ersetzt

### A4. 488 hartcodierte Farben migriert

`node scripts/migrate-colors.mjs` — 19 Dateien, idempotent.

Die Altseiten hatten Navy/Gold direkt im JSX. Ein Rahmen wie
`rgba(255,255,255,0.08)` wäre im hellen Theme **unsichtbar** gewesen.

Ergänzt in `index.css`: fehlende Legacy-Klassen (`gold-gradient`, `xp-bar`,
`coord`, `cartouche`, `section-divider`, `btn-parchment`) plus ein
Leaflet-Theme — die Karte war im Dunkel-Modus ein weißer Fremdkörper.

### A5. Kontrastfehler behoben

Avatar-Initialen waren `#FFFDF8` auf `--sun` = **3.4:1**, unter der
WCAG-AA-Grenze für Text. Jetzt `var(--paper-deep)`.

QR-Code: Module hatten unterschiedliche Farben. Gescannt wird er jetzt
einheitlich mit `#1A1A1A`, sonst sinkt der Kontrast.

### A6. Erfundene Daten markiert

Bewertungen und „X Plätze frei" kommen aus `src/data/data.ts` und sind
Platzhalter. Sie als echte Bewertungen darzustellen widerspricht dem
Produktversprechen. Neue `DemoDataBadge`-Komponente markiert sie in
Explore, Stories, Tours und Host.

### A7. Repository

---

## B. Verifikation

| Prüfung | Ergebnis |
|---|---|
| `tsc --noEmit` | **0 Fehler** |
| `vite build` | erfolgreich, keine Warnungen |
| Browser-Test: 22 Routen × 2 Themes × 2 Viewports | **alle sauber** |
| Konsolenfehler | 0 |
| Horizontaler Overflow | keiner |

Geprüfte Routen: `/`, `/explore`, `/scratch`, `/passport`, `/stories`,
`/tours`, `/badges`, `/profile`, `/checklists`, `/radar`, `/ai`, `/host`,
`/pricing`, `/login`, `/wanderbond`, `/people`, `/meetups`, `/chat`,
`/safety`, `/impressum`, `/datenschutz`, `/terms`

Bundle: **~1,7 MB** (vorher 21,15 MB).

---

## C. Was jetzt ansteht — braucht Owner-Zugriff

### C1. Git-Push (Blocker für alles Weitere)

Es wurde **nichts committet oder gepusht**. Der Arbeitsbaum enthält:

- geänderte Dateien (`src/`, `index.html`, `sw.js`, `.gitignore`, `api/`)
- neue Verzeichnisse (`public/`, `src/`, `supabase/`, `docs/`)
- Löschungen (`dist/` aus dem Index, Root-Manifest und -robots.txt)

```bash
git status
git add -A
git commit -m "Sicherheit, PWA-Fix, Design-Migration, Repo-Hygiene"
git push origin main
```

### C2. Credentials widerrufen — zeitkritisch

AI-/Printful-/Stripe-Schlüssel waren **einmal in der Git-Historie
committet**. Sie sind als kompromittiert zu behandeln:

1. Beim Anbieter widerrufen und neu erzeugen
2. Alte Werte in GitHub Secrets und Vercel ersetzen
3. `git filter-repo` / BFG, falls die Historie bereinigt werden soll

Betroffen: `api/hermes-concierge.js`, `api/stripe-webhook.js`,
`api/pod-orders.js`, `scripts/hermes_social_growth_engine.js`

`.env.example` enthält nur noch Platzhalter, keine echten Werte.

### C3. Supabase-Schema ausführen

`supabase/schema.sql` wurde **nie ausgeführt** — ungetestet gegen eine
echte Datenbank.

```bash
psql "$DATABASE_URL" -f supabase/schema.sql
```

Anschließend **Negativtests** (`scripts/test_rls.js` existiert noch nicht):

- Fremdes Profil darf Trust-Felder nicht ändern
- Anonym darf keine Konversation anlegen
- Geblockte Nutzer sehen keine Nachrichten
- Meetup-Kapazität wird erzwungen
- Trust-Events nur durch Server/Trigger schreibbar

### C4. Rechtstexte

`/impressum`, `/datenschutz`, `/terms` enthalten sichtbare Platzhalter
(`<Firmenname>`, Adresse, Steuer-ID). Brauchen echte Unternehmensdaten.

### C5. Domain und Indexierung

`https://scratchntravel.com` steht in `index.html`, `public/robots.txt`
und `sitemap.xml`. Ob das die kanonische Domain ist, ist eine Entscheidung.

---

## D. Bekannte Einschränkungen

- **Die Demo-Daten bleiben.** `src/data/data.ts` speist weiterhin
  Passport, Badges, Explore, Stories, Tours, Host und Radar. Sie sind
  als Platzhalter markiert, aber nicht entfernt — das wäre ein
  feature-übergreifender Umbau.
- **Ohne Supabase gibt es kein Login.** Absicht: ein Login, der nichts
  prüft, wäre schlimmer als ein ehrlicher Hinweis.
- **Kein Commit, kein Push, kein Deployment.** Alles liegt im Arbeitsbaum.

- `dist/` war mit **54 Dateien** versioniert → entfernt, in `.gitignore`
- Root-`supabase_schema.sql` (veraltet, 6 Tabellen, **ohne RLS**) → durch
  Warndatei ersetzt, die auf `supabase/schema.sql` verweist
- Sitemap zeigte auf `/app.html` und nicht existierende `/magazin/`-URLs
- `README.md` neu, `public/` für statische Assets angelegt

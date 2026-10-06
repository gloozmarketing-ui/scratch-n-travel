# Scratch'n'Travel — Redesign-Scaffold

Neu aufgesetztes Next.js-Scaffold gemäß `design.md`, Phase A (Design-System)
und Phase B (Regionen-Datenmodell + Scratch-Engine). Basiert auf der Analyse
und den beiden HTML-Prototypen (Landing + App-Dashboard), die vorher geliefert
wurden — dieses Repo ist der nächste Schritt Richtung echter Next.js-App.

## Setup

```bash
npm install
cp .env.example .env.local   # Werte eintragen (Supabase, Stripe, …)
npm run dev
```

## Was hier bereits steckt

- **`styles/tokens.css`** — alle Design-Tokens aus Kapitel 5, einzige Quelle
  der Wahrheit. Keine Komponente enthält Inline-Hex-Werte.
- **`public/geo/regions.config.json`** — die aktive Regionen-Config (Standard-
  Preset, politisch neutral: ISO-Ländercodes + thematische Subregionen).
- **`public/geo/regions.config.wine-regions.example.json`** — Beweis für den
  Architektur-Test aus Kapitel 0/17: Diese Datei über die aktive Config
  kopieren → die komplette App muss ohne Code-Änderung mit neuen Regionen
  laufen. **Das ist das Kriterium, an dem sich Phase B objektiv prüfen lässt.**
- **`lib/regions.ts`** — die einzige Stelle, die die Config lädt und typisiert.
- **`components/ui/`** — Button (5 Varianten aus 6.1), Card + StoryPinCard,
  Modal (mit Fokus-Trap, Pflicht laut Kapitel 11), Toggle, Chip, Toast.
- **`components/scratch/ScratchCanvas.tsx`** — die Rubbel-Engine: config-
  getrieben pro Region, `destination-out`-Compositing, 150ms-Sampling-
  Throttle, Shockwave-Reveal, Vibration nur mit Feature-Detection,
  vollständige Tastatur-Alternative (Enter/Space) für Barrierefreiheit.
- **`components/legal/`** — Affiliate-Disclaimer, Community-Safety-Notice
  (4 goldene Regeln + Haftungsausschluss), Cookie-frei-Hinweis. Zentral
  gepflegt statt an 5 Stellen dupliziert.
- **`app/explorer/`** — Beispiel-Screen: lädt Regionen server-seitig,
  rendert Auswahl + Scratch-Demo rein aus der Config.
- **`app/api/regions/unlock/route.ts`** — Server-Sync nur beim
  75%-Schwellenwert-Event (nicht bei jeder Mausbewegung), Edge-Runtime für
  den Vercel-Free-Tier.
- **`supabase/schema.sql`** — Tabellen + **Row-Level-Security**, sodass ein
  Nutzer ausschließlich eigene `scratch_progress`- und `checklist_items`-
  Zeilen lesen/schreiben kann (explizites Phase-D-Kriterium im Masterprompt).

## Grenzen dieser Umgebung

Ich habe hier keinen Netzwerkzugriff (kein `npm install`, kein Supabase-
Connect, kein Deploy) — der Code ist sorgfältig nach der Spec geschrieben,
aber nicht automatisiert gebaut/getestet. Vor dem ersten `npm run dev` lokal
gegenprüfen.

## Phase C (neu hinzugekommen)

- **`app/hazard-radar/`** — Control-Rail-Toggle, Radar-Sweep-Animation (9.3),
  Alert-Banner, 15-Min-Client-Cache + `app/api/cron/hazard-sync` als
  1×/Tag-Cron-Stub (Free-Tier-Limit aus Kap. 14.2). Nur Regionen mit
  `hazardLayerEnabled: true` in der Config werden angezeigt.
- **`app/concierge/`** + `app/api/ai-concierge/route.ts` — Streaming Edge-
  Function gegen die Anthropic API, mit Function-Calling-Tools
  (`get_weather`, `search_story_pins`, `get_hobby_matches`) für Grounding
  statt Halluzination. Chat-UI mit Live-Kontext-Chips, Quick-Idea-Chips als
  Leerzustand, Typing-Indicator, Error- und Offline-State, und dem
  `<AffiliateDisclaimer />` **innerhalb** der Bubble sobald eine Antwort
  Affiliate-Themen erwähnt (Kap. 25 — Kennzeichnungspflicht ist
  output-bezogen, nicht screen-bezogen).
- **`app/safety/`** — Scam-Radar mit Ampel-Filter (🟡/🔴/🟢), bewusst
  **ohne** Freischalt-Gate (Sicherheitsinfos sind immer sofort sichtbar),
  Melde-Formular mit Regex-Vorprüfung (`app/api/safety-reports`) und
  eigener `safety_reports`-Tabelle mit RLS (öffentlich lesbar erst ab
  `published`, jeder darf melden).
- **`app/host/onboarding/`** — 6-Schritt-Stepper (Betriebsart → Region →
  Hobby-Tags → Fotos → Verifizierung → Stripe Connect), Regionsauswahl
  wieder komplett aus `regions.config.json`, kein Weiter ohne gültigen
  Schritt.

## Phase D–F (neu hinzugekommen)

**Phase D — Auth:**
- **`lib/supabase/client.ts` / `server.ts`** + **`middleware.ts`** — echte
  Supabase-Session statt loser `userId`-Parameter. `app/api/regions/unlock`
  liest den Nutzer jetzt aus der Server-Session (`auth.getUser()`), nicht
  mehr aus dem Request-Body — sonst könnte jeder für jeden schreiben, RLS
  hin oder her.
- **`app/auth/login/`** — Magic-Link-Login (kein Passwort, passt zum
  datensparsamen Prinzip aus Kap. 14), **`app/auth/callback/`** tauscht den
  Code gegen eine Session.

**Phase E — Stripe:**
- **`lib/stripe.ts`**, **`app/api/stripe/checkout`** (Pro-VIP-Abo),
  **`app/api/stripe/connect`** (Express-Connect-Onboarding für Hosts, jetzt
  wirklich am Ende des Onboarding-Steppers verdrahtet), **`app/api/stripe/
  webhook`** (einzige Quelle der Wahrheit für Tarif-Upgrades — `tier`/`role`
  werden nie clientseitig gesetzt, nur über verifizierte Webhook-Events mit
  dem Service-Role-Key).
- **`app/pricing/`** — der öffentlich sichtbare Admin-Debug-Toggle aus dem
  Original-Blueprint ist hier **serverseitig hinter `profiles.role ===
  'admin'`** versteckt (`AdminStripeModeToggle` wird gar nicht erst
  importiert/gerendert, wenn die Session das nicht bestätigt) — genau der
  Punkt, der in der Analyse ganz am Anfang als Sicherheitsproblem auf der
  Live-Seite markiert wurde.

**Phase F — PWA:**
- **`public/manifest.json`** + **`public/sw.js`** — Stale-While-Revalidate
  für Regionen-Config & Story-Pin-Reads (offline nutzbar), Web-Push-Listener
  mit schlankem Payload (Titel + Text + Deep-Link, keine Bilder).
- **`lib/offline/db.ts`** — vanilla IndexedDB-Wrapper (keine externe Lib
  nötig) zum Cachen von Story-Pins fürs Offline-Szenario aus der
  Zustandsmatrix.
- **`components/pwa/ServiceWorkerRegister.tsx`** im Root-Layout eingehängt.

## Damit ist jede in Kapitel 36 vorgesehene Phase (A–F) im Code vertreten

Was **nicht** enthalten ist, weil es keine Code-Aufgabe mehr ist: echte
App-Icons (`/public/icons/*.png` sind im Manifest referenziert, aber nicht
beigelegt), ein echtes Supabase-/Stripe-Projekt mit den richtigen IDs in
`.env.local`, und der erste `npm install && npm run dev`-Testlauf. Das
lässt sich nur in einer echten Umgebung mit Netzwerkzugriff erledigen —
siehe "Grenzen dieser Umgebung" oben.

# Scratch'n'Travel

Reisebegleitung für unterwegs: finde Menschen, die deine Reise teilen —
Kulturaustausch, gemeinsame Hobbys, kleine Meetups, verifizierte Geheimtipps.

## Lokal starten

```bash
npm install
npm run dev        # http://localhost:5173
```

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktions-Build nach `dist/` |
| `npm run preview` | Build lokal ausliefern |
| `npm run typecheck` | TypeScript ohne Emit |
| `npm run seed` | Beispieldaten in Supabase schreiben |

`dist/` ist bewusst **nicht** im Repo — Vercel baut selbst.

## Deployments (Prod vs. Staging)

| Ziel | Baut | Quelle |
|---|---|---|
| **Produktion** `scratch-n-travel.vercel.app` | `vercel build` (Root-Vite-Projekt) | `.github/workflows/deploy.yml` |
| **Staging/Mirror** `scratch-n-travel-six.vercel.app` | `verschiedene webseit versionen/04.09.2026/` (Figma-Make-Legacy) | eigene Vercel-Project-Einstellung — bewusst `noindex` (`X-Robots-Tag` + `robots: index: false`) |

Wichtig: `scratch_hermes_cron.yml` baut seit 2026-09-27 **nichts** mehr — er
kopierte früher den Legacy-Build nach Root-`index.html`/`dist/` und überschrieb
damit täglich die Produktion (Titel „Figma Make App", `noindex`,
`robots.txt Disallow: /`). Alles, was ausgeliefert wird, liegt in `public/`
(`robots.txt`, `sitemap.xml`, `sw.js`, `manifest.json`, Google-Verifizierung).

## Umgebungsvariablen

`.env.example` kopieren nach `.env`. Ohne Supabase läuft die App im
**Demo-Modus**: Stöbern und Suche funktionieren, Anmelden ist deaktiviert
und zeigt einen Hinweis statt einer Login-Maske.

| Variable | Wofür |
|---|---|
| `VITE_SUPABASE_URL` | Supabase-Projekt-URL |
| `VITE_SUPABASE_ANON_KEY` | Anon-Key (darf im Frontend stehen) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Nur Server.** Nie im Frontend. |
| `OPENAI_API_KEY` | Hermes Concierge (Server) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Zahlungen (Server) |
| `PRINTFUL_API_TOKEN` | POD-Fulfillment (Server) |

## Datenbank

Das Schema liegt in **`supabase/schema.sql`** — 20 Tabellen, 38 RLS-Policies,
Trust-Stufen, Profil-Erzeugung, Spot-Verifizierung, Safety-Events.

```bash
# In Supabase SQL-Editor oder psql ausführen:
psql "$DATABASE_URL" -f supabase/schema.sql
```

`supabase_schema.sql` im Repository-Root ist **absichtlich leer** und warnt
nur. Dort lag früher ein veraltetes 6-Tabellen-Schema ohne RLS.

## Trust-Stufen

`neu → Mitglied → Vertraut → Anker`

Sie entstehen durch beobachtbares Verhalten, nicht durch Formulare.
Telefon- und Ausweisverifizierung bleiben optional.

## Wichtige Pfade

| Pfad | Inhalt |
|---|---|
| `src/index.css` | Design-Tokens und Theme (Light/Dark/System) |
| `src/context/ThemeContext.tsx` | Theme-Umschaltung |
| `src/context/AuthContext.tsx` | Supabase-Session, Demo-Erkennung |
| `src/lib/community.ts` | Datenzugriff mit Demo-Fallback |
| `api/*.js` | Vercel Functions (Hermes, Stripe, Printful) |
| `supabase/schema.sql` | Datenbankschema inkl. RLS |

## Farben

Alle Farben kommen aus CSS-Variablen in `src/index.css`. **Keine Seite darf
eine Farbe hartcodieren** — sonst ist der Light Mode dort kaputt.
Wer migrating muss: `node scripts/migrate-colors.mjs`.

## Noch offen

- Credentials aus der Git-Historie widerrufen und neu setzen
- `supabase/schema.sql` in einem Staging-Projekt ausführen und RLS testen
- Rechtstexte (Impressum, Datenschutz, Terms) mit echten Firmendaten füllen
- Kanonische Domain festlegen

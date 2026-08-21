---
name: webapp-ui-ux-frontend
description: Baut moderne, animierte UI/UX für komplexe Web-Apps (Dashboards, Landingpages, Auth-Flows) mit aktuellen Frontend-Techniken, die kostenlos über GitHub + Vercel deploybar sind. Nutzen, sobald nach "UI/UX", "Webdesign", "Frontend", "Animation", "Landingpage", "Dashboard-Design", "Vercel deployen" oder "wie soll die App aussehen" gefragt wird, oder wenn ein bestehendes Interface generisch/veraltet wirkt.
requires: value-proposition-pitch (Ton/Positionierung), color-merch-brand-system (Farbsystem, falls Merch-Bezug besteht)
feeds_into: user-cabinet-personalization, community-posts-feedback
---

# UI/UX & Frontend-Design für komplexe Web-Apps

## Zweck
Eine funktionale Web-App ist nicht automatisch eine, die Nutzer *behalten will*. Diese Skill sorgt für ein Interface, das sich aktuell, lebendig und vertrauenswürdig anfühlt – ohne in generische Templates oder überladene Animationen zu verfallen.

## Tech-Stack-Annahme (kostenlos deploybar)
Sofern nicht anders angegeben, Standard-Setup:
- **Frontend**: Next.js (React) oder Vite + React, Tailwind CSS
- **Animation**: Framer Motion (React-Komponenten-Animation), CSS-Transitions für Micro-Interactions, GSAP nur bei komplexen Scroll-/Timeline-Animationen
- **Hosting**: Vercel Free Tier (Hobby-Plan) via GitHub-Repo-Verknüpfung – Auto-Deploy bei Push auf `main`
- **Icons**: lucide-react oder Heroicons (kostenlos, konsistent)
- Bei anderem Stack (Vue, Svelte, plain HTML): Prinzipien bleiben gleich, nur Umsetzung anpassen.

## Vorgehen

### 1. Design-Richtung festlegen (bevor Code entsteht)
- Ton aus `value-proposition-pitch` übernehmen (nüchtern-technisch vs. verspielt-emotional) – das Design muss dazu passen, nicht generisch "SaaS-blau-Weiß" sein
- Ein bis zwei visuelle Referenzen/Stilrichtungen benennen (z. B. "Glassmorphism mit dunklem Grund", "cleanes Neobrutalism", "warmes Editorial-Layout") statt "modern und schön" — zu vage führt zu generischem Ergebnis
- Bewusste Entscheidung gegen Standard-Bootstrap/Default-Tailwind-Look: eigene Typografie-Pairing, eigener Spacing-Rhythmus, eigene Radius-/Schatten-Sprache

### 2. Aktuelle UI-Techniken (Auswahl, situativ einsetzen)
- **Micro-Interactions**: Hover-States, Button-Press-Feedback, Loading-Skeletons statt Spinner, sanftes Ein-/Ausblenden von Elementen
- **Scroll-Reveal**: Elemente animiert einblenden beim Scrollen (sparsam, nicht bei jedem Element – wirkt sonst hektisch)
- **Glassmorphism/Neumorphism**: nur wenn zur Markenrichtung passend, nicht als Selbstzweck
- **Dark-Mode als Grundüberlegung**, nicht nachträglicher Hack – Farbsystem von Anfang an für beide Modi denken
- **Bento-Grid-Layouts** für Feature-Übersichten/Dashboards (aktuell beliebt, gut scanbar)
- **Skeleton-Loading** statt Spinner bei Datenladezeiten – wirkt schneller
- **Optimistic UI** bei Aktionen wie Badge-Vergabe, Likes, Formular-Submits – Reaktion sofort zeigen, im Hintergrund bestätigen

### 3. Animations-Grundsätze
- Dauer: Micro-Interactions 150–250ms, größere Übergänge 300–500ms – alles darüber wirkt träge
- Easing: `ease-out` für Elemente, die reinkommen, `ease-in` für die rausgehen – niemals lineares Easing für UI-Bewegung
- **Reduced Motion respektieren**: `prefers-reduced-motion` abfragen und Animationen reduzieren/deaktivieren – Accessibility-Pflicht, keine Kür
- Animation soll Funktion unterstützen (Aufmerksamkeit lenken, Zustandswechsel klar machen), nie nur Deko sein

### 4. Layout & Komponentenstruktur
- Konsistentes Spacing-System (z. B. 4px/8px-Raster über Tailwind-Config statt beliebiger Werte)
- Wiederverwendbare Komponenten von Anfang an (Button, Card, Modal, Badge-Chip) statt Copy-Paste-Styles
- Responsive-first denken: Mobile-Layout zuerst entwerfen, dann für Desktop erweitern
- Klare visuelle Hierarchie: ein Primär-CTA pro Screen sichtbar hervorgehoben (siehe `value-proposition-pitch`)

### 5. Deployment-Setup (GitHub → Vercel, Free Tier)
1. Projekt in GitHub-Repo pushen
2. Auf vercel.com mit GitHub-Account einloggen, Repo importieren
3. Framework wird meist automatisch erkannt (Next.js/Vite) – Build-Command/Output-Dir prüfen
4. Umgebungsvariablen (z. B. Stripe-Keys, DB-URL) in Vercel-Projekteinstellungen hinterlegen, **nie im Code/Repo**
5. Free-Tier-Grenzen im Kopf behalten: begrenzte Serverless-Function-Ausführungszeit/Bandbreite – für Auth/Stripe-Webhooks relevant, siehe Skill `auth-billing-affiliate`
6. Custom Domain optional, auch im Free Tier möglich

## Qualitäts-Check vor Abgabe
- Wirkt das Interface wie eine bewusste Designentscheidung oder wie ein austauschbares Template?
- Ist auf Mobile alles bedienbar (Touch-Ziele groß genug, kein horizontales Scrollen)?
- Sind Animationen sparsam und funktional statt überladen?
- Wurde `prefers-reduced-motion` berücksichtigt?
- Gibt es einen konsistenten, klar erkennbaren Primär-CTA pro Screen?
- Passt die visuelle Sprache zum Farbsystem aus `color-merch-brand-system`, falls vorhanden?

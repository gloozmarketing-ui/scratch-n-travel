# Hermes Weekly Self-Reflection & Competitor Intelligence Digest
**Projekt**: Scratch'n'Travel | **Datum**: 5.10.2026 | **Status**: HEALTHY

---

## 1. System- & SEO-Integritätsprüfung
- **Google Search Console**: ⚠️ Fehlend
- **Karten-Engine**: ✅ Esri Dark Canvas aktiv (kein CARTO-Wasserzeichen)
- **OpenGraph & Schema.org**: ✅ Korrekt konfiguriert

---

## 2. Mitbewerber-Benchmark

### Polarsteps (`polarsteps.com`)
- **Kategorie**: Travel Tracker & Memory Books
- **Stärken**: Automatisches GPS-Routentracking im Hintergrund, Hohe Conversion bei physischen Fotobüchern (POD), Hohe Akku-Effizienz
- **Lücken vs. Scratch'n'Travel**: Kein 130-Hobby DNA Matching; Kein Local Scam- & Safety-Radar; Kein digitaler Rubbelpass mit Community-Spots

### Wanderlog (`wanderlog.com`)
- **Kategorie**: Collaborative Trip Planner
- **Stärken**: Echtzeit-Zusammenarbeit bei Reiserouten, Google Maps Sync & Wegezeiten-Optimierung, Budget-Splitting
- **Lücken vs. Scratch'n'Travel**: Keine Verifizierung lokaler Geheimtipps; Generisches SaaS-Design ohne Reise-Aura; Keine Sammler-Badges

### Komoot (`komoot.com`)
- **Kategorie**: Outdoor & Trail Navigation
- **Stärken**: Oberflächenspezifisches Trail-Routing, Offline-Vektorkarten, Starke Wander-Community
- **Lücken vs. Scratch'n'Travel**: Fast reiner Sportfokus (wenig Kultur/Food/Secret Spots); Kostenpflichtige Regionen-Freischaltung; Keine Haustier-/Kinderwagen-spezifische DNA

### Geocaching / Adventure Lab (`geocaching.com`)
- **Kategorie**: Location-Based Gamification
- **Stärken**: Extrem treue Sammler-Community, Spannung durch reale Entdeckungen, Globale Koordinatenbasis
- **Lücken vs. Scratch'n'Travel**: Veraltete Benutzeroberfläche; Keine Reiseplanung & Touren-Export; Keine integrierten Sicherheitswarnungen

---

## 3. Priorisierte Verbesserungsvorschläge (Hermes Governance)

### 1. 1-Klick Komoot & GPX Export Loop für Wander- & Hundetrails
- **Kategorie**: Feature Gap vs Komoot
- **Evidenz**: [UNVERIFIED] Annahme — keine Export-Klicks bisher gezählt, da Feature fehlt
- **Entscheidungsgrund**: Komoot dominiert Outdoor-Reisende durch GPX-Downloads. Scratch'n'Travel hat bereits GPX-Pfade in den Daten; ein prominenter Export-Button erzeugt sofortigen Viral-Nutzen.
- **Betroffene Parameter**: `src/pages/Explore.tsx, src/data/data.ts, gpx_export_engine`
- **Aufwand / erwartete Wirkung**: Niedrig (2 Tage) | Kann Wiederkehrrate bei Outdoor- und Hundereisenden erhöhen — Wirkung erst nach Einführung messbar

### 2. Physischer Scratch-Pass & Sammler-Badges als Print-on-Demand (POD)
- **Kategorie**: Monetization Gap vs Polarsteps
- **Evidenz**: [UNVERIFIED] Deckungsbeitrag ist eine Kalkulation, keine gemessene Zahl
- **Entscheidungsgrund**: Physische Reiseprodukte sind im Reisebereich ein bewährtes Einnahmemodell. Scratch'n'Travel hat 460+ Vektor-Badges und Pass-Seiten, die direkt als gedrucktes Reisetagebuch produziert werden können. (Umsatzanteile von Polarsteps sind nicht belegt und werden bewusst nicht genannt.)
- **Betroffene Parameter**: `api/create-merch-checkout-session.js, src/pages/Passport.tsx`
- **Aufwand / erwartete Wirkung**: Mittel (1 Woche) | Zusätzlicher Deckungsbeitrag je bestelltem Pass — Höhe hängt von Druckpreis und Versand ab, erst nach Musterbestellung belegbar

### 3. Scam-Radar Push-Warnungen bei Betreten bekannter Abzock-Zonen
- **Kategorie**: USP vs Wanderlog & TripAdvisor
- **Evidenz**: [UNVERIFIED] Keine Nutzerbefragung — begründet allein durch Funktion der App
- **Entscheidungsgrund**: Kein Mitbewerber warnt proaktiv vor Taschendieben an Tram 28 in Lissabon oder Klippengefahren. Ein lokaler Geo-Fence-Check im Browser stärkt das Vertrauen massiv.
- **Betroffene Parameter**: `assets/js/map-safety-badge-pins.js, src/pages/Radar.tsx`
- **Aufwand / erwartete Wirkung**: Mittel (3 Tage) | Kann Mundpropaganda und Presseinteresse als Sicherheits-App auslösen — nicht bezifferbar

### 4. WanderBond DNA Mini-Quiz als Einstiegs-Funnel ohne Registrierung
- **Kategorie**: CRO & Onboarding Loop
- **Evidenz**: [UNVERIFIED] Abbruchraten sind unbekannt — es gibt noch keine echten Nutzer
- **Entscheidungsgrund**: Nutzer brechen ab, wenn vor dem Erlebnis ein Login verlangt wird. Ein interaktives 3-Fragen DNA-Matching zeigt sofort passende Geheimtipps und Badges.
- **Betroffene Parameter**: `src/pages/Home.tsx, src/pages/WanderBond.tsx`
- **Aufwand / erwartete Wirkung**: Niedrig (1 Tag) | Kann Signup-Conversion auf der Startseite verbessern — Vergleich erst mit echter Traffic-Zahl möglich

### 5. Offline-PWA Kachel-Caching für Secret Spots ohne Mobilfunk
- **Kategorie**: Resilience Gap vs Polarsteps
- **Evidenz**: [UNVERIFIED] Begründung aus der Funkloch-Situation, nicht aus Abbruchdaten
- **Entscheidungsgrund**: In abgelegenen Secret Spots (z. B. Praia da Ursa, Dolomiten) gibt es oft kein Netz. Vorab geladene Leaflet-Kacheln sichern die Navigation im Funkloch.
- **Betroffene Parameter**: `public/sw.js, src/components/TravelMap.tsx`
- **Aufwand / erwartete Wirkung**: Mittel (3 Tage) | Verhindert App-Abbrüche in abgelegenen Outdoor-Szenarien — nicht messbar solange niemand offline testet

---
*Automatisch generiert durch Hermes Governance v5.2 für gloozmarketing-ui.*

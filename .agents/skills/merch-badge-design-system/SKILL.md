---
name: merch-badge-design-system
description: Definiert ein einheitliches Marken-Farbsystem, ein Badge-/Belohnungssystem sowie individuell auf User zugeschnittene, druckfähige Merch-Designs mit Reise- und Hobby-Thematik, die Nutzer stolz tragen und zeigen wollen. Nutzen, sobald nach "Badges", "Belohnungssystem", "Merch-Design", "Farbpalette", "Branding-Farben", "Print-Design" oder "individuelles Design pro User" gefragt wird.
requires: zielgruppenanalyse (Personas/Hobbys/Reisebezug), auth-billing-affiliate (Merch-Bestellprozess via POD-API)
feeds_into: user-cabinet-personalization
---

# Farbsystem, Badges & individuelles Merch-Design

## Zweck
Drei Dinge, die zwingend zusammen gedacht werden müssen, sonst wirkt das Ergebnis inkonsistent: das Marken-Farbsystem (Web + Print müssen gleich aussehen), das Badge-Belohnungssystem (Motivation, Fortschritt) und das individuelle Merch-Design (das Ergebnis, das ein User tatsächlich tragen will). Leitprinzip für den Merch-Teil: **"Würde ich das ungefragt in der Öffentlichkeit tragen und zeigen wollen?"** — wenn die Antwort nicht klar Ja ist, ist das Design noch nicht fertig.

## 1. Farbsystem (Web + Print einheitlich)

### Best Practices für die Farbauswahl
- **60-30-10-Regel**: 60% dominante Neutralfarbe (Hintergrund), 30% Sekundärfarbe (Struktur/Cards), 10% Akzentfarbe (CTA, Badges, Highlights) – verhindert visuelles Chaos
- Palette aus **einer Kernfarbe** ableiten (Marken-/Reise-Bezug, z. B. ein sattes Blau oder Terracotta) plus 1–2 Komplementär-/Akzentfarben, nicht mehr als 4–5 Farben gesamt im System
- Kontrastprüfung nach WCAG (mind. AA, 4.5:1 für Fließtext) – nicht nur ästhetisch, auch Pflicht für Zugänglichkeit
- **Farben als Tokens definieren** (z. B. `--color-primary`, `--color-accent`, `--color-badge-gold`), nicht als Hex-Werte über den Code verstreut – ein zentrales Design-Tokens-File für Web *und* als Referenz für Print-Freigaben
- **Wichtig für Print**: Web nutzt RGB/HEX, Druck nutzt CMYK – für Merch-Freigaben immer den CMYK-Wert der Kernfarben mitgeben, sonst weichen Web- und Print-Farbe sichtbar voneinander ab
- Reise-Thematik farblich andeuten, ohne kitschig zu werden: z. B. erdige/naturnahe Töne (Terracotta, Ozeanblau, Sandbeige) statt wörtlicher Reise-Klischees (keine Flugzeug-Icons in jeder Farbe)

## 2. Badge-Belohnungssystem

### Struktur
- Badges in **Kategorien** gliedern (z. B. Aktivität, Community, Meilensteine, saisonal/limitiert) statt einer endlosen flachen Liste
- Klare, nachvollziehbare Freischaltbedingung pro Badge – kein Zufall, User muss verstehen, wie er den nächsten Badge erreicht
- **Seltenheitsstufen** (z. B. Bronze/Silber/Gold/Limited) motivieren stärker als gleichwertige Badges – auch visuell im Farbsystem klar unterscheidbar (Akzentfarbe/Metallic-Look konsistent zur Marke)
- Fortschrittsanzeige zeigen, nicht nur Endzustand ("3 von 5 Aktionen bis zum nächsten Badge")

### Verbindung zum Merch
- Jeder Badge (oder ausgewählte High-Value-Badges) bekommt ein **druckfähiges Icon/Symbol im einheitlichen Design-Stil**, das später auf Merch erscheinen kann
- Ein Badge-Design-Grid/Stilguide festlegen: gleiche Linienstärke, gleiche Formsprache (z. B. alle Badges als Rundabzeichen/Patch-Stil), gleiche Farbzuordnung nach Kategorie – sonst wirkt das Merch später wie zusammengewürfelt

## 3. Individuelles Merch-Design pro User

### Prinzip: Auswahl statt Vollständigkeit
Nicht jedes Hobby und jeder Badge muss aufs Merch. Pro Merch-Stück:
- **1 dominantes Leitmotiv** wählen (z. B. das aktivste Hobby oder der seltenste erreichte Badge des Users)
- Optional 1–2 unterstützende Details (kleines Symbol, Reiseziel-Andeutung), nicht mehr
- Reise-Thematik als wiederkehrendes Grundraster (z. B. Kompass-/Routen-Linien-Motiv als dezentes Hintergrundelement), individuelles Hobby-Element sitzt darauf/darin

### Design-Prinzipien für "das will ich tragen"
- **Statt-Symbol-Charakter**: Merch sollte wie ein bewusst gewähltes Statement wirken, nicht wie ein bedrucktes Werbegeschenk – Logo/Markenname klein/dezent, Motiv im Vordergrund
- Hochwertige, reduzierte Illustration statt Icon-Sammlung – lieber ein starkes Symbol als fünf kleine
- Konsistente Formsprache über alle User-Designs hinweg (gleiche Linienstärke, gleicher Illustrationsstil), damit die Marke erkennbar bleibt, obwohl jedes Design individuell ist – wie eine Schriftfamilie mit vielen Wörtern, nicht viele verschiedene Schriften
- Farbvarianten statt komplett neuer Designs pro User ermöglichen schnelle Individualisierung bei geringem Produktionsaufwand
- Test vor Freigabe: Mockup auf tatsächlichem Merch-Produkt (T-Shirt, Cap, Sticker) ansehen, nicht nur als flaches Icon – Print-Auflösung (mind. 300dpi für die Druckfläche) sicherstellen

### Technischer Ablauf (Anbindung an `auth-billing-affiliate`)
1. Design-Parameter aus User-Daten ziehen (Leitmotiv-Hobby, erreichter Top-Badge, ggf. Lieblingsfarbe aus Profil)
2. Design generieren/zusammensetzen nach dem festgelegten Stilraster (Templates mit austauschbaren Motiv-Slots sind wartbarer als komplette Neugestaltung pro User)
3. Mockup-Vorschau im User-Cabinet zeigen (siehe `user-cabinet-personalization`)
4. Bei Bestellung: Druckdatei (Vektor bevorzugt, hohe Auflösung) an die POD-API übergeben

## Qualitäts-Check vor Abgabe
- Sind Web-Farben und Print-Farben (RGB vs. CMYK) sauber dokumentiert und stimmen visuell überein?
- Ist die Freischaltbedingung jedes Badges klar verständlich?
- Wirkt jedes Merch-Design wie ein bewusstes Design, nicht wie eine Sticker-Sammlung auf einem Shirt?
- Ist die Formsprache (Linienstärke, Illustrationsstil) über alle individuellen Designs hinweg konsistent?
- Ist die Druckdatei in ausreichender Auflösung/als Vektor vorhanden, bevor sie an die POD-API geht?

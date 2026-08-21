---
name: user-cabinet-personalization
description: Entwirft persönliche User-Dashboards ("Cabinets") mit individuellen, auf Hobbys/Reiseverhalten/Aktivität basierenden Inhalten, Badge-Übersicht, Merch-Vorschau und Abo-/Affiliate-Status. Nutzen, sobald nach "Nutzer-Dashboard", "persönlicher Bereich", "Cabinet", "Profilseite", "individuelle Inhalte pro User" oder "wie soll der eingeloggte Bereich aussehen" gefragt wird.
requires: auth-billing-affiliate (Konto-/Abo-/Affiliate-Daten), webapp-ui-ux-frontend (Layout-Prinzipien), merch-badge-design-system (Badge-/Merch-Anzeige)
feeds_into: merch-badge-design-system
---

# Persönliches User-Cabinet & Personalisierung

## Zweck
Der eingeloggte Bereich ist der Ort, an dem sich ein User "gesehen" fühlen soll – individuell genug, dass es nicht wie ein Standard-Dashboard wirkt, aber strukturiert genug, dass es nicht chaotisch wird.

## Datenbasis für Personalisierung
Woher die individuellen Signale kommen (klar zwischen aktiv angegeben und beobachtet trennen):
- **Aktiv vom User angegeben**: Hobbys, bevorzugte Reiseziele/-stile, Interessen (z. B. bei Onboarding oder im Profil abfragbar)
- **Beobachtetes Verhalten**: welche Badges erreicht wurden, welche Merch-Designs angeschaut/gekauft wurden, Aktivitätslevel
- Nutzer müssen nachträglich ändern/löschen können, was sie angegeben haben (Datenschutz-Grundsatz, keine Blackbox)

## Vorgehen

### 1. Cabinet-Struktur
Grundsections, die für die meisten Fälle passen (anpassen je nach App):
- **Übersicht/Home**: Begrüßung, aktueller Abo-Status, letzte Aktivität, hervorgehobener nächster Schritt (z. B. "noch 2 Badges bis zum nächsten Merch-Design")
- **Meine Badges**: siehe `merch-badge-design-system` – Fortschrittsanzeige, erreichte/offene Badges
- **Mein Merch**: individuelle Design-Vorschauen, Bestellhistorie, Status laufender POD-Bestellungen
- **Mein Profil**: Hobbys/Interessen/Reisevorlieben editierbar, wirken sich auf Design-Vorschläge aus
- **Abo & Zahlung**: Stripe-Billing-Portal-Link, Rechnungen
- **Affiliate**: eigener Referral-Link, Stand der Provisionen (aus `auth-billing-affiliate`)
- **Feed/Community** (falls genutzt): eigene Posts, Interaktionen – siehe `community-posts-feedback`

### 2. Individualisierungslogik (ohne Overengineering)
- Nicht jedes Hobby muss visuell auftauchen — siehe Grundsatz aus `merch-badge-design-system`: Auswahl statt Vollständigkeit
- Personalisierung zuerst dort einsetzen, wo sie am meisten wahrgenommen wird: Begrüßungstext, hervorgehobene Empfehlung, Merch-Design-Vorschläge
- Reise-Thematik als wiederkehrendes visuelles Leitmotiv im Cabinet nutzen (z. B. Fortschrittsanzeige als "Reiseroute"/Landkarten-Metapher, Badges als "Stempel im Pass") – das schafft Wiedererkennung, ohne dass jede einzelne Komponente reisethematisch überladen wird
- Leere Zustände (noch keine Badges, noch kein Merch) nie einfach leer lassen – konkrete nächste Handlung anzeigen ("Verdiene deinen ersten Badge, indem du …")

### 3. Datenschutz & Kontrolle
- Klar sichtbare Stelle, an der der User einsehen kann, welche Daten für Personalisierung genutzt werden
- Opt-out-Möglichkeit: User kann Personalisierung reduzieren/deaktivieren, ohne die App-Nutzung zu verlieren

## Qualitäts-Check vor Abgabe
- Fühlt sich das Cabinet für unterschiedliche User spürbar unterschiedlich an (nicht nur der Name ausgetauscht)?
- Ist auf einen Blick erkennbar, was der nächste sinnvolle Schritt für den User ist?
- Sind Abo-, Affiliate- und Merch-Status immer aktuell (Bezug zu Webhook-Daten aus `auth-billing-affiliate`)?
- Kann der User seine personalisierungsrelevanten Daten einsehen und ändern?

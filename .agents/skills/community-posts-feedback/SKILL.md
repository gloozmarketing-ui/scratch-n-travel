---
name: community-posts-feedback
description: Konzipiert ein Posts-/Feed-System für User-generierte Inhalte sowie ein strukturiertes Feedback-System (Bug-Reports, Feature-Wünsche, Bewertungen) innerhalb einer komplexen Web-App. Nutzen, sobald nach "Posts", "Feed", "Community-Feature", "Feedback-System", "Bewertungen", "Kommentare" oder "wie sammle ich Nutzer-Feedback in der App" gefragt wird.
requires: auth-billing-affiliate (User-Identität), user-cabinet-personalization (Anzeige eigener Posts/Feedback)
---

# Community-Posts & Feedback-System

## Zweck
Zwei unterschiedliche Zwecke, die oft vermischt werden, aber getrennt gedacht werden sollten: **Posts/Feed** dienen der Community-Bindung und Sichtbarkeit von Erfolgen (z. B. neuer Badge, neues Merch-Design). **Feedback** dient der Produktverbesserung und braucht einen klaren Weg zur Bearbeitung, sonst verpufft es.

## 1. Posts-/Feed-System

### Grundstruktur
- Post-Typen definieren statt nur freien Text: z. B. "Badge erreicht", "Neues Merch-Design", "freier Beitrag" – strukturierte Post-Typen lassen sich einheitlicher darstellen und automatisch anstoßen (z. B. automatischer Post-Vorschlag bei neuem Badge)
- Sichtbarkeitsstufen: öffentlich / nur Follower / privat – je nach App-Charakter nötig, besonders wenn Reise-/Hobby-Inhalte persönlich sind
- Interaktionen bewusst wählen (Likes, Kommentare, Reactions) – nicht alle Funktionen sind nötig, jede zusätzliche Interaktionsart erhöht Moderationsaufwand

### Moderation (nicht optional bei User-generierten Inhalten)
- Melde-Funktion für Posts/Kommentare von Anfang an einplanen, nicht nachträglich
- Basis-Wortfilter/Automations-Check plus manuelle Review-Möglichkeit für gemeldete Inhalte
- Klare, im Onboarding sichtbare Community-Richtlinien (kurz, nicht als langes Rechtsdokument versteckt)

## 2. Feedback-System

### Struktur
- Klar trennen: **Bug-Report** (etwas funktioniert nicht) vs. **Feature-Wunsch** (etwas fehlt) vs. **allgemeines Feedback/Bewertung** – unterschiedliche Formulare/Felder, unterschiedliche interne Priorisierung
- Pro Feedback-Eintrag mindestens: Kategorie, Beschreibung, optional Screenshot/Kontext (welche Seite/welcher Zustand), automatisch mitgeloggter technischer Kontext (Browser, ob eingeloggt) bei Bug-Reports
- **Status-Transparenz**: User sollte den Status seines eingereichten Feedbacks sehen können (Eingegangen / In Prüfung / Umgesetzt / Abgelehnt) – erhöht Vertrauen erheblich und reduziert Wiederholungs-Anfragen
- Upvoting für Feature-Wünsche anderer User ermöglichen (statt jeder schreibt sein eigenes Duplikat) – hilft bei Priorisierung nach Nachfrage

### Verbindung zum Badge-System (optional, aber wirkungsvoll)
- Aktives, hilfreiches Feedback kann selbst mit einem Badge belohnt werden (siehe `merch-badge-design-system`) – erhöht Beteiligung spürbar, sollte aber nicht zu Spam-Feedback nur wegen des Badges führen (z. B. Qualitätsschwelle statt reiner Mengenzählung)

## Qualitäts-Check vor Abgabe
- Sind Posts und Feedback als getrennte, unterschiedlich behandelte Systeme umgesetzt (nicht in einen Topf geworfen)?
- Gibt es eine Melde-/Moderationsmöglichkeit für Posts, bevor die Funktion live geht?
- Kann ein User den Status seines eingereichten Feedbacks nachverfolgen?
- Ist die Sichtbarkeitssteuerung bei Posts für den User klar und einfach einstellbar?

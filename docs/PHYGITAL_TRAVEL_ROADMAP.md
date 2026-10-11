# Phygital Travel & B2B Thekenaufsteller Roadmap — Scratch'n'Travel

> **Status:** Aktiv implementiert & verifiziert · **Datum:** Oktober 2026  
> **Kern-Module:** Gelato REST API v2, `api/gelato-webhook.js`, `api/gelato-quote.js`, `scripts/hermes_host_counter_display_generator.mjs`, `/pricing` & `/host`

---

## 1. Gelato Webhook Konfiguration & API-Architektur

### 1.1 Webhook HTTP-Methode & Events
Im Gelato Developer Dashboard unter Webhooks muss folgendes eingetragen werden:

* **HTTP-Methode:** `POST` (Gelato sendet JSON-Payloads via `application/json` im Request-Body).
* **Ziel-URL:** `https://scratch-n-travel.vercel.app/api/gelato-webhook`
* **Aktive Events (alle 5 selektieren):**
  1. `order_created` — Auftragsbestätigung & Order-ID Mapping
  2. `order_status_updated` — Produktionsstatus (`in_production`, `printed`, `failed`)
  3. `order_item_status_updated` — Einzelpositionsstatus
  4. `order_item_tracking_code_updated` — **Kritisch:** Enthält Paket-Tracking-Code & Carrier (DHL, FedEx, UPS) zur Anzeige im Host-Dashboard
  5. `order_delivery_estimate_updated` — Zustelldatum-Prognosen für Hosts

### 1.2 Sicherheitsarchitektur (Zero-Trust & Vault)
* `GELATO_KEY` und `GELATO_WEBHOOK_SECRET` leben **ausschließlich** in den Vercel Environment Variables.
* Frontend sendet Absichten (`intent`), Server validiert & autorisiert via Supabase Auth bevor Gelato aufgerufen wird.

---

## 2. B2B Thekenaufsteller (Acrylglas-Block 20mm) & 0–4 Ecken Konfigurator

### 2.1 Standard-Empfehlung: Das 3-Monats-Paket
* **Monatlich Flexibel (29 €/Mo):** 29 € Einmalige Setup-/Hardwarepauschale für Fertigung & Versand des 20mm Acrylglas-Blocks.
* **3-Monats-Starter (87 € Vorauszahlung — ⭐ Standard-Empfehlung):** Hardware & Versand zu **100% kostenlos** (0 € Setup). Sofortige Deckung der Produktionskosten von Tag 1 an:
  * Gelato Fertigung (10x15cm, 20mm Acrylglas + UV-Direktdruck): ca. 16,50 €
  * Gelato Express/Standard Versand: ca. 5,00 €
  * Stripe Gebühr: ca. 1,50 €
  * **Netto-Gewinn Tag 1:** `87,00 € - 23,00 € = +64,00 €` (Kein Churn-Risiko nach Monat 1).
* **Digitaler Test-Host (14 €/Mo):** Reine digitale Listung ohne Hardware für Betreiber zum Ausprobieren.

### 2.2 Der flexible 0-bis-4-Ecken QR-Konfigurator
Hosts & Business-Owner können ihren Thekenaufsteller frei konfigurieren:
* **0 Ecken (Pure Gravur & Wappen):** Keine QR-Codes, minimalistisches Luxus-Design mit goldenem Wappen.
* **1 QR-Code (Zentriert):** Prominenter großer Scan-Bereich für maximale Scan-Rate.
* **2 Ecken (Duo-Scan):** Pass-Stempel + Direktkontakt / Speisekarte nebeneinander.
* **3 bis 4 Ecken (Multi-Hub):**
  * Oben Links: 🎟️ Reisepass-Stempel (+50 XP)
  * Oben Rechts: 💬 Direktkontakt / WhatsApp (0% Provision)
  * Unten Links: 🗝️ Insider Secret & Tages-Special des Wirts
  * Unten Rechts: 🗺️ Lokale Empfehlungen & Wanderrouten des Hosts
  * **Alternative konfigurierbare Funktionen:** 🍽️ Digitale Speisekarte, 📶 Gäste-WLAN Express-Connect, 📸 Instagram Community-Tagging, ✏️ Freie URL / Reservierungslink.
  * *Hinweis zu Gelato POD:* Gelato fertigt kristallklare 20mm Acrylglasblöcke im UV-Direktdruck. Da Gelato keine elektronischen NFC-Chips in Acryl gießt, erfolgt der 100% kontaktlose Check-in zuverlässig über hochauflösende QR-Codes per Smartphone-Kamera.

---

## 3. Die 50 Phygital-Ideen: Evaluierung & Roadmap

### Kategorie A: Sofort umsetzbar mit Gelato POD & Vektor-Engine (Tier 1)
1. **Reise-Quest-Notizblock (Travel Quest Journal):** Hardcover A5 Notizbuch mit vorgedruckten Seiten, Secret-Clues, QR-Check-in-Rätseln und Vigenère-Chiffre.
2. **Goldene Rubbel-Sticker (Scratch Sticker Kits):** Individuelle Scratch'n'Travel Postkarten & Poster, veredelt mit beiliegenden Rubbel-Stickern.
3. **Phygital Hotel- & Gastro-Thekenblöcke:** 20mm Acrylglas-Blöcke mit UV-Rückseitendruck und bis zu 4 QR-Code Ecken (Gelato POD).
4. **Postkarten-Quests mit Koordinaten:** Limitierte Kunst-Postkarten mit verschlüsselten GPS-Geheimtipps des Hosts.
5. **Wanderrouten-Miniguides (Z-Fold Faltpläne):** Wetterfeste lokale Karten für Gasthöfe mit geheimen Aussichtspunkten.
6. **Pass-Stempel Stickerbogen:** Physische Hologramm-/Wappen-Sticker für das physische Reisetagebuch bei erreichten Meilensteinen.
7. **Cocktail-/Tages-Special Bierdeckel:** Coaster mit täglichem Rätselcode zur Freischaltung von Secret Spots in der App.
8. **Acryl-Wandplaketten für Certified Hosts:** Auszeichnung für besondere Gastfreundschaft.
9. **Mystery Spot Puzzle-Postkarten:** 4 Postkarten von 4 verschiedenen Hosts in einer Region ergeben zusammengesetzt die Schatzkarte.
10. **Reise-Lesezeichen mit QR-Reise-Soundtrack:** Lokale Playlists & Audio-Stories passend zur Region.

### Kategorie B: Physische Hardware mit Partnern / Manufakturen (Tier 2)
11. **Messing Wander-Münzen (Brass Challenge Coins):** Echte geprägte Münzen mit graviertem NFC-Chip für extreme Berg-Hütten.
12. **Echte Stempel & Tintenkissen:** Gravierte Holzstempel mit individuellem Wappen für den Thekentresen.
13. **Wetterfeste Outdoor-Aluminium-Plaketten:** Für Gipfelkreuze, Grotten und verlassene Ruinen mit UV-beständiger Gravur.
14. **Geocaching Secret-Caches:** Physische Miniatur-Safes an verifizierten Lost Places.

### Kategorie C: Ausgeschlossen / Compliance & BaFin-Restriktionen (Tier 3)
15. **Trinkgeld- & Direktüberweisungs-Hubs für Dritte:** Ausgeschlossen zur Vermeidung von Zahlungsdiensteaufsichtsgesetz (ZAG) / BaFin Lizenzpflichten. Stattdessen: 0% Provisionsgarantie und direkte Bezahlung vor Ort beim Wirt.

---

## 4. Kanban & Sprint-Status

### [DONE] Sprint B2B Phygital Foundation
- [x] SNT-516: /pricing & /host B2B Commitment-Modell (87 € 3-Monats-Paket)
- [x] SNT-517: 0 bis 4 Ecken QR-Code Konfigurator mit Live-3D-Mockup auf /host
- [x] SNT-518: Hermes Gelato Vektor-Generator für 0, 1 und 4 QR-Ecken (`scripts/hermes_host_counter_display_generator.mjs`)
- [x] SNT-519: Serverless Webhook-Handler (`api/gelato-webhook.js`) & Quote-Engine (`api/gelato-quote.js`)
- [x] SNT-520: Hermes Gelato POD Skill (`.agents/skills/hermes-gelato-pod-engine/SKILL.md`) registriert

### [IN PROGRESS] Sprint Phygital Quest Booklets & Testing
- [ ] SNT-521: Quest-Notizbuch Layout-Generator mit Vigenère-Chiffre
- [ ] SNT-522: Host Dashboard: Tracking-Status & Lieferverfolgung des Aufstellers
- [ ] SNT-523: Live Order-Dispatch Testlauf über Gelato Sandbox

### [BACKLOG] Sprint Regional Community & Caching
- [ ] SNT-524: Multi-Host Schnitzeljagd (4-Postkarten-Puzzle einer Region)
- [ ] SNT-525: NFC-Radar Fallback & Offline-Checkin PWA ServiceWorker

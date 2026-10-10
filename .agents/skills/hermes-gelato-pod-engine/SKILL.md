---
name: hermes-gelato-pod-engine
description: Autonomous Print-on-Demand (POD) Production & Fulfillment Engine powered by Gelato REST API v2. Handles 300 DPI vector rendering, country-specific cultural styling, dynamic delivery quotes, B2B acrylic counter blocks, B2C travel quest booklets, and async webhook tracking.
---

# Hermes Gelato POD & Physical-Digital Manufacturing Engine

## 1. Übersicht & Architektur
Diese Skill-Engine steuert die autonome Fertigung und weltweite Auslieferung von physischen Scratch'n'Travel Produkten über die **Gelato REST-API v2** (`https://api.gelato.com/v2`).

Scratch'n'Travel operiert rechtlich als **digitaler Designer & Lizenzgeber**:
- Hermes erzeugt 300-DPI Vektordateien (CMYK, Schnittzugabe, exakte GPS-Gravuren, QR-Codes und Easter-Eggs).
- Gelato übernimmt den dezentralen Druck in über 100 Produktionsstätten in 32 Ländern, Qualitätsprüfung, Verpackung und versicherten Versand per DHL/DPD/Post.
- Null Lagerhaltungsrisiko, keine Vorab-Investition, weltweite Fertigung direkt im Zielland des Empfängers.

---

## 2. Gelato API v2 Spezifikation & Authentifizierung

### A. Authentifizierung & Secrets
- **Header:** `X-API-KEY: <GELATO_KEY>` (oder Bearer Token)
- **Content-Type:** `application/json`
- **Secrets-Speicherorte:**
  - Lokal: `.env` -> `GELATO_KEY`
  - Vercel: Settings -> Environment Variables -> `GELATO_KEY` (ohne `VITE_` Prefix!)
  - Webhook-Secret: `GELATO_WEBHOOK_SECRET`

### B. Kern-Endpoints
1. **Bestellung aufgeben:** `POST https://api.gelato.com/v2/orders`
2. **Versandkosten & Lieferzeit vorab prüfen (Quote):** `POST https://api.gelato.com/v2/order/quotes`
3. **Bestellstatus abrufen:** `GET https://api.gelato.com/v2/orders/{orderId}`
4. **Bestellung stornieren:** `POST https://api.gelato.com/v2/orders/{orderId}:cancel`

---

## 3. Produktkatalog & Spezifikationen

### Produkt 1: B2B Acrylglas-Thekenaufsteller (10 x 15 cm)
* **Gelato Product UID:** `acrylic_block_100x150_20mm_clear`
* **Abmessungen:** 100 x 150 mm, 20 mm Tiefe, freistehend
* **Auflösung:** 300 DPI (1252 x 1843 px inkl. 3 mm Beschnittzugabe)
* **Drucktechnik:** UV-Direktdruck auf Rückseite (spiegelverkehrt für 3D-Glanzeffekt durch das Glas)
* **Design-Elemente:**
  - Landesspezifisches Kultur-Ornament (Azulejos, Mudéjar, Renaissance, Bauhaus, Kompassrose)
  - Branchen-Wappen & Verified Local Partner Signet
  - Exakte GPS-Gravur der Location
  - 300-DPI Vektor-QR-Code (direkter Chat / Stempel / 0% Provision)
  - Lokales Insider-Easter-Egg & Codewort für Gäste (+50 XP)

### Produkt 2: B2C Phygital Travel Quest Booklet / Notizbuch (A5)
* **Gelato Product UID:** `notebook_hardcover_a5_blank` / `softcover_journal_a5`
* **Seiten:** 120g/m² cremefarbenes Naturpapier, liniert/gepunktet
* **Besonderheit:** 50 gedruckte QR-Quests, Scratch-Off Visa-Stickerbogen und geheime Koordinaten.

### Produkt 3: Obsidian & Gold Weltkarte (A2 Poster)
* **Gelato Product UID:** `poster_classic_matte_420x594_a2`
* **Papier:** 250g/m² mattes Premium-Papier

---

## 4. Dynamische Versandkostenberechnung (Quote API)

Vor jeder Bestellung fragt Hermes über `POST /v2/order/quotes` die exakten Lieferkosten und Laufzeiten ab:

```json
{
  "orderReferenceId": "quote-snt-01",
  "recipient": {
    "country": "PT",
    "city": "Lisboa",
    "postCode": "1100-478"
  },
  "products": [
    {
      "itemReferenceId": "item-01",
      "productUid": "acrylic_block_100x150_20mm_clear",
      "quantity": 1
    }
  ]
}
```

**Hermes Margen-Sicherheitsregel:**
- Liegen die berechneten Versandkosten bei über 9,50 € (z. B. entlegene Inseln), schlägt Hermes automatisch die Standard- statt Expressfertigung vor oder berechnet die Insel-Pauschale transparent vorab.

---

## 5. Webhook-Verarbeitung (`/api/gelato-webhook`)

Gelato benachrichtigt Scratch'n'Travel asynchron über Statusänderungen:
* `order_status_updated`: Druck gestartet / Druck abgeschlossen
* `package_shipped`: Paket wurde an Carrier (DHL, DPD, CTT) übergeben.
  - Enthält: `tracking_code`, `tracking_url`, `carrier`
* `order_delivered`: Erfolgreich vor Ort zugestellt.

Hermes speichert den Tracking-Code und schaltet im System den Aufsteller-Status auf `active`.

---

## 6. Autonome Generierungs-Skripte
* Generator: `scripts/hermes_host_counter_display_generator.mjs`
* API Gateway: `api/pod-orders.js`
* Webhook Handler: `api/gelato-webhook.js`
* Quote Service: `api/gelato-quote.js`

# Scratch'n'Travel — POD-Orderbarkeits-Analyse (Stand 2026-09-27)

> **Fragestellung:** Welche der fünf geplanten Merch-SKUs sind bei echten
> Print-on-Demand-Anbietern *einzeln auf Bestellung* (MOQ 1) fertigbar —
> und womit ersetzt man die Ware, die es nicht gibt?
>
> **Ergebnis vorab:** 3 von 5 SKUs sind problemlos orderbar. Die beiden
> Flaggschiffe (Scratch-Off-Map mit Folie, Pass-Booklet mit Goldfolie)
> sind **bei keinem POD-Anbieter lieferbar** — Empfehlung unten.

## 📌 Entscheidung (2026-09-27)

| Punkt | Entscheidung |
|---|---|
| **Ersatz-Linie** | ✅ Angenommen: „Passport Edition" = Reise-Poster A2 + Reisetagebuch A5, ergänzt um Patch, T-Shirt, Tote, Vinyl-Sticker. Folienware wird nicht geführt (SNT-360 ✅). |
| **Provider** | ✅ **Printify** (EU-Druck, breitestes Netz, Mockup-API), Fallback Prodigi (SNT-361 ✅). |
| **Nächste Schritte** | `PRINTIFY_API_KEY` + `PRINTIFY_SHOP_ID` (SNT-363) → echte Blueprint-/Variant-IDs (SNT-364) → Musterbestellung (SNT-365) → Stripe-Katalog angleichen (SNT-366). |

---

## 1. Was aktuell im Katalog liegt

Quelle: `assets/merch_stripe_catalog.json` + `api/stripe-webhook.js`

| # | SKU | Preis | `printifyTemplate` | Platzhalter-IDs im Webhook |
|---|---|---|---|---|
| 1 | Travel Badge Patch (Iron-On) | 14,99 € | `iron_on_patch_75mm` | blueprint 3 / variant 24567 |
| 2 | Scratch-Off World Map (A2) | 34,99 € | `poster_a2_matte` | blueprint 446 / variant 67890 |
| 3 | Luxury Travel Passport (A5) | 24,99 € | `notebook_a5_softcover` | blueprint 237 / variant 45612 |
| 4 | Local Legend T-Shirt | 29,99 € | `tshirt_unisex_gildan` | blueprint 12 / variant dynamisch |
| 5 | Travel Canvas Bag | 22,99 € | `canvas_tote_38x42` | blueprint 77 / variant 12233 |

**Alle IDs sind Platzhalter** (im Code so kommentiert). Sie müssen über die
Printify-API („blueprints"-Endpunkt) gegen den eigenen Shop aufgelöst werden,
sobald `PRINTIFY_API_KEY` + `PRINTIFY_SHOP_ID` vorliegen.

**Widerspruch zur Skill-Spezifikation:** Das POD-Skill-File nennt
*Passport Booklet 125 × 88 mm (Goldfolie)*, *World Scratch-Off Map
500 × 700 mm*, *Visa-Sticker-Sheet A6* — der Stripe-Katalog nennt dagegen
A2-Poster und A5-Notebook. Die Webhook-Zuordnung folgt dem Stripe-Katalog.

---

## 2. Orderbarkeits-Matrix (Recherche 2026-09-27)

**Legende:** ✅ orderbar (MOQ 1, On-Demand) · ⚠️ nur Ersatzform · ❌ nicht lieferbar

| Geplantes Produkt | Printify | Printful | Gelato | Prodigi | B2B-Spezialanbieter | Fazit |
|---|---|---|---|---|---|---|
| **Iron-On Patch 75 mm rund** | ✅ eigener Katalog | ✅ | — | — | — | **orderbar** |
| **T-Shirt Unisex** | ✅ | ✅ | — | ✅ | — | **orderbar** |
| **Canvas-Tote 38 × 42** | ✅ | ✅ | — | ✅ | — | **orderbar** |
| **Poster A2 (statt Scratch-Map)** | ✅ | ✅ | ✅ | ✅ | — | **orderbar** (ohne Kratzschicht) |
| **Notebook A5 (statt Passheft)** | ✅ | ✅ | ✅ | ✅ (UK/EU/US) | — | **orderbar** (ohne Folienprägung) |
| **Scratch-Off-Map mit Folie** | ❌ | ❌ | ❌ | ❌ | ⚠️ 68travel: nur ab **250 Stück**, Wochen–Monate, B2B | **nicht on-demand** |
| **Pass-Booklet 125 × 88 mit Goldfolie** | ❌ | ❌ | ❌ | ❌ | ⚠️ Sonderanfertigung, Auflage + Setup | **nicht on-demand** |
| **Visa-Sticker-Sheet A6 (Vinyl)** | ✅ | ✅ | ✅ | ✅ | — | **orderbar** |

### Belege

- **68travel (Custom Scratch Posters):** „*Usually at least 250 maps … We do
  not make smaller orders due to high setup costs*", Fertigung „a few weeks
  to a couple of months" — `68travel.com/custom-design-scratch-map`.
- **Gelato-Produktkatalog** (Support-Artikel vom 30.10.2025): Standard-POD
  (Poster, Fotobücher, Karten, Kleidung, Canvas …), **kein** Kratz- und **kein**
  Folienprodukt, kein 125 × 88-Format.
- **Prodigi:** 500.000+ Produkte, Wall Art/Sticker/Journals/Bücher, EU-Produktion
  vorhanden — aber kein Scratch-Off- und kein Folien-Booklet-Produkt.
- **Retail-Marken:** „Scratch the World!®" (Maps International) und
  „SCRATCH MAP®" (Luckies of London) sind eingetragene Marken. Das
  Katalog-Label *„Scratch-Off World Map"* sollte **nicht** so auf Verpackung,
  Listing oder Marketingmaterial — Umbenennung empfohlen (SNT-362).

---

## 3. Empfehlung — die „bessere Idee"

**Prinzip:** Nur verkaufen, was auch einzeln lieferbar ist. Die Story
(Reisepass + Abkratzen) wandert dorthin, wo sie schon lebt — ins Produkt —
statt in eine Ware, die kein Anbieter auf Bestellung macht.

### Vorschlag: Ersatz-Linie „Passport Edition" (alles ✅ über EINEN Provider)

| Alt (nicht lieferbar) | Neu (orderbar) | Warum die Geschichte überlebt |
|---|---|---|
| Scratch-Off-World-Map 34,99 € | **Reise-Poster A2** (persönlicher Weltkarte-Print aus dem Digitalen Reisepass) ~24,99 € | Das Kratz-Element bleibt **digital** (Scratch-Canvas im Produkt) + der Print zeigt die *echten* besuchten Orte |
| Pass-Booklet 125 × 88, Goldfolie 24,99 € | **Reisetagebuch „Passport Edition"** (A5-Notebook, Cover = Pass-Design mit Name + Reisenummer) ~24,99 € | Sieht & fühlt sich wie ein Reisepass an, nur ohne Folie — POD-Standard |
| Visa-Sticker-Sheet A6 | bleibt (Vinyl-Sticker, ✅) | „Visen"-Sticker erzählen dasselbe |
| Badge Patch, T-Shirt, Tote | bleiben (✅) | — |

**Provider-Empfehlung: Printify** als einziger Anbieter —
(a) der Webhook ist bereits als Printify-Adapter gebaut,
(b) Patches + Poster + Notebooks + Shirts + Totes in einem Katalog,
(c) eine API, ein Musterbestell-Pfad, kein Multi-Provider-Routing
(das Printful/Contrado-Routing in `Merch_Production_Specs.md` wäre ein
zweites Integrationsprojekt ohne Not). Prodigi bleibt **Fallback** für
EU-lokalen Druck, falls Printify-Preise/Qualität nicht passen.

### Optionen für die Scratch-Map (Entscheidung offen)

- **A (sofort, empfohlen):** Physische Map ganz weglassen; A2-Poster verkaufen;
  Kratz-Game nur digital.
- **B (später):** Kratzposter als **B2B-Auflage 250 Stück** (68travel) und
  Verkauf über den Merch-Shop — erst, wenn die Nachfrage es rechtfertigt.
- **C:** Kratzfolien-**Aufkleber** einzeln beilegen (Zweitlieferant) —
  bricht die „ein Provider, ein Webhook"-Vereinfachung, nur wenn A nicht reicht.

---

## 4. Offene Entscheidungen (vom Nutzer)

1. **Ersatz-Linie ja/nein** — vor allem: Reisetagebuch statt Folienheft,
   Poster statt Kratzmap (Option A oder B oben).
2. **Produktname** — „Scratch-Off World Map" durch einen eigenen Namen
   ersetzen (Markenrisiko).
3. **Provider** — Printify (Empfehlung) oder doch Printful/Prodigi.
4. Erst danach: `PRINTIFY_API_KEY`/`PRINTIFY_SHOP_ID`, echte Blueprint-IDs,
   Musterbestellung (Karten SNT-363…365).

---

*Verwandt: `docs/KANBAN.md` (SNT-360 ff.) · `api/create-merch-checkout-session.js` ·
`api/stripe-webhook.js` · Skill `hermes-merch-pod`*


---
name: merch-pod-designer
description: Autonomous Print-on-Demand (POD) & Vector Merchandise Designer for Hermes. Standardizes print formats (300 DPI, CMYK, Bleed, Safe Zones), automated mockups, and Gelato/Printful/Etsy API sync for travel passports, scratch maps, and badges.
---

# Hermes Merchandise & POD Designer Skill

## 1. Product Specifications & Print Dimensions

### Product 1: Official Luxury Travel Passport Booklet (A5)
* **Trim Size:** 148 x 210 mm (A5)
* **Bleed Size:** 154 x 216 mm (3 mm bleed on all sides)
* **Resolution:** 300 DPI (1819 x 2551 pixels)
* **Color Mode:** CMYK (FOGRA39 / GRACoL)
* **Gold Foil Mask Layer:** 100% K (Black) vector mask on separate PDF layer
* **Materials:** Vegan Leather Cover with Gold Foil Embossing, 120g/m2 Cream Uncoated Paper Inner Pages

### Product 2: Obsidian & Gold Scratch-Off World Map (A2 Poster)
* **Trim Size:** 420 x 594 mm (A2)
* **Bleed Size:** 426 x 600 mm (3 mm bleed)
* **Resolution:** 300 DPI (5031 x 7087 pixels)
* **Layers:**
  1. Base Layer (CMYK Full Color): Obsidian relief, topographic lines, city markers, flags
  2. Scratch Layer (Spot Metallic Gold): Latex/Resin scratch-off coating overlay
* **Paper Stock:** 250g/m2 Matte Art Paper with UV Varnish Protection

### Product 3: Embroidered Travel Badges & Enamel Pins
* **Patch Size:** 75 x 75 mm (Circular / Hexagonal)
* **Border:** Merrowed Border with Velcro Hook & Loop Backing
* **Enamel Pins:** 35 x 35 mm Hard Enamel with Zinc Alloy & Butterfly Clutch

---

## 2. Print-on-Demand (POD) API Automation Workflows

### Gelato API Workflow
* **Endpoint:** POST https://api.gelato.com/v2/orders
* **Auth:** Bearer Token (GELATO_API_KEY)

### Printful API Workflow
* **Endpoint:** POST https://api.printful.com/orders
* **Auth:** Bearer Token (PRINTFUL_API_KEY)
* **Advantage:** Automated worldwide dropshipping fulfillment with zero inventory risk.

---

## 3. Brand Protection & Legal Classification
* **Designer Classification:** The store operates purely as a digital design studio / creator platform.
* **Fulfillment:** 100% white-label print-on-demand fulfillment. No inventory risk, no manual packaging.
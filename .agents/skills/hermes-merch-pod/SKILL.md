---
name: hermes-merch-pod
description: Autonomous Print-on-Demand (POD) & Merch Generator for Scratch'n'Travel. Prepares 300 DPI print-ready vectors, custom passports, scratch maps, and Gelato/Printful API payloads while operating 100% in Designer/Licensor mode for seamless tax compliance.
---

# Hermes Merch & Print-on-Demand (POD) Skill

## 1. Role & Mission
Hermes functions as an autonomous **Digital Designer & Licensor**. 
By utilizing Print-on-Demand (POD) fulfillment providers (Gelato, Printful, Prodigi, Printify), Scratch'n'Travel acts strictly as a **digital design creator / IP licensor**, while the POD partner handles manufacturing, quality control, packaging, international shipping, VAT collection, and returns.

## 2. Print Specifications & Dimensions Matrix

| Product | Trim Dimensions | Print Canvas (300 DPI + 3mm Bleed) | Color Profile | Material Specs |
| :--- | :--- | :--- | :--- | :--- |
| **Luxury Travel Passport Booklet** | 125 x 88 mm (Closed) | 131 x 94 mm (1547 x 1110 px @ 300 DPI) | CMYK (FOGRA39) + Gold Foil Layer | 350g Vegan Leather / Textured Black Linen |
| **World Scratch-Off Map** | 500 x 700 mm | 506 x 706 mm (5976 x 8339 px @ 300 DPI) | CMYK + Scratch-Foil Mask | 250g Silk Matte Art Paper + Metallic Gold Layer |
| **Official Visa Stamp Sticker Sheet** | 105 x 148 mm (A6) | 111 x 154 mm (1311 x 1819 px @ 300 DPI) | CMYK + Die-Cut Vector Line | Waterproof Matte Vinyl Stickers |

## 3. Autonomous Generation Workflow
1. **User Trip Ingestion**: Extract user visited cities, GPS coordinates, completed hobbies, and awarded badges from `scratch_user_stamps` in `localStorage` or Supabase.
2. **Passport Page Layout**: Generate vector layout with official document ID, owner name, issue date, and high-res SVG visa seals.
3. **Scratch Layer Mask**: Generate custom black & gold foil overlay matching the user’s unvisited countries.
4. **Fulfillment Payload**: Output JSON payload conforming to Gelato API / Printful API format for instant 1-click fulfillment.
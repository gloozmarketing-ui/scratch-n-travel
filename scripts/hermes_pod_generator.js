/**
 * Hermes Print-on-Demand (POD) & Merch Generator v1.0
 * Generates print-ready dimensions, CMYK color palettes, and Gelato/Printful fulfillment payloads.
 * Operates strictly in Designer/Licensor mode for seamless German tax compliance.
 */

const fs = require('fs');
const path = require('path');

const PRINT_SPECS = {
  passportBooklet: {
    title: 'Luxury Vegan Leather Travel Passport Booklet',
    dimensionsMm: { width: 125, height: 88, bleedMm: 3 },
    resolutionDpi: 300,
    pixelsAt300Dpi: { width: 1547, height: 1110 },
    colorSpace: 'CMYK FOGRA39 + Metallic Gold Spot Color (#F59E0B)',
    coverMaterial: '350gsm Black Textured Linen / Vegan Leather with Gold Embossing',
    pages: 24
  },
  worldScratchMap: {
    title: 'Obsidian & Gold World Scratch-Off Map',
    dimensionsMm: { width: 500, height: 700, bleedMm: 3 },
    resolutionDpi: 300,
    pixelsAt300Dpi: { width: 5976, height: 8339 },
    colorSpace: 'CMYK + Silk Matte Varnish + Scratch Latex Mask',
    paper: '250gsm Silk Matte Artboard'
  },
  visaStickerSheet: {
    title: 'Die-Cut Waterproof Travel Visa Badges (A6 Sheet)',
    dimensionsMm: { width: 105, height: 148, bleedMm: 3 },
    resolutionDpi: 300,
    pixelsAt300Dpi: { width: 1311, height: 1819 },
    material: 'High-Tack Matte Vinyl, UV & Water Resistant'
  }
};

function generatePODFulfillmentPayload(userPassportData) {
  const documentId = userPassportData.documentId || 'ST-2026-PT-8842';
  const stamps = userPassportData.stamps || [];
  const userName = userPassportData.userName || 'VIP Explorer';

  return {
    partner: 'Gelato / Printful POD Fulfillment',
    designerMode: 'IP Licensing (Designer Only - No Merchant Physical Stock)',
    orderReference: `POD-MERCH-${Date.now()}`,
    customerName: userName,
    items: [
      {
        productType: 'custom_passport_booklet',
        sku: 'ST-PASS-LUX-01',
        quantity: 1,
        specifications: PRINT_SPECS.passportBooklet,
        customization: {
          embossedDocId: documentId,
          includedStampsCount: stamps.length,
          stampsList: stamps.map(s => s.title || s)
        }
      },
      {
        productType: 'world_scratch_map',
        sku: 'ST-MAP-5070-GOLD',
        quantity: 1,
        specifications: PRINT_SPECS.worldScratchMap,
        customization: {
          initialUnscratchedOverlay: 'Metallic Gold Latex Coating',
          includedRegionZoom: 'Europe & World Hotspots'
        }
      }
    ],
    metadata: {
      generatedBy: 'Hermes Merch Engine v2.0',
      timestamp: new Date().toISOString(),
      compliance: 'Designer Licensing (§ 18 UStG / B2B POD Drop-fulfillment)'
    }
  };
}

if (require.main === module) {
  const sampleUser = {
    userName: 'Alex aus Köln',
    documentId: 'ST-2026-PT-8842',
    stamps: [
      { title: 'LISBOA SECRET GEM SEAL' },
      { title: 'NAZARÉ BIG WAVE SURF SEAL' },
      { title: 'PRAIA DA URSA DOG SEAL' },
      { title: 'ALFAMA CHEF MASTER SEAL' }
    ]
  };

  const payload = generatePODFulfillmentPayload(sampleUser);
  console.log('✨ [Hermes POD Generator] Successfully generated POD specifications:\n');
  console.log(JSON.stringify(payload, null, 2));
}

module.exports = { PRINT_SPECS, generatePODFulfillmentPayload };
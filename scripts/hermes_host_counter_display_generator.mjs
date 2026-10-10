/**
 * scripts/hermes_host_counter_display_generator.js
 * 
 * Hermes Autonomous B2B QR Counter Display Generator v2.0
 * 
 * Generiert vollautomatisch für jeden verifizierten Local Host (29 €/Mo)
 * ein individuelles, 300-DPI-druckfähiges Vektor-/SVG-Design für Acrylglas-Thekenaufsteller
 * inklusive landesspezifischem Muster, exakten GPS-Koordinaten, Community-Easter-Eggs
 * und Gelato Print-on-Demand (POD) Fulfillment Payload.
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// ── 1. Produktspezifikationen: Freistehender Acrylglas-Block (10 x 15 cm) ────
export const ACRYLIC_BLOCK_SPECS = {
  productType: 'acrylic_block_10x15',
  provider: 'Gelato API',
  formatMm: { width: 100, height: 150, depth: 20, bleedMm: 3 },
  resolutionDpi: 300,
  pixelsAt300Dpi: { width: 1252, height: 1843 }, // Inklusive 3mm Beschnittzugabe
  colorPalette: {
    obsidianGreen: '#042c2e', // Scratch'n'Travel Marken-Tiefe
    champagneGold: '#D9D19B', // Gold / Pergament
    brightSun: '#fff6b7',
    leafAccent: '#a8d4c0',
    inkDark: '#121816',
  },
  material: '20 mm poliertes Premium-Acrylglas (freistehend ohne Ständer, UV-Direktdruck auf Rückseite)'
}

// ── 2. Landesspezifische Easter-Eggs & Design-Motive ─────────────────────────
export const COUNTRY_DESIGN_THEMES = {
  PT: {
    countryName: 'Portugal',
    pattern: 'Azulejo-Fliesenmuster & Atlantik-Relief',
    easterEgg: '„Geheimtipp: Zeige dem Host diesen Pass-Stempel für den geheimen Hauswein des Hauses!“',
    secretRiddle: 'Entdecke das Azulejo-Detail an der Fassade · Codewort: ALFAMA_SECRET',
    borderStyle: 'ornate_azulejo',
    flag: '🇵🇹',
    culturalQuote: '„Onde a terra acaba e o mar começa.“'
  },
  ES: {
    countryName: 'Spanien',
    pattern: 'Andalusische Geometrie & Bougainvillea-Ornamente',
    easterEgg: '„Insider: Frage nach der Tapa del Día, die nicht auf der Karte steht!“',
    secretRiddle: 'Hinterlasse ein Foto in WanderBond · Codewort: TAPAS_PASSPORT',
    borderStyle: 'mudejar_filigree',
    flag: '🇪🇸',
    culturalQuote: '„La vida se vive mejor compartiendo.“'
  },
  IT: {
    countryName: 'Italien',
    pattern: 'Toskana-Zypressen & Renaissance-Prägung',
    easterEgg: '„La Dolce Vita: Wer den Espresso an der Bar trinkt, spart die Coperto-Gebühr!“',
    secretRiddle: 'Rubbel den Spot frei für +50 XP · Codewort: ESPRESSO_LEGEND',
    borderStyle: 'florentine_classic',
    flag: '🇮🇹',
    culturalQuote: '„Fatto con passione locale.“'
  },
  DE: {
    countryName: 'Deutschland',
    pattern: 'Bauhaus-Minimalismus & Topographische Höhenlinien',
    easterEgg: '„Ehrenkodex: 0% Vermittlungsgebühr – 100% deiner Unterstützung bleiben beim Host.“',
    secretRiddle: 'Finde den nächsten geheimen Innenhof · Codewort: HINTERHOF_EXPLORER',
    borderStyle: 'bauhaus_clean',
    flag: '🇩🇪',
    culturalQuote: '„Echte Orte, echte Menschen.“'
  },
  DEFAULT: {
    countryName: 'Global Explorer Hub',
    pattern: 'Nautische Kompass-Geometrie & Höhenlinien',
    easterEgg: '„Scanne für deinen offiziellen digitalen Stempel im Reisepass (+50 XP).“',
    secretRiddle: 'Gemeinsam unterwegs statt Massentourismus · Codewort: WANDERBOND_ORIGIN',
    borderStyle: 'nautical_compass',
    flag: '🧭',
    culturalQuote: '„Travel deeper, wander free.“'
  }
}

// ── 3. Vektor-Design SVG Template Generator ─────────────────────────────────
export function generateCounterDisplaySvg(hostData) {
  const theme = COUNTRY_DESIGN_THEMES[hostData.countryCode] || COUNTRY_DESIGN_THEMES.DEFAULT
  const businessName = hostData.businessName || 'Local Partner Venue'
  const city = hostData.city || 'Lissabon'
  const gps = hostData.gpsCoordinates || "38°42'44\"N · 9°07'59\"W"
  const qrTargetUrl = hostData.qrTargetUrl || `https://scratch-n-travel.vercel.app/host/${encodeURIComponent(hostData.slug || 'verified-host')}?ref=counter_qr`
  
  // SVG 1252 x 1843 px (300 DPI @ 10x15 cm + 3mm Bleed)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1252 1843" width="1252" height="1843">
  <defs>
    <!-- Hintergrund-Gradient (#042c2e zu #083d40) -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#042c2e" />
      <stop offset="50%" stop-color="#063538" />
      <stop offset="100%" stop-color="#021c1d" />
    </linearGradient>

    <!-- Gold-Gradient für Schmuckelemente (#D9D19B / #fff6b7) -->
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#D9D19B" />
      <stop offset="50%" stop-color="#fff6b7" />
      <stop offset="100%" stop-color="#b8ad70" />
    </linearGradient>

    <!-- Dezentes Topo-Muster -->
    <pattern id="topoGrid" width="120" height="120" patternUnits="userSpaceOnUse">
      <circle cx="60" cy="60" r="50" fill="none" stroke="#D9D19B" stroke-width="0.75" stroke-opacity="0.12" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="#D9D19B" stroke-width="0.75" stroke-opacity="0.08" />
    </pattern>
  </defs>

  <!-- 1. Hintergrund-Ebene -->
  <rect width="1252" height="1843" fill="url(#bgGradient)" />
  <rect width="1252" height="1843" fill="url(#topoGrid)" />

  <!-- 2. Zierrahmen mit 3mm Beschnitt-Sicherheitszone -->
  <rect x="50" y="50" width="1152" height="1743" rx="24" fill="none" stroke="url(#goldGradient)" stroke-width="3" stroke-opacity="0.8" />
  <rect x="65" y="65" width="1122" height="1713" rx="16" fill="none" stroke="url(#goldGradient)" stroke-width="1" stroke-opacity="0.3" stroke-dasharray="8 6" />

  <!-- 3. Kopfbereich: Scratch'n'Travel Marken-Wappen & Siegel -->
  <g transform="translate(626, 170)" text-anchor="middle">
    <!-- Kompass-Stern SVG -->
    <path d="M 0,-45 L 12,-12 L 45,0 L 12,12 L 0,45 L -12,12 L -45,0 L -12,-12 Z" fill="url(#goldGradient)" />
    <circle cx="0" cy="0" r="8" fill="#042c2e" />
    
    <text y="75" font-family="'Cinzel', 'Playfair Display', Georgia, serif" font-size="28" font-weight="bold" fill="url(#goldGradient)" letter-spacing="6">
      SCRATCH 'N' TRAVEL
    </text>
    <text y="105" font-family="'Space Grotesk', 'Courier New', monospace" font-size="16" font-weight="600" fill="#a8d4c0" letter-spacing="3">
      VERIFIED LOCAL HOST SPOT · 2026
    </text>
  </g>

  <!-- 4. Host-Personalisierung (Name, Ort & GPS) -->
  <g transform="translate(626, 380)" text-anchor="middle">
    <text y="0" font-family="'Cinzel', 'Playfair Display', Georgia, serif" font-size="52" font-weight="bold" fill="#ffffff" letter-spacing="2">
      ${escapeXml(businessName)}
    </text>
    <text y="50" font-family="'Space Grotesk', 'Courier New', monospace" font-size="24" font-weight="600" fill="url(#goldGradient)" letter-spacing="4">
      📍 ${escapeXml(city.toUpperCase())} · ${theme.flag} ${escapeXml(theme.countryName.toUpperCase())}
    </text>
    <text y="85" font-family="'Space Grotesk', monospace" font-size="17" fill="#a8d4c0" letter-spacing="2" opacity="0.85">
      GPS: ${escapeXml(gps)}
    </text>
  </g>

  <!-- 5. QR-Code Container (Zentraler Interaktionsbereich) -->
  <g transform="translate(626, 780)">
    <!-- Weißer Kontrast-Hintergrund für 100% Kamera-Lesbarkeit -->
    <rect x="-240" y="-240" width="480" height="480" rx="32" fill="#ffffff" filter="drop-shadow(0px 16px 32px rgba(0,0,0,0.4))" />
    <rect x="-248" y="-248" width="496" height="496" rx="36" fill="none" stroke="url(#goldGradient)" stroke-width="3" />
    
    <!-- QR Code Placeholder Graphic (Inkl. Marken-Zentrum) -->
    <!-- (Im echten Flow wird hier der exakte QR Vektorkern eingebunden) -->
    <rect x="-200" y="-200" width="400" height="400" fill="#121816" rx="16" opacity="0.95" />
    
    <!-- QR Scanner Target Ecken -->
    <path d="M -180,-140 L -180,-180 L -140,-180" fill="none" stroke="#D9D19B" stroke-width="8" stroke-linecap="round" />
    <path d="M 140,-180 L 180,-180 L 180,-140" fill="none" stroke="#D9D19B" stroke-width="8" stroke-linecap="round" />
    <path d="M -180,140 L -180,180 L -140,180" fill="none" stroke="#D9D19B" stroke-width="8" stroke-linecap="round" />
    <path d="M 140,180 L 180,180 L 180,140" fill="none" stroke="#D9D19B" stroke-width="8" stroke-linecap="round" />

    <!-- Zentrum Kompass-Icon -->
    <circle cx="0" cy="0" r="44" fill="#042c2e" stroke="#D9D19B" stroke-width="4" />
    <text x="0" y="8" font-size="28" text-anchor="middle">🧭</text>

    <!-- Scan Call to Action -->
    <text x="0" y="290" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="22" font-weight="bold" fill="#ffffff" letter-spacing="1">
      📱 MIT DEM SMARTPHONE SCANNEN
    </text>
    <text x="0" y="325" text-anchor="middle" font-family="'Space Grotesk', monospace" font-size="16" fill="#D9D19B">
      Pass-Stempel sichern · Tisch &amp; Tasting reservieren (0% Gebühr)
    </text>
  </g>

  <!-- 6. Community Easter-Egg & Geheimtipp-Box -->
  <g transform="translate(626, 1260)">
    <rect x="-480" y="0" width="960" height="150" rx="20" fill="#031f20" stroke="url(#goldGradient)" stroke-width="1.5" stroke-opacity="0.6" />
    
    <text x="-440" y="42" font-family="'Space Grotesk', monospace" font-size="16" font-weight="bold" fill="url(#goldGradient)" letter-spacing="2">
      ✦ LOKALER EHRENKODEX &amp; INSIDER-TIPP:
    </text>
    <text x="-440" y="78" font-family="'Cinzel', Georgia, serif" font-size="20" fill="#ffffff" font-style="italic">
      ${escapeXml(theme.easterEgg)}
    </text>
    <text x="-440" y="115" font-family="'Space Grotesk', monospace" font-size="15" fill="#a8d4c0">
      🔑 Community-Easter-Egg: ${escapeXml(theme.secretRiddle)}
    </text>
  </g>

  <!-- 7. Fußbereich: 0% Provisions-Garantie & Vertrauens-Siegel -->
  <g transform="translate(626, 1540)" text-anchor="middle">
    <line x1="-300" y1="0" x2="300" y2="0" stroke="url(#goldGradient)" stroke-width="1" stroke-opacity="0.3" />
    <text y="40" font-family="'Cinzel', Georgia, serif" font-size="18" fill="url(#goldGradient)" font-style="italic">
      ${escapeXml(theme.culturalQuote)}
    </text>
    <text y="75" font-family="'Space Grotesk', sans-serif" font-size="15" font-weight="bold" fill="#ffffff">
      🛡️ 0% PLATTFORM-PROVISION · DIREKTE BEZAHLUNG BEIM WIRT VOR ORT
    </text>
    <text y="105" font-family="'Space Grotesk', monospace" font-size="13" fill="#a8d4c0" opacity="0.8">
      Teil des unabhängigen Scratch'n'Travel Explorer-Netzwerks · Powered by Hermes Engine
    </text>
  </g>
</svg>`
}

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

// ── 4. Gelato POD API Payload Generator ─────────────────────────────────────
export function createGelatoOrderPayload(hostOrder) {
  const theme = COUNTRY_DESIGN_THEMES[hostOrder.countryCode] || COUNTRY_DESIGN_THEMES.DEFAULT
  const orderId = `SNT-HOST-${Date.now()}`
  
  return {
    orderType: 'order',
    orderReferenceId: orderId,
    customerReferenceId: hostOrder.hostId || 'host_demo_user',
    currency: 'EUR',
    items: [
      {
        itemReferenceId: `item_${orderId}`,
        productUid: 'acrylic_block_100x150_20mm_clear', // Offizielle Gelato Produkt-ID für Acryl-Blöcke
        files: [
          {
            type: 'default',
            url: hostOrder.renderedDesignUrl || 'https://scratch-n-travel.vercel.app/assets/demo_host_acrylic_print.pdf'
          }
        ],
        quantity: 1
      }
    ],
    shippingAddress: {
      firstName: hostOrder.contactFirstName || 'Inhaber',
      lastName: hostOrder.contactLastName || hostOrder.businessName,
      companyName: hostOrder.businessName,
      addressLine1: hostOrder.shippingStreet,
      city: hostOrder.shippingCity,
      postCode: hostOrder.shippingZip,
      country: hostOrder.countryCode, // z. B. 'PT', 'ES', 'DE'
      email: hostOrder.contactEmail
    },
    metadata: {
      generatedBy: 'Hermes Autonomous Merch Engine v2.0',
      customDesignTheme: theme.countryName,
      easterEggCode: theme.secretRiddle,
      plan: 'Verified Local Host Starter (29 €/Mo)',
      guarantee: '0% Booking Commission'
    }
  }
}

// ── 5. Ausführung & Demo-Export ──────────────────────────────────────────────
if (process.argv[1] && process.argv[1].endsWith('hermes_host_counter_display_generator.mjs')) {
  console.log('✨ [Hermes B2B Generator] Initialisiere Test-Generierung für Café Miradouro (Lissabon, PT)...\n')
  
  const sampleHost = {
    businessName: 'Miradouro Café & Tasca',
    slug: 'miradouro-cafe-lisboa',
    city: 'Lisboa',
    countryCode: 'PT',
    gpsCoordinates: "38°42'44\"N · 9°07'59\"W",
    contactFirstName: 'Manuel',
    contactLastName: 'Silva',
    contactEmail: 'host@miradouro-lisboa.pt',
    shippingStreet: 'Rua de Santa Cruz do Castelo 14',
    shippingCity: 'Lisboa',
    shippingZip: '1100-478',
  }

  const svgOutput = generateCounterDisplaySvg(sampleHost)
  const gelatoPayload = createGelatoOrderPayload({
    ...sampleHost,
    renderedDesignUrl: 'https://scratch-n-travel.vercel.app/storage/host-prints/miradouro-pt-print.pdf'
  })

  const outputDir = join(ROOT, 'dist/b2b-displays')
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  const svgFilePath = join(outputDir, 'sample_host_acrylic_display.svg')
  writeFileSync(svgFilePath, svgOutput, 'utf8')

  console.log(`✓ 300 DPI Vektor-SVG erfolgreich generiert: ${svgFilePath}`)
  console.log(`✓ Gelato API Order Payload für automatischen Post-Versand bereit:`)
  console.log(JSON.stringify(gelatoPayload, null, 2))
}

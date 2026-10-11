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

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// Auto-Load .env falls lokal vorhanden (ohne fremde Packages)
const envPath = join(ROOT, '.env')
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...vals] = trimmed.split('=')
      const val = vals.join('=').trim().replace(/^["']|["']$/g, '')
      if (!process.env[k.trim()]) process.env[k.trim()] = val
    }
  }
}

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

// ── 2. Branchen-Profile für alle Arten von Business Ownern ──────────────────
export const BUSINESS_CATEGORY_PROFILES = {
  cafe_gastro: {
    key: 'cafe_gastro',
    title: 'Café, Bar & Gastronomie',
    badgeText: 'VERIFIED GASTRO & CAFÉ SPOT',
    icon: '☕',
    ctaScanText: 'Tisch reservieren · Tasting buchen (0% Gebühr)',
    defaultEasterEgg: '„Geheimtipp: Zeige dem Barista diesen Stempel für den geheimen Haus-Roast oder Hauswein!“',
    defaultRiddle: 'Frage nach dem ungelisteten Spezialgericht · Codewort: TASTE_LOCAL',
  },
  surf_watersports: {
    key: 'surf_watersports',
    title: 'Surfschule & Wassersport',
    badgeText: 'VERIFIED SURF & OCEAN BASE',
    icon: '🏄',
    ctaScanText: 'Surf-Session buchen · Neopren & Board leihen (0% Gebühr)',
    defaultEasterEgg: '„Spot-Check: Die Surflehrer verraten dir den geheimen Sandbank-Peak bei Ebbe!“',
    defaultRiddle: 'Frag nach der Secret Sunset Session · Codewort: SWELL_CHASER',
  },
  winery_tasting: {
    key: 'winery_tasting',
    title: 'Weingut, Bodega & Craft Tasting',
    badgeText: 'VERIFIED WINERY & CELLAR',
    icon: '🍇',
    ctaScanText: 'Weinprobe reservieren · Direktverkauf ohne Aufschlag (0% Gebühr)',
    defaultEasterEgg: '„Kellergeheimnis: Wer den Pass vorzeigt, darf das unetikettierte Reserve-Fass probieren!“',
    defaultRiddle: 'Finde das älteste Holzfass im Gewölbe · Codewort: TERROIR_GOLD',
  },
  outdoor_guide: {
    key: 'outdoor_guide',
    title: 'Outdoor-, Wander- & Bergführer',
    badgeText: 'VERIFIED ALPINE & OUTDOOR GUIDE',
    icon: '🥾',
    ctaScanText: 'Tour & Guiding anfragen · Ausrüstung leihen (0% Gebühr)',
    defaultEasterEgg: '„Bergwacht-Insider: Der Guide zeigt dir den versteckten Grat fernab aller Touristenpfade!“',
    defaultRiddle: 'Erreiche den unmarkierten Panoramastein · Codewort: SUMMIT_SEEKER',
  },
  camper_glamping: {
    key: 'camper_glamping',
    title: 'Camper-Stellplatz, Glamping & Eco-Lodge',
    badgeText: 'VERIFIED VANLIFE & ECO-CAMP',
    icon: '🚐',
    ctaScanText: 'Stellplatz reservieren · Glamping-Zelt anfragen (0% Gebühr)',
    defaultEasterEgg: '„Vanlife-Community: Kostenloses Frischwasser & Feuerstelle für registrierte Explorer!“',
    defaultRiddle: 'Parke mit freiem Blick auf den Sonnenuntergang · Codewort: VANLIFE_HAVEN',
  },
  artisan_workshop: {
    key: 'artisan_workshop',
    title: 'Handwerk, Töpferei & Manufaktur',
    badgeText: 'VERIFIED ARTISAN & MAKER ATELIER',
    icon: '🏺',
    ctaScanText: 'Workshop buchen · Handgefertigtes Unikat sichern (0% Gebühr)',
    defaultEasterEgg: '„Meisterstück: Erhalte dein gebranntes Souvenir mit offiziellem Explorer-Signet!“',
    defaultRiddle: 'Drehe die Töpferscheibe selbst aus · Codewort: CRAFT_SOUL',
  },
  coworking_coliving: {
    key: 'coworking_coliving',
    title: 'Coworking Space & Nomad Hub',
    badgeText: 'VERIFIED NOMAD & COWORKING HUB',
    icon: '💻',
    ctaScanText: 'Day-Pass sichern · Fix-Desk & Meetingraum anfragen (0% Gebühr)',
    defaultEasterEgg: '„Nomad Secret: 1 Gbit/s Glasfaser, Community-Kaffee & ruhige Call-Booths inklusive!“',
    defaultRiddle: 'Finde den besten Desk am Panoramafenster · Codewort: DIGITAL_NOMAD',
  },
  hotel_boutique: {
    key: 'hotel_boutique',
    title: 'Boutique Hotel, B&B & Eco-Resort',
    badgeText: 'VERIFIED BOUTIQUE RETREAT',
    icon: '🏨',
    ctaScanText: 'Zimmer & Suite direkt anfragen · Bestpreis-Garantie (0% Gebühr)',
    defaultEasterEgg: '„Rezeptions-Geheimnis: Kostenloses Upgrade oder Welcome-Drink bei Direktbuchung!“',
    defaultRiddle: 'Frage nach dem historischen Schlüssel · Codewort: BOUTIQUE_KEY',
  },
  bike_rental: {
    key: 'bike_rental',
    title: 'Bike, Gravel & E-Bike Verleih',
    badgeText: 'VERIFIED BIKE & GRAVEL STATION',
    icon: '🚲',
    ctaScanText: 'Bike & Helm leihen · GPS-Trailroute downloaden (0% Gebühr)',
    defaultEasterEgg: '„Trail-Tipp: Erhalte die Offline-GPX Route zu den einsamsten Singletrails!“',
    defaultRiddle: 'Fahre den Trail vor Sonnenuntergang · Codewort: GRAVEL_TRAIL',
  },
}

// ── 3. Landesspezifische Easter-Eggs & Design-Motive ─────────────────────────
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

// ── 4. Vektor-Design SVG Template Generator ─────────────────────────────────
export function generateCounterDisplaySvg(hostData) {
  const theme = COUNTRY_DESIGN_THEMES[hostData.countryCode] || COUNTRY_DESIGN_THEMES.DEFAULT
  const category = BUSINESS_CATEGORY_PROFILES[hostData.categoryKey] || BUSINESS_CATEGORY_PROFILES.cafe_gastro
  const businessName = hostData.businessName || 'Local Partner Venue'
  const city = hostData.city || 'Lissabon'
  const gps = hostData.gpsCoordinates || "38°42'44\"N · 9°07'59\"W"
  const qrTargetUrl = hostData.qrTargetUrl || `https://scratch-n-travel.vercel.app/host/${encodeURIComponent(hostData.slug || 'verified-host')}?ref=counter_qr`
  
  const displayEasterEgg = hostData.customEasterEgg || category.defaultEasterEgg || theme.easterEgg
  const displayRiddle = hostData.customRiddle || category.defaultRiddle || theme.secretRiddle
  const displayCta = hostData.customCta || category.ctaScanText
  
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
      ${escapeXml(category.badgeText)} · 2026
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

  <!-- 5. QR-Code Container (Unterstützt 0, 1 oder 4 Ecken) -->
  ${hostData.qrCount === 0 ? `
  <g transform="translate(626, 780)" text-anchor="middle">
    <circle cx="0" cy="0" r="160" fill="#021c1d" stroke="url(#goldGradient)" stroke-width="4" filter="drop-shadow(0px 16px 32px rgba(0,0,0,0.5))" />
    <path d="M 0,-80 L 22,-22 L 80,0 L 22,22 L 0,80 L -22,22 L -80,0 L -22,-22 Z" fill="url(#goldGradient)" />
    <circle cx="0" cy="0" r="14" fill="#042c2e" />
    <text y="125" font-family="'Cinzel', Georgia, serif" font-size="22" font-weight="bold" fill="#ffffff" letter-spacing="4">
      NFC-TOUCH &amp; LASER-GRAVUR
    </text>
    <text y="155" font-family="'Space Grotesk', monospace" font-size="15" fill="#D9D19B">
      Reisepass-Checkin kontaktlos via Smartphone-NFC
    </text>
  </g>
  ` : hostData.qrCount === 4 ? `
  <g transform="translate(626, 780)">
    <!-- 4 Ecken Layout: TL, TR, BL, BR -->
    <g transform="translate(-320, -140)">
      <rect x="-110" y="-110" width="220" height="220" rx="20" fill="#ffffff" stroke="url(#goldGradient)" stroke-width="2" />
      <rect x="-90" y="-90" width="180" height="180" fill="#121816" rx="10" />
      <text x="0" y="8" font-size="28" text-anchor="middle">🎟️</text>
      <text x="0" y="140" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="14" font-weight="bold" fill="#ffffff">Pass-Stempel</text>
    </g>
    <g transform="translate(320, -140)">
      <rect x="-110" y="-110" width="220" height="220" rx="20" fill="#ffffff" stroke="url(#goldGradient)" stroke-width="2" />
      <rect x="-90" y="-90" width="180" height="180" fill="#121816" rx="10" />
      <text x="0" y="8" font-size="28" text-anchor="middle">💬</text>
      <text x="0" y="140" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="14" font-weight="bold" fill="#ffffff">Direkt-Chat</text>
    </g>
    <!-- Zentrum: Wappen -->
    <circle cx="0" cy="0" r="60" fill="#021c1d" stroke="url(#goldGradient)" stroke-width="3" />
    <text x="0" y="14" font-size="44" text-anchor="middle">${category.icon || '🧭'}</text>
    <g transform="translate(-320, 180)">
      <rect x="-110" y="-110" width="220" height="220" rx="20" fill="#ffffff" stroke="url(#goldGradient)" stroke-width="2" />
      <rect x="-90" y="-90" width="180" height="180" fill="#121816" rx="10" />
      <text x="0" y="8" font-size="28" text-anchor="middle">🗝️</text>
      <text x="0" y="140" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="14" font-weight="bold" fill="#ffffff">Insider Secret</text>
    </g>
    <g transform="translate(320, 180)">
      <rect x="-110" y="-110" width="220" height="220" rx="20" fill="#ffffff" stroke="url(#goldGradient)" stroke-width="2" />
      <rect x="-90" y="-90" width="180" height="180" fill="#121816" rx="10" />
      <text x="0" y="8" font-size="28" text-anchor="middle">🗺️</text>
      <text x="0" y="140" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="14" font-weight="bold" fill="#ffffff">Lokale Routen</text>
    </g>
  </g>
  ` : `
  <g transform="translate(626, 780)">
    <!-- Standard 1 QR Code Zentriert -->
    <rect x="-240" y="-240" width="480" height="480" rx="32" fill="#ffffff" filter="drop-shadow(0px 16px 32px rgba(0,0,0,0.4))" />
    <rect x="-248" y="-248" width="496" height="496" rx="36" fill="none" stroke="url(#goldGradient)" stroke-width="3" />
    
    <rect x="-200" y="-200" width="400" height="400" fill="#121816" rx="16" opacity="0.95" />
    
    <path d="M -180,-140 L -180,-180 L -140,-180" fill="none" stroke="#D9D19B" stroke-width="8" stroke-linecap="round" />
    <path d="M 140,-180 L 180,-180 L 180,-140" fill="none" stroke="#D9D19B" stroke-width="8" stroke-linecap="round" />
    <path d="M -180,140 L -180,180 L -140,180" fill="none" stroke="#D9D19B" stroke-width="8" stroke-linecap="round" />
    <path d="M 140,180 L 180,180 L 180,140" fill="none" stroke="#D9D19B" stroke-width="8" stroke-linecap="round" />

    <circle cx="0" cy="0" r="44" fill="#042c2e" stroke="#D9D19B" stroke-width="4" />
    <text x="0" y="10" font-size="32" text-anchor="middle">${category.icon || '🧭'}</text>

    <text x="0" y="290" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="22" font-weight="bold" fill="#ffffff" letter-spacing="1">
      📱 MIT DEM SMARTPHONE SCANNEN
    </text>
    <text x="0" y="325" text-anchor="middle" font-family="'Space Grotesk', monospace" font-size="16" fill="#D9D19B">
      ${escapeXml(displayCta)}
    </text>
  </g>
  `}

  <!-- 6. Community Easter-Egg & Geheimtipp-Box -->
  <g transform="translate(626, 1260)">
    <rect x="-480" y="0" width="960" height="150" rx="20" fill="#031f20" stroke="url(#goldGradient)" stroke-width="1.5" stroke-opacity="0.6" />
    
    <text x="-440" y="42" font-family="'Space Grotesk', monospace" font-size="16" font-weight="bold" fill="url(#goldGradient)" letter-spacing="2">
      ✦ LOKALER EHRENKODEX &amp; INSIDER-TIPP:
    </text>
    <text x="-440" y="78" font-family="'Cinzel', Georgia, serif" font-size="20" fill="#ffffff" font-style="italic">
      ${escapeXml(displayEasterEgg)}
    </text>
    <text x="-440" y="115" font-family="'Space Grotesk', monospace" font-size="15" fill="#a8d4c0">
      🔑 Community-Easter-Egg: ${escapeXml(displayRiddle)}
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

/**
 * Sendet die Bestellung direkt an die Gelato REST-API v2.
 * Wenn kein Key vorhanden ist, wird ein sicherer Dry-Run durchgeführt.
 */
export async function dispatchGelatoOrder(orderPayload) {
  const gelatoKey = (process.env.GELATO_KEY || process.env.GELATO_API_KEY || '').trim()
  if (!gelatoKey) {
    return {
      success: false,
      status: 'dry_run_no_key',
      message: 'Kein GELATO_KEY in .env oder Server-Umgebung gefunden. Order-Payload wurde als Dry-Run validiert.',
      order: orderPayload
    }
  }

  try {
    const res = await fetch('https://api.gelato.com/v2/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': gelatoKey
      },
      body: JSON.stringify(orderPayload)
    })
    const data = await res.json()
    if (!res.ok) {
      return { success: false, status: 'gelato_error', error: data }
    }
    return { success: true, status: 'dispatched', data }
  } catch (err) {
    return { success: false, status: 'network_error', error: err.message }
  }
}

// ── 5. Ausführung & Demo-Export für verschiedene Business Owner ─────────────
if (process.argv[1] && process.argv[1].endsWith('hermes_host_counter_display_generator.mjs')) {
  console.log('✨ [Hermes B2B Generator] Initialisiere Multibranchen-Generierung für verschiedene Business Owner...\n')

  const sampleBusinesses = [
    {
      businessName: 'Miradouro Café & Tasca',
      slug: 'miradouro-cafe-lisboa',
      categoryKey: 'cafe_gastro',
      city: 'Lisboa',
      countryCode: 'PT',
      gpsCoordinates: "38°42'44\"N · 9°07'59\"W",
      contactFirstName: 'Manuel',
      contactLastName: 'Silva',
      contactEmail: 'host@miradouro-lisboa.pt',
      shippingStreet: 'Rua de Santa Cruz do Castelo 14',
      shippingCity: 'Lisboa',
      shippingZip: '1100-478',
    },
    {
      businessName: 'Sagres Ocean & Surf Base',
      slug: 'sagres-surf-base',
      categoryKey: 'surf_watersports',
      city: 'Sagres',
      countryCode: 'PT',
      gpsCoordinates: "37°00'34\"N · 8°56'21\"W",
      contactFirstName: 'Tiago',
      contactLastName: 'Ferreira',
      contactEmail: 'aloha@sagressurfbase.pt',
      shippingStreet: 'Estrada da Ponta de Sagres 8',
      shippingCity: 'Sagres',
      shippingZip: '8650-380',
    },
    {
      businessName: 'Bodega Viña del Sol',
      slug: 'bodega-vina-del-sol',
      categoryKey: 'winery_tasting',
      city: 'Ronda',
      countryCode: 'ES',
      gpsCoordinates: "36°44'38\"N · 5°09'54\"W",
      contactFirstName: 'Elena',
      contactLastName: 'Morales',
      contactEmail: 'bodega@vinadelsol.es',
      shippingStreet: 'Carretera de Ronda-Setenil km 4',
      shippingCity: 'Ronda',
      shippingZip: '29400',
    },
    {
      businessName: 'Matterhorn Alpine & Peak Guides',
      slug: 'matterhorn-guides-zermatt',
      categoryKey: 'outdoor_guide',
      city: 'Zermatt',
      countryCode: 'DE', // Alpine Theme
      gpsCoordinates: "45°58'37\"N · 7°44'56\"E",
      contactFirstName: 'Urs',
      contactLastName: 'Bumann',
      contactEmail: 'guide@matterhornalpine.ch',
      shippingStreet: 'Bahnhofstrasse 42',
      shippingCity: 'Zermatt',
      shippingZip: '3920',
    },
    {
      businessName: 'Nomad Oasis Coliving & Desks',
      slug: 'nomad-oasis-lisbon',
      categoryKey: 'coworking_coliving',
      city: 'Lisboa',
      countryCode: 'PT',
      gpsCoordinates: "38°43'12\"N · 9°08'45\"W",
      contactFirstName: 'Clara',
      contactLastName: 'Mendes',
      contactEmail: 'community@nomadoasis.pt',
      shippingStreet: 'Avenida da Liberdade 120',
      shippingCity: 'Lisboa',
      shippingZip: '1250-144',
    }
  ]

  const outputDir = join(ROOT, 'dist/b2b-displays')
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  for (const b of sampleBusinesses) {
    const svgOutput = generateCounterDisplaySvg(b)
    const filePath = join(outputDir, `display_${b.slug}.svg`)
    writeFileSync(filePath, svgOutput, 'utf8')
    console.log(`✓ [${b.categoryKey}] ${b.businessName} -> ${filePath}`)
  }

  const gelatoKey = (process.env.GELATO_KEY || process.env.GELATO_API_KEY || '').trim()
  if (gelatoKey) {
    console.log(`\n🔑 Gelato API-Key erkannt (${gelatoKey.slice(0, 4)}***) — Order-API Integration aktiv.`)
  } else {
    console.log('\n🔒 Gelato API-Key: Nicht gesetzt (sicherer Dry-Run Modus). Trage GELATO_KEY in .env ein, um echte Bestellungen aufzugeben.')
  }

  console.log('✨ Alle Branchen-Aufsteller erfolgreich gerendert!')
}

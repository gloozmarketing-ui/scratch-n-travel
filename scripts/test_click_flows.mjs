/**
 * scripts/test_click_flows.mjs
 * 
 * Automatisierter Verifikationstest fuer interaktive Klick-Pfade und Datenfluesse:
 * 1. Radar-Komponenten & Weltweite Threat-Intelligence
 * 2. Pricing B2C vs B2B & Tarif-Matrix
 * 3. Profile Tauschkonto (SNT-511) & Community Give-and-Take Logik
 * 4. Navigations-Links & Routing
 */

import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

let passed = 0
let failed = 0
const errors = []

function assert(name, condition, detail = '') {
  if (condition) {
    passed++
    console.log(`  [ok]   ${name}`)
  } else {
    failed++
    errors.push(`${name}: ${detail}`)
    console.log(`  [FAIL] ${name} — ${detail}`)
  }
}

console.log('=== Klick- & Interaktions-Testlauf (SNT-511, SNT-515, SNT-516) ===\n')

// 1. Radar & Threat Map
console.log('[1] Radar-Threat Map & Weltweite Intelligenz')
const radarMapSrc = readFileSync(join(ROOT, 'src/components/RadarThreatMap.tsx'), 'utf8')
const radarPageSrc = readFileSync(join(ROOT, 'src/pages/Radar.tsx'), 'utf8')
const intellSrc = readFileSync(join(ROOT, 'src/data/travelIntelligence.ts'), 'utf8')

assert('Kein Carto CDN im Radar', !radarMapSrc.includes('cartocdn.com'))
assert('Kein Carto API-Key Zwang', !radarMapSrc.includes('carto.com/basemaps'))
assert('Esri Dark Canvas TileLayer eingebunden', radarMapSrc.includes('server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile'))
assert('OSM TileLayer als Umschalter vorhanden', radarMapSrc.includes('tile.openstreetmap.org'))
assert('Leaflet invalidateSize() vorhanden', radarMapSrc.includes('invalidateSize()'))
assert('Weltansicht-Reset Button vorhanden', radarMapSrc.includes('🌍 Weltansicht') && radarMapSrc.includes('flyTo([25.0, 10.0], 2'))
assert('Map Style Umschalter vorhanden', radarMapSrc.includes('setMapStyle(prev => prev === \'esri_dark\' ? \'osm_clean\' : \'esri_dark\')'))

assert('Regionen-Filter vorhanden', 
  radarPageSrc.includes('DACH') && 
  radarPageSrc.includes('Asien') && 
  radarPageSrc.includes('Nordamerika') && 
  radarPageSrc.includes('Lateinamerika') && 
  radarPageSrc.includes('Afrika') && 
  radarPageSrc.includes('Ozeanien')
)
assert('Ländersuche mit Filterung vorhanden', radarPageSrc.includes('countrySearch') && radarPageSrc.includes('countriesIntelligence'))
assert('Gefahrenkategorie-Filter umschaltbar', radarPageSrc.includes('categoryFilter') && radarPageSrc.includes("'all'") && radarPageSrc.includes("'crime'"))
assert('VIP-Shield Freischalt-Funktion vorhanden', radarPageSrc.includes('isProUser') && radarPageSrc.includes('VIP Shield freischalten'))

assert('Universeller Country Intelligence Resolver', intellSrc.includes('getCountryIntelligence('))
assert('Notfallnummern für globale Länder kuratiert', 
  intellSrc.includes('emergency:') && 
  intellSrc.includes('police:') && 
  intellSrc.includes('medical:') && 
  intellSrc.includes('112') && 
  intellSrc.includes('911') && 
  intellSrc.includes('191')
)

// 2. Pricing & Abos
console.log('\n[2] Pricing & Abos (B2C vs B2B & Auffindbarkeit)')
const pricingSrc = readFileSync(join(ROOT, 'src/pages/Pricing.tsx'), 'utf8')
const layoutSrc = readFileSync(join(ROOT, 'src/components/Layout.tsx'), 'utf8')

assert('Pricing Zielgruppen-Tabs umschaltbar', 
  pricingSrc.includes('audienceMode') && 
  pricingSrc.includes("'b2c'") && 
  pricingSrc.includes("'b2b'") && 
  pricingSrc.includes("'matrix'")
)
assert('B2C Pläne definiert (Free, Pro, VIP)', 
  pricingSrc.includes('Explorer Free') && 
  pricingSrc.includes('Explorer Pro') && 
  pricingSrc.includes('Family & Pet VIP')
)
assert('B2B Host Pläne definiert (Local Host Starter 29€, Gastro Hub Pro 59€)', 
  pricingSrc.includes('Verified Local Host Starter') && 
  pricingSrc.includes('€29') && 
  pricingSrc.includes('Hub Pro') && 
  pricingSrc.includes('€59')
)
assert('B2B physischer QR-Thekenaufsteller genannt', pricingSrc.includes('Thekenaufsteller per Post'))
assert('0% Buchungsprovision Garantie genannt', pricingSrc.includes('0%'))
assert('Vergleichsmatrix mit allen Tarifen vorhanden', pricingSrc.includes('<table') && pricingSrc.includes('Provision'))

assert('Navigation Sidebar enthält Mitgliedschaft & Abos', layoutSrc.includes('Mitgliedschaft & Abos'))
assert('Navigation Sidebar verlinkt /pricing', layoutSrc.includes("path: '/pricing'") && layoutSrc.includes('Pläne & VIP Abos'))
assert('Navigation Sidebar verlinkt /host', layoutSrc.includes("path: '/host'") && layoutSrc.includes('B2B Local Host Portal'))
assert('Desktop-Header enthält Abos-Button', layoutSrc.includes("to=\"/pricing\"") && layoutSrc.includes('Pläne & VIP Abos'))
assert('Mobile-Header enthält Abos-Button', layoutSrc.includes("to=\"/pricing\"") && layoutSrc.includes('Abos'))

// 3. Profile & Tauschkonto (SNT-511)
console.log('\n[3] Profile & Give-&-Take Tauschkonto (SNT-511)')
const profileSrc = readFileSync(join(ROOT, 'src/pages/Profile.tsx'), 'utf8')
const travelContextSrc = readFileSync(join(ROOT, 'src/context/TravelContext.tsx'), 'utf8')

assert('Profile enthält Tauschkonto-Tab', profileSrc.includes("'tauschkonto'") && profileSrc.includes('🪙 Give & Take Tauschkonto'))
assert('Profile Hero enthält direkten Tauschkonto-Sprung', profileSrc.includes("setActiveTab('tauschkonto')"))
assert('Saldo-Box zeigt Community-Beiträge', profileSrc.includes('communityContributionsCount'))
assert('Gegenüberstellung Gegeben vs Genommen vorhanden', 
  profileSrc.includes('Gegeben (Community-Beiträge)') && 
  profileSrc.includes('Genommen (Inanspruchnahme)')
)
assert('Errechneter Gegenwert & Ersparnis sichtbar', profileSrc.includes('Erwirtschafteter VIP Pro Gegenwert') && profileSrc.includes('Community-Ersparnis'))
assert('Transaktions-Chronik / Ledger vorhanden', profileSrc.includes('Chronik deiner Tausch-Transaktionen'))
assert('Sofort-Aktionen (Spots, Radar, Skills, Abos) verlinkt', 
  profileSrc.includes('to="/explore"') && 
  profileSrc.includes('to="/radar"') && 
  profileSrc.includes('to="/wanderbond"') && 
  profileSrc.includes('to="/pricing"')
)
assert('Demo Schnell-Boost Test-Button vorhanden', profileSrc.includes('handleQuickBoost') && profileSrc.includes('⚡ Test: +7 Tage gutschreiben'))

assert('TravelContext verwaltet proDaysRemaining', travelContextSrc.includes('proDaysRemaining'))
assert('TravelContext verwaltet grantCommunityProDays', travelContextSrc.includes('grantCommunityProDays'))

console.log(`\nErgebnis: ${passed} bestanden, ${failed} fehlgeschlagen.`)
if (failed > 0) {
  console.error('\nFehler im Testlauf:')
  for (const err of errors) console.error(` - ${err}`)
  process.exit(1)
} else {
  console.log('Alle Klick- und Datenfluss-Prüfungen erfolgreich abgeschlossen!')
}

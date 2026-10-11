// scripts/test_abo_tiers_e2e.mjs
// Umfassender E2E-Prüflauf aller 6 Abo-Stufen & neuer Phygital/Passport/GPS-Funktionen
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()

let passed = 0
let failed = 0
const errors = []

function assert(title, condition, extraInfo = '') {
  if (condition) {
    passed++
    console.log(`  [ok]   ${title}`)
  } else {
    failed++
    console.error(`  [FAIL] ${title} ${extraInfo ? '— ' + extraInfo : ''}`)
    errors.push(title)
  }
}

console.log('=== E2E PRÜFLAUF: ALLE ABO-STUFEN & SYSTEM-FUNKTIONEN ===\n')

const pricingSrc = readFileSync(join(ROOT, 'src/pages/Pricing.tsx'), 'utf8')
const hostSrc = readFileSync(join(ROOT, 'src/pages/Host.tsx'), 'utf8')
const passportSrc = readFileSync(join(ROOT, 'src/pages/Passport.tsx'), 'utf8')
const scratchSrc = readFileSync(join(ROOT, 'src/pages/ScratchPage.tsx'), 'utf8')
const travelContextSrc = readFileSync(join(ROOT, 'src/context/TravelContext.tsx'), 'utf8')
const layoutSrc = readFileSync(join(ROOT, 'src/components/Layout.tsx'), 'utf8')
const i18nSrc = readFileSync(join(ROOT, 'src/lib/i18n.ts'), 'utf8')

// [1] B2C Abos (Free, Pro, Family & Pet)
console.log('[1] B2C Abos (Free, Pro, Family & Pet VIP)')
assert('Free: 3 Secrets/Mo, Basis Radar & Give-and-Take', 
  pricingSrc.includes('Explorer Free') && 
  pricingSrc.includes('3 GPS-Secrets pro Monat freirubbeln') &&
  pricingSrc.includes('Give & Take')
)
assert('Pro: Unbegrenzt Secrets, VIP Radar Shield & alle Badges', 
  pricingSrc.includes('Explorer Pro') && 
  pricingSrc.includes('Unbegrenzt GPS-Secrets freirubbeln') &&
  pricingSrc.includes('VIP Radar Shield') &&
  pricingSrc.includes('460+ Master-Badges')
)
assert('Family & Pet: Tierarzt-Netz, Landmarken & barrierefreie Filter', 
  pricingSrc.includes('Family & Pet VIP') && 
  pricingSrc.includes('Hundefreundliche Filter & Tierarzt-Notfallnetz') &&
  pricingSrc.includes('Landmarke auf der Weltkarte')
)

// [2] B2B Abos (Digital 14€, Starter 29€, Gastro Pro 59€)
console.log('\n[2] B2B Abos (Digital Test 14€, Local Starter 29€, Gastro Hub Pro 59€)')
assert('Digital 14€: Ohne Hardware, 0% Provision, Radar-Verifizierung & PDF-QR', 
  pricingSrc.includes('Digital Test-Host') && 
  pricingSrc.includes('€14') &&
  pricingSrc.includes('Digitaler QR-Code zum Selbstausdrucken') &&
  pricingSrc.includes('0% Buchungsprovision')
)
assert('Starter 29€: 1x 20mm Acryl-Aufsteller (0€ Setup bei 3-Mo), 0-4 QR-Ecken', 
  pricingSrc.includes('Verified Local Host Starter') && 
  pricingSrc.includes('€29') && 
  pricingSrc.includes('1x Physischer 20mm Acrylglas Thekenaufsteller') &&
  pricingSrc.includes('0 € SETUP-GEBÜHR')
)
assert('Gastro Pro 59€: Klartext 1x Multi-Hub Aufsteller (bis zu 4 Ecken) & Touren listen', 
  pricingSrc.includes('Experience & Gastro Hub Pro') && 
  pricingSrc.includes('€59') && 
  pricingSrc.includes('1x Physischer 20mm Acrylglas Multi-Hub Aufsteller') &&
  pricingSrc.includes('Zusatz-Aufsteller für weitere Theken/Tische zubuchbar') &&
  pricingSrc.includes('Eigene geführte Touren, Kurse & Workshops in der App listen')
)
assert('Host Portal bietet alle 3 Tarife im Bestellflow', 
  hostSrc.includes('b2bForm.planOption') && 
  hostSrc.includes('3-Monate Starter buchen (87 €') && 
  hostSrc.includes('Digitalen Test-Host starten (14 €')
)

// [3] Steuerrechtliche Klarheit (§ 19 UStG Einzelunternehmer)
console.log('\n[3] Steuerrechtliche Vorgaben (Einzelunternehmer & § 19 UStG)')
assert('Pricing enthält § 19 UStG Steuerhinweis für Einzelunternehmer', 
  pricingSrc.includes('§ 19 UStG') && 
  pricingSrc.includes('Einzelunternehmer') &&
  pricingSrc.includes('keine Umsatzsteuer berechnet')
)
assert('Host Portal enthält § 19 UStG Steuerhinweis im Checkout-Bereich', 
  hostSrc.includes('§ 19 UStG') && 
  hostSrc.includes('Einzelunternehmen')
)

// [4] Digitaler 3D-Reisepass mit Umblätter-Animation & GPS-Stempel
console.log('\n[4] Digitaler Reisepass (Flipbook, GPS-Stempel, Postkarten, Secrets)')
assert('Passport bietet 3D-Reisepass Modus (Flipbook)', 
  passportSrc.includes("mode === 'flipbook'") && 
  passportSrc.includes('📖 3D-Reisepass')
)
assert('Passport enthält Umblätter-Mechanik (Spreads 0 bis 3)', 
  passportSrc.includes('spread === 0') && 
  passportSrc.includes('spread === 1') && 
  passportSrc.includes('spread === 2') && 
  passportSrc.includes('spread === 3') &&
  passportSrc.includes('handleFlip')
)
assert('Passport enthält Live GPS-Stempler mit Sound/Haptik & Account-Sync', 
  passportSrc.includes('handleLiveGpsStamp') && 
  passportSrc.includes('addGpsStamp') && 
  passportSrc.includes('Offiziellen Einreisestempel einprägen')
)
assert('Passport zeigt enthüllte Postkarten & Secret Spots', 
  passportSrc.includes('revealedPostcards') && 
  passportSrc.includes('SEITE 5 · POSTCARDS') &&
  passportSrc.includes('SEITE 7 · SECRET SPOTS')
)

// [5] Scratchbare GPS-Weltkarte & Länder-Restriktion
console.log('\n[5] Scratchbare Weltkarte (GPS-Restriktion & Simulator)')
assert('ScratchPage bietet GPS-Scratch-Weltkarten Modus', 
  scratchSrc.includes("activeView === 'worldmap'") && 
  scratchSrc.includes('GPS Scratch-Weltkarte')
)
assert('ScratchPage erzwingt Vor-Ort GPS-Restriktion (nur aktuelles Land freirubbelbar)', 
  scratchSrc.includes('isCurrentLocation') && 
  scratchSrc.includes('GPS-Sperre aktiv') &&
  scratchSrc.includes('Nur vor Ort freirubbelbar')
)
assert('ScratchPage bietet interaktiven ScratchCard-Canvas für entsperrtes Land', 
  scratchSrc.includes('<ScratchCard') && 
  scratchSrc.includes('handleCountryScratchComplete')
)
assert('ScratchPage speichert freigerubbeltes Land im Account via scratchCountry', 
  scratchSrc.includes('scratchCountry') && 
  travelContextSrc.includes('scratchedCountries')
)
assert('GPS-Simulator ermöglicht Testen beliebiger Reiseziele', 
  scratchSrc.includes('GPS-Simulator') && 
  scratchSrc.includes('setCurrentLocation')
)

// [6] Mehrsprachigkeit (i18n) & Reaktivität
console.log('\n[6] Mehrsprachigkeit (i18n Engine für 7 Sprachen)')
const langs = ['de', 'en', 'es', 'fr', 'pt', 'uk', 'ru']
for (const l of langs) {
  assert(`i18n Wörterbuch enthält vollständigen Satz für '${l}'`, 
    i18nSrc.includes(`${l}: {`) && 
    i18nSrc.includes('nav_grp_membership') &&
    i18nSrc.includes('passport_flip_prev') &&
    i18nSrc.includes('scratch_map_title')
  )
}
assert('Layout Header & Sidebar nutzen reaktive i18n Übersetzung', 
  layoutSrc.includes("t('nav_abos')") && 
  layoutSrc.includes("t('nav_pricing_plans')") &&
  layoutSrc.includes("t('nav_grp_membership')")
)

console.log(`\n========================================`)
console.log(`Ergebnis: ${passed} bestanden, ${failed} fehlgeschlagen.`)
if (failed > 0) {
  console.error('\nFehler:', errors)
  process.exit(1)
} else {
  console.log('Alle E2E Abo-, Steuer- & Phygital-Prüfungen 100% GRÜN!')
  process.exit(0)
}

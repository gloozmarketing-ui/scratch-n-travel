/**
 * Tests fuer src/lib/trust.ts (SNT-406).
 *
 * Warum ein eigenes Skript statt Vitest: Das Projekt hat bewusst keine
 * Test-Infrastruktur eingefuehrt. Die Logik hier ist aber genau die Stelle,
 * an der ein Fehler stillschweigend ein Versprechen bricht: die Trust-Stufe
 * entscheidet, was ein Nutzer darf. Ein zu frueh vergebener Anker ist
 * schlimmer als ein zu spaet vergebener.
 *
 * Die Funktionen sind 1:1 aus trust.ts gespiegelt, damit sie ohne TS-Build
 * laufen. Abschnitt [6] ist die Gegenprobe: die alten, fehlerhaften Formeln
 * werden bewusst ausgefuehrt — fallen sie nicht durch, waere der Test blind.
 *
 * Aufruf: node scripts/test_trust.js
 */

const TRUST_EVENTS = [
  { type: 'email_verified', points: 1 },
  { type: 'profile_completed', points: 1 },
  { type: 'spot_submitted', points: 2 },
  { type: 'spot_verified', points: 3 },
  { type: 'meetup_attended', points: 3 },
  { type: 'review_written', points: 2 },
  { type: 'photo_shared', points: 2 },
]

const TIER_ORDER = ['new', 'member', 'trusted', 'anchor']

const TRUST_TIERS = [
  { tier: 'new', minPoints: 0 },
  { tier: 'member', minPoints: 2 },
  { tier: 'trusted', minPoints: 5 },
  { tier: 'anchor', minPoints: 9 },
]

// ─── Gespiegelte Logik (1:1 aus src/lib/trust.ts) ───
function computeTrustTier(points) {
  if (points >= 9) return 'anchor'
  if (points >= 5) return 'trusted'
  if (points >= 2) return 'member'
  return 'new'
}

function trustEventWeight(type) {
  return TRUST_EVENTS.find((e) => e.type === type)?.points ?? 0
}

function totalTrustPoints(events) {
  return events.reduce((sum, e) => sum + trustEventWeight(e), 0)
}

function meetsTier(tier, minimum) {
  return TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(minimum)
}

function tierProgress(points) {
  const current = computeTrustTier(points)
  const idx = TIER_ORDER.indexOf(current)
  if (idx >= TRUST_TIERS.length - 1) return 1
  const cur = TRUST_TIERS[idx]
  const next = TRUST_TIERS[idx + 1]
  const span = next.minPoints - cur.minPoints
  if (span <= 0) return 1
  return Math.min(1, Math.max(0, (points - cur.minPoints) / span))
}

function nextSteps(points) {
  const current = computeTrustTier(points)
  const idx = TIER_ORDER.indexOf(current)
  const nextTier = TRUST_TIERS[idx + 1] ?? TRUST_TIERS[TRUST_TIERS.length - 1]
  const needed = Math.max(0, nextTier.minPoints - points)
  const actions = TRUST_EVENTS.filter((e) => e.points <= needed && e.type !== 'email_verified').slice(0, 3)
  return { needed, actions }
}

// Alte, fehlerhafte Varianten fuer die Gegenprobe.
const OLD_computeTrustTier = (points) => {
  if (points >= 8) return 'anchor'   // Grenze war 8 statt 9
  if (points >= 5) return 'trusted'
  return 'new'                          // 'member' fehlte komplett
}
const OLD_tierProgress = (points) => points / 9   // ignorierte die Stufengrenzen

// ─── Mini-Test-Runner ───
let passed = 0
let failed = 0
const failures = []

function check(name, actual, expected) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a === e) {
    passed++
    console.log(`  [ok]   ${name}`)
  } else {
    failed++
    failures.push(name)
    console.log(`  [FAIL] ${name} — erwartet ${e}, bekommen ${a}`)
  }
}

function checkTrue(name, value) {
  check(name, Boolean(value), true)
}

console.log('[1] Trust-Stufen (computeTrustTier)')
check('0 Punkte = new', computeTrustTier(0), 'new')
check('1 Punkt = new (unter der Schwelle)', computeTrustTier(1), 'new')
check('2 Punkte = member (Schwelle erreicht)', computeTrustTier(2), 'member')
check('4 Punkte = member', computeTrustTier(4), 'member')
check('5 Punkte = trusted', computeTrustTier(5), 'trusted')
check('8 Punkte = trusted (noch kein Anker)', computeTrustTier(8), 'trusted')
check('9 Punkte = anchor (Schwelle erreicht)', computeTrustTier(9), 'anchor')
check('99 Punkte = anchor', computeTrustTier(99), 'anchor')

console.log('\n[2] Punktsumme (trustEventWeight / totalTrustPoints)')
check('Unbekannter Event zaehlt 0', trustEventWeight('gibtsnicht'), 0)
check('email_verified = 1', trustEventWeight('email_verified'), 1)
check('spot_verified = 3', trustEventWeight('spot_verified'), 3)
check('Leere Liste = 0', totalTrustPoints([]), 0)
check('Ein verifizierter Spot = 3', totalTrustPoints(['spot_verified']), 3)
check('Gemischte Summe', totalTrustPoints(['email_verified', 'spot_submitted', 'spot_verified']), 6)

console.log('\n[3] Stufen-Vergleich (meetsTier)')
checkTrue('anchor >= anchor', meetsTier('anchor', 'anchor'))
checkTrue('trusted >= member', meetsTier('trusted', 'member'))
checkTrue('member >= new', meetsTier('member', 'new'))
check('new >= member ist falsch', meetsTier('new', 'member'), false)
check('member >= trusted ist falsch', meetsTier('member', 'trusted'), false)
checkTrue('Gleichheit gilt', meetsTier('member', 'member'))

console.log('\n[4] Fortschritt (tierProgress)')
check('0 Punkte = 0', tierProgress(0), 0)
check('1 von 2 bis member = 0.5', tierProgress(1), 0.5)
check('2 Punkte = 0 (Schwelle erreicht)', tierProgress(2), 0)
check('Hoechste Stufe = 1', tierProgress(99), 1)
checkTrue('Wert bleibt in [0,1]', tierProgress(3) >= 0 && tierProgress(3) <= 1)

console.log('\n[5] Naechste Schritte (nextSteps)')
check('ab 0 fehlen 2 Punkte bis member', nextSteps(0).needed, 2)
check('ab 1 fehlt 1 Punkt', nextSteps(1).needed, 1)
check('ab 2 fehlen 3 Punkte bis trusted', nextSteps(2).needed, 3)
check('Hoechststufe: 0 fehlende Punkte', nextSteps(99).needed, 0)
checkTrue('Hoechstens 3 Aktionen', nextSteps(0).actions.length <= 3)
checkTrue(
  'email_verified taucht nicht als Vorschlag auf',
  nextSteps(0).actions.every((a) => a.type !== 'email_verified'),
)

console.log('\n[6] Gegenprobe — die alten Logiken MUESSEN durchfallen')
checkTrue(
  'Alte Stufenlogik gibt bei 8 Punkten faelschlich anchor',
  OLD_computeTrustTier(8) === 'anchor' && computeTrustTier(8) === 'trusted',
)
checkTrue(
  'Alte Logik kennt die Stufe member nicht',
  OLD_computeTrustTier(2) === 'new' && computeTrustTier(2) === 'member',
)
checkTrue(
  'Alter Fortschritt ignoriert Stufengrenzen',
  OLD_tierProgress(2) > 0 && tierProgress(2) === 0,
)

console.log(`\n${passed} bestanden, ${failed} fehlgeschlagen.`)
if (failed > 0) {
  console.log('Fehlgeschlagen:')
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}
console.log('Alle Gegenproben bestanden.')
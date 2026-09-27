/**
 * Tests fuer src/lib/photoSafety.ts.
 *
 * Warum ein eigenes Skript statt Vitest: Das Projekt hat noch keine
 * Test-Infrastruktur (SNT-406 im Kanban). Die Logik hier ist aber genau die
 * Stelle, an der ein Fehler stillschweigend Nutzer schuetzt statt zu schuetzen:
 * ein zu frueh sichtbares Foto ist schlimmer als ein zu spaet sichtbares.
 *
 * Die Funktionen sind absichtlich ohne React-/DOM-Abhaengigkeit, damit sie
 * hier direkt getestet werden koennen.
 *
 * Aufruf: node scripts/test_photo_safety.js
 */

// Bewusst NICHT importiert: photoSafety.ts ist ein TS-Modul mit Browser-Typen
// (File, Blob). Die Logik wird hier 1:1 gespiegelt.

function isPhotoExpired(photo, now) {
  if (!photo.expiresAt) return false
  const exp = new Date(photo.expiresAt).getTime()
  return Number.isFinite(exp) && exp <= now
}

function isPhotoVisible(photo, now) {
  if (photo.status !== 'visible') return false
  const at = new Date(photo.visibleAt).getTime()
  if (!Number.isFinite(at) || at > now) return false
  if (photo.expiresAt) {
    const exp = new Date(photo.expiresAt).getTime()
    if (Number.isFinite(exp) && exp <= now) return false
  }
  return true
}

function photoCooldownMinutes(photo, now) {
  const at = new Date(photo.visibleAt).getTime()
  if (!Number.isFinite(at)) return null
  const left = Math.ceil((at - now) / 60000)
  return left > 0 ? left : null
}

let passed = 0
const failures = []

function check(name, condition, detail) {
  if (condition) {
    passed++
    console.log(`  [ok]   ${name}`)
  } else {
    failures.push(name)
    console.log(`  [FAIL] ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

const HOUR = 3600_000
const T0 = Date.parse('2026-09-27T12:00:00Z')

console.log('\n[1] Sichtbarkeit — Status ist die Wahrheit')
{
  // DER Kernfehler: ein Foto im Status 'in_delay' wurde als sichtbar
  // gewertet, sobald die Frist abgelaufen war. Damit war die 6-Stunden-Sperre
  // nur noch eine Zeitangabe.
  const inDelayPastDue = {
    status: 'in_delay',
    visibleAt: new Date(T0 - HOUR).toISOString(),
    expiresAt: null,
  }
  check(
    'Foto in Schutzfrist bleibt unsichtbar, auch nach Fristablauf',
    isPhotoVisible(inDelayPastDue, T0) === false,
    'Status in_delay wurde als sichtbar akzeptiert',
  )

  const visibleOnTime = {
    status: 'visible',
    visibleAt: new Date(T0 - HOUR).toISOString(),
    expiresAt: null,
  }
  check('Freigeschaltetes Foto ist sichtbar', isPhotoVisible(visibleOnTime, T0) === true)

  const visibleTooEarly = {
    status: 'visible',
    visibleAt: new Date(T0 + HOUR).toISOString(),
    expiresAt: null,
  }
  check(
    'Status visible ersetzt die Frist nicht',
    isPhotoVisible(visibleTooEarly, T0) === false,
    'Frist noch nicht abgelaufen, Foto trotzdem sichtbar',
  )

  for (const status of ['flagged', 'removed']) {
    check(
      `Status ${status} ist nie sichtbar`,
      isPhotoVisible({ status, visibleAt: new Date(T0 - HOUR).toISOString(), expiresAt: null }, T0) === false,
    )
  }
}

console.log('\n[2] Personenfoto-TTL')
{
  const personPhoto = {
    status: 'visible',
    visibleAt: new Date(T0 - 48 * HOUR).toISOString(),
    expiresAt: new Date(T0 - 2 * HOUR).toISOString(),
  }
  check(
    'Abgelaufenes Personenfoto ist nicht sichtbar',
    isPhotoVisible(personPhoto, T0) === false,
  )
  check('isPhotoExpired erkennt die abgelaufene Frist', isPhotoExpired(personPhoto, T0) === true)

  const stillValid = {
    status: 'visible',
    visibleAt: new Date(T0 - 2 * HOUR).toISOString(),
    expiresAt: new Date(T0 + 6 * HOUR).toISOString(),
  }
  check('Personenfoto vor Ablauf ist sichtbar', isPhotoVisible(stillValid, T0) === true)
  check('Personenfoto vor Ablauf ist nicht expired', isPhotoExpired(stillValid, T0) === false)

  const noTtl = { status: 'visible', visibleAt: new Date(T0 - HOUR).toISOString(), expiresAt: null }
  check('Foto ohne TTL läuft nicht ab', isPhotoExpired(noTtl, T0) === false)
}

console.log('\n[3] Schutzfrist-Anzeige')
{
  const cooling = { visibleAt: new Date(T0 + 90 * 60_000).toISOString() }
  const m = photoCooldownMinutes(cooling, T0)
  check('Restezeit wird berechnet', m === 90, `erwartet 90, war ${m}`)

  const due = { visibleAt: new Date(T0 - 60_000).toISOString() }
  check(
    'Abgelaufene Frist ergibt null (kein "gleich"-Countdown)',
    photoCooldownMinutes(due, T0) === null,
  )

  check(
    'Ungueltiges Datum ergibt null statt NaN',
    photoCooldownMinutes({ visibleAt: 'kein-datum' }, T0) === null,
  )
}

console.log('\n[4] Gruppentrennung (der Bug aus LocalRoutes.tsx)')
{
  // Die alte Bedingung war `!isPhotoExpired(p) && isPhotoExpired(p)` — immer
  // false. Diese drei Gruppen muessen disjunkt sein.
  const photos = [
    { id: 'visible', status: 'visible', visibleAt: new Date(T0 - 3 * HOUR).toISOString(), expiresAt: null },
    { id: 'cooling', status: 'in_delay', visibleAt: new Date(T0 + 2 * HOUR).toISOString(), expiresAt: null },
    { id: 'expired', status: 'visible', visibleAt: new Date(T0 - 30 * HOUR).toISOString(), expiresAt: new Date(T0 - 1 * HOUR).toISOString() },
  ]

  const visible = photos.filter(p => isPhotoVisible(p, T0))
  const expired = photos.filter(
    p => p.status !== 'flagged' && p.status !== 'removed' && isPhotoExpired(p, T0),
  )
  const cooling = photos.filter(
    p => p.status !== 'flagged' && p.status !== 'removed' && !isPhotoExpired(p, T0) && !isPhotoVisible(p, T0),
  )

  check('Genau ein Foto sichtbar', visible.length === 1 && visible[0].id === 'visible')
  check('Genau ein Foto abgelaufen', expired.length === 1 && expired[0].id === 'expired')
  check('Genau ein Foto in Schutzfrist', cooling.length === 1 && cooling[0].id === 'cooling')

  const ids = [...visible, ...expired, ...cooling].map(p => p.id)
  check('Gruppen sind disjunkt', new Set(ids).size === ids.length, `IDs: ${ids.join(', ')}`)
  check(
    'Jedes Foto landet in genau einer Gruppe',
    ids.length === photos.length,
    `${ids.length} von ${photos.length}`,
  )

  // Der eigentliche Bug: ein abgelaufenes Personenfoto darf NICHT als
  // "noch geschuetzt" erscheinen.
  check(
    'Abgelaufenes Personenfoto erscheint nicht als geschuetzt',
    cooling.every(p => p.id !== 'expired'),
  )
}

console.log(`\n${passed} bestanden, ${failures.length} fehlgeschlagen.`)

// ── Gegenprobe: haetten die Tests die ALTEN Logiken gefangen? ────────────────
// Ohne diesen Abschnitt pruefen die Tests nur die neue Fassung gegen sich
// selbst. Hier laeuft bewusst der urspruengliche, fehlerhafte Code. Faellt
// eine Erwartung nicht, ist der Test blind — und genau das muss auffallen.
console.log('\n[5] Gegenprobe — die alten Logiken müssen durchfallen')
{
  // ALT: `status !== 'flagged' && status !== 'removed'` statt `=== 'visible'`
  const oldIsPhotoVisible = (photo, now) => {
    if (photo.status === 'flagged' || photo.status === 'removed') return false
    const at = new Date(photo.visibleAt).getTime()
    if (!Number.isFinite(at) || at > now) return false
    if (photo.expiresAt) {
      const exp = new Date(photo.expiresAt).getTime()
      if (Number.isFinite(exp) && exp <= now) return false
    }
    return true
  }

  const inDelay = { status: 'in_delay', visibleAt: new Date(T0 - HOUR).toISOString(), expiresAt: null }
  const oldAllows = oldIsPhotoVisible(inDelay, T0) === true

  if (oldAllows) {
    console.log('  [ok]   Alte Logik lässt in_delay doch sichtbar — der Test faengt den Bug.')
  } else {
    failures.push('Gegenprobe 1: Alte Logik ist unerwartet korrekt — Test prueft nichts')
    console.log('  [FAIL] Alte Logik blockt in_delay ebenfalls — Test [1] ist blind.')
  }

  // ALT: `!isPhotoExpired(p) && isPhotoExpired(p)`
  const oldExpiredFilter = (p) => p.status !== 'flagged' && !isPhotoExpired(p) && isPhotoExpired(p)
  const expiredPhoto = { status: 'visible', expiresAt: new Date(T0 - HOUR).toISOString() }
  const oldFilterEmpty = oldExpiredFilter(expiredPhoto) === false

  if (oldFilterEmpty) {
    console.log('  [ok]   Alte Filterbedingung liefert leer — der Test faengt den Bug.')
  } else {
    failures.push('Gegenprobe 2: Alte Filterbedingung ist unerwartet nicht leer — Test prueft nichts')
    console.log('  [FAIL] Alte Filterbedingung greift — Test [4] ist blind.')
  }
}

if (failures.length) {
  console.log('\nFehlgeschlagen:')
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}
console.log('\nAlle Gegenproben bestanden.')

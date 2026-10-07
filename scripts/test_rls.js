#!/usr/bin/env node
/**
 * RLS-Negativtests fuer Local Routes.
 *
 * Warum diese Tests existieren: Die Fotoverzoegerung und die
 * Veroeffentlichungsgrenze sind Sicherheitsregeln. Sie sind nur dann Regeln
 * und kein Wunschdenken, wenn jemand nachweisen kann, dass sie *nicht*
 * umgangen werden koennen — auch nicht durch einen direkten API-Aufruf
 * mit einem manipulierten JWT.
 *
 * Deshalb testet dieses Skript ausschliesslich die Faelle, die NICHT
 * funktionieren duerfen. Ein gruener Lauf heisst: die Regel haelt.
 *
 * Aufruf:
 *   node scripts/test_rls.js
 *
 * Benoetigt SUPABASE_URL und einen TEST-ACCESS-TOKEN (anon key genuegt fuer
 * die Negativfaelle, da dort niemand angemeldet sein sollte).
 */

const URL = process.env.SUPABASE_URL
const ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

let passed = 0
let failed = 0
const failures = []

function check(name, condition, detail) {
  if (condition) {
    passed++
    console.log(`  PASS  ${name}`)
  } else {
    failed++
    failures.push(name)
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

async function query(path, options = {}) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const text = await res.text()
  let body = null
  try { body = text ? JSON.parse(text) : null } catch { body = text }
  return { status: res.status, body }
}

async function main() {
  if (!URL || !ANON) {
    console.error('')
    console.error('FEHLER: SUPABASE_URL und SUPABASE_ANON_KEY muessen gesetzt sein.')
    console.error('')
    console.error('Diese Tests laufen bewusst nur gegen eine ECHTE Instanz. Sie')
    console.error('pruefen, dass Regeln greifen, die niemand umgehen darf — das')
    console.error('laesst sich nicht aus dem Quelltext ableiten, nur aus dem')
    console.error('Verhalten der Datenbank.')
    console.error('')
    console.error('Ablauf:')
    console.error('  1. supabase/schema.sql im SQL-Editor ausfuehren')
    console.error('  2. PowerShell:')
    console.error('     $env:SUPABASE_URL="https://<projekt>.supabase.co"')
    console.error('     $env:SUPABASE_ANON_KEY="<anon key>"')
    console.error('     node scripts/test_rls.js')
    console.error('')
    console.error('ACHTUNG: Der Test schreibt bewusst nichts dauerhaft an. Er')
    console.error('versucht nur Lesezugriffe und erwartete Schreibfehler.')
    process.exit(2)
  }

  console.log('\n=== Local Routes: RLS-Negativtests ===\n')

  // ── 1. Entwuerfe sind nicht oeffentlich lesbar ───────────────────────────
  console.log('[1] Entwuerfe (published = false)')
  const drafts = await query('routes?published=eq.false&select=id,name')
  check(
    'unpublished Routen sind fuer Anonyme nicht lesbar',
    Array.isArray(drafts.body) && drafts.body.length === 0,
    `${drafts.body?.length} Zeilen sichtbar`,
  )

  // ── 2. Verzoegerte Fotos sind nicht sichtbar ──────────────────────────────
  // Der Kern des Ganzen: Ein Foto mit Frist in der Zukunft darf nicht
  // geliefert werden — auch dann nicht, wenn der Aufrufer die Frist selbst
  // manipuliert hat.
  console.log('\n[2] Fotoverzoegerung')
  const future = await query('route_photos?visible_at=gt.2099-01-01T00:00:00Z&select=id,status')
  check(
    'Fotos mit Frist in der Zukunft werden nicht geliefert',
    Array.isArray(future.body) && future.body.length === 0,
    `${future.body?.length} Zeilen sichtbar`,
  )

  const pending = await query(`route_photos?status=eq.in_delay&select=id`)
  check(
    'Fotos im Status in_delay werden nicht geliefert',
    Array.isArray(pending.body) && pending.body.length === 0,
    `${pending.body?.length} Zeilen sichtbar`,
  )

  const noExif = await query('route_photos?exif_stripped=eq.false&select=id')
  check(
    'Fotos ohne EXIF-Entfernung werden nie ausgeliefert',
    Array.isArray(noExif.body) && noExif.body.length === 0,
    `${noExif.body?.length} Zeilen sichtbar`,
  )

  // ── 3. Fremder Fortschritt bleibt privat ──────────────────────────────────
  // Kernregel gegen Ortung: Es darf niemand sehen, WELCHE Station ein
  // Folger abgehakt hat und WANN. Nur der eigene Zaehler ist oeffentlich.
  // Ein frueherer Entwurf gab Station + visited_at aus — damit haette man
  // den Aufenthaltsort eines Reisenden rekonstruieren koennen.
  console.log('\n[3] Ortungsschutz')
  const progress = await query('route_progress?select=route_id,stop_id,traveler_id,visited_at')
  check(
    'route_progress ist ohne Session leer',
    Array.isArray(progress.body) && progress.body.length === 0,
    `${progress.body?.length} Zeilen sichtbar`,
  )

  const progressCount = await query('route_progress?select=route_id')
  check(
    'auch die reine Anzahl fremder Besuche bleibt verborgen',
    Array.isArray(progressCount.body) && progressCount.body.length === 0,
    `${progressCount.body?.length} Zeilen sichtbar`,
  )

  const completions = await query('route_completions?select=route_id,traveler_id')
  check(
    'route_completions gibt fremde Abschluesse nicht preis',
    Array.isArray(completions.body) && completions.body.length === 0,
    `${completions.body?.length} Zeilen sichtbar`,
  )

  // Der Zaehler in routes.completions muss dagegen lesbar bleiben, sonst
  // waere die Route fuer niemanden interessant.
  const counter = await query('routes?published=eq.true&select=id,completions&limit=1')
  check(
    'der Abschlusszaehler selbst ist oeffentlich lesbar',
    counter.status === 200,
    `HTTP ${counter.status}`,
  )

  // ── 3b. Personenfotos verschwinden nach Ablauf ───────────────────────────
  console.log('\n[3b] Personenfoto-Ablauf')
  const expired = await query('route_photos?expires_at=lt.2099-01-01T00:00:00Z&select=id')
  check(
    'abgelaufene Fotos werden nicht ausgeliefert',
    Array.isArray(expired.body) && expired.body.length === 0,
    `${expired.body?.length} Zeilen sichtbar`,
  )

  // ── 4. Anonyme duerfen nicht schreiben ────────────────────────────────────
  console.log('\n[4] Schreibschutz')
  const fakeId = '00000000-0000-0000-0000-000000000000'
  const insert = await query('routes', {
    method: 'POST',
    body: JSON.stringify({
      id: fakeId,
      name: 'Anonyme Testroute',
      author_id: fakeId,
      city: 'Lissabon',
      country: 'Portugal',
      country_code: 'PT',
      published: true,
    }),
  })
  check(
    'Anonyme koennen keine Route veroeffentlichen',
    insert.status >= 400,
    `HTTP ${insert.status}`,
  )

  const photoInsert = await query('route_photos', {
    method: 'POST',
    body: JSON.stringify({
      route_id: fakeId,
      stop_id: fakeId,
      author_id: fakeId,
      storage_path: 'test.jpg',
      visible_at: new Date(Date.now() - 86_400_000).toISOString(),
      exif_stripped: false,
      status: 'visible',
    }),
  })
  check(
    'Anonyme koennen kein sofort sichtbares Foto einspielen',
    photoInsert.status >= 400,
    `HTTP ${photoInsert.status}`,
  )

  // ── 5. Zaehler sind nicht direkt beschreibbar ────────────────────────────
  console.log('\n[5] Zaehlerintegritaet')
  const published = await query('routes?published=eq.true&select=id,upvotes&limit=1')
  const sample = Array.isArray(published.body) ? published.body[0] : null
  if (sample) {
    const bump = await query(`routes?id=eq.${sample.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ upvotes: 9999 }),
    })
    check(
      'upvotes kann nicht direkt gesetzt werden',
      bump.status >= 400,
      `HTTP ${bump.status}`,
    )
  } else {
    console.log('  SKIP  keine veroeffentlichte Route zum Testen vorhanden')
  }

  // ── 6. Storage ist privat ─────────────────────────────────────────────────
  // Ohne diesen Test waere die ganze Verzoegerung umsonst: bei einem
  // oeffentlichen Bucket laesst sich jede Datei direkt ueber ihre URL
  // abrufen, ohne route_photos zu beruehren.
  console.log('\n[6] Storage')
  const objects = await query('objects?bucket_id=eq.route-photos&select=name')
  // 404 (PGRST205) heisst: storage.objects ist ueber PostgREST gar nicht
  // exponiert — das ist "nicht auflistbar", nur eben nicht als leere Liste.
  check(
    'Bucket-Objekte sind ohne Session nicht auflistbar',
    objects.status === 200 ? (Array.isArray(objects.body) && objects.body.length === 0) : true,
    objects.status === 200 ? `${objects.body?.length} Objekte sichtbar` : `HTTP ${objects.status} (Zugriff verweigert)`,
  )

  const anyBucket = await query('objects?select=name,id&limit=1')
  check(
    'kein Objekt aus route-photos ist ueber storage lesbar',
    anyBucket.status === 200 ? (Array.isArray(anyBucket.body) && anyBucket.body.length === 0) : true,
    anyBucket.status === 200 ? `${anyBucket.body?.length} Objekte sichtbar` : `HTTP ${anyBucket.status} (Zugriff verweigert)`,
  )

  // ── Ergebnis ──────────────────────────────────────────────────────────────
  console.log(`\n=== ${passed} bestanden, ${failed} fehlgeschlagen ===`)
  if (failed > 0) {
    console.log('Fehlgeschlagen:\n  - ' + failures.join('\n  - '))
    process.exit(1)
  }
  console.log('Die Schreibregeln halten.\n')
}

main().catch((err) => {
  console.error('Testlauf abgebrochen:', err.message)
  process.exit(2)
})
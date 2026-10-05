/**
 * Rauchtest gegen die produktive Seite (SNT-407, ohne Playwright).
 *
 * Warum kein Playwright: Ein echter Browser-Test laedt rund 300 MB Browser-
 * Binaries nach und braucht eine eigene CI-Installation. Fuer die Frage, die
 * hier tatsaechlich zaehlt — "liefert die ausgelieferte Seite das aus?" — reicht
 * HTTP. Geprueft wird:
 *   1. jede Route antwortet mit 200 und liefert das App-Geruest
 *   2. das in index.html referenzierte CSS/JS existiert wirklich (kein toter Chunk)
 *   3. die Sitemap-URLts sind erreichbar
 *   4. PWA-Dateien und Security-Header stehen
 *
 * Bewusst OHNE Playwright: Das testet den ausgelieferten Zustand. Was ein
 * Browser daraus rendert, bleibt manuell zu pruefen (siehe T-006).
 *
 * Aufruf:
 *   node scripts/smoke_live.mjs                       (Standard-URL)
 *   node scripts/smoke_live.mjs https://eigene-url    (gegen Deployment)
 */

// Ohne fetch polyfill: laeuft ab Node 18.
const BASE = (process.argv[2] || 'https://scratch-n-travel.vercel.app').replace(/\/$/, '')

// public/robots.txt sperrt bewusst: nicht oeffentlich, aber Teil des Auftritts.
const PRIVATE = new Set(['/api/', '/growth', '/host', '/admin', '/chat', '/profile'])

let passed = 0
let failed = 0
const failures = []

function ok(name) {
  passed++
  console.log(`  [ok]   ${name}`)
}

function fail(name, detail) {
  failed++
  failures.push(name)
  console.log(`  [FAIL] ${name} — ${detail}`)
}

function check(name, condition, detail = '') {
  if (condition) ok(name)
  else fail(name, detail)
}

async function get(path, { allowRedirect = false } = {}) {
  const res = await fetch(BASE + path, {
    redirect: allowRedirect ? 'follow' : 'manual',
    headers: { 'User-Agent': 'snt-smoke/1.0' },
  })
  return { status: res.status, res }
}

console.log(`Rauchtest gegen ${BASE}\n`)

// ─── 1) Routen ──────────────────────────────────────────────────────────────
console.log('[1] Routen antworten')
const ROUTES = [
  '/', '/explore', '/people', '/meetups', '/safety', '/stories', '/tours',
  '/scratch', '/passport', '/local-routes', '/badges', '/wanderbond', '/pricing',
  '/radar', '/checklists', '/ai', '/login', '/profile', '/chat', '/host',
  '/impressum', '/datenschutz', '/terms', '/gibtsnicht',
]

for (const route of ROUTES) {
  try {
    const { status, res } = await get(route)
    if (status !== 200) {
      fail(`Route ${route}`, `HTTP ${status}`)
      continue
    }
    const html = await res.text()
    const hasRoot = html.includes('id="root"')
    const isNotFoundRoute = route === '/gibtsnicht'
    if (!hasRoot) {
      fail(`Route ${route}`, 'kein id="root" im HTML — App-Geruest fehlt')
    } else if (isNotFoundRoute) {
      ok(`Route ${route} (200, 404-Seite im Client)`)
    } else {
      ok(`Route ${route}`)
    }
  } catch (err) {
    fail(`Route ${route}`, err.message)
  }
}

// ─── 2) Ausgelieferte Assets wirklich vorhanden ────────────────────────────
console.log('\n[2] Referenzierte Chunks existieren')
try {
  const { res } = await get('/')
  const html = await res.text()
  const refs = [...html.matchAll(/(?:src|href)="\/assets\/([^"]+\.(?:js|css))"/g)].map((m) => m[1])
  const unique = [...new Set(refs)]
  if (unique.length === 0) {
    fail('Assets', 'index.html referenziert kein Asset — Build kaputt?')
  } else {
    for (const name of unique) {
      try {
        const { status } = await get(`/assets/${name}`)
        check(`Asset ${name}`, status === 200, `HTTP ${status}`)
      } catch (err) {
        fail(`Asset ${name}`, err.message)
      }
    }
  }
} catch (err) {
  fail('Assets', err.message)
}

// ─── 3) Sitemap + statische Dateien ────────────────────────────────────────
console.log('\n[3] Sitemap, PWA und Metadaten')
try {
  const { status, res } = await get('/sitemap.xml')
  const xml = await res.text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  check(`sitemap.xml erreichbar (${urls.length} URLs)`, status === 200, `HTTP ${status}`)

  // Die Sitemap zeigt auf die kanonische Domain. Solange die Entscheidung
  // SNT-108 offen ist, pruefen wir die Pfade gegen die getestete Instanz.
  const paths = urls.map((u) => new URL(u).pathname).filter((p) => !PRIVATE.has(p))
  let sitemapOk = 0
  for (const p of paths) {
    try {
      const r = await get(p)
      if (r.status === 200) sitemapOk++
    } catch {
      /* zaehlt als nicht erreichbar */
    }
  }
  check(`Sitemap-Pfade erreichbar (${sitemapOk}/${paths.length})`, sitemapOk === paths.length)
} catch (err) {
  fail('sitemap.xml', err.message)
}

for (const [path, label] of [
  ['/robots.txt', 'robots.txt'],
  ['/sw.js', 'Service Worker'],
  ['/manifest.json', 'Web-App-Manifest'],
  ['/favicon.svg', 'Favicon'],
]) {
  try {
    const { status } = await get(path)
    check(`${label} vorhanden`, status === 200, `HTTP ${status}`)
  } catch (err) {
    fail(`${label} vorhanden`, err.message)
  }
}

try {
  const { res } = await get('/')
  const robots = await (await get('/robots.txt')).res.text()
  check('robots.txt erlaubt Indexierung', /Allow:\s*\//i.test(robots) && !/Disallow:\s*\/\s*$/m.test(robots))
  check('kein noindex im Produktions-HTML', !/noindex/i.test(await res.text()))
} catch (err) {
  fail('robots/noindex', err.message)
}

// ─── 4) Security-Header + API ───────────────────────────────────────────────
console.log('\n[4] Security-Header und API')
try {
  const { res } = await get('/')
  for (const [header, label] of [
    ['x-content-type-options', 'nosniff'],
    ['x-frame-options', 'Frame-Schutz'],
    ['referrer-policy', 'Referrer-Policy'],
    ['permissions-policy', 'Permissions-Policy'],
  ]) {
    check(`Header gesetzt: ${label}`, Boolean(res.headers.get(header)), `fehlt: ${header}`)
  }
} catch (err) {
  fail('Security-Header', err.message)
}

for (const [route, expected, label] of [
  ['/api/hermes-concierge', 405, 'GET → 405 (nicht 500)'],
  ['/api/pod-orders', 405, 'GET → 405 (nicht 500)'],
  ['/api/stripe-webhook', 405, 'GET → 405 (nicht 500)'],
]) {
  try {
    const { status } = await get(route)
    check(`API ${label}`, status === expected, `HTTP ${status} statt ${expected}`)
  } catch (err) {
    fail(`API ${route}`, err.message)
  }
}

try {
  const res = await fetch(BASE + '/api/hermes-concierge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'ping' }),
  })
  check('API POST antwortet 200', res.status === 200, `HTTP ${res.status}`)
} catch (err) {
  fail('API POST', err.message)
}

// ─── Ergebnis ───────────────────────────────────────────────────────────────
console.log(`\n${passed} bestanden, ${failed} fehlgeschlagen.`)
if (failed > 0) {
  console.log('Fehlgeschlagen:')
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}
console.log('Produktion entspricht dem ausgelieferten Zustand.')
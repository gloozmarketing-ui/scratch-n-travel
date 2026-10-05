/**
 * SEO-Konsistenz-Check (SNT-109).
 *
 * Prueft, was der menschliche Verify sonst von Hand macht:
 *   1. Jede indexierbare Route steht in der sitemap.xml
 *   2. Keine bewusst gesperrte Route (robots Disallow) steht in der Sitemap
 *   3. canonical und og:url zeigen auf dieselbe Domain
 *   4. Der Sitemap-Host stimmt mit dem canonical-Host ueberein
 *   5. Die Sitemap enthaelt keine doppelten URLs
 *
 * Was bewusst NICHT geprueft wird: ob die Domain existiert (SNT-108, Owner-
 * Entscheidung). Der Check bleibt gueltig, egal wohin die Domain spaeter
 * wechselt — er verlangt nur, dass alle drei Stellen zusammenpassen.
 *
 * Aufruf: node scripts/check_seo.mjs   (auch in check:all)
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// Bewusst nicht indexiert — abgeleitet aus public/robots.txt Disallow
// plus den Seiten, die nie oeffentlich werden sollen (Login, 404).
const NOT_INDEXABLE = new Set([
  '/api', '/growth', '/admin', '/chat', '/profile', '/host',
  '/login', // Fuehrt nur zur Eingabe; der Inhalt ist hinter RequireAuth
])

let failed = 0
let passed = 0

function check(name, ok, detail = '') {
  if (ok) {
    passed++
    console.log(`  [ok]   ${name}`)
  } else {
    failed++
    console.log(`  [FAIL] ${name}${detail ? ' — ' + detail : ''}`)
  }
}

console.log('SEO-Konsistenz (SNT-109)')

// ─── Routen aus src/routes.tsx ─────────────────────────────────────────────
const routesFile = ['routes.tsx', 'routes.ts']
  .map((n) => join(ROOT, 'src', n))
  .find((p) => existsSync(p))

if (!routesFile) {
  console.error('  [FAIL] src/routes.tsx nicht gefunden')
  process.exit(1)
}

const routesSrc = readFileSync(routesFile, 'utf8')
const routes = new Set(['/'])
for (const m of routesSrc.matchAll(/path:\s*'([^']+)'/g)) {
  if (m[1] === '*') continue
  routes.add(m[1].startsWith('/') ? m[1] : '/' + m[1])
}

// ─── Sitemap ───────────────────────────────────────────────────────────────
const sitemapPath = join(ROOT, 'public', 'sitemap.xml')
if (!existsSync(sitemapPath)) {
  console.error('  [FAIL] public/sitemap.xml fehlt')
  process.exit(1)
}
const sitemap = readFileSync(sitemapPath, 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const sitemapPaths = sitemapUrls.map((u) => new URL(u).pathname.replace(/\/$/, '') || '/')

// ─── 1) Jede indexierbare Route steht in der Sitemap ──────────────────────
const indexable = [...routes].filter((r) => !NOT_INDEXABLE.has(r))
const missing = indexable.filter((r) => !sitemapPaths.includes(r))
check(
  `alle ${indexable.length} indexierbaren Routen in der Sitemap`,
  missing.length === 0,
  missing.length ? `fehlen: ${missing.join(', ')}` : '',
)

// ─── 2) Keine gesperrte Route in der Sitemap ──────────────────────────────
const leaked = sitemapPaths.filter((p) => NOT_INDEXABLE.has(p))
check(
  'keine gesperrte Route in der Sitemap',
  leaked.length === 0,
  leaked.length ? `drin: ${leaked.join(', ')}` : '',
)

// ─── 3) canonical und og:url identisch ────────────────────────────────────
const indexHtml = readFileSync(join(ROOT, 'index.html'), 'utf8')
const canonical = indexHtml.match(/rel="canonical"\s+href="([^"]+)"/)?.[1]
const ogUrl = indexHtml.match(/property="og:url"\s+content="([^"]+)"/)?.[1]
check('canonical vorhanden', Boolean(canonical), 'fehlt in index.html')
check('og:url vorhanden', Boolean(ogUrl), 'fehlt in index.html')
check(
  'canonical === og:url',
  Boolean(canonical && ogUrl && canonical === ogUrl),
  `canonical=${canonical} og:url=${ogUrl}`,
)

// ─── 4) Sitemap-Host === canonical-Host ───────────────────────────────────
const canonicalHost = canonical ? new URL(canonical).host : null
const sitemapHosts = [...new Set(sitemapUrls.map((u) => new URL(u).host))]
check(
  'Sitemap-Host === canonical-Host',
  Boolean(canonicalHost) && sitemapHosts.length === 1 && sitemapHosts[0] === canonicalHost,
  `canonical=${canonicalHost} sitemap=${sitemapHosts.join(',')}`,
)

// ─── 5) Keine doppelten URLs ──────────────────────────────────────────────
const dupes = sitemapPaths.filter((p, i) => sitemapPaths.indexOf(p) !== i)
check('keine doppelten Sitemap-Eintraege', dupes.length === 0, dupes.join(', '))

// ─── 6) Sitemap-URLs ohne Fehler im Pfad ──────────────────────────────────
const malformed = sitemapPaths.filter((p) => !p.startsWith('/') || p.includes(' '))
check('Pfade sauber (beginnen mit /, keine Leerzeichen)', malformed.length === 0, malformed.join(', '))

console.log(`\n${passed} bestanden, ${failed} fehlgeschlagen.`)
if (failed > 0) process.exit(1)
console.log('Sitemap, canonical und Routen passen zusammen.')
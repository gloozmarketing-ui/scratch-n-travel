#!/usr/bin/env node
/**
 * audit_ui.js — Statisches UI-Audit der React-Seiten (tote Buttons, tote Links).
 *
 * Findet drei Fehlertypen, die im Test nicht auffallen, aber Nutzer im echten
 * Leben treffen:
 *
 *   1. Tote Buttons:  <button> ohne onClick und ohne type="submit"
 *                     (Ein Klick ins Leere.)
 *   2. Tote Links:    <Link to="/x"> / navigate('/x'), für die es keine Route
 *                     in src/routes.ts gibt. (Endet auf der 404-Seite.)
 *   3. Platzhalter-Hrefs: href="#" oder href="javascript:...".
 *
 * Aufruf:  node scripts/audit_ui.js
 * Exit-Code: 1, sobald ein Befund vorliegt (CI-tauglich).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SCAN_DIRS = ['src/pages', 'src/components']
const ROUTES_FILE = join(ROOT, 'src', 'routes.ts')

// ─── Routen einlesen ─────────────────────────────────────────────────────────
function readRoutes() {
  const src = readFileSync(ROUTES_FILE, 'utf8')
  const routes = new Set(['/'])
  for (const m of src.matchAll(/path:\s*'([^']+)'/g)) {
    const p = m[1]
    if (p === '*') continue
    routes.add(p.startsWith('/') ? p : '/' + p)
  }
  return routes
}

// ─── Dateien sammeln ─────────────────────────────────────────────────────────
function collectFiles(dir, out = []) {
  const abs = join(ROOT, dir)
  if (!existsSync(abs)) return out
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    const rel = join(dir, entry.name).replace(/\\/g, '/')
    if (entry.isDirectory()) collectFiles(rel, out)
    else if (entry.name.endsWith('.tsx')) out.push(rel)
  }
  return out
}

function lineOf(src, index) {
  return src.slice(0, index).split('\n').length
}

// ─── Audit pro Datei ─────────────────────────────────────────────────────────
function auditFile(relPath, routes) {
  const src = readFileSync(join(ROOT, relPath), 'utf8')
  const findings = []

  // 1. Tote Buttons
  for (const m of src.matchAll(/<button\b([\s\S]*?)<\/button>/g)) {
    const full = m[0]
    const attrsEnd = full.indexOf('>')
    const attrs = attrsEnd === -1 ? m[1] : full.slice(0, attrsEnd)
    if (attrs.includes('onClick')) continue
    if (/type=\{\s*['"]submit['"]\s*\}|type="submit"|type='submit'/.test(attrs)) continue
    const label = full
      .slice(full.indexOf('>') + 1, full.lastIndexOf('<'))
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 60)
    findings.push({
      type: 'TODER BUTTON',
      line: lineOf(src, m.index),
      detail: `<button> ohne onClick (Label: "${label}")`
    })
  }

  // 2. Tote Links (statische Link-Ziele gegen Routen)
  const linkRe = /to=\{\s*['"]([^'"]+)['"]\s*\}|to=["']([^"']+)["']|navigate\(\s*['"]([^'"]+)['"]/g
  for (const m of src.matchAll(linkRe)) {
    const target = m[1] || m[2] || m[3]
    if (!target) continue
    if (!target.startsWith('/')) continue
    if (target.includes('${')) continue // dynamisches Ziel
    const clean = target.split('?')[0].split('#')[0]
    if (clean === '/') continue
    if (!routes.has(clean)) {
      findings.push({
        type: 'TOTER LINK',
        line: lineOf(src, m.index),
        detail: `to="${target}" — keine Route in src/routes.ts`
      })
    }
  }

  // 3. Platzhalter-Hrefs
  for (const m of src.matchAll(/href=\{?\s*["'](#|javascript:[^"']*)["']/g)) {
    findings.push({
      type: 'PLATZHALTER-HREF',
      line: lineOf(src, m.index),
      detail: m[0]
    })
  }

  return findings
}

// ─── Main ────────────────────────────────────────────────────────────────────
function main() {
  const routes = readRoutes()
  const files = SCAN_DIRS.flatMap((d) => collectFiles(d))
  let total = 0

  console.log('UI-Audit — tote Buttons, tote Links, Platzhalter-Hrefs')
  console.log(`Routen: ${[...routes].sort().join(', ')}`)
  console.log(`Dateien geprüft: ${files.length}\n`)

  for (const rel of files.sort()) {
    const findings = auditFile(rel, routes)
    if (!findings.length) continue
    total += findings.length
    console.log(`${rel}`)
    for (const f of findings) console.log(`  Z${f.line}  [${f.type}] ${f.detail}`)
    console.log('')
  }

  if (total === 0) {
    console.log('Keine Befunde.')
    return
  }
  console.log(`${total} Befund(e).`)
  process.exitCode = 1
}

main()

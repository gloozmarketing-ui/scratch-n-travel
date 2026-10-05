/**
 * Statische Pruefung fuer supabase/schema.sql.
 *
 * Warum ein Skript statt `supabase db lint`: Ohne erreichbare Instanz laesst
 * sich das SQL nicht ausfuehren. Die beiden Fehler, die in dieser Datei
 * real aufgetreten sind, sind aber statisch erkennbar:
 *
 *   1. Unbalancierte Dollar-Quotes -> der Parser bricht mitten in der Datei ab.
 *      Genau das war der `hobbies`-Fehler: die Tabelle wurde nie geschlossen,
 *      wodurch ALLES danach nie ausgefuehrt wurde.
 *   2. Subqueries in CHECK-Constraints -> Postgres lehnt sie kategorisch ab.
 *
 * Aufruf: node scripts/check_schema.js
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sql = readFileSync(join(root, 'supabase', 'schema.sql'), 'utf8')

let failed = 0
const ok = (msg) => console.log(`  [ok]   ${msg}`)
const bad = (msg) => {
  console.log(`  [FAIL] ${msg}`)
  failed++
}

// ── Kommentare und Literale entfernen, damit Inhalt nicht mitgezaehlt wird ──
let stripped = ''
let i = 0
let inLineComment = false
let inBlockComment = false
let inString = false

while (i < sql.length) {
  const c = sql[i]
  const next = sql[i + 1]

  if (inLineComment) {
    if (c === '\n') { inLineComment = false; stripped += c }
    i++
    continue
  }
  if (inBlockComment) {
    if (c === '*' && next === '/') { inBlockComment = false; i += 2; continue }
    if (c === '\n') stripped += c
    i++
    continue
  }
  if (inString) {
    if (c === "'") {
      if (next === "'") { i += 2; continue } // verdoppeltes Anfuehrungszeichen
      inString = false
    }
    i++
    continue
  }
  if (c === '-' && next === '-') { inLineComment = true; i += 2; continue }
  if (c === '/' && next === '*') { inBlockComment = true; i += 2; continue }
  if (c === "'") { inString = true; i++; continue }
  stripped += c
  i++
}

if (inString) bad('Nicht geschlossenes String-Literal.')
if (inBlockComment) bad('Nicht geschlossener Block-Kommentar /* ... */.')

// ── 1) Dollar-Quotes muessen paarweise aufgehen ────────────────────────────
const dollarTags = [...stripped.matchAll(/\$[A-Za-z_][A-Za-z0-9_]*\$|\$\$/g)].map((m) => m[0])
const openTag = dollarTags.length % 2 === 1 ? dollarTags[dollarTags.length - 1] : null
if (openTag) {
  bad(`Ungerade Anzahl Dollar-Quotes (${dollarTags.length}) — oeffnender Tag: ${openTag}`)
} else {
  ok(`Dollar-Quotes paarweise (${dollarTags.length / 2} Bloecke).`)
}

// Verschachteltes $$ innerhalb eines DO $$ -Blocks bricht den Parser: das
// innere $$ wuerde den umgebenden Block vorzeitig schliessen. Geprueft wird
// der Text INNERHALB des cron.schedule()-Aufrufs — und zwar nur die beiden
// Argumente nach dem Jobnamen, denn der Aufruf selbst enthaelt Klammern
// ('SELECT public.publish_due_route_photos()'), die ein naiver
// `schedule\(([\s\S]*?)\)` beim falschen Zeichen abschneiden wuerde.
const cronStart = stripped.search(/cron\.schedule\s*\(/i)
if (cronStart === -1) {
  console.log('  [--]  Kein cron.schedule()-Aufruf gefunden (pg_cron evtl. deaktiviert).')
} else {
  // Ab dem ersten Argument nach dem Jobnamen bis zum schliessenden ');'
  // des PERFORM-Aufrufs herausschneiden.
  const tail = stripped.slice(cronStart)
  const argsEnd = tail.search(/\)\s*;/)
  const cronArgs = argsEnd === -1 ? tail : tail.slice(0, argsEnd)
  if (/\$\$/.test(cronArgs)) {
    bad('Verschachtelte Dollar-Quotes im cron.schedule()-Aufruf — Parser bricht ab.')
  } else {
    ok('cron.schedule()-Aufruf ohne verschachtelte Dollar-Quotes.')
  }
}

// ── 2) Klammern muessen balanciert sein ─────────────────────────────────────
let depth = 0
let minDepth = 0
for (const c of stripped) {
  if (c === '(') depth++
  if (c === ')') { depth--; if (depth < minDepth) minDepth = depth }
}
if (depth !== 0) bad(`Klammern unausgeglichen: ${depth > 0 ? `${depth} zu viel` : `${-depth} zu wenig`}.`)
else ok(`Klammern balanciert.${minDepth < 0 ? ' (trotz Ueberlauf am Ende — siehe oben)' : ''}`)

console.log('\n== CREATE TABLE Blöcke ==')
const tableRe = /CREATE TABLE IF NOT EXISTS\s+(\w+)\s*\(/gi
let tm
const tables = []
while ((tm = tableRe.exec(stripped)) !== null) {
  let start = tm.index + tm[0].length - 1
  let d = 0
  let end = -1
  for (let k = start; k < stripped.length; k++) {
    if (stripped[k] === '(') d++
    if (stripped[k] === ')') { d--; if (d === 0) { end = k; break } }
  }
  if (end === -1) bad(`CREATE TABLE ${tm[1]} wird NIE geschlossen.`)
  else if (!/^\s*\)\s*;/.test(stripped.slice(end, end + 4))) {
    bad(`CREATE TABLE ${tm[1]} endet auf ')' ohne ');'`)
  } else tables.push(tm[1])
}
ok(`${tables.length} CREATE TABLE geschlossen.`)

// Fuer die Fehlersuche: Zeichen-Offset -> Zeilennummer im Original.
const lineOf = (offset) => sql.slice(0, offset).split('\n').length
const lineOfStripped = (offset) => stripped.slice(0, offset).split('\n').length

// ACHTUNG: `WITH CHECK (...)` aus RLS-Policies und
// `ADD CONSTRAINT x CHECK (...)` sind KEINE CHECK-Constraints im Sinne von
// Postgres. Nur ein CHECK, das als Spalten- oder Tabellen-Constraint direkt
// in einer Definition steht, verbietet Subqueries. Deshalb wird vorher
// geprueft, ob unmittelbar davor `WITH ` oder `ADD CONSTRAINT ... ` steht.
console.log('\n== CHECK-Constraints ==')
const checkRe = /\bCHECK\s*\(/gi
let cm
let subqueryChecks = 0
let checkCount = 0
let skipped = 0
while ((cm = checkRe.exec(stripped)) !== null) {
  // Kontext 40 Zeichen davor pruefen.
  const before = stripped.slice(Math.max(0, cm.index - 40), cm.index).toUpperCase()
  if (/\bWITH\s*$/.test(before)) { skipped++; continue }                    // WITH CHECK (...)
  if (/ADD CONSTRAINT\s+\w+\s*$/.test(before)) { skipped++; continue }     // ADD CONSTRAINT x CHECK (...)
  if (/^ALTER TABLE\s+\w+\s+ADD\s+$/.test(before.trimStart())) { skipped++; continue }

  const open = cm.index + cm[0].length - 1
  let d = 0
  let end = -1
  for (let k = open; k < stripped.length; k++) {
    if (stripped[k] === '(') d++
    if (stripped[k] === ')') { d--; if (d === 0) { end = k; break } }
  }
  if (end === -1) continue
  const body = stripped.slice(open + 1, end)
  checkCount++
  if (/\bSELECT\b/i.test(body)) {
    bad(`Verbotener CHECK-Constraint mit Subquery (Zeile ~${lineOfStripped(cm.index)}): ` +
        `${body.replace(/\s+/g, ' ').trim().slice(0, 90)}`)
    subqueryChecks++
  }
}
if (subqueryChecks === 0) {
  ok(`Kein CHECK-Constraint enthaelt eine Subquery (${checkCount} geprueft, ${skipped} RLS-/ADD-CONSTRAINT-Stellen uebersprungen).`)
} else {
  console.log(`  (${checkCount} echte CHECK-Constraints geprueft.)`)
}

// ── 5) Spalten, auf die Funktionen zugreifen, muessen existieren ───────────
const profilesBlock = stripped.match(/CREATE TABLE IF NOT EXISTS profiles\s*\(([\s\S]*?)\n\);/i)
if (!profilesBlock) {
  bad('profiles-Tabelle nicht gefunden.')
} else {
  for (const col of ['certified_stops', 'is_vip']) {
    if (new RegExp(`\\b${col}\\b`, 'i').test(profilesBlock[1])) ok(`profiles.${col} vorhanden.`)
    else bad(`profiles.${col} FEHLT — route_publish_allowed() wuerde daran scheitern.`)
  }
}

// ── 6) Funktionen und Policies, auf die sich etwas stuetzt ─────────────────
for (const fn of ['route_publish_allowed', 'route_counters_unchanged', 'route_photo_timing_unchanged',
                  'sync_route_station_count', 'guard_route_publish', 'publish_due_route_photos']) {
  if (new RegExp(`CREATE OR REPLACE FUNCTION\\s+(?:public\\.)?${fn}\\b`, 'i').test(stripped)) ok(`Funktion ${fn} definiert.`)
  else bad(`Funktion ${fn} fehlt.`)
}

const policies = [...stripped.matchAll(/CREATE POLICY\s+(\w+)/gi)].length
const enabled = [...stripped.matchAll(/ENABLE ROW LEVEL SECURITY/gi)].length
console.log(`\n  ${policies} Policies, ${enabled} Tabellen mit RLS.`)
if (policies === 0) bad('Keine Policies — RLS wuerde fuer jeden Select 0 Zeilen liefern.')

console.log(failed === 0
  ? '\nSchema statisch unauffaellig. Ausfuehrung ist damit nicht bewiesen — dafuer\nbraucht es eine echte Supabase-Instanz.\n'
  : `\n${failed} Problem(e) gefunden.\n`)
process.exit(failed === 0 ? 0 : 1)
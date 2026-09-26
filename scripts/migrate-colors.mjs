/**
 * Einmal-Migration: alte hartcodierte Farben -> semantische Theme-Tokens.
 *
 * Die Legacy-Seiten (Passport, Badges, Explore, …) hatten ~500 Farbwerte
 * direkt im JSX. Dadurch war Light Mode dort schlicht kaputt: Navy-Gold
 * auf warmem Papier. Dieses Skript ersetzt sie durch Token, die in BEIDEN
 * Themes einen Sinn ergeben.
 *
 * Aufruf:  node scripts/migrate-colors.mjs
 * Idempotent: bereits migrierte Dateien werden übersprungen.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['src/pages', 'src/components']
const EXT = /\.tsx$/

/** Reihenfolge zählt: spezifische Muster vor generischen. */
const RULES = [
  // ── Alt-Navy Hintergründe -> Papier/Karte ──
  [/bg-\[#0C1825\]/g, 'bg-paper-deep'],
  [/bg-\[#0B131F\]/g, 'bg-paper-deep'],
  [/bg-\[#152539\]/g, 'bg-paper-deep'],
  [/bg-\[#1D3454\]/g, 'bg-paper-deep'],
  [/bg-\[#1E344F\]/g, 'bg-paper-deep'],
  [/bg-\[#2C1810\]/g, 'bg-card'],
  [/from-\[#152539\]/g, 'from-paper-deep'],
  [/to-\[#0C1825\]/g, 'to-paper-deep'],
  [/from-\[#0C1825\]/g, 'from-paper-deep'],

  // ── Cremefarbener Text (auf Navy) -> Standard-Tinte ──
  [/text-\[#F4E4C1\]/g, 'text-ink'],
  [/text-\[#FFFDF8\]/g, 'text-ink'],
  [/text-\[#2C1810\]/g, 'text-ink'],
  [/text-\[#0C1825\]/g, 'text-ink'],
  [/text-\[#1D3454\]/g, 'text-ink'],
  [/text-\[#1E344F\]/g, 'text-ink'],

  // ── Blaugrauer Sekundärtext -> Ink-Faint ──
  [/text-\[#8A9AAA\]/g, 'text-ink-faint'],
  [/text-\[#8A7040\]/g, 'text-ink-faint'],
  [/text-\[#A07830\]/g, 'text-ink-faint'],

  // ── Gold -> Sonnenlicht ──
  [/text-\[#C9A84C\]/g, 'text-sun'],
  [/text-\[#E8C460\]/g, 'text-sun'],
  [/text-\[#8A6820\]/g, 'text-sun'],
  [/bg-\[#C9A84C\]/g, 'bg-sun'],
  [/bg-\[#E8C460\]/g, 'bg-sun'],
  [/from-\[#C9A84C\]/g, 'from-sun'],
  [/to-\[#C9A84C\]/g, 'to-sun'],

  // ── Terrakotta -> Warnfarbe ──
  [/text-\[#8B3A2A\]/g, 'text-terracotta'],
  [/bg-\[#8B3A2A\]/g, 'bg-terracotta'],

  // ── Grün (Emerald) -> Blatt ──
  [/text-emerald-400/g, 'text-leaf'],
  [/text-emerald-300/g, 'text-leaf'],
  [/border-emerald-500\/30/g, 'border-leaf'],

  // ── Rot für Fehler -> Terrakotta (passt zum Theme) ──
  [/text-red-300/g, 'text-terracotta'],
  [/text-red-400/g, 'text-terracotta'],

  // ── Rahmen ──
  [/border-\[#C9A84C\]/g, 'border-sun'],
  [/border-\[#8B3A2A\]/g, 'border-terracotta'],
  [/border-\[#F4E4C1\]/g, 'border-line'],
  [/border-\[#2C1810\]/g, 'border-line'],

  // ── Semantische rgba-Washes (funktionieren in beiden Themes) ──
  [/bg-\[rgba\(201,168,76,0\.\d+\)\]/g, 'bg-sun-wash'],
  [/bg-\[rgba\(201,168,76,0\.\d+\)\]/g, 'bg-sun-wash'],
  [/border-\[rgba\(201,168,76,0\.\d+\)\]/g, 'border-sun'],
  [/text-\[rgba\(201,168,76,0\.\d+\)\]/g, 'text-sun'],
  [/from-\[rgba\(201,168,76,0\.\d+\)\]/g, 'from-sun-wash'],

  [/bg-\[rgba\(139,58,42,0\.\d+\)\]/g, 'bg-terracotta-wash'],
  [/border-\[rgba\(139,58,42,0\.\d+\)\]/g, 'border-terracotta'],
  [/text-\[rgba\(139,58,42,0\.\d+\)\]/g, 'text-terracotta'],

  [/bg-\[rgba\(16,185,129,0\.\d+\)\]/g, 'bg-leaf-wash'],
  [/border-\[rgba\(16,185,129,0\.\d+\)\]/g, 'border-leaf'],

  // ── Neutrale Tinte-Washes (rgba(44,24,16,…) = alte „Tinte") ──
  // Diese sind bewusst halbtransparent und funktionieren in BEIDEN Themes,
  // weil sie auf der jeweils gültigen --ink-Farbe basieren.
  [/bg-\[rgba\(44,24,16,0\.\d+\)\]/g, 'bg-ink-ghost/10'],
  [/border-\[rgba\(44,24,16,0\.\d+\)\]/g, 'border-line'],
  [/text-\[rgba\(44,24,16,0\.\d+\)\]/g, 'text-ink-soft'],

  // ── Gold-Washes mitOpacity (text/border) ──
  [/border-\[rgba\(201,168,76,0\.\d+\)\]/g, 'border-sun/30'],
  [/text-\[rgba\(201,168,76,0\.\d+\)\]/g, 'text-sun'],

  // ── Radiale Verläufe (Dekor) ──
  [/bg-\[radial-gradient\(circle,#8B3A2A,transparent_70%\)\]/g,
   'bg-[radial-gradient(circle,var(--terracotta),transparent_70%)]'],
  [/bg-\[radial-gradient\(circle,#C9A84C,transparent_70%\)\]/g,
   'bg-[radial-gradient(circle,var(--sun),transparent_70%)]'],

  // ── Avatar-Ring: Trennung vom Hintergrund statt fixe Navy ──
  // Ein 2px-Ring in der Kartenfarbe trennt in beiden Themes sauber.
  [/border-\[#152539\]/g, 'border-card'],
  [/border-\[#0C1825\]/g, 'border-card'],
  [/border-\[#2C1810\]/g, 'border-card'],

  // ── Inline-Gradient-Reste (sehr selten) ──
  [/from-\[#2C1810\]/g, 'from-card'],
  [/to-\[#2C1810\]/g, 'to-card'],
]

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, acc)
    else if (EXT.test(full)) acc.push(full)
  }
  return acc
}

let totalFiles = 0
let totalEdits = 0

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const before = readFileSync(file, 'utf8')
    let after = before

    for (const [pattern, replacement] of RULES) {
      after = after.replace(pattern, replacement)
    }

    if (after !== before) {
      const edits = (before.match(/#[0-9A-Fa-f]{6}|rgba\(/g) || []).length -
                    (after.match(/#[0-9A-Fa-f]{6}|rgba\(/g) || []).length
      writeFileSync(file, after, 'utf8')
      totalFiles++
      totalEdits += edits
      console.log(`  ${file}  (-${edits})`)
    }
  }
}

console.log(`\n${totalEdits} Farbwerte in ${totalFiles} Dateien ersetzt.`)

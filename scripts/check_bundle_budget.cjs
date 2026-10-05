// Bundle-Budget (SNT-412).
// Gemessen wird der First-Load-Pfad: die Chunks, die dist/index.html wirklich
// referenziert. Lazy-Chunks zaehlen separat, sonst wuerde ein alter, liegen
// gebliebener Chunk aus einem frueheren Build das Budget verletzen
// (dist/ wird unter Windows nicht immer restlos geleert).
const { readFileSync, existsSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

const DIST = join(__dirname, '..', 'dist');
const ASSETS = join(DIST, 'assets');
// Grenzen beziehen sich auf unkomprimierte Bytes (= die Groesse auf der Platte,
// wie sie im Build-Log steht). Gzip liegt bei diesem Stand grob 40 % darunter.
const FIRST_LOAD_KB = 820;   // Summe der vom HTML geladenen Chunks (Stand: 786 KB)
const BIGGEST_KB = 320;      // groesster einzelner Chunk (react: 304 KB)

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('FEHLER: dist/index.html fehlt — bitte erst `npm run build` ausfuehren.');
  process.exit(1);
}

const html = readFileSync(join(DIST, 'index.html'), 'utf8');
const refs = new Set();
for (const m of html.matchAll(/(?:src|href)="\/assets\/([^"]+\.(?:js|css))"/g)) {
  refs.add(m[1]);
}

if (refs.size === 0) {
  console.error('FEHLER: index.html referenziert keine Assets — Build unvollstaendig?');
  process.exit(1);
}

const entries = [...refs]
  .map((name) => ({ name, kb: Math.round(statSync(join(ASSETS, name)).size / 1024) }))
  .sort((a, b) => b.kb - a.kb);

const firstLoadKb = Math.round(entries.reduce((a, b) => a + b.kb, 0));
const biggest = entries[0];

// Lazy-Chunks nur zur Information — sie werden erst bei Bedarf geladen.
let lazyCount = 0;
let lazyKb = 0;
if (existsSync(ASSETS)) {
  for (const name of readdirSync(ASSETS)) {
    if (!name.endsWith('.js') || refs.has(name)) continue;
    lazyCount += 1;
    lazyKb += Math.round(statSync(join(ASSETS, name)).size / 1024);
  }
}

console.log('Bundle-Budget (SNT-412) — First-Load-Pfad aus dist/index.html');
for (const e of entries) console.log(`  ${e.kb} KB  ${e.name}`);
console.log(`  ------------------------------------------`);
console.log(`  First Load gesamt : ${firstLoadKb} KB (Limit ${FIRST_LOAD_KB} KB)`);
console.log(`  groesster Chunk   : ${biggest.kb} KB (Limit ${BIGGEST_KB} KB)`);
console.log(`  Lazy-Chunks       : ${lazyCount} Chunks / ~${lazyKb} KB (nur bei Bedarf)`);

let failed = false;
if (firstLoadKb > FIRST_LOAD_KB) {
  console.error(`  FEHLER: First Load ${firstLoadKb} KB ueberschreitet ${FIRST_LOAD_KB} KB.`);
  failed = true;
}
if (biggest.kb > BIGGEST_KB) {
  console.error(`  FEHLER: groesster Chunk ${biggest.kb} KB ueberschreitet ${BIGGEST_KB} KB.`);
  failed = true;
}

if (failed) process.exit(1);
console.log('  OK: Budget eingehalten.');
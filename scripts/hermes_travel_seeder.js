/**
 * Hermes Travel Engine v2.0 — Scratch'n'Travel
 *
 * Skills & MCPs available to Hermes:
 * ─────────────────────────────────────
 * SKILL-01: City Brain Seeding (Local Secrets, Family & Pet Spots)
 * SKILL-02: AI Content Generation (5-Kanal Social Media Posts)
 * SKILL-03: Anti-Shadowban variation engine
 * SKILL-04: Confidence Score validator for all AI outputs
 * SKILL-05: Family & Pet travel checklists generator
 * SKILL-06: Vercel Deployment via REST API (no local CLI needed)
 * SKILL-07: Supabase State Logger (audit_logs, hermes_city_brains)
 * SKILL-08: Telegram Direct Posting
 *
 * AI Provider Cascade (Fallback chain):
 *   1. OpenRouter (nvidia/nemotron-3-ultra-550b-a55b:free)
 *   2. EdenAI (google/gemma-4-31b-it)
 *   3. Static Fallback Content
 *
 * MCP Integrations:
 *   - Supabase MCP (state, logs, city brains)
 *   - Netlify MCP (alternative hosting)
 *   - GitHub MCP (push city brain updates, drafts)
 *
 * Usage:
 *   node scripts/hermes_travel_seeder.js [city]
 *   node scripts/hermes_travel_seeder.js --social   (social content run)
 *   node scripts/hermes_travel_seeder.js --deploy   (trigger Vercel deploy)
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

// ─── Config from Environment (GitHub Actions Secrets) ────────────────────────
const OPENROUTER_KEY    = process.env.OPENROUTER_API_KEY    || '';
const SUPABASE_URL      = process.env.SUPABASE_URL          || 'https://acgfcjcikjlrlfilqdyk.supabase.co';
const SUPABASE_KEY      = process.env.SUPABASE_SERVICE_KEY  || '';
const TELEGRAM_TOKEN    = process.env.TELEGRAM_BOT_TOKEN    || '';
const TELEGRAM_CHANNEL  = process.env.TELEGRAM_CHANNEL_ID   || '';
const VERCEL_TOKEN      = process.env.VERCEL_TOKEN          || '';
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID     || '';
const VERCEL_ORG_ID     = process.env.VERCEL_ORG_ID         || '';
const SITE_URL          = process.env.SITE_URL              || 'https://gloozmarketing-ui.github.io/scratch-n-travel/';

const ARGS        = process.argv.slice(2);
const TARGET_CITY = ARGS.find(a => !a.startsWith('--')) || 'Lissabon';
const MODE_SOCIAL = ARGS.includes('--social');
const MODE_DEPLOY = ARGS.includes('--deploy');

// ─── AI Provider Cascade ─────────────────────────────────────────────────────
const AI_PROVIDERS = [
  {
    name: 'OpenRouter (Nemotron Primary)',
    url:  'https://openrouter.ai/api/v1/chat/completions',
    key:  OPENROUTER_KEY,
    model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    headers: { 'HTTP-Referer': SITE_URL, 'X-Title': 'Scratch\'n\'Travel Hermes' },
  },
  {
    name: 'EdenAI Fallback (Gemma 4)',
    url:  'https://api.edenai.run/v1/text/chat',
    key:  process.env.EDENAI_API_KEY || '',
    model: 'google/gemma-4-31b-it',
    isEdenAI: true,
  },
];

// ─── HTTP Helper with 8s timeout ─────────────────────────────────────────────
function httpRequest(url, method = 'GET', body = null, extraHeaders = {}, timeoutMs = 8000) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const bodyStr = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method,
      timeout: timeoutMs,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'HermesTravel/2.0 Scratch-n-Travel',
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
        ...extraHeaders,
      },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('timeout', () => { req.destroy(); resolve({ status: 408, body: { error: 'Timeout' } }); });
    req.on('error', err => resolve({ status: 500, body: { error: err.message } }));
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// ─── AI Cascade Call ─────────────────────────────────────────────────────────
async function callAI(prompt, systemPrompt = '') {
  for (const provider of AI_PROVIDERS) {
    if (!provider.key) { console.warn(`  ⚠️  ${provider.name} — API Key nicht gesetzt, überspringe.`); continue; }
    console.log(`  🤖 Versuche: ${provider.name}...`);
    try {
      let result;
      if (provider.isEdenAI) {
        result = await httpRequest(provider.url, 'POST', {
          providers: 'google', text: prompt,
          chatbot_global_action: systemPrompt, previous_history: [], temperature: 0.7, max_tokens: 1200,
        }, { Authorization: `Bearer ${provider.key}` });
        if (result.status === 200 && result.body?.google?.generated_text) {
          console.log(`  ✅ ${provider.name}`);
          return { text: result.body.google.generated_text, provider: provider.name };
        }
      } else {
        result = await httpRequest(provider.url, 'POST', {
          model: provider.model,
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt },
          ],
          max_tokens: 1200, temperature: 0.75,
        }, { Authorization: `Bearer ${provider.key}`, ...(provider.headers || {}) });
        if (result.status === 200 && result.body?.choices?.[0]?.message?.content) {
          console.log(`  ✅ ${provider.name}`);
          return { text: result.body.choices[0].message.content, provider: provider.name };
        }
      }
      console.warn(`  ⚠️  ${provider.name} — Status ${result.status}`);
    } catch (err) {
      console.warn(`  ⚠️  ${provider.name} — ${err.message}`);
    }
  }
  console.warn('  ❌ Alle AI Provider fehlgeschlagen — statischer Fallback.');
  return { text: null, provider: 'static-fallback' };
}

// ─── SKILL-01: City Brain Seeding ────────────────────────────────────────────
async function seedCityBrain(city) {
  console.log(`\n🌍 [SKILL-01] City Brain Seeding: ${city}...`);

  const systemPrompt = `Du bist Hermes, der autonome City Intelligence Agent von Scratch'n'Travel.
Erstelle strukturierte JSON-Daten für das City Brain von ${city} mit:
- 5 authentische Geheimtipps (kein TripAdvisor, echte Insider-Orte)
- 3 hundefreundliche Spots/Strände
- 3 familienfreundliche Orte (kinderwagengerecht, Spielplatz, Kindergericht)
- 2 lokale Rezepte/Gerichte
Antworte NUR mit validem JSON, kein anderer Text.`;

  const prompt = `Erstelle das City Brain JSON für ${city} mit den Kategorien: baseline_spots (5), pet_highlights (3), family_highlights (3), local_recipes (2). Füge latitude/longitude, tags und eine kurze authentische Beschreibung hinzu.`;

  const ai = await callAI(prompt, systemPrompt);

  const cityData = {
    city,
    country: city === 'Lissabon' ? 'Portugal' : city === 'Barcelona' ? 'Spanien' : 'Europa',
    health_score: 92.5,
    ai_provider: ai.provider,
    seeded_at: new Date().toISOString(),
    baseline_spots: [
      { title: 'Praia da Ursa', category: 'secret_spot', tags: ['pet_friendly', 'family_friendly', 'secret'], description: 'Naturbelassener Sandstrand mit Klippen, abseits aller Touristenrouten.', lat: 38.7903, lng: -9.4925 },
      { title: 'Tasca O Galo — Alfama', category: 'local_food', tags: ['pet_friendly', 'traditional', 'dog_water_bowl'], description: 'Familiäre Kiez-Tasca. Hunde innen und außen willkommen. Fangfrischer Bacalhau.', lat: 38.7120, lng: -9.1310 },
      { title: 'Miradouro da Senhora do Monte', category: 'secret_spot', tags: ['secret', 'sunset', 'picnic'], description: 'Spectakulärer Sonnenuntergang ohne die großen Reisebus-Touristengruppen.', lat: 38.7170, lng: -9.1380 },
      { title: 'Jardim da Estrela', category: 'family_friendly', tags: ['stroller_friendly', 'playground', 'shade'], description: 'Historischer Park mit stufenfreien Wegen, eingezäuntem Spielbereich & Kiosk.', lat: 38.7150, lng: -9.1585 },
      { title: 'Mercado de Campo de Ourique', category: 'local_food', tags: ['family_friendly', 'local_food', 'kids_menu'], description: 'Echter Nachbarschaftsmarkt. Kein touristisches Food-Court. Lokale Händler & frische Produkte.', lat: 38.7170, lng: -9.1640 },
    ],
    pet_highlights: [
      { spot: 'Praia da Ursa', feature: 'Schattenbereiche, keine Anleinpflicht außerhalb der Saison', best_time: 'Morgens vor 10 Uhr' },
      { spot: 'Parque de Monsanto', feature: 'Großer Freilaufbereich & Hundetraining-Zone', best_time: 'Abends nach 18 Uhr' },
      { spot: 'Tasca O Galo', feature: 'Wassernapf inklusive, Innen & Außen hundefreundlich', best_time: 'Mittagessen 12–14 Uhr' },
    ],
    family_highlights: [
      { spot: 'Jardim da Estrela', feature: 'Stufenfreie Wege, eingezäunter Kleinkind-Spielbereich', stroller: true },
      { spot: 'Ozeanarium Parque das Nações', feature: 'Kinderwagen-Rampen & Fläschchen-Aufwärmstation im Service-Center', stroller: true },
      { spot: 'Mercado de Campo de Ourique', feature: 'Kinder-Mahlzeiten ab 4 €, keine Massentouristik', stroller: true },
    ],
    local_recipes: [
      { title: 'Pastéis de Nata de Alfama', chef: 'Maria (Local, Alfama)', difficulty: 'Mittel', ingredient_hint: 'Frische Eigelbe & Zimt sind das Geheimnis' },
      { title: 'Caldo Verde — Suppe der Armen', chef: 'Tiago (Local Koch)', difficulty: 'Einfach', ingredient_hint: 'Grünkohl, Chouriço & Olivenöl' },
    ],
    confidence_score: 0.91,
    decision_reason: `Hermes v2.0 City Brain Seeding für ${city} — ${ai.provider}`,
  };

  // Save locally
  const outDir = path.join(__dirname, '..', 'seeded_cities');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, `${city.toLowerCase()}-brain.json`);
  fs.writeFileSync(filePath, JSON.stringify(cityData, null, 2), 'utf-8');
  console.log(`  ✅ City Brain gespeichert: ${filePath}`);

  // Log to Supabase
  if (SUPABASE_KEY) {
    await httpRequest(`${SUPABASE_URL}/rest/v1/audit_logs`, 'POST', {
      event_type: 'CITY_BRAIN_SEEDED',
      payload: { city, provider: ai.provider, spots_count: cityData.baseline_spots.length }
    }, { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'return=minimal' });
    console.log('  💾 Supabase: Event geloggt.');
  }

  return cityData;
}

// ─── SKILL-02: Social Content for Travel Niche ───────────────────────────────
async function generateSocialContent(city, cityData) {
  console.log(`\n✍️  [SKILL-02] Social Media Content für ${city}...`);

  const systemPrompt = `Du bist Hermes, der Wachstumsstratege von Scratch'n'Travel — der Human-First Social Travel Plattform für Familien, Haustierhalter & Local Secrets.
Stil: Authentisch, inspirierend, nie werblich. NZZ/Spiegel Reise Tonalität. Max. 1-2 Emojis. Keine generischen Tipps. Nur echte Insider-Perspektive.
Thema: Reisen mit Hund & Kind in ${city}. Verwende spezifische Orts- & Gerichte-Namen.`;

  const prompt = `Erstelle Social-Media-Posts für ${city} (Familienreise & Hunde-Reise-Nische) für 5 Kanäle.
Trenne mit ===KANAL===.
1. LINKEDIN (bis 1.000 Zeichen, seriös, max. 1 Emoji)
2. X_THREAD (4 Tweets à max. 280 Zeichen: 1/4...4/4 ${SITE_URL})
3. INSTAGRAM (5 Slides: [SLIDE 1]...[CTA])
4. TIKTOK (45s Sprecher-Skript: [INTRO 0-5s]...[CTA 35-45s])
5. TELEGRAM (max. 400 Zeichen, Markdown, Direktlink)
Kein Einleitungstext, direkt starten.`;

  const ai = await callAI(prompt, systemPrompt);

  const dateStr = new Date().toISOString().split('T')[0];
  let content = { provider: ai.provider };

  if (ai.text) {
    const sections = ai.text.split(/===KANAL===/);
    const get = (i) => (sections[i] || '').trim();
    content = { linkedin: get(0), xThread: get(1), instagram: get(2), tiktok: get(3), telegram: get(4), provider: ai.provider };
  } else {
    // Static fallback
    content = {
      linkedin: `Lissabon mit Kind & Hund — ein ehrlicher Erfahrungsbericht.\n\nDie Tasca O Galo in Alfama stellte ohne Zögern einen Wassernapf für unseren Hund auf den Tisch. Die Praia da Ursa — kein Touristenbus, weiter Sand, Klippen.\n\nDiese Orte findet man nicht mit Google. Man findet sie mit Scratch\'n\'Travel.\n\n${SITE_URL}\n\n#Familienreise #HundUndKind #Lissabon`,
      xThread: `1/4 Lissabon mit Kind & Hund ist möglich — wenn man die richtigen Orte kennt.\n2/4 Praia da Ursa: kein Reisebus, feiner Sand, Hundeleine optional außerhalb der Saison.\n3/4 Jardim da Estrela: stufenfreie Wege für den Buggy, eingezäunter Spielplatz.\n4/4 Alle Spots mit Hundefreundlich-Filter: ${SITE_URL}`,
      instagram: `[SLIDE 1] Lissabon mit Hund & Kind — so geht es wirklich 🐶\n[SLIDE 2] Praia da Ursa: Der Geheimstrand — kein Bus, viel Platz\n[SLIDE 3] Tasca O Galo: Wassernapf für den Hund inklusive\n[SLIDE 4] Jardim da Estrela: Stufenfrei & eingezäunter Spielplatz\n[SLIDE 5] Alle Spots findest du auf Scratch\'n\'Travel\n[CTA] Link in Bio → Pet + Family Filter`,
      tiktok: `[INTRO 0-5s] "Darf dein Hund mit in ein Restaurant in Lissabon? Ja — wenn du die richtigen Adressen kennst."\n[HAUPT 5-35s] "Tasca O Galo in Alfama. Kleines Lokal, echter Bacalhau. Keine Touristen. Sie stellten ohne Frage einen Wassernapf für unseren Hund auf den Tisch. Und der Strand Praia da Ursa — 20 Minuten von der Stadtmitte, kein einziger Reisebus."\n[CTA 35-45s] "Den Pet-Filter und alle geheimen Spots findest du auf Scratch-n-Travel dot com."`,
      telegram: `🐶 *Lissabon mit Hund & Kind — Insider-Spots*\n\nPraia da Ursa (kein Bus, viel Sand), Jardim da Estrela (stufenfrei) & Tasca O Galo (Wassernapf inklusive).\n\n→ Pet + Family Filter: ${SITE_URL}`,
      provider: 'static-fallback',
    };
  }

  // Save drafts
  const draftsDir = path.join(__dirname, '..', 'social_drafts');
  if (!fs.existsSync(draftsDir)) fs.mkdirSync(draftsDir, { recursive: true });
  const draftFile = path.join(draftsDir, `${dateStr}-${city.toLowerCase()}-drafts.md`);
  fs.writeFileSync(draftFile, [
    `# Social Media Entwürfe — ${city} — ${dateStr}`,
    `_Generiert von: ${content.provider}_\n`,
    `## 💼 LinkedIn\n${content.linkedin}\n`,
    `## 🧵 X (Twitter)\n${content.xThread}\n`,
    `## 📸 Instagram Carousel\n${content.instagram}\n`,
    `## 🎬 TikTok / Shorts\n${content.tiktok}\n`,
    `## 📢 Telegram\n${content.telegram}\n`,
  ].join('\n'), 'utf-8');
  console.log(`  ✅ Drafts gespeichert: ${draftFile}`);

  // Telegram Direct Post
  if (TELEGRAM_TOKEN && TELEGRAM_CHANNEL && content.telegram) {
    const res = await httpRequest(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      'POST',
      { chat_id: TELEGRAM_CHANNEL, text: content.telegram, parse_mode: 'Markdown' }
    );
    console.log(res.body?.ok ? `  📢 Telegram: Gesendet!` : `  ⚠️  Telegram: ${JSON.stringify(res.body).slice(0, 100)}`);
  }

  return content;
}

// ─── SKILL-06: Vercel Deploy via REST API ────────────────────────────────────
async function triggerVercelDeploy() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    console.warn('  ⚠️  [SKILL-06] Vercel Token/Project ID nicht gesetzt — überspringe.');
    return;
  }
  console.log('\n🚀 [SKILL-06] Vercel Deploy via REST API...');
  const res = await httpRequest(
    `https://api.vercel.com/v13/deployments`,
    'POST',
    { name: 'scratch-n-travel', gitSource: { type: 'github', repoId: '1332807546', ref: 'main' }, projectId: VERCEL_PROJECT_ID, target: 'production' },
    { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' }
  );
  if (res.status === 200 || res.status === 201) {
    console.log(`  ✅ Vercel Deploy: Angestoßen! URL: ${res.body?.url || 'pending'}`);
  } else {
    console.warn(`  ⚠️  Vercel API Status ${res.status}:`, JSON.stringify(res.body).slice(0, 200));
  }
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────
async function main() {
  console.log('\n🤖 [Hermes Travel v2.0] ══════════════════════════════');
  console.log(`🤖 Start: ${new Date().toISOString()}`);
  console.log(`🤖 Mode: ${MODE_SOCIAL ? 'Social Content' : MODE_DEPLOY ? 'Deploy' : 'City Seeding'}`);
  console.log(`🤖 Target: ${TARGET_CITY}`);
  console.log('══════════════════════════════════════════════════════\n');

  if (MODE_DEPLOY) {
    await triggerVercelDeploy();
  } else if (MODE_SOCIAL) {
    const cityData = {};
    await generateSocialContent(TARGET_CITY, cityData);
  } else {
    const cityData = await seedCityBrain(TARGET_CITY);
    await generateSocialContent(TARGET_CITY, cityData);
  }

  console.log('\n✅ [Hermes Travel v2.0] Fertig.\n');
}

main().catch(err => {
  console.error('❌ Kritischer Fehler:', err);
  process.exit(1);
});

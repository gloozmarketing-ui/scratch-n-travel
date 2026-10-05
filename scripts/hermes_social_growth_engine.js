/**
 * Hermes Autonomous Social Growth & Ads Engine v1.0 — Scratch'n'Travel
 * 
 * Generiert für jeden Secret Spot vollautomatisierte, hochkonvertierende Social-Media-
 * und Werbe-Assets für 5 Kanäle:
 * 1. Instagram Carousel (5 Slides + Aesthetic Prompts + Captions)
 * 2. TikTok / Instagram Reels (30-45s Viral Video Script mit B-Roll Regieanweisungen)
 * 3. X (Twitter) 4-Teiliger Entdecker-Thread
 * 4. Pinterest Viral Pin & SEO Description
 * 5. Meta (Facebook/Instagram) & Google Ads Performance-Werbetexte
 * 
 * Archivierung:
 * - Speicherung im Archiv 'social_campaigns/campaign_{date}_{spotId}.json'
 * - Kein automatischer Versand mehr (SNT-401): Webhook- und Telegram-Dispatch
 *   wurden entfernt, weil Fuenf-Kanal-Broadcast ohne Community kein Ergebnis
 *   erzeugt — s. TODOLIST „Falsche Todos".
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Lade .env falls vorhanden
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, 'utf8');
  envText.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const DATA_TS_PATH = path.join(__dirname, '..', 'verschiedene webseit versionen', '04.09.2026', 'src', 'data', 'data.ts');
const ARCHIVE_DIR = path.join(__dirname, '..', 'social_campaigns');

function httpRequest(urlStr, method = 'POST', headers = {}, bodyObj = null, timeoutMs = 25000) {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(urlStr);
      const isHttps = url.protocol === 'https:';
      const lib = isHttps ? https : http;
      const bodyData = bodyObj ? JSON.stringify(bodyObj) : null;

      const reqHeaders = {
        'Content-Type': 'application/json',
        'User-Agent': 'Hermes-Social-Growth/1.0',
        ...headers
      };
      if (bodyData) {
        reqHeaders['Content-Length'] = Buffer.byteLength(bodyData);
      }

      const req = lib.request(url, {
        method,
        headers: reqHeaders,
        timeout: timeoutMs
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          let parsed = null;
          try { parsed = JSON.parse(data); } catch (_) { parsed = data; }
          resolve({ status: res.statusCode, data: parsed });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout after ' + timeoutMs + 'ms'));
      });

      req.on('error', (err) => reject(err));

      if (bodyData) req.write(bodyData);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

// Multi-Provider LLM Caller
async function callAIEngine(prompt, systemPrompt) {
  // Provider 1: Requesty (Nemotron / Gemma 4)
  const reqKey = (process.env.REQUESTY_API_KEY || '').trim();
  if (reqKey) {
    try {
      const res = await httpRequest('https://router.requesty.ai/v1/chat/completions', 'POST', {
        'Authorization': 'Bearer ' + reqKey
      }, {
        model: 'nvidia/nemotron-3.5-lightning-30b-a3b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }, 20000);

      if (res.status === 200 && res.data?.choices?.[0]?.message?.content) {
        return { text: res.data.choices[0].message.content, provider: 'Requesty (Nemotron)' };
      }
    } catch (e) {
      console.log('⚠️ Requesty Fallback ausgelöst:', e.message);
    }
  }

  // Provider 2: Zenmux (GLM / Dots3)
  const zenKey = (process.env.ZENMUX_API_KEY || '').trim();
  if (zenKey) {
    try {
      const res = await httpRequest('https://zenmux.ai/api/v1/chat/completions', 'POST', {
        'Authorization': 'Bearer ' + zenKey
      }, {
        model: 'z-ai/glm-4.6v-flash-free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }, 20000);

      if (res.status === 200 && res.data?.choices?.[0]?.message?.content) {
        return { text: res.data.choices[0].message.content, provider: 'Zenmux (GLM)' };
      }
    } catch (e) {
      console.log('⚠️ Zenmux Fallback ausgelöst:', e.message);
    }
  }

  // Fallback: Deterministische Hermes Vorlage
  return {
    text: null,
    provider: 'Hermes Rule-Based Engine (Deterministic)'
  };
}

function extractSpotsFromDataTs() {
  const content = fs.readFileSync(DATA_TS_PATH, 'utf8');
  const startMarker = 'export const storyPins = [';
  const endMarker = 'export const tours = [';
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);
  const jsonPart = content.substring(startIdx + startMarker.length, content.lastIndexOf('];', endIdx));
  
  // Sicheres Regex-Parsing der Spots
  const spotBlocks = jsonPart.split(/\},\s*\{/);
  const spots = [];

  for (const block of spotBlocks) {
    const locMatch = block.match(/"location":\s*"([^"]+)"/);
    const countryMatch = block.match(/"country":\s*"([^"]+)"/);
    const storyMatch = block.match(/"story":\s*"([^"]+)"/);
    const foodMatch = block.match(/"localFood":\s*"([^"]+)"/);
    const gpsMatch = block.match(/"gps":\s*"([^"]+)"/);
    const idMatch = block.match(/"id":\s*(\d+)/);

    if (locMatch && storyMatch) {
      spots.push({
        id: idMatch ? parseInt(idMatch[1]) : spots.length + 1,
        location: locMatch[1],
        country: countryMatch ? countryMatch[1] : 'Europa',
        story: storyMatch[1],
        localFood: foodMatch ? foodMatch[1] : 'Lokale Spezialität',
        gps: gpsMatch ? gpsMatch[1] : 'GPS Koordinaten auf Scratch\'n\'Travel'
      });
    }
  }
  return spots;
}

function generateDeterministicCampaign(spot) {
  return {
    spotTitle: spot.location,
    country: spot.country,
    generatedAt: new Date().toISOString(),
    instagramCarousel: {
      slide1: {
        headline: spot.country ? ("Vergiss überlaufene Massenziele. Entdecke " + spot.location + " (" + spot.country + ") 🤫") : ("Vergiss überlaufene Touristen-Hotspots. Speicher dir " + spot.location + " 🤫"),
        visual: "Atemberaubende Drohnenaufnahme von " + spot.location + " bei Sonnenaufgang.",
        text: "Dieser Ort existiert wirklich, steht aber in keinem TUI-Katalog."
      },
      slide2: {
        headline: "Der geheime Vibe & die Story",
        visual: "Detailaufnahme der Natur und der versteckten Pfade.",
        text: spot.story
      },
      slide3: {
        headline: "Was Locals hier essen (Keine Touristenfalle!)",
        visual: "Dampfender Teller mit traditioneller Kulinarik auf einer urigen Holztafel.",
        text: "Traditionell: " + spot.localFood + ". Unbedingt in einer echten Tasca bestellen!"
      },
      slide4: {
        headline: "Sicherheit & Anreise-Tipp",
        visual: "Wanderpfad mit Wegmarkierung / Klippenaussicht.",
        text: "Festes Schuhwerk & Gezeiten beachten. Der GPS-Pin ist nicht ausgeschildert."
      },
      slide5: {
        headline: "Freischalten auf Scratch'n'Travel",
        visual: "Scratch'n'Travel App Map Screen mit freigeschaltetem Secret Pin.",
        text: "Exakte Koordinaten & Offline-Wanderroute jetzt kostenlos auf scratch-n-travel.vercel.app ansehen! 🌍"
      },
      caption: "Hör auf dahin zu reisen, wo alle hinreisen. 🌿\n\n" + spot.location + " (" + spot.country + ") ist einer dieser seltenen Orte, an denen die Zeit stillsteht.\n\n" + spot.story + "\n\n👉 Exakte GPS-Koordinaten (" + spot.gps + ") und die besten Insider-Tavernen findest du jetzt auf unserer interaktiven Karte auf Scratch'n'Travel (Link in Bio!).\n\n#scratchntravel #secretspots #hiddengems #" + spot.country.toLowerCase().replace(/\s+/g, '') + " #wanderlust #offthebeatentrack #reisenmachtglücklich #insidertipp",
    },
    tikTokReelsScript: {
      durationSeconds: "35s",
      hook: "[0-3s]: Zeige Nahaufnahme deiner Füße am Abgrund oder atemberaubende Aussicht. Text im Video: 'Wenn du diesen Ort in " + spot.country + " kennst, sag es bitte niemandem weiter...'",
      scene1: "[4-12s]: Schneller Kameraschwenk über " + spot.location + ". Voiceover: 'Wir sind 3 Stunden über Schotterpisten gefahren, um diesen Spot zu finden. Keine Reisebusse. Kein Eintritt. Nur pure Natur.'",
      scene2: "[13-22s]: Zeige traditionelles Essen (" + spot.localFood + ") in der Dorfschenke. Voiceover: 'Und das Essen der Einheimischen kostet hier noch 7 Euro und schmeckt wie bei Großmutter.'",
      scene3: "[23-35s]: Smartphone-Screen mit interaktiver Scratch'n'Travel Karte. Voiceover: 'Die genauen Koordinaten und die Sicherheitswarnung haben wir auf Scratch'n'Travel hinterlegt. Link in unserer Bio — speicher dir das Video, bevor es viral geht!'",
      soundRecommendation: "Spooky/Aesthetic Travel Ambient Sound (z.B. 'Interstellar Ambient' oder 'Solitude - M83')"
    },
    xTwitterThread: [
      "1/4 🧵 Vergiss die überlaufenen Hotspots. Dieser verborgene Ort in " + spot.country + " wird dir den Atem rauben — und 99% der Touristen laufen einfach daran vorbei 👇",
      "2/4 📍 Ort: " + spot.location + "\n\n" + spot.story + "\n\nWarum Locals diesen Ort lieben: Keine Absperrungen, absolute Ruhe und das Gefühl von echtem Entdeckergeist.",
      "3/4 🍲 Kulinarischer Geheimtipp:\nWer hierher kommt, MUSS " + spot.localFood + " probieren. Authentisch, regional und weit weg von überteuerten Touristen-Menüs.",
      "4/4 🗺️ Wir haben die verifizierten GPS-Koordinaten (" + spot.gps + ") und Sicherheits-Hinweise in die interaktive Scratch'n'Travel Karte eingepflegt.\n\nKostenlos freischalten & entdecken:\n👉 https://scratch-n-travel.vercel.app/stories\n\nRT, wenn du echte Abenteuer liebst! 🔁"
    ],
    pinterestPin: {
      pinTitle: "Der geheime Ort in " + spot.country + ", den kein Reiseführer nennt (" + spot.location + ")",
      pinDescription: "Suchst du nach echten Hidden Gems und Secret Spots abseits der Massen? Entdecke " + spot.location + " in " + spot.country + ". Inklusive authentischer lokaler Küche (" + spot.localFood + ") und verifizierter GPS-Koordinaten auf Scratch'n'Travel.",
      boardSuggestion: "Secret Travel Spots / Hidden Gems Europe & Worldwide"
    },
    metaAndGoogleAdsCopy: {
      angle: "Fernweh & Exklusivität (Anti-Massentourismus)",
      adHeadline: "Schluss mit Massentourismus. Entdecke echte Secret Spots.",
      primaryText: "Kennst du das Gefühl, im Urlaub nur noch zwischen Selfie-Sticks zu stehen? Scratch'n'Travel bringt den wahren Entdeckergeist zurück. Finde unberührte Natur, authentische Tavernen und versteckte Orte weltweit — von Einheimischen empfohlen und GPS-geprüft.",
      ctaButton: "Jetzt Secret Spots erkunden",
      targetUrl: "https://scratch-n-travel.vercel.app/stories",
      recommendedTargeting: ["Off the beaten path", "Solo Travel", "Backpacking", "Hidden Gems", "Hiking", "Ecotourism"]
    }
  };
}

async function generateCampaignForSpot(spotIndex = null) {
  const spots = extractSpotsFromDataTs();
  if (spots.length === 0) {
    throw new Error('Keine Spots in data.ts gefunden');
  }

  // Wähle Spot: entweder bestimmter Index oder zufällig / neuester
  const selectedSpot = spotIndex !== null && spots[spotIndex] 
    ? spots[spotIndex] 
    : spots[Math.floor(Math.random() * spots.length)];

  console.log('🎯 Gewählter Spot für Kampagne:', selectedSpot.location, '(' + selectedSpot.country + ')');

  // Versuche dynamische KI-Anreicherung oder nutze deterministische Vorlage
  const systemPrompt = "Du bist Hermes, der autonome Growth- & Performance-Marketing-Director von Scratch'n'Travel. Du erstellst virale Social-Media-Kampagnen (Instagram Carousel, TikTok Script, Twitter Thread, Pinterest, Meta Ads) mit hoher emotionaler Durchschlagskraft und klarem Call-To-Action.";
  const prompt = "Erstelle für den Secret Spot '" + selectedSpot.location + "' in " + selectedSpot.country + " (" + selectedSpot.story + ", Essen: " + selectedSpot.localFood + ") eine virale Social-Media-Kampagne mit extrem hohem Viralitätspotenzial.";

  const aiResult = await callAIEngine(prompt, systemPrompt);
  console.log('🤖 Verwendete AI-Engine:', aiResult.provider);

  const campaign = generateDeterministicCampaign(selectedSpot);
  campaign.aiProvider = aiResult.provider;
  if (aiResult.text) {
    campaign.aiCustomNotes = aiResult.text.substring(0, 500) + '...';
  }

  // Speichere Kampagne im Archiv
  if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  }
  const filename = 'campaign_' + new Date().toISOString().slice(0, 10) + '_spot_' + selectedSpot.id + '.json';
  const filePath = path.join(ARCHIVE_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(campaign, null, 2), 'utf8');
  console.log('💾 Kampagne archiviert unter:', filePath);

  // SNT-401: Dispatch entfernt.
  // Frueher wurde jede Kampagne an ein Webhook und an Telegram gebroadcastet
  // (GROWTH_WEBHOOK_URL, TELEGRAM_BOT_TOKEN). Fuenf Kanaele ohne Community sind
  // fuenf Kanaele ohne Ergebnis — siehe TODOLIST "Falsche Todos". Die Kampagne
  // wird nur noch archiviert; Verteilung passiert kuenftig von Hand.
  // Die Env-Variablen werden bewusst NICHT mehr ausgewertet, auch wenn sie
  // in den Secrets noch stehen.

  return campaign;
}

if (require.main === module) {
  generateCampaignForSpot().then(c => {
    console.log('\n🚀 Kampagne erfolgreich erstellt für:', c.spotTitle);
    console.log('📸 Instagram Caption Vorschau:\n' + c.instagramCarousel.caption.slice(0, 200) + '...');
  }).catch(err => {
    console.error('Fehler:', err);
    process.exit(1);
  });
}

module.exports = { generateCampaignForSpot, extractSpotsFromDataTs, generateDeterministicCampaign };

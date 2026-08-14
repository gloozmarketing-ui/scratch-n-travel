/**
 * Scratch'n'Travel — Automated Stripe Products & Pricing Setup Script
 * 
 * Run this script once your Stripe Account & Gewerbe are ready:
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe_create_products.js
 * 
 * What it creates:
 *   1. Product: "Scratch'n'Travel Family & Pet Pro" — 7,99 € / Month
 *   2. Product: "Scratch'n'Travel Local Host / Business" — 29,00 € / Month
 */

const https = require('https');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

if (!STRIPE_SECRET_KEY) {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('⚠️  HINWEIS: Noch kein STRIPE_SECRET_KEY gesetzt.');
  console.log('Da noch kein Gewerbe angemeldet ist, läuft das System standardmäßig');
  console.log('im sicheren BETA-MODUS (Preise verborgen / 0 € Early Access).');
  console.log('');
  console.log('Sobald dein Gewerbe & Stripe-Konto aktiv sind, führe aus:');
  console.log('  $env:STRIPE_SECRET_KEY="sk_live_..." ; node scripts/stripe_create_products.js');
  console.log('════════════════════════════════════════════════════════════════════');
  process.exit(0);
}

function stripePost(path, postData) {
  return new Promise((resolve, reject) => {
    const payload = new URLSearchParams(postData).toString();
    const req = https.request({
      hostname: 'api.stripe.com',
      port: 443,
      path: `/v1/${path}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🚀 Erstelle Scratch\'n\'Travel Stripe Produkte & Preise...\n');

  // 1. Pro Family & Pet Plan
  console.log('1. Erstelle "Family & Pet Pro" (7,99 € / Monat)...');
  const proProd = await stripePost('products', {
    name: 'Scratch\'n\'Travel — Family & Pet Pro',
    description: 'Unbegrenzte Secret Spots, KI Concierge, Hobby Matching & Digital Scratchbook PDF',
    'metadata[tier]': 'pro_family'
  });

  const proPrice = await stripePost('prices', {
    product: proProd.id,
    unit_amount: '799', // 7.99 EUR
    currency: 'eur',
    'recurring[interval]': 'month',
    'metadata[plan]': 'pro_monthly'
  });
  console.log(`   ✅ Pro Produkt-ID: ${proProd.id}`);
  console.log(`   ✅ Pro Price-ID:   ${proPrice.id}\n`);

  // 2. Business Host Plan
  console.log('2. Erstelle "Local Host / Business" (29,00 € / Monat)...');
  const bizProd = await stripePost('products', {
    name: 'Scratch\'n\'Travel — Local Host / Business',
    description: 'Hervorgehobenes Profil für Ferienhäuser, B&Bs & Cafés mit Verifizierungs-Badge',
    'metadata[tier]': 'host_business'
  });

  const bizPrice = await stripePost('prices', {
    product: bizProd.id,
    unit_amount: '2900', // 29.00 EUR
    currency: 'eur',
    'recurring[interval]': 'month',
    'metadata[plan]': 'biz_monthly'
  });
  console.log(`   ✅ Business Produkt-ID: ${bizProd.id}`);
  console.log(`   ✅ Business Price-ID:   ${bizPrice.id}\n`);

  console.log('🎉 Fertig! Trage diese Price-IDs in assets/js/stripe-config.js ein:');
  console.log(`   price_1P_pro_monthly: '${proPrice.id}'`);
  console.log(`   price_1P_biz_monthly: '${bizPrice.id}'`);
}

main().catch(console.error);
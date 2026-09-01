/**
 * Serverless Endpoint: /api/create-checkout-session
 * Erstellt eine offizielle, steuerkonforme Stripe Checkout Session mit:
 * - Stripe Tax (automatic_tax: true)
 * - USt-IdNr. Erfassung für B2B Reverse Charge (tax_id_collection: true)
 * - Pflicht-Rechnungsadresse für korrekte MwSt.-Zuordnung nach EU-Recht
 * - Promotion Codes & Gutscheine
 */

'use strict';

const https = require('https');
const querystring = require('querystring');

const STRIPE_SECRET_KEY = (process.env.STRIPE_SECRET_KEY || '').trim();

function stripePost(endpoint, data) {
  return new Promise((resolve, reject) => {
    const dataString = querystring.stringify(data);
    const options = {
      hostname: 'api.stripe.com',
      port: 443,
      path: '/v1' + endpoint,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + STRIPE_SECRET_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(dataString)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject({ statusCode: res.statusCode, error: parsed.error || body });
          }
        } catch (e) {
          reject({ statusCode: res.statusCode, error: body });
        }
      });
    });

    req.on('error', e => reject(e));
    req.write(dataString);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, customerEmail, successUrl, cancelUrl } = req.body || {};

    if (!priceId) {
      return res.status(400).json({ error: 'Missing priceId parameter' });
    }

    if (!STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe Secret Key is not configured on server' });
    }

    const origin = req.headers.origin || 'https://kontolage.de';

    const sessionData = {
      mode: 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': 1,
      'automatic_tax[enabled]': 'true',
      'tax_id_collection[enabled]': 'true', // Erlaubt EU B2B-Kunden die Eingabe der USt-IdNr. (Reverse Charge)
      'billing_address_collection': 'required', // Erforderlich für steuerrechtlich saubere Rechnungen
      'allow_promotion_codes': 'true',
      success_url: successUrl || `${origin}/?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: cancelUrl || `${origin}/#preise`
    };

    if (customerEmail) {
      sessionData['customer_email'] = customerEmail;
    }

    const session = await stripePost('/checkout/sessions', sessionData);

    return res.status(200).json({
      url: session.url,
      sessionId: session.id
    });

  } catch (err) {
    console.error('Stripe Checkout Session Error:', err);
    return res.status(500).json({
      error: 'Failed to create Stripe Checkout Session',
      details: err.error?.message || err.message || err
    });
  }
};

/**
 * Serverless Endpoint: /api/create-merch-checkout-session
 * Erstellt eine Stripe Checkout Session fuer Merch-Einmalkauf
 * mode: 'payment' - kein Abo!
 *
 * Unterstuetzt:
 * - Mehrere Artikel + Groessen in einem Checkout
 * - Shipping Address Collection (fuer POD Fulfillment)
 * - Stripe Tax (automatic_tax: true)
 * - Klarna / Apple Pay / Google Pay
 *
 * Nach erfolgreicher Zahlung: Webhook => Printify Order automatisch
 */

'use strict';

const https = require('https');
const querystring = require('querystring');

const STRIPE_SECRET_KEY = (process.env.STRIPE_SECRET_KEY || '').trim();

// Erlaubte Price-IDs (Stripe Live Merch Catalog)
const ALLOWED_MERCH_PRICES = new Set([
  'price_1UA6SlPoNfLOPXfNLDhPeYJu', // Badge Patch 14,99 EUR
  'price_1UA6SmPoNfLOPXfN606TubEM', // Scratch Map A2 34,99 EUR
  'price_1UA6SnPoNfLOPXfNjW7wVjdA', // Passport Booklet 24,99 EUR
  'price_1UA6SoPoNfLOPXfN6KfnNkYU', // T-Shirt 29,99 EUR
  'price_1UA6SpPoNfLOPXfNbenQSVPl', // Canvas Bag 22,99 EUR
]);

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
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
          else reject({ statusCode: res.statusCode, error: parsed.error || body });
        } catch (e) { reject({ statusCode: res.statusCode, error: body }); }
      });
    });
    req.on('error', e => reject(e));
    req.write(dataString);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, customerEmail, badgeId, size, successUrl, cancelUrl } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid items array' });
    }

    if (!STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe Secret Key not configured' });
    }

    // Validate all price IDs against whitelist
    for (const item of items) {
      if (!ALLOWED_MERCH_PRICES.has(item.priceId)) {
        return res.status(400).json({ error: `Invalid price ID: ${item.priceId}` });
      }
      if (!item.quantity || item.quantity < 1 || item.quantity > 10) {
        return res.status(400).json({ error: 'Invalid quantity (1-10)' });
      }
    }

    const origin = req.headers.origin || 'https://scratch-n-travel.vercel.app';

    // Build line_items for all items
    const sessionData = {
      mode: 'payment', // ONE-TIME payment, no subscription!
      'automatic_tax[enabled]': 'true',
      'billing_address_collection': 'required',
      'shipping_address_collection[allowed_countries][0]': 'DE',
      'shipping_address_collection[allowed_countries][1]': 'AT',
      'shipping_address_collection[allowed_countries][2]': 'CH',
      'shipping_address_collection[allowed_countries][3]': 'NL',
      'shipping_address_collection[allowed_countries][4]': 'BE',
      'shipping_address_collection[allowed_countries][5]': 'FR',
      'shipping_address_collection[allowed_countries][6]': 'IT',
      'shipping_address_collection[allowed_countries][7]': 'ES',
      'shipping_address_collection[allowed_countries][8]': 'PT',
      'allow_promotion_codes': 'true',

      // Real Shipping Options calculated by Stripe
      'shipping_options[0][shipping_rate_data][type]': 'fixed_amount',
      'shipping_options[0][shipping_rate_data][fixed_amount][amount]': '390',
      'shipping_options[0][shipping_rate_data][fixed_amount][currency]': 'eur',
      'shipping_options[0][shipping_rate_data][display_name]': 'Standard Versand (Klimaneutral & Tracking)',
      'shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]': 'business_day',
      'shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]': '3',
      'shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]': 'business_day',
      'shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]': '5',

      'shipping_options[1][shipping_rate_data][type]': 'fixed_amount',
      'shipping_options[1][shipping_rate_data][fixed_amount][amount]': '790',
      'shipping_options[1][shipping_rate_data][fixed_amount][currency]': 'eur',
      'shipping_options[1][shipping_rate_data][display_name]': 'Express Kurier (Prio-Fertigung & Versand)',
      'shipping_options[1][shipping_rate_data][delivery_estimate][minimum][unit]': 'business_day',
      'shipping_options[1][shipping_rate_data][delivery_estimate][minimum][value]': '1',
      'shipping_options[1][shipping_rate_data][delivery_estimate][maximum][unit]': 'business_day',
      'shipping_options[1][shipping_rate_data][delivery_estimate][maximum][value]': '2',
      success_url: successUrl || `${origin}/app.html?merch=success&session={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/app.html#merch`
    };

    // Add line items
    items.forEach((item, i) => {
      sessionData[`line_items[${i}][price]`] = item.priceId;
      sessionData[`line_items[${i}][quantity]`] = item.quantity || 1;
    });

    // Add metadata for webhook (Printify order creation)
    if (customerEmail) sessionData['customer_email'] = customerEmail;
    if (badgeId) sessionData['metadata[badge_id]'] = badgeId;
    if (size) sessionData['metadata[size]'] = size;
    sessionData['metadata[type]'] = 'merch_order';
    sessionData['metadata[platform]'] = 'scratch_n_travel';

    const session = await stripePost('/checkout/sessions', sessionData);

    return res.status(200).json({
      url: session.url,
      sessionId: session.id
    });

  } catch (err) {
    console.error('Merch Checkout Session Error:', err);
    return res.status(500).json({
      error: 'Failed to create Merch Checkout Session',
      details: err.error?.message || err.message || String(err)
    });
  }
};

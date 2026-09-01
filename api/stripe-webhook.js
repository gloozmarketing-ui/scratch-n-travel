/**
 * Scratch'n'Travel + Kontenlage — Unified Stripe Webhook Handler
 *
 * Events handled:
 *  - checkout.session.completed (Subscriptions + Merch orders)
 *  - customer.subscription.updated
 *  - customer.subscription.deleted
 *  - invoice.payment_succeeded
 *  - invoice.payment_failed
 *
 * On merch order completed:
 *  => Calls Printify API to auto-place the POD order
 *
 * Required ENV Vars:
 *  STRIPE_SECRET_KEY       — Stripe Restricted Live Key
 *  STRIPE_WEBHOOK_SECRET   — from Stripe Dashboard > Webhooks
 *  PRINTIFY_API_KEY        — from Printify Settings > API
 *  PRINTIFY_SHOP_ID        — your Printify shop ID
 *  SUPABASE_URL            — optional, for updating DB records
 *  SUPABASE_SERVICE_KEY    — optional, service role key
 */

'use strict';

const https = require('https');
const crypto = require('crypto');

// ─── Config ──────────────────────────────────────────────────────────────────
const STRIPE_SECRET     = (process.env.STRIPE_SECRET_KEY || '').trim();
const WEBHOOK_SECRET    = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
const PRINTIFY_KEY      = (process.env.PRINTIFY_API_KEY || '').trim();
const PRINTIFY_SHOP_ID  = (process.env.PRINTIFY_SHOP_ID || '').trim();
const SUPABASE_URL      = (process.env.SUPABASE_URL || '').trim();
const SUPABASE_KEY      = (process.env.SUPABASE_SERVICE_KEY || '').trim();

// Printify Blueprint + Variant mapping
// These IDs come from Printify's product catalog (you set up the products in Printify once,
// then paste the blueprint_id + print_provider_id here)
const PRINTIFY_PRODUCT_MAP = {
  'price_1UA6SlPoNfLOPXfNLDhPeYJu': {
    type: 'badge_patch',
    blueprint_id: 3,     // Iron-On Patch (placeholder — update after Printify setup)
    print_provider_id: 9, // SwiftPOD EU
    variant_id: 24567,   // 75mm Circular default (placeholder)
    label: 'Travel Badge Patch'
  },
  'price_1UA6SmPoNfLOPXfN606TubEM': {
    type: 'scratch_map',
    blueprint_id: 446,   // Poster A2 Matte (placeholder)
    print_provider_id: 9,
    variant_id: 67890,
    label: 'Scratch-Off World Map A2'
  },
  'price_1UA6SnPoNfLOPXfNjW7wVjdA': {
    type: 'passport_booklet',
    blueprint_id: 237,   // Softcover Notebook A5 (placeholder)
    print_provider_id: 9,
    variant_id: 45612,
    label: 'Luxury Travel Passport A5'
  },
  'price_1UA6SoPoNfLOPXfN6KfnNkYU': {
    type: 'tshirt',
    blueprint_id: 12,    // Unisex Staple T-Shirt (Bella+Canvas or Gildan)
    print_provider_id: 9,
    // Variant is size-dependent — set dynamically from metadata
    variant_id: null,
    label: 'Local Legend T-Shirt'
  },
  'price_1UA6SpPoNfLOPXfNbenQSVPl': {
    type: 'canvas_bag',
    blueprint_id: 77,    // Canvas Tote Bag
    print_provider_id: 9,
    variant_id: 12233,
    label: 'Travel Canvas Bag'
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function verifyStripeSignature(rawBody, sigHeader, secret) {
  if (!secret || !sigHeader) return false;
  try {
    const parts = {};
    sigHeader.split(',').forEach(p => { const [k, v] = p.split('='); parts[k] = v; });
    const ts = parts['t'];
    const sig = parts['v1'];
    if (!ts || !sig) return false;

    const signed = `${ts}.${rawBody}`;
    const expected = crypto.createHmac('sha256', secret).update(signed, 'utf8').digest('hex');
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch (e) {
    console.error('Signature verification error:', e);
    return false;
  }
}

function httpsRequest(opts, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

// ─── Printify Order Creation ─────────────────────────────────────────────────
async function createPrintifyOrder(session) {
  if (!PRINTIFY_KEY || !PRINTIFY_SHOP_ID) {
    console.log('[Printify] API key or shop ID not configured — skipping order creation');
    return { skipped: true, reason: 'No Printify key configured' };
  }

  const meta   = session.metadata || {};
  const ship   = session.shipping_details || {};
  const addr   = ship.address || {};

  const lineItems = session.line_items?.data || [];
  if (lineItems.length === 0) {
    console.log('[Printify] No line items found in session');
    return { skipped: true, reason: 'No line items' };
  }

  const printifyLineItems = [];
  for (const item of lineItems) {
    const priceId = item.price?.id;
    const product = PRINTIFY_PRODUCT_MAP[priceId];
    if (!product) {
      console.log(`[Printify] No mapping for price ${priceId} — skipping item`);
      continue;
    }

    let variantId = product.variant_id;
    // If T-Shirt, map size from metadata
    if (product.type === 'tshirt' && meta.size) {
      const SIZE_VARIANTS = { 'XS': 24560, 'S': 24561, 'M': 24562, 'L': 24563, 'XL': 24564, 'XXL': 24565 };
      variantId = SIZE_VARIANTS[meta.size] || 24562;
    }

    if (!variantId) {
      console.warn(`[Printify] No variant ID for ${product.label}`);
      continue;
    }

    printifyLineItems.push({
      product_id: product.blueprint_id, // NOTE: replace with actual Printify product_id after setup
      variant_id: variantId,
      quantity: item.quantity
    });
  }

  if (printifyLineItems.length === 0) {
    return { skipped: true, reason: 'No valid Printify items' };
  }

  const orderPayload = {
    external_id: session.id,
    label: `SNT-${session.id.slice(-8).toUpperCase()}`,
    line_items: printifyLineItems,
    shipping_method: 1, // Standard
    is_printify_express: false,
    send_shipping_notification: true,
    address_to: {
      first_name: (ship.name || session.customer_details?.name || 'Guest').split(' ')[0],
      last_name: (ship.name || session.customer_details?.name || 'Customer').split(' ').slice(1).join(' ') || '-',
      email: session.customer_email || session.customer_details?.email || '',
      phone: session.customer_details?.phone || '',
      country: addr.country || 'DE',
      region: addr.state || '',
      address1: addr.line1 || '',
      address2: addr.line2 || '',
      city: addr.city || '',
      zip: addr.postal_code || ''
    }
  };

  console.log('[Printify] Creating order:', JSON.stringify(orderPayload, null, 2));

  const result = await httpsRequest({
    hostname: 'api.printify.com',
    port: 443,
    path: `/v1/shops/${PRINTIFY_SHOP_ID}/orders.json`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PRINTIFY_KEY}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ScratchNTravel/1.0'
    }
  }, orderPayload);

  if (result.status >= 200 && result.status < 300) {
    console.log('[Printify] ✅ Order created:', result.body.id);
    return { success: true, orderId: result.body.id };
  } else {
    console.error('[Printify] ❌ Order creation failed:', result.status, result.body);
    return { error: true, status: result.status, body: result.body };
  }
}

// ─── Supabase Update ─────────────────────────────────────────────────────────
async function updateSupabase(table, match, data) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  try {
    const matchStr = Object.entries(match).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
    await httpsRequest({
      hostname: new URL(SUPABASE_URL).hostname,
      port: 443,
      path: `/rest/v1/${table}?${matchStr}`,
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }, data);
    console.log(`[Supabase] Updated ${table}`);
  } catch (e) {
    console.error('[Supabase] Update error:', e.message);
  }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  // Collect raw body for signature verification
  const rawBody = await new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
  });

  // Verify Stripe Signature (only when secret is configured)
  if (WEBHOOK_SECRET) {
    const sig = req.headers['stripe-signature'];
    if (!verifyStripeSignature(rawBody, sig, WEBHOOK_SECRET)) {
      console.error('[Webhook] Invalid signature!');
      return res.status(401).send('Invalid signature');
    }
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (e) {
    return res.status(400).send('Invalid JSON');
  }

  console.log(`[Webhook] Event: ${event.type} | ID: ${event.id}`);

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object;
        const meta = session.metadata || {};

        // ──── MERCH ORDER ────
        if (meta.type === 'merch_order' && meta.platform === 'scratch_n_travel') {
          console.log('[Webhook] Merch order completed — triggering Printify fulfillment');

          // Need to expand line_items (they're not included by default)
          // In production: fetch expanded session from Stripe API
          const printifyResult = await createPrintifyOrder(session);
          console.log('[Webhook] Printify result:', printifyResult);

          // Update order in Supabase if configured
          if (session.customer_email) {
            await updateSupabase('merch_orders', { stripe_session_id: session.id }, {
              status: 'paid',
              printify_order_id: printifyResult.orderId || null,
              paid_at: new Date().toISOString()
            });
          }
        }

        // ──── SUBSCRIPTION ────
        if (session.mode === 'subscription') {
          console.log('[Webhook] Subscription activated:', session.subscription);
          await updateSupabase('profiles', { email: session.customer_email }, {
            subscription_status: 'active',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            updated_at: new Date().toISOString()
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        console.log('[Webhook] Subscription updated:', sub.id, 'Status:', sub.status);
        await updateSupabase('profiles', { stripe_subscription_id: sub.id }, {
          subscription_status: sub.status,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        console.log('[Webhook] Subscription cancelled:', sub.id);
        await updateSupabase('profiles', { stripe_subscription_id: sub.id }, {
          subscription_status: 'cancelled',
          subscription_tier: 'free',
          updated_at: new Date().toISOString()
        });
        break;
      }

      case 'invoice.payment_failed': {
        const inv = event.data.object;
        console.log('[Webhook] Payment failed for customer:', inv.customer_email);
        await updateSupabase('profiles', { stripe_customer_id: inv.customer }, {
          subscription_status: 'past_due',
          updated_at: new Date().toISOString()
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        console.log('[Webhook] Invoice paid:', event.data.object.id);
        break;
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }
  } catch (err) {
    console.error('[Webhook] Handler error:', err);
    return res.status(500).send('Internal error');
  }

  return res.status(200).json({ received: true });
};

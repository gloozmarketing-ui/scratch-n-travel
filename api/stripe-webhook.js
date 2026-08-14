/**
 * Scratch'n'Travel — Stripe Webhook Endpoint (Serverless / Vercel API)
 * Syncs Stripe subscription changes with Supabase profiles & audit_logs
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://acgfcjcikjlrlfilqdyk.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

function logToSupabase(eventType, payload) {
  if (!SUPABASE_KEY) return;
  const data = JSON.stringify({
    event_type: eventType,
    payload: { ...payload, timestamp: new Date().toISOString() }
  });

  const parsed = new URL(SUPABASE_URL);
  const req = https.request({
    hostname: parsed.hostname,
    port: 443,
    path: '/rest/v1/audit_logs',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
      'Content-Length': Buffer.byteLength(data)
    }
  });
  req.write(data);
  req.end();
}

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle Events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const planId = session.metadata?.planId || 'pro_family';
      const email = session.customer_details?.email;
      console.log(`✅ Subscription abgeschlossen für ${email}: Tier ${planId}`);
      logToSupabase('SUBSCRIPTION_CREATED', { email, planId, customerId: session.customer });
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      console.log(`⚠️ Subscription gekündigt für Kunde ${sub.customer}`);
      logToSupabase('SUBSCRIPTION_CANCELED', { customerId: sub.customer });
      break;
    }
    default:
      console.log(`ℹ️ Unhandled Stripe event: ${event.type}`);
  }

  return res.status(200).json({ received: true });
};
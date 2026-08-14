/**
 * Scratch'n'Travel — Stripe Checkout Session Endpoint (Serverless / Vercel API)
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, planId, customerEmail } = req.body;
  const siteUrl = process.env.SITE_URL || 'https://gloozmarketing-ui.github.io/scratch-n-travel';

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(200).json({
      status: 'beta_mode',
      message: 'System ist im sicheren Beta-Modus (0 € Early Access). Kein Live-Key erforderlich.',
      url: `${siteUrl}/app.html?beta_vip=true&tier=${planId}`
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', 'sepa_debit'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      customer_email: customerEmail || undefined,
      success_url: `${siteUrl}/app.html?session_id={CHECKOUT_SESSION_ID}&tier=${planId}&status=success`,
      cancel_url: `${siteUrl}/index.html#preise`,
      metadata: { planId }
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
/**
 * Scratch'n'Travel — Stripe Checkout Session Endpoint (Serverless / Vercel API)
 */
// Lazy-Require: `stripe` ist (noch) nicht in den dependencies. Ein require()
// auf Modul-Ebene haette die Function beim Laden crashten lassen -> 500 auf
// JEDEM Request. Jetzt erst laden, wenn gebraucht; fehlendes Paket wird wie
// fehlender Key behandelt (Beta-Modus-Fallback unten).
function getStripeClient() {
  try {
    const stripeFactory = require('stripe');
    return stripeFactory(process.env.STRIPE_SECRET_KEY);
  } catch (err) {
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, planId, customerEmail } = req.body;
  const siteUrl = process.env.SITE_URL || 'https://scratchntravel.com';

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(200).json({
      status: 'beta_mode',
      message: 'System ist im sicheren Beta-Modus (0 € Early Access). Kein Live-Key erforderlich.',
      url: `${siteUrl}/passport?beta_vip=true&tier=${planId}`
    });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return res.status(503).json({
      error: 'Stripe SDK nicht installiert. Beta-Modus aktiv (0 €).'
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', 'sepa_debit'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      customer_email: customerEmail || undefined,
      // /app.html existiert im Vite-Build nicht — nach dem Kauf
      // wuerde der Kunde auf einer 404-Seite landen.
      success_url: `${siteUrl}/passport?session_id={CHECKOUT_SESSION_ID}&tier=${planId}&status=success`,
      cancel_url: `${siteUrl}/index.html#preise`,
      metadata: { planId }
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
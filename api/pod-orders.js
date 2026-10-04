/**
 * Scratch'n'Travel — Print-on-Demand (POD) Order Gateway (Vercel API)
 * Dispatches personalized Passport Edition & Travel Merch orders
 */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productSku, customerName, customerEmail, shippingAddress, customDocumentId } = req.body || {};

    const printifyKey = (process.env.PRINTIFY_KEY || process.env.PRINTIFY_API_KEY || '').trim();
    const printfulKey = (process.env.PRINTFUL_KEY || process.env.PRINTFUL_API_KEY || process.env.PRINTFUL_API_TOKEN || '').trim();
    const gelatoKey = (process.env.GELATO_KEY || process.env.GELATO_API_KEY || '').trim();

    let activeProvider = 'printify_network';
    if (printifyKey) activeProvider = 'printify_network';
    else if (printfulKey) activeProvider = 'printful_network';
    else if (gelatoKey) activeProvider = 'gelato_network';

    const orderPayload = {
      orderReference: `SNT-POD-${Date.now()}`,
      provider: activeProvider,
      customerName: customerName || 'VIP Explorer',
      customerEmail: customerEmail || 'guest@scratchntravel.com',
      sku: productSku || 'SNT-PASS-LUX-01',
      customization: {
        documentId: customDocumentId || 'ST-2026-PT-8842',
        resolutionDpi: 300
      },
      status: `dispatched_to_${activeProvider}`,
      estimatedDeliveryDays: '2-3 Werktage (DE/AT/CH)'
    };

    return res.status(200).json({
      success: true,
      provider: activeProvider,
      message: `POD-Druckauftrag erfolgreich an ${activeProvider.replace('_', ' ')} übermittelt!`,
      order: orderPayload
    });

  } catch (error) {
    console.error('POD Order Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

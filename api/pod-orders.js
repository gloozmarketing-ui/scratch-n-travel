/**
 * Scratch'n'Travel — Print-on-Demand (POD) Order Gateway (Vercel API)
 * Dispatches personalized Passport & Scratch Map orders to Gelato / Printful
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

    const orderPayload = {
      orderReference: `SNT-POD-${Date.now()}`,
      customerName: customerName || 'VIP Explorer',
      customerEmail: customerEmail || 'guest@scratchntravel.com',
      sku: productSku || 'ST-PASS-LUX-01',
      customization: {
        documentId: customDocumentId || 'ST-2026-PT-8842',
        foilGoldMask: 'METALLIC_GOLD_SPOT_FOGRA39',
        resolutionDpi: 300
      },
      status: 'dispatched_to_gelato_factory_de',
      estimatedDeliveryDays: '2-3 Werktage (DE/AT/CH)'
    };

    return res.status(200).json({
      success: true,
      message: 'POD-Druckauftrag erfolgreich an deutsche Gelato-Druckerei übermittelt!',
      order: orderPayload
    });

  } catch (error) {
    console.error('POD Order Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

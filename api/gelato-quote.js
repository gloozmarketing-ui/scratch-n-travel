/**
 * Scratch'n'Travel — Gelato Delivery Quote API Gateway (Vercel API)
 * 
 * Berechnet vorab die exakten Produktions- & Versandkosten für jeden Ort weltweit.
 */

'use strict';

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
    const { countryCode = 'DE', postalCode = '', productUid = 'acrylic_block_100x150_20mm_clear', quantity = 1 } = req.body || {};
    const apiKey = (process.env.GELATO_KEY || process.env.GELATO_API_KEY || '').trim();

    if (!apiKey) {
      // Deterministischer Fallback / Näherungswerte bei fehlendem Key
      return res.status(200).json({
        success: true,
        isEstimate: true,
        countryCode,
        currency: 'EUR',
        estimatedProductCost: 16.50,
        estimatedShippingStandard: ['DE', 'AT', 'CH', 'PT', 'ES', 'IT', 'FR'].includes(countryCode) ? 4.90 : 8.50,
        estimatedShippingExpress: 12.00,
        estimatedTransitDays: ['DE', 'AT', 'PT', 'ES'].includes(countryCode) ? '2-4 Werktage' : '4-7 Werktage'
      });
    }

    const payload = {
      orderReferenceId: `quote-${Date.now()}`,
      recipient: {
        country: countryCode,
        postCode: postalCode || '10115'
      },
      products: [
        {
          itemReferenceId: 'item-quote-01',
          productUid,
          quantity
        }
      ]
    };

    const gelatoRes = await fetch('https://api.gelato.com/v2/order/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await gelatoRes.json();

    if (!gelatoRes.ok) {
      return res.status(gelatoRes.status).json({
        success: false,
        error: data
      });
    }

    return res.status(200).json({
      success: true,
      isEstimate: false,
      quotes: data.quotes || data
    });

  } catch (error) {
    console.error('[Gelato Quote Error]', error);
    return res.status(500).json({ error: 'Failed to retrieve delivery quote', details: error.message });
  }
};

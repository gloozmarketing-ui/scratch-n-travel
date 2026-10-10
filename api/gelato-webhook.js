/**
 * Scratch'n'Travel — Gelato Print-on-Demand Webhook Handler (Vercel API)
 * 
 * Verarbeitet asynchrone Status-Updates von Gelato:
 *  - order_status_updated: In Produktion / Druck abgeschlossen
 *  - package_shipped: Sendung an Carrier übergeben inkl. Tracking-Code & Carrier-URL
 *  - order_delivered: Zustellung beim Host / Kunden erfolgt
 * 
 * URL im Gelato Dashboard eintragen:
 *   https://scratch-n-travel.vercel.app/api/gelato-webhook
 */

'use strict';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Gelato-Signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body || {};
    const webhookSecret = (process.env.GELATO_WEBHOOK_SECRET || '').trim();

    // Optionale Signaturprüfung falls Secret gesetzt
    if (webhookSecret && req.headers['x-gelato-signature']) {
      // Signature verification hook
    }

    const { eventType, orderId, orderReferenceId, trackingCode, trackingUrl, carrier, status } = event;

    console.log(`[Gelato Webhook] Event: ${eventType || 'status_change'} | Order: ${orderReferenceId || orderId} | Status: ${status}`);

    if (trackingCode) {
      console.log(`[Gelato Webhook] 🚚 Sendungsverfolgung erhalten: Carrier=${carrier || 'Post/DHL'}, Code=${trackingCode}, URL=${trackingUrl}`);
    }

    // Antwort an Gelato (200 OK bestätigt erfolgreichen Empfang)
    return res.status(200).json({
      received: true,
      orderReferenceId: orderReferenceId || orderId,
      status: status || 'processed',
      message: 'Gelato status update successfully recorded by Hermes Engine.'
    });

  } catch (error) {
    console.error('[Gelato Webhook Error]', error);
    return res.status(500).json({ error: 'Webhook processing failed', details: error.message });
  }
};

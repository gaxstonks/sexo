import type { NextApiRequest, NextApiResponse } from 'next';
import mercadopago from 'mercadopago';
import { getDb } from '../../../src/lib/db';

if (process.env.MP_ACCESS_TOKEN) {
  try { mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN); } catch(e) {}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.MP_ACCESS_TOKEN) return res.status(500).json({ error: 'MP_ACCESS_TOKEN not configured' });

  try {
    const { items, external_reference, payer } = req.body;

    const preference = {
      items: items || [],
      external_reference: external_reference || undefined,
      payer: payer || undefined,
      back_urls: {
        success: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/payment-success` : '/payment-success',
        failure: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/payment` : '/payment',
        pending: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/payment` : '/payment',
      },
      notification_url: (process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : '') + '/api/webhooks/mercadopago',
    };

    const pref = await mercadopago.preferences.create(preference);
    return res.status(200).json(pref);
  } catch (err) {
    console.error('create-preference error', err);
    return res.status(500).json({ error: String(err) });
  }
}

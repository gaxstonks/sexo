import type { NextApiRequest, NextApiResponse } from 'next';
import mercadopago from 'mercadopago';
import { getDb } from '../../../../src/lib/db';

export const config = { api: { bodyParser: true } };

if (process.env.MP_ACCESS_TOKEN) {
  try {
    mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);
  } catch (e) {}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const topic = req.body.type || req.query.type || req.body.topic || null;
  // Mercado Pago may send different payloads; handle common ones
  try {
    // Example: payment updates call with 'payment' topic and id in query 'data.id' or 'id'
    let id = req.body["data.id"] || req.body['data']?.id || req.query?.id || req.body?.id;
    if (!id && req.query && req.query.id) id = req.query.id;

    if (!id) {
      // nothing to do
      return res.status(200).json({ received: true });
    }

    // Fetch payment details from Mercado Pago
    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'MP_ACCESS_TOKEN not configured' });
    }

    const payment = await mercadopago.payment.findById(id);
    const db = getDb();

    // Simplest approach: if payment status is 'approved', activate subscription for mapped user id
    // NOTE: You should store a mapping between preference/item and your userId when creating the preference.
    if (payment && payment.body && payment.body.status === 'approved') {
      // Try to find user by payer email if present (best-effort)
      const payerEmail = payment.body.payer?.email;
      if (db && payerEmail) {
        const user = await db.user.findFirst({ where: { email: payerEmail } });
        if (user) {
          await db.subscription.upsert({
            where: { userId: user.id },
            update: { active: true },
            create: { userId: user.id, active: true },
          });
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handling error', err);
    return res.status(500).json({ error: String(err) });
  }
}

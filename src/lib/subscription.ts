// Subscription helpers using Prisma and Mercado Pago integration placeholders.
import { getDb } from "./db";
import mercadopago from "mercadopago";

// Ensure mercadopago is initialized if token present
if (process.env.MP_ACCESS_TOKEN) {
  try {
    mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);
  } catch (e) {
    // ignore in build environment
  }
}

export async function hasActiveSubscription(userId?: string) {
  try {
    const db = getDb();
    if (!db || !userId) return false;
    const sub = await db.subscription.findFirst({ where: { userId } });
    return Boolean(sub?.active);
  } catch (e) {
    return false;
  }
}

export async function getSubscription(userId?: string) {
  const db = getDb();
  if (!db || !userId) return null;
  return await db.subscription.findFirst({ where: { userId } });
}

export async function activateSubscription(userId?: string, data?: any) {
  const db = getDb();
  if (!db || !userId) return null;
  // Upsert subscription as active
  return await db.subscription.upsert({
    where: { userId },
    update: { active: true },
    create: { userId, active: true },
  });
}

export function getSubscriptionMessage(isActive: boolean) {
  if (isActive) return "Você tem uma assinatura ativa. Obrigado!";
  return "Você não possui assinatura ativa. Faça o pagamento para liberar recursos.";
}

// helper to create a Mercado Pago preference (client-side will call an API route instead)
export async function createMercadoPagoPreference(preferenceData: any) {
  if (!process.env.MP_ACCESS_TOKEN) {
    throw new Error("MP_ACCESS_TOKEN not configured");
  }
  const pref = await mercadopago.preferences.create(preferenceData);
  return pref;
}

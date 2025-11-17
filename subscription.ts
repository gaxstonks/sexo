// Sistema de gerenciamento de assinaturas e validação de plano ativo

export type PlanType = 'daily' | 'monthly' | 'annual';

export interface Subscription {
  plan: PlanType;
  paymentId: string;
  activatedAt: string;
  expiresAt: string;
  isActive: boolean;
}

// Duração dos planos em dias
const PLAN_DURATION: Record<PlanType, number> = {
  daily: 1,
  monthly: 30,
  annual: 365,
};

// Ativar assinatura após pagamento
export function activateSubscription(plan: PlanType, paymentId: string): void {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + PLAN_DURATION[plan]);

  const subscription: Subscription = {
    plan,
    paymentId,
    activatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    isActive: true,
  };

  localStorage.setItem('subscription', JSON.stringify(subscription));
}

// Obter assinatura atual
export function getSubscription(): Subscription | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem('subscription');
  if (!data) return null;

  const subscription: Subscription = JSON.parse(data);

  // Verificar se ainda está ativa
  const now = new Date();
  const expiresAt = new Date(subscription.expiresAt);

  if (now > expiresAt) {
    subscription.isActive = false;
    localStorage.setItem('subscription', JSON.stringify(subscription));
  }

  return subscription;
}

// Verificar se tem assinatura ativa
export function hasActiveSubscription(): boolean {
  const subscription = getSubscription();
  return subscription !== null && subscription.isActive;
}

// Obter mensagem de status da assinatura
export function getSubscriptionMessage(): string {
  const subscription = getSubscription();
  
  if (!subscription) {
    return 'Nenhuma assinatura ativa';
  }

  if (!subscription.isActive) {
    return 'Sua assinatura expirou';
  }

  const planNames = {
    daily: 'Diário',
    monthly: 'Mensal',
    annual: 'Anual',
  };

  const expiresAt = new Date(subscription.expiresAt);
  const daysLeft = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return `Plano ${planNames[subscription.plan]} ativo • ${daysLeft} dia${daysLeft !== 1 ? 's' : ''} restante${daysLeft !== 1 ? 's' : ''}`;
}

// Cancelar assinatura
export function cancelSubscription(): void {
  localStorage.removeItem('subscription');
}

// Verificar se pode baixar PDF
export function canDownloadPDF(): boolean {
  return hasActiveSubscription();
}

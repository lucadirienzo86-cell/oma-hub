import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.startsWith('pk_') && !key.startsWith('sk_')) {
      throw new Error('STRIPE_SECRET_KEY non configurata');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2025-02-24.acacia' as const,
      typescript: true,
    });
  }
  return _stripe;
}

/**
 * Client Stripe lato server (lazy) - usa getStripe() nelle funzioni
 * @deprecated Usa getStripe() direttamente
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as never)[prop];
  },
});

/**
 * Crea un PaymentIntent per una prenotazione
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'eur',
  metadata: Record<string, string> = {}
) {
  return getStripe().paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe usa centesimi
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

/**
 * Verifica la firma del webhook Stripe
 */
export async function verifyStripeWebhook(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  return getStripe().webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}

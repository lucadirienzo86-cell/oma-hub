import { NextRequest, NextResponse } from 'next/server';
import { verifyStripeWebhook } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * POST /api/webhook/stripe
 * Gestisce i webhook di Stripe per confermare i pagamenti
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Signature mancante' },
      { status: 400 }
    );
  }

  try {
    const event = await verifyStripeWebhook(body, signature);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const piId = paymentIntent.id;

        // Conferma la prenotazione associata
        const { error } = await supabaseAdmin
          .from('bookings')
          .update({ payment_status: 'confirmed' })
          .eq('stripe_payment_intent_id', piId);
        if (error) throw error;

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const piId = paymentIntent.id;

        // Marca come fallita
        const { data: booking, error } = await supabaseAdmin
          .from('bookings')
          .update({ payment_status: 'failed' })
          .eq('stripe_payment_intent_id', piId)
          .select()
          .single();
        if (error) throw error;

        // Decrementa il contatore se la prenotazione esiste
        if (booking?.session_id) {
          const { error: rpcError } = await supabaseAdmin.rpc('decrement_session_bookings', {
            session_id: booking.session_id,
          });
          if (rpcError) throw rpcError;
        }

        break;
      }

      default:
        console.log(`Evento Stripe non gestito: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Errore webhook Stripe:', err);
    return NextResponse.json(
      { error: 'Errore nella verifica del webhook' },
      { status: 400 }
    );
  }
}

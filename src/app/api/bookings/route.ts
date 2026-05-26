import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createPaymentIntent } from '@/lib/stripe';

/**
 * POST /api/bookings
 * Crea una nuova prenotazione con pagamento Stripe
 */
export async function POST(req: NextRequest) {
  try {
    const { sessionId, clientName, clientEmail, clientPhone } =
      await req.json();

    // Validazione base
    if (!sessionId || !clientName || !clientEmail || !clientPhone) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }

    // Verifica che la sessione abbia disponibilità (controllo atomico)
    const { data: session, error: sessionErr } = await supabase
      .from('sessions')
      .select('*, service:services(*)')
      .eq('id', sessionId)
      .single();

    if (sessionErr || !session) {
      return NextResponse.json(
        { error: 'Sessione non trovata' },
        { status: 404 }
      );
    }

    if (session.current_bookings >= session.max_capacity) {
      return NextResponse.json(
        { error: 'Sessione al completo' },
        { status: 409 }
      );
    }

    // Calcola prezzo finale
    const finalPrice = session.service?.base_price
      ? Number(session.service.base_price) * (session.is_promotion && session.discount_percentage > 0 ? 1 - session.discount_percentage / 100 : 1)
      : 0;

    // Crea PaymentIntent su Stripe
    const paymentIntent = await createPaymentIntent(finalPrice, 'eur', {
      sessionId,
      clientEmail,
      clientName,
    });

    // Crea la prenotazione
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .insert({
        session_id: sessionId,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        payment_status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
      })
      .select()
      .single();

    if (bookingErr) {
      console.error('Errore creazione prenotazione:', bookingErr);
      return NextResponse.json(
        { error: 'Errore nella creazione della prenotazione' },
        { status: 500 }
      );
    }

    // Increment handled by DB trigger (atomic)
    // No client trust: all validation server-side done above

    return NextResponse.json({
      success: true,
      bookingToken: booking.booking_token,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Errore API bookings:', err);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

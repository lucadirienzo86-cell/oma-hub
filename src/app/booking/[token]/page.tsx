'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase, type Booking } from '@/lib/supabase';
import { Button, Spinner } from '@/components/ui';

/**
 * Pagina gestione prenotazione (modifica/cancella)
 */
export default function BookingPage() {
  const params = useParams();
  const token = params.token as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function loadBooking() {
      const { data } = await supabase
        .from('bookings')
        .select('*, session:sessions(*, service:services(*))')
        .eq('booking_token', token)
        .single();

      if (data) {
        setBooking(data);
      } else {
        setError('Prenotazione non trovata.');
      }
      setLoading(false);
    }

    if (token) loadBooking();
  }, [token]);

  // Cancella prenotazione
  async function handleCancel() {
    if (!booking) return;
    setCancelling(true);

    try {
      // Decrementa contatore sessioni
      await supabase.rpc('decrement_session_bookings', {
        session_id: booking.session_id,
      });

      // Aggiorna stato prenotazione
      await supabase
        .from('bookings')
        .update({ payment_status: 'cancelled' })
        .eq('id', booking.id);

      setBooking({ ...booking, payment_status: 'cancelled' });
    } catch {
      setError('Errore durante la cancellazione.');
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-fluid-xl font-display text-sand-700 mb-2">
            {error || 'Non trovato'}
          </h1>
          <a href="/servizi" className="text-sand-500 hover:text-sand-700">
            ← Torna ai servizi
          </a>
        </div>
      </div>
    );
  }

  const session = booking.session;
  const service = session?.service;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-lg mx-auto pt-8">
        <h1 className="text-fluid-2xl font-display text-sand-700 mb-8 text-center">
          La Tua Prenotazione
        </h1>

        <div className="service-card rounded-2xl p-6 space-y-4">
          {/* Stato */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-sand-500">Stato</span>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                booking.payment_status === 'confirmed'
                  ? 'bg-green-100 text-green-700'
                  : booking.payment_status === 'cancelled'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {booking.payment_status === 'confirmed'
                ? 'Confermata'
                : booking.payment_status === 'cancelled'
                ? 'Cancellata'
                : 'In attesa'}
            </span>
          </div>

          {/* Servizio */}
          <div>
            <span className="text-sm text-sand-500">Servizio</span>
            <p className="text-lg font-medium text-sand-700">
              {service?.name || '—'}
            </p>
          </div>

          {/* Data/Ora */}
          {session && (
            <div>
              <span className="text-sm text-sand-500">Data e Ora</span>
              <p className="text-sand-700">
                {new Date(session.start_time).toLocaleDateString('it-IT', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}

          {/* Cliente */}
          <div>
            <span className="text-sm text-sand-500">Prenotato da</span>
            <p className="text-sand-700">{booking.client_name}</p>
            <p className="text-sm text-sand-500">{booking.client_email}</p>
          </div>

          {/* Prezzo */}
          <div>
            <span className="text-sm text-sand-500">Prezzo</span>
            <p className="text-xl font-medium text-sand-700">
              {service ? `€${service.base_price}` : '—'}
            </p>
          </div>
        </div>

        {/* Azioni */}
        {booking.payment_status !== 'cancelled' && (
          <div className="mt-6 flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full"
            >
              {cancelling ? <Spinner /> : 'Cancella Prenotazione'}
            </Button>
          </div>
        )}

        <div className="mt-8 text-center">
          <a href="/servizi" className="text-sm text-sand-500 hover:text-sand-700">
            ← Torna ai servizi
          </a>
        </div>
      </div>
    </div>
  );
}

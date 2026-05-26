'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, type Service, type Session } from '@/lib/supabase';
import { Button, Spinner, PromotionBadge } from '@/components/ui';

/**
 * Props per il form di prenotazione
 */
interface BookingFormProps {
  serviceId: string;
  onSuccess?: (bookingToken: string) => void;
}

/**
 * Form di prenotazione con selezione sessione e pagamento
 */
export default function BookingForm({ serviceId, onSuccess }: BookingFormProps) {
  const [service, setService] = useState<Service | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'details' | 'confirm'>('select');

  // Carica il servizio e le sessioni disponibili
  useEffect(() => {
    async function loadData() {
      // Carica servizio
      const { data: svc } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (svc) setService(svc);

      // Carica sessioni disponibili (future, con posti liberi)
      const { data: sess } = await supabase
        .from('sessions')
        .select('*, service:services(*)')
        .eq('service_id', serviceId)
        .gt('start_time', new Date().toISOString())
        .lt('current_bookings', 10) // max_capacity default 1 ma funziona sempre
        .order('start_time', { ascending: true });

      if (sess) setSessions(sess);
    }

    loadData();

    // Realtime listener per aggiornamenti promozioni
    const channel = supabase
      .channel('sessions-promo')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sessions', filter: `service_id=eq.${serviceId}` },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [serviceId]);

  // Formatta data/ora italiana
  function formatDateTime(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Calcola prezzo con eventuale sconto
  function getPrice(session: Session): number {
    if (!service) return 0;
    const base = Number(service.base_price);
    if (session.is_promotion && session.discount_percentage > 0) {
      return base * (1 - session.discount_percentage / 100);
    }
    return base;
  }

  // Invio prenotazione
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const session = sessions.find((s) => s.id === selectedSession);
      if (!session) throw new Error('Sessione non trovata');

      // Chiamata API per creare la prenotazione
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession,
          clientName,
          clientEmail,
          clientPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Errore nella prenotazione');

      onSuccess?.(data.bookingToken);
      setStep('confirm');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!service) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {/* Step 1: Selezione sessione */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-fluid-xl font-display text-sand-700 mb-2">
              {service.name}
            </h2>
            <p className="text-sand-500 mb-6">
              {service.duration_minutes} min · da €{service.base_price}
            </p>

            <div className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-sand-500 text-center py-8">
                  Nessuna sessione disponibile al momento.
                </p>
              ) : (
                sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      setSelectedSession(session.id);
                      setStep('details');
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedSession === session.id
                        ? 'border-sand-500 bg-sand-200'
                        : 'border-sand-200 bg-sand-50 hover:border-sand-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sand-800 capitalize">
                          {formatDateTime(session.start_time)}
                        </p>
                        {session.is_promotion && (
                          <p className="text-terra-400 text-sm mt-1">
                            Sessione promozionale!
                          </p>
                        )}
                      </div>
                      <div className="text-right flex items-center gap-2">
                        {session.is_promotion ? (
                          <>
                            <span className="text-sand-400 line-through text-sm">
                              €{service.base_price}
                            </span>
                            <PromotionBadge discount={session.discount_percentage} />
                            <span className="font-medium text-sand-700">
                              €{getPrice(session).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium text-sand-700">
                            €{service.base_price}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Dettagli cliente */}
        {step === 'details' && (
          <motion.form
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <button
              type="button"
              onClick={() => setStep('select')}
              className="text-sand-500 hover:text-sand-700 flex items-center gap-1 text-sm"
            >
              ← Torna alle sessioni
            </button>

            <h2 className="text-fluid-xl font-display text-sand-700 mb-4">
              I tuoi dati
            </h2>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-sand-600 mb-1.5">
                Nome completo *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Mario Rossi"
                className="w-full px-4 py-3 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sand-600 mb-1.5">
                Email *
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="mario@esempio.it"
                className="w-full px-4 py-3 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sand-600 mb-1.5">
                Telefono *
              </label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+39 333 1234567"
                className="w-full px-4 py-3 rounded-xl"
              />
            </div>

            {/* Riepilogo */}
            <div className="p-4 bg-sand-200 rounded-xl">
              <h3 className="font-medium text-sand-700 mb-2">Riepilogo</h3>
              <p className="text-sm text-sand-600">{service.name}</p>
              <p className="text-sm text-sand-600 capitalize">
                {sessions.find((s) => s.id === selectedSession)?.start_time
                  ? formatDateTime(
                      sessions.find((s) => s.id === selectedSession)!.start_time
                    )
                  : ''}
              </p>
              <p className="font-medium text-sand-800 mt-2 text-lg">
                €{getPrice(sessions.find((s) => s.id === selectedSession)!).toFixed(2)}
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Spinner /> : 'Conferma e Paga'}
            </Button>
          </motion.form>
        )}

        {/* Step 3: Conferma */}
        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-fluid-xl font-display text-sand-700 mb-2">
              Prenotazione confermata!
            </h2>
            <p className="text-sand-500">
              Riceverai una conferma via email con tutti i dettagli.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { notFound } from 'next/navigation';
import { supabase, type Service } from '@/lib/supabase';
import BookingForm from '@/components/BookingForm';
import { Metadata } from 'next';

interface PrenotaPageProps {
  params: { serviceId: string };
}

export const metadata: Metadata = {
  title: 'Prenota — OMA Hub',
};

async function getService(serviceId: string): Promise<Service | null> {
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single();

  return data;
}

/**
 * Pagina prenotazione per un singolo servizio
 */
export default async function PrenotaPage({ params }: PrenotaPageProps) {
  const service = await getService(params.serviceId);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Breadcrumb */}
        <a
          href="/servizi"
          className="text-sm text-sand-500 hover:text-sand-700 inline-flex items-center gap-1 mb-8"
        >
          ← Torna ai servizi
        </a>

        {/* Form prenotazione */}
        <BookingForm serviceId={params.serviceId} />
      </div>
    </div>
  );
}

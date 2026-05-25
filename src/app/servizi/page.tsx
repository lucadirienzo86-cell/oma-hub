import { supabase, type Service } from '@/lib/supabase';
import { PromotionBadge } from '@/components/ui';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servizi — OMA Hub',
  description: 'Ballo, yoga e massaggi. Scegli il tuo percorso di benessere.',
};

/**
 * Recupera tutti i servizi dal database
 */
async function getServices(): Promise<Service[]> {
  const { data } = await supabase
    .from('services')
    .select('*')
    .order('category', { ascending: true });

  return data || [];
}

/**
 * Pagina lista servizi con card 3D
 */
export default async function ServiziPage() {
  const services = await getServices();

  // Raggruppa servizi per categoria
  const grouped = services.reduce(
    (acc, service) => {
      if (!acc[service.category]) acc[service.category] = [];
      acc[service.category].push(service);
      return acc;
    },
    {} as Record<string, Service[]>
  );

  const categoryLabels: Record<string, string> = {
    ballo: 'Ballo & Movimento',
    yoga: 'Yoga & Respiro',
    massaggio: 'Massaggio & Rigenerazione',
  };

  // Stile card per categoria
  const categoryGradients: Record<string, string> = {
    ballo: 'from-terra-300/20 to-sand-200/30',
    yoga: 'from-sand-400/20 to-sand-200/30',
    massaggio: 'from-sand-500/20 to-sand-200/30',
  };

  const categoryIcons: Record<string, string> = {
    ballo: '💃',
    yoga: '🧘',
    massaggio: '🤲',
  };

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-16 pt-8">
        <h1 className="text-fluid-2xl font-display text-sand-700 mb-4">
          I Nostri Servizi
        </h1>
        <p className="text-sand-500 max-w-lg mx-auto text-fluid-base">
          Tre dimensioni del benessere per il tuo equilibrio interiore.
          Scegli il percorso che risuona con te.
        </p>
      </div>

      {/* Servizi per categoria */}
      <div className="max-w-5xl mx-auto space-y-16">
        {Object.entries(grouped).map(([category, categoryServices]) => (
          <section key={category}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{categoryIcons[category]}</span>
              <h2 className="text-fluid-xl font-display text-sand-700">
                {categoryLabels[category] || category}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryServices.map((service) => (
                <article
                  key={service.id}
                  className={`service-card rounded-2xl overflow-hidden bg-gradient-to-br ${categoryGradients[category]}`}
                >
                  {/* Immagine placeholder */}
                  <div className="h-40 bg-sand-300/50 flex items-center justify-center">
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl opacity-50">
                        {categoryIcons[category]}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-display text-sand-700">
                        {service.name}
                      </h3>
                      {service.duration_minutes && (
                        <span className="text-xs text-sand-500 whitespace-nowrap ml-2">
                          {service.duration_minutes} min
                        </span>
                      )}
                    </div>

                    {service.description && (
                      <p className="text-sm text-sand-500 mb-4 line-clamp-3">
                        {service.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-medium text-sand-700">
                          €{service.base_price}
                        </span>
                      </div>
                      <a
                        href={`/prenota/${service.id}`}
                        className="px-4 py-2 bg-sand-500 text-sand-100 rounded-full text-sm hover:bg-sand-600 transition-colors"
                      >
                        Prenota
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {services.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sand-500 text-lg">
              Nessun servizio disponibile al momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

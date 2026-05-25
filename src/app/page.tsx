'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import BentoGrid, { BentoItem, bentoVariants } from '@/components/BentoGrid';
import { Button } from '@/components/ui';

// Import dinamico della scena 3D (no SSR per Three.js)
const SpaceTunnelScene = dynamic(
  () => import('@/components/Scene3D/SpaceTunnel'),
  { ssr: false, loading: () => <div className="canvas-container bg-sand-100" /> }
);

/**
 * Landing page con tunnel 3D e CTA prenotazione
 */
export default function HomePage() {
  const promoRef = useRef<HTMLDivElement>(null);

  // Smooth scroll per anchor links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const id = anchor.getAttribute('href')?.slice(1);
        document.getElementById(id!)?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {/* ── Hero Section con Tunnel 3D ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Sfondo 3D */}
        <SpaceTunnelScene />

        {/* Contenuto sovrapposto */}
        <div className="content-overlay text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            className="text-fluid-3xl font-display text-sand-800 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Movimento.
            <br />
            <span className="text-sand-500">Respiro.</span>
            <br />
            Connessione.
          </motion.h1>

          <motion.p
            className="text-fluid-lg text-sand-500 mb-10 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Ballo, yoga e massaggi in uno spazio pensato per il tuo
            benessere olistico. Prenota la tua esperienza.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/servizi">
              <Button size="lg">Scopri i Servizi</Button>
            </a>
            <a href="/servizi">
              <Button variant="outline" size="lg">
                Prenota Ora
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-sand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* ── Servizi Preview (Bento Grid) ── */}
      <section className="py-20 px-4" id="servizi">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-fluid-2xl font-display text-sand-700 mb-3">
            I Nostri Percorsi
          </h2>
          <p className="text-sand-500 max-w-md mx-auto">
            Tre dimensioni del benessere, un unico spazio.
          </p>
        </motion.div>

        <BentoGrid>
          <BentoItem className={bentoVariants.featured} delay={0}>
            <div className="h-full flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-terra-400">
                  Ballo
                </span>
                <h3 className="text-fluid-xl font-display text-sand-700 mt-2">
                  Movimento Libero
                </h3>
                <p className="text-sand-500 mt-3 text-fluid-sm">
                  Sessioni di ballo contemporaneo e movimento espressivo
                  per riconnettere corpo e anima.
                </p>
              </div>
              <a href="/servizi" className="text-sand-600 hover:text-sand-800 text-sm mt-4 inline-flex items-center gap-1">
                Scopri →
              </a>
            </div>
          </BentoItem>

          <BentoItem className={bentoVariants.standard} delay={0.1}>
            <span className="text-xs uppercase tracking-widest text-terra-400">
              Yoga
            </span>
            <h3 className="text-fluid-lg font-display text-sand-700 mt-2">
              Presenza
            </h3>
            <p className="text-sand-500 mt-2 text-fluid-sm">
              Hatha, Vinyasa e Yin yoga per ogni livello.
            </p>
          </BentoItem>

          <BentoItem className={bentoVariants.standard} delay={0.2}>
            <span className="text-xs uppercase tracking-widest text-terra-400">
              Massaggio
            </span>
            <h3 className="text-fluid-lg font-display text-sand-700 mt-2">
              Rigenerazione
            </h3>
            <p className="text-sand-500 mt-2 text-fluid-sm">
              Deconnettiti con trattamenti olistici.
            </p>
          </BentoItem>

          <BentoItem className={bentoVariants.wide} delay={0.3}>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <span className="text-xs uppercase tracking-widest text-terra-400">
                  Promozioni
                </span>
                <h3 className="text-fluid-lg font-display text-sand-700 mt-1">
                  Sessioni Lampo
                </h3>
                <p className="text-sand-500 text-fluid-sm mt-1">
                  Prenota sessioni last-minute a prezzi ridotti.
                </p>
              </div>
              <div className="text-3xl">✨</div>
            </div>
          </BentoItem>
        </BentoGrid>
      </section>

      {/* ── Chi Siamo ── */}
      <section className="py-20 px-4 bg-sand-200/50" id="chi-siamo">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-fluid-2xl font-display text-sand-700 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Chi Siamo
          </motion.h2>
          <motion.p
            className="text-fluid-base text-sand-500 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            OMA è uno spazio dedicato al movimento consapevole e al benessere olistico.
            Nasce dalla convinzione che ballo, yoga e massaggi non siano pratiche separate,
            ma facce diverse di un unico percorso verso l'armonia interiore.
            I nostri istruttori sono professionisti certificati con anni di esperienza.
          </motion.p>
        </div>
      </section>

      {/* ── CTA Finale ── */}
      <section className="py-20 px-4" id="contatti">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-fluid-2xl font-display text-sand-700 mb-4">
            Pronto a muoverti?
          </h2>
          <p className="text-sand-500 mb-8">
            Prenota la tua prima esperienza OMA e scopri il potere del movimento consapevole.
          </p>
          <a href="/servizi">
            <Button size="lg">Prenota Ora</Button>
          </a>
        </motion.div>
      </section>
    </>
  );
}

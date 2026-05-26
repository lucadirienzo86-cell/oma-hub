'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BentoGrid, { BentoItem, bentoVariants } from '@/components/BentoGrid';
import { Button } from '@/components/ui';

type ContentBlock = {
  id: string;
  key: string;
  page: string;
  title: string;
  subtitle?: string | null;
  body?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
};

type MediaAsset = {
  id: string;
  section: string;
  asset_type: string;
  source: string;
  title: string;
  description?: string | null;
  url: string;
  poster_url?: string | null;
};

type VideoJob = {
  id: string;
  section: string;
  prompt: string;
  status: string;
};

const SpaceTunnelScene = dynamic(() => import('@/components/Scene3D/SpaceTunnel'), {
  ssr: false,
  loading: () => <div className="canvas-container bg-sand-100" />,
});

export default function HomePage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [jobs, setJobs] = useState<VideoJob[]>([]);

  useEffect(() => {
    fetch('/api/content?page=home')
      .then((r) => r.json())
      .then((data) => {
        setBlocks(data.blocks || []);
        setMedia(data.media || []);
        setJobs(data.pendingVideoJobs || []);
      })
      .catch(() => {});
  }, []);

  const hero = blocks.find((b) => b.key === 'home_hero');
  const manifesto = blocks.find((b) => b.key === 'home_manifesto');
  const courses = blocks.find((b) => b.key === 'home_courses');

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <SpaceTunnelScene />
        <div className="content-overlay text-center px-4 max-w-4xl mx-auto">
          <motion.p className="text-xs uppercase tracking-[0.35em] text-terra-400 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            Roma Parioli
          </motion.p>
          <motion.h1 className="text-fluid-3xl font-display text-sand-800 mb-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            {hero?.title?.includes('Movement') ? 'Movement.' : 'Movimento.'}
            <br />
            <span className="text-sand-500">Eleganza.</span>
            <br />
            Community.
          </motion.h1>
          <motion.p className="text-fluid-lg text-sand-500 mb-10 max-w-xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
            {hero?.body || 'Social dance, wedding, eventi, corsi PRO e sessioni individuali. Un luxury movement studio ispirato a yes-dancebiennale.'}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={hero?.cta_href || '/servizi'}><Button size="lg">{hero?.cta_label || 'Scopri i corsi'}</Button></a>
            <a href="#manifesto"><Button variant="outline" size="lg">Leggi il manifesto</Button></a>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4" id="manifesto">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-terra-400 mb-4">Manifesto</p>
          <h2 className="text-fluid-2xl font-display text-sand-700 mb-6">{manifesto?.title || 'Corpo, mente e anima in movimento.'}</h2>
          <p className="text-sand-500 text-fluid-base leading-relaxed max-w-3xl mx-auto">
            {manifesto?.body || 'Guapacha è uno spazio dove la danza diventa esperienza, relazione e stile. Una cultura del movimento viva, elegante e contemporanea.'}
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-sand-200/40" id="percorsi">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.35em] text-terra-400 mb-3">Programma</p>
            <h2 className="text-fluid-2xl font-display text-sand-700">{courses?.title || 'I percorsi Guapacha'}</h2>
          </div>
          <BentoGrid>
            <BentoItem className={bentoVariants.featured} delay={0}>
              <h3 className="text-fluid-xl font-display text-sand-700">Corsi</h3>
              <p className="text-sand-500 mt-3">Social dance per imparare con ritmo, tecnica e presenza.</p>
            </BentoItem>
            <BentoItem className={bentoVariants.standard} delay={0.1}>
              <h3 className="text-fluid-lg font-display text-sand-700">Corsi PRO</h3>
              <p className="text-sand-500 mt-2">Percorsi avanzati per crescere davvero.</p>
            </BentoItem>
            <BentoItem className={bentoVariants.standard} delay={0.2}>
              <h3 className="text-fluid-lg font-display text-sand-700">Wedding</h3>
              <p className="text-sand-500 mt-2">First dance e coreografie eleganti.</p>
            </BentoItem>
            <BentoItem className={bentoVariants.wide} delay={0.3}>
              <h3 className="text-fluid-lg font-display text-sand-700">Eventi</h3>
              <p className="text-sand-500 mt-2">Serate, performance e community nights su misura.</p>
            </BentoItem>
          </BentoGrid>
        </div>
      </section>

      {media.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.35em] text-terra-400 mb-3">Media</p>
              <h2 className="text-fluid-2xl font-display text-sand-700">Video e immagini</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {media.slice(0, 4).map((asset) => (
                <article key={asset.id} className="service-card rounded-2xl overflow-hidden">
                  {asset.asset_type === 'video' ? (
                    <video className="w-full aspect-video object-cover" controls poster={asset.poster_url || undefined} src={asset.url} />
                  ) : (
                    <img className="w-full aspect-video object-cover" src={asset.url} alt={asset.title} />
                  )}
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-terra-400 mb-2">{asset.section} · {asset.source}</p>
                    <h3 className="font-display text-sand-700 text-xl">{asset.title}</h3>
                    {asset.description && <p className="text-sand-500 mt-2">{asset.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {jobs.length > 0 && (
        <section className="py-20 px-4 bg-sand-200/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.35em] text-terra-400 mb-3">Grok queue</p>
              <h2 className="text-fluid-2xl font-display text-sand-700">Video da generare</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.slice(0, 6).map((job) => (
                <div key={job.id} className="bento-item p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-terra-400 mb-2">{job.section}</p>
                  <h3 className="font-display text-sand-700 text-lg mb-2">{job.status}</h3>
                  <p className="text-sand-500 text-sm">{job.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4" id="sessioni">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-fluid-2xl font-display text-sand-700 mb-4">Sessioni individuali</h2>
          <p className="text-sand-500 mb-8">Lezioni 1:1 costruite sul tuo obiettivo, il tuo stile e il tuo livello.</p>
          <a href="/servizi"><Button size="lg">Vai ai dettagli</Button></a>
        </div>
      </section>

      <section className="py-20 px-4 bg-sand-800 text-sand-100" id="cta">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-fluid-2xl font-display mb-4">Vuoi iniziare?</h2>
          <p className="text-sand-300 mb-8">Scrivici e troviamo il percorso giusto per te.</p>
          <a href="/servizi"><Button size="lg">Prenota una lezione</Button></a>
        </div>
      </section>
    </>
  );
}

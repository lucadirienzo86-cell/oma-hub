'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const VIDEOS = {
  hero: 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-11ab0383-75eb-4b9d-8332-2d17dcb54975.mp4',
  manifesto: 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-c3c81ffc-a163-4e72-bba2-30ea1077cd9b.mp4',
  corsi: 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-43177c18-7ad7-47ce-bd40-1ffa05422a5d.mp4',
  wedding: 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-3dc59ca2-10f7-442d-adbb-67b1d5fa2766.mp4',
  corsiPro: 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-05c60bca-f67f-43de-a859-70462140d84e.mp4',
  eventi: 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-07cf6169-95b6-43cd-af7e-b644c79490e4.mp4',
  sessioni: 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-87ccd3f8-63e6-40ca-b1f7-ca01d32c3464.mp4',
};

const SERVICES = [
  {
    id: 'corsi',
    title: 'Corsi',
    subtitle: 'Social dance',
    description: 'Impara la salsa latino americana con ritmo, tecnica e presenza. Gruppi omogeni, atmosfera elegante.',
    video: VIDEOS.corsi,
    cta: 'Scopri i corsi',
  },
  {
    id: 'corsi-pro',
    title: 'Corsi PRO',
    subtitle: 'Percorsi avanzati',
    description: 'Per chi vuole crescere davvero. Tecnica raffinata, musicalità, espressione personale.',
    video: VIDEOS.corsiPro,
    cta: 'Livello avanzato',
  },
  {
    id: 'wedding',
    title: 'Wedding',
    subtitle: 'Il vostro primo ballo',
    description: 'Coreografie eleganti per il vostro giorno speciale. Un ballo che racconta la vostra storia.',
    video: VIDEOS.wedding,
    cta: 'Prenota la prova',
  },
  {
    id: 'eventi',
    title: 'Eventi',
    subtitle: 'Serate e performance',
    description: 'Serate a tema, showcase e community nights. La danza come esperienza sociale.',
    video: VIDEOS.eventi,
    cta: 'Prossimo evento',
  },
  {
    id: 'sessioni',
    title: 'Sessioni 1:1',
    subtitle: 'Lezioni private',
    description: 'Costruite sul tuo obiettivo, il tuo stile e il tuo livello. Massima attenzione, massima crescita.',
    video: VIDEOS.sessioni,
    cta: 'Prenota ora',
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.05], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.95)']);

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ backgroundColor: navBg }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="text-2xl font-light tracking-[0.3em] text-white uppercase">
              Guapacha
            </a>
            <div className="hidden md:flex items-center gap-10">
              <a href="#manifesto" className="text-sm tracking-[0.2em] text-white/70 hover:text-white transition-colors uppercase">Manifesto</a>
              <a href="#percorsi" className="text-sm tracking-[0.2em] text-white/70 hover:text-white transition-colors uppercase">Percorsi</a>
              <a href="#gallery" className="text-sm tracking-[0.2em] text-white/70 hover:text-white transition-colors uppercase">Gallery</a>
              <a href="#contatti" className="text-sm tracking-[0.2em] text-white/70 hover:text-white transition-colors uppercase">Contatti</a>
              <a href="#prenota" className="px-6 py-2.5 border border-white/30 text-white text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
                Prenota
              </a>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-6 py-8 space-y-6">
              <a href="#manifesto" onClick={() => setMenuOpen(false)} className="block text-lg tracking-[0.2em] text-white/80 uppercase">Manifesto</a>
              <a href="#percorsi" onClick={() => setMenuOpen(false)} className="block text-lg tracking-[0.2em] text-white/80 uppercase">Percorsi</a>
              <a href="#gallery" onClick={() => setMenuOpen(false)} className="block text-lg tracking-[0.2em] text-white/80 uppercase">Gallery</a>
              <a href="#contatti" onClick={() => setMenuOpen(false)} className="block text-lg tracking-[0.2em] text-white/80 uppercase">Contatti</a>
              <a href="#prenota" onClick={() => setMenuOpen(false)} className="inline-block px-8 py-3 border border-white/30 text-white tracking-[0.2em] uppercase">Prenota</a>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%231a1a1a'/%3E%3C/svg%3E"
        >
          <source src={VIDEOS.hero} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xs tracking-[0.5em] text-white/60 uppercase mb-6"
          >
            Roma Parioli
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-[0.1em] uppercase leading-none mb-8"
          >
            Movimento.
            <br />
            <span className="font-extralight italic">Eleganza.</span>
            <br />
            Community.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl font-light leading-relaxed mb-12"
          >
            Social dance, wedding, eventi, corsi PRO e sessioni individuali.
            Un luogo dove la danza diventa esperienza, relazione e stile.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#prenota"
              className="px-10 py-4 bg-white text-black text-sm tracking-[0.3em] uppercase hover:bg-white/90 transition-all duration-300"
            >
              Prenota una lezione
            </a>
            <a
              href="#percorsi"
              className="px-10 py-4 border border-white/40 text-white text-sm tracking-[0.3em] uppercase hover:bg-white/10 transition-all duration-300"
            >
              Scopri i percorsi
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/40 mx-auto" />
        </motion.div>
      </section>

      {/* MANIFESTO */}
      <section id="manifesto" className="relative py-32 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs tracking-[0.5em] text-white/40 uppercase mb-6">Manifesto</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-[0.05em] leading-tight mb-8">
                Il movimento
                <br />
                <span className="italic font-extralight">come linguaggio.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-6 font-light">
                Guapacha è uno spazio dove la danza diventa esperienza, relazione e stile.
                Una cultura del movimento viva, elegante e contemporanea.
              </p>
              <p className="text-lg text-white/60 leading-relaxed mb-8 font-light">
                Non insegniamo passi. Coltiviamo presenza, tecnica e connessione.
                Ogni lezione è un incontro, ogni ballo una conversazione.
              </p>
              <a href="#percorsi" className="inline-block text-sm tracking-[0.3em] text-white/50 uppercase border-b border-white/20 pb-1 hover:text-white hover:border-white/60 transition-all duration-300">
                Scopri la visione
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[16/9]"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={VIDEOS.manifesto} type="video/mp4" />
              </video>
              <div className="absolute inset-0 border border-white/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* PERCORSI / SERVIZI */}
      <section id="percorsi" className="py-32 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-xs tracking-[0.5em] text-white/40 uppercase mb-6">Programma</p>
            <h2 className="text-4xl md:text-6xl font-light text-white tracking-[0.05em]">
              I percorsi <span className="italic font-extralight">Guapacha</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative grid grid-cols-1 lg:grid-cols-2 gap-0 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                {/* Video */}
                <div className="relative aspect-[16/9] lg:aspect-auto overflow-hidden">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  >
                    <source src={service.video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500" />
                </div>
                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-[#0a0a0a]">
                  <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-3">{service.subtitle}</p>
                  <h3 className="text-3xl md:text-4xl font-light text-white tracking-[0.05em] mb-4">{service.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed mb-8">{service.description}</p>
                  <a
                    href={`/prenota/${service.id}`}
                    className="inline-flex items-center gap-3 text-sm tracking-[0.2em] text-white/70 uppercase hover:text-white transition-colors group/link"
                  >
                    {service.cta}
                    <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.5em] text-white/40 uppercase mb-6">Gallery</p>
            <h2 className="text-4xl md:text-6xl font-light text-white tracking-[0.05em]">
              Momenti <span className="italic font-extralight">Guapacha</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(VIDEOS).slice(1).map(([key, url], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative aspect-[16/9] overflow-hidden group"
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                >
                  <source src={url} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA PRENOTA */}
      <section id="prenota" className="relative py-40 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={VIDEOS.hero} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.5em] text-white/50 uppercase mb-6">Inizia il viaggio</p>
            <h2 className="text-4xl md:text-6xl font-light text-white tracking-[0.05em] mb-8">
              Pronto a <span className="italic font-extralight">muoverti?</span>
            </h2>
            <p className="text-lg text-white/60 font-light max-w-2xl mx-auto mb-12">
              Prenota una lezione di prova gratuita. Scopri il tuo stile, il tuo ritmo, la tua community.
            </p>
            <a
              href="/servizi"
              className="inline-block px-12 py-5 bg-white text-black text-sm tracking-[0.3em] uppercase hover:bg-white/90 transition-all duration-300"
            >
              Prenota ora
            </a>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contatti" className="bg-[#0a0a0a] border-t border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-light text-white tracking-[0.2em] uppercase mb-4">Guapacha</h3>
              <p className="text-white/40 font-light leading-relaxed max-w-md">
                Social dance, wedding, eventi e percorsi individuali.
                Movimento, eleganza, community.
              </p>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.4em] text-white/40 uppercase mb-6">Contatti</h4>
              <p className="text-white/60 font-light mb-2">Roma Parioli</p>
              <p className="text-white/60 font-light mb-2">Su appuntamento</p>
              <p className="text-white/60 font-light">lucadirienzo86@gmail.com</p>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.4em] text-white/40 uppercase mb-6">Naviga</h4>
              <div className="space-y-3">
                <a href="#manifesto" className="block text-white/60 hover:text-white font-light transition-colors">Manifesto</a>
                <a href="#percorsi" className="block text-white/60 hover:text-white font-light transition-colors">Percorsi</a>
                <a href="#gallery" className="block text-white/60 hover:text-white font-light transition-colors">Gallery</a>
                <a href="#prenota" className="block text-white/60 hover:text-white font-light transition-colors">Prenota</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm font-light">
              © {new Date().getFullYear()} Guapacha. Tutti i diritti riservati.
            </p>
            <p className="text-white/20 text-xs tracking-[0.2em] uppercase">
              Movement · Elegance · Community
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

// Font Inter con subset latin
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Metadati SEO
export const metadata: Metadata = {
  title: 'Guapacha — Movement, elegance, community',
  description:
    'Guapacha: social dance, wedding, eventi, corsi PRO e sessioni individuali a Roma Parioli.',
  keywords: ['social dance', 'wedding', 'eventi', 'corsi', 'dance studio', 'Roma Parioli'],
  openGraph: {
    title: 'Guapacha — Movement, elegance, community',
    description:
      'Social dance, wedding, eventi, corsi PRO e sessioni individuali a Roma Parioli.',
    type: 'website',
  },
};

/**
 * Layout root dell'applicazione
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={inter.variable}>
      <body className="antialiased">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-sand-100/80 backdrop-blur-md border-b border-sand-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <a href="/" className="text-2xl font-display font-light tracking-wider text-sand-700">
                Guapacha
              </a>

              {/* Nav links */}
              <div className="hidden md:flex items-center gap-8">
                <a href="/servizi" className="text-sm text-sand-600 hover:text-sand-800 transition-colors">
                  Servizi
                </a>
                <a href="/#manifesto" className="text-sm text-sand-600 hover:text-sand-800 transition-colors">
                  Chi Siamo
                </a>
                <a href="/#cta" className="text-sm text-sand-600 hover:text-sand-800 transition-colors">
                  Contatti
                </a>
                <a
                  href="/servizi"
                  className="px-5 py-2 bg-sand-500 text-sand-100 rounded-full text-sm hover:bg-sand-600 transition-colors"
                >
                  Prenota
                </a>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-sand-600"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Contenuto principale con padding per navbar */}
        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-sand-800 text-sand-300 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-display text-sand-100 mb-3">Guapacha</h3>
                <p className="text-sm text-sand-400">
                  Social dance, wedding, eventi e percorsi individuali.
                  <br />
                  Movimento, eleganza, community.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sand-200 mb-3">Contatti</h4>
                <p className="text-sm text-sand-400">
                  Roma Parioli
                  <br />
                  Su appuntamento
                  <br />
                  lucadirienzo86@gmail.com
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sand-200 mb-3">Seguici</h4>
                <div className="flex gap-4">
                  <a href="/servizi" className="text-sand-400 hover:text-sand-200 text-sm">Servizi</a>
                  <a href="/#cta" className="text-sand-400 hover:text-sand-200 text-sm">Contatti</a>
                </div>
              </div>
            </div>
            <div className="border-t border-sand-700 mt-8 pt-8 text-center text-sm text-sand-500">
              © {new Date().getFullYear()} Guapacha. Tutti i diritti riservati.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

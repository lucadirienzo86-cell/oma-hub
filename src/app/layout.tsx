import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import '@/styles/globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Guapacha — Movement, elegance, community',
  description: 'Guapacha: social dance, wedding, eventi, corsi PRO e sessioni individuali a Roma Parioli. Dance studio premium.',
  keywords: ['social dance', 'wedding', 'eventi', 'corsi', 'dance studio', 'Roma Parioli', 'salsa', 'latino americana'],
  openGraph: {
    title: 'Guapacha — Movement, elegance, community',
    description: 'Social dance, wedding, eventi, corsi PRO e sessioni individuali a Roma Parioli.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}

'use client';

import { motion } from 'framer-motion';

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Singolo elemento del Bento Grid
 */
export function BentoItem({ children, className = '', delay = 0 }: BentoItemProps) {
  return (
    <motion.div
      className={`bento-item p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03 }}
    >
      {children}
    </motion.div>
  );
}

interface BentoGridProps {
  children: React.ReactNode;
}

/**
 * Griglia Bento asimmetrica per mobile
 * Layout adattivo con aree di dimensioni diverse
 */
export default function BentoGrid({ children }: BentoGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[minmax(120px,auto)] gap-3 md:gap-4 p-4 max-w-5xl mx-auto">
      {children}
    </div>
  );
}

/**
 * Varianti predefinite per il layout bento
 * Utilizzo: <BentoItem className={bentoVariants.featured}>
 */
export const bentoVariants = {
  // Elemento grande (2 colonne x 2 righe)
  featured: 'col-span-2 row-span-2 min-h-[280px]',
  // Elemento largo (2 colonne x 1 riga)
  wide: 'col-span-2',
  // Elemento alto (1 colonna x 2 righe)
  tall: 'row-span-2 min-h-[280px]',
  // Elemento standard (1x1)
  standard: '',
};

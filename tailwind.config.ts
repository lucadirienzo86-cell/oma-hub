import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colori tema Organic Minimalism
      colors: {
        sand: {
          50: '#FDFCFB',
          100: '#F5F0EB',
          200: '#EDE6DD',
          300: '#D4C5B5',
          400: '#B8A99A',
          500: '#8B7D6B',
          600: '#6B5D4F',
          700: '#4A3F35',
          800: '#2E261F',
          900: '#1A1510',
        },
        terra: {
          300: '#C9A87C',
          400: '#B8944F',
          500: '#9A7B3A',
        },
        cemento: {
          400: '#9E9E9E',
          500: '#7A7A7A',
        },
      },
      // Tipografia fluida
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.25vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.4vw, 1.125rem)',
        'fluid-lg': 'clamp(1.25rem, 1rem + 1vw, 1.75rem)',
        'fluid-xl': 'clamp(1.5rem, 1rem + 2vw, 2.5rem)',
        'fluid-2xl': 'clamp(2rem, 1.2rem + 3vw, 4rem)',
        'fluid-3xl': 'clamp(2.5rem, 1.5rem + 4vw, 5.5rem)',
      },
      // Animazioni personalizzate
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      // Font family
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

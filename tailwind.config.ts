import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        ink: {
          50: '#F4F5F7',
          100: '#E5E7EB',
          200: '#C7CBD3',
          300: '#9AA1AE',
          400: '#6B7280',
          500: '#454B57',
          600: '#2E323C',
          700: '#1D2027',
          800: '#171921',
          900: '#12141A',
          950: '#0B0C10',
        },
        accent: {
          50: '#FFF3EB',
          100: '#FFE2CC',
          200: '#FFC599',
          300: '#FFA35C',
          400: '#FF8938',
          500: '#FF6B1A',
          600: '#F05A0E',
          700: '#C7460A',
          800: '#9C370A',
          900: '#7C2E0C',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 30px -12px rgba(15, 17, 21, 0.25)',
        glow: '0 0 0 1px rgba(255,107,26,0.15), 0 8px 30px -10px rgba(255,107,26,0.35)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(ellipse at top, rgba(255,107,26,0.12), transparent 60%)',
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.6s ease-out both',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0a0b0e',
          900: '#101216',
          800: '#181b22',
          700: '#232733',
          600: '#323747',
        },
        ff: {
          orange: '#FF5A00',
          amber: '#FF9900',
          yellow: '#FFC800',
          red: '#E52521',
          gold: '#FFD700',
          dark: '#0B0D11',
          card: '#131720',
          cardBorder: '#232a3b',
          accent: '#FF7700',
        },
      },
      fontFamily: {
        sans: ['var(--font-rajdhani)', 'var(--font-inter)', 'sans-serif'],
        display: ['var(--font-rajdhani)', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(255, 90, 0, 0.4)',
        'glow-amber': '0 0 25px -5px rgba(255, 153, 0, 0.35)',
        'glow-red': '0 0 25px -5px rgba(229, 37, 33, 0.4)',
        'card-hover': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 15px 0 rgba(255, 90, 0, 0.15)',
      },
      backgroundImage: {
        'ff-gradient': 'linear-gradient(135deg, #FF5A00 0%, #FF9900 100%)',
        'ff-fire': 'linear-gradient(135deg, #E52521 0%, #FF5A00 50%, #FFB800 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(26, 31, 44, 0.8) 0%, rgba(16, 18, 24, 0.95) 100%)',
      }
    },
  },
  plugins: [],
};

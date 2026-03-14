import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C96D',
          dark: '#A07830',
          50: '#FBF5E6',
          100: '#F5E8C0',
          200: '#EDD48A',
          300: '#E5BF54',
          400: '#C9A84C',
          500: '#A07830',
          600: '#7A5820',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          2: '#111111',
          3: '#161616',
          4: '#1E1E1E',
          5: '#252525',
        },
        silver: {
          DEFAULT: '#B8B8B8',
          light: '#E0E0E0',
          dark: '#808080',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-montserrat)', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-gold': 'glow-gold 3s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grain': 'grain 0.4s steps(1) infinite',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'glow-gold': {
          '0%': { boxShadow: '0 0 20px rgba(201,168,76,0.2), 0 0 40px rgba(201,168,76,0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(201,168,76,0.6), 0 0 80px rgba(201,168,76,0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(201,168,76,0.7)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 15px rgba(201,168,76,0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(201,168,76,0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-2%,-3%)' },
          '20%': { transform: 'translate(3%,2%)' },
          '30%': { transform: 'translate(-1%,4%)' },
          '40%': { transform: 'translate(2%,-1%)' },
          '50%': { transform: 'translate(-3%,2%)' },
          '60%': { transform: 'translate(1%,-4%)' },
          '70%': { transform: 'translate(-2%,3%)' },
          '80%': { transform: 'translate(3%,-2%)' },
          '90%': { transform: 'translate(-1%,1%)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #A07830 0%, #C9A84C 30%, #E8C96D 60%, #C9A84C 80%, #A07830 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 0%, rgba(10,10,10,0.8) 60%, rgba(10,10,10,0.98) 100%)',
        'hero-gradient': 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 60%), linear-gradient(180deg, #0A0A0A 0%, #0D0D0D 100%)',
      },
    },
  },
  plugins: [],
}

export default config

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mindpex: {
          gold: '#B58342',
          'gold-light': '#d4a05a',
          amber: '#D97706',
          'amber-glow': '#FCD34D',
          dark: '#1C1917',
          'dark-warm': '#292524',
          'dark-gray': '#44403C',
          'dark-gray-light': '#57534E',
          plum: '#4C1D95',
          'plum-dark': '#2E1065',
          chocolate: '#451A03',
          'chocolate-warm': '#78350F',
        }
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in-slow': 'fadeInSlow 0.8s ease-out',
        'fade-in-gentle': 'fadeInGentle 1s ease-out',
        // New Motion Principles Animations
        'fade-out': 'fade-out 240ms cubic-bezier(0.6, 0.05, 0.2, 0.9) forwards', // slight ease-in
        'fade-in-rise': 'fade-in-rise 280ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'fade-in-static': 'fade-in-static 350ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'typing-dots': 'typing 2.5s ease-in-out infinite',
        'breathing': 'breathing 4s ease-in-out infinite',
        'breathing-slow': 'breathingSlow 6s ease-in-out infinite',
        'breathing-irregular': 'breathingIrregular 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'breathing-presence': 'breathingPresence 7s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'settle': 'settle 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'candle-flicker': 'candleFlicker 4s ease-in-out infinite',
        'sanctuary-arrive': 'sanctuaryArrive 2s ease-out',
        'input-pulse': 'inputPulse 1.5s ease-in-out',
        'soft-jitter': 'softJitter 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': {
            boxShadow: '0 20px 25px -5px rgba(181, 131, 66, 0.3)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 25px 30px -5px rgba(181, 131, 66, 0.4)',
            transform: 'scale(1.02)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInSlow: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        // New Motion Principles Keyframes
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'fade-in-rise': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-static': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInGentle: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.92)' },
          '60%': { opacity: '0.5' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        typing: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.9' },
        },
        breathing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.03)', opacity: '1' },
        },
        breathingSlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(217, 119, 6, 0.3), 0 0 40px rgba(217, 119, 6, 0.1)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(217, 119, 6, 0.4), 0 0 60px rgba(217, 119, 6, 0.2)',
            transform: 'scale(1.02)'
          },
        },
        breathingIrregular: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '20%': { transform: 'scale(1.025)', opacity: '0.9' },
          '25%': { transform: 'scale(1.025)', opacity: '0.9' }, // pause
          '45%': { transform: 'scale(0.98)', opacity: '0.85' },
          '50%': { transform: 'scale(0.98)', opacity: '0.85' }, // pause
          '70%': { transform: 'scale(1.035)', opacity: '0.95' },
          '85%': { transform: 'scale(1.01)', opacity: '0.88' },
          '100%': { transform: 'scale(1)', opacity: '0.8' },
        },
        breathingPresence: {
          '0%, 100%': {
            opacity: '1',
            transform: 'translateY(0px)',
          },
          '50%': {
            opacity: '0.85',
            transform: 'translateY(-2px)',
          },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(252, 211, 77, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(252, 211, 77, 0.5)' },
        },
        settle: {
          '0%': { transform: 'translateY(-5px) scale(1.02)' },
          '60%': { transform: 'translateY(2px) scale(0.99)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        candleFlicker: {
          '0%, 100%': { opacity: '0.9' },
          '25%': { opacity: '0.95' },
          '50%': { opacity: '0.85' },
          '75%': { opacity: '0.92' },
        },
        sanctuaryArrive: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
            filter: 'blur(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
            filter: 'blur(0)'
          },
        },
        inputPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(217, 119, 6, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(217, 119, 6, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(217, 119, 6, 0)' },
        },
        softJitter: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-1px)' },
          '75%': { transform: 'translateX(1px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}

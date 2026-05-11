/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        berry: {
          50: '#FFF0F3',
          100: '#FFE0E8',
          200: '#FFC2D4',
          300: '#FF94B0',
          400: '#FF5C85',
          500: '#FF2D5E',
          600: '#ED1149',
          700: '#C80D3E',
          800: '#A80F39',
          900: '#8F1136',
          950: '#500419',
        },
        cream: {
          50: '#FFFCFA',
          100: '#FFF8F0',
          200: '#FFF0E0',
          300: '#FFE4C8',
          400: '#FFD4A8',
        },
        strawberry: {
          light: '#FFE4EC',
          DEFAULT: '#FF4D6D',
          dark: '#C9184A',
          glow: '#FF8FA3',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'berry-mesh': 'linear-gradient(135deg, #FFF0F3 0%, #FFFFFF 25%, #FFE0E8 50%, #FFFFFF 75%, #FFF0F3 100%)',
        'hero-gradient': 'linear-gradient(160deg, #FFF0F3 0%, #FFFFFF 30%, #FFE4EC 60%, #FFF8F0 100%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.8) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 1s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 45, 94, 0.3), 0 0 40px rgba(255, 45, 94, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 45, 94, 0.5), 0 0 60px rgba(255, 45, 94, 0.2)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wave: {
          '0%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.4)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.08)',
        'berry': '0 8px 32px rgba(255, 45, 94, 0.15)',
        'berry-lg': '0 16px 48px rgba(255, 45, 94, 0.2)',
        'float': '0 20px 60px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}

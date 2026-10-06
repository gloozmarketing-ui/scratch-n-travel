/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0F19',
        surface: '#111726',
        card: '#161F31',
        line: 'rgba(148,163,184,0.12)',
        brand: { DEFAULT: '#4F6DF5', light: '#7C92FF', dark: '#3A54D4' },
        mint: '#34D399',
        amber: '#FBBF24',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 50px -20px rgba(0,0,0,0.6)',
        glow: '0 0 60px -12px rgba(79,109,245,0.45)',
      },
    },
  },
  plugins: [],
}

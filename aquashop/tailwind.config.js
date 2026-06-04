/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:      '#0077B6',
        'primary-dark': '#023E8A',
        secondary:    '#00B4D8',
        accent:       '#FF6B35',
        'bg-light':   '#F0F7FF',
        'text-dark':  '#1A1A2E',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%':      { transform: 'translateX(-25%)' },
        },
      },
      animation: {
        wave:       'wave 8s linear infinite',
        'wave-slow':'wave 12s linear infinite',
      },
    },
  },
  plugins: [],
}

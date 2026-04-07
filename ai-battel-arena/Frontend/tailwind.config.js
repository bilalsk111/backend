/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Defined based on your screenshot palette
        arena: {
          bg: '#080b10',
          sidebar: '#0d1117',
          card: '#161b22',
          border: '#21262d',
          text: '#e6edf3',
          sub: '#8b949e',
        },
        keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}}
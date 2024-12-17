/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef3ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a4b9fc',
          400: '#8193f9',
          500: '#1f51fe',
          600: '#2f44e9',
          700: '#2937d3',
          800: '#2830aa',
          900: '#252e85',
          950: '#1a1d4d',
        }
      }
    },
  },
  plugins: [],
};
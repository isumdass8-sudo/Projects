/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          950: '#0A2C2E',
          900: '#0F3D40',
          800: '#14545A',
          700: '#1B6B72',
          600: '#236E75',
          500: '#2C868E',
        },
        gold: {
          600: '#B4832F',
          500: '#C99A3E',
          400: '#D4B05D',
          300: '#E1C687',
        },
        clay: {
          700: '#9A4A25',
          600: '#BF5B2E',
          500: '#D0703F',
        },
        forest: {
          700: '#3A6430',
          600: '#4A7A3A',
          400: '#8FBE6C',
        },
        sand: {
          50: '#FBF9F3',
          100: '#F6F2E7',
          200: '#EFE8D6',
        },
        ink: {
          900: '#211E19',
          700: '#403A31',
          500: '#6B6258',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        soft: '0 20px 60px -25px rgba(15, 61, 64, 0.35)',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F3A2E',
          light: '#2F4F3E',
          dark: '#122318'
        },
        guava: {
          DEFAULT: '#E85D75',
          dark: '#C43F58'
        },
        soil: '#6B4226',
        gold: '#C9A227',
        parchment: '#F3F6F1'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Public Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      }
    }
  },
  plugins: []
};

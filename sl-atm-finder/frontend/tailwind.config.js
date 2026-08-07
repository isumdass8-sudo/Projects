/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B2B2C',        // near-black teal, primary text
        harbor: '#0F3D3E',     // deep teal - primary brand color
        harborLight: '#1A5859',
        gold: '#C99A2E',       // temple-gold accent
        coral: '#E4593F',      // alerts / reports / distance-critical
        paper: '#F3F1EA',      // background
        mist: '#DCE3E0',       // borders / dividers
        board: '#0A1F20',      // departure-board background (near black teal)
        boardText: '#E7C351',  // departure-board amber text
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
      },
    },
  },
  plugins: [],
};

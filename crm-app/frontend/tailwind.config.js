/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12181B',
        slate: {
          950: '#0B1215',
        },
        brass: {
          50: '#FBF4E9',
          200: '#EFD8A8',
          400: '#D9A94C',
          500: '#C4922F',
          600: '#9C7226',
        },
        pine: {
          50: '#EEF3F0',
          100: '#DCE7E0',
          400: '#5C8A73',
          500: '#3F6B54',
          600: '#2E5140',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};

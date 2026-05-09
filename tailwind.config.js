/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel:   ['Cinzel', 'serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono:     ['"Space Mono"', 'monospace'],
      },
      colors: {
        gold:    '#C8A96E',
        'gold-bright': '#EDD28A',
        'gold-dim':    '#7A5A24',
        cyan:    '#4ECDC4',
        purple:  '#A855F7',
        bg:      '#050810',
        card:    '#0B1121',
        surface: '#0E1828',
      },
    },
  },
  plugins: [],
};
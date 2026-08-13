/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cerulean: '#124874',
          jasper: '#CF373D',
          cream: '#FDFBF7',
          ink: '#1A1A1A'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        body: ['"Newsreader"', 'serif'],
        sans: ['system-ui', 'sans-serif']
      },
      boxShadow: {
        'editorial': '4px 4px 0px 0px rgba(18,72,116,0.1)',
        'editorial-hover': '6px 6px 0px 0px rgba(18,72,116,0.2)',
      }
    },
  },
  plugins: [],
}
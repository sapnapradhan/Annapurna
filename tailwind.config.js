/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        annapurna: {
          50: '#fdfbf7',
          100: '#f5efe6',
          200: '#ebe4d8',
          300: '#dcd1c0',
          400: '#c86d44',
          500: '#b35c33',
          600: '#8c4424',
          700: '#68311a',
          800: '#482112',
          900: '#2c221e',
        },
        bubblegum: {
          pink: '#FF4D8D',
          rose: '#FF75A0',
          darkPink: '#FF1E6B',
          blue: '#00D2FF',
          purple: '#B5179E',
          yellow: '#FFD000',
          mint: '#00F5D4',
          orange: '#FF9770',
          bg: '#0F0B1E',
        },
        editorial: {
          cream: '#FDFBF7',
          sand: '#F5EFE6',
          border: '#EBE4D8',
          darkBg: '#090807',
          darkSurface: '#0F0E0D',
          darkBorder: '#1F1B18',
          terracotta: '#C86D44',
          accentGold: '#D48C46',
        }
      },
      fontFamily: {
        bubblegum: ['Fredoka', 'Titan One', 'Sniglet', 'sans-serif'],
        titan: ['Titan One', 'Fredoka', 'sans-serif'],
        cursive: ['Dancing Script', 'Caveat', 'cursive'],
        caveat: ['Caveat', 'Dancing Script', 'cursive'],
        crayon: ['Fredericka the Great', 'Cabin Sketch', 'Cinzel', 'serif'],
        cinzel: ['Cinzel', 'Cinzel Decorative', 'serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'homepage-pattern': "url('/homepage-bg.jpg')",
        'student-pattern': "url('/student-bg.jpg')",
        'culinary-pattern': "url('/background.jpg')",
      }
    },
  },
  plugins: [],
}

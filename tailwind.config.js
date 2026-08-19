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
        editorial: {
          cream: '#FDFBF7',
          sand: '#F5EFE6',
          border: '#EBE4D8',
          darkBg: '#12100F',
          darkSurface: '#1A1715',
          darkBorder: '#2C2724',
          terracotta: '#C86D44',
          accentGold: '#D48C46',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'culinary-pattern': "url('/background.jpg')",
      }
    },
  },
  plugins: [],
}

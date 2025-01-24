/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Logo: ['Handlee', 'serif'], // Add your Google Font here
        instumrntalSans:['Instrument Sans', 'serif'],
        Ubuntu: ['Ubuntu', 'serif'],
        lala: ['Great Vibes', 'serif'],
      },
      colors:{
        'my-yellow': '#F8A128',
        'my-grey': '#F6F6F6'
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  
    extend: {
      colors:{
        'back' : "#dddedd",
        'primaryDark' : '#22092C',
        'primarylight' : '#BE3144',
        'primarylighter': '#860A35',
        'primarylightDark' : '#860A35',
        'light' : '#BACDDB'
      }
    },
  },
  plugins: [],
}


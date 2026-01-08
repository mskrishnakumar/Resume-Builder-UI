/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Bricolage Grotesque', 'Outfit', 'sans-serif'],
        resume: ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

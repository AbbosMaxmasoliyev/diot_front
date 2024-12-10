// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/shadcn/ui/**/*.{js,ts,jsx,tsx}", // SHADCN komponentlarini qo'shish
  ],
  darkMode: 'class', // yoki 'media' if you want it to be based on media query

  theme: {
    extend: {

    },
  },
  plugins: [],
}

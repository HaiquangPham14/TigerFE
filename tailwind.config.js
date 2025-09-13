/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['"BarlowCondensed"', "sans-serif"],
    dollie: ['"DollieScript"', "cursive"],  
      },
    },
  },
  plugins: [],
};
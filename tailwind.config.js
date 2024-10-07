/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        montserratAlternates: ["Montserrat Alternates", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "light-gray": "rgba(255, 255, 255, 0.6)",
        "yellow": "#EDD382",
      },
    },
  },
  plugins: [],
};

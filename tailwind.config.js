/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        dmMono: ["DM Mono", 'monospace'],
      },
      colors: {
        "deep-blue": "#006A94",
        "light-blue": "#CCE1EA",
        "dark-gray": "rgba(0, 0, 0, 0.85)",
        gray: "rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};

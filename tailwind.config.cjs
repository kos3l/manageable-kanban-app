/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: "'Hind'",
      serif: "'Montserrat'",
    },
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/src/assets/graph-paper.svg')",
      },
      fontSize: {
        "4xl": "2.441rem",
        "5xl": "4.052rem",
      },
      dropShadow: {
        "3xl": "0 0px 35px rgba(0, 0, 0, 0.25)",
        "4xl": [
          "0 0px 35px rgba(0, 0, 0, 0.25)",
          "0 0px 25px rgba(0, 0, 0, 0.05)",
        ],
      },
    },
  },
  plugins: [],
};

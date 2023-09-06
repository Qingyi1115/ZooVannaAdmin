/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter"],
        dmSans: ["DM Sans"],
      },
      colors: {
        "zoovanna-green": "#84985A",
        "zoovanna-light-cream": "#FFFDF8",
        "zoovanna-cream": "#FDF2E6",
        "zoovanna-beige": "#C69B5D",
        "zoovanna-brown": "#553727",
        "zoovanna-red": "#CC572B",
      },
    },
  },
  plugins: [],
};

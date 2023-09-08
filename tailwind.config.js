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
        "zoovanna-green-light": "F5F9E4",
        "zoovanna-green": "#84985A",
        "zoovanna-green-dark": "#617E42",
        "zoovanna-cream-light": "#FFF9F2",
        "zoovanna-cream": "#FDF2E6",
        "zoovanna-beige": "#C69B5D",
        "zoovanna-brown": "#553727",
        "zoovanna-red": "#CC572B",
      },
      animation: {
        slideDown: "slideDown 100ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 100ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        left: "left 0.5s ease-in-out 1",
        right: "right 0.5s ease-in-out 1",
      },
      keyframes: {
        right: {
          "0%": { transform: "translate(100%, 0%)" },
          "100%": { transform: "translate(0%, 0%)" },
        },
        left: {
          "0%": { transform: "translate(-100%, 0%)" },
          "100%": { transform: "translate(0%, 0%)" },
        },
      },
      colors: {
        primary_b: "#353540",
      },
    },
  },
  plugins: [],
};

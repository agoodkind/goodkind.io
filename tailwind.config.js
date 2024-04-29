/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    nightwind: {
      colors: {
        white: "gray.900",
        black: "gray.50"
      }
    }
  },
  darkMode: "class",
  plugins: [require("nightwind")]
};

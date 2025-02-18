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
  // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
  plugins: [require("nightwind")]
};

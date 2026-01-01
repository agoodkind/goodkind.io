/**
 * Tailwind CSS configuration
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ["./views/**/*.templ"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        surfaced: {
          "0%": { opacity: "0.85", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        surfaced: "surfaced 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
      },
    },
  },
};

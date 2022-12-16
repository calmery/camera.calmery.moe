/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    backdropBlur: {
      DEFAULT: "0.25rem",
    },
    fontSize: {
      12: ["0.75rem", "1rem"],
      16: ["1rem", "1.25rem"],
      20: ["1.25rem", "1.5rem"],
    },
  },
  plugins: [],
};

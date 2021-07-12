module.exports = {
  darkMode: "class",
  mode: process.env.NODE_ENV !== "production" ? "jit" : undefined,
  plugins: [],
  purge: ["./src/**/*.tsx"],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
};

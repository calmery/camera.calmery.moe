const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  presets: ["next/babel"],
  plugins: [
    [
      "babel-plugin-styled-components",
      {
        displayName: !isProduction,
        fileName: !isProduction,
        pure: true,
        ssr: isProduction,
      },
    ],
  ],
};

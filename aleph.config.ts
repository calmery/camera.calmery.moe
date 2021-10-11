import type { Config } from "aleph/types.d.ts";
import emotion from "./node_modules/@calmery-chan/aleph-plugin-emotion/mod.ts";
import tailwindcss from "./node_modules/@calmery-chan/aleph-plugin-tailwindcss/mod.ts";

export default <Config> {
  build: {
    target: "es2020",
  },
  i18n: {
    defaultLocale: "ja",
    locales: ["en", "ja"],
  },
  plugins: [emotion, tailwindcss],
};

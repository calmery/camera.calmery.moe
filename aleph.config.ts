import type { Config } from "aleph/types.d.ts";
import emotion from "./plugins/emotion.ts";
import tailwindcss from "./plugins/tailwindcss.ts";

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

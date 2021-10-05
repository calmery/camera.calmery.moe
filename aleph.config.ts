import type { Config } from "aleph/types.d.ts";
import tailwindcss from "./plugins/tailwindcss.ts";

export default <Config> {
  build: {
    target: "es2020",
  },
  i18n: {
    defaultLocale: "ja",
    locales: ["en", "ja"],
  },
  plugins: [tailwindcss("./styles/tailwind.css")],
};

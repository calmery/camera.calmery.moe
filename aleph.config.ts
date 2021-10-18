import type { Config } from "aleph/types.d.ts";
import emotion from "./node_modules/@calmery-chan/aleph-plugin-emotion/plugin.ts";
import tailwindcss from "https://deno.land/x/calmery_chan_aleph_plugin_tailwindcss@v2.0.0/plugin.ts";

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

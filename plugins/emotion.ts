import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import type { Plugin } from "aleph/types.d.ts";
import * as colors from "fmt/colors";
import * as React from "react";
import { renderToString } from "react-dom/server";

// Helper Functions

const log = (...messages: string[]) => {
  console.log(colors.magenta("Emotion"), ...messages);
};

// State

const state: { styles: { [key: string]: string } } = {
  styles: {},
};

// Main

export default <Plugin> {
  name: "emotion",
  async setup(aleph) {
    const cache = createCache({ key: "aleph" });
    const { extractCriticalToChunks, constructStyleTagsFromChunks } =
      createEmotionServer(cache);

    aleph.onTransform(/pages\/.+\.tsx$/, async ({ module }) => {
      const { specifier } = module;

      // `@emotion/babel-preset-css-prop` などが使用できないためか、正常に動作しない
      const styles = constructStyleTagsFromChunks(
        extractCriticalToChunks(renderToString(
          React.createElement(
            CacheProvider,
            { value: cache },
            React.createElement(
              (await import(`../src${specifier}`)).default,
            ),
          ),
        )),
      );

      log(styles);

      state.styles[specifier] = styles;
    });

    aleph.onRender(({ html, path }) => {
      html.head.push(`${Object.values(state.styles).join("")}`);
    });
  },
};

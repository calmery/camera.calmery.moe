import type { Aleph, Plugin } from "aleph/types.d.ts";
import type { RequiredConfig } from "aleph/server/config.ts";
import * as colors from "fmt/colors";
import * as React from "react";
import { renderToString } from "react-dom/server";
import * as path from "path";

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
  async setup(aleph: Aleph & { config: RequiredConfig }) {
    const pluginDirectory = path.resolve(
      aleph.workingDir,
      "./plugins/emotion/",
    );

    Deno.run({
      cmd: [
        "npx",
        "webpack",
        "--config",
        path.resolve(pluginDirectory, "./webpack.config.js"),
        "--watch",
      ],
      env: {
        ALEPH_SOURCE_DIRECTORY: aleph.workingDir + aleph.config.srcDir,
        ALEPH_WORKING_DIRECTORY: aleph.workingDir,
        ALEPH_MODE: aleph.mode,
      },
      stderr: "null",
      stdout: "null",
    });

    log("webpack started");

    aleph.onTransform(/pages\/.+\.tsx$/, async ({ module }) => {
      const { specifier } = module;
      const styles = new TextDecoder().decode(
        await Deno.run({
          cmd: [
            "node",
            path.resolve(pluginDirectory, `./output${specifier}.js`),
          ],
          stdout: "piped",
        }).output(),
      );

      log("extracted", specifier);

      state.styles[specifier] = styles;
    });

    aleph.onRender(({ html }) => {
      html.head.push(
        `<style data-emotion ssr>${
          Object.values(state.styles).join("")
        }</style>`,
      );
    });
  },
};

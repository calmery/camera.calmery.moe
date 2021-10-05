import type { Aleph, Plugin } from "aleph/types.d.ts";
import type { RequiredConfig } from "aleph/server/config.ts";
import * as colors from "fmt/colors";
import * as path from "path";

// Helper Functions

const log = (...messages: string[]) => {
  console.log(colors.blue("Tailwind CSS"), ...messages);
};

const makeTempCssFile = () => {
  return Deno.makeTempFile({ suffix: ".css" });
};

const watch = async (filePath: string, callback: (string: string) => void) => {
  const watcher = Deno.watchFs(filePath);

  for await (const event of watcher) {
    if (event.kind === "modify") {
      callback(
        new TextDecoder().decode(await Deno.readFile(filePath)),
      );
    }
  }
};

// State

const state = {
  css: "",
};

// Main

export default <Plugin> {
  name: "tailwindcss",
  async setup(aleph: Aleph & { config: RequiredConfig }) {
    if (!!Deno.env.get("CI")) {
      return;
    }

    const inputFilePath = await makeTempCssFile();
    const outputFilePath = await makeTempCssFile();

    // Input

    await Deno.writeFile(
      inputFilePath,
      new TextEncoder().encode(`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `),
    );
    log("created", `'${inputFilePath}'`);

    // Events

    aleph.onRender(({ html }) => {
      html.head.push(`<style>${state.css}</style>`);
    });

    // Helper Functions

    const build = (watch: boolean) => {
      return Deno.run({
        cmd: [
          "tailwindcss",
          "build",
          "--input",
          inputFilePath,
          "--output",
          outputFilePath,
          "--purge",
          path.resolve(
            aleph.workingDir,
            path.isAbsolute(aleph.config.srcDir)
              ? `.${aleph.config.srcDir}`
              : aleph.config.srcDir,
            "./**/*.tsx",
          ),
          watch ? "--watch" : "--minify",
        ],
        stdout: watch ? "null" : "piped",
        stderr: "null",
      });
    };

    // Main

    state.css = new TextDecoder().decode(await build(false).output());
    log("updated", `'${outputFilePath}'`);

    if (aleph.mode === "development") {
      watch(outputFilePath, (string) => {
        state.css = string;
        log("updated", `'${outputFilePath}'`);
      });

      build(true);
    }
  },
};

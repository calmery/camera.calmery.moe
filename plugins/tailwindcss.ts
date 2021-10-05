import type { Plugin } from "aleph/types.d.ts";
import type { RequiredConfig } from "aleph/server/config.ts";
import * as path from "path";

export default (outputFilePath: string) =>
  <Plugin> {
    name: "tailwindcss",
    async setup({ config, mode, workingDir }) {
      const { srcDir } = config as RequiredConfig;
      const src = path.resolve(
        workingDir,
        path.isAbsolute(srcDir) ? `.${srcDir}` : srcDir,
      );

      const stylesheet = await Deno.makeTempFile();
      await Deno.writeFile(
        stylesheet,
        new TextEncoder().encode(`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `),
      );

      Deno.run({
        cmd: [
          "tailwindcss",
          "build",
          "--input",
          stylesheet,
          "--output",
          path.isAbsolute(outputFilePath)
            ? outputFilePath
            : path.resolve(src, outputFilePath),
          "--purge",
          path.resolve(src, "./**/*.tsx"),
          "--watch",
        ].concat(mode === "production" ? ["--minify"] : []),
        env: {
          NODE_ENV: mode,
        },
      });
    },
  };

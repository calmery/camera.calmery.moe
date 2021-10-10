const fs = require("fs");
const glob = require("glob");
const path = require("path");

// Directories

const entryDirectory = path.resolve(__dirname, "./entries/");
const sourceDirectory = process.env.ALEPH_SOURCE_DIRECTORY || "./";
const workingDirectory = process.env.ALEPH_WORKING_DIRECTORY || "./";

console.log(entryDirectory);
console.log(sourceDirectory);
console.log(workingDirectory);

//

const nodeModules = path.resolve(workingDirectory, "./node_modules/");

const createEntry = (absoluteFilePath) => {
  const filename = path.relative(sourceDirectory, absoluteFilePath);
  const fullPath = path.resolve(entryDirectory, filename) + ".js";

  fs.writeFileSync(
    fullPath,
    `
const { extractCritical } = require("${nodeModules}/@emotion/server");
const React = require("${nodeModules}/react");
const { renderToString } = require("${nodeModules}/react-dom/server");
const { default: Component } = require("${absoluteFilePath}");

console.log(
  extractCritical(
    renderToString(React.createElement(Component)),
  ).css,
);
    `,
  );

  return fullPath;
};

// Deno

const { imports } = require(
  path.resolve(workingDirectory, "./import_map.json"),
);

// Configuration

module.exports = {
  entry: glob
    .sync(path.resolve(sourceDirectory, "./pages/**/*.tsx"))
    .map(createEntry)
    .reduce((entry, filePath) => {
      entry[filePath.replace(new RegExp(entryDirectory), "")] = filePath;
      return entry;
    }, {}),
  mode: process.env.ALEPH_MODE || "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript", "@babel/preset-react"],
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "[name]",
    path: path.resolve(__dirname, "./output/"),
  },
  resolve: {
    // TODO: `aleph/` など、最後が `/` で終わるパスの解決ができない
    alias: Object.keys(imports)
      .filter((alias) => imports[alias].startsWith("https://deno.land/x/"))
      .reduce((aliases, alias) => {
        aliases[alias] = path.resolve(__dirname, "./mock.js");
        return aliases;
      }, {}),
  },
  target: "node",
};

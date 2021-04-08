const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

require("nextjs-sitemap-generator")({
  baseUrl: process.env.ORIGIN,
  ignoredExtensions: ["js", "map"],
  ignoredPaths: ["404", "500"],
  pagesDirectory: path.resolve(__dirname, "../.next/serverless/pages"),
  targetDirectory: "public/",
});

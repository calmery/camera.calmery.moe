#!/usr/bin/env node

const { spawnSync } = require("child_process");
const path = require("path");

const currentDirectory = path.resolve(__dirname, "..");

spawnSync(path.resolve(currentDirectory, "node_modules/.bin/next"), ["dev"], {
  cwd: currentDirectory,
  stdio: "inherit",
});

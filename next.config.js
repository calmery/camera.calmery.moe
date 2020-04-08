const path = require("path");

module.exports = {
  webpack: (config) => {
    config.resolve.alias["~"] = path.resolve(__dirname, "src");
    return config;
  },
};

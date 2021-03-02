const path = require("path");

// Reference: https://vercel.com/docs/environment-variables#system-environment-variables
const env = {
  VERCEL_ENV: process.env.VERCEL_ENV,
};

const webpack = (config, options) => {
  config.resolve.alias["~"] = path.resolve(__dirname, "src");

  if (!options.isServer) {
    config.resolve.alias["@sentry/node"] = "@sentry/react";
  }

  return config;
};

module.exports = {
  env,
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  trailingSlash: false,
  webpack,
};

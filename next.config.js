const webpack = (config, options) => {
  config.resolve.alias["~"] = path.resolve(__dirname, "src");

  return config;
}

module.exports = {
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  trailingSlash: false,
  webpack,
};

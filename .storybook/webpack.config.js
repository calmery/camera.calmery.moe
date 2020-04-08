const { webpack } = require("../next.config");

module.exports = ({ config }) => {
  config.resolve.extensions.push(".ts", ".tsx");
  config.module.rules.push({
    test: /\.tsx?$/,
    loader: require.resolve("babel-loader"),
    options: {
      presets: [require.resolve("babel-preset-react-app")]
    }
  });

  return webpack(config);
};

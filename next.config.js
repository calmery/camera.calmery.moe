/** @type {import('next').NextConfig} */
const nextConfig = {
  // `i18n` を変更するときは ~/libs/i18n.ts も忘れずに変更する
  i18n: {
    defaultLocale: "ja",
    locales: ["en", "ja"],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;

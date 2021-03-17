import * as path from "path";
import SentryWebpackPlugin from "@sentry/webpack-plugin";
import { TransformOptions } from "esbuild";
import { build } from "next/dist/build/webpack/config";
import { NextConfig } from "next/dist/next-server/server/config";
import { RuleSetRule } from "webpack";
import { defaultLocale, locales } from "./src/locales";
import tsconfigJson from "./tsconfig.json";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: !!process.env.ANALYZE,
});

const {
  GITHUB_RELEASE_TAG_NAME,
  GITHUB_REPOSITORY,
  GITHUB_SHA,
  NODE_ENV,
  ORIGIN,
  SENTRY_AUTH_TOKEN,
  SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  VERCEL_ENV,
} = process.env;

// Reference: https://vercel.com/docs/environment-variables#system-environment-variables
// The Environment that the app is deployed an running on. The value can be either `production`, `preview`, or `development`.
const env = {
  ORIGIN,
  SENTRY_DSN,
  VERCEL_ENV,
};

const webpack: typeof build = (config, { isServer }) => {
  config.resolve.alias["~"] = path.resolve(__dirname, "src");

  if (!isServer) {
    config.resolve.alias["@sentry/node"] = "@sentry/react";
  }

  // 開発中のみ使用するため TerserPlugin の置き換えは必要ない
  if (!process.env.CI && NODE_ENV !== "production") {
    const rule = config.module.rules.find(
      (rule: RuleSetRule) =>
        rule.use && rule.test instanceof RegExp && rule.test.test(".js")
    );

    if (rule) {
      const options: TransformOptions = {
        loader: "tsx",
        tsconfigRaw: JSON.stringify(tsconfigJson),
      };

      rule.use.loader = "esbuild-loader";
      rule.use.options = options;
    }
  }

  if (
    GITHUB_REPOSITORY &&
    GITHUB_SHA &&
    SENTRY_AUTH_TOKEN &&
    SENTRY_DSN &&
    SENTRY_ORG &&
    SENTRY_PROJECT
  ) {
    config.plugins.push(
      new SentryWebpackPlugin({
        deploy: {
          env: VERCEL_ENV || NODE_ENV,
        },
        ignore: ["node_modules"],
        include: ".next",
        release: GITHUB_RELEASE_TAG_NAME || GITHUB_SHA,
        setCommits: {
          // Sentry にある Vercel の Integration で追加される SENTRY_AUTH_TOKEN だとスコープの設定でデプロイに失敗してしまう
          // error: API request failed
          //   caused by: sentry reported an error: You do not have permission to perform this action. (http status: 403)
          // https://sentry.io/settings/account/api/auth-tokens/ で認証トークンを作成、Vercel に登録する必要がある
          // `event:read` と `event:write`、`org:integrations`、`org:read`、`org:write`、`project:read`、`project:releases`、`project:write` を追加した
          commit: GITHUB_SHA,
          repo: GITHUB_REPOSITORY,
        },
        stripPrefix: ["webpack://_N_E/"],
        urlPrefix: `~/_next`,
      })
    );
  }

  return config;
};

const configuration: NextConfig = {
  env,
  future: {
    excludeDefaultMomentLocales: false,
    strictPostcssConfiguration: false,
    webpack5: true,
  },
  i18n: {
    defaultLocale,
    locales: locales.slice(),
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  target: "serverless",
  trailingSlash: false,
  webpack,
};

export default withBundleAnalyzer(configuration);

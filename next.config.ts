import * as path from "path";
import SentryWebpackPlugin from "@sentry/webpack-plugin";
import { defaultLocale, locales } from "./src/locales";

const {
  GITHUB_RELEASE_TAG_NAME,
  GITHUB_REPOSITORY,
  GITHUB_SHA,
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  NODE_ENV,
  SENTRY_AUTH_TOKEN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  VERCEL_ENV,
} = process.env;

// Reference: https://vercel.com/docs/environment-variables#system-environment-variables
// The Environment that the app is deployed an running on. The value can be either `production`, `preview`, or `development`.
const env = {
  VERCEL_ENV,
};

const webpack = (config: any, options: any) => {
  config.resolve.alias["~"] = path.resolve(__dirname, "src");

  if (!options.isServer) {
    config.resolve.alias["@sentry/node"] = "@sentry/react";
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

export default {
  env,
  i18n: {
    defaultLocale,
    locales,
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  target: "serverless",
  trailingSlash: false,
  webpack,
};

import * as Sentry from "@sentry/browser";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn:
      "https://69015ac1a388461b9267b07ef2f9f96d@o325460.ingest.sentry.io/1830950",
  });
}

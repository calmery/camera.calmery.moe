import * as Sentry from "@sentry/node";
import { Integrations } from "@sentry/tracing";

const VERCEL_ENV = process.env.VERCEL_ENV as
  | "development"
  | "preview"
  | "production"
  | undefined;

const environment = VERCEL_ENV || process.env.NODE_ENV;

Sentry.init({
  beforeSend(event) {
    if (environment === "preview" || environment === "production") {
      return event;
    }

    console.error(event);
    return null;
  },
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment,
  ...(typeof window === "undefined"
    ? {}
    : {
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
      }),
});

export { Sentry };

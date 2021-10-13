import { injectGlobal } from "@emotion/css";
import React, { FC } from "react";

injectGlobal`
  body {
    font-size: 14px;
  }
`;

export default (
  { Page, pageProps }: { Page: FC; pageProps: Record<string, unknown> },
) => {
  return (
    <main>
      <head>
        <meta name="viewport" content="width=device-width" />
      </head>
      <Page {...pageProps} />
    </main>
  );
};

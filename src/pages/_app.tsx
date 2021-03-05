import { Global, css } from "@emotion/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import "~/utils/sentry";
import "tailwindcss/tailwind.css";

const global = css`
  html,
  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    margin: 0;
    padding: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={
            process.env.NODE_ENV === "production"
              ? process.env.VERCEL_ENV === "production"
                ? `https://camera.calmery.moe${pathname}`
                : `https://camera-calmery-moe-calmery-chan.vercel.app${pathname}`
              : pathname
          }
        />
      </Head>
      <Global styles={global} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

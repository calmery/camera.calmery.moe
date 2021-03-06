import { Global, css } from "@emotion/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import "~/utils/sentry";
import "tailwindcss/tailwind.css";

const getOrigin = () => {
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_ENV !== "production") {
    return "https://camera-calmery-moe-calmery-chan.vercel.app";
  }

  return "https://camera.calmery.moe";
};

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
        <link rel="canonical" href={`${getOrigin()}${pathname}`} />
      </Head>
      <Global styles={global} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

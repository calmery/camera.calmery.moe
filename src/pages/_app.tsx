import { AppProps } from "next/app";
import React from "react";
import "~/utils/sentry";
import "tailwindcss/tailwind.css";
import { Head } from "~/components/Head";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head />
    <Component {...pageProps} />
  </>
);

export default App;

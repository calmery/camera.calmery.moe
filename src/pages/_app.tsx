import NextApp from "next/app";
import Head from "next/head";
import React from "react";
import { createGlobalStyle } from "styled-components";
import { Common } from "~/containers/Common";
import * as GA from "~/utils/google-analytics";
import "~/utils/sentry";

const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
  }
`;

class App extends NextApp {
  public componentDidMount = () => {
    const { router } = this.props;

    router.events.on("routeChangeComplete", (url) => {
      GA.changePage(url);
    });
  };

  public render = () => {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>かるめりちゃんカメラ</title>
          <meta
            name="description"
            content="うちの子、かるめりちゃんと一緒にお出かけしよう！"
          />
          <meta
            name="keywords"
            content="Calmery,かるめり,かるめりちゃん,カメラ,写真"
          />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta property="og:title" content="かるめりちゃんカメラ" />
          <meta property="og:site_name" content="かるめりちゃんカメラ" />
          <meta property="og:type" content="website" />
          <meta
            property="og:description"
            content="かるめりちゃんと一緒に写真を撮ろう！"
          />
          <meta property="og:url" content="https://camera.calmery.moe" />
          <meta
            property="og:image"
            content="https://camera.calmery.moe/images/ogp.jpg"
            key="og_image"
          />
          <meta key="og_image_width" property="og:image:width" content="640" />
          <meta
            key="og_image_height"
            property="og:image:height"
            content="320"
          />
          <meta property="og:locale" content="ja_JP" />
          <meta name="twitter:title" content="かるめりちゃんカメラ" />
          <meta
            name="twitter:description"
            content="かるめりちゃんと一緒に写真を撮ろう！"
          />
          <meta name="twitter:site" content="@calmeryme" />
          <meta name="twitter:creator" content="@calmeryme" />
          <meta key="twitter_card" name="twitter:card" content="summary" />
          <meta
            name="twitter:image"
            content="https://camera.calmery.moe/images/ogp.jpg"
            key="twitter_image"
          />
          <link rel="apple-touch-icon" href="/images/icons/192x192.jpg" />
          <link rel="manifest" href="/manifest.json" />
          <link
            href="https://fonts.googleapis.com/css?family=Sawarabi+Gothic"
            rel="stylesheet"
          ></link>
        </Head>
        <GlobalStyle />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.0.0/animate.min.css"
        />
        <Component {...pageProps} />
        <Common />
      </>
    );
  };
}

export default App;

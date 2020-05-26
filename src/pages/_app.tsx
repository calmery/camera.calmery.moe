import React from "react";
import NextApp from "next/app";
import { createGlobalStyle } from "styled-components";
import "~/utils/sentry";
import Head from "next/head";

export const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
  }

  /*
   * "スマートフォントUI" licensed under the IPA Font License Agreement v1.0
   * https://www.flopdesign.com/freefont/smartfont.html
   * https://ipafont.ipa.go.jp/old/ipaexfont/download.html IPAexゴシック（Ver.002.01）
   * https://ipafont.ipa.go.jp/ipa_font_license_v1.html
   */
  @font-face {
    font-family: SmartFontUI;
    font-display: swap;
    src: url(fonts/SmartFontUI.woff2) format("woff2"),
      url(fonts/SmartFontUI.woff) format("woff"),
      url(fonts/SmartFontUI.ttf) format("truetype");
  }
`;

class App extends NextApp {
  public render = () => {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>かるめりちゃんカメラ</title>
          <meta
            name="description"
            content="かわいいものが好き！うちの子、かるめりちゃんのファンサイトです。"
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
            content="かわいいものが好き！うちの子、かるめりちゃんのファンサイトです。"
          />
          <meta
            property="og:url"
            content="https://calmery.moe/images/ogp.jpg"
          />
          <meta property="og:image" content="images/ogp.jpg" />
          <meta property="og:image:width" content="640" />
          <meta property="og:image:height" content="320" />
          <meta property="og:locale" content="ja_JP" />
          <meta name="twitter:title" content="かるめりちゃんカメラ" />
          <meta
            name="twitter:description"
            content="かわいいものが好き！うちの子、かるめりちゃんのファンサイトです。"
          />
          <meta name="twitter:site" content="@calmeryme" />
          <meta name="twitter:creator" content="@calmeryme" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:image"
            content="https://calmery.moe/images/ogp.jpg"
          />
          <link rel="apple-touch-icon" href="/images/icon.jpg" />
        </Head>
        <GlobalStyle />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.0.0/animate.min.css"
        />
        <Component {...pageProps} />
      </>
    );
  };
}

export default App;

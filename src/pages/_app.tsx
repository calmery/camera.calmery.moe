import React from "react";
import NextApp from "next/app";
import { createGlobalStyle } from "styled-components";
import "~/utils/sentry";

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
        <GlobalStyle />
        <Component {...pageProps} />
      </>
    );
  };
}

export default App;

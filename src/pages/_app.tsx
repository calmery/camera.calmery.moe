import React from "react";
import NextApp from "next/app";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
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

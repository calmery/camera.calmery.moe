import React from "react";
import NextApp from "next/app";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "~/styles/global";
import { theme } from "~/styles/theme";

class App extends NextApp {
  public render = () => {
    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  };
}

export default App;

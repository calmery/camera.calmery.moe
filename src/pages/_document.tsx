import React from "react";
import NextDocument from "next/document";
import { DocumentContext } from "next/dist/next-server/lib/utils";
import { ServerStyleSheet } from "styled-components";

class Document extends NextDocument {
  static async getInitialProps(context: DocumentContext) {
    const serverStyleSheet = new ServerStyleSheet();
    const originalRenderPage = context.renderPage;

    try {
      context.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props =>
            serverStyleSheet.collectStyles(<App {...props} />)
        });

      const initialProps = await NextDocument.getInitialProps(context);

      return {
        ...initialProps,
        styles: [initialProps.styles, serverStyleSheet.getStyleElement()]
      };
    } finally {
      serverStyleSheet.seal();
    }
  }
}

export default Document;

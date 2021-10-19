import React from "react";
import { Provider } from "react-redux";
import { store } from "./features/store.ts";

interface AppProps {
  Page: React.FC;
  pageProps: Record<string, unknown>;
}

const App: React.FC<AppProps> = ({ Page, pageProps }) => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Page {...pageProps} />
      </Provider>
    </React.StrictMode>
  );
};

export default App;

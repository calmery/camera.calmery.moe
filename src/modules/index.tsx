import React from "react";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, Store } from "redux";
import logger from "redux-logger";
import { NextPage, NextPageContext } from "next";
import counter, { CounterState } from "./counter/reducer";

export interface State {
  counter: CounterState;
}

// Store

let cachedStore: Store | null = null;

export const getOrCreateStore = (state?: State) => {
  // SSR のときは毎回新しい `store` を Redux の `createStore` で生成する
  // もし既にブラウザ側で `store` が生成されている場合はその `store` を使用する
  if (typeof window !== "undefined" && cachedStore !== null) {
    return cachedStore;
  }

  cachedStore = createStore(
    combineReducers({
      counter
    }),
    state,
    applyMiddleware(...(process.env.NODE_ENV === "production" ? [] : [logger]))
  );

  return cachedStore;
};

// Redux

export type NextPageContextWithRedux = NextPageContext & { store: Store };

export const withRedux = (Component: NextPage) => {
  const WithRedux = ({
    props = {},
    state
  }: {
    props?: object;
    state: State;
  }) => {
    // Redux の `createStore` で生成した`store` は SSR したときにシリアライズされてしまう
    // そのため `store.getState()` で出力されたデータを元にブラウザ側でもう一度 `store` を生成する
    const store = getOrCreateStore(state);

    return (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
  };

  WithRedux.getInitialProps = async (context: NextPageContextWithRedux) => {
    const store = getOrCreateStore();
    context.store = store;

    const props =
      Component.getInitialProps && (await Component.getInitialProps(context));

    return { props, state: store.getState() };
  };

  return WithRedux;
};

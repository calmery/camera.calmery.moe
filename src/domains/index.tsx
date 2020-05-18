import React from "react";
import { Provider } from "react-redux";
import {
  createStore,
  combineReducers,
  applyMiddleware,
  Store,
  AnyAction,
} from "redux";
import logger from "redux-logger";
import reduxThunk, { ThunkDispatch } from "redux-thunk";
import { NextPage, NextPageContext } from "next";
import canvas, { CanvasState } from "./canvas/reducer";
import cropper, { CropperState } from "./cropper/reducer";

export interface State {
  canvas: CanvasState;
  cropper: CropperState;
}

// Store

let cachedStore: Store | null = null;

export const getOrCreateStore = (state?: State): Store<State> => {
  // SSR のときは毎回新しい `store` を Redux の `createStore` で生成する
  // もし既にブラウザ側で `store` が生成されている場合はその `store` を使用する
  if (typeof window !== "undefined" && cachedStore !== null) {
    return cachedStore;
  }

  cachedStore = createStore(
    combineReducers({
      canvas,
      cropper,
    }),
    state,
    applyMiddleware(
      ...(process.env.NODE_ENV === "production" ? [reduxThunk] : [reduxThunk])
    )
  );

  return cachedStore;
};

// Redux

export type NextPageContextWithRedux = NextPageContext & {
  store: Store & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: ThunkDispatch<State, any, AnyAction>;
  };
};

export const withRedux = (Component: NextPage) => {
  const WithRedux = ({
    props = {},
    state,
  }: {
    props?: object;
    state?: State;
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

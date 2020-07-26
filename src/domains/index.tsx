import React from "react";
import { Provider } from "react-redux";
import {
  createStore,
  combineReducers,
  applyMiddleware,
  Store,
  AnyAction,
  Middleware,
} from "redux";
import logger from "redux-logger";
import reduxThunk, { ThunkDispatch } from "redux-thunk";
import { NextPage, NextPageContext } from "next";
import { Actions as CanvasActions } from "./canvas/actions";
import * as canvasActionTypes from "./canvas/types";
import canvas, { CanvasState } from "./canvas/reducer";
import cropper, { CropperState } from "./cropper/reducer";
import entities, { EntitiesState } from "./entities/reducer";
import ui, { UiState } from "./ui/reducer";

export interface State {
  canvas: CanvasState;
  cropper: CropperState;
  entities: EntitiesState;
  ui: UiState;
}

// Persistence

const persistenceMiddleware: Middleware<Record<string, unknown>, State> = (
  store
) => (next) => (action: CanvasActions) => {
  const { canvas } = store.getState();

  switch (action.type) {
    case canvasActionTypes.CANVAS_COMPLETE:
    case canvasActionTypes.CANVAS_ENABLE_COLLAGE:
    case canvasActionTypes.CANVAS_DISABLE_COLLAGE:
    case canvasActionTypes.CANVAS_STICKER_LAYER_ADD:
    case canvasActionTypes.CANVAS_SRICKER_LAYER_REMOVE:
    case canvasActionTypes.CANVAS_STICKER_LAYER_CHANGE_ORDER:
    case canvasActionTypes.CANVAS_USER_LAYER_ADD:
    case canvasActionTypes.CANVAS_USER_LAYER_REMOVE:
    case canvasActionTypes.CANVAS_USER_LAYER_UPDATE_FILTER:
    case canvasActionTypes.CANVAS_USER_LAYER_CHANGE_PRESET_FILTER:
    case canvasActionTypes.CANVAS_USER_LAYER_CHANGE_EFFECT_FILTER:
    case canvasActionTypes.CANVAS_USER_LAYER_UPDATE_CROP:
    case canvasActionTypes.CANVAS_LOGO_CHANGE_POSITION:
      localStorage.setItem("canvas", JSON.stringify(canvas));
  }

  next(action);
};

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
      entities,
      ui,
    }),
    state,
    applyMiddleware(
      ...(process.env.NODE_ENV === "production"
        ? [reduxThunk, persistenceMiddleware]
        : [reduxThunk, persistenceMiddleware, logger])
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
    // eslint-disable-next-line @typescript-eslint/ban-types
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

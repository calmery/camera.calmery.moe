import { Dispatch } from "redux";
import { CanvasLayerEffect } from "~/types/CanvasLayerEffect";
import { convertUrlToDataUrl } from "~/utils/convert-url-to-data-url";

export const ADD_STICKER_LAYER = "ADD_STICKER_LAYER" as const;
export const ADD_USER_LAYER = "ADD_USER_LAYER" as const;
export const ADD_ADDABLE_STICKER_URLS = "ADD_ADDABLE_STICKER_URLS" as const;
export const CHANGE_USER_LAYER_FILTER_VALUE = "CHANGE_USER_LAYER_FILTER_VALUE" as const;
export const SET_CURSOR_POSITION = "SET_CURSOR_POSITION" as const;
export const STICKER_LAYER_DRAG_START = "STICKER_LAYER_DRAG_START" as const;
export const STICKER_LAYER_DRAG_END = "STICKER_LAYER_DRAG_END" as const;

// Actions

export const addStickerLayer = (
  base64: string,
  width: number,
  height: number
) => ({
  type: ADD_STICKER_LAYER,
  payload: {
    base64,
    width,
    height
  }
});

export const addUserLayer = (
  base64: string,
  width: number,
  height: number
) => ({
  type: ADD_USER_LAYER,
  payload: {
    base64,
    width,
    height
  }
});

export const dragStartStickerLayer = (
  layerIndex: number,
  x: number,
  y: number
) => ({
  type: STICKER_LAYER_DRAG_START,
  payload: { layerIndex, x, y }
});

export const dragEndStickerLayer = () => ({
  type: STICKER_LAYER_DRAG_END
});

export const setCursorPosition = (x: number, y: number) => ({
  type: SET_CURSOR_POSITION,
  payload: {
    x,
    y
  }
});

export const addAddableStickerUrls = (addableStickerUrls: string[]) => ({
  type: ADD_ADDABLE_STICKER_URLS,
  payload: addableStickerUrls
});

export const changeUserLayerFilterValue = (
  index: number,
  type: keyof CanvasLayerEffect,
  value: number
) => ({
  type: CHANGE_USER_LAYER_FILTER_VALUE,
  payload: {
    index,
    type,
    value
  }
});

export type Actions =
  | ReturnType<typeof addAddableStickerUrls>
  | ReturnType<typeof addStickerLayer>
  | ReturnType<typeof changeUserLayerFilterValue>
  | ReturnType<typeof setCursorPosition>
  | ReturnType<typeof dragStartStickerLayer>
  | ReturnType<typeof dragEndStickerLayer>
  | ReturnType<typeof addUserLayer>;

// Redux Thunks

export const addStickerLayerWithUrl = (url: string) => {
  return (dispatch: Dispatch) => {
    return new Promise((resolve, reject) => {
      const i = new Image();

      i.onload = async () => {
        const { base64, width, height } = await convertUrlToDataUrl(url);
        dispatch(addStickerLayer(base64, width, height));
        resolve();
      };

      i.onerror = () => reject();

      i.src = url;
    });
  };
};

export const addUserLayerWithDataUrl = (base64: string) => {
  return (dispatch: Dispatch) => {
    return new Promise((resolve, reject) => {
      const i = new Image();

      i.onload = () => {
        dispatch(addUserLayer(base64, i.width, i.height));
        resolve();
      };

      i.onerror = () => reject();

      i.src = base64;
    });
  };
};

export const getAddableStickerUrls = () => {
  return (dispatch: Dispatch) => {
    // Contentful
    dispatch(addAddableStickerUrls([]));
  };
};

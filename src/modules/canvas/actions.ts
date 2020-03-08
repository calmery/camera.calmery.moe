import { Dispatch } from "redux";

export const ADD_USER_LAYER = "ADD_USER_LAYER" as const;
export const ADD_ADDABLE_STICKER_URLS = "ADD_ADDABLE_STICKER_URLS" as const;

// Actions

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

export const addAddableStickerUrls = (addableStickerUrls: string[]) => ({
  type: ADD_ADDABLE_STICKER_URLS,
  payload: addableStickerUrls
});

export type Actions =
  | ReturnType<typeof addAddableStickerUrls>
  | ReturnType<typeof addUserLayer>;

// Redux Thunks

export const addUserLayerWithDataUrl = (base64: string) => {
  return (dispatch: Dispatch) => {
    const i = new Image();

    i.onload = () => {
      dispatch(addUserLayer(base64, i.width, i.height));
    };

    i.src = base64;
  };
};

export const getAddableStickerUrls = () => {
  return (dispatch: Dispatch) => {
    // Contentful
    dispatch(addAddableStickerUrls([]));
  };
};

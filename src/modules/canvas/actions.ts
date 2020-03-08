import { Dispatch } from "redux";

export const ADD_ADDABLE_STICKER_URLS = "ADD_ADDABLE_STICKER_URLS" as const;

// Actions

export const addAddableStickerUrls = (addableStickerUrls: string[]) => ({
  type: ADD_ADDABLE_STICKER_URLS,
  payload: addableStickerUrls
});

export type Actions = ReturnType<typeof addAddableStickerUrls>;

// Redux Thunks

export const getAddableStickerUrls = () => {
  return (dispatch: Dispatch) => {
    // Contentful
    dispatch(addAddableStickerUrls([]));
  };
};

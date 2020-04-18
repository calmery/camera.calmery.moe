import { Dispatch } from "redux";
import blueimpLoadImage from "blueimp-load-image";
import { FeColorMatrix } from "~/types/FeColorMatrix";

export const ADD_USER_IMAGE = "ADD_USER_IMAGE" as const;
export const REMOVE_USER_IMAGE = "REMOVE_USER_IMAGE" as const;
export const UPDATE_DISPLAY_RATIO = "UPDATE_DISPLAY_RATIO" as const;
export const UPDATE_CANVAS_LAYER_POSITION = "UPDATE_CANVAS_LAYER_POSITION" as const;
export const SET_CANVAS_USER_LAYER_STARTING_POSITION = "SET_CANVAS_USER_LAYER_STARTING_POSITION" as const;
export const RESET_ALL_FLAGS = "RESET_ALL_FLAGS" as const;
export const CHANGE_USER_LAYER_FILTER_VALUE = "CHANGE_USER_LAYER_FILTER_VALUE" as const;
export const ADD_STICKER_LAYER = "ADD_STICKER_LAYER" as const;

// Actions

export const addStickerLayer = (
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: ADD_STICKER_LAYER,
  payload: { dataUrl, width, height },
});

export const addUserImage = (
  index: number,
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: ADD_USER_IMAGE,
  payload: {
    index,
    dataUrl,
    width,
    height,
  },
});

export const resetAllFlags = () => ({
  type: RESET_ALL_FLAGS,
});

export const removeUserImage = (index: number) => ({
  type: REMOVE_USER_IMAGE,
  payload: { index },
});

export const updateDisplayRatio = (displayWidth: number) => ({
  type: UPDATE_DISPLAY_RATIO,
  payload: { displayWidth },
});

export const updateCanvasUserLayerPosition = (
  index: number,
  nextX: number,
  nextY: number
) => ({
  type: UPDATE_CANVAS_LAYER_POSITION,
  payload: { index, nextX, nextY },
});

export const setCanvasUserLayerStartingPosition = (
  index: number,
  differenceFromStartingX: number,
  differenceFromStartingY: number
) => ({
  type: SET_CANVAS_USER_LAYER_STARTING_POSITION,
  payload: { index, differenceFromStartingX, differenceFromStartingY },
});

export const changeUserLayerFilterValue = (
  index: number,
  type: FeColorMatrix,
  value: number
) => ({
  type: CHANGE_USER_LAYER_FILTER_VALUE,
  payload: {
    index,
    type,
    value,
  },
});

// Redux Thunk

const convertUrlToImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onerror = () => reject();
    image.onload = () => resolve(image);

    image.src = url;
  });
};

// TODO: `blueimpLoadImage` のエラー処理をちゃんとする
export const addUserImageFromFile = (file: File, index: number) => {
  return (dispatch: Dispatch) => {
    return new Promise((resolve) => {
      blueimpLoadImage(
        file,
        async (canvas) => {
          const dataUrl = (canvas as HTMLCanvasElement).toDataURL();
          const { width, height } = await convertUrlToImage(dataUrl);

          dispatch(addUserImage(index, dataUrl, width, height));

          resolve();
        },
        { canvas: true, orientation: true }
      );
    });
  };
};

export const addStickerLayerWithUrl = (url: string) => {
  return (dispatch: Dispatch) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onerror = () => reject();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        if (context === null) {
          return reject();
        }

        context.drawImage(image, 0, 0, image.width, image.height);
        dispatch(
          addStickerLayer(
            canvas.toDataURL("image/png"),
            image.width,
            image.height
          )
        );
      };

      image.src = url;
    });
  };
};

// Actions

export type Actions =
  | ReturnType<typeof addStickerLayer>
  | ReturnType<typeof addUserImage>
  | ReturnType<typeof removeUserImage>
  | ReturnType<typeof updateDisplayRatio>
  | ReturnType<typeof updateCanvasUserLayerPosition>
  | ReturnType<typeof setCanvasUserLayerStartingPosition>
  | ReturnType<typeof resetAllFlags>
  | ReturnType<typeof changeUserLayerFilterValue>;

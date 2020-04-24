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
export const START_CANVAS_STICKER_LAYER_TRANSFORM = "START_CANVAS_STICKER_LAYER_TRANSFORM" as const;
export const START_CANVAS_STICKER_LAYER_MUTI_TOUCHING_TRANSFORM = "START_CANVAS_STICKER_LAYER_MUTI_TOUCHING_TRANSFORM" as const;
export const START_CANVAS_STICKER_LAYER_DRAG = "START_CANVAS_STICKER_LAYER_DRAG" as const;
export const PROGRESS_CANVAS_STICKER_LAYER_TRANSFORM = "PROGRESS_CANVAS_STICKER_LAYER_TRANSFORM" as const;
export const PROGRESS_CANVAS_STICKER_LAYER_DRAG = "PROGRESS_CANVAS_STICKER_LAYER_DRAG" as const;
export const CHANGE_ACTIVE_CANVAS_SRICKER_LAYER = "CHANGE_ACTIVE_CANVAS_SRICKER_LAYER" as const;
export const REMOVE_CANVAS_SRICKER_LAYER = "REMOVE_CANVAS_SRICKER_LAYER" as const;
export const CHANGE_FRAME = "CHANGE_FRAME" as const;

// Actions

export const changeFrame = (frame: any, index: number) => ({
  type: CHANGE_FRAME,
  payload: { frame, index },
});

export const removeCanvasStickerLayer = () => ({
  type: REMOVE_CANVAS_SRICKER_LAYER,
});

export const changeActiveCanvasStickerLayer = (index: number) => ({
  type: CHANGE_ACTIVE_CANVAS_SRICKER_LAYER,
  payload: { index },
});

export const progressCanvasStickerLayerTransform = (
  x: number,
  y: number,
  scale: number,
  angle: number
) => ({
  type: PROGRESS_CANVAS_STICKER_LAYER_TRANSFORM,
  payload: { x, y, scale, angle },
});

export const progressCanvasStickerLayerDrag = (x: number, y: number) => ({
  type: PROGRESS_CANVAS_STICKER_LAYER_DRAG,
  payload: { x, y },
});

export const startCanvasStickerLayerTransform = (
  index: number,
  previousLength: number
) => ({
  type: START_CANVAS_STICKER_LAYER_TRANSFORM,
  payload: { index, previousLength },
});

export const startCanvasStickerLayerMultiTouchingTransform = (
  index: number,
  previousLength: number,
  startingAngle: number
) => ({
  type: START_CANVAS_STICKER_LAYER_MUTI_TOUCHING_TRANSFORM,
  payload: { index, previousLength, startingAngle },
});

export const startCanvasStickerLayerDrag = (
  index: number,
  referenceX: number,
  referenceY: number
) => ({
  type: START_CANVAS_STICKER_LAYER_DRAG,
  payload: { index, referenceX, referenceY },
});

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

export const updateDisplayRatio = (
  displayX: number,
  displayY: number,
  displayWidth: number
) => ({
  type: UPDATE_DISPLAY_RATIO,
  payload: { displayX, displayY, displayWidth },
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
  | ReturnType<typeof changeUserLayerFilterValue>
  | ReturnType<typeof startCanvasStickerLayerTransform>
  | ReturnType<typeof startCanvasStickerLayerMultiTouchingTransform>
  | ReturnType<typeof startCanvasStickerLayerDrag>
  | ReturnType<typeof progressCanvasStickerLayerTransform>
  | ReturnType<typeof progressCanvasStickerLayerDrag>
  | ReturnType<typeof changeActiveCanvasStickerLayer>
  | ReturnType<typeof removeCanvasStickerLayer>
  | ReturnType<typeof changeFrame>;

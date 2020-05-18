import { Dispatch } from "redux";
import blueimpLoadImage from "blueimp-load-image";
import { CanvasUserLayerFrame } from "./frames";
import { getOrCreateStore } from "~/domains";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { checkAndResizeImage } from "~/utils/check-and-resize-image";
import * as types from "./types";

// Container Actions

const setSvgPositionAndSize = ({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => ({
  type: types.SET_SVG_POSITION_AND_SIZE,
  payload: {
    x,
    y,
    width,
    height,
  },
});

const containerActions = {
  setSvgPositionAndSize,
};

// Sticker Actions

export const addCanvasStickerLayer = (
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: types.ADD,
  payload: { dataUrl, width, height },
});

export const removeCanvasStickerLayer = () => ({
  type: types.REMOVE,
});

export const setCanvasStickerLayerActive = (index: number) => ({
  type: types.SET_ACTIVE,
  payload: { index },
});

export const startCanvasStickerLayerTransform = (x: number, y: number) => {
  const { container } = getOrCreateStore().getState().canvas;

  return {
    type: types.START_TRANSFORM,
    payload: { x, y, container },
  };
};

export const startCanvasStickerLayerDrag = (
  cursorPositions: CursorPosition[]
) => {
  const { container } = getOrCreateStore().getState().canvas;

  return {
    type: types.START_DRAG,
    payload: { cursorPositions, container },
  };
};

export const addCanvasStickerLayerWithUrl = (url: string) => {
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
          addCanvasStickerLayer(
            canvas.toDataURL("image/png"),
            image.width,
            image.height
          )
        );

        resolve();
      };

      image.crossOrigin = "anonymous";
      image.src = url;
    });
  };
};

const stickerActions = {
  addCanvasStickerLayer,
  startCanvasStickerLayerTransform,
  startCanvasStickerLayerDrag,
  setCanvasStickerLayerActive,
  removeCanvasStickerLayer,
};

const stickerThunkActions = {
  addCanvasStickerLayerWithUrl,
};

// User Actions

import { FeColorMatrix } from "~/types/FeColorMatrix";

export const addCanvasUserLayer = (
  index: number,
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: types.USER_ADD,
  payload: {
    index,
    dataUrl,
    width,
    height,
  },
});

export const removeCanvasUserLayer = (index: number) => ({
  type: types.USER_REMOVE,
  payload: { index },
});

export const startCanvasUserLayerDrag = (
  index: number,
  clipPathX: number,
  clipPathY: number,
  cursorPositions: CursorPosition[]
) => {
  const { container } = getOrCreateStore().getState().canvas;

  return {
    type: types.USER_START_DRAG,
    payload: {
      index,
      clipPathX,
      clipPathY,
      cursorPositions,
      displayRatio: container.displayRatio,
    },
  };
};

export const setCanvasUserLayerPosition = (
  index: number,
  clipPathX: number,
  clipPathY: number,
  cursorPositions: CursorPosition[]
) => {
  const { container } = getOrCreateStore().getState().canvas;

  return {
    type: types.USER_SET_POSITION,
    payload: {
      index,
      clipPathX,
      clipPathY,
      cursorPositions,
      displayRatio: container.displayRatio,
    },
  };
};

export const setUserLayerFilterValue = (
  index: number,
  type: FeColorMatrix,
  value: number
) => ({
  type: types.FILTER_SET_VALUE,
  payload: {
    index,
    type,
    value,
  },
});

const convertUrlToImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onerror = () => reject();
    image.onload = () => resolve(image);

    image.src = url;
  });
};

// TODO: `blueimpLoadImage` のエラー処理をちゃんとする
export const addCanvasUserLayerFromFile = (file: File, index: number) => {
  return (dispatch: Dispatch) => {
    return new Promise((resolve) => {
      blueimpLoadImage(
        file,
        async (canvas) => {
          const image = await convertUrlToImage(
            (canvas as HTMLCanvasElement).toDataURL()
          );
          // ToDo: null のときはサイズエラーになっている
          const result = checkAndResizeImage(image);
          const { width, height, dataUrl } = result!;

          dispatch(addCanvasUserLayer(index, dataUrl, width, height));
          resolve();
        },
        { canvas: true, orientation: true }
      );
    });
  };
};

export const userActions = {
  addCanvasUserLayer,
  removeCanvasUserLayer,
  setCanvasUserLayerPosition,
  startCanvasUserLayerDrag,
  setUserLayerFilterValue,
};

export const userThunkActions = {
  addCanvasUserLayerFromFile,
};

// Common Actions

export const tick = (cursorPositions: CursorPosition[]) => {
  const { container } = getOrCreateStore().getState().canvas;

  return {
    type: types.TICK,
    payload: { container, cursorPositions },
  };
};

export const complete = () => ({
  type: types.COMPLETE,
});

export const setFrame = (frame: CanvasUserLayerFrame, index: number) => ({
  type: types.SET_FRAME,
  payload: { frame, index },
});

export const setDefaultFrame = () => {
  const { layers } = getOrCreateStore().getState().canvas.users;

  return {
    type: types.SET_DEFAULT_FRAME,
    payload: {
      width: layers[0] ? layers[0].width : 0,
      height: layers[0] ? layers[0].height : 0,
    },
  };
};

export const addCanvasUserLayerAndSetFrame = (
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: types.ADD_USER_IMAGE_AND_SET_FRAME,
  payload: {
    dataUrl,
    width,
    height,
  },
});

// TODO: `blueimpLoadImage` のエラー処理をちゃんとする
export const addCanvasUserLayerAndSetFrameFromFile = (file: File) => {
  return (dispatch: Dispatch) => {
    return new Promise((resolve) => {
      blueimpLoadImage(
        file,
        async (canvas) => {
          const image = await convertUrlToImage(
            (canvas as HTMLCanvasElement).toDataURL()
          );
          // ToDo: null のときはサイズエラーになっている
          const result = checkAndResizeImage(image);
          const { width, height, dataUrl } = result!;

          dispatch(addCanvasUserLayerAndSetFrame(dataUrl, width, height));

          resolve();
        },
        { canvas: true, orientation: true }
      );
    });
  };
};

export const actions = {
  ...containerActions,
  ...stickerActions,
  ...userActions,
  tick,
  complete,
  setFrame,
  addCanvasUserLayerAndSetFrame,
  setDefaultFrame,
};

export const thunkActions = {
  ...stickerThunkActions,
  ...userThunkActions,
  addCanvasUserLayerAndSetFrameFromFile,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

import { Dispatch } from "redux";
import blueimpLoadImage from "blueimp-load-image";
import { CanvasUserLayerFrame } from "./frames";
import { getOrCreateStore } from "~/domains";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { checkAndResizeImage } from "~/utils/check-and-resize-image";

export const TICK = "CANVAS/TICK" as const;
export const COMPLETE = "CANVAS/COMPLETE" as const;
export const SET_FRAME = "CANVAS/SET_FRAME" as const;
export const ADD_USER_IMAGE_AND_SET_FRAME = "CANVAS/ADD_USER_IMAGE_AND_SET_FRAME" as const;
export const SET_DEFAULT_FRAME = "CANVAS/SET_DEFAULT_FRAME" as const;

// Container Actions

export const SET_SVG_POSITION_AND_SIZE = "CANVAS/CONTAINER/SET_SVG_POSITION_AND_SIZE" as const;

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
  type: SET_SVG_POSITION_AND_SIZE,
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

export const ADD = "CANVAS/CANVAS_STICKER_LAYER/ADD" as const;
export const REMOVE = "CANVAS/CANVAS_SRICKER_LAYER/REMOVE" as const;
export const SET_ACTIVE = "CANVAS/CANVAS_STICKER_LAYER/SET_ACTIVE" as const;
export const START_DRAG = "CANVAS/CANVAS_STICKER_LAYER/START_DRAG" as const;
export const START_TRANSFORM = "CANVAS/CANVAS_STICKER_LAYER/START_TRANSFORM" as const;

export const addCanvasStickerLayer = (
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: ADD,
  payload: { dataUrl, width, height },
});

export const removeCanvasStickerLayer = () => ({
  type: REMOVE,
});

export const setCanvasStickerLayerActive = (index: number) => ({
  type: SET_ACTIVE,
  payload: { index },
});

export const startCanvasStickerLayerTransform = (x: number, y: number) => {
  const { container } = getOrCreateStore().getState().canvas;

  return {
    type: START_TRANSFORM,
    payload: { x, y, container },
  };
};

export const startCanvasStickerLayerDrag = (
  cursorPositions: CursorPosition[]
) => {
  const { container } = getOrCreateStore().getState().canvas;

  return {
    type: START_DRAG,
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
export const USER_ADD = "CANVAS/CANVAS_USER_LAYER/USER_ADD" as const;
export const USER_REMOVE = "CANVAS/CANVAS_USER_LAYER/USER_REMOVE" as const;
export const USER_START_DRAG = "CANVAS/CANVAS_USER_LAYER/USER_START_DRAG" as const;
export const USER_SET_POSITION = "CANVAS/CANVAS_USER_LAYER/USER_SET_POSITION" as const;
export const FILTER_SET_VALUE = "CANVAS/CANVAS_FILTER/SET_VALUE" as const;

export const addCanvasUserLayer = (
  index: number,
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: USER_ADD,
  payload: {
    index,
    dataUrl,
    width,
    height,
  },
});

export const removeCanvasUserLayer = (index: number) => ({
  type: USER_REMOVE,
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
    type: USER_START_DRAG,
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
    type: USER_SET_POSITION,
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
  type: FILTER_SET_VALUE,
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
    type: TICK,
    payload: { container, cursorPositions },
  };
};

export const complete = () => ({
  type: COMPLETE,
});

export const setFrame = (frame: CanvasUserLayerFrame, index: number) => ({
  type: SET_FRAME,
  payload: { frame, index },
});

export const setDefaultFrame = () => {
  const { layers } = getOrCreateStore().getState().canvas.users;

  return {
    type: SET_DEFAULT_FRAME,
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
  type: ADD_USER_IMAGE_AND_SET_FRAME,
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

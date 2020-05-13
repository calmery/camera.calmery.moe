import { Dispatch } from "redux";
import blueimpLoadImage from "blueimp-load-image";
import { FeColorMatrix } from "~/types/FeColorMatrix";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { CanvasUserLayerFrame } from "./frames";

export const CANVAS_SET_FRAME = "CANVAS/SET_FRAME" as const;
export const CANVAS_SET_DISPLAY_RATIO = "CANVAS/UPDATE_DISPLAY_RATIO" as const;

export const CANVAS_USER_LAYER_ADD = "CANVAS/CANVAS_USER_LAYER/ADD" as const;
export const CANVAS_USER_LAYER_REMOVE = "CANVAS/CANVAS_USER_LAYER/REMOVE" as const;
export const CANVAS_USER_LAYER_START_DRAG = "CANVAS/CANVAS_USER_LAYER/START_DRAG" as const;
export const CANVAS_USER_LAYER_SET_POSITION = "CANVAS/CANVAS_USER_LAYER.SET_POSITION" as const;

export const CANVAS_FILTER_SET_VALUE = "CANVAS/CANVAS_FILTER/SET_VALUE" as const;

export const CANVAS_STICKER_LAYER_ADD = "CANVAS/CANVAS_STICKER_LAYER/ADD" as const;
export const CANVAS_SRICKER_LAYER_REMOVE = "CANVAS/CANVAS_SRICKER_LAYER/REMOVE" as const;
export const CANVAS_STICKER_LAYER_SET_ACTIVE = "CANVAS/CANVAS_STICKER_LAYER/SET_ACTIVE" as const;
export const CANVAS_STICKER_LAYER_START_DRAG = "CANVAS/CANVAS_STICKER_LAYER/START_DRAG" as const;
export const CANVAS_STICKER_LAYER_START_TRANSFORM = "CANVAS/CANVAS_STICKER_LAYER/START_TRANSFORM" as const;

export const TICK = "CANVAS/TICK" as const;
export const COMPLETE = "CANVAS/COMPLETE" as const;

// Actions

export const setCanvasFrame = (frame: CanvasUserLayerFrame, index: number) => ({
  type: CANVAS_SET_FRAME,
  payload: { frame, index },
});

export const setCanvasDisplayRatio = (
  displayX: number,
  displayY: number,
  displayWidth: number
) => ({
  type: CANVAS_SET_DISPLAY_RATIO,
  payload: { displayX, displayY, displayWidth },
});

// User Layer

export const addCanvasUserLayer = (
  index: number,
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: CANVAS_USER_LAYER_ADD,
  payload: {
    index,
    dataUrl,
    width,
    height,
  },
});

export const removeCanvasUserLayer = (index: number) => ({
  type: CANVAS_USER_LAYER_REMOVE,
  payload: { index },
});

export const startCanvasUserLayerDrag = (
  index: number,
  clipPathX: number,
  clipPathY: number,
  cursorPositions: CursorPosition[]
) => ({
  type: CANVAS_USER_LAYER_START_DRAG,
  payload: { index, clipPathX, clipPathY, cursorPositions },
});

export const setCanvasUserLayerPosition = (
  index: number,
  clipPathX: number,
  clipPathY: number,
  cursorPositions: CursorPosition[]
) => ({
  type: CANVAS_USER_LAYER_SET_POSITION,
  payload: { index, clipPathX, clipPathY, cursorPositions },
});

export const setUserLayerFilterValue = (
  index: number,
  type: FeColorMatrix,
  value: number
) => ({
  type: CANVAS_FILTER_SET_VALUE,
  payload: {
    index,
    type,
    value,
  },
});

// Sticker Layer

export const addCanvasStickerLayer = (
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: CANVAS_STICKER_LAYER_ADD,
  payload: { dataUrl, width, height },
});

export const removeCanvasStickerLayer = () => ({
  type: CANVAS_SRICKER_LAYER_REMOVE,
});

export const setCanvasStickerLayerActive = (index: number) => ({
  type: CANVAS_STICKER_LAYER_SET_ACTIVE,
  payload: { index },
});

export const startCanvasStickerLayerTransform = (x: number, y: number) => ({
  type: CANVAS_STICKER_LAYER_START_TRANSFORM,
  payload: { x, y },
});

export const startCanvasStickerLayerDrag = (
  cursorPositions: CursorPosition[]
) => ({
  type: CANVAS_STICKER_LAYER_START_DRAG,
  payload: { cursorPositions },
});

// Event Loop

export const tick = (cursorPositions: CursorPosition[]) => ({
  type: TICK,
  payload: { cursorPositions },
});

export const complete = () => ({
  type: COMPLETE,
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
export const addCanvasUserLayerFromFile = (file: File, index: number) => {
  return (dispatch: Dispatch) => {
    return new Promise((resolve) => {
      blueimpLoadImage(
        file,
        async (canvas) => {
          const dataUrl = (canvas as HTMLCanvasElement).toDataURL();
          const { width, height } = await convertUrlToImage(dataUrl);

          dispatch(addCanvasUserLayer(index, dataUrl, width, height));

          resolve();
        },
        { canvas: true, orientation: true }
      );
    });
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
      };

      image.src = url;
    });
  };
};

// Actions

export const actions = {
  addCanvasStickerLayer,
  addCanvasUserLayer,
  removeCanvasUserLayer,
  setCanvasDisplayRatio,
  setCanvasUserLayerPosition,
  startCanvasUserLayerDrag,
  complete,
  setUserLayerFilterValue,
  startCanvasStickerLayerTransform,
  startCanvasStickerLayerDrag,
  setCanvasStickerLayerActive,
  removeCanvasStickerLayer,
  setCanvasFrame,
  tick,
};

export const thunkActions = {
  addCanvasUserLayerFromFile,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

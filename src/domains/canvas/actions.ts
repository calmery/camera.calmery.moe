import blueimpLoadImage from "blueimp-load-image";
import { Dispatch } from "redux";
import { CanvasUserFrameType } from "~/types/CanvasUserFrameType";
import * as types from "./types";
import { convertUrlToImage } from "./utils";
import { FeColorMatrix } from "~/types/FeColorMatrix";
import { checkAndResizeImage } from "~/utils/check-and-resize-image";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { getDominangColor } from "~/utils/get-dominant-color";
import { getLightness } from "~/utils/get-lightness";

// Container

const updateDisplayable = ({
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
  type: types.CANVAS_CONTAINER_UPDATE_RECT,
  payload: {
    x,
    y,
    width,
    height,
  },
});

const updateCanvasContainerRect = ({
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
  type: types.CANVAS_CONTAINER_UPDATE_RECT,
  payload: {
    x,
    y,
    width,
    height,
  },
});

// Stickers

const addCanvasStickerLayer = (
  group: number,
  id: number,
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: types.CANVAS_STICKER_LAYER_ADD,
  payload: { group, id, dataUrl, width, height },
});

const removeCanvasStickerLayer = () => ({
  type: types.CANVAS_SRICKER_LAYER_REMOVE,
});

const changeCanvasStickerLayerOrder = (index: number) => ({
  type: types.CANVAS_STICKER_LAYER_CHANGE_ORDER,
  payload: { index },
});

const startCanvasStickerLayerTransform = (x: number, y: number) => ({
  type: types.CANVAS_STICKER_LAYER_START_TRANSFORM,
  payload: { x, y },
});

const startCanvasStickerLayerDrag = (cursorPositions: CursorPosition[]) => ({
  type: types.CANVAS_STICKER_LAYER_START_DRAG,
  payload: { cursorPositions },
});

const addCanvasStickerLayerWithUrl = (
  group: number,
  id: number,
  url: string
) => {
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
            group,
            id,
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

// Users

const addCanvasUserLayer = (
  index: number,
  dataUrl: string,
  width: number,
  height: number,
  lightness: number
) => ({
  type: types.CANVAS_USER_LAYER_ADD,
  payload: {
    index,
    dataUrl,
    width,
    height,
    lightness,
  },
});

const removeCanvasUserLayer = (index: number) => ({
  type: types.CANVAS_USER_LAYER_REMOVE,
  payload: { index },
});

const startCanvasUserLayerCrop = (index: number) => ({
  type: types.CANVAS_USER_LAYER_START_CROP,
  payload: { index },
});

const startCanvasUserLayerDrag = (
  index: number,
  cursorPositions: CursorPosition[]
) => ({
  type: types.CANVAS_USER_LAYER_START_DRAG,
  payload: {
    index,
    cursorPositions,
  },
});

const updateCanvasUserLayerFilter = (type: FeColorMatrix, value: number) => ({
  type: types.CANVAS_USER_LAYER_UPDATE_FILTER,
  payload: {
    type,
    value,
  },
});

const updateCanvasUserLayerCrop = (
  x: number,
  y: number,
  width: number,
  height: number,
  angle: number,
  scale: number,
  imageX: number,
  imageY: number,
  cropper: {
    cropperWidth: number;
    cropperHeight: number;
    cropperX: number;
    cropperY: number;
    imageX: number;
    imageY: number;
    imageAngle: number;
    imageScale: number;
    cropperScale: number;
    cropperScaleX: number;
    cropperScaleY: number;
  }
) => ({
  type: types.CANVAS_USER_LAYER_UPDATE_CROP,
  payload: { x, y, width, height, angle, scale, imageX, imageY, cropper },
});

// TODO: `blueimpLoadImage` のエラー処理をちゃんとする
const addCanvasUserLayerFromFile = (file: File, index: number) => {
  return (dispatch: Dispatch) => {
    return new Promise((resolve, reject) => {
      blueimpLoadImage(
        file,
        async (canvas) => {
          if (canvas instanceof Event && canvas.type === "error") {
            return reject();
          }

          const image = await convertUrlToImage(
            (canvas as HTMLCanvasElement).toDataURL("image/png")
          );

          const result = checkAndResizeImage(image);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { width, height, dataUrl } = result!;
          const colors = await getDominangColor(dataUrl);
          const lightness = getLightness(colors);

          dispatch(
            addCanvasUserLayer(index, dataUrl, width, height, lightness)
          );
          resolve();
        },
        { canvas: true, orientation: true }
      );
    });
  };
};

const startCanvasUserLayerFilter = (index: number) => ({
  type: types.CANVAS_USER_LAYER_START_FILTER,
  payload: { index },
});

const tick = (cursorPositions: CursorPosition[]) => ({
  type: types.CANVAS_TICK,
  payload: { cursorPositions },
});

const tickCanvas = (cursorPositions: CursorPosition[]) => ({
  type: types.CANVAS_TICK,
  payload: { cursorPositions },
});

// Common

const initializeCanvas = (
  dataUrl: string,
  width: number,
  height: number,
  lightness: number
) => ({
  type: types.CANVAS_INITIALIZE,
  payload: {
    dataUrl,
    width,
    height,
    lightness,
  },
});

const complete = () => ({
  type: types.CANVAS_COMPLETE,
});

const enableCollage = (frame: CanvasUserFrameType, index: number) => ({
  type: types.CANVAS_ENABLE_COLLAGE,
  payload: { frame, index },
});

const disableCollage = () => ({
  type: types.CANVAS_DISABLE_COLLAGE,
});

// TODO: `blueimpLoadImage` のエラー処理をちゃんとする
const addCanvasUserLayerAndSetFrameFromFile = (file: File) => {
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { width, height, dataUrl } = result!;
          const colors = await getDominangColor(dataUrl);
          const lightness = getLightness(colors);

          dispatch(initializeCanvas(dataUrl, width, height, lightness));

          resolve();
        },
        { canvas: true, orientation: true }
      );
    });
  };
};

// Main

export const actions = {
  updateCanvasContainerRect,
  updateDisplayable,
  addCanvasStickerLayer,
  startCanvasStickerLayerTransform,
  startCanvasStickerLayerDrag,
  changeCanvasStickerLayerOrder,
  removeCanvasStickerLayer,
  addCanvasUserLayer,
  removeCanvasUserLayer,
  startCanvasUserLayerCrop,
  startCanvasUserLayerDrag,
  updateCanvasUserLayerFilter,
  startCanvasUserLayerFilter,
  updateCanvasUserLayerCrop,
  tick,
  tickCanvas,
  complete,
  enableCollage,
  initializeCanvas,
  disableCollage,
};

export const thunkActions = {
  addCanvasStickerLayerWithUrl,
  addCanvasUserLayerFromFile,
  addCanvasUserLayerAndSetFrameFromFile,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

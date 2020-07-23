import blueimpLoadImage from "blueimp-load-image";
import { Dispatch } from "redux";
import { CanvasUserFrameType } from "~/types/CanvasUserFrameType";
import * as types from "./types";
import { convertUrlToImage } from "./utils";
import { CanvasUserFilterType } from "~/types/CanvasUserFilterType";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { PresetFilter } from "~/types/PresetFilter";
import { EffectFilter } from "~/types/EffectFilter";
import { CanvasState } from "./reducer";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ColorThief = require("~/externals/color-thief");
const colorThief = new ColorThief();

const getDominangColor = (dataUrl: string): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onerror = () => reject();
    image.onload = () => {
      resolve(colorThief.getColor(image));
    };

    image.src = dataUrl;
  });
};

const getLightness = ([red, green, blue]: number[]) => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
};

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;

const checkAndResizeImage = (image: HTMLImageElement) => {
  const { width, height } = image;

  const canvas = document.createElement("canvas");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const context = canvas.getContext("2d")!;

  let renderWidth = 0;
  let renderHeight = 0;

  const horizontalRatio = width / MAX_WIDTH;
  const verticalRatio = height / MAX_HEIGHT;

  // width を基準に縮小する
  if (horizontalRatio > verticalRatio) {
    renderWidth = MAX_WIDTH;
    renderHeight = height * (MAX_WIDTH / width);
  } else {
    renderWidth = width * (MAX_HEIGHT / height);
    renderHeight = MAX_HEIGHT;
  }

  canvas.width = renderWidth;
  canvas.height = renderHeight;
  context.drawImage(image, 0, 0, renderWidth, renderHeight);

  return {
    width: renderWidth,
    height: renderHeight,
    dataUrl: canvas.toDataURL("image/png"),
  };
};

// Container

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

const updateCanvasUserLayerFilter = (
  type: CanvasUserFilterType,
  value: number
) => ({
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
            return reject(canvas);
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

const tickCanvas = (cursorPositions: CursorPosition[]) => ({
  type: types.CANVAS_TICK,
  payload: { cursorPositions },
});

// Common

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

const updateKey = (isControlKey: boolean, isShiftKey: boolean) => ({
  type: types.CANVAS_UPDATE_KEY,
  payload: { isControlKey, isShiftKey },
});

const changeCanvasUserLayerPresetFilter = (
  presetFilter: PresetFilter | null
) => ({
  type: types.CANVAS_USER_LAYER_CHANGE_PRESET_FILTER,
  payload: { presetFilter },
});

const changeCanvasUserLayerEffectFilter = (
  effectFilter: EffectFilter | null
) => ({
  type: types.CANVAS_USER_LAYER_CHANGE_EFFECT_FILTER,
  payload: { effectFilter },
});

// Logo

const changeCanvasLogoPosition = (logoPosition: "left" | "right") => ({
  type: types.CANVAS_LOGO_CHANGE_POSITION,
  payload: { logoPosition },
});

//

const canvasRestore = (payload: Partial<CanvasState>) => ({
  type: types.CANVAS_RESTORE,
  payload,
});

// Main

export const actions = {
  canvasRestore,
  updateCanvasContainerRect,
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
  changeCanvasUserLayerEffectFilter,
  changeCanvasUserLayerPresetFilter,
  startCanvasUserLayerFilter,
  updateCanvasUserLayerCrop,
  tickCanvas,
  complete,
  enableCollage,
  disableCollage,
  updateKey,
  changeCanvasLogoPosition,
};

export const thunkActions = {
  addCanvasStickerLayerWithUrl,
  addCanvasUserLayerFromFile,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

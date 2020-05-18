import { Dispatch } from "redux";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { getOrCreateStore } from "~/domains";

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

export const actions = {
  addCanvasStickerLayer,
  startCanvasStickerLayerTransform,
  startCanvasStickerLayerDrag,
  setCanvasStickerLayerActive,
  removeCanvasStickerLayer,
};

export const thunkActions = {
  addCanvasStickerLayerWithUrl,
};

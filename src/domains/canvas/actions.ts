import { Dispatch } from "redux";
import blueimpLoadImage from "blueimp-load-image";
import * as container from "./container/actions";
import * as stickers from "./stickers/actions";
import * as users from "./users/actions";
import { CanvasUserLayerFrame } from "./frames";
import { getOrCreateStore } from "~/domains";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { checkAndResizeImage } from "~/utils/check-and-resize-image";

export const TICK = "CANVAS/TICK" as const;
export const COMPLETE = "CANVAS/COMPLETE" as const;
export const SET_FRAME = "CANVAS/SET_FRAME" as const;
export const ADD_USER_IMAGE_AND_SET_FRAME = "CANVAS/ADD_USER_IMAGE_AND_SET_FRAME" as const;
export const SET_DEFAULT_FRAME = "CANVAS/SET_DEFAULT_FRAME" as const;

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

const convertUrlToImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onerror = () => reject();
    image.onload = () => resolve(image);

    image.src = url;
  });
};

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
  ...container.actions,
  ...stickers.actions,
  ...users.actions,
  tick,
  complete,
  setFrame,
  addCanvasUserLayerAndSetFrame,
  setDefaultFrame,
};

export const thunkActions = {
  ...stickers.thunkActions,
  ...users.thunkActions,
  addCanvasUserLayerAndSetFrameFromFile,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

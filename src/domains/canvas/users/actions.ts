import { Dispatch } from "redux";
import blueimpLoadImage from "blueimp-load-image";
import { FeColorMatrix } from "~/types/FeColorMatrix";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { getOrCreateStore } from "~/domains";
import { checkAndResizeImage } from "~/utils/check-and-resize-image";

export const ADD = "CANVAS/CANVAS_USER_LAYER/ADD" as const;
export const REMOVE = "CANVAS/CANVAS_USER_LAYER/REMOVE" as const;
export const START_DRAG = "CANVAS/CANVAS_USER_LAYER/START_DRAG" as const;
export const SET_POSITION = "CANVAS/CANVAS_USER_LAYER/SET_POSITION" as const;
export const FILTER_SET_VALUE = "CANVAS/CANVAS_FILTER/SET_VALUE" as const;

export const addCanvasUserLayer = (
  index: number,
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: ADD,
  payload: {
    index,
    dataUrl,
    width,
    height,
  },
});

export const removeCanvasUserLayer = (index: number) => ({
  type: REMOVE,
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
    type: START_DRAG,
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
    type: SET_POSITION,
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

export const actions = {
  addCanvasUserLayer,
  removeCanvasUserLayer,
  setCanvasUserLayerPosition,
  startCanvasUserLayerDrag,
  setUserLayerFilterValue,
};

export const thunkActions = {
  addCanvasUserLayerFromFile,
};

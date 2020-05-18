import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { getOrCreateStore } from "..";

// Container

export const SET_ACTUAL_SIZE = "CROPPER/CONTAINER/SET_ACTUAL_SIZE" as const;
export const SET_SVG_POSITION_AND_SIZE = "CROPPER/CONTAINER/SET_SVG_POSITION_AND_SIZE" as const;

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
}) => {
  const {
    cropper: { image },
  } = getOrCreateStore().getState();

  return {
    type: SET_SVG_POSITION_AND_SIZE,
    payload: {
      x,
      y,
      width,
      height,
      image,
    },
  };
};

export const containerActions = {
  setSvgPositionAndSize,
};

// Cropper

export const START_CROPPER_MOVING = "CROPPER/CROPPER/START_MOVING" as const;
export const START_CROPPER_TRANSFORMING = "CROPPER/CROPPER/START_TRANSFORMING" as const;
export const CHANGE_FREE_ASPECT = "CROPPER/CROPPER/CHANGE_FREE_ASPECT" as const;
export const SET_ASPECT_RATIO = "CROPPER/CROPPER/SET_ASPECT_RATIO" as const;

export const startCropperMoving = (cursorPositions: CursorPosition[]) => {
  const { container, image } = getOrCreateStore().getState().cropper;

  return {
    type: START_CROPPER_MOVING,
    payload: { container, image, cursorPositions },
  };
};

export const startCropperTransforming = (cursorPositions: CursorPosition[]) => {
  const { container, image } = getOrCreateStore().getState().cropper;

  return {
    type: START_CROPPER_TRANSFORMING,
    payload: { container, image, cursorPositions },
  };
};

export const changeFreeAspect = () => ({
  type: CHANGE_FREE_ASPECT,
});

export const setAspectRatio = (
  index: number,
  widthRatio: number,
  heightRatio: number
) => ({
  type: SET_ASPECT_RATIO,
  payload: { index, widthRatio, heightRatio },
});

export const cropperActions = {
  startCropperMoving,
  startCropperTransforming,
  changeFreeAspect,
  setAspectRatio,
};

// Images

export const SET_IMAGE = "CROPPER/IMAGE/SET" as const;
export const START_IMAGE_TRANSFORMING = "CROPPER/IMAGE/START_TRANSFORMING" as const;

export const setImage = (payload: {
  url: string;
  width: number;
  height: number;
}) => ({
  type: SET_IMAGE,
  payload,
});

export const startImageTransforming = (payload: CursorPosition[]) => ({
  type: START_IMAGE_TRANSFORMING,
  payload,
});

export const imageActions = {
  setImage,
  startImageTransforming,
};

// Common

export const TICK = "CROPPER/TICK" as const;
export const COMPLETE = "CROPPER/COMPLETE" as const;

export const tick = (cursorPositions: CursorPosition[]) => {
  const { container } = getOrCreateStore().getState().cropper;

  return {
    type: TICK,
    payload: { container, cursorPositions },
  };
};

export const complete = () => ({
  type: COMPLETE,
});

export const actions = {
  ...containerActions,
  ...cropperActions,
  ...imageActions,
  tick,
  complete,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

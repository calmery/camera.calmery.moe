import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { getOrCreateStore } from "..";
import * as types from "./types";

// Container

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
    type: types.SET_SVG_POSITION_AND_SIZE,
    payload: {
      x,
      y,
      width,
      height,
      image,
    },
  };
};

const containerActions = {
  setSvgPositionAndSize,
};

// Cropper

const startCropperMoving = (cursorPositions: CursorPosition[]) => {
  const { container, image } = getOrCreateStore().getState().cropper;

  return {
    type: types.START_CROPPER_MOVING,
    payload: { container, image, cursorPositions },
  };
};

const startCropperTransforming = (cursorPositions: CursorPosition[]) => {
  const { container, image } = getOrCreateStore().getState().cropper;

  return {
    type: types.START_CROPPER_TRANSFORMING,
    payload: { container, image, cursorPositions },
  };
};

const changeFreeAspect = () => ({
  type: types.CHANGE_FREE_ASPECT,
});

const setAspectRatio = (
  index: number,
  widthRatio: number,
  heightRatio: number
) => ({
  type: types.SET_ASPECT_RATIO,
  payload: { index, widthRatio, heightRatio },
});

const cropperActions = {
  startCropperMoving,
  startCropperTransforming,
  changeFreeAspect,
  setAspectRatio,
};

// Images

const setImage = (payload: { url: string; width: number; height: number }) => ({
  type: types.SET_IMAGE,
  payload,
});

const startImageTransforming = (payload: CursorPosition[]) => ({
  type: types.START_IMAGE_TRANSFORMING,
  payload,
});

const imageActions = {
  setImage,
  startImageTransforming,
};

// Common

const tick = (cursorPositions: CursorPosition[]) => {
  const { container } = getOrCreateStore().getState().cropper;

  return {
    type: types.TICK,
    payload: { container, cursorPositions },
  };
};

const complete = () => ({
  type: types.COMPLETE,
});

export const actions = {
  ...containerActions,
  ...cropperActions,
  ...imageActions,
  tick,
  complete,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

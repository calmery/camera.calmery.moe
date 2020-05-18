import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
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

// Cropper

const startCropperMoving = (cursorPositions: CursorPosition[]) => ({
  type: types.START_CROPPER_MOVING,
  payload: { cursorPositions },
});

const startCropperTransforming = (cursorPositions: CursorPosition[]) => ({
  type: types.START_CROPPER_TRANSFORMING,
  payload: { cursorPositions },
});

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

const tick = (cursorPositions: CursorPosition[]) => ({
  type: types.TICK,
  payload: { cursorPositions },
});

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

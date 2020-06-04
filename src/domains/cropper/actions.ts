import * as types from "./types";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";

const updateDisplayableRect = ({
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
  type: types.CROPPER_UPDATE_DISPLAYABLE_RECT,
  payload: {
    x,
    y,
    width,
    height,
  },
});

const startCropperCropperDrag = (cursorPositions: CursorPosition[]) => ({
  type: types.CROPPER_CROPPER_START_DRAG,
  payload: { cursorPositions },
});

const startCropperCropperTransform = (cursorPositions: CursorPosition[]) => ({
  type: types.CROPPER_CROPPER_START_TRANSFORM,
  payload: { cursorPositions },
});

const changeCropperCropperAspectRatio = (
  index: number,
  widthRatio: number,
  heightRatio: number
) => ({
  type: types.CROPPER_CROPPER_CHANGE_ASPECT_RATIO,
  payload: { index, widthRatio, heightRatio },
});

const changeCropperCropperFreeAspectRatio = () => ({
  type: types.CROPPER_CROPPER_CHANGE_FREE_ASPECT_RATIO,
});

// Images

const initializeCropperImage = (payload: {
  url: string;
  width: number;
  height: number;
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
}) => ({
  type: types.CROPPER_IMAGE_INITIALIZE,
  payload,
});

const startCropperImageTransform = (payload: CursorPosition[]) => ({
  type: types.CROPPER_IMAGE_START_TRANSFORM,
  payload,
});

// Common

const tickCropper = (cursorPositions: CursorPosition[]) => ({
  type: types.CROPPER_TICK,
  payload: { cursorPositions },
});

const completeCropper = () => ({
  type: types.CROPPER_COMPLETE,
});

export const actions = {
  updateDisplayableRect,
  startCropperCropperDrag,
  startCropperCropperTransform,
  changeCropperCropperAspectRatio,
  changeCropperCropperFreeAspectRatio,
  initializeCropperImage,
  startCropperImageTransform,
  tickCropper,
  completeCropper,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

import { getOrCreateStore } from "~/domains";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";

export const START_CROPPER_MOVING = "CROPPER/CROPPER/START_MOVING" as const;
export const START_CROPPER_TRANSFORMING = "CROPPER/CROPPER/START_TRANSFORMING" as const;
export const CHANGE_FREE_ASPECT = "CROPPER/CROPPER/CHANGE_FREE_ASPECT" as const;
export const SET_ASPECT_RATIO = "CROPPER/CROPPER/SET_ASPECT_RATIO" as const;

export const startCropperMoving = (cursorPositions: CursorPosition[]) => {
  const { container } = getOrCreateStore().getState().cropper;

  return {
    type: START_CROPPER_MOVING,
    payload: { container, cursorPositions },
  };
};

export const startCropperTransforming = (cursorPositions: CursorPosition[]) => {
  const { container } = getOrCreateStore().getState().cropper;

  return {
    type: START_CROPPER_TRANSFORMING,
    payload: { container, cursorPositions },
  };
};

export const changeFreeAspect = () => ({
  type: CHANGE_FREE_ASPECT,
});

export const setAspectRatio = (widthRatio: number, heightRatio: number) => ({
  type: SET_ASPECT_RATIO,
  payload: { widthRatio, heightRatio },
});

export const actions = {
  startCropperMoving,
  startCropperTransforming,
  changeFreeAspect,
  setAspectRatio,
};

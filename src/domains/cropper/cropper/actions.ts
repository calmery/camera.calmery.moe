import {
  convertEventToCursorPositions,
  CursorPosition,
} from "~/utils/convert-event-to-positions";
import { CropperContainerState } from "../container/reducer";

export const START_CROPPER_MOVING = "CROPPER/START_CROPPER_MOVING" as const;
export const START_CROPPER_TRANSFORMING = "CROPPER/START_CROPPER_TRANSFORMING" as const;
export const CHANGE_FREE_ASPECT = "CROPPER/CHANGE_FREE_ASPECT" as const;
export const SET_ASPECT_RATIO = "CROPPER/SET_ASPECT_RATIO" as const;

// Actions

export const startCropperMoving = (
  event: React.MouseEvent | React.TouchEvent,
  container: CropperContainerState
) => ({
  type: START_CROPPER_MOVING,
  payload: { positions: convertEventToCursorPositions(event), container },
});

export const startCropperTransforming = (
  positions: CursorPosition[],
  container: CropperContainerState
) => ({
  type: START_CROPPER_TRANSFORMING,
  payload: { positions, container },
});

export const changeFreeAspect = () => ({
  type: CHANGE_FREE_ASPECT,
});

export const setAspectRatio = (widthRatio: number, heightRatio: number) => ({
  type: SET_ASPECT_RATIO,
  payload: { widthRatio, heightRatio },
});

// Types

export const actions = {
  startCropperMoving,
  startCropperTransforming,
  changeFreeAspect,
  setAspectRatio,
};

import { convertEventToPositions } from "~/utils/convert-event-to-positions";

export const START_CROPPER_MOVING = "CROPPER/START_CROPPER_MOVING" as const;
export const START_CROPPER_TRANSFORMING = "CROPPER/START_CROPPER_TRANSFORMING" as const;
export const START_IMAGE_TRANSFORMING = "CROPPER/START_IMAGE_TRANSFORMING" as const;
export const CHANGE_FREE_ASPECT = "CROPPER/CHANGE_FREE_ASPECT" as const;
export const SET_ASPECT_RATIO = "CROPPER/SET_ASPECT_RATIO" as const;
export const SET_CONTAINER_DISPLAY_SIZE = "CROPPER/SET_CONTAINER_DISPLAY_SIZE" as const;
export const TICK = "CROPPER/TICK" as const;
export const COMPLETE = "CROPPER/COMPLETE" as const;

// Actions

export const startCropperMoving = (
  event: React.MouseEvent | React.TouchEvent
) => ({
  type: START_CROPPER_MOVING,
  payload: convertEventToPositions(event),
});

export const startCropperTransforming = (
  event: React.TouchEvent | React.MouseEvent
) => ({
  type: START_CROPPER_TRANSFORMING,
  payload: convertEventToPositions(event),
});

export const startImageTransforming = (event: TouchEvent) => ({
  type: START_IMAGE_TRANSFORMING,
  payload: { event },
});

export const tick = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
) => ({
  type: TICK,
  payload: convertEventToPositions(event),
});

export const changeFreeAspect = () => ({
  type: CHANGE_FREE_ASPECT,
});

export const setAspectRatio = (widthRatio: number, heightRatio: number) => ({
  type: SET_ASPECT_RATIO,
  payload: { widthRatio, heightRatio },
});

export const setContainerDisplaySize = (payload: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => ({
  type: SET_CONTAINER_DISPLAY_SIZE,
  payload,
});

export const complete = () => ({
  type: COMPLETE,
});

// Types

export type Actions =
  | ReturnType<typeof startCropperMoving>
  | ReturnType<typeof startCropperTransforming>
  | ReturnType<typeof startImageTransforming>
  | ReturnType<typeof changeFreeAspect>
  | ReturnType<typeof setAspectRatio>
  | ReturnType<typeof setContainerDisplaySize>
  | ReturnType<typeof tick>
  | ReturnType<typeof complete>;

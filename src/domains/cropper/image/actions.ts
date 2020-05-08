import { CursorPosition } from "~/utils/convert-event-to-positions";

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

export const actions = {
  setImage,
  startImageTransforming,
};

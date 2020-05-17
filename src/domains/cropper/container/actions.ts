import { getOrCreateStore } from "~/domains";

export const SET_ACTUAL_SIZE = "CROPPER/CONTAINER/SET_ACTUAL_SIZE" as const;
export const SET_SVG_POSITION_AND_SIZE = "CROPPER/CONTAINER/SET_SVG_POSITION_AND_SIZE" as const;

const setActualSize = ({
  x,
  y,
  width,
}: {
  x: number;
  y: number;
  width: number;
}) => {
  const {
    cropper: { image },
  } = getOrCreateStore().getState();

  return {
    type: SET_ACTUAL_SIZE,
    payload: {
      x,
      y,
      displayRatio: image.width / width,
    },
  };
};

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

export const actions = {
  setActualSize,
  setSvgPositionAndSize,
};

import { getOrCreateStore } from "~/domains";

export const SET_ACTUAL_SIZE = "CROPPER/CONTAINER/SET_ACTUAL_SIZE" as const;

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

export const actions = {
  setActualSize,
};

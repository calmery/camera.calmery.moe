export const SET_ACTUAL_SIZE = "CROPPER/CONTAINER/SET_ACTUAL_SIZE" as const;

const setActualSize = (payload: {
  x: number;
  y: number;
  width: number;
  height: number;
  displayRatio: number;
}) => {
  return {
    type: SET_ACTUAL_SIZE,
    payload,
  };
};

export const actions = {
  setActualSize,
};

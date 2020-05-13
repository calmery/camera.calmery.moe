export const SET_ACTUAL_SIZE = "CANVAS/CONTAINER/SET_ACTUAL_SIZE" as const;

const setActualSize = ({
  x,
  y,
  width,
}: {
  x: number;
  y: number;
  width: number;
}) => ({
  type: SET_ACTUAL_SIZE,
  payload: {
    actualX: x,
    actualY: y,
    actualWidth: width,
  },
});

export const actions = {
  setActualSize,
};

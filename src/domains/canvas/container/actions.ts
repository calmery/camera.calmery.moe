export const SET_SVG_POSITION_AND_SIZE = "CANVAS/CONTAINER/SET_SVG_POSITION_AND_SIZE" as const;

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
  type: SET_SVG_POSITION_AND_SIZE,
  payload: {
    x,
    y,
    width,
    height,
  },
});

export const actions = {
  setSvgPositionAndSize,
};

import * as actions from "./actions";
import { TICK, Actions, COMPLETE } from "../actions";

const { SET_IMAGE, START_IMAGE_TRANSFORMING } = actions;

export type CropperImageState = {
  url: string;
  width: number;
  height: number;
  isImageTransforming: boolean;
  position: {
    x: number;
    y: number;
  };
  rotate: {
    current: number;
    previous: number;
    valueAtTransformStart: number;
  };
  scale: {
    current: number;
    previous: number;
    valueAtTransformStart: number;
  };
};

const initialState: CropperImageState = {
  isImageTransforming: false,
  url: "images/background.jpg",
  width: 1500,
  height: 1065,
  position: {
    x: 0,
    y: 0,
  },
  scale: {
    current: 1,
    previous: 1,
    valueAtTransformStart: 0,
  },
  rotate: {
    current: 0,
    previous: 0,
    valueAtTransformStart: 0,
  },
};

// Events

const setImage = ({
  url,
  width,
  height,
}: ReturnType<typeof actions.setImage>["payload"]) => ({
  url,
  width,
  height,
  isImageTransforming: false,
  position: {
    x: 0,
    y: 0,
  },
  scale: {
    current: 1,
    previous: 1,
    valueAtTransformStart: 0,
  },
  rotate: {
    current: 0,
    previous: 0,
    valueAtTransformStart: 0,
  },
});

const startImageTransforming = (
  state: CropperImageState,
  positions: ReturnType<typeof actions.startImageTransforming>["payload"]
): CropperImageState => {
  // Multi Touch
  if (positions.length > 1) {
    const distanceBetweenFingers = Math.pow(
      Math.pow(positions[1].clientX - positions[0].clientX, 2) +
        Math.pow(positions[1].clientY - positions[0].clientY, 2),
      0.5
    );

    const angleBetweenFingers =
      Math.atan2(
        positions[1].clientY - positions[0].clientY,
        positions[1].clientX - positions[0].clientX
      ) *
      (180 / Math.PI);

    return {
      ...state,
      isImageTransforming: true,
      scale: {
        ...state.scale,
        previous: state.scale.current,
        valueAtTransformStart: distanceBetweenFingers,
      },
      rotate: {
        ...state.rotate,
        previous: state.rotate.current,
        valueAtTransformStart: angleBetweenFingers,
      },
    };
  }

  return state;
};

const tick = (
  state: CropperImageState,
  positions: { clientX: number; clientY: number }[]
) => {
  const { rotate, isImageTransforming } = state;

  if (!isImageTransforming && positions.length < 2) {
    return state;
  }

  const nextAngle =
    rotate.previous +
    (Math.atan2(
      positions[1].clientY - positions[0].clientY,
      positions[1].clientX - positions[0].clientX
    ) *
      (180 / Math.PI) -
      rotate.valueAtTransformStart);
  const currentLength = Math.pow(
    Math.pow(positions[1].clientX - positions[0].clientX, 2) +
      Math.pow(positions[1].clientY - positions[0].clientY, 2),
    0.5
  );
  const nextScale =
    (currentLength / state.scale.valueAtTransformStart) * state.scale.previous;
  const nextX =
    state.position.x +
    (state.width * state.scale.current - state.width * nextScale) / 2;
  const nextY =
    state.position.y +
    (state.height * state.scale.current - state.height * nextScale) / 2;

  return {
    ...state,
    position: {
      x: nextX,
      y: nextY,
    },
    scale: {
      ...state.scale,
      current: nextScale,
    },
    rotate: {
      ...state.rotate,
      current: nextAngle,
    },
  };
};

const complete = (state: CropperImageState): CropperImageState => ({
  ...state,
  isImageTransforming: false,
});

// Main

export default (state = initialState, action: Actions) => {
  switch (action.type) {
    case SET_IMAGE:
      return setImage(action.payload);

    case START_IMAGE_TRANSFORMING:
      return startImageTransforming(state, action.payload);

    case TICK:
      return tick(state, action.payload.positions);

    case COMPLETE:
      return complete(state);

    default:
      return state;
  }
};

import { CropperContainerState } from "../container/reducer";
import { COMPLETE, TICK, Actions } from "../actions";
import * as actions from "./actions";

const {
  CHANGE_FREE_ASPECT,
  SET_ASPECT_RATIO,
  START_CROPPER_MOVING,
  START_CROPPER_TRANSFORMING,
} = actions;

// Constants

const CROPPER_DEFAULT_WIDTH = 320;
const CROPPER_DEFAULT_HEIGHT = 180;

// Types

export type CropperCropperState = {
  freeAspect: boolean;
  isCropperMoving: boolean;
  isCropperTransforming: boolean;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
    referenceX: number;
    referenceY: number;
  };
  scale: {
    current: number;
    previous: number;
    reference: number;
  };
  scaleX: {
    current: number;
    previous: number;
    reference: number;
  };
  scaleY: {
    current: number;
    previous: number;
    reference: number;
  };
};

const initialState: CropperCropperState = {
  isCropperMoving: false,
  isCropperTransforming: false,
  freeAspect: true,
  width: CROPPER_DEFAULT_WIDTH,
  height: CROPPER_DEFAULT_HEIGHT,
  position: {
    x: 0,
    y: 0,
    referenceX: 0,
    referenceY: 0,
  },
  scale: {
    current: 1,
    previous: 1,
    reference: 0,
  },
  scaleX: {
    current: 1,
    previous: 1,
    reference: 0,
  },
  scaleY: {
    current: 1,
    previous: 1,
    reference: 0,
  },
};

// Events

const startCropperMoving = (
  state: CropperCropperState,
  positions: { clientX: number; clientY: number }[],
  container: CropperContainerState
): CropperCropperState => {
  const { position } = state;

  const referenceX =
    (positions[0].clientX - container.actualX) * container.displayRatio -
    position.x;
  const referenceY =
    (positions[0].clientY - container.actualY) * container.displayRatio -
    position.y;

  return {
    ...state,
    isCropperMoving: true,
    position: {
      ...state.position,
      referenceX,
      referenceY,
    },
  };
};

const startCropperTransforming = (
  state: CropperCropperState,
  positions: { clientX: number; clientY: number }[],
  container: CropperContainerState
): CropperCropperState => {
  const { position } = state;

  const scale = Math.pow(
    Math.pow(
      (positions[0].clientX - container.actualX) * container.displayRatio -
        position.x,
      2
    ) +
      Math.pow(
        (positions[0].clientY - container.actualY) * container.displayRatio -
          position.y,
        2
      ),
    0.5
  );
  const scaleX =
    (positions[0].clientX - container.actualX) * container.displayRatio -
    position.x;
  const scaleY =
    (positions[0].clientY - container.actualY) * container.displayRatio -
    position.y;

  return {
    ...state,
    isCropperTransforming: true,
    scale: {
      ...state.scale,
      previous: state.scale.current,
      reference: scale,
    },
    scaleX: {
      ...state.scaleX,
      previous: state.scaleX.current,
      reference: scaleX,
    },
    scaleY: {
      ...state.scaleY,
      previous: state.scaleY.current,
      reference: scaleY,
    },
  };
};

const setAspectRatio = (
  state: CropperCropperState,
  { widthRatio, heightRatio }: { widthRatio: number; heightRatio: number }
): CropperCropperState => {
  const { scale, scaleX, scaleY, freeAspect, width, height } = state;
  const currentWidth = width * (freeAspect ? scaleX.current : scale.current);
  const currentHeight = height * (freeAspect ? scaleY.current : scale.current);
  const nextWidth =
    ((currentWidth + currentHeight) / (widthRatio + heightRatio)) * widthRatio;
  const nextHeight =
    ((currentWidth + currentHeight) / (widthRatio + heightRatio)) * heightRatio;
  const differenceWidth =
    width * (freeAspect ? scaleX : scale).current - nextWidth;
  const differenceHeight =
    height * (freeAspect ? scaleY : scale).current - nextHeight;

  return {
    ...state,
    width: nextWidth,
    height: nextHeight,
    position: {
      ...state.position,
      x: state.position.x + differenceWidth / 2,
      y: state.position.y + differenceHeight / 2,
    },
    scale: {
      ...state.scale,
      current: 1,
    },
    scaleX: {
      ...state.scaleX,
      current: 1,
    },
    scaleY: {
      ...state.scaleY,
      current: 1,
    },
  };
};

const changeFreeAspect = (state: CropperCropperState): CropperCropperState => {
  const { scale, scaleX, scaleY, freeAspect } = state;
  const nextScale = (scaleX.current < scaleY.current ? scaleX : scaleY).current;

  return {
    ...state,
    freeAspect: !freeAspect,
    scale: {
      ...state.scale,
      current: !freeAspect ? nextScale : scale.current,
    },
    scaleX: {
      ...state.scaleX,
      current: (freeAspect ? scale : scaleX).current,
    },
    scaleY: {
      ...state.scaleY,
      current: (freeAspect ? scale : scaleY).current,
    },
  };
};

const complete = (state: CropperCropperState): CropperCropperState => ({
  ...state,
  isCropperMoving: false,
  isCropperTransforming: false,
});

const moveCropper = (
  state: CropperCropperState,
  cursorX: number,
  cursorY: number,
  container: CropperContainerState
) => {
  const { position } = state;

  const relativeX = (cursorX - container.actualX) * container.displayRatio;
  const relativeY = (cursorY - container.actualY) * container.displayRatio;

  const nextX = relativeX - position.referenceX;
  const nextY = relativeY - position.referenceY;

  return {
    ...state,
    position: {
      ...state.position,
      x: nextX,
      y: nextY,
    },
  };
};

const transformCropper = (
  state: CropperCropperState,
  positions: { clientX: number; clientY: number }[],
  container: CropperContainerState
) => {
  const [{ clientX, clientY }] = positions;
  const cropper = state;

  if (cropper.freeAspect) {
    let nextScaleX =
      (((clientX - container.actualX) * container.displayRatio -
        cropper.position.x) /
        cropper.scaleX.reference) *
      cropper.scaleX.previous;
    let nextScaleY =
      (((clientY - container.actualY) * container.displayRatio -
        cropper.position.y) /
        cropper.scaleY.reference) *
      cropper.scaleY.previous;

    if (cropper.width * nextScaleX < CROPPER_DEFAULT_WIDTH) {
      nextScaleX = cropper.scaleX.current;
    }

    if (cropper.height * nextScaleY < CROPPER_DEFAULT_HEIGHT) {
      nextScaleY = cropper.scaleY.current;
    }

    return {
      ...state,
      scaleX: {
        ...state.scaleX,
        current: nextScaleX,
      },
      scaleY: {
        ...state.scaleY,
        current: nextScaleY,
      },
    };
  }

  const nextScale =
    (Math.pow(
      Math.pow(
        (clientX - container.actualX) * container.displayRatio -
          cropper.position.x,
        2
      ) +
        Math.pow(
          (clientY - container.actualY) * container.displayRatio -
            cropper.position.y,
          2
        ),
      0.5
    ) /
      cropper.scale.reference) *
    cropper.scale.previous;

  if (
    cropper.width * nextScale >= CROPPER_DEFAULT_WIDTH &&
    !(
      (clientX - container.actualX) * container.displayRatio <
        cropper.position.x ||
      (clientY - container.actualY) * container.displayRatio <
        cropper.position.y
    )
  ) {
    return {
      ...state,
      scale: {
        ...state.scale,
        current: nextScale,
      },
    };
  }

  return state;
};

const tick = (
  state: CropperCropperState,
  positions: { clientX: number; clientY: number }[],
  container: CropperContainerState
) => {
  const { isCropperTransforming, isCropperMoving } = state;

  if (isCropperMoving) {
    const [{ clientX, clientY }] = positions;
    return moveCropper(state, clientX, clientY, container);
  }

  if (isCropperTransforming) {
    return transformCropper(state, positions, container);
  }

  return state;
};

// Main

export default (state = initialState, action: Actions) => {
  switch (action.type) {
    case START_CROPPER_MOVING:
      return startCropperMoving(
        state,
        action.payload.positions,
        action.payload.container
      );

    case START_CROPPER_TRANSFORMING:
      return startCropperTransforming(
        state,
        action.payload.positions,
        action.payload.container
      );

    case CHANGE_FREE_ASPECT:
      return changeFreeAspect(state);

    case SET_ASPECT_RATIO:
      return setAspectRatio(state, action.payload);

    case TICK:
      return tick(state, action.payload.positions, action.payload.container);

    case COMPLETE:
      return complete(state);

    default:
      return state;
  }
};

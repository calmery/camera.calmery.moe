import {
  CHANGE_FREE_ASPECT,
  SET_ASPECT_RATIO,
  START_CROPPER_MOVING,
  START_CROPPER_TRANSFORMING,
} from "./actions";
import { COMPLETE, TICK, Actions } from "~/domains/cropper/actions";
import { CropperContainerState } from "~/domains/cropper/container/reducer";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { distanceBetweenTwoPoints } from "~/utils/distance-between-two-points";

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
    valueAtTransformStartX: number;
    valueAtTransformStartY: number;
  };
  scale: {
    current: number;
    previous: number;
    valueAtTransformStart: number;
  };
  scaleX: {
    current: number;
    previous: number;
    valueAtTransformStart: number;
  };
  scaleY: {
    current: number;
    previous: number;
    valueAtTransformStart: number;
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
    valueAtTransformStartX: 0,
    valueAtTransformStartY: 0,
  },
  scale: {
    current: 1,
    previous: 1,
    valueAtTransformStart: 0,
  },
  scaleX: {
    current: 1,
    previous: 1,
    valueAtTransformStart: 0,
  },
  scaleY: {
    current: 1,
    previous: 1,
    valueAtTransformStart: 0,
  },
};

// Helper Functions

const moveHelper = (
  state: CropperCropperState,
  cursorPosition: CursorPosition,
  container: CropperContainerState
) => {
  const { position } = state;
  const { x, y } = cursorPosition;

  const relativeX = (x - container.actualX) * container.displayRatio;
  const relativeY = (y - container.actualY) * container.displayRatio;

  const nextX = relativeX - position.valueAtTransformStartX;
  const nextY = relativeY - position.valueAtTransformStartY;

  return {
    ...state,
    position: {
      ...state.position,
      x: nextX,
      y: nextY,
    },
  };
};

const transformHelper = (
  state: CropperCropperState,
  positions: CursorPosition[],
  container: CropperContainerState
) => {
  const [{ x, y }] = positions;
  const cropper = state;

  if (cropper.freeAspect) {
    let nextScaleX =
      (((x - container.actualX) * container.displayRatio - cropper.position.x) /
        cropper.scaleX.valueAtTransformStart) *
      cropper.scaleX.previous;
    let nextScaleY =
      (((y - container.actualY) * container.displayRatio - cropper.position.y) /
        cropper.scaleY.valueAtTransformStart) *
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
    (distanceBetweenTwoPoints(
      cropper.position.x,
      cropper.position.y,
      (x - container.actualX) * container.displayRatio,
      (y - container.actualY) * container.displayRatio
    ) /
      cropper.scale.valueAtTransformStart) *
    cropper.scale.previous;

  if (
    cropper.width * nextScale >= CROPPER_DEFAULT_WIDTH &&
    !(
      (x - container.actualX) * container.displayRatio < cropper.position.x ||
      (y - container.actualY) * container.displayRatio < cropper.position.y
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

const distanceFromCropperStartPosition = (
  container: CropperContainerState,
  position: CropperCropperState["position"],
  cursorPosition: CursorPosition
) => {
  const { x, y } = cursorPosition;

  return [
    (x - container.actualX) * container.displayRatio - position.x,
    (y - container.actualY) * container.displayRatio - position.y,
  ];
};

// Reducer

export default (state = initialState, action: Actions) => {
  switch (action.type) {
    case START_CROPPER_MOVING: {
      const { position } = state;
      const { container, cursorPositions } = action.payload;
      const [
        valueAtTransformStartX,
        valueAtTransformStartY,
      ] = distanceFromCropperStartPosition(
        container,
        position,
        cursorPositions[0]
      );

      return {
        ...state,
        isCropperMoving: true,
        position: {
          ...state.position,
          valueAtTransformStartX,
          valueAtTransformStartY,
        },
      };
    }

    case START_CROPPER_TRANSFORMING: {
      const { container, cursorPositions } = action.payload;
      const { position } = state;

      const cursorPositionX = cursorPositions[0].x;
      const cursorPositionY = cursorPositions[0].y;

      return {
        ...state,
        isCropperTransforming: true,
        scale: {
          ...state.scale,
          previous: state.scale.current,
          valueAtTransformStart: distanceBetweenTwoPoints(
            position.x,
            position.y,
            (cursorPositionX - container.actualX) * container.displayRatio,
            (cursorPositionY - container.actualY) * container.displayRatio
          ),
        },
        scaleX: {
          ...state.scaleX,
          previous: state.scaleX.current,
          valueAtTransformStart:
            (cursorPositionX - container.actualX) * container.displayRatio -
            position.x,
        },
        scaleY: {
          ...state.scaleY,
          previous: state.scaleY.current,
          valueAtTransformStart:
            (cursorPositionY - container.actualY) * container.displayRatio -
            position.y,
        },
      };
    }

    case CHANGE_FREE_ASPECT: {
      const { freeAspect, scale, scaleX, scaleY } = state;
      const nextFreeAspect = !freeAspect;

      if (nextFreeAspect) {
        return {
          ...state,
          freeAspect: true,
          scaleX: {
            ...scaleX,
            current: scale.current,
          },
          scaleY: {
            ...scaleX,
            current: scale.current,
          },
        };
      }

      return {
        ...state,
        freeAspect: false,
        scale: {
          ...state.scale,
          current: (scaleX.current < scaleY.current ? scaleX : scaleY).current,
        },
      };
    }

    case SET_ASPECT_RATIO: {
      const { widthRatio, heightRatio } = action.payload;
      const { freeAspect, scale, scaleX, scaleY, width, height } = state;

      const currentWidth =
        width * (freeAspect ? scaleX.current : scale.current);
      const currentHeight =
        height * (freeAspect ? scaleY.current : scale.current);
      const nextWidth =
        ((currentWidth + currentHeight) / (widthRatio + heightRatio)) *
        widthRatio;
      const nextHeight =
        ((currentWidth + currentHeight) / (widthRatio + heightRatio)) *
        heightRatio;
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
    }

    case TICK: {
      const { container, cursorPositions } = action.payload;
      const { isCropperTransforming, isCropperMoving } = state;

      if (isCropperMoving) {
        return moveHelper(state, cursorPositions[0], container);
      }

      if (isCropperTransforming) {
        return transformHelper(state, cursorPositions, container);
      }

      return state;
    }

    case COMPLETE:
      return {
        ...state,
        isCropperMoving: false,
        isCropperTransforming: false,
      };

    default:
      return state;
  }
};

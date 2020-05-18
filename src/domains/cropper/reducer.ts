import { Actions, SET_SVG_POSITION_AND_SIZE } from "./actions";

// Container

export type CropperContainerState = {
  actualX: number;
  actualY: number;
  actualWidth: number;
  actualHeight: number;
  displayRatio: number;
};

const containerInitialState: CropperContainerState = {
  actualX: 0,
  actualY: 0,
  actualWidth: 0,
  actualHeight: 0,
  displayRatio: 0,
};

const containerReducer = (state = containerInitialState, action: Actions) => {
  switch (action.type) {
    case SET_SVG_POSITION_AND_SIZE: {
      const { x, y, width, height, image } = action.payload;
      const { width: imageWidth, height: imageHeight } = image;

      let svgWidth = width;
      let svgHeight = imageHeight * (width / imageWidth);
      let svgX = x;
      let svgY = y + (height - svgHeight) / 2;

      if (svgHeight > height) {
        svgHeight = height;
        svgWidth = imageWidth * (height / imageHeight);
        svgX = x + (width - svgWidth) / 2;
        svgY = y;
      }

      return {
        ...state,
        actualX: svgX,
        actualY: svgY,
        actualWidth: svgWidth,
        actualHeight: svgHeight,
        displayRatio: imageWidth / svgWidth,
      };
    }

    default:
      return state;
  }
};

// Cropper

import {
  CHANGE_FREE_ASPECT,
  SET_ASPECT_RATIO,
  START_CROPPER_MOVING,
  START_CROPPER_TRANSFORMING,
} from "./actions";
import { COMPLETE, TICK } from "~/domains/cropper/actions";
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
  selectedIndex: number;
};

const cropperInitialState: CropperCropperState = {
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
  selectedIndex: -1,
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

const cropperReducer = (state = cropperInitialState, action: Actions) => {
  switch (action.type) {
    case START_CROPPER_MOVING: {
      const { position } = state;
      const { container, cursorPositions, image } = action.payload;

      if (image.isImageTransforming) {
        return state;
      }

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
      const { container, image, cursorPositions } = action.payload;
      const { position } = state;

      if (image.isImageTransforming) {
        return state;
      }

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
        selectedIndex: -1,
      };
    }

    case SET_ASPECT_RATIO: {
      const { widthRatio, heightRatio, index } = action.payload;
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
        selectedIndex: index,
        freeAspect: false,
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

// Images

import { SET_IMAGE, START_IMAGE_TRANSFORMING } from "./actions";
import { angleBetweenTwoPoints } from "~/utils/angle-between-two-points";

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

const imageInitialState: CropperImageState = {
  url: "",
  width: 0,
  height: 0,
  isImageTransforming: false,
  position: {
    x: 0,
    y: 0,
  },
  rotate: {
    current: 0,
    previous: 0,
    valueAtTransformStart: 0,
  },
  scale: {
    current: 1,
    previous: 1,
    valueAtTransformStart: 0,
  },
};

const imageReducer = (state = imageInitialState, action: Actions) => {
  switch (action.type) {
    case SET_IMAGE: {
      const { url, width, height } = action.payload;

      return {
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
      };
    }

    case START_IMAGE_TRANSFORMING: {
      const positions = action.payload;

      if (positions.length < 2) {
        return state;
      }

      return {
        ...state,
        isImageTransforming: true,
        scale: {
          ...state.scale,
          previous: state.scale.current,
          valueAtTransformStart: distanceBetweenTwoPoints(
            positions[0].x,
            positions[0].y,
            positions[1].x,
            positions[1].y
          ),
        },
        rotate: {
          ...state.rotate,
          previous: state.rotate.current,
          valueAtTransformStart: angleBetweenTwoPoints(
            positions[0].x,
            positions[0].y,
            positions[1].x,
            positions[1].y
          ),
        },
      };
    }

    case TICK: {
      const { cursorPositions } = action.payload;
      const { rotate, isImageTransforming } = state;

      if (!isImageTransforming && cursorPositions.length < 2) {
        return state;
      }

      const x1 = cursorPositions[0].x;
      const y1 = cursorPositions[0].y;
      const x2 = cursorPositions[1].x;
      const y2 = cursorPositions[1].y;

      const nextAngle =
        rotate.previous +
        angleBetweenTwoPoints(x1, y1, x2, y2) -
        rotate.valueAtTransformStart;
      const currentLength = distanceBetweenTwoPoints(x1, y1, x2, y2);
      const nextScale =
        (currentLength / state.scale.valueAtTransformStart) *
        state.scale.previous;
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
    }

    case COMPLETE:
      return {
        ...state,
        isImageTransforming: false,
      };

    default:
      return state;
  }
};

// Main

export type CropperState = {
  container: CropperContainerState;
  cropper: CropperCropperState;
  image: CropperImageState;
};

export default (
  state = {
    container: containerInitialState,
    cropper: cropperInitialState,
    image: imageInitialState,
  },
  action: Actions
): CropperState => ({
  container: containerReducer(state.container, action),
  cropper: cropperReducer(state.cropper, action),
  image: imageReducer(state.image, action),
});

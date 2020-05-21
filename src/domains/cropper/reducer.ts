import { Actions } from "./actions";
import * as types from "./types";
import { angleBetweenTwoPoints } from "~/utils/angle-between-two-points";
import { distanceBetweenTwoPoints } from "~/utils/distance-between-two-points";

const CROPPER_DEFAULT_WIDTH = 320;
const CROPPER_DEFAULT_HEIGHT = 180;

// Container

const containerInitialState: CropperContainerState = {
  styleLeft: 0,
  styleTop: 0,
  styleWidth: 0,
  styleHeight: 0,
  displayMagnification: 0,
};

const containerReducer = (
  parentState: CropperState,
  state = containerInitialState,
  action: Actions
) => {
  switch (action.type) {
    case types.CROPPER_CONTAINER_UPDATE_RECT: {
      const { image } = parentState;
      const { x, y, width, height } = action.payload;
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
        styleLeft: svgX,
        styleTop: svgY,
        styleWidth: svgWidth,
        styleHeight: svgHeight,
        displayMagnification: imageWidth / svgWidth,
      };
    }

    default:
      return state;
  }
};

// Cropper

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

const cropperReducer = (
  parentState: CropperState,
  state = cropperInitialState,
  action: Actions
) => {
  switch (action.type) {
    case types.CROPPER_CROPPER_START_DRAG: {
      const { position } = state;
      const { container, image } = parentState;
      const { cursorPositions } = action.payload;

      if (image.isImageTransforming) {
        return state;
      }

      const valueAtTransformStartX =
        (cursorPositions[0].x - container.styleLeft) *
          container.displayMagnification -
        position.x;
      const valueAtTransformStartY =
        (cursorPositions[0].y - container.styleTop) *
          container.displayMagnification -
        position.y;

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

    case types.CROPPER_CROPPER_START_TRANSFORM: {
      const { container, image } = parentState;
      const { cursorPositions } = action.payload;
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
            (cursorPositionX - container.styleLeft) *
              container.displayMagnification,
            (cursorPositionY - container.styleTop) *
              container.displayMagnification
          ),
        },
        scaleX: {
          ...state.scaleX,
          previous: state.scaleX.current,
          valueAtTransformStart:
            (cursorPositionX - container.styleLeft) *
              container.displayMagnification -
            position.x,
        },
        scaleY: {
          ...state.scaleY,
          previous: state.scaleY.current,
          valueAtTransformStart:
            (cursorPositionY - container.styleTop) *
              container.displayMagnification -
            position.y,
        },
      };
    }

    case types.CROPPER_CROPPER_CHANGE_ASPECT_RATIO: {
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

    case types.CROPPER_TICK: {
      const { container } = parentState;
      const { cursorPositions } = action.payload;
      const { isCropperTransforming, isCropperMoving } = state;

      if (isCropperMoving) {
        const { position } = state;
        const { x, y } = cursorPositions[0];

        const relativeX =
          (x - container.styleLeft) * container.displayMagnification;
        const relativeY =
          (y - container.styleTop) * container.displayMagnification;

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
      }

      if (isCropperTransforming) {
        const [{ x, y }] = cursorPositions;
        const cropper = state;

        if (cropper.freeAspect) {
          let nextScaleX =
            (((x - container.styleLeft) * container.displayMagnification -
              cropper.position.x) /
              cropper.scaleX.valueAtTransformStart) *
            cropper.scaleX.previous;
          let nextScaleY =
            (((y - container.styleTop) * container.displayMagnification -
              cropper.position.y) /
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
            (x - container.styleLeft) * container.displayMagnification,
            (y - container.styleTop) * container.displayMagnification
          ) /
            cropper.scale.valueAtTransformStart) *
          cropper.scale.previous;

        if (
          cropper.width * nextScale >= CROPPER_DEFAULT_WIDTH &&
          !(
            (x - container.styleLeft) * container.displayMagnification <
              cropper.position.x ||
            (y - container.styleTop) * container.displayMagnification <
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
      }

      return state;
    }

    case types.CROPPER_COMPLETE:
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

const imageReducer = (
  _: CropperState,
  state = imageInitialState,
  action: Actions
) => {
  switch (action.type) {
    case types.CROPPER_IMAGE_INITIALIZE: {
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

    case types.CROPPER_IMAGE_START_TRANSFORM: {
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

    case types.CROPPER_TICK: {
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

    case types.CROPPER_COMPLETE:
      return {
        ...state,
        isImageTransforming: false,
      };

    default:
      return state;
  }
};

// Types

export interface CropperContainerState {
  styleLeft: number;
  styleTop: number;
  styleWidth: number;
  styleHeight: number;
  displayMagnification: number;
}

export interface CropperCropperState {
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
}

export interface CropperImageState {
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
}

export interface CropperState {
  container: CropperContainerState;
  cropper: CropperCropperState;
  image: CropperImageState;
}

// Main

export default (
  state = {
    container: containerInitialState,
    cropper: cropperInitialState,
    image: imageInitialState,
  },
  action: Actions
): CropperState => ({
  container: containerReducer(state, state.container, action),
  cropper: cropperReducer(state, state.cropper, action),
  image: imageReducer(state, state.image, action),
});

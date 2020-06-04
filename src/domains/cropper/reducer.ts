import { Actions } from "./actions";
import * as types from "./types";
import { angleBetweenTwoPoints } from "~/utils/angle-between-two-points";
import { distanceBetweenTwoPoints } from "~/utils/distance-between-two-points";

const CROPPER_DEFAULT_WIDTH = 320;
const CROPPER_DEFAULT_HEIGHT = 180;

const reducer = (state: CropperState, action: Actions) => {
  switch (action.type) {
    case types.CROPPER_IMAGE_INITIALIZE: {
      const {
        displayableTop,
        displayableLeft,
        displayableWidth,
        displayableHeight,
      } = state;
      const { width: imageWidth, height: imageHeight } = action.payload;
      const {
        cropperWidth,
        cropperHeight,
        cropperX,
        cropperY,
        cropperScale,
        cropperScaleX,
        cropperScaleY,
      } = action.payload;
      const {
        url,
        width,
        height,
        imageScale,
        imageAngle,
        imageX,
        imageY,
      } = action.payload;

      let svgWidth = displayableWidth;
      let svgHeight = imageHeight * (displayableWidth / imageWidth);
      let svgX = displayableLeft;
      let svgY = displayableTop + (displayableHeight - svgHeight) / 2;

      if (svgHeight > displayableHeight) {
        svgHeight = displayableHeight;
        svgWidth = imageWidth * (displayableHeight / imageHeight);
        svgX = displayableLeft + (displayableWidth - svgWidth) / 2;
        svgY = displayableTop;
      }

      return {
        ...state,
        styleLeft: svgX,
        styleTop: svgY,
        styleWidth: svgWidth,
        styleHeight: svgHeight,
        displayMagnification: imageWidth / svgWidth,
        isCropperMoving: false,
        isCropperTransforming: false,
        freeAspect: true,
        width: cropperWidth || CROPPER_DEFAULT_WIDTH,
        height: cropperHeight || CROPPER_DEFAULT_HEIGHT,
        position: {
          ...state.position,
          x: cropperX,
          y: cropperY,
        },
        scale: {
          ...state.scale,
          current: cropperScale,
        },
        scaleX: {
          ...state.scaleX,
          current: cropperScaleX,
        },
        scaleY: {
          ...state.scaleY,
          current: cropperScaleY,
        },
        selectedIndex: -1,
        imageUrl: url,
        imageWidth: width,
        imageHeight: height,
        isImageTransforming: false,
        imagePosition: {
          x: imageX,
          y: imageY,
        },
        imageScale: {
          ...state.imageScale,
          current: imageScale,
        },
        imageRotate: {
          ...state.imageScale,
          current: imageAngle,
        },
      };
    }

    case types.CROPPER_CONTAINER_UPDATE_RECT: {
      const image = state;
      let { width } = action.payload;
      const { x, y, height } = action.payload;
      const { imageWidth, imageHeight } = image;

      width = width - 24 * 2;

      let svgWidth = width;
      let svgHeight = imageHeight * (width / imageWidth);
      let svgX = 24;
      let svgY = (height - svgHeight) / 2;

      if (svgHeight > height) {
        svgHeight = height;
        svgWidth = imageWidth * (height / imageHeight);
        svgX = 24 + (width - svgWidth) / 2;
        svgY = 0;
      }

      return {
        ...state,
        styleLeft: svgX,
        styleTop: svgY,
        styleWidth: svgWidth,
        styleHeight: svgHeight,
        displayMagnification: imageWidth / svgWidth,
        displayableTop: y,
        displayableLeft: x,
        displayableWidth: width + 24 * 2,
        displayableHeight: height,
      };
    }

    case types.CROPPER_CROPPER_START_DRAG: {
      const image = state;
      const { position } = state;
      const container = state;
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
      const image = state;
      const container = state;
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

    case types.CROPPER_CROPPER_CHANGE_FREE_ASPECT_RATIO:
      return {
        ...state,
        freeAspect: true,
      };

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
      const container = state;
      const { cursorPositions } = action.payload;
      const { isCropperTransforming, isCropperMoving } = state;
      const { imageRotate, isImageTransforming } = state;

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
            scaleX: {
              ...state.scaleX,
              current: nextScale,
            },
            scaleY: {
              ...state.scaleY,
              current: nextScale,
            },
          };
        }

        return state;
      }

      if (!isImageTransforming && cursorPositions.length < 2) {
        return state;
      }

      const x1 = cursorPositions[0].x;
      const y1 = cursorPositions[0].y;
      const x2 = cursorPositions[1].x;
      const y2 = cursorPositions[1].y;

      const nextAngle =
        imageRotate.previous +
        angleBetweenTwoPoints(x1, y1, x2, y2) -
        imageRotate.valueAtTransformStart;
      const currentLength = distanceBetweenTwoPoints(x1, y1, x2, y2);
      const nextScale =
        (currentLength / state.imageScale.valueAtTransformStart) *
        state.imageScale.previous;
      const nextX =
        state.imagePosition.x +
        (state.imageWidth * state.imageScale.current -
          state.imageWidth * nextScale) /
          2;
      const nextY =
        state.imagePosition.y +
        (state.imageHeight * state.imageScale.current -
          state.imageHeight * nextScale) /
          2;

      return {
        ...state,
        imagePosition: {
          x: nextX,
          y: nextY,
        },
        imageScale: {
          ...state.imageScale,
          current: nextScale,
        },
        imageRotate: {
          ...state.imageRotate,
          current: nextAngle,
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
        imageScale: {
          ...state.imageScale,
          previous: state.imageScale.current,
          valueAtTransformStart: distanceBetweenTwoPoints(
            positions[0].x,
            positions[0].y,
            positions[1].x,
            positions[1].y
          ),
        },
        imageRotate: {
          ...state.imageRotate,
          previous: state.imageRotate.current,
          valueAtTransformStart: angleBetweenTwoPoints(
            positions[0].x,
            positions[0].y,
            positions[1].x,
            positions[1].y
          ),
        },
      };
    }

    case types.CROPPER_COMPLETE:
      return {
        ...state,
        isCropperMoving: false,
        isCropperTransforming: false,
        isImageTransforming: false,
      };

    default:
      return state;
  }
};

// Types

export interface CropperState {
  styleLeft: number;
  styleTop: number;
  styleWidth: number;
  styleHeight: number;
  displayableTop: number;
  displayableLeft: number;
  displayableWidth: number;
  displayableHeight: number;
  displayMagnification: number;
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
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  isImageTransforming: boolean;
  imagePosition: {
    x: number;
    y: number;
  };
  imageRotate: {
    current: number;
    previous: number;
    valueAtTransformStart: number;
  };
  imageScale: {
    current: number;
    previous: number;
    valueAtTransformStart: number;
  };
}

// Main

export default (
  state = {
    styleLeft: 0,
    styleTop: 0,
    styleWidth: 0,
    styleHeight: 0,
    displayableTop: 0,
    displayableLeft: 0,
    displayableWidth: 0,
    displayableHeight: 0,
    displayMagnification: 0,
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
    imageUrl: "",
    imageWidth: 0,
    imageHeight: 0,
    isImageTransforming: false,
    imagePosition: {
      x: 0,
      y: 0,
    },
    imageRotate: {
      current: 0,
      previous: 0,
      valueAtTransformStart: 0,
    },
    imageScale: {
      current: 1,
      previous: 1,
      valueAtTransformStart: 0,
    },
  },
  action: Actions
): CropperState => reducer(state, action);

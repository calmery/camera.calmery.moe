import { Actions } from "./actions";
import * as types from "./types";
import { angleBetweenTwoPoints } from "~/utils/angle-between-two-points";
import { distanceBetweenTwoPoints } from "~/utils/distance-between-two-points";

const CROPPER_DEFAULT_WIDTH = 320;
const CROPPER_DEFAULT_HEIGHT = 180;

const reducer = (state: CropperState, action: Actions): CropperState => {
  switch (action.type) {
    case types.CROPPER_IMAGE_INITIALIZE: {
      let { displayableWidth, displayableHeight } = state;
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

      displayableWidth = displayableWidth - 24 * 2;
      displayableHeight = displayableHeight - 12 * 2;

      let svgWidth = displayableWidth;
      let svgHeight = imageHeight * (displayableWidth / imageWidth);
      let svgX = 24;
      let svgY = 12 + (displayableHeight - svgHeight) / 2;

      if (svgHeight > displayableHeight) {
        svgHeight = displayableHeight;
        svgWidth = imageWidth * (displayableHeight / imageHeight);
        svgX = 24 + (displayableWidth - svgWidth) / 2;
        svgY = 12;
      }

      return {
        ...state,
        styleLeft: svgX,
        styleTop: svgY,
        styleWidth: svgWidth,
        styleHeight: svgHeight,
        displayMagnification: imageWidth / svgWidth,
        isCropperDragging: false,
        isCropperTransforming: false,
        freeAspect: true,
        cropperWidth: cropperWidth || CROPPER_DEFAULT_WIDTH,
        cropperHeight: cropperHeight || CROPPER_DEFAULT_HEIGHT,
        cropperX,
        cropperY,
        cropperScale,
        cropperScaleX,
        cropperScaleY,
        imageUrl: url,
        imageX,
        imageY,
        imageWidth: width,
        imageHeight: height,
        isImageTransforming: false,
        imageScale,
        imageAngle,
        temporaries: {
          ...state.temporaries,
          selectedIndex: -1,
        },
      };
    }

    case types.CROPPER_CONTAINER_UPDATE_RECT: {
      const image = state;
      let { width, height } = action.payload;
      const { x, y } = action.payload;
      const { imageWidth, imageHeight } = image;

      width = width - 24 * 2;
      height = height - 12 * 2;

      let svgWidth = width;
      let svgHeight = imageHeight * (width / imageWidth);
      let svgX = 24;
      let svgY = 12 + (height - svgHeight) / 2;

      if (svgHeight > height) {
        svgHeight = height;
        svgWidth = imageWidth * (height / imageHeight);
        svgX = 24 + (width - svgWidth) / 2;
        svgY = 12;
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
        displayableHeight: height + 12 * 2,
      };
    }

    case types.CROPPER_CROPPER_START_DRAG: {
      const image = state;
      const { cropperX, cropperY } = state;
      const container = state;
      const { cursorPositions } = action.payload;

      if (image.isImageTransforming) {
        return state;
      }

      const pointerOffsetX =
        (cursorPositions[0].x - container.styleLeft) *
          container.displayMagnification -
        cropperX;
      const pointerOffsetY =
        (cursorPositions[0].y - container.styleTop) *
          container.displayMagnification -
        cropperY;

      return {
        ...state,
        isCropperDragging: true,
        temporaries: {
          ...state.temporaries,
          pointerOffsetX,
          pointerOffsetY,
        },
      };
    }

    case types.CROPPER_CROPPER_START_TRANSFORM: {
      const image = state;
      const container = state;
      const { cursorPositions } = action.payload;
      const { cropperX, cropperY } = state;

      if (image.isImageTransforming) {
        return state;
      }

      const cursorPositionX = cursorPositions[0].x;
      const cursorPositionY = cursorPositions[0].y;

      return {
        ...state,
        isCropperTransforming: true,
        temporaries: {
          ...state.temporaries,
          previousCropperScale: state.cropperScale,
          previousCropperScaleX: state.cropperScaleX,
          previousCropperScaleY: state.cropperScaleY,
          distanceCropperScaleBetweenFingers: distanceBetweenTwoPoints(
            cropperX,
            cropperY,
            (cursorPositionX - container.styleLeft) *
              container.displayMagnification,
            (cursorPositionY - container.styleTop) *
              container.displayMagnification
          ),
          distanceCropperScaleXBetweenFingers:
            (cursorPositionX - container.styleLeft) *
              container.displayMagnification -
            cropperX,
          distanceCropperScaleYBetweenFingers:
            (cursorPositionY - container.styleTop) *
              container.displayMagnification -
            cropperY,
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
      const {
        freeAspect,
        cropperScale,
        cropperScaleX,
        cropperScaleY,
        cropperWidth,
        cropperHeight,
      } = state;

      const currentWidth =
        cropperWidth * (freeAspect ? cropperScaleX : cropperScale);
      const currentHeight =
        cropperHeight * (freeAspect ? cropperScaleY : cropperScale);
      const nextWidth =
        ((currentWidth + currentHeight) / (widthRatio + heightRatio)) *
        widthRatio;
      const nextHeight =
        ((currentWidth + currentHeight) / (widthRatio + heightRatio)) *
        heightRatio;
      const differenceWidth =
        cropperWidth * (freeAspect ? cropperScaleX : cropperScale) - nextWidth;
      const differenceHeight =
        cropperHeight * (freeAspect ? cropperScaleY : cropperScale) -
        nextHeight;

      return {
        ...state,
        cropperWidth: nextWidth,
        cropperHeight: nextHeight,
        cropperX: state.cropperX + differenceWidth / 2,
        cropperY: state.cropperY + differenceHeight / 2,
        cropperScale: 1,
        cropperScaleX: 1,
        cropperScaleY: 1,
        freeAspect: false,
        temporaries: {
          ...state.temporaries,
          selectedIndex: index,
        },
      };
    }

    case types.CROPPER_TICK: {
      const container = state;
      const { cursorPositions } = action.payload;
      const { isCropperTransforming, isCropperDragging } = state;
      const { isImageTransforming } = state;

      if (isCropperDragging) {
        const { temporaries } = state;
        const { x, y } = cursorPositions[0];

        const relativeX =
          (x - container.styleLeft) * container.displayMagnification;
        const relativeY =
          (y - container.styleTop) * container.displayMagnification;

        const nextX = relativeX - temporaries.pointerOffsetX;
        const nextY = relativeY - temporaries.pointerOffsetY;

        return {
          ...state,
          cropperX: nextX,
          cropperY: nextY,
        };
      }

      if (isCropperTransforming) {
        const [{ x, y }] = cursorPositions;
        const cropper = state;

        if (cropper.freeAspect) {
          let nextScaleX =
            (((x - container.styleLeft) * container.displayMagnification -
              cropper.cropperX) /
              cropper.temporaries.distanceCropperScaleXBetweenFingers) *
            cropper.temporaries.previousCropperScaleX;
          let nextScaleY =
            (((y - container.styleTop) * container.displayMagnification -
              cropper.cropperY) /
              cropper.temporaries.distanceCropperScaleYBetweenFingers) *
            cropper.temporaries.previousCropperScaleY;

          if (cropper.cropperWidth * nextScaleX < CROPPER_DEFAULT_WIDTH) {
            nextScaleX = cropper.cropperScaleX;
          }

          if (cropper.cropperHeight * nextScaleY < CROPPER_DEFAULT_HEIGHT) {
            nextScaleY = cropper.cropperScaleY;
          }

          return {
            ...state,
            cropperScaleX: nextScaleX,
            cropperScaleY: nextScaleY,
          };
        }

        const nextScale =
          (distanceBetweenTwoPoints(
            cropper.cropperX,
            cropper.cropperY,
            (x - container.styleLeft) * container.displayMagnification,
            (y - container.styleTop) * container.displayMagnification
          ) /
            cropper.temporaries.distanceCropperScaleBetweenFingers) *
          cropper.temporaries.previousCropperScale;

        if (
          cropper.cropperWidth * nextScale >= CROPPER_DEFAULT_WIDTH &&
          !(
            (x - container.styleLeft) * container.displayMagnification <
              cropper.cropperX ||
            (y - container.styleTop) * container.displayMagnification <
              cropper.cropperY
          )
        ) {
          return {
            ...state,
            cropperScale: nextScale,
            cropperScaleX: nextScale,
            cropperScaleY: nextScale,
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
        state.temporaries.previousImageAngle +
        angleBetweenTwoPoints(x1, y1, x2, y2) -
        state.temporaries.angleBetweenFingers;
      const currentLength = distanceBetweenTwoPoints(x1, y1, x2, y2);
      const nextScale =
        (currentLength / state.temporaries.distanceBetweenFingers) *
        state.temporaries.previousImageScale;
      const nextX =
        state.imageX +
        (state.imageWidth * state.imageScale - state.imageWidth * nextScale) /
          2;
      const nextY =
        state.imageY +
        (state.imageHeight * state.imageScale - state.imageHeight * nextScale) /
          2;

      return {
        ...state,
        imageX: nextX,
        imageY: nextY,
        imageScale: nextScale,
        imageAngle: nextAngle,
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
        temporaries: {
          ...state.temporaries,
          previousImageScale: state.imageScale,
          previousImageAngle: state.imageAngle,
          angleBetweenFingers: angleBetweenTwoPoints(
            positions[0].x,
            positions[0].y,
            positions[1].x,
            positions[1].y
          ),
          distanceBetweenFingers: distanceBetweenTwoPoints(
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
        isCropperDragging: false,
        isCropperTransforming: false,
        isImageTransforming: false,
      };

    default:
      return state;
  }
};

// Types

export interface CropperState {
  styleTop: number;
  styleLeft: number;
  styleWidth: number;
  styleHeight: number;
  displayableTop: number;
  displayableLeft: number;
  displayableWidth: number;
  displayableHeight: number;
  displayMagnification: number;
  freeAspect: boolean;
  isCropperDragging: boolean;
  isCropperTransforming: boolean;
  isImageTransforming: boolean;
  cropperX: number;
  cropperY: number;
  cropperWidth: number;
  cropperHeight: number;
  cropperScale: number;
  cropperScaleX: number;
  cropperScaleY: number;
  imageUrl: string;
  imageX: number;
  imageY: number;
  imageWidth: number;
  imageHeight: number;
  imageAngle: number;
  imageScale: number;
  temporaries: {
    pointerOffsetX: number;
    pointerOffsetY: number;
    previousCropperScale: number;
    previousCropperScaleX: number;
    previousCropperScaleY: number;
    angleBetweenFingers: number;
    previousImageAngle: number;
    distanceBetweenFingers: number;
    distanceCropperScaleBetweenFingers: number;
    distanceCropperScaleXBetweenFingers: number;
    distanceCropperScaleYBetweenFingers: number;
    previousImageScale: number;
    selectedIndex: number;
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
    isCropperDragging: false,
    isCropperTransforming: false,
    isImageTransforming: false,
    freeAspect: true,
    cropperWidth: CROPPER_DEFAULT_WIDTH,
    cropperHeight: CROPPER_DEFAULT_HEIGHT,
    cropperX: 0,
    cropperY: 0,
    cropperScale: 1,
    cropperScaleX: 1,
    cropperScaleY: 1,
    imageUrl: "",
    imageX: 0,
    imageY: 0,
    imageWidth: 0,
    imageHeight: 0,
    imageAngle: 0,
    imageScale: 1,
    temporaries: {
      pointerOffsetX: 0,
      pointerOffsetY: 0,
      previousCropperScale: 1,
      previousCropperScaleX: 1,
      previousCropperScaleY: 1,
      angleBetweenFingers: 0,
      previousImageAngle: 0,
      distanceBetweenFingers: 0,
      distanceCropperScaleBetweenFingers: 0,
      distanceCropperScaleXBetweenFingers: 0,
      distanceCropperScaleYBetweenFingers: 0,
      previousImageScale: 1,
      selectedIndex: -1,
    },
  },
  action: Actions
): CropperState => reducer(state, action);

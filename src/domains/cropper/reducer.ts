import { Actions } from "./actions";
import * as types from "./types";
import {
  CROPPER_DEFAULT_WIDTH,
  CROPPER_DEFAULT_HEIGHT,
} from "~/constants/cropper";
import { calculateCropperPositionAndSize } from "./utils";
import { angleBetweenTwoPoints } from "~/utils/angle-between-two-points";
import { distanceBetweenTwoPoints } from "~/utils/distance-between-two-points";

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

const initialState: CropperState = {
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
};

const reducer = (state = initialState, action: Actions): CropperState => {
  switch (action.type) {
    case types.CROPPER_IMAGE_INITIALIZE: {
      const { displayableWidth, displayableHeight } = state;
      const {
        imageX,
        imageY,
        imageScale,
        imageAngle,
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
        cropperWidth,
        cropperHeight,
        cropperX,
        cropperY,
        cropperScale,
        cropperScaleX,
        cropperScaleY,
      } = action.payload;

      const styles = calculateCropperPositionAndSize(
        displayableWidth,
        displayableHeight,
        imageWidth,
        imageHeight
      );

      return {
        ...state,
        ...styles,
        displayMagnification: imageWidth / styles.styleWidth,
        isCropperDragging: false,
        isCropperTransforming: false,
        isImageTransforming: false,
        freeAspect: true,
        cropperX,
        cropperY,
        cropperWidth: cropperWidth || CROPPER_DEFAULT_WIDTH,
        cropperHeight: cropperHeight || CROPPER_DEFAULT_HEIGHT,
        cropperScale,
        cropperScaleX,
        cropperScaleY,
        imageUrl,
        imageX,
        imageY,
        imageWidth,
        imageHeight,
        imageScale,
        imageAngle,
        temporaries: {
          ...state.temporaries,
          selectedIndex: -1,
        },
      };
    }

    // Displayable

    case types.CROPPER_UPDATE_DISPLAYABLE_RECT: {
      const { imageWidth, imageHeight } = state;
      const { width, height } = action.payload;
      const { x, y } = action.payload;

      const styles = calculateCropperPositionAndSize(
        width,
        height,
        imageWidth,
        imageHeight
      );

      return {
        ...state,
        ...styles,
        displayMagnification: imageWidth / styles.styleWidth,
        displayableTop: y,
        displayableLeft: x,
        displayableWidth: width,
        displayableHeight: height,
      };
    }

    // Cropper

    case types.CROPPER_CROPPER_START_DRAG: {
      const {
        styleTop,
        styleLeft,
        displayMagnification,
        cropperX,
        cropperY,
        isImageTransforming,
      } = state;
      const { cursorPositions } = action.payload;

      if (isImageTransforming) {
        return state;
      }

      return {
        ...state,
        isCropperDragging: true,
        temporaries: {
          ...state.temporaries,
          pointerOffsetX:
            (cursorPositions[0].x - styleLeft) * displayMagnification -
            cropperX,
          pointerOffsetY:
            (cursorPositions[0].y - styleTop) * displayMagnification - cropperY,
        },
      };
    }

    case types.CROPPER_CROPPER_START_TRANSFORM: {
      const {
        styleTop,
        styleLeft,
        displayMagnification,
        cropperX,
        cropperY,
        isImageTransforming,
      } = state;
      const { cursorPositions } = action.payload;

      if (isImageTransforming) {
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
            (cursorPositionX - styleLeft) * displayMagnification,
            (cursorPositionY - styleTop) * displayMagnification
          ),
          distanceCropperScaleXBetweenFingers:
            (cursorPositionX - styleLeft) * displayMagnification - cropperX,
          distanceCropperScaleYBetweenFingers:
            (cursorPositionY - styleTop) * displayMagnification - cropperY,
        },
      };
    }

    case types.CROPPER_CROPPER_CHANGE_FREE_ASPECT_RATIO: {
      return {
        ...state,
        freeAspect: true,
      };
    }

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

    // Image

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

    // Common

    case types.CROPPER_TICK: {
      const {
        styleTop,
        styleLeft,
        displayMagnification,
        isImageTransforming,
        isCropperTransforming,
        isCropperDragging,
        temporaries,
      } = state;
      const { cursorPositions } = action.payload;

      if (isImageTransforming) {
        if (cursorPositions.length < 2) {
          return state;
        }

        const { imageX, imageY, imageWidth, imageHeight, imageScale } = state;
        const {
          previousImageAngle,
          angleBetweenFingers,
          previousImageScale,
          distanceBetweenFingers,
        } = temporaries;

        const x1 = cursorPositions[0].x;
        const y1 = cursorPositions[0].y;
        const x2 = cursorPositions[1].x;
        const y2 = cursorPositions[1].y;

        const nextAngle =
          previousImageAngle +
          angleBetweenTwoPoints(x1, y1, x2, y2) -
          angleBetweenFingers;
        const currentLength = distanceBetweenTwoPoints(x1, y1, x2, y2);
        const nextScale =
          (currentLength / distanceBetweenFingers) * previousImageScale;
        const nextX =
          imageX + (imageWidth * imageScale - imageWidth * nextScale) / 2;
        const nextY =
          imageY + (imageHeight * imageScale - imageHeight * nextScale) / 2;

        return {
          ...state,
          imageX: nextX,
          imageY: nextY,
          imageScale: nextScale,
          imageAngle: nextAngle,
        };
      }

      if (isCropperDragging) {
        const { pointerOffsetX, pointerOffsetY } = temporaries;
        const { x, y } = cursorPositions[0];

        const relativeX = (x - styleLeft) * displayMagnification;
        const relativeY = (y - styleTop) * displayMagnification;
        const nextX = relativeX - pointerOffsetX;
        const nextY = relativeY - pointerOffsetY;

        return {
          ...state,
          cropperX: nextX,
          cropperY: nextY,
        };
      }

      if (isCropperTransforming) {
        const [{ x, y }] = cursorPositions;
        const {
          cropperX,
          cropperY,
          cropperWidth,
          cropperHeight,
          cropperScaleX,
          cropperScaleY,
          freeAspect,
        } = state;
        const {
          distanceCropperScaleXBetweenFingers,
          previousCropperScaleX,
          distanceCropperScaleYBetweenFingers,
          previousCropperScaleY,
          distanceCropperScaleBetweenFingers,
          previousCropperScale,
        } = temporaries;

        if (freeAspect) {
          let nextScaleX =
            (((x - styleLeft) * displayMagnification - cropperX) /
              distanceCropperScaleXBetweenFingers) *
            previousCropperScaleX;
          let nextScaleY =
            (((y - styleTop) * displayMagnification - cropperY) /
              distanceCropperScaleYBetweenFingers) *
            previousCropperScaleY;

          if (cropperWidth * nextScaleX < CROPPER_DEFAULT_WIDTH) {
            nextScaleX = cropperScaleX;
          }

          if (cropperHeight * nextScaleY < CROPPER_DEFAULT_HEIGHT) {
            nextScaleY = cropperScaleY;
          }

          return {
            ...state,
            cropperScaleX: nextScaleX,
            cropperScaleY: nextScaleY,
          };
        }

        const nextScale =
          (distanceBetweenTwoPoints(
            cropperX,
            cropperY,
            (x - styleLeft) * displayMagnification,
            (y - styleTop) * displayMagnification
          ) /
            distanceCropperScaleBetweenFingers) *
          previousCropperScale;

        if (
          cropperWidth * nextScale >= CROPPER_DEFAULT_WIDTH &&
          !(
            (x - styleLeft) * displayMagnification < cropperX ||
            (y - styleTop) * displayMagnification < cropperY
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

      return state;
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

export default reducer;

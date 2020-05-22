import { Actions } from "./actions";
import { canvasUserLayerFrame } from "./frames";
import * as types from "./types";
import {
  calculateCanvasUserLayerRelativeCoordinates,
  progressCanvasStickerLayerTransform,
  calculateCanvasPositionAndSize,
} from "./utils";
import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasUserLayerFrame } from "~/types/CanvasUserLayerFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";
import { angleBetweenTwoPoints } from "~/utils/angle-between-two-points";
import { distanceBetweenTwoPoints } from "~/utils/distance-between-two-points";

// Constants

const CANVAS_STICKER_LAYER_MIN_WIDTH = 200;
const CANVAS_STICKER_LAYER_MIN_HEIGHT = 200;

// Types

export interface CanvasState {
  viewBoxWidth: number;
  viewBoxHeight: number;
  styleTop: number;
  styleLeft: number;
  styleWidth: number;
  styleHeight: number;
  displayableTop: number;
  displayableLeft: number;
  displayableWidth: number;
  displayableHeight: number;
  displayMagnification: number;
  isCollaging: boolean;
  isUserLayerDragging: boolean;
  isStickerLayerDragging: boolean;
  isStickerLayerTransforming: boolean;
  userFrames: CanvasUserLayerFrame[];
  userLayers: (CanvasUserLayer | null)[];
  stickerLayers: CanvasLayer[];
  temporaries: {
    pointerOffsetX: number;
    pointerOffsetY: number;
    previousAngle: number;
    angleBetweenFingers: number;
    previousScale: number;
    distanceBetweenFingers: number;
    selectedUserLayerIndex: number;
  };
}

const initialState: CanvasState = {
  viewBoxWidth: 0,
  viewBoxHeight: 0,
  styleLeft: 0,
  styleTop: 0,
  styleWidth: 0,
  styleHeight: 0,
  displayMagnification: 0,
  displayableLeft: 0,
  displayableTop: 0,
  displayableWidth: 0,
  displayableHeight: 0,
  isStickerLayerDragging: false,
  isStickerLayerTransforming: false,
  stickerLayers: [],
  isUserLayerDragging: false,
  isCollaging: false,
  userLayers: [],
  userFrames: [],
  temporaries: {
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    previousAngle: 0,
    angleBetweenFingers: 0,
    previousScale: 0,
    distanceBetweenFingers: 0,
    selectedUserLayerIndex: 0,
  },
};

// Main

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    case types.CANVAS_CONTAINER_UPDATE_RECT: {
      const { x, y, width, height } = action.payload;
      const { userFrames } = state;
      let { viewBoxWidth, viewBoxHeight } = state;

      if (userFrames.length === 0) {
        userFrames[0] = {
          width,
          height,
          x: 0,
          y: 0,
          path: `M0 0H${width}V${height}H0V0Z`,
        };

        viewBoxWidth = width;
        viewBoxHeight = height;
      }

      const styles = calculateCanvasPositionAndSize(
        viewBoxWidth,
        viewBoxHeight,
        y,
        x,
        width,
        height
      );

      return {
        ...state,
        ...styles,
        viewBoxWidth,
        viewBoxHeight,
        displayMagnification: viewBoxWidth / styles.styleWidth,
        displayableLeft: x,
        displayableTop: y,
        displayableWidth: width,
        displayableHeight: height,
        userFrames,
      };
    }

    case types.CANVAS_INITIALIZE: {
      const { userFrames, userLayers } = state;
      const { dataUrl, width, height } = action.payload;

      userLayers[0] = {
        dataUrl,
        width,
        height,
        x: 0,
        y: 0,
        blur: 0,
        hue: 0,
        saturate: 1,
        angle: 0,
        scale: 1,
        croppedWidth: width,
        croppedHeight: height,
        croppedX: 0,
        croppedY: 0,
        croppedAngle: 0,
        croppedScale: 1,
        croppedImageX: 0,
        croppedImageY: 0,
        cropper: {
          cropperWidth: 0,
          cropperHeight: 0,
          cropperX: 0,
          cropperY: 0,
          imageX: 0,
          imageY: 0,
          imageAngle: 0,
          imageScale: 1,
          cropperScale: 1,
          cropperScaleX: 1,
          cropperScaleY: 1,
        },
      };

      userFrames[0] = {
        width,
        height,
        x: 0,
        y: 0,
        path: `M0 0H${width}V${height}H0V0Z`,
      };

      return {
        ...state,
        viewBoxWidth: width,
        viewBoxHeight: height,
        userFrames,
        userLayers,
      };
    }

    case types.CANVAS_DISABLE_COLLAGE: {
      const {
        userLayers,
        displayableLeft,
        displayableTop,
        displayableWidth,
        displayableHeight,
        viewBoxWidth,
        viewBoxHeight,
      } = state;

      if (userLayers[0]) {
        const { width, height } = userLayers[0];

        return {
          ...state,
          viewBoxWidth: width,
          viewBoxHeight: height,
          isCollaging: false,
          userLayers,
          userFrames: [
            {
              width,
              height,
              x: 0,
              y: 0,
              path: `M0 0H${width}V${height}H0V0Z`,
            },
          ],
        };
      }

      const styles = calculateCanvasPositionAndSize(
        viewBoxWidth,
        viewBoxHeight,
        displayableTop,
        displayableLeft,
        displayableWidth,
        displayableHeight
      );

      return {
        ...state,
        ...styles,
        viewBoxWidth: styles.styleWidth,
        viewBoxHeight: styles.styleHeight,
        isCollaging: false,
        userLayers,
        userFrames: [
          {
            width: styles.styleWidth,
            height: styles.styleHeight,
            x: 0,
            y: 0,
            path: `M0 0H${styles.styleWidth}V${styles.styleHeight}H0V0Z`,
          },
        ],
      };
    }

    case types.CANVAS_ENABLE_COLLAGE: {
      const {
        displayableWidth,
        displayableHeight,
        displayableLeft,
        displayableTop,
      } = state;
      const { frame, index } = action.payload;
      const { width: frameWidth, height: frameHeight } = canvasUserLayerFrame[
        frame
      ];
      const canvasUserFrame = canvasUserLayerFrame[frame];

      const styles = calculateCanvasPositionAndSize(
        frameWidth,
        frameHeight,
        displayableTop,
        displayableLeft,
        displayableWidth,
        displayableHeight
      );

      return {
        ...state,
        ...styles,
        viewBoxWidth: frameWidth,
        viewBoxHeight: frameHeight,
        displayMagnification: frameWidth / styles.styleWidth,
        userFrames: canvasUserFrame.frames[index],
        isCollaging: true,
      };
    }

    // Stickers

    case types.CANVAS_COMPLETE: {
      return {
        ...state,
        isUserLayerDragging: false,
        isStickerLayerDragging: false,
        isStickerLayerTransforming: false,
      };
    }

    case types.CANVAS_STICKER_LAYER_START_TRANSFORM: {
      const { stickerLayers } = state;
      const { x, y } = action.payload;
      const sticker = stickerLayers[stickerLayers.length - 1];
      const centerX = sticker.x + (sticker.width * sticker.scale) / 2;
      const centerY = sticker.y + (sticker.height * sticker.scale) / 2;

      const {
        styleLeft: canvasBaseX,
        styleTop: canvasBaseY,
        displayMagnification,
      } = state;

      const relativeX = (x - canvasBaseX) * displayMagnification;
      const relativeY = (y - canvasBaseY) * displayMagnification;

      return {
        ...state,
        isStickerLayerTransforming: true,
        temporaries: {
          ...state.temporaries,
          previousScale: sticker.scale,
          distanceBetweenFingers: distanceBetweenTwoPoints(
            centerX,
            centerY,
            relativeX,
            relativeY
          ),
        },
      };
    }

    case types.CANVAS_TICK: {
      const {
        stickerLayers,
        isStickerLayerDragging,
        isStickerLayerTransforming,
        userLayers,
        isUserLayerDragging,
        isCollaging,
        styleTop,
        styleLeft,
        temporaries: { pointerOffsetX, pointerOffsetY, selectedUserLayerIndex },
        userFrames,
      } = state;
      const { cursorPositions } = action.payload;
      const { displayMagnification } = state;

      if (isUserLayerDragging) {
        const user = userLayers[selectedUserLayerIndex];
        const userFrame = userFrames[selectedUserLayerIndex];

        const clipPathX = styleLeft + userFrame.x / displayMagnification;
        const clipPathY = styleTop + userFrame.y / displayMagnification;

        if (!user || !isCollaging) {
          return state;
        }

        const [{ x, y }] = cursorPositions;

        const {
          x: currentX,
          y: currentY,
        } = calculateCanvasUserLayerRelativeCoordinates(
          displayMagnification,
          clipPathX,
          clipPathY,
          x,
          y
        );

        userLayers[selectedUserLayerIndex] = {
          ...user,
          x: currentX - pointerOffsetX,
          y: currentY - pointerOffsetY,
        };

        return {
          ...state,
          userLayers,
        };
      }

      if (!stickerLayers.length) {
        return state;
      }

      const sticker = stickerLayers[stickerLayers.length - 1];

      if (isStickerLayerTransforming) {
        const { temporaries } = state;
        const { angle, scale, x, y, width, height } = sticker;

        let nextX = x;
        let nextY = y;
        let nextAngle = angle;
        let nextScale = scale;

        if (cursorPositions.length > 1) {
          const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = cursorPositions;

          nextAngle =
            temporaries.previousAngle +
            angleBetweenTwoPoints(x1, y1, x2, y2) -
            temporaries.angleBetweenFingers;
          const currentLength = distanceBetweenTwoPoints(x1, y1, x2, y2);
          nextScale =
            (currentLength / temporaries.distanceBetweenFingers) *
            temporaries.previousScale;
        } else {
          const centerX = x + (width * scale) / 2;
          const centerY = y + (height * scale) / 2;
          const relativeX =
            (cursorPositions[0].x - state.styleLeft) * displayMagnification;
          const relativeY =
            (cursorPositions[0].y - state.styleTop) * displayMagnification;

          // 回転ボタン初期位置と中心座標の度の差を求めて足す
          nextAngle =
            angleBetweenTwoPoints(centerY, centerX, relativeY, relativeX) * -1 +
            angleBetweenTwoPoints(
              centerY,
              centerX,
              y + height * scale,
              x + width * scale
            );
          nextScale =
            (distanceBetweenTwoPoints(centerX, centerY, relativeX, relativeY) /
              temporaries.distanceBetweenFingers) *
            temporaries.previousScale;
        }

        // 最小値を見て縮小するかどうかを決める
        if (
          width * nextScale > CANVAS_STICKER_LAYER_MIN_WIDTH &&
          height * nextScale > CANVAS_STICKER_LAYER_MIN_HEIGHT
        ) {
          nextX = x + (width * scale - width * nextScale) / 2;
          nextY = y + (height * scale - height * nextScale) / 2;

          return {
            ...state,
            stickerLayers: progressCanvasStickerLayerTransform(
              state.stickerLayers,
              nextX,
              nextY,
              nextScale,
              nextAngle
            ),
          };
        }

        return {
          ...state,
          stickerLayers: progressCanvasStickerLayerTransform(
            state.stickerLayers,
            nextX,
            nextY,
            scale,
            nextAngle
          ),
        };
      }

      if (isStickerLayerDragging) {
        const [{ x, y }] = cursorPositions;
        const relativeX = (x - state.styleLeft) * displayMagnification;
        const relativeY = (y - state.styleTop) * displayMagnification;

        stickerLayers[stickerLayers.length - 1] = {
          ...sticker,
          x: relativeX - state.temporaries.pointerOffsetX,
          y: relativeY - state.temporaries.pointerOffsetY,
        };

        return {
          ...state,
          stickerLayers,
        };
      }

      return state;
    }

    case types.CANVAS_STICKER_LAYER_ADD: {
      const { stickerLayers } = state;
      const { dataUrl, width, height } = action.payload;

      return {
        ...state,
        stickerLayers: [
          ...stickerLayers,
          {
            dataUrl,
            width,
            height,
            x: 0,
            y: 0,
            scale: 1,
            angle: 0,
          },
        ],
      };
    }

    case types.CANVAS_SRICKER_LAYER_REMOVE: {
      const { stickerLayers } = state;

      return {
        ...state,
        stickerLayers: stickerLayers.slice(0, stickerLayers.length - 1),
      };
    }

    case types.CANVAS_STICKER_LAYER_CHANGE_ORDER: {
      const { stickerLayers } = state;
      const { index } = action.payload;

      return {
        ...state,
        stickerLayers: [
          ...stickerLayers.filter((_, i) => i !== index),
          stickerLayers[index],
        ],
      };
    }

    case types.CANVAS_STICKER_LAYER_START_DRAG: {
      const { stickerLayers } = state;
      const { cursorPositions } = action.payload;
      const index = stickerLayers.length - 1;
      const sticker = stickerLayers[index];
      const isMultiTouching = cursorPositions.length > 1;

      if (isMultiTouching) {
        const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = cursorPositions;

        return {
          ...state,
          isStickerLayerTransforming: true,
          stickerLayers,
          temporaries: {
            ...state.temporaries,
            previousAngle: sticker.angle,
            angleBetweenFingers: angleBetweenTwoPoints(x1, y1, x2, y2),
            previousScale: sticker.scale,
            distanceBetweenFingers: distanceBetweenTwoPoints(x1, y1, x2, y2),
          },
        };
      }

      const [{ x, y }] = cursorPositions;
      const {
        styleLeft: canvasBaseX,
        styleTop: canvasBaseY,
        displayMagnification,
      } = state;

      const relativeX = (x - canvasBaseX) * displayMagnification;
      const relativeY = (y - canvasBaseY) * displayMagnification;

      return {
        ...state,
        isStickerLayerDragging: true,
        temporaries: {
          ...state.temporaries,
          pointerOffsetX: relativeX - sticker.x,
          pointerOffsetY: relativeY - sticker.y,
        },
      };
    }

    // Users

    case types.CANVAS_USER_LAYER_ADD: {
      const {
        userLayers,
        isCollaging,
        displayableTop,
        displayableLeft,
        displayableWidth,
        displayableHeight,
      } = state;
      const { index, dataUrl, width, height } = action.payload;

      userLayers[index] = {
        dataUrl,
        width,
        height,
        x: 0,
        y: 0,
        blur: 0,
        hue: 0,
        saturate: 1,
        angle: 0,
        scale: 1,
        croppedWidth: width,
        croppedHeight: height,
        croppedX: 0,
        croppedY: 0,
        croppedAngle: 0,
        croppedScale: 1,
        croppedImageX: 0,
        croppedImageY: 0,
        cropper: {
          cropperWidth: 0,
          cropperHeight: 0,
          cropperX: 0,
          cropperY: 0,
          imageX: 0,
          imageY: 0,
          imageAngle: 0,
          imageScale: 1,
          cropperScale: 1,
          cropperScaleX: 1,
          cropperScaleY: 1,
        },
      };

      if (!isCollaging) {
        const styles = calculateCanvasPositionAndSize(
          width,
          height,
          displayableTop,
          displayableLeft,
          displayableWidth,
          displayableHeight
        );

        return {
          ...state,
          ...styles,
          viewBoxWidth: width,
          viewBoxHeight: height,
          userLayers,
          userFrames: [
            {
              width: width,
              height: height,
              x: 0,
              y: 0,
              path: `M0 0H${width}V${height}H0V0Z`,
            },
          ],
        };
      }

      return {
        ...state,
        userLayers,
      };
    }

    case types.CANVAS_USER_LAYER_REMOVE: {
      const { userLayers } = state;
      const { index } = action.payload;

      userLayers[index] = null;

      return {
        ...state,
        userLayers,
      };
    }

    case types.CANVAS_USER_LAYER_START_CROP: {
      const { index } = action.payload;

      console.log("CANVAS_USER_LAYER_START_CROP", index);

      return {
        ...state,
        temporaries: {
          ...state.temporaries,
          selectedUserLayerIndex: index,
        },
      };
    }

    case types.CANVAS_USER_LAYER_START_DRAG: {
      const {
        userLayers,
        styleTop,
        styleLeft,
        displayMagnification,
        userFrames,
      } = state;
      const { index, cursorPositions } = action.payload;
      const userFrame = userFrames[index];
      const userLayer = userLayers[index];

      const clipPathX = styleLeft + userFrame.x / displayMagnification;
      const clipPathY = styleTop + userFrame.y / displayMagnification;

      if (userLayer === null) {
        return state;
      }

      const { x, y } = calculateCanvasUserLayerRelativeCoordinates(
        displayMagnification,
        clipPathX,
        clipPathY,
        cursorPositions[0].x,
        cursorPositions[0].y
      );

      return {
        ...state,
        isUserLayerDragging: true,
        temporaries: {
          ...state.temporaries,
          pointerOffsetX: x - userLayer.x,
          pointerOffsetY: y - userLayer.y,
          selectedUserLayerIndex: index,
        },
      };
    }

    case types.CANVAS_USER_LAYER_UPDATE_FILTER: {
      const { userLayers } = state;
      const { index, type, value } = action.payload;
      const userLayer = userLayers[index];

      if (userLayer) {
        userLayers[index] = {
          ...userLayer,
          [type]: value,
        };
      }

      return {
        ...state,
        userLayers,
      };
    }

    case types.CANVAS_USER_LAYER_UPDATE_CROP: {
      const {
        userLayers,
        temporaries,
        isCollaging,
        displayableTop,
        displayableLeft,
        displayableWidth,
        displayableHeight,
      } = state;
      const {
        x,
        y,
        width,
        height,
        angle,
        scale,
        imageX,
        imageY,
        cropper,
      } = action.payload;
      const userLayer = userLayers[temporaries.selectedUserLayerIndex];

      if (userLayer) {
        userLayers[temporaries.selectedUserLayerIndex] = {
          ...userLayer,
          croppedX: x,
          croppedY: y,
          croppedWidth: width,
          croppedHeight: height,
          croppedAngle: angle,
          croppedScale: scale,
          croppedImageX: imageX,
          croppedImageY: imageY,
          cropper: cropper,
        };

        if (!isCollaging) {
          const styles = calculateCanvasPositionAndSize(
            width,
            height,
            displayableTop,
            displayableLeft,
            displayableWidth,
            displayableHeight
          );

          return {
            ...state,
            ...styles,
            userLayers,
            userFrames: [
              {
                width: width,
                height: height,
                x: 0,
                y: 0,
                path: `M0 0H${width}V${height}H0V0Z`,
              },
            ],
            viewBoxWidth: width,
            viewBoxHeight: height,
            displayMagnification: width / styles.styleWidth,
          };
        }

        return {
          ...state,
          userLayers,
        };
      }

      return state;
    }

    // Default

    default:
      return state;
  }
};

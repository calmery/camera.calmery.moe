import * as uuid from "uuid";
import { Actions } from "./actions";
import { canvasUserLayerFrame, CanvasUserLayerFrame } from "./frames";
import * as types from "./types";
import {
  calculateCanvasUserLayerRelativeCoordinates,
  progressCanvasStickerLayerTransform,
} from "./utils";
import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasUserFrame } from "~/types/CanvasUserFrame";
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
  userFrames: CanvasUserFrame[];
  userLayers: (CanvasUserLayer | null)[];
  stickerLayers: CanvasLayer[];
  temporaries: {
    pointerOffsetX: number;
    pointerOffsetY: number;
    previousAngle: number;
    angleBetweenFingers: number;
    previousScale: number;
    distanceBetweenFingers: number;
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
  },
};

// Main

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    case types.CANVAS_CONTAINER_UPDATE_RECT: {
      const { x, y, width, height } = action.payload;
      const { viewBoxWidth, viewBoxHeight } = state;

      let svgWidth = width;
      let svgHeight = viewBoxHeight * (width / viewBoxWidth);
      let svgX = x;
      let svgY = y + (height - svgHeight) / 2;

      if (svgHeight > height) {
        svgHeight = height;
        svgWidth = viewBoxWidth * (height / viewBoxHeight);
        svgX = x + (width - svgWidth) / 2;
        svgY = y;
      }

      return {
        ...state,
        styleLeft: svgX,
        styleTop: svgY,
        styleWidth: svgWidth,
        styleHeight: svgHeight,
        displayMagnification: viewBoxWidth / svgWidth,
        displayableLeft: x,
        displayableTop: y,
        displayableWidth: width,
        displayableHeight: height,
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
      };

      userFrames[0] = {
        id: uuid.v4(),
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
              id: uuid.v4(),
              width,
              height,
              x: 0,
              y: 0,
              path: `M0 0H${width}V${height}H0V0Z`,
            },
          ],
        };
      }

      let svgWidth = displayableWidth;
      let svgHeight = viewBoxHeight * (displayableWidth / viewBoxWidth);
      let svgX = displayableLeft;
      let svgY = displayableTop + (displayableHeight - svgHeight) / 2;

      if (svgHeight > displayableHeight) {
        svgHeight = displayableHeight;
        svgWidth = viewBoxWidth * (displayableHeight / viewBoxHeight);
        svgX = displayableLeft + (displayableWidth - svgWidth) / 2;
        svgY = displayableTop;
      }

      return {
        ...state,
        styleWidth: svgWidth,
        styleHeight: svgHeight,
        styleTop: svgY,
        styleLeft: svgX,
        viewBoxWidth: svgWidth,
        viewBoxHeight: svgHeight,
        isCollaging: false,
        userLayers,
        userFrames: [
          {
            id: uuid.v4(),
            width: svgWidth,
            height: svgHeight,
            x: 0,
            y: 0,
            path: `M0 0H${svgWidth}V${svgHeight}H0V0Z`,
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

      // ToDo: 外に切り出す
      let svgWidth = displayableWidth;
      let svgHeight = frameHeight * (displayableWidth / frameWidth);
      let svgX = displayableLeft;
      let svgY = displayableTop + (displayableHeight - svgHeight) / 2;

      if (svgHeight > displayableHeight) {
        svgHeight = displayableHeight;
        svgWidth = frameWidth * (displayableHeight / frameHeight);
        svgX = displayableLeft + (displayableWidth - svgWidth) / 2;
        svgY = displayableTop;
      }

      return {
        ...state,
        viewBoxWidth: frameWidth,
        viewBoxHeight: frameHeight,
        styleLeft: svgX,
        styleTop: svgY,
        styleWidth: svgWidth,
        styleHeight: svgHeight,
        displayMagnification: frameWidth / svgWidth,
        userFrames: canvasUserFrame.frames[index].map((f) => ({
          ...f,
          id: uuid.v4(),
        })),
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

    case types.CANVAS_STICKER_LAYER_TICK: {
      const {
        stickerLayers,
        isStickerLayerDragging,
        isStickerLayerTransforming,
      } = state;
      const { cursorPositions } = action.payload;
      const { displayMagnification } = state;

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
      const { userLayers } = state;
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
      };

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

    case types.CANVAS_USER_LAYER_START_DRAG: {
      const { userLayers } = state;
      const { displayMagnification } = state;
      const { index, cursorPositions, clipPathX, clipPathY } = action.payload;
      const userLayer = userLayers[index];

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
        },
      };
    }

    case types.CANVAS_USER_LAYER_TICK: {
      const {
        userLayers,
        isUserLayerDragging,
        isCollaging,
        temporaries: { pointerOffsetX, pointerOffsetY },
      } = state;
      const { displayMagnification } = state;
      const { index, clipPathX, clipPathY, cursorPositions } = action.payload;
      const user = userLayers[index];

      if (!user || !isCollaging) {
        return state;
      }

      const [{ x, y }] = cursorPositions;

      if (isUserLayerDragging) {
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

        userLayers[index] = {
          ...user,
          x: currentX - pointerOffsetX,
          y: currentY - pointerOffsetY,
        };

        return {
          ...state,
          userLayers,
        };
      }

      return state;
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

    // Default

    default:
      return state;
  }
};

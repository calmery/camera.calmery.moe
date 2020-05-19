import * as uuid from "uuid";
import { Actions } from "./actions";
import { canvasUserLayerFrame, CanvasUserLayerFrame } from "./frames";
import * as types from "./types";
import {
  calculateCanvasUserLayerRelativeCoordinates,
  progressCanvasStickerLayerTransform,
} from "./utils";
import { CanvasStickerLayer } from "~/types/CanvasStickerLayer";
import { CanvasUserFrame } from "~/types/CanvasUserFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";
import { angleBetweenTwoPoints } from "~/utils/angle-between-two-points";
import { distanceBetweenTwoPoints } from "~/utils/distance-between-two-points";

// Constants

const CANVAS_STICKER_LAYER_MIN_WIDTH = 200;
const CANVAS_STICKER_LAYER_MIN_HEIGHT = 200;

// Container Reducer

const containerInitialState: CanvasContainerState = {
  width: 0,
  height: 0,
  actualX: 0,
  actualY: 0,
  actualWidth: 0,
  actualHeight: 0,
  displayRatio: 0,
  display: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
};

const containerReducer = (
  parentState: CanvasState,
  state = containerInitialState,
  action: Actions
): CanvasContainerState => {
  switch (action.type) {
    case types.CANVAS_CONTAINER_UPDATE_RECT: {
      const { x, y, width, height } = action.payload;
      const { width: frameWidth, height: frameHeight } = state;

      let svgWidth = width;
      let svgHeight = frameHeight * (width / frameWidth);
      let svgX = x;
      let svgY = y + (height - svgHeight) / 2;

      if (svgHeight > height) {
        svgHeight = height;
        svgWidth = frameWidth * (height / frameHeight);
        svgX = x + (width - svgWidth) / 2;
        svgY = y;
      }

      return {
        ...state,
        actualX: svgX,
        actualY: svgY,
        actualWidth: svgWidth,
        actualHeight: svgHeight,
        displayRatio: frameWidth / svgWidth,
        display: action.payload,
      };
    }

    case types.CANVAS_INITIALIZE: {
      const { width, height } = action.payload;

      return {
        ...state,
        width,
        height,
      };
    }

    case types.CANVAS_DISABLE_COLLAGE: {
      const { layers } = parentState.users;
      const layer = layers.find((layer) => layer)!;
      const width = layer.width;
      const height = layer.height;

      return {
        ...state,
        width,
        height,
      };
    }

    case types.CANVAS_ENABLE_COLLAGE: {
      const { display } = state;
      const { frame } = action.payload;
      const { width: frameWidth, height: frameHeight } = canvasUserLayerFrame[
        frame
      ];

      // ToDo: 外に切り出す
      let svgWidth = display.width;
      let svgHeight = frameHeight * (display.width / frameWidth);
      let svgX = display.x;
      let svgY = display.y + (display.height - svgHeight) / 2;

      if (svgHeight > display.height) {
        svgHeight = display.height;
        svgWidth = frameWidth * (display.height / frameHeight);
        svgX = display.x + (display.width - svgWidth) / 2;
        svgY = display.y;
      }

      return {
        ...state,
        width: frameWidth,
        height: frameHeight,
        actualX: svgX,
        actualY: svgY,
        actualWidth: svgWidth,
        actualHeight: svgHeight,
        displayRatio: frameWidth / svgWidth,
      };
    }

    default:
      return state;
  }
};

// Sticker Reducer

const stickerInitialState: CanvasStickersState = {
  isDragging: false,
  isTransforming: false,
  isMultiTouching: false,
  referenceX: 0,
  referenceY: 0,
  layers: [],
};

const stickerReducer = (
  parentState: CanvasState,
  state = stickerInitialState,
  action: Actions
): CanvasStickersState => {
  switch (action.type) {
    case types.CANVAS_STICKER_LAYER_ADD: {
      const { layers } = state;
      const { dataUrl, width, height } = action.payload;

      return {
        ...state,
        layers: [
          ...layers,
          {
            dataUrl,
            width,
            height,
            x: 0,
            y: 0,
            scale: {
              current: 1,
              previous: 1,
              reference: 0,
            },
            rotate: {
              current: 0,
              previous: 0,
              reference: 0,
            },
          },
        ],
      };
    }

    case types.CANVAS_SRICKER_LAYER_REMOVE: {
      const { layers } = state;

      return {
        ...state,
        layers: layers.slice(0, layers.length - 1),
      };
    }

    case types.CANVAS_STICKER_LAYER_CHANGE_ORDER: {
      const { layers } = state;
      const { index } = action.payload;

      return {
        ...state,
        layers: [...layers.filter((_, i) => i !== index), layers[index]],
      };
    }

    case types.CANVAS_STICKER_LAYER_START_DRAG: {
      const { layers } = state;
      const { container } = parentState;
      const { cursorPositions } = action.payload;
      const index = layers.length - 1;
      const sticker = layers[index];
      const isMultiTouching = cursorPositions.length > 1;

      if (isMultiTouching) {
        const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = cursorPositions;

        layers[index] = {
          ...sticker,
          scale: {
            ...sticker.scale,
            previous: sticker.scale.current,
            reference: distanceBetweenTwoPoints(x1, y1, x2, y2),
          },
          rotate: {
            ...sticker.rotate,
            previous: sticker.rotate.current,
            reference: angleBetweenTwoPoints(x1, y1, x2, y2),
          },
        };

        return {
          ...state,
          isTransforming: true,
          isMultiTouching: true,
          layers,
        };
      }

      const [{ x, y }] = cursorPositions;
      const {
        actualX: canvasBaseX,
        actualY: canvasBaseY,
        displayRatio,
      } = container;

      const relativeX = (x - canvasBaseX) * displayRatio;
      const relativeY = (y - canvasBaseY) * displayRatio;

      return {
        ...state,
        referenceX: relativeX - sticker.x,
        referenceY: relativeY - sticker.y,
        isDragging: true,
      };
    }

    case types.CANVAS_STICKER_LAYER_START_TRANSFORM: {
      const { layers } = state;
      const { container } = parentState;
      const { x, y } = action.payload;
      const sticker = layers[layers.length - 1];
      const centerX = sticker.x + (sticker.width * sticker.scale.current) / 2;
      const centerY = sticker.y + (sticker.height * sticker.scale.current) / 2;

      const {
        actualX: canvasBaseX,
        actualY: canvasBaseY,
        displayRatio,
      } = container;

      const relativeX = (x - canvasBaseX) * displayRatio;
      const relativeY = (y - canvasBaseY) * displayRatio;

      layers[layers.length - 1] = {
        ...sticker,
        scale: {
          ...sticker.scale,
          previous: sticker.scale.current,
          reference: distanceBetweenTwoPoints(
            centerX,
            centerY,
            relativeX,
            relativeY
          ),
        },
      };

      return {
        ...state,
        isTransforming: true,
      };
    }

    case types.CANVAS_STICKER_LAYER_TICK: {
      const { layers, isMultiTouching, isDragging, isTransforming } = state;
      const { cursorPositions } = action.payload;
      const { container } = parentState;
      const { displayRatio } = container;

      if (!layers.length) {
        return state;
      }

      const sticker = layers[layers.length - 1];

      if (isTransforming) {
        const { rotate, scale, x, y, width, height } = sticker;

        let nextX = x;
        let nextY = y;
        let nextAngle = rotate.current;
        let nextScale = scale.current;

        if (isMultiTouching) {
          const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = cursorPositions;

          nextAngle =
            rotate.previous +
            angleBetweenTwoPoints(x1, y1, x2, y2) -
            rotate.reference;
          const currentLength = distanceBetweenTwoPoints(x1, y1, x2, y2);
          nextScale = (currentLength / scale.reference) * scale.previous;
        } else {
          const centerX = x + (width * scale.current) / 2;
          const centerY = y + (height * scale.current) / 2;
          const relativeX =
            (cursorPositions[0].x - container.actualX) * displayRatio;
          const relativeY =
            (cursorPositions[0].y - container.actualY) * displayRatio;

          // 回転ボタン初期位置と中心座標の度の差を求めて足す
          nextAngle =
            angleBetweenTwoPoints(centerY, centerX, relativeY, relativeX) * -1 +
            angleBetweenTwoPoints(
              centerY,
              centerX,
              y + height * scale.current,
              x + width * scale.current
            );
          nextScale =
            (distanceBetweenTwoPoints(centerX, centerY, relativeX, relativeY) /
              scale.reference) *
            scale.previous;
        }

        // 最小値を見て縮小するかどうかを決める
        if (
          width * nextScale > CANVAS_STICKER_LAYER_MIN_WIDTH &&
          height * nextScale > CANVAS_STICKER_LAYER_MIN_HEIGHT
        ) {
          nextX = x + (width * scale.current - width * nextScale) / 2;
          nextY = y + (height * scale.current - height * nextScale) / 2;

          return {
            ...state,
            layers: progressCanvasStickerLayerTransform(
              state.layers,
              nextX,
              nextY,
              nextScale,
              nextAngle
            ),
          };
        }

        return {
          ...state,
          layers: progressCanvasStickerLayerTransform(
            state.layers,
            nextX,
            nextY,
            scale.current,
            nextAngle
          ),
        };
      }

      if (isDragging) {
        const [{ x, y }] = cursorPositions;
        const relativeX = (x - container.actualX) * displayRatio;
        const relativeY = (y - container.actualY) * displayRatio;

        layers[layers.length - 1] = {
          ...sticker,
          x: relativeX - state.referenceX,
          y: relativeY - state.referenceY,
        };

        return {
          ...state,
          layers,
        };
      }

      return state;
    }

    case types.CANVAS_COMPLETE: {
      return {
        ...state,
        isDragging: false,
        isMultiTouching: false,
        isTransforming: false,
      };
    }

    //

    default:
      return state;
  }
};

// User Reducer

const userInitialState: CanvasUsersState = {
  isDragging: false,
  canDragging: false,
  enabledCollage: false,
  differenceFromStartingX: 0,
  differenceFromStartingY: 0,
  layers: [],
  frames: [],
  selectedFrame: null,
};

const userReducer = (
  parentState: CanvasState,
  state = userInitialState,
  action: Actions
): CanvasUsersState => {
  switch (action.type) {
    case types.CANVAS_DISABLE_COLLAGE: {
      const { layers } = state;
      const layer = layers.find((layer) => layer)!;

      const width = layer.width;
      const height = layer.height;

      // ToDo: 1 枚目の画像の他のフレームでの座標位置が消えてしまう
      layers[0] = layer;

      return {
        ...state,
        canDragging: false,
        enabledCollage: false,
        layers,
        frames: [
          {
            id: uuid.v4(),
            width,
            height,
            x: 0,
            y: 0,
            d: `M0 0H${width}V${height}H0V0Z`,
          },
        ],
        selectedFrame: null,
      };
    }

    case types.CANVAS_INITIALIZE: {
      const { frames, layers } = state;
      const { dataUrl, width, height } = action.payload;

      layers[0] = {
        dataUrl,
        width,
        height,
        x: 0,
        y: 0,
        filter: {
          blur: 0,
          hueRotate: 0,
          luminanceToAlpha: false,
          saturate: 1,
        },
      };

      frames[0] = {
        id: uuid.v4(),
        width,
        height,
        x: 0,
        y: 0,
        d: `M0 0H${width}V${height}H0V0Z`,
      };

      return {
        ...state,
        frames,
        layers,
      };
    }

    case types.CANVAS_USER_LAYER_ADD: {
      const { layers } = state;
      const { index, dataUrl, width, height } = action.payload;

      layers[index] = {
        dataUrl,
        width,
        height,
        x: 0,
        y: 0,
        filter: {
          blur: 0,
          hueRotate: 0,
          luminanceToAlpha: false,
          saturate: 1,
        },
      };

      return {
        ...state,
        layers,
      };
    }

    case types.CANVAS_USER_LAYER_REMOVE: {
      const { layers } = state;
      const { index } = action.payload;

      layers[index] = null;

      return {
        ...state,
        layers,
      };
    }

    case types.CANVAS_USER_LAYER_START_DRAG: {
      const { layers } = state;
      const { displayRatio } = parentState.container;
      const { index, cursorPositions, clipPathX, clipPathY } = action.payload;
      const userLayer = layers[index];

      if (userLayer === null) {
        return state;
      }

      const { x, y } = calculateCanvasUserLayerRelativeCoordinates(
        displayRatio,
        clipPathX,
        clipPathY,
        cursorPositions[0].x,
        cursorPositions[0].y
      );

      return {
        ...state,
        differenceFromStartingX: x - userLayer.x,
        differenceFromStartingY: y - userLayer.y,
        isDragging: true,
      };
    }

    case types.CANVAS_USER_LAYER_TICK: {
      const {
        layers,
        isDragging,
        differenceFromStartingX,
        differenceFromStartingY,
        canDragging,
      } = state;
      const { displayRatio } = parentState.container;
      const { index, clipPathX, clipPathY, cursorPositions } = action.payload;
      const user = layers[index];

      if (!user || !canDragging) {
        return state;
      }

      const [{ x, y }] = cursorPositions;

      if (isDragging) {
        const {
          x: currentX,
          y: currentY,
        } = calculateCanvasUserLayerRelativeCoordinates(
          displayRatio,
          clipPathX,
          clipPathY,
          x,
          y
        );

        layers[index] = {
          ...user,
          x: currentX - differenceFromStartingX,
          y: currentY - differenceFromStartingY,
        };

        return {
          ...state,
          layers,
        };
      }

      return state;
    }

    //

    case types.CANVAS_USER_LAYER_UPDATE_FILTER: {
      const { layers } = state;
      const { index, type, value } = action.payload;
      const userLayer = layers[index];

      if (userLayer) {
        layers[index] = {
          ...userLayer,
          filter: {
            ...userLayer.filter,
            [type]: value,
          },
        };
      }

      return {
        ...state,
        layers,
      };
    }

    case types.CANVAS_ENABLE_COLLAGE: {
      const { frame, index } = action.payload;
      const canvasUserFrame = canvasUserLayerFrame[frame];

      // ToDo: 表示サイズが変わるので Svg の Rect を取得し直す必要がある
      // ToDo: container にも必要！
      return {
        ...state,
        canDragging: true,
        frames: canvasUserFrame.frames[index].map((f) => ({
          ...f,
          id: uuid.v4(),
        })),
        enabledCollage: true,
        selectedFrame: {
          type: frame,
          index,
        },
      };
    }

    case types.CANVAS_COMPLETE: {
      return {
        ...state,
        isDragging: false,
      };
    }

    default:
      return state;
  }
};

// Types

export interface CanvasContainerState {
  width: number;
  height: number;
  actualX: number;
  actualY: number;
  actualWidth: number;
  actualHeight: number;
  displayRatio: number;
  display: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CanvasStickersState {
  isDragging: boolean;
  isTransforming: boolean;
  isMultiTouching: boolean;
  referenceX: number;
  referenceY: number;
  layers: CanvasStickerLayer[];
}

export interface CanvasUsersState {
  isDragging: boolean;
  canDragging: boolean;
  enabledCollage: boolean;
  differenceFromStartingX: number;
  differenceFromStartingY: number;
  layers: (CanvasUserLayer | null)[];
  frames: CanvasUserFrame[];
  selectedFrame: {
    type: CanvasUserLayerFrame;
    index: number;
  } | null;
}

export interface CanvasState {
  container: CanvasContainerState;
  stickers: CanvasStickersState;
  users: CanvasUsersState;
}

// Main

export default (
  state = {
    container: containerInitialState,
    stickers: stickerInitialState,
    users: userInitialState,
  },
  action: Actions
): CanvasState => ({
  container: containerReducer(state, state.container, action),
  stickers: stickerReducer(state, state.stickers, action),
  users: userReducer(state, state.users, action),
});

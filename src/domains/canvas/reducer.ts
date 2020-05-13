import * as uuid from "uuid";
import {
  Actions,
  CANVAS_USER_LAYER_ADD,
  CANVAS_USER_LAYER_REMOVE,
  COMPLETE,
  CANVAS_SET_DISPLAY_RATIO,
  CANVAS_USER_LAYER_START_DRAG,
  CANVAS_USER_LAYER_SET_POSITION,
  CANVAS_FILTER_SET_VALUE,
  CANVAS_STICKER_LAYER_ADD,
  CANVAS_STICKER_LAYER_START_DRAG,
  CANVAS_STICKER_LAYER_START_TRANSFORM,
  CANVAS_STICKER_LAYER_SET_ACTIVE,
  CANVAS_SRICKER_LAYER_REMOVE,
  CANVAS_SET_FRAME,
  TICK,
} from "./actions";
import { CanvasUserFrame } from "~/types/CanvasUserFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";
import { CanvasStickerLayer } from "~/types/CanvasStickerLayer";
import { canvasUserLayerFrame } from "./frames";
import { angleBetweenTwoPoints } from "~/utils/angle-between-two-points";
import { distanceBetweenTwoPoints } from "~/utils/distance-between-two-points";

export type CanvasState = {
  width: number;
  height: number;
  x: number;
  y: number;
  frames: {
    users: CanvasUserFrame[];
  };
  layers: {
    users: (CanvasUserLayer | null)[];
    stickers: CanvasStickerLayer[];
  };
  displayRatio: number;
};

const initialState: CanvasState = {
  width: 900,
  height: 1200,
  x: 0,
  y: 0,
  frames: {
    users: [],
  },
  layers: {
    users: [],
    stickers: [],
  },
  displayRatio: 1,
};

const calculateCanvasUserLayerRelativeCoordinates = (
  state: CanvasState,
  clipPathX: number,
  clipPathY: number,
  x: number,
  y: number
) => {
  const { displayRatio } = state;

  return {
    x: (x - clipPathX) * displayRatio,
    y: (y - clipPathY) * displayRatio,
  };
};

const calculateSvgRelativeCoordinates = (
  state: CanvasState,
  x: number,
  y: number
) => {
  const { x: canvasBaseX, y: canvasBaseY, displayRatio } = state;

  return {
    x: (x - canvasBaseX) * displayRatio,
    y: (y - canvasBaseY) * displayRatio,
  };
};

const progressCanvasStickerLayerTransform = (
  state: CanvasState,
  x: number,
  y: number,
  nextScale: number,
  nextAngle: number
) => {
  const { layers } = state;
  const { stickers } = layers;
  const sticker = stickers[stickers.length - 1];

  stickers[stickers.length - 1] = {
    ...sticker,
    x,
    y,
    scale: {
      ...sticker.scale,
      current: nextScale,
    },
    rotate: {
      ...sticker.rotate,
      current: nextAngle,
    },
  };

  return {
    ...state,
    layers: {
      ...state.layers,
      stickers,
    },
  };
};

const CANVAS_STICKER_LAYER_MIN_WIDTH = 200;
const CANVAS_STICKER_LAYER_MIN_HEIGHT = 200;

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    case CANVAS_SET_FRAME: {
      const { frame, index } = action.payload;
      const canvasUserFrame = canvasUserLayerFrame[frame];

      return {
        ...state,
        width: canvasUserFrame.width,
        height: canvasUserFrame.height,
        frames: {
          users: canvasUserFrame.frames[index].map((f) => ({
            ...f,
            id: uuid.v4(),
          })),
        },
      };
    }

    case CANVAS_SET_DISPLAY_RATIO: {
      const { width } = state;
      const { displayWidth, displayX, displayY } = action.payload;

      return {
        ...state,
        displayRatio: width / displayWidth,
        x: displayX,
        y: displayY,
      };
    }

    //

    case CANVAS_USER_LAYER_ADD: {
      const { layers } = state;
      const { users } = layers;
      const { index, dataUrl, width, height } = action.payload;

      users[index] = {
        dataUrl,
        width,
        height,
        x: 0,
        y: 0,
        isDragging: false,
        differenceFromStartingX: 0,
        differenceFromStartingY: 0,
        filter: {
          blur: 0,
          hueRotate: 0,
          luminanceToAlpha: false,
          saturate: 1,
        },
      };

      return {
        ...state,
        layers: {
          ...layers,
          users,
        },
      };
    }

    case CANVAS_USER_LAYER_REMOVE: {
      const { layers } = state;
      const { users } = layers;
      const { index } = action.payload;

      users[index] = null;

      return {
        ...state,
        layers: {
          ...layers,
          users,
        },
      };
    }

    case CANVAS_USER_LAYER_START_DRAG: {
      const { users } = state.layers;
      const { index, cursorPositions, clipPathX, clipPathY } = action.payload;
      const userLayer = users[index];

      if (userLayer === null) {
        return state;
      }

      const { x, y } = calculateCanvasUserLayerRelativeCoordinates(
        state,
        clipPathX,
        clipPathY,
        cursorPositions[0].x,
        cursorPositions[0].y
      );

      users[index] = {
        ...userLayer,
        differenceFromStartingX: x - userLayer.x,
        differenceFromStartingY: y - userLayer.y,
        isDragging: true,
      };

      return {
        ...state,
        layers: {
          ...state.layers,
          users,
        },
      };
    }

    case CANVAS_USER_LAYER_SET_POSITION: {
      const { layers } = state;
      const { users } = layers;
      const { index, clipPathX, clipPathY, cursorPositions } = action.payload;
      const user = users[index];

      if (!user) {
        return state;
      }

      const {
        isDragging,
        differenceFromStartingX,
        differenceFromStartingY,
      } = user;
      const [{ x, y }] = cursorPositions;

      if (isDragging) {
        const {
          x: currentX,
          y: currentY,
        } = calculateCanvasUserLayerRelativeCoordinates(
          state,
          clipPathX,
          clipPathY,
          x,
          y
        );

        users[index] = {
          ...user,
          x: currentX - differenceFromStartingX,
          y: currentY - differenceFromStartingY,
        };

        return {
          ...state,
          layers: {
            ...state.layers,
            users,
          },
        };
      }

      return state;
    }

    //

    case CANVAS_FILTER_SET_VALUE: {
      const { layers } = state;
      const { index, type, value } = action.payload;
      const userLayer = layers.users[index];

      if (userLayer) {
        layers.users[index] = {
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

    //

    case CANVAS_STICKER_LAYER_ADD: {
      const { layers } = state;
      const { dataUrl, width, height } = action.payload;

      return {
        ...state,
        layers: {
          ...layers,
          stickers: [
            ...layers.stickers,
            {
              dataUrl,
              width,
              height,
              x: 0,
              y: 0,
              isDragging: false,
              isTransforming: false,
              isMultiTouching: false,
              referenceX: 0,
              referenceY: 0,
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
        },
      };
    }

    case CANVAS_SRICKER_LAYER_REMOVE: {
      const { layers } = state;
      const { stickers } = layers;

      return {
        ...state,
        layers: {
          ...layers,
          stickers: stickers.slice(0, stickers.length - 1),
        },
      };
    }

    case CANVAS_STICKER_LAYER_SET_ACTIVE: {
      const { layers } = state;
      const { stickers } = layers;
      const { index } = action.payload;

      return {
        ...state,
        layers: {
          ...layers,
          stickers: [
            ...stickers.filter((_, i) => i !== index),
            stickers[index],
          ],
        },
      };
    }

    case CANVAS_STICKER_LAYER_START_DRAG: {
      const { layers } = state;
      const { stickers } = layers;
      const { cursorPositions } = action.payload;
      const index = stickers.length - 1;
      const sticker = stickers[index];
      const isMultiTouching = cursorPositions.length > 1;

      if (isMultiTouching) {
        const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = cursorPositions;

        stickers[index] = {
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
          isTransforming: true,
          isMultiTouching: true,
        };

        return {
          ...state,
          layers,
        };
      }

      const [{ x, y }] = cursorPositions;
      const { x: relativeX, y: relativeY } = calculateSvgRelativeCoordinates(
        state,
        x,
        y
      );

      layers.stickers[index] = {
        ...sticker,
        referenceX: relativeX - sticker.x,
        referenceY: relativeY - sticker.y,
        isDragging: true,
      };

      return {
        ...state,
        layers,
      };
    }

    case CANVAS_STICKER_LAYER_START_TRANSFORM: {
      const { layers } = state;
      const { stickers } = layers;
      const { x, y } = action.payload;
      const sticker = stickers[stickers.length - 1];
      const centerX = sticker.x + (sticker.width * sticker.scale.current) / 2;
      const centerY = sticker.y + (sticker.height * sticker.scale.current) / 2;

      const { x: relativeX, y: relativeY } = calculateSvgRelativeCoordinates(
        state,
        x,
        y
      );

      layers.stickers[stickers.length - 1] = {
        ...sticker,
        isTransforming: true,
        scale: {
          ...sticker.scale,
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
        layers,
      };
    }

    //

    case TICK: {
      const { layers, displayRatio } = state;
      const { stickers } = layers;
      const { cursorPositions } = action.payload;

      if (!stickers.length) {
        return state;
      }

      const sticker = stickers[stickers.length - 1];
      const { isMultiTouching, isDragging, isTransforming } = sticker;

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
          const relativeX = (cursorPositions[0].x - state.x) * displayRatio;
          const relativeY = (cursorPositions[0].y - state.y) * displayRatio;

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

          return progressCanvasStickerLayerTransform(
            state,
            nextX,
            nextY,
            nextScale,
            nextAngle
          );
        }

        return progressCanvasStickerLayerTransform(
          state,
          nextX,
          nextY,
          scale.current,
          nextAngle
        );
      }

      if (isDragging) {
        const [{ x, y }] = cursorPositions;
        const relativeX = (x - state.x) * displayRatio;
        const relativeY = (y - state.y) * displayRatio;

        stickers[stickers.length - 1] = {
          ...sticker,
          x: relativeX - sticker.referenceX,
          y: relativeY - sticker.referenceY,
        };

        return {
          ...state,
          layers: {
            ...state.layers,
            stickers,
          },
        };
      }

      return state;
    }

    case COMPLETE: {
      const { users, stickers } = state.layers;

      return {
        ...state,
        layers: {
          stickers: stickers.map((sticker) => ({
            ...sticker,
            isDragging: false,
            isMultiTouching: false,
            isTransforming: false,
          })),
          users: users.map((user) => {
            if (!user) {
              return user;
            }

            return {
              ...user,
              isDragging: false,
            };
          }),
        },
      };
    }

    //

    default:
      return state;
  }
};

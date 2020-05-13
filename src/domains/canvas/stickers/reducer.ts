import { Actions, TICK, COMPLETE } from "~/domains/canvas/actions";
import {
  ADD,
  START_DRAG,
  START_TRANSFORM,
  SET_ACTIVE,
  REMOVE,
} from "./actions";
import { CanvasStickerLayer } from "~/types/CanvasStickerLayer";
import { angleBetweenTwoPoints } from "~/utils/angle-between-two-points";
import { distanceBetweenTwoPoints } from "~/utils/distance-between-two-points";
import { CanvasContainerState } from "../container/reducer";

export type CanvasStickersState = {
  isDragging: boolean;
  isTransforming: boolean;
  isMultiTouching: boolean;
  referenceX: number;
  referenceY: number;
  layers: CanvasStickerLayer[];
};

const initialState: CanvasStickersState = {
  isDragging: false,
  isTransforming: false,
  isMultiTouching: false,
  referenceX: 0,
  referenceY: 0,
  layers: [],
};

const calculateSvgRelativeCoordinates = (
  container: CanvasContainerState,
  x: number,
  y: number
) => {
  const {
    actualX: canvasBaseX,
    actualY: canvasBaseY,
    displayRatio,
  } = container;

  return {
    x: (x - canvasBaseX) * displayRatio,
    y: (y - canvasBaseY) * displayRatio,
  };
};

const progressCanvasStickerLayerTransform = (
  state: CanvasStickersState,
  x: number,
  y: number,
  nextScale: number,
  nextAngle: number
): CanvasStickersState => {
  const { layers } = state;
  const sticker = layers[layers.length - 1];

  layers[layers.length - 1] = {
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
    layers,
  };
};

const CANVAS_STICKER_LAYER_MIN_WIDTH = 200;
const CANVAS_STICKER_LAYER_MIN_HEIGHT = 200;

export default (state = initialState, action: Actions): CanvasStickersState => {
  switch (action.type) {
    case ADD: {
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

    case REMOVE: {
      const { layers } = state;

      return {
        ...state,
        layers: layers.slice(0, layers.length - 1),
      };
    }

    case SET_ACTIVE: {
      const { layers } = state;
      const { index } = action.payload;

      return {
        ...state,
        layers: [...layers.filter((_, i) => i !== index), layers[index]],
      };
    }

    case START_DRAG: {
      const { layers } = state;
      const { cursorPositions, container } = action.payload;
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
      const { x: relativeX, y: relativeY } = calculateSvgRelativeCoordinates(
        container,
        x,
        y
      );

      return {
        ...state,
        referenceX: relativeX - sticker.x,
        referenceY: relativeY - sticker.y,
        isDragging: true,
      };
    }

    case START_TRANSFORM: {
      const { layers } = state;
      const { x, y, container } = action.payload;
      const sticker = layers[layers.length - 1];
      const centerX = sticker.x + (sticker.width * sticker.scale.current) / 2;
      const centerY = sticker.y + (sticker.height * sticker.scale.current) / 2;

      const { x: relativeX, y: relativeY } = calculateSvgRelativeCoordinates(
        container,
        x,
        y
      );

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

    case TICK: {
      const { layers, isMultiTouching, isDragging, isTransforming } = state;
      const { cursorPositions, container } = action.payload;
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

    case COMPLETE: {
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

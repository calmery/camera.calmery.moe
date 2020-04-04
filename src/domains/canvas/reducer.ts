import * as uuid from "uuid";
import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasLayerTransformable } from "~/types/CanvasLayerTransformable";
import { CanvasLayerEffectable } from "~/types/CanvasLayerEffectable";
import {
  ADD_ADDABLE_STICKER_URLS,
  ADD_STICKER_LAYER,
  ADD_USER_LAYER,
  CHANGE_USER_LAYER_FILTER_VALUE,
  SET_CURSOR_POSITION,
  Actions,
  STICKER_LAYER_DRAG_START,
  STICKER_LAYER_DRAG_END,
  SET_CANVAS_POSITION,
} from "./actions";

export type CanvasState = {
  x: number;
  y: number;
  displayWidth: number;
  displayHeight: number;
  width: number;
  height: number;
  cursorPosition: {
    x: number;
    y: number;
  };
  stickerLayerReferencePositions: {
    x: number;
    y: number;
  } | null;
  addableStickerUrls: string[];
  essentialLayers: CanvasLayer[];
  stickerLayers: (CanvasLayer & CanvasLayerTransformable)[];
  userLayers: (CanvasLayer &
    CanvasLayerTransformable &
    CanvasLayerEffectable)[];
  userLayerClipPaths: {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
};

const initialState: CanvasState = {
  x: 0,
  y: 0,
  displayWidth: 0,
  displayHeight: 0,
  width: 0,
  height: 0,
  cursorPosition: {
    x: 0,
    y: 0,
  },
  stickerLayerReferencePositions: null,
  addableStickerUrls: [],
  essentialLayers: [],
  stickerLayers: [],
  userLayers: [],
  userLayerClipPaths: [],
};

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    case SET_CANVAS_POSITION:
      return {
        ...state,
        ...action.payload,
      };

    // Sticker Layers

    case STICKER_LAYER_DRAG_START: {
      const canvasLayer = state.stickerLayers[action.payload.layerIndex];
      const ratio = state.width / state.displayWidth;

      return {
        ...state,
        // 選択したレイヤーを一番上に表示するために配列の最後に移動する
        stickerLayers: [
          ...state.stickerLayers.filter(
            (_, index) => index !== action.payload.layerIndex
          ),
          state.stickerLayers[action.payload.layerIndex],
        ],
        // 選択した StickerLayer の Canvas 上での相対位置を計算する
        stickerLayerReferencePositions: {
          x: canvasLayer.x - Math.round(action.payload.x * ratio - state.x),
          y: canvasLayer.y - Math.round(action.payload.y * ratio - state.y),
        },
      };
    }

    case STICKER_LAYER_DRAG_END:
      return {
        ...state,
        stickerLayerReferencePositions: null,
      };

    //

    case SET_CURSOR_POSITION: {
      const { stickerLayers, stickerLayerReferencePositions, x, y } = state;
      const ratio = state.width / state.displayWidth;
      const partialState: Partial<CanvasState> = {};

      if (stickerLayerReferencePositions !== null) {
        partialState.stickerLayers = stickerLayers;
        partialState.stickerLayers[partialState.stickerLayers.length - 1] = {
          ...stickerLayers[partialState.stickerLayers.length - 1],
          x:
            Math.round(action.payload.x * ratio - x) +
            stickerLayerReferencePositions.x,
          y:
            Math.round(action.payload.y * ratio - y) +
            stickerLayerReferencePositions.y,
        };
      }

      return {
        ...state,
        ...partialState,
        cursorPosition: action.payload,
      };
    }

    case CHANGE_USER_LAYER_FILTER_VALUE: {
      const { userLayers } = state;
      const userLayer = state.userLayers[action.payload.index];

      userLayers[action.payload.index] = {
        ...userLayer,
        filter: {
          ...userLayer.filter,
          [action.payload.type]: action.payload.value,
        },
      };

      return {
        ...state,
        userLayers,
      };
    }

    case ADD_ADDABLE_STICKER_URLS:
      return {
        ...state,
        addableStickerUrls: action.payload,
      };

    case ADD_STICKER_LAYER:
      return {
        ...state,
        stickerLayers: [
          ...state.stickerLayers,
          {
            ...action.payload,
            id: uuid.v4(),
            x: 0,
            y: 0,
            transform: {
              flip: false,
              rotate: 0,
              scale: 1,
            },
          },
        ],
      };

    case ADD_USER_LAYER:
      return {
        ...state,
        width: action.payload.width,
        height: action.payload.height,
        userLayers: [
          ...state.userLayers,
          {
            ...action.payload,
            id: uuid.v4(),
            x: 0,
            y: 0,
            transform: {
              flip: false,
              rotate: 0,
              scale: 1,
            },
            filter: {
              blur: 0,
              hueRotate: 0,
              luminanceToAlpha: false,
              saturate: 1,
            },
          },
        ],
        userLayerClipPaths: [
          ...state.userLayerClipPaths,
          {
            type: "rect",
            x: 0,
            y: 0,
            width: action.payload.width,
            height: action.payload.height,
          },
        ],
      };

    default:
      return state;
  }
};

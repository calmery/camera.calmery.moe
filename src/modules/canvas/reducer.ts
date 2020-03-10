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
  STICKER_LAYER_DRAG_END
} from "./actions";

export type CanvasState = {
  width: number;
  height: number;
  cursorPosition: {
    x: number;
    y: number;
  };
  moveTargetStickerLayer: {
    index: number;
    position: {
      referenceX: number;
      referenceY: number;
    };
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
  width: 0,
  height: 0,
  cursorPosition: {
    x: 0,
    y: 0
  },
  moveTargetStickerLayer: null,
  addableStickerUrls: [],
  essentialLayers: [],
  stickerLayers: [],
  userLayers: [],
  userLayerClipPaths: []
};

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    // Sticker Layers

    case STICKER_LAYER_DRAG_START:
      return {
        ...state,
        moveTargetStickerLayer: {
          index: action.payload.layerIndex,
          position: {
            referenceX: action.payload.referenceX,
            referenceY: action.payload.referenceY
          }
        }
      };

    case STICKER_LAYER_DRAG_END:
      return {
        ...state,
        moveTargetStickerLayer: null
      };

    //

    case SET_CURSOR_POSITION: {
      const { stickerLayers, moveTargetStickerLayer } = state;
      const partialState: Partial<CanvasState> = {};

      if (moveTargetStickerLayer !== null) {
        partialState.stickerLayers = stickerLayers;
        partialState.stickerLayers[moveTargetStickerLayer.index] = {
          ...stickerLayers[moveTargetStickerLayer.index],
          ...action.payload
        };
      }

      return {
        ...state,
        ...partialState,
        cursorPosition: action.payload
      };
    }

    case CHANGE_USER_LAYER_FILTER_VALUE: {
      const { userLayers } = state;
      const userLayer = state.userLayers[action.payload.index];

      userLayers[action.payload.index] = {
        ...userLayer,
        filter: {
          ...userLayer.filter,
          [action.payload.type]: action.payload.value
        }
      };

      return {
        ...state,
        userLayers
      };
    }

    case ADD_ADDABLE_STICKER_URLS:
      return {
        ...state,
        addableStickerUrls: action.payload
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
              scale: 1
            }
          }
        ]
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
              scale: 1
            },
            filter: {
              blur: 0,
              hueRotate: 0,
              luminanceToAlpha: false,
              saturate: 1
            }
          }
        ],
        userLayerClipPaths: [
          ...state.userLayerClipPaths,
          {
            type: "rect",
            x: 0,
            y: 0,
            width: action.payload.width,
            height: action.payload.height
          }
        ]
      };

    default:
      return state;
  }
};

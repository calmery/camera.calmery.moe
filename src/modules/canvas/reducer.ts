import * as uuid from "uuid";
import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasLayerTransformable } from "~/types/CanvasLayerTransformable";
import { CanvasLayerEffectable } from "~/types/CanvasLayerEffectable";
import {
  ADD_ADDABLE_STICKER_URLS,
  ADD_STICKER_LAYER,
  ADD_USER_LAYER,
  CHANGE_USER_LAYER_FILTER_VALUE,
  POINTER_MOVE,
  REFERENCE_POINTER_MOVE,
  Actions,
  DRAG_START,
  DRAG_END
} from "./actions";

export type CanvasState = {
  width: number;
  height: number;
  draggingStickerLayerIndex: number | null;
  pointerPosition: {
    referenceX: number;
    referenceY: number;
    x: number;
    y: number;
  };
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
  draggingStickerLayerIndex: null,
  pointerPosition: {
    referenceX: 0,
    referenceY: 0,
    x: 0,
    y: 0
  },
  addableStickerUrls: [],
  essentialLayers: [],
  stickerLayers: [],
  userLayers: [],
  userLayerClipPaths: []
};

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    case DRAG_START:
      return {
        ...state,
        draggingStickerLayerIndex: action.payload.dragTargetIndex
      };

    case DRAG_END:
      return {
        ...state,
        draggingStickerLayerIndex: null
      };

    case REFERENCE_POINTER_MOVE:
      return {
        ...state,
        pointerPosition: {
          ...state.pointerPosition,
          ...action.payload
        }
      };

    case POINTER_MOVE: {
      const { stickerLayers, draggingStickerLayerIndex } = state;

      // Dummy
      if (
        draggingStickerLayerIndex !== null &&
        stickerLayers[draggingStickerLayerIndex]
      ) {
        stickerLayers[draggingStickerLayerIndex] = {
          ...stickerLayers[draggingStickerLayerIndex],
          ...action.payload
        };
      }

      return {
        ...state,
        pointerPosition: {
          ...state.pointerPosition,
          ...action.payload
        },
        stickerLayers
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

import * as uuid from "uuid";
import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasLayerTransformable } from "~/types/CanvasLayerTransformable";
import { CanvasLayerEffectable } from "~/types/CanvasLayerEffectable";
import {
  ADD_ADDABLE_STICKER_URLS,
  ADD_STICKER_LAYER,
  ADD_USER_LAYER,
  Actions
} from "./actions";

export type CanvasState = {
  width: number;
  height: number;
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
  addableStickerUrls: [],
  essentialLayers: [],
  stickerLayers: [],
  userLayers: [],
  userLayerClipPaths: []
};

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
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

import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasLayerTransformable } from "~/types/CanvasLayerTransformable";
import { CanvasLayerEffectable } from "~/types/CanvasLayerEffectable";
import { ADD_ADDABLE_STICKER_URLS, ADD_USER_LAYER, Actions } from "./actions";

export type CanvasState = {
  addableStickerUrls: string[];
  essentialLayers: CanvasLayer[];
  stickerLayers: (CanvasLayer & CanvasLayerTransformable)[];
  userLayers: (CanvasLayer &
    CanvasLayerTransformable &
    CanvasLayerEffectable)[];
};

const initialState: CanvasState = {
  addableStickerUrls: [],
  essentialLayers: [],
  stickerLayers: [],
  userLayers: []
};

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    case ADD_ADDABLE_STICKER_URLS:
      return {
        ...state,
        addableStickerUrls: action.payload
      };

    case ADD_USER_LAYER:
      return {
        ...state,
        userLayers: [
          ...state.userLayers,
          {
            ...action.payload,
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
              saturate: 0
            }
          }
        ]
      };

    default:
      return state;
  }
};

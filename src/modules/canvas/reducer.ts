import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasLayerTransformable } from "~/types/CanvasLayerTransformable";
import { CanvasLayerEffectable } from "~/types/CanvasLayerEffectable";
import { ADD_ADDABLE_STICKER_URLS, Actions } from "./actions";

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

export default (state = initialState, action: Actions) => {
  switch (action.type) {
    case ADD_ADDABLE_STICKER_URLS:
      return {
        ...state,
        addableStickerUrls: action.payload
      };

    default:
      return state;
  }
};

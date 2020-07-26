import uuid from "uuid";
import { Actions } from "./actions";
import * as types from "./types";
import { Actions as CanvasActions } from "../canvas/actions";
import * as canvasActionsTypes from "../canvas/types";

export type EntitiesState = {
  [key: string]: {
    dataUrl: string;
    width: number;
    height: number;
  };
};

const reducer = (
  state = {},
  action: Actions | CanvasActions
): EntitiesState => {
  switch (action.type) {
    // case types.ENTITIES_ADD:
    //   return state;

    // case types.ENTITIES_REMOVE:
    //   return state;

    case canvasActionsTypes.CANVAS_USER_LAYER_ADD:
    case canvasActionsTypes.CANVAS_STICKER_LAYER_ADD:
      return {
        ...state,
        [action.payload.entityId]: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;

import { Actions } from "./actions";
import * as types from "./types";

export type EntitiesState = {
  [key: string]: {
    dataUrl: string;
    width: number;
    height: number;
  };
};

const reducer = (state = {}, action: Actions): EntitiesState => {
  switch (action.type) {
    case types.ENTITIES_ADD:
      return state;

    case types.ENTITIES_REMOVE:
      return state;

    default:
      return state;
  }
};

export default reducer;

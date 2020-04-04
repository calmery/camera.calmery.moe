import { Actions, NO_OP } from "./actions";

export type CanvasState = {};

const initialState: CanvasState = {};

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    case NO_OP:
      return {};

    default:
      return state;
  }
};

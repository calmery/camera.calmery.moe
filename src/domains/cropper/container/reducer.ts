import { Actions } from "../actions";
import * as actions from "./actions";

const { SET_ACTUAL_SIZE } = actions;

export type CropperContainerState = {
  actualX: number;
  actualY: number;
  actualWidth: number;
  actualHeight: number;
  displayRatio: number;
};

const initialState: CropperContainerState = {
  actualX: 0,
  actualY: 0,
  actualWidth: 0,
  actualHeight: 0,
  displayRatio: 0,
};

export default (state = initialState, action: Actions) => {
  switch (action.type) {
    case SET_ACTUAL_SIZE: {
      const { x, y, width, height, displayRatio } = action.payload;

      return {
        actualX: x,
        actualY: y,
        actualWidth: width,
        actualHeight: height,
        displayRatio,
      };
    }

    default:
      return state;
  }
};

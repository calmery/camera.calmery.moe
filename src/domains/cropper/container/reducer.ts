import { SET_ACTUAL_SIZE } from "./actions";
import { Actions } from "~/domains/cropper/actions";

export type CropperContainerState = {
  actualX: number;
  actualY: number;
  displayRatio: number;
};

const initialState: CropperContainerState = {
  actualX: 0,
  actualY: 0,
  displayRatio: 0,
};

export default (state = initialState, action: Actions) => {
  switch (action.type) {
    case SET_ACTUAL_SIZE: {
      const { x, y, displayRatio } = action.payload;

      return {
        actualX: x,
        actualY: y,
        displayRatio,
      };
    }

    default:
      return state;
  }
};

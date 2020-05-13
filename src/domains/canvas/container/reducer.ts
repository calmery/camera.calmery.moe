import { Actions, SET_FRAME } from "~/domains/canvas/actions";
import { SET_ACTUAL_SIZE } from "./actions";
import { canvasUserLayerFrame } from "../frames";

export type CanvasContainerState = {
  width: number;
  height: number;
  actualX: number;
  actualY: number;
  displayRatio: number;
};

const initialState: CanvasContainerState = {
  width: 0,
  height: 0,
  actualX: 0,
  actualY: 0,
  displayRatio: 0,
};

export default (
  state = initialState,
  action: Actions
): CanvasContainerState => {
  switch (action.type) {
    case SET_ACTUAL_SIZE: {
      const { width } = state;
      const { actualWidth, actualX, actualY } = action.payload;

      return {
        ...state,
        displayRatio: width / actualWidth,
        actualX,
        actualY,
      };
    }

    case SET_FRAME: {
      const { frame } = action.payload;
      const { width, height } = canvasUserLayerFrame[frame];

      return {
        ...state,
        width,
        height,
      };
    }

    default:
      return state;
  }
};

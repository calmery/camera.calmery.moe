import {
  Actions,
  SET_FRAME,
  ADD_USER_IMAGE_AND_SET_FRAME,
  SET_DEFAULT_FRAME,
} from "~/domains/canvas/actions";
import { SET_SVG_POSITION_AND_SIZE } from "./actions";
import { canvasUserLayerFrame } from "../frames";

export type CanvasContainerState = {
  width: number;
  height: number;
  actualX: number;
  actualY: number;
  actualWidth: number;
  actualHeight: number;
  displayRatio: number;
};

const initialState: CanvasContainerState = {
  width: 0,
  height: 0,
  actualX: 0,
  actualY: 0,
  actualWidth: 0,
  actualHeight: 0,
  displayRatio: 0,
};

export default (
  state = initialState,
  action: Actions
): CanvasContainerState => {
  switch (action.type) {
    case SET_SVG_POSITION_AND_SIZE: {
      // const { width } = state;
      // const { actualWidth, actualX, actualY } = action.payload;

      // return {
      //   ...state,
      //   displayRatio: width / actualWidth,
      //   actualX,
      //   actualY,
      // };

      const { x, y, width, height } = action.payload;
      const { width: frameWidth, height: frameHeight } = state;

      let svgWidth = width;
      let svgHeight = frameHeight * (width / frameWidth);
      let svgX = x;
      let svgY = y + (height - svgHeight) / 2;

      if (svgHeight > height) {
        svgHeight = height;
        svgWidth = frameWidth * (height / frameHeight);
        svgX = x + (width - svgWidth) / 2;
        svgY = y;
      }

      return {
        ...state,
        actualX: svgX,
        actualY: svgY,
        actualWidth: svgWidth,
        actualHeight: svgHeight,
        displayRatio: frameWidth / svgWidth,
      };
    }

    case ADD_USER_IMAGE_AND_SET_FRAME: {
      const { width, height } = action.payload;

      return {
        ...state,
        width,
        height,
      };
    }

    case SET_DEFAULT_FRAME: {
      const { width, height } = action.payload;

      return {
        ...state,
        width,
        height,
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

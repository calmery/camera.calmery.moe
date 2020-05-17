import { SET_ACTUAL_SIZE, SET_SVG_POSITION_AND_SIZE } from "./actions";
import { Actions } from "~/domains/cropper/actions";

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
    // case SET_ACTUAL_SIZE: {
    //   const { x, y, displayRatio } = action.payload;

    //   return {
    //     actualX: x,
    //     actualY: y,
    //     displayRatio,
    //   };
    // }

    case SET_SVG_POSITION_AND_SIZE: {
      const { x, y, width, height, image } = action.payload;
      const { width: imageWidth, height: imageHeight } = image;

      let svgWidth = width;
      let svgHeight = imageHeight * (width / imageWidth);
      let svgX = x;
      let svgY = y + (height - svgHeight) / 2;

      if (svgHeight > height) {
        svgHeight = height;
        svgWidth = imageWidth * (height / imageHeight);
        svgX = x + (width - svgWidth) / 2;
        svgY = y;
      }

      return {
        ...state,
        actualX: svgX,
        actualY: svgY,
        actualWidth: svgWidth,
        actualHeight: svgHeight,
        displayRatio: imageWidth / svgWidth,
      };
    }

    default:
      return state;
  }
};

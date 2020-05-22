import { Actions } from "../canvas/actions";
import { CANVAS_ENABLE_COLLAGE, CANVAS_DISABLE_COLLAGE } from "../canvas/types";
import { CanvasUserLayerFrameType } from "~/types/CanvasUserLayerFrameType";

export interface UiState {
  selectedUserLayerFrame: {
    frame: CanvasUserLayerFrameType;
    index: number;
  } | null;
}

const initialState: UiState = {
  selectedUserLayerFrame: null,
};

export default (state = initialState, action: Actions): UiState => {
  switch (action.type) {
    case CANVAS_ENABLE_COLLAGE:
      return {
        ...state,
        selectedUserLayerFrame: action.payload,
      };

    case CANVAS_DISABLE_COLLAGE:
      return {
        ...state,
        selectedUserLayerFrame: null,
      };

    default:
      return state;
  }
};

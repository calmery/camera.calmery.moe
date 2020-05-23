import { Actions } from "./actions";
import { Actions as CanvasActions } from "../canvas/actions";
import { UI_CHANGE_FILTER_TYPE } from "./types";
import { CANVAS_ENABLE_COLLAGE, CANVAS_DISABLE_COLLAGE } from "../canvas/types";
import { CanvasUserLayerFrameType } from "~/types/CanvasUserLayerFrameType";
import { FeColorMatrix } from "~/types/FeColorMatrix";

export interface UiState {
  selectedUserLayerFrame: {
    frame: CanvasUserLayerFrameType;
    index: number;
  } | null;
  selectedFilterType: FeColorMatrix;
}

const initialState: UiState = {
  selectedUserLayerFrame: null,
  selectedFilterType: FeColorMatrix.saturate,
};

export default (
  state = initialState,
  action: CanvasActions | Actions
): UiState => {
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

    case UI_CHANGE_FILTER_TYPE: {
      const { filterType } = action.payload;

      return {
        ...state,
        selectedFilterType: filterType,
      };
    }

    default:
      return state;
  }
};

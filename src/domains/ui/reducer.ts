import { Actions } from "./actions";
import { Actions as CanvasActions } from "../canvas/actions";
import {
  UI_CHANGE_FILTER_TYPE,
  UI_IMAGE_LOAD_ERROR,
  UI_START_LOADING,
  UI_FINISH_LOADING,
} from "./types";
import { CANVAS_ENABLE_COLLAGE, CANVAS_DISABLE_COLLAGE } from "../canvas/types";
import { CanvasUserLayerFrameType } from "~/types/CanvasUserLayerFrameType";
import { FeColorMatrix } from "~/types/FeColorMatrix";

export interface UiState {
  selectedUserLayerFrame: {
    frame: CanvasUserLayerFrameType;
    index: number;
  } | null;
  selectedFilterType: FeColorMatrix;
  isImageLoadError: boolean;
  loading: number;
}

const initialState: UiState = {
  selectedUserLayerFrame: null,
  selectedFilterType: FeColorMatrix.saturate,
  isImageLoadError: false,
  loading: 0,
};

export default (
  state = initialState,
  action: CanvasActions | Actions
): UiState => {
  switch (action.type) {
    case UI_IMAGE_LOAD_ERROR: {
      const { resolve } = action.payload;

      return {
        ...state,
        isImageLoadError: resolve,
      };
    }

    case UI_START_LOADING:
      return {
        ...state,
        loading: state.loading + 1,
      };

    case UI_FINISH_LOADING:
      return {
        ...state,
        loading: state.loading - 1 < 0 ? 0 : state.loading - 1,
      };

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

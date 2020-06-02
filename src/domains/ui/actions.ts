import {
  UI_CHANGE_FILTER_TYPE,
  UI_IMAGE_LOAD_ERROR,
  UI_START_LOADING,
  UI_FINISH_LOADING,
} from "./types";
import { CanvasUserFilterType } from "~/types/CanvasUserFilterType";

export const changeUiFilterType = (filterType: CanvasUserFilterType) => ({
  type: UI_CHANGE_FILTER_TYPE,
  payload: { filterType },
});

export const imageLoadError = (resolve: boolean) => ({
  type: UI_IMAGE_LOAD_ERROR,
  payload: { resolve },
});

export const startLoading = () => ({
  type: UI_START_LOADING,
});

export const finishLoading = () => ({
  type: UI_FINISH_LOADING,
});

export const actions = {
  changeUiFilterType,
  imageLoadError,
  startLoading,
  finishLoading,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

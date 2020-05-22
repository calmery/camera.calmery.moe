import { UI_CHANGE_FILTER_TYPE } from "./types";
import { FeColorMatrix } from "~/types/FeColorMatrix";

export const changeUiFilterType = (filterType: FeColorMatrix) => ({
  type: UI_CHANGE_FILTER_TYPE,
  payload: { filterType },
});

export const actions = {
  changeUiFilterType,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

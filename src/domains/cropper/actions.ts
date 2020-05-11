import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";
import { actions as containerActions } from "./container/actions";
import { actions as cropperActions } from "./cropper/actions";
import { actions as imageActions } from "./image/actions";
import { getOrCreateStore } from "..";

export const TICK = "CROPPER/TICK" as const;
export const COMPLETE = "CROPPER/COMPLETE" as const;

export const tick = (cursorPositions: CursorPosition[]) => {
  const { container } = getOrCreateStore().getState().cropper;

  return {
    type: TICK,
    payload: { container, cursorPositions },
  };
};

export const complete = () => ({
  type: COMPLETE,
});

export const actions = {
  ...containerActions,
  ...cropperActions,
  ...imageActions,
  tick,
  complete,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

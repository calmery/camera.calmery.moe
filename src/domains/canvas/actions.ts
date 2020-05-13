import * as container from "./container/actions";
import * as stickers from "./stickers/actions";
import * as users from "./users/actions";
import { CanvasUserLayerFrame } from "./frames";
import { getOrCreateStore } from "~/domains";
import { CursorPosition } from "~/utils/convert-event-to-cursor-positions";

export const TICK = "CANVAS/TICK" as const;
export const COMPLETE = "CANVAS/COMPLETE" as const;
export const SET_FRAME = "CANVAS/SET_FRAME" as const;

export const tick = (cursorPositions: CursorPosition[]) => {
  const { container } = getOrCreateStore().getState().canvas;

  return {
    type: TICK,
    payload: { container, cursorPositions },
  };
};

export const complete = () => ({
  type: COMPLETE,
});

export const setFrame = (frame: CanvasUserLayerFrame, index: number) => ({
  type: SET_FRAME,
  payload: { frame, index },
});

export const actions = {
  ...container.actions,
  ...stickers.actions,
  ...users.actions,
  tick,
  complete,
  setFrame,
};

export const thunkActions = {
  ...stickers.thunkActions,
  ...users.thunkActions,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

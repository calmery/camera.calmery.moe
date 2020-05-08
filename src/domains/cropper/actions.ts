import { convertEventToCursorPositions } from "~/utils/convert-event-to-positions";
import { CropperContainerState } from "./container/reducer";
import { actions as containerActions } from "./container/actions";
import { actions as cropperActions } from "./cropper/actions";
import { actions as imageActions } from "./image/actions";

export const TICK = "CROPPER/TICK" as const;
export const COMPLETE = "CROPPER/COMPLETE" as const;

export const tick = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
  container: CropperContainerState
) => ({
  type: TICK,
  payload: { positions: convertEventToCursorPositions(event), container },
});

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

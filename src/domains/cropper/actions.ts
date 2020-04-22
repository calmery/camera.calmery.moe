export const CHANGE_FREE_ASPECT = "CROPPER/CHANGE_FREE_ASPECT" as const;
export const SET_ASPECT_RATIO = "CROPPER/SET_ASPECT_RATIO" as const;
export const SET_CONTAINER_DISPLAY_SIZE = "CROPPER/SET_CONTAINER_DISPLAY_SIZE" as const;
export const START_DRAG = "CROPPER/START_DRAG" as const;
export const RESET_FLAGS = "CROPPER/RESET_FLAGS" as const;
export const SET_POSITION = "CROPPER/SET_POSITION" as const;
export const START_TRANSFORM = "CROPPER/START_TRANSFORM" as const;
export const SET_SCALE = "CROPPER/SET_SCALE" as const;

export const changeFreeAspect = () => ({
  type: CHANGE_FREE_ASPECT,
});

export const setAspectRatio = (widthRatio: number, heightRatio: number) => ({
  type: SET_ASPECT_RATIO,
  payload: { widthRatio, heightRatio },
});

export const setScale = (
  nextScale: number,
  nextScaleX: number,
  nextScaleY: number
) => ({
  type: SET_SCALE,
  payload: { nextScale, nextScaleX, nextScaleY },
});

export const setContainerDisplaySize = (payload: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => ({
  type: SET_CONTAINER_DISPLAY_SIZE,
  payload,
});

export const startTransform = (
  referenceScale: number,
  referenceXScale: number,
  referenceYScale: number
) => ({
  type: START_TRANSFORM,
  payload: { referenceScale, referenceXScale, referenceYScale },
});

export const setPosition = (x: number, y: number) => ({
  type: SET_POSITION,
  payload: { x, y },
});

export const startDrag = (referenceX: number, referenceY: number) => ({
  type: START_DRAG,
  payload: { referenceX, referenceY },
});

export const resetFlags = () => ({
  type: RESET_FLAGS,
});

export type Actions =
  | ReturnType<typeof changeFreeAspect>
  | ReturnType<typeof setAspectRatio>
  | ReturnType<typeof setContainerDisplaySize>
  | ReturnType<typeof startDrag>
  | ReturnType<typeof resetFlags>
  | ReturnType<typeof setPosition>
  | ReturnType<typeof startTransform>
  | ReturnType<typeof setScale>;

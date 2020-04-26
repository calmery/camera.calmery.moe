export const CHANGE_FREE_ASPECT = "CROPPER/CHANGE_FREE_ASPECT" as const;
export const SET_ASPECT_RATIO = "CROPPER/SET_ASPECT_RATIO" as const;
export const SET_CONTAINER_DISPLAY_SIZE = "CROPPER/SET_CONTAINER_DISPLAY_SIZE" as const;
export const START_DRAG = "CROPPER/START_DRAG" as const;
export const RESET_FLAGS = "CROPPER/RESET_FLAGS" as const;
export const START_TRANSFORM = "CROPPER/START_TRANSFORM" as const;
export const START_ROTATE_IMAGE = "CROPPER/START_ROTATE_IMAGE" as const;
export const UPDATE = "CROPPER/UPDATE" as const;

export const update = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
) => {
  const positions = [];

  if ((event as any).touches) {
    const { touches } = event as TouchEvent | React.TouchEvent;

    for (let i = 0; i < touches.length; i++) {
      positions.push({
        clientX: touches[i].clientX,
        clientY: touches[i].clientY,
      });
    }
  } else {
    positions.push({
      clientX: (event as MouseEvent | React.MouseEvent).clientX,
      clientY: (event as MouseEvent | React.MouseEvent).clientY,
    });
  }

  return {
    type: UPDATE,
    payload: positions,
  };
};

export const changeFreeAspect = () => ({
  type: CHANGE_FREE_ASPECT,
});

export const setAspectRatio = (widthRatio: number, heightRatio: number) => ({
  type: SET_ASPECT_RATIO,
  payload: { widthRatio, heightRatio },
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

export const startRotateImage = (event: TouchEvent) => ({
  type: START_ROTATE_IMAGE,
  payload: { event },
});

export const startTransform = (event: React.TouchEvent | React.MouseEvent) => {
  const positions = [];

  if ((event as any).touches) {
    const { touches } = event as TouchEvent | React.TouchEvent;

    for (let i = 0; i < touches.length; i++) {
      positions.push({
        clientX: touches[i].clientX,
        clientY: touches[i].clientY,
      });
    }
  } else {
    positions.push({
      clientX: (event as MouseEvent | React.MouseEvent).clientX,
      clientY: (event as MouseEvent | React.MouseEvent).clientY,
    });
  }

  return {
    type: START_TRANSFORM,
    payload: positions,
  };
};

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
  | ReturnType<typeof startTransform>
  | ReturnType<typeof startRotateImage>
  | ReturnType<typeof update>;

import * as actions from "./actions";

const {
  CHANGE_FREE_ASPECT,
  SET_ASPECT_RATIO,
  SET_CONTAINER_DISPLAY_SIZE,
  START_CROPPER_MOVING,
  COMPLETE,
  START_CROPPER_TRANSFORMING,
  START_IMAGE_TRANSFORMING,
  TICK,
} = actions;

export type CropperState = {
  freeAspect: boolean;
  width: number;
  height: number;
  isDragging: boolean;
  isTransforming: boolean;
  isRotating: boolean;
  image: {
    url: string;
    width: number;
    height: number;
    x: number;
    y: number;
    scale: {
      current: number;
      previous: number;
      reference: number;
    };
  };
  containerDisplay: {
    x: number;
    y: number;
    ratio: number;
  };
  position: {
    x: number;
    y: number;
    referenceX: number;
    referenceY: number;
  };
  rotate: {
    current: number;
    previous: number;
    reference: number;
  };
  scale: {
    current: number;
    previous: number;
    reference: number;
  };
  scaleX: {
    current: number;
    previous: number;
    reference: number;
  };
  scaleY: {
    current: number;
    previous: number;
    reference: number;
  };
};

const initialState: CropperState = {
  freeAspect: true,
  width: 160,
  height: 90,
  isDragging: false,
  isTransforming: false,
  isRotating: false,
  containerDisplay: {
    x: 0,
    y: 0,
    ratio: 0,
  },
  image: {
    url: "images/background.jpg",
    width: 1500,
    height: 1065,
    x: 0,
    y: 0,
    scale: {
      current: 1,
      previous: 1,
      reference: 0,
    },
  },
  position: {
    x: 0,
    y: 0,
    referenceX: 0,
    referenceY: 0,
  },
  rotate: {
    current: 0,
    previous: 0,
    reference: 0,
  },
  scale: {
    current: 1,
    previous: 1,
    reference: 0,
  },
  scaleX: {
    current: 1,
    previous: 1,
    reference: 0,
  },
  scaleY: {
    current: 1,
    previous: 1,
    reference: 0,
  },
};

// Events

const startCropperMoving = (
  state: CropperState,
  positions: ReturnType<typeof actions.startCropperMoving>["payload"]
) => {
  const { containerDisplay, position } = state;

  const referenceX =
    (positions[0].clientX - containerDisplay.x) * containerDisplay.ratio -
    position.x;
  const referenceY =
    (positions[0].clientY - containerDisplay.y) * containerDisplay.ratio -
    position.y;

  return {
    ...state,
    isDragging: true,
    position: {
      ...state.position,
      referenceX,
      referenceY,
    },
  };
};

const startCropperTransforming = (
  state: CropperState,
  positions: ReturnType<typeof actions.startCropperTransforming>["payload"]
) => {
  const { containerDisplay, position } = state;

  const scale = Math.pow(
    Math.pow(
      (positions[0].clientX - containerDisplay.x) * containerDisplay.ratio -
        position.x,
      2
    ) +
      Math.pow(
        (positions[0].clientY - containerDisplay.y) * containerDisplay.ratio -
          position.y,
        2
      ),
    0.5
  );
  const scaleX =
    (positions[0].clientX - containerDisplay.x) * containerDisplay.ratio -
    position.x;
  const scaleY =
    (positions[0].clientY - containerDisplay.y) * containerDisplay.ratio -
    position.y;

  return {
    ...state,
    isTransforming: true,
    scale: {
      ...state.scale,
      previous: state.scale.current,
      reference: scale,
    },
    scaleX: {
      ...state.scaleX,
      previous: state.scaleX.current,
      reference: scaleX,
    },
    scaleY: {
      ...state.scaleY,
      previous: state.scaleY.current,
      reference: scaleY,
    },
  };
};

const startImageTransforming = (
  state: CropperState,
  positions: ReturnType<typeof actions.startImageTransforming>["payload"]
): CropperState => {
  // Multi Touch
  if (positions.length > 1) {
    const distanceBetweenFingers = Math.pow(
      Math.pow(positions[1].clientX - positions[0].clientX, 2) +
        Math.pow(positions[1].clientY - positions[0].clientY, 2),
      0.5
    );

    const angleBetweenFingers =
      Math.atan2(
        positions[1].clientY - positions[0].clientY,
        positions[1].clientX - positions[0].clientX
      ) *
      (180 / Math.PI);

    return {
      ...state,
      isRotating: true,
      rotate: {
        ...state.rotate,
        previous: state.rotate.current,
        reference: angleBetweenFingers,
      },
      image: {
        ...state.image,
        scale: {
          ...state.image.scale,
          previous: state.image.scale.current,
          reference: distanceBetweenFingers,
        },
      },
    };
  }

  return state;
};

const tick = (
  state: CropperState,
  positions: ReturnType<typeof actions.tick>["payload"]
) => {
  const {
    isDragging,
    freeAspect,
    width,
    isTransforming,
    isRotating,
    containerDisplay,
    position,
    scale,
    scaleX,
    scaleY,
    rotate,
    image,
  } = state;

  if (isRotating && positions.length > 1) {
    const nextAngle =
      rotate.previous +
      (Math.atan2(
        positions[1].clientY - positions[0].clientY,
        positions[1].clientX - positions[0].clientX
      ) *
        (180 / Math.PI) -
        rotate.reference);
    const currentLength = Math.pow(
      Math.pow(positions[1].clientX - positions[0].clientX, 2) +
        Math.pow(positions[1].clientY - positions[0].clientY, 2),
      0.5
    );
    const nextScale =
      (currentLength / image.scale.reference) * image.scale.previous;
    const nextX =
      image.x +
      (image.width * image.scale.current - image.width * nextScale) / 2;
    const nextY =
      image.y +
      (image.height * image.scale.current - image.height * nextScale) / 2;

    return {
      ...state,
      image: {
        ...state.image,
        x: nextX,
        y: nextY,
        scale: {
          ...state.image.scale,
          current: nextScale,
        },
      },
      rotate: {
        ...state.rotate,
        current: nextAngle,
      },
    };
  }

  if (isDragging) {
    const [{ clientX, clientY }] = positions;

    const relativeX = (clientX - containerDisplay.x) * containerDisplay.ratio;
    const relativeY = (clientY - containerDisplay.y) * containerDisplay.ratio;

    const nextX = relativeX - position.referenceX;
    const nextY = relativeY - position.referenceY;

    return {
      ...state,
      position: {
        ...state.position,
        x: nextX,
        y: nextY,
      },
    };
  }

  if (isTransforming) {
    const [{ clientX, clientY }] = positions;

    const nextScale =
      (Math.pow(
        Math.pow(
          (clientX - containerDisplay.x) * containerDisplay.ratio - position.x,
          2
        ) +
          Math.pow(
            (clientY - containerDisplay.y) * containerDisplay.ratio -
              position.y,
            2
          ),
        0.5
      ) /
        scale.reference) *
      scale.previous;
    const nextScaleX =
      (((clientX - containerDisplay.x) * containerDisplay.ratio - position.x) /
        scaleX.reference) *
      scaleX.previous;
    const nextScaleY =
      (((clientY - containerDisplay.y) * containerDisplay.ratio - position.y) /
        scaleY.reference) *
      scaleY.previous;

    if (freeAspect) {
      return {
        ...state,
        scale: {
          ...state.scale,
          current: nextScale,
        },
        scaleX: {
          ...state.scaleX,
          current: nextScaleX,
        },
        scaleY: {
          ...state.scaleY,
          current: nextScaleY,
        },
      };
    }

    if (
      width * nextScale >= 100 &&
      !(
        (clientX - containerDisplay.x) * containerDisplay.ratio < position.x ||
        (clientY - containerDisplay.y) * containerDisplay.ratio < position.y
      )
    ) {
      return {
        ...state,
        scale: {
          ...state.scale,
          current: nextScale,
        },
      };
    }

    return state;
  }

  return state;
};

const complete = (state: CropperState) => ({
  ...state,
  isDragging: false,
  isTransforming: false,
  isRotating: false,
});

const setContainerDisplaySize = (
  state: CropperState,
  { x, y, width }: ReturnType<typeof actions.setContainerDisplaySize>["payload"]
) => ({
  ...state,
  containerDisplay: {
    x,
    y,
    ratio: state.image.width / width,
  },
});

const setAspectRatio = (
  state: CropperState,
  {
    widthRatio,
    heightRatio,
  }: ReturnType<typeof actions.setAspectRatio>["payload"]
) => {
  const { freeAspect, width, height, scale, scaleX, scaleY } = state;
  const currentWidth = width * (freeAspect ? scaleX.current : scale.current);
  const currentHeight = height * (freeAspect ? scaleY.current : scale.current);
  const nextWidth =
    ((currentWidth + currentHeight) / (widthRatio + heightRatio)) * widthRatio;
  const nextHeight =
    ((currentWidth + currentHeight) / (widthRatio + heightRatio)) * heightRatio;
  const differenceWidth =
    width * (freeAspect ? scaleX : scale).current - nextWidth;
  const differenceHeight =
    height * (freeAspect ? scaleY : scale).current - nextHeight;

  return {
    ...state,
    width: nextWidth,
    height: nextHeight,
    scale: {
      ...state.scale,
      current: 1,
    },
    scaleX: {
      ...state.scaleX,
      current: 1,
    },
    scaleY: {
      ...state.scaleY,
      current: 1,
    },
    position: {
      ...state.position,
      x: state.position.x + differenceWidth / 2,
      y: state.position.y + differenceHeight / 2,
    },
  };
};

const changeFreeAspect = (state: CropperState) => {
  const { freeAspect, scale, scaleX, scaleY } = state;
  const nextScale = (scaleX.current < scaleY.current ? scaleX : scaleY).current;

  return {
    ...state,
    freeAspect: !freeAspect,
    scale: {
      ...state.scale,
      current: !freeAspect ? nextScale : scale.current,
    },
    scaleX: {
      ...state.scaleX,
      current: (freeAspect ? scale : scaleX).current,
    },
    scaleY: {
      ...state.scaleY,
      current: (freeAspect ? scale : scaleY).current,
    },
  };
};

// Main

export default (state = initialState, action: actions.Actions) => {
  switch (action.type) {
    case START_CROPPER_MOVING:
      return startCropperMoving(state, action.payload);

    case START_CROPPER_TRANSFORMING:
      return startCropperTransforming(state, action.payload);

    case START_IMAGE_TRANSFORMING:
      return startImageTransforming(state, action.payload);

    case COMPLETE:
      return complete(state);

    case CHANGE_FREE_ASPECT:
      return changeFreeAspect(state);

    case SET_ASPECT_RATIO:
      return setAspectRatio(state, action.payload);

    case SET_CONTAINER_DISPLAY_SIZE:
      return setContainerDisplaySize(state, action.payload);

    case TICK:
      return tick(state, action.payload);

    default:
      return state;
  }
};

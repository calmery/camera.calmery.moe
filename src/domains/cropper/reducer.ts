import * as actions from "./actions";

const {
  SET_IMAGE,
  CHANGE_FREE_ASPECT,
  SET_ASPECT_RATIO,
  SET_CONTAINER_ACTUAL_SIZE,
  START_CROPPER_MOVING,
  COMPLETE,
  START_CROPPER_TRANSFORMING,
  START_IMAGE_TRANSFORMING,
  TICK,
} = actions;

// Constants

const CROPPER_DEFAULT_WIDTH = 320;
const CROPPER_DEFAULT_HEIGHT = 180;

// Types

type CropperContainerState = {
  actualX: number;
  actualY: number;
  displayRatio: number;
};

type CropperCropperState = {
  freeAspect: boolean;
  isCropperMoving: boolean;
  isCropperTransforming: boolean;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
    referenceX: number;
    referenceY: number;
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

type CropperImageState = {
  url: string;
  width: number;
  height: number;
  isImageTransforming: boolean;
  position: {
    x: number;
    y: number;
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
};

export type CropperState = {
  container: CropperContainerState;
  cropper: CropperCropperState;
  image: CropperImageState;
};

const initialCropperState: CropperCropperState = {
  isCropperMoving: false,
  isCropperTransforming: false,
  freeAspect: true,
  width: CROPPER_DEFAULT_WIDTH,
  height: CROPPER_DEFAULT_HEIGHT,
  position: {
    x: 0,
    y: 0,
    referenceX: 0,
    referenceY: 0,
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

const initialState: CropperState = {
  container: {
    actualX: 0,
    actualY: 0,
    displayRatio: 0,
  },
  cropper: initialCropperState,
  image: {
    isImageTransforming: false,
    url: "images/background.jpg",
    width: 1500,
    height: 1065,
    position: {
      x: 0,
      y: 0,
    },
    scale: {
      current: 1,
      previous: 1,
      reference: 0,
    },
    rotate: {
      current: 0,
      previous: 0,
      reference: 0,
    },
  },
};

// Events

const setImage = (
  state: CropperState,
  { url, width, height }: ReturnType<typeof actions.setImage>["payload"]
) => ({
  ...state,
  cropper: initialCropperState,
  image: {
    url,
    width,
    height,
    isImageTransforming: false,
    position: {
      x: 0,
      y: 0,
    },
    scale: {
      current: 1,
      previous: 1,
      reference: 0,
    },
    rotate: {
      current: 0,
      previous: 0,
      reference: 0,
    },
  },
});

const startCropperMoving = (
  state: CropperState,
  positions: ReturnType<typeof actions.startCropperMoving>["payload"]
) => {
  const {
    container,
    cropper: { position },
  } = state;

  const referenceX =
    (positions[0].clientX - container.actualX) * container.displayRatio -
    position.x;
  const referenceY =
    (positions[0].clientY - container.actualY) * container.displayRatio -
    position.y;

  return {
    ...state,
    cropper: {
      ...state.cropper,
      isCropperMoving: true,
      position: {
        ...state.cropper.position,
        referenceX,
        referenceY,
      },
    },
  };
};

const startCropperTransforming = (
  state: CropperState,
  positions: ReturnType<typeof actions.startCropperTransforming>["payload"]
) => {
  const {
    container,
    cropper: { position },
  } = state;

  const scale = Math.pow(
    Math.pow(
      (positions[0].clientX - container.actualX) * container.displayRatio -
        position.x,
      2
    ) +
      Math.pow(
        (positions[0].clientY - container.actualY) * container.displayRatio -
          position.y,
        2
      ),
    0.5
  );
  const scaleX =
    (positions[0].clientX - container.actualX) * container.displayRatio -
    position.x;
  const scaleY =
    (positions[0].clientY - container.actualY) * container.displayRatio -
    position.y;

  return {
    ...state,
    cropper: {
      ...state.cropper,
      isCropperTransforming: true,
      scale: {
        ...state.cropper.scale,
        previous: state.cropper.scale.current,
        reference: scale,
      },
      scaleX: {
        ...state.cropper.scaleX,
        previous: state.cropper.scaleX.current,
        reference: scaleX,
      },
      scaleY: {
        ...state.cropper.scaleY,
        previous: state.cropper.scaleY.current,
        reference: scaleY,
      },
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
      image: {
        ...state.image,
        isImageTransforming: true,
        scale: {
          ...state.image.scale,
          previous: state.image.scale.current,
          reference: distanceBetweenFingers,
        },
        rotate: {
          ...state.image.rotate,
          previous: state.image.rotate.current,
          reference: angleBetweenFingers,
        },
      },
    };
  }

  return state;
};

// Tick

const transformImage = (
  state: CropperState,
  positions: { clientX: number; clientY: number }[]
) => {
  const { image } = state;
  const { rotate } = image;

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
    image.position.x +
    (image.width * image.scale.current - image.width * nextScale) / 2;
  const nextY =
    image.position.y +
    (image.height * image.scale.current - image.height * nextScale) / 2;

  return {
    ...state,
    image: {
      ...state.image,
      position: {
        x: nextX,
        y: nextY,
      },
      scale: {
        ...state.image.scale,
        current: nextScale,
      },
      rotate: {
        ...state.image.rotate,
        current: nextAngle,
      },
    },
  };
};

const moveCropper = (state: CropperState, cursorX: number, cursorY: number) => {
  const { container, cropper } = state;

  const relativeX = (cursorX - container.actualX) * container.displayRatio;
  const relativeY = (cursorY - container.actualY) * container.displayRatio;

  const nextX = relativeX - cropper.position.referenceX;
  const nextY = relativeY - cropper.position.referenceY;

  return {
    ...state,
    cropper: {
      ...state.cropper,
      position: {
        ...state.cropper.position,
        x: nextX,
        y: nextY,
      },
    },
  };
};

const transformCropper = (
  state: CropperState,
  positions: { clientX: number; clientY: number }[]
) => {
  const { cropper, container } = state;
  const [{ clientX, clientY }] = positions;

  if (cropper.freeAspect) {
    let nextScaleX =
      (((clientX - container.actualX) * container.displayRatio -
        cropper.position.x) /
        cropper.scaleX.reference) *
      cropper.scaleX.previous;
    let nextScaleY =
      (((clientY - container.actualY) * container.displayRatio -
        cropper.position.y) /
        cropper.scaleY.reference) *
      cropper.scaleY.previous;

    if (cropper.width * nextScaleX < CROPPER_DEFAULT_WIDTH) {
      nextScaleX = cropper.scaleX.current;
    }

    if (cropper.height * nextScaleY < CROPPER_DEFAULT_HEIGHT) {
      nextScaleY = cropper.scaleY.current;
    }

    return {
      ...state,
      cropper: {
        ...state.cropper,
        scaleX: {
          ...state.cropper.scaleX,
          current: nextScaleX,
        },
        scaleY: {
          ...state.cropper.scaleY,
          current: nextScaleY,
        },
      },
    };
  }

  const nextScale =
    (Math.pow(
      Math.pow(
        (clientX - container.actualX) * container.displayRatio -
          cropper.position.x,
        2
      ) +
        Math.pow(
          (clientY - container.actualY) * container.displayRatio -
            cropper.position.y,
          2
        ),
      0.5
    ) /
      cropper.scale.reference) *
    cropper.scale.previous;

  if (
    cropper.width * nextScale >= CROPPER_DEFAULT_WIDTH &&
    !(
      (clientX - container.actualX) * container.displayRatio <
        cropper.position.x ||
      (clientY - container.actualY) * container.displayRatio <
        cropper.position.y
    )
  ) {
    return {
      ...state,
      cropper: {
        ...state.cropper,
        scale: {
          ...state.cropper.scale,
          current: nextScale,
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
  const { cropper, image } = state;
  const { isCropperTransforming, isCropperMoving } = cropper;
  const { isImageTransforming } = image;

  if (isImageTransforming && positions.length > 1) {
    return transformImage(state, positions);
  }

  if (isCropperMoving) {
    const [{ clientX, clientY }] = positions;
    return moveCropper(state, clientX, clientY);
  }

  if (isCropperTransforming) {
    return transformCropper(state, positions);
  }

  return state;
};

const complete = (state: CropperState) => ({
  ...state,
  cropper: {
    ...state.cropper,
    isCropperMoving: false,
    isCropperTransforming: false,
  },
  image: {
    ...state.image,
    isImageTransforming: false,
  },
});

const setContainerActualSize = (
  state: CropperState,
  { x, y, width }: ReturnType<typeof actions.setContainerActualSize>["payload"]
): CropperState => ({
  ...state,
  container: {
    actualX: x,
    actualY: y,
    displayRatio: state.image.width / width,
  },
});

const setAspectRatio = (
  state: CropperState,
  {
    widthRatio,
    heightRatio,
  }: ReturnType<typeof actions.setAspectRatio>["payload"]
) => {
  const { cropper } = state;
  const { scale, scaleX, scaleY, freeAspect } = cropper;
  const currentWidth =
    cropper.width * (freeAspect ? scaleX.current : scale.current);
  const currentHeight =
    cropper.height * (freeAspect ? scaleY.current : scale.current);
  const nextWidth =
    ((currentWidth + currentHeight) / (widthRatio + heightRatio)) * widthRatio;
  const nextHeight =
    ((currentWidth + currentHeight) / (widthRatio + heightRatio)) * heightRatio;
  const differenceWidth =
    cropper.width * (freeAspect ? scaleX : scale).current - nextWidth;
  const differenceHeight =
    cropper.height * (freeAspect ? scaleY : scale).current - nextHeight;

  return {
    ...state,
    cropper: {
      ...state.cropper,
      width: nextWidth,
      height: nextHeight,
      position: {
        ...state.cropper.position,
        x: state.cropper.position.x + differenceWidth / 2,
        y: state.cropper.position.y + differenceHeight / 2,
      },
      scale: {
        ...state.cropper.scale,
        current: 1,
      },
      scaleX: {
        ...state.cropper.scaleX,
        current: 1,
      },
      scaleY: {
        ...state.cropper.scaleY,
        current: 1,
      },
    },
  };
};

const changeFreeAspect = (state: CropperState) => {
  const { scale, scaleX, scaleY, freeAspect } = state.cropper;
  const nextScale = (scaleX.current < scaleY.current ? scaleX : scaleY).current;

  return {
    ...state,
    cropper: {
      ...state.cropper,
      freeAspect: !freeAspect,
      scale: {
        ...state.cropper.scale,
        current: !freeAspect ? nextScale : scale.current,
      },
      scaleX: {
        ...state.cropper.scaleX,
        current: (freeAspect ? scale : scaleX).current,
      },
      scaleY: {
        ...state.cropper.scaleY,
        current: (freeAspect ? scale : scaleY).current,
      },
    },
  };
};

// Main

export default (state = initialState, action: actions.Actions) => {
  switch (action.type) {
    case SET_IMAGE:
      return setImage(state, action.payload);

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

    case SET_CONTAINER_ACTUAL_SIZE:
      return setContainerActualSize(state, action.payload);

    case TICK:
      return tick(state, action.payload);

    default:
      return state;
  }
};

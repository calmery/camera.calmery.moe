import {
  CHANGE_FREE_ASPECT,
  Actions,
  SET_ASPECT_RATIO,
  SET_CONTAINER_DISPLAY_SIZE,
  START_DRAG,
  RESET_FLAGS,
  START_TRANSFORM,
  SET_POSITION,
  SET_SCALE,
} from "./actions";

const getCurrentSize = (state: CropperState) => {
  const { freeAspect, scale, scaleX, scaleY, width, height } = state;

  return {
    currentWidth: width * (freeAspect ? scaleX.current : scale.current),
    currentHeight: height * (freeAspect ? scaleY.current : scale.current),
  };
};

// const calculateSvgRelativeCoordinates = (state: CropperState, x: number, y: number) => {
//   // `event.clientX`、`event.clientY` から SVG 画像内の相対位置を取得する
//   return {
//     x: (x - state.containerDisplay.x) * state.containerDisplay.ratio,
//     y: (y - state.containerDisplay.y) * state.containerDisplay.ratio
//   };
// }

export type CropperState = {
  freeAspect: boolean;
  width: number;
  height: number;
  isDragging: boolean;
  isTransforming: boolean;
  image: {
    url: string;
    width: number;
    height: number;
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
  containerDisplay: {
    x: 0,
    y: 0,
    ratio: 0,
  },
  image: {
    url: "images/background.jpg",
    width: 1500,
    height: 1065,
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

export default (state = initialState, action: Actions) => {
  switch (action.type) {
    case SET_SCALE: {
      return {
        ...state,
        scale: {
          ...state.scale,
          current: action.payload.nextScale,
        },
        scaleX: {
          ...state.scaleX,
          current: action.payload.nextScaleX,
        },
        scaleY: {
          ...state.scaleY,
          current: action.payload.nextScaleY,
        },
      };
    }

    case START_TRANSFORM: {
      return {
        ...state,
        isTransforming: true,
        scale: {
          ...state.scale,
          previous: state.scale.current,
          reference: action.payload.referenceScale,
        },
        scaleX: {
          ...state.scaleX,
          previous: state.scaleX.current,
          reference: action.payload.referenceXScale,
        },
        scaleY: {
          ...state.scaleY,
          previous: state.scaleY.current,
          reference: action.payload.referenceYScale,
        },
      };
    }

    case CHANGE_FREE_ASPECT: {
      console.log("CHANGE_FREE_ASPECT");
      const { freeAspect } = state;

      if (freeAspect) {
        return {
          ...state,
          freeAspect: false,
          scale: {
            ...state.scale,
            current:
              state.scaleX.current < state.scaleY.current
                ? state.scaleX.current
                : state.scaleY.current,
          },
        };
      } else {
        return {
          ...state,
          freeAspect: true,
          scaleX: {
            ...state.scaleX,
            current: state.scale.current,
          },
          scaleY: {
            ...state.scaleY,
            current: state.scale.current,
          },
        };
      }
    }

    case SET_ASPECT_RATIO: {
      const { width, height } = state;
      const { widthRatio, heightRatio } = action.payload;
      const { currentWidth, currentHeight } = getCurrentSize(state);

      const sumRatio = widthRatio + heightRatio;
      const areaLength = currentWidth + currentHeight;
      const nextWidth = (areaLength / sumRatio) * widthRatio;
      const nextHeight = (areaLength / sumRatio) * heightRatio;
      const differenceWidth = width - nextWidth;
      const differenceHeight = height - nextHeight;

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
    }

    case SET_CONTAINER_DISPLAY_SIZE: {
      return {
        ...state,
        containerDisplay: {
          x: action.payload.x,
          y: action.payload.y,
          ratio: state.image.width / action.payload.width,
        },
      };
    }

    case START_DRAG: {
      const { referenceX, referenceY } = action.payload;

      return {
        ...state,
        isDragging: true,
        position: {
          ...state.position,
          referenceX,
          referenceY,
        },
      };
    }

    case RESET_FLAGS: {
      return {
        ...state,
        isDragging: false,
        isTransforming: false,
      };
    }

    case SET_POSITION: {
      return {
        ...state,
        position: {
          ...state.position,
          ...action.payload,
        },
      };
    }

    default:
      return state;
  }
};

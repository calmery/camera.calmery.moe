import { CHANGE_FREE_ASPECT, Actions, SET_ASPECT_RATIO } from "./actions";

const getCurrentSize = (state: CropperState) => {
  const { freeAspect, scale, scaleX, scaleY, width, height } = state;

  return {
    currentWidth: width * (freeAspect ? scaleX.current : scale.current),
    currentHeight: height * (freeAspect ? scaleY.current : scale.current),
  };
};

export type CropperState = {
  freeAspect: boolean;
  width: number;
  height: number;
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
  position: {
    x: 0,
    y: 0,
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
    case CHANGE_FREE_ASPECT: {
      const { freeAspect } = state;

      return {
        ...state,
        freeAspect: !freeAspect,
      };
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
          x: state.position.x + differenceWidth / 2,
          y: state.position.y + differenceHeight / 2,
        },
      };
    }

    default:
      return state;
  }
};

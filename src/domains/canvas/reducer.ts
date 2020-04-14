import * as uuid from "uuid";
import { Actions, ADD_USER_IMAGE, REMOVE_USER_IMAGE } from "./actions";
import { CanvasUserFrame } from "~/types/CanvasUserFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";

export type CanvasState = {
  width: number;
  height: number;
  frames: {
    users: CanvasUserFrame[];
  };
  layers: {
    users: (CanvasUserLayer | null)[];
  };
};

const initialState: CanvasState = {
  width: 900,
  height: 1200,
  frames: {
    users: [
      {
        id: uuid.v4(),
        width: 852,
        height: 612,
        x: 24,
        y: 24,
        clipPath: {
          d: "M0 0H852V519.623L0 612V0Z",
        },
      },
      {
        id: uuid.v4(),
        width: 852,
        height: 612,
        x: 24,
        y: 564,
        clipPath: {
          d: "M0 96L852 0V612H0V96Z",
        },
      },
    ],
  },
  layers: {
    users: [],
  },
};

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    case ADD_USER_IMAGE: {
      const userFrames = state.frames.users;
      const userLayers = state.layers.users;
      const nextUserLayers = [];

      userFrames.forEach((_, i) => (nextUserLayers[i] = userLayers[i] || null));
      nextUserLayers[action.payload.index] = action.payload;

      return {
        ...state,
        layers: {
          ...state.layers,
          users: nextUserLayers,
        },
      };
    }

    case REMOVE_USER_IMAGE: {
      const userLayers = state.layers.users;

      return {
        ...state,
        layers: {
          ...state.layers,
          users: userLayers.map((userLayer, i) =>
            i === action.payload.index ? null : userLayer
          ),
        },
      };
    }

    default:
      return state;
  }
};

import * as uuid from "uuid";
import { Actions, ADD_USER_IMAGE, REMOVE_USER_IMAGE } from "./actions";

export type CanvasUserLayer = {
  dataUrl: string;
  width: number;
  height: number;
};

export type CanvasUserClipPath = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  d: string;
};

export type CanvasState = {
  width: number;
  height: number;
  layers: {
    users: (CanvasUserLayer | null)[];
  };
  clipPaths: {
    users: CanvasUserClipPath[];
  };
};

const initialState: CanvasState = {
  width: 900,
  height: 1200,
  layers: {
    users: [],
  },
  clipPaths: {
    users: [
      {
        id: uuid.v4(),
        width: 852,
        height: 612,
        x: 24,
        y: 24,
        d: "M0 0H852V519.623L0 612V0Z",
      },
      {
        id: uuid.v4(),
        width: 852,
        height: 612,
        x: 24,
        y: 564,
        d: "M0 96L852 0V612H0V96Z",
      },
    ],
  },
};

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    case ADD_USER_IMAGE: {
      const { layers } = state;
      const users = [];

      for (let i = 0; i < state.clipPaths.users.length; i++) {
        users[i] = state.layers.users[i] || null;
      }

      users[action.payload.index] = action.payload;

      return {
        ...state,
        layers: {
          ...layers,
          users,
        },
      };
    }

    case REMOVE_USER_IMAGE: {
      const { layers } = state;

      return {
        ...state,
        layers: {
          ...layers,
          users: layers.users.map((layer, i) => {
            if (i === action.payload.index) {
              return null;
            }

            return layer;
          }),
        },
      };
    }

    default:
      return state;
  }
};

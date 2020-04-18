import * as uuid from "uuid";
import {
  Actions,
  ADD_USER_IMAGE,
  REMOVE_USER_IMAGE,
  RESET_ALL_FLAGS,
  UPDATE_DISPLAY_RATIO,
  SET_CANVAS_USER_LAYER_STARTING_POSITION,
  UPDATE_CANVAS_LAYER_POSITION,
  CHANGE_USER_LAYER_FILTER_VALUE,
  ADD_STICKER_LAYER,
} from "./actions";
import { CanvasUserFrame } from "~/types/CanvasUserFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";
import { CanvasStickerLayer } from "~/types/CanvasStickerLayer";

export type CanvasState = {
  width: number;
  height: number;
  frames: {
    users: CanvasUserFrame[];
  };
  layers: {
    users: (CanvasUserLayer | null)[];
    stickers: CanvasStickerLayer[];
  };
  displayRatio: number;
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
    stickers: [],
  },
  displayRatio: 1,
};

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    case ADD_STICKER_LAYER: {
      const { dataUrl, width, height } = action.payload;
      const { layers } = state;

      return {
        ...state,
        layers: {
          ...layers,
          stickers: [
            ...layers.stickers,
            {
              dataUrl,
              width,
              height,
              x: 0,
              y: 0,
              isDragging: false,
              isTransforming: false,
              isMultiTouching: false,
              referenceX: 0,
              referenceY: 0,
              scale: {
                current: 1,
                previous: 1,
                reference: 0,
              },
              rotate: {
                current: 1,
                previous: 1,
                reference: 0,
              },
            },
          ],
        },
      };
    }

    case ADD_USER_IMAGE: {
      const userFrames = state.frames.users;
      const userLayers = state.layers.users;
      const nextUserLayers = [];

      userFrames.forEach((_, i) => (nextUserLayers[i] = userLayers[i] || null));
      nextUserLayers[action.payload.index] = {
        ...action.payload,
        x: 0,
        y: 0,
        isDragging: false,
        differenceFromStartingX: 0,
        differenceFromStartingY: 0,
        filter: {
          blur: 0,
          hueRotate: 0,
          luminanceToAlpha: false,
          saturate: 1,
        },
      };

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

    case UPDATE_DISPLAY_RATIO: {
      const { width } = state;

      return {
        ...state,
        displayRatio: width / action.payload.displayWidth,
      };
    }

    case UPDATE_CANVAS_LAYER_POSITION: {
      const { users } = state.layers;
      const user = users[action.payload.index];

      if (user === null) {
        return state;
      }

      users[action.payload.index] = {
        ...user,
        x: action.payload.nextX,
        y: action.payload.nextY,
      };

      return {
        ...state,
        layers: {
          ...state.layers,
          users,
        },
      };
    }

    case SET_CANVAS_USER_LAYER_STARTING_POSITION: {
      const { users } = state.layers;
      const user = users[action.payload.index];

      if (user === null) {
        return state;
      }

      users[action.payload.index] = {
        ...user,
        differenceFromStartingX: action.payload.differenceFromStartingX,
        differenceFromStartingY: action.payload.differenceFromStartingY,
        isDragging: true,
      };

      return {
        ...state,
        layers: {
          ...state.layers,
          users,
        },
      };
    }

    case RESET_ALL_FLAGS: {
      const { users } = state.layers;
      const nextUsers = users.map((user) => {
        if (!user) {
          return user;
        }

        user.isDragging = false;

        return user;
      });

      return {
        ...state,
        layers: {
          ...state.layers,
          users: nextUsers,
        },
      };
    }

    case CHANGE_USER_LAYER_FILTER_VALUE: {
      const { layers } = state;
      const userLayer = layers.users[action.payload.index];

      if (userLayer) {
        layers.users[action.payload.index] = {
          ...userLayer,
          filter: {
            ...userLayer.filter,
            [action.payload.type]: action.payload.value,
          },
        };
      }

      return {
        ...state,
        layers,
      };
    }

    default:
      return state;
  }
};

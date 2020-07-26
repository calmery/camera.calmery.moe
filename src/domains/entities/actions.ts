import * as types from "./types";

const addEntity = () => ({
  type: types.ENTITIES_ADD,
});

const removeEntity = () => ({
  type: types.ENTITIES_REMOVE,
});

export const actions = {
  addEntity,
  removeEntity,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

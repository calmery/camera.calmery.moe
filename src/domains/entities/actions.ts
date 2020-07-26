import * as types from "./types";
import { EntitiesState } from "./reducer";

const addEntity = () => ({
  type: types.ENTITIES_ADD,
});

const removeEntity = () => ({
  type: types.ENTITIES_REMOVE,
});

const restoreEntities = (payload: EntitiesState) => ({
  type: types.ENTITIES_RESTORE,
  payload,
});

export const actions = {
  addEntity,
  removeEntity,
  restoreEntities,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;

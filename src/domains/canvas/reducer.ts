import { combineReducers } from "redux";
import container, { CanvasContainerState } from "./container/reducer";
import stickers, { CanvasStickersState } from "./stickers/reducer";
import users, { CanvasUsersState } from "./users/reducer";

export type CanvasState = {
  container: CanvasContainerState;
  stickers: CanvasStickersState;
  users: CanvasUsersState;
};

export default combineReducers({
  container,
  stickers,
  users,
});

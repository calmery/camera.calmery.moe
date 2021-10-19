import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from "react-redux";
import { State, store } from "./store.ts";

export const useDispatch = () => _useDispatch<typeof store.dispatch>();
export const useSelector: TypedUseSelectorHook<State> = _useSelector;

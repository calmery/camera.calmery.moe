import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from "react-redux";

//

import { reducer as example } from "./example/reducers.ts";

// Store

export const store = configureStore({
  reducer: combineReducers({
    example,
  }),
});

// Types

export type State = ReturnType<typeof store.getState>;

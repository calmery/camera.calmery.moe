import { INCREMENT, DECREMENT, Actions } from "./actions";

export type CounterState = {
  count: number;
};

const initialState: CounterState = {
  count: 0
};

export default (state = initialState, action: Actions) => {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + action.payload.count };
    case DECREMENT:
      return { count: state.count - 1 };
    default:
      return state;
  }
};

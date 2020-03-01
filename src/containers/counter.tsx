import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "~/modules";
import * as actions from "~/modules/counter/actions";

const Counter = () => {
  const dispatch = useDispatch();
  const counter = useSelector(({ counter }: State) => counter);
  const increment = useCallback(() => dispatch(actions.increment(1)), []);
  const decrement = useCallback(() => dispatch(actions.decrement()), []);

  return (
    <>
      <div>{counter.count}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </>
  );
};

export default Counter;

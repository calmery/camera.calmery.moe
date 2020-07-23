import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions } from "~/domains/canvas/actions";

export const CanvasRestore = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const canvas = localStorage.getItem("canvas");

    if (canvas) {
      dispatch(actions.canvasRestore(JSON.parse(canvas)));
    }
  }, []);

  return null;
};

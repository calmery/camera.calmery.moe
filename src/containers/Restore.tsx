import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions } from "~/domains/entities/actions";
import { actions as canvasActions } from "~/domains/canvas/actions";

export const Restore = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const entities = localStorage.getItem("entities");

    if (entities) {
      dispatch(actions.restoreEntities(JSON.parse(entities)));
    }

    const canvas = localStorage.getItem("canvas");

    if (canvas) {
      dispatch(canvasActions.canvasRestore(JSON.parse(canvas)));
    }
  }, []);

  return null;
};

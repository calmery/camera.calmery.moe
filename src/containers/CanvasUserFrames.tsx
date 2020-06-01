import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";

export const CanvasUserFrames: React.FC = () => {
  const canvas = useSelector(({ canvas }: State) => canvas);

  return <defs></defs>;
};

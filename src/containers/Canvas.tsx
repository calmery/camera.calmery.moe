import React from "react";
import { CanvasFilters } from "~/containers/CanvasFilters";
import { CanvasLayers } from "~/containers/CanvasLayers";
import { useSelector } from "react-redux";
import { State } from "~/modules";

export const Canvas = () => {
  const { width, height } = useSelector(({ canvas }: State) => canvas);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      version="1.1"
      baseProfile="full"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <CanvasFilters />
      <CanvasLayers />
    </svg>
  );
};

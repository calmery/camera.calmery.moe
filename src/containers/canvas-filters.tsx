import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/modules";
import { CanvasFilter } from "~/components/canvas-filter";

const CanvasFilters = () => {
  const { userLayers } = useSelector(({ canvas }: State) => canvas);

  return (
    <defs>
      {userLayers.map((userLayer, index) => (
        <CanvasFilter {...userLayer} key={index} />
      ))}
    </defs>
  );
};

export default CanvasFilters;

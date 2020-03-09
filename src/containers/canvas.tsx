import React from "react";
import CanvasFilters from "~/containers/canvas-filters";
import CanvasLayers from "~/containers/canvas-layers";

const Canvas = () => (
  <svg
    viewBox="0 0 2000 1420"
    version="1.1"
    baseProfile="full"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <CanvasFilters />
    <CanvasLayers />
  </svg>
);

export default Canvas;

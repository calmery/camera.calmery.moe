import React from "react";
import { CanvasLayer } from "~/types/CanvasLayer";

export const CanvasEssentialLayers = ({
  essentialLayers
}: {
  essentialLayers: CanvasLayer[];
}) => {
  return (
    <>
      {essentialLayers.map(({ base64, width, height, x, y }, index) => (
        <image
          xlinkHref={base64}
          width={width}
          height={height}
          transform={`translate(${x}, ${y})`}
          key={index}
        />
      ))}
    </>
  );
};

import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";

export const CanvasEssentialLayers: React.FC = () => {
  const canvas = useSelector(({ canvas }: State) => canvas);
  const { essentialLayers, viewBoxWidth, viewBoxHeight } = canvas;

  return (
    <>
      {essentialLayers.map((essentialLayer, i: number) => {
        const { width, height, dataUrl } = essentialLayer;
        const w = viewBoxWidth / 3;
        const h = height * (w / width);

        return (
          <image
            key={i}
            width={w}
            height={h}
            x={viewBoxWidth - w}
            y={viewBoxHeight - h}
            xlinkHref={dataUrl}
          />
        );
      })}
    </>
  );
};

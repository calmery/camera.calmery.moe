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
        let w = viewBoxWidth / 3;
        let h = height * (w / width);

        // ToDo: サイズ考えた方が良さそう
        if (w < 200) {
          w = 200;
          h = height * (w / width);
        }

        if (viewBoxWidth < w) {
          w = viewBoxWidth;
          h = height * (w / width);
        }

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

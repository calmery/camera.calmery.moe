import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";

// Constants

const MINIMUM_ESSENTIAL_LAYER_WIDTH = 300;

// Components

export const CanvasEssentialLayers: React.FC = () => {
  const { essentialLayers, viewBoxWidth, viewBoxHeight } = useSelector(
    ({ canvas }: State) => canvas
  );

  return (
    <>
      {essentialLayers.map(({ width, height, dataUrl }, i) => {
        let w = viewBoxWidth / 3;
        let h = height * (w / width);

        if (w < MINIMUM_ESSENTIAL_LAYER_WIDTH) {
          w = MINIMUM_ESSENTIAL_LAYER_WIDTH;
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

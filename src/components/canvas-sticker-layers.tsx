import React from "react";
import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasLayerTransformable } from "~/types/CanvasLayerTransformable";

export const CanvasStickerLayers = ({
  stickerLayers
}: {
  stickerLayers: (CanvasLayer & CanvasLayerTransformable)[];
}) => (
  <>
    {stickerLayers.map(({ base64, width, height, x, y, transform }, index) => {
      const { scale, flip, rotate } = transform;

      return (
        <image
          xlinkHref={base64}
          width={width}
          height={height}
          transform={`translate(${x}, ${y}) scale(${scale *
            (flip ? -1 : 1)}, ${scale}) rotate(${rotate} ${width / 2} ${height /
            2})`}
          key={index}
        />
      );
    })}
  </>
);

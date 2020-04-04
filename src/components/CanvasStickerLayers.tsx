import React from "react";
import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasLayerTransformable } from "~/types/CanvasLayerTransformable";

export const CanvasStickerLayers = ({
  stickerLayers,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
}: {
  stickerLayers: (CanvasLayer & CanvasLayerTransformable)[];
  onMouseDown: (
    event: React.MouseEvent<SVGImageElement, MouseEvent>,
    index: number
  ) => void;
  onMouseUp: (
    event: React.MouseEvent<SVGImageElement, MouseEvent>,
    index: number
  ) => void;
  onTouchStart: (
    event: React.TouchEvent<SVGImageElement>,
    index: number
  ) => void;
  onTouchEnd: (event: React.TouchEvent<SVGImageElement>, index: number) => void;
}) => (
  <>
    {stickerLayers.map(({ base64, width, height, x, y, transform }, index) => {
      const { scale, flip, rotate } = transform;

      return (
        <image
          xlinkHref={base64}
          width={width}
          height={height}
          transform={`translate(${x}, ${y}) scale(${
            scale * (flip ? -1 : 1)
          }, ${scale}) rotate(${rotate} ${width / 2} ${height / 2})`}
          key={index}
          onMouseDown={(e) => onMouseDown(e, index)}
          onMouseUp={(e) => onMouseUp(e, index)}
          onTouchStart={(e) => onTouchStart(e, index)}
          onTouchEnd={(e) => onTouchEnd(e, index)}
        />
      );
    })}
  </>
);

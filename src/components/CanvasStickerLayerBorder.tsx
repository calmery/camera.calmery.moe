import React from "react";
import { CanvasLayer } from "~/types/CanvasLayer";

interface CanvasStickerLayerBorderProps {
  stickerLayer: CanvasLayer;
  displayMagnification: number;
  backgroundBrightness: number;
  baseX: number;
  baseY: number;
}

export const CanvasStickerLayerBorder: React.FC<CanvasStickerLayerBorderProps> = ({
  stickerLayer,
  backgroundBrightness,
  displayMagnification,
  baseX,
  baseY,
}) => {
  return (
    <svg
      width={stickerLayer.width * stickerLayer.scale}
      height={stickerLayer.height * stickerLayer.scale}
      x={stickerLayer.x - baseX}
      y={stickerLayer.y - baseY}
      viewBox={`0 0 ${stickerLayer.width * stickerLayer.scale} ${
        stickerLayer.height * stickerLayer.scale
      }`}
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g
        transform={`rotate(${stickerLayer.angle}, ${
          (stickerLayer.width * stickerLayer.scale) / 2
        }, ${(stickerLayer.height * stickerLayer.scale) / 2})`}
      >
        <rect
          style={{ cursor: "move" }}
          fillOpacity="0"
          stroke={backgroundBrightness > 0.5 ? "#000" : "#FFF"}
          strokeWidth={2 * displayMagnification}
          strokeDasharray={`${8 * displayMagnification} ${
            8 * displayMagnification
          }`}
          width="100%"
          height="100%"
          x="0"
          y="0"
        ></rect>
      </g>
    </svg>
  );
};

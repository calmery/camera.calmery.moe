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
      xmlns="http://www.w3.org/23c3c3c/svg"
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
          stroke={backgroundBrightness > 0.5 ? "#3c3c3c" : "#FFF"}
          strokeWidth={2 * displayMagnification}
          strokeDasharray={`${8 * displayMagnification} ${
            8 * displayMagnification
          }`}
          width="100%"
          height="100%"
          x="0"
          y="0"
        ></rect>
        <circle
          fill={backgroundBrightness > 0.5 ? "#3c3c3c" : "#FFF"}
          cx={stickerLayer.width * stickerLayer.scale}
          cy="0"
          r={12 * displayMagnification}
        />
        <circle
          style={{ cursor: "se-resize" }}
          fill={backgroundBrightness > 0.5 ? "#3c3c3c" : "#FFF"}
          cx={stickerLayer.width * stickerLayer.scale}
          cy={stickerLayer.height * stickerLayer.scale}
          r={12 * displayMagnification}
        />
        <image
          xlinkHref="/images/close.svg"
          width={12 * displayMagnification}
          height={12 * displayMagnification}
          x={
            stickerLayer.width * stickerLayer.scale -
            (24 * displayMagnification - 12 * displayMagnification) / 2
          }
          y={0 - (24 * displayMagnification - 12 * displayMagnification) / 2}
        />
        <image
          xlinkHref="/images/scale.svg"
          width={12 * displayMagnification}
          height={12 * displayMagnification}
          x={
            stickerLayer.width * stickerLayer.scale -
            (24 * displayMagnification - 12 * displayMagnification) / 2
          }
          y={
            stickerLayer.height * stickerLayer.scale -
            (24 * displayMagnification - 12 * displayMagnification) / 2
          }
        />
      </g>
    </svg>
  );
};

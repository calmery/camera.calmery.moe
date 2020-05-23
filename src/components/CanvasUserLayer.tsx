import React from "react";
import { CanvasUserLayerFrame } from "~/types/CanvasUserLayerFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";

export const CanvasUserLayerComponent: React.FC<{
  id: number;
  layer: CanvasUserLayer;
  frame: CanvasUserLayerFrame;
  isCollaging: boolean;
  onStart: (event: React.MouseEvent | React.TouchEvent) => void;
}> = (props) => {
  const { id, frame, layer, onStart, isCollaging } = props;

  return (
    <svg
      x={frame.x}
      y={frame.y}
      width={frame.width}
      height={frame.height}
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ cursor: "move" }}
    >
      <defs>
        <filter
          id={`canvas-user-layer-filter-${id}`}
          colorInterpolationFilters="sRGB"
        >
          {/* Safari で stdDeviation が 0 のときに画像の色がおかしくなる。`color-interpolation-filters="sRGB"` で解決する */}
          <feGaussianBlur stdDeviation={layer.blur} />
          <feColorMatrix type="hueRotate" values={`${layer.hue}`} />
          <feColorMatrix type="saturate" values={`${layer.saturate}`} />
        </filter>
      </defs>

      <clipPath id={`canvas-user-layer-frame-${id}`}>
        <path d={frame.path} />
      </clipPath>

      <g clipPath={`url(#canvas-user-layer-frame-${id})`}>
        {/* TODO: 切り取った画像がめっちゃ小さくなることがある、1000px 以下の画像（適当に変更する）は拡大表示したい */}
        <svg
          width={layer.croppedWidth}
          height={layer.croppedHeight}
          x={isCollaging ? layer.x : 0}
          y={isCollaging ? layer.y : 0}
          viewBox={`${layer.croppedX} ${layer.croppedY} ${layer.croppedWidth} ${layer.croppedHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          {/* TODO: ヤバイですね☆ */}
          <svg
            width={layer.width * layer.croppedScale}
            height={layer.height * layer.croppedScale}
            x={layer.croppedImageX}
            y={layer.croppedImageY}
            viewBox={`0 0 ${layer.width} ${layer.height}`}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            overflow="visible"
          >
            <g
              transform={`rotate(${layer.croppedAngle}, ${layer.width / 2}, ${
                layer.height / 2
              })`}
            >
              <image
                xlinkHref={layer.dataUrl}
                filter={`url(#canvas-user-layer-filter-${id})`}
                width="100%"
                height="100%"
              />
            </g>
          </svg>
        </svg>
      </g>

      <g clipPath={`url(#canvas-user-layer-frame-${id})`}>
        <rect
          width={frame.width}
          height={frame.height}
          fillOpacity={0}
          onTouchStart={onStart}
          onMouseDown={onStart}
        />
      </g>
    </svg>
  );
};

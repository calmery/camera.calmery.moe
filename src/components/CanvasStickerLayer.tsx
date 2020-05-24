import React from "react";
import { CanvasLayer } from "~/types/CanvasLayer";

export const CanvasStickerLayer: React.FC<{
  selected: boolean;
  displayMagnification: number;
  handleOnPressTransformCircle: (
    event: React.MouseEvent | React.TouchEvent
  ) => void;
  handleOnPress: (event: React.MouseEvent | React.TouchEvent) => void;
  handleOnSelect: () => void;
  handleOnClickRemoveButton: () => void;
  sticker: CanvasLayer;
}> = (props) => {
  const {
    sticker,
    displayMagnification,
    selected,
    handleOnSelect,
    handleOnPress,
    handleOnPressTransformCircle,
    handleOnClickRemoveButton,
  } = props;

  const { dataUrl, x, y, width, height, angle, scale } = sticker;

  return (
    <svg
      width={width * scale}
      height={height * scale}
      x={x}
      y={y}
      viewBox={`0 0 ${width * scale} ${height * scale}`}
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g
        transform={`rotate(${angle}, ${(width * scale) / 2}, ${
          (height * scale) / 2
        })`}
      >
        <image
          xlinkHref={dataUrl}
          width="100%"
          height="100%"
          onClick={handleOnSelect}
        ></image>
        {selected && (
          <>
            <rect
              style={{ cursor: "move" }}
              fillOpacity="0"
              width="100%"
              height="100%"
              x="0"
              y="0"
              onMouseDown={handleOnPress}
              onTouchStart={handleOnPress}
            ></rect>
            <circle
              style={{ cursor: "pointer" }}
              fillOpacity="0"
              cx={width * scale}
              cy="0"
              r={12 * displayMagnification}
              onClick={handleOnClickRemoveButton}
            ></circle>
            <circle
              style={{ cursor: "se-resize" }}
              fillOpacity="0"
              cx={width * scale}
              cy={height * scale}
              r={12 * displayMagnification}
              onMouseDown={handleOnPressTransformCircle}
              onTouchStart={handleOnPressTransformCircle}
            ></circle>
          </>
        )}
      </g>
    </svg>
  );
};

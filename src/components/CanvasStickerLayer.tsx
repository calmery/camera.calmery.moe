import React from "react";
import { CanvasStickerLayer } from "~/types/CanvasStickerLayer";

export const CanvasStickerLayerComponent: React.FC<{
  selected: boolean;
  displayRatio: number;
  handleOnPressTransformCircle: (
    event: React.MouseEvent | React.TouchEvent
  ) => void;
  handleOnPress: (event: React.MouseEvent | React.TouchEvent) => void;
  handleOnSelect: () => void;
  handleOnClickRemoveButton: () => void;
  sticker: CanvasStickerLayer;
}> = (props) => {
  const {
    sticker,
    displayRatio,
    selected,
    handleOnSelect,
    handleOnPress,
    handleOnPressTransformCircle,
    handleOnClickRemoveButton,
  } = props;

  const { dataUrl, x, y, width, height, rotate, scale } = sticker;

  return (
    <svg
      width={width * scale.current}
      height={height * scale.current}
      x={x}
      y={y}
      viewBox={`0 0 ${width * scale.current} ${height * scale.current}`}
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g
        transform={`rotate(${rotate.current}, ${(width * scale.current) / 2}, ${
          (height * scale.current) / 2
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
              stroke="#FFF"
              strokeWidth={2 * displayRatio}
              strokeDasharray={`${8 * displayRatio} ${8 * displayRatio}`}
              width="100%"
              height="100%"
              x="0"
              y="0"
              onMouseDown={handleOnPress}
              onTouchStart={handleOnPress}
            ></rect>
            <circle
              style={{ cursor: "pointer" }}
              fill="#FFF"
              cx={width * scale.current}
              cy="0"
              r={12 * displayRatio}
              onClick={handleOnClickRemoveButton}
            ></circle>
            <circle
              style={{ cursor: "se-resize" }}
              fill="#FFF"
              cx={width * scale.current}
              cy={height * scale.current}
              r={12 * displayRatio}
              onMouseDown={handleOnPressTransformCircle}
              onTouchStart={handleOnPressTransformCircle}
            ></circle>
          </>
        )}
      </g>
    </svg>
  );
};

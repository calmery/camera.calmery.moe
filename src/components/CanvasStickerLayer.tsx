import React from "react";
import { CanvasStickerLayer } from "~/types/CanvasStickerLayer";

export const CanvasStickerLayerComponent: React.FC<
  {
    selected: boolean;
    displayRatio: number;
    startCropperTransforming: (previousLength: number) => void;
    startMultiTouchingTransform: (
      previousLength: number,
      startingAngle: number
    ) => void;
    startCropperMoving: (referenceX: number, referenceY: number) => void;
    onClick: () => void;
    canvasBaseX: number;
    canvasBaseY: number;
    onClickRemoveButton: () => void;
  } & CanvasStickerLayer
> = (props) => {
  const {
    dataUrl,
    x,
    y,
    width,
    height,
    rotate,
    scale,
    displayRatio,
    selected,
    onClick,
    onClickRemoveButton,
    canvasBaseX,
    canvasBaseY,
    startMultiTouchingTransform,
    startCropperMoving,
    startCropperTransforming,
  } = props;

  const getCharacterCenterCoordinates = () => {
    return {
      x: x + (width * scale.current) / 2,
      y: y + (height * scale.current) / 2,
    };
  };

  const calculateSvgRelativeCoordinates = (x: number, y: number) => {
    return {
      x: (x - canvasBaseX) * displayRatio,
      y: (y - canvasBaseY) * displayRatio,
    };
  };

  const onPressTransformCircle = (x: number, y: number) => {
    const { x: centerX, y: centerY } = getCharacterCenterCoordinates();
    const { x: relativeX, y: relativeY } = calculateSvgRelativeCoordinates(
      x,
      y
    );

    startCropperTransforming(
      Math.pow(
        Math.pow(relativeX - centerX, 2) + Math.pow(relativeY - centerY, 2),
        0.5
      )
    );
  };

  const handleOnTouchstartCropperTransformingCircle = (
    event: React.TouchEvent<SVGCircleElement>
  ) => {
    const { touches } = event;
    onPressTransformCircle(touches[0].clientX, touches[0].clientY);
  };

  const handleOnMouseDownTransformCircle = (
    event: React.MouseEvent<SVGCircleElement, MouseEvent>
  ) => {
    const { clientX, clientY } = event;
    onPressTransformCircle(clientX, clientY);
  };

  // Events

  const onPressRect = (positions: { x: number; y: number }[]) => {
    const isMultiTouching = positions.length > 1;

    if (isMultiTouching) {
      const [first, second] = positions;

      const previousLength = Math.pow(
        Math.pow(second.x - first.x, 2) + Math.pow(second.y - first.y, 2),
        0.5
      );
      const startingAngle =
        Math.atan2(second.y - first.y, second.x - first.x) * (180 / Math.PI);

      startMultiTouchingTransform(previousLength, startingAngle);

      return;
    }

    const [{ x, y }] = positions;
    const { x: relativeX, y: relativeY } = calculateSvgRelativeCoordinates(
      x,
      y
    );
    const referenceX = relativeX - props.x;
    const referenceY = relativeY - props.y;

    startCropperMoving(referenceX, referenceY);
  };

  const handleOnMouseDownRect = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>
  ) => {
    const { clientX, clientY } = event;
    onPressRect([{ x: clientX, y: clientY }]);
  };

  const handleOnTouchStartRect = (event: React.TouchEvent<SVGRectElement>) => {
    const { touches } = event;
    const positions = [];

    for (let i = 0; i < touches.length; i++) {
      positions.push({
        x: touches[i].clientX,
        y: touches[i].clientY,
      });
    }

    onPressRect(positions);
  };

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
          onClick={onClick}
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
              onMouseDown={handleOnMouseDownRect}
              onTouchStart={handleOnTouchStartRect}
            ></rect>
            <circle
              style={{ cursor: "pointer" }}
              fill="#FFF"
              cx={width * scale.current}
              cy="0"
              r={12 * displayRatio}
              onClick={onClickRemoveButton}
            ></circle>
            <circle
              style={{ cursor: "se-resize" }}
              fill="#FFF"
              cx={width * scale.current}
              cy={height * scale.current}
              r={12 * displayRatio}
              onMouseDown={handleOnMouseDownTransformCircle}
              onTouchStart={handleOnTouchstartCropperTransformingCircle}
            ></circle>
          </>
        )}
      </g>
    </svg>
  );
};

import React from "react";
import { CanvasStickerLayer } from "~/types/CanvasStickerLayer";

export default class CSL extends React.Component<
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
> {
  public render = () => {
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
    } = this.props;

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
          transform={`rotate(${rotate.current}, ${
            (width * scale.current) / 2
          }, ${(height * scale.current) / 2})`}
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
                onMouseDown={this.handleOnMouseDownRect}
                onTouchStart={this.handleOnTouchStartRect}
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
                onMouseDown={this.handleOnMouseDownTransformCircle}
                onTouchStart={this.handleOnTouchstartCropperTransformingCircle}
              ></circle>
            </>
          )}
        </g>
      </svg>
    );
  };

  // Helper Functions

  private getCharacterCenterCoordinates = () => {
    const layer = this.props;

    return {
      x: layer.x + (layer.width * layer.scale.current) / 2,
      y: layer.y + (layer.height * layer.scale.current) / 2,
    };
  };

  private calculateSvgRelativeCoordinates = (x: number, y: number) => {
    const { canvasBaseX, canvasBaseY, displayRatio } = this.props;

    return {
      x: (x - canvasBaseX) * displayRatio,
      y: (y - canvasBaseY) * displayRatio,
    };
  };

  // Events

  private onPressTransformCircle = (x: number, y: number) => {
    const { startCropperTransforming } = this.props;
    const { x: centerX, y: centerY } = this.getCharacterCenterCoordinates();
    const { x: relativeX, y: relativeY } = this.calculateSvgRelativeCoordinates(
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

  private handleOnTouchstartCropperTransformingCircle = (
    event: React.TouchEvent<SVGCircleElement>
  ) => {
    const { touches } = event;
    this.onPressTransformCircle(touches[0].clientX, touches[0].clientY);
  };

  private handleOnMouseDownTransformCircle = (
    event: React.MouseEvent<SVGCircleElement, MouseEvent>
  ) => {
    const { clientX, clientY } = event;
    this.onPressTransformCircle(clientX, clientY);
  };

  // Events

  private onPressRect = (positions: { x: number; y: number }[]) => {
    const layer = this.props;
    const { startMultiTouchingTransform, startCropperMoving } = this.props;
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
    const { x: relativeX, y: relativeY } = this.calculateSvgRelativeCoordinates(
      x,
      y
    );
    const referenceX = relativeX - layer.x;
    const referenceY = relativeY - layer.y;

    startCropperMoving(referenceX, referenceY);
  };

  private handleOnMouseDownRect = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>
  ) => {
    const { clientX, clientY } = event;
    this.onPressRect([{ x: clientX, y: clientY }]);
  };

  private handleOnTouchStartRect = (
    event: React.TouchEvent<SVGRectElement>
  ) => {
    const { touches } = event;
    const positions = [];

    for (let i = 0; i < touches.length; i++) {
      positions.push({
        x: touches[i].clientX,
        y: touches[i].clientY,
      });
    }

    this.onPressRect(positions);
  };
}

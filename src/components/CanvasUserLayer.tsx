import React from "react";
import { CanvasUserFrame } from "~/types/CanvasUserFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";

export default class CUL extends React.Component<{
  layer: CanvasUserLayer;
  frame: CanvasUserFrame;
  displayRatio: number;
  onStart: (
    differenceFromStartingX: number,
    differenceFromStartingY: number
  ) => void;
  onMove: (nextX: number, nextY: number) => void;
}> {
  private containerRef = React.createRef<SVGRectElement>();
  private ref = React.createRef<SVGPathElement>();

  public componentDidMount = () => {
    const s = this.containerRef.current!;

    s.addEventListener("touchstart", this.handleOnTouchStart);
    s.addEventListener("mousedown", this.handleOnMouseDown);
    s.addEventListener("mousemove", this.handleOnMouseMove);
    s.addEventListener("touchmove", this.handleOnTouchMove, { passive: false });
  };

  public componentWillUnmount = () => {
    const s = this.containerRef.current!;

    s.removeEventListener("touchstart", this.handleOnTouchStart);
    s.removeEventListener("mousedown", this.handleOnMouseDown);
    s.removeEventListener("mousemove", this.handleOnMouseMove);
    s.removeEventListener("touchmove", this.handleOnTouchMove);
  };

  public render = () => {
    const { frame } = this.props;

    return (
      <svg
        x={frame.x}
        y={frame.y}
        width={frame.width}
        height={frame.height}
        viewBox={`0 0 ${frame.width} ${frame.height}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <clipPath id={`clip-path-${frame.id}`}>
          <path d={frame.clipPath.d} ref={this.ref} />
        </clipPath>

        <g clipPath={`url(#clip-path-${frame.id})`}>{this.renderImage()}</g>

        <g clipPath={`url(#clip-path-${frame.id})`}>
          <rect
            ref={this.containerRef}
            width={frame.width}
            height={frame.height}
            fillOpacity={0}
          />
        </g>
      </svg>
    );
  };

  private renderImage = () => {
    const { layer } = this.props;

    return (
      <svg
        width={layer.width}
        height={layer.height}
        x={layer.x}
        y={layer.y}
        viewBox={`0 0 ${layer.width} ${layer.height}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        overflow="visible"
      >
        <g transform={`rotate(0, ${layer.width / 2}, ${layer.height / 2})`}>
          <image xlinkHref={layer.dataUrl} width="100%" height="100%" />
        </g>
      </svg>
    );
  };

  // Helper Functions

  private calculateupperRelativeCoordinates = (x: number, y: number) => {
    const clipPath = this.ref.current!.getBoundingClientRect();
    const { displayRatio } = this.props;

    return {
      x: (x - clipPath.x) * displayRatio,
      y: (y - clipPath.y) * displayRatio,
    };
  };

  // Events

  private handleOnMoveStart = (x: number, y: number) => {
    const { layer, onStart } = this.props;
    const { x: currentX, y: currentY } = this.calculateupperRelativeCoordinates(
      x,
      y
    );

    const differenceFromStartingX = currentX - layer.x;
    const differenceFromStartingY = currentY - layer.y;

    onStart(differenceFromStartingX, differenceFromStartingY);
  };

  private handleOnTouchStart = (event: TouchEvent) => {
    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;

    this.handleOnMoveStart(x, y);
  };

  private handleOnMouseDown = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    this.handleOnMoveStart(x, y);
  };

  // Move

  private handleOnMove = (x: number, y: number) => {
    const { onMove, layer } = this.props;

    if (layer.isDragging) {
      const {
        x: currentX,
        y: currentY,
      } = this.calculateupperRelativeCoordinates(x, y);
      const nextX = currentX - layer.differenceFromStartingX;
      const nextY = currentY - layer.differenceFromStartingY;

      onMove(nextX, nextY);
    }
  };

  private handleOnTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;

    this.handleOnMove(x, y);
  };

  private handleOnMouseMove = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    this.handleOnMove(x, y);
  };
}

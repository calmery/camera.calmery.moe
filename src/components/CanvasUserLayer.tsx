import React, { useRef, useEffect } from "react";
import { CanvasUserFrame } from "~/types/CanvasUserFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

export const CanvasUserLayerComponent: React.FC<{
  layer: CanvasUserLayer;
  frame: CanvasUserFrame;
  displayRatio: number;
  onStart: (
    differenceFromStartingX: number,
    differenceFromStartingY: number
  ) => void;
  onMove: (nextX: number, nextY: number) => void;
}> = (props) => {
  const pathRef = useRef<SVGPathElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const { frame, layer, onMove, displayRatio, onStart } = props;

  const calculateupperRelativeCoordinates = (x: number, y: number) => {
    const clipPath = pathRef.current!.getBoundingClientRect();

    return {
      x: (x - clipPath.x) * displayRatio,
      y: (y - clipPath.y) * displayRatio,
    };
  };

  // Events

  const handleOnMoveStart = (event: MouseEvent | TouchEvent) => {
    const [{ x, y }] = convertEventToCursorPositions(event);
    const { x: currentX, y: currentY } = calculateupperRelativeCoordinates(
      x,
      y
    );

    const differenceFromStartingX = currentX - layer.x;
    const differenceFromStartingY = currentY - layer.y;

    onStart(differenceFromStartingX, differenceFromStartingY);
  };

  // Move

  const handleOnMove = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const [{ x, y }] = convertEventToCursorPositions(event);

    if (layer.isDragging) {
      const { x: currentX, y: currentY } = calculateupperRelativeCoordinates(
        x,
        y
      );
      const nextX = currentX - layer.differenceFromStartingX;
      const nextY = currentY - layer.differenceFromStartingY;

      onMove(nextX, nextY);
    }
  };

  useEffect(() => {
    const e = rectRef.current!;

    e.addEventListener("touchstart", handleOnMoveStart);
    e.addEventListener("mousedown", handleOnMoveStart);
    e.addEventListener("mousemove", handleOnMove);
    e.addEventListener("touchmove", handleOnMove, { passive: false });

    return () => {
      e.removeEventListener("touchstart", handleOnMoveStart);
      e.removeEventListener("mousedown", handleOnMoveStart);
      e.removeEventListener("mousemove", handleOnMove);
      e.removeEventListener("touchmove", handleOnMove);
    };
  });

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
      {frame.d && (
        <clipPath id={`clip-path-${frame.id}`}>
          <path d={frame.d} ref={pathRef} />
        </clipPath>
      )}

      <g clipPath={`url(#clip-path-${frame.id})`}>
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
            <image
              xlinkHref={layer.dataUrl}
              width="100%"
              height="100%"
              filter={`url(#filter-${frame.id})`}
            />
          </g>
        </svg>
      </g>

      <g clipPath={`url(#clip-path-${frame.id})`}>
        <rect
          ref={rectRef}
          width={frame.width}
          height={frame.height}
          fillOpacity={0}
        />
      </g>
    </svg>
  );
};

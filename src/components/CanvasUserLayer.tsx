import React, { useRef, useEffect, useCallback } from "react";
import { CanvasUserFrame } from "~/types/CanvasUserFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";

export const CanvasUserLayerComponent: React.FC<{
  layer: CanvasUserLayer;
  frame: CanvasUserFrame;
  isCollaging: boolean;
  onStart: (clipPath: DOMRect, event: MouseEvent | TouchEvent) => void;
  onMove: (clipPath: DOMRect, event: MouseEvent | TouchEvent) => void;
}> = (props) => {
  const pathRef = useRef<SVGPathElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const { frame, layer, onMove, onStart, isCollaging } = props;

  const handleOnMoveStart = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const e = pathRef.current!.getBoundingClientRect();
      onStart(e, event);
    },
    [onStart]
  );

  const handleOnMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const e = pathRef.current!.getBoundingClientRect();
      onMove(e, event);
    },
    [onMove]
  );

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
      <clipPath id={`clip-path-${frame.id}`}>
        <path d={frame.path} ref={pathRef} />
      </clipPath>

      <g clipPath={`url(#clip-path-${frame.id})`}>
        <svg
          width={layer.width}
          height={layer.height}
          x={isCollaging ? layer.x : 0}
          y={isCollaging ? layer.y : 0}
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

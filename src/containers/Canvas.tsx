import React, { useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CanvasFilters } from "./CanvasFilters";
import { CanvasStickerLayers } from "./CanvasStickerLayers";
import { CanvasUserLayers } from "./CanvasUserLayers";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";
import { useRouter } from "next/router";

export const Canvas: React.FC<{ preview?: boolean }> = ({
  preview = false,
}) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const dispatch = useDispatch();
  const container = useSelector(({ canvas }: State) => canvas);
  const { pathname } = useRouter();

  const handleOnComplete = useCallback(
    () => !preview && dispatch(actions.complete()),
    [dispatch, preview]
  );

  const handleOnMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      !preview &&
        dispatch(
          actions.tickCanvasLayerSticker(convertEventToCursorPositions(event))
        );
    },
    [dispatch, preview]
  );

  useEffect(() => {
    const e = containerRef.current!;

    e.addEventListener("mouseup", handleOnComplete);
    e.addEventListener("touchend", handleOnComplete);
    e.addEventListener("mouseleave", handleOnComplete);
    e.addEventListener("mousemove", handleOnMove);
    e.addEventListener("touchmove", handleOnMove, { passive: false });

    return () => {
      e.removeEventListener("mouseup", handleOnComplete);
      e.removeEventListener("touchend", handleOnComplete);
      e.removeEventListener("mouseleave", handleOnComplete);
      e.removeEventListener("mousemove", handleOnMove);
      e.removeEventListener("touchmove", handleOnMove);
    };
  }, []);

  return (
    <svg
      viewBox={`0 0 ${container.viewBoxWidth} ${container.viewBoxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      ref={containerRef}
      style={
        !preview
          ? {
              position: "fixed",
              top: `${container.styleTop}px`,
              left: `${container.styleLeft}px`,
              width: `${container.styleWidth}px`,
              height: `${container.styleHeight}px`,
            }
          : {}
      }
      overflow={pathname === "/collage" ? "visible" : undefined}
    >
      <CanvasFilters />
      <CanvasUserLayers preview={preview} />
      {pathname !== "/collage" && <CanvasStickerLayers preview={preview} />}
    </svg>
  );
};

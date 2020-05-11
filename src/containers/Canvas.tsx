import React, { useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CanvasFilters } from "./CanvasFilters";
import CanvasStickerLayers from "./CanvasStickerLayers";
import CanvasUserLayers from "./CanvasUserLayers";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-positions";

export const Canvas: React.FC = () => {
  const containerRef = useRef<SVGSVGElement>(null);
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);

  const handleOnComplete = useCallback(() => dispatch(actions.complete()), [
    dispatch,
  ]);

  const handleOnResizeWindow = useCallback(() => {
    const e = containerRef.current!;
    const rect = e.getBoundingClientRect();

    dispatch(actions.updateDisplayRatio(rect.x, rect.y, rect.width));
  }, [dispatch]);

  const handleOnMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dispatch(actions.tick(convertEventToCursorPositions(event)));
    },
    [dispatch]
  );

  useEffect(() => {
    const e = containerRef.current!;

    e.addEventListener("mouseup", handleOnComplete);
    e.addEventListener("touchend", handleOnComplete);
    e.addEventListener("mouseleave", handleOnComplete);
    e.addEventListener("mousemove", handleOnMove);
    e.addEventListener("touchmove", handleOnMove, { passive: false });
    addEventListener("resize", handleOnResizeWindow);

    handleOnResizeWindow();

    return () => {
      e.removeEventListener("mouseup", handleOnComplete);
      e.removeEventListener("touchend", handleOnComplete);
      e.removeEventListener("mouseleave", handleOnComplete);
      e.removeEventListener("mousemove", handleOnMove);
      e.removeEventListener("touchmove", handleOnMove);
      removeEventListener("resize", handleOnResizeWindow);
    };
  }, []);

  return (
    <svg
      viewBox={`0 0 ${canvas.width} ${canvas.height}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      ref={containerRef}
    >
      <CanvasFilters />
      <CanvasUserLayers />
      <CanvasStickerLayers />
    </svg>
  );
};

import React, { useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CanvasUserLayers } from "./CanvasUserLayers";
import { CanvasStickerLayers } from "./CanvasStickerLayers";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";
import { useRouter } from "next/router";

export const Canvas: React.FC<{
  preview?: boolean;
  users?: boolean;
  stickers?: boolean;
}> = ({ preview = false, users = true, stickers = true }) => {
  const ref = useRef<SVGSVGElement>(null);
  const dispatch = useDispatch();
  const {
    viewBoxWidth,
    viewBoxHeight,
    styleTop,
    styleLeft,
    styleWidth,
    styleHeight,
  } = useSelector(({ canvas }: State) => canvas);

  const handleOnComplete = useCallback(
    () => !preview && dispatch(actions.complete()),
    [dispatch, preview]
  );

  const handleOnMove = useCallback(
    (event: React.MouseEvent | TouchEvent) => {
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
    const e = ref.current!;

    e.addEventListener("touchmove", handleOnMove, { passive: false });

    return () => {
      e.removeEventListener("touchmove", handleOnMove);
    };
  }, []);

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      ref={ref}
      style={
        !preview
          ? {
              position: "fixed",
              top: `${styleTop}px`,
              left: `${styleLeft}px`,
              width: `${styleWidth}px`,
              height: `${styleHeight}px`,
            }
          : {}
      }
      overflow={!preview ? "visible" : undefined}
      onMouseUp={handleOnComplete}
      onMouseLeave={handleOnComplete}
      onTouchEnd={handleOnComplete}
      onMouseMove={handleOnMove}
    >
      {users && <CanvasUserLayers preview={preview} />}
      {stickers && <CanvasStickerLayers preview={preview} />}
    </svg>
  );
};

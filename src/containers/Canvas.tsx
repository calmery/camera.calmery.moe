import React, { useRef, useEffect, useCallback, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResizeObserver from "resize-observer-polyfill";
import styled from "styled-components";
import { CanvasUserLayers } from "./CanvasUserLayers";
import { CanvasStickerLayers } from "./CanvasStickerLayers";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

const CanvasContainer = styled.div`
  box-sizing: border-box;
  padding: 0 24px;
  flex-grow: 1;
  height: fit-content;
`;

const CanvasSizeDetector = styled.div`
  width: 100%;
  height: 100%;
`;

export const Canvas: React.FC<{
  save?: boolean;
  users?: boolean;
  stickers?: boolean;
  containerRef?: any;
}> = ({ save = false, users = true, stickers = true, containerRef }) => {
  const displayableRef = useRef<HTMLDivElement>(null);
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
    () => !save && dispatch(actions.complete()),
    [dispatch, save]
  );

  const handleOnMove = useCallback(
    (event: React.MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!save) {
        dispatch(actions.tickCanvas(convertEventToCursorPositions(event)));
      }
    },
    [dispatch, save]
  );

  useEffect(() => {
    const e = ref.current!;
    const d = displayableRef.current!;

    e.addEventListener("touchmove", handleOnMove, { passive: false });
    const resizeObserver = new ResizeObserver(() => {
      dispatch(actions.updateCanvasContainerRect(d.getBoundingClientRect()));
    });

    resizeObserver.observe(d);
    dispatch(actions.updateCanvasContainerRect(d.getBoundingClientRect()));

    return () => {
      e.removeEventListener("touchmove", handleOnMove);
      resizeObserver.unobserve(d);
    };
  }, [ref, displayableRef]);

  return (
    <>
      <CanvasContainer>
        <CanvasSizeDetector ref={displayableRef} />
      </CanvasContainer>
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          top: `${styleTop}px`,
          left: `${styleLeft}px`,
          width: `${styleWidth}px`,
          height: `${styleHeight}px`,
          opacity: save ? 0 : 1,
        }}
      >
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          ref={ref}
          overflow={!save ? "visible" : undefined}
          onMouseUp={handleOnComplete}
          onMouseLeave={handleOnComplete}
          onTouchEnd={handleOnComplete}
          onMouseMove={handleOnMove}
        >
          {users && <CanvasUserLayers save={save} />}
          {stickers && <CanvasStickerLayers save={save} />}
        </svg>
      </div>
    </>
  );
};

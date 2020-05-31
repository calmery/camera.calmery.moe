import React, { useRef, useEffect, useCallback, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResizeObserver from "resize-observer-polyfill";
import styled from "styled-components";
import { CanvasUserLayers } from "./CanvasUserLayers";
import { CanvasStickerLayers } from "./CanvasStickerLayers";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";
import { Colors } from "~/styles/colors";
import { CanvasEssentialLayers } from "./CanvasEssentialLayers";
import { CanvasStickerLayerBorder } from "~/components/CanvasStickerLayerBorder";
import { Loading } from "~/components/Loading";

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
    stickerLayers,
    displayMagnification,
  } = useSelector(({ canvas }: State) => canvas);
  const isLoading = useSelector(({ ui }: State) => !!ui.loading);

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

  const stickerLayer = stickerLayers[stickerLayers.length - 1];

  return (
    <>
      <CanvasContainer>
        <CanvasSizeDetector ref={displayableRef} />
      </CanvasContainer>
      <div
        id="tutorial-canvas"
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
          onMouseUp={handleOnComplete}
          onMouseLeave={handleOnComplete}
          onTouchEnd={handleOnComplete}
          onMouseMove={handleOnMove}
        >
          <rect
            fill={Colors.lightGray}
            width={viewBoxWidth}
            height={viewBoxHeight}
          ></rect>
          {stickers && stickerLayer && (
            <CanvasStickerLayerBorder
              baseX={0}
              baseY={0}
              displayMagnification={displayMagnification}
              stickerLayer={stickerLayer}
              backgroundBrightness={1}
            />
          )}
          {users && (
            <CanvasUserLayers
              stickers={stickers}
              stickerBorder={false}
              save={save}
            />
          )}
          {stickers && <CanvasStickerLayers save={save} borderOnly={false} />}
          {stickers && (
            <CanvasUserLayers
              stickers={stickers}
              stickerBorder={true}
              save={save}
            />
          )}
          {stickers && <CanvasStickerLayers save={save} borderOnly={true} />}
          <CanvasEssentialLayers />
        </svg>
      </div>
      {isLoading && <Loading />}
    </>
  );
};

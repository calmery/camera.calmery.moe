import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResizeObserver from "resize-observer-polyfill";
import styled from "styled-components";
import { CanvasEssentialLayers } from "~/containers/CanvasEssentialLayers";
import { CanvasStickerLayers } from "~/containers/CanvasStickerLayers";
import { CanvasStickerLayerOperator } from "~/containers/CanvasStickerLayerOperator";
import { CanvasUserFrames } from "~/containers/CanvasUserFrames";
import { CanvasUserLayers } from "~/containers/CanvasUserLayers";
import { CanvasUserLayerOperator } from "~/containers/CanvasUserLayerOperator";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { CanvasColors } from "~/styles/colors";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

// Child Components

const CanvasBackground: React.FC = () => (
  <rect fill={CanvasColors.background} width="100%" height="100%" />
);

// Styles

const Displayable = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  height: fit-content;
  margin: 0 24px;
`;

const Svg = styled.svg`
  position: fixed;
  user-select: none;
`;

// Types

interface CanvasProps {
  essentials?: boolean;
  preview?: boolean;
  removable?: boolean;
  stickers?: boolean;
}

// Components

export const Canvas: React.FC<CanvasProps> = ({
  essentials = true,
  preview = false,
  removable = false,
  stickers = true,
}) => {
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);

  // Variables

  const {
    isStickerLayerDragging,
    isStickerLayerTransforming,
    isUserLayerDragging,
  } = canvas;

  const canFireEvent =
    isStickerLayerDragging || isStickerLayerTransforming || isUserLayerDragging;

  // References

  const displayableRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Events

  const handleOnTick = useCallback(
    (event: React.MouseEvent | TouchEvent) => {
      if (preview || !canFireEvent) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      dispatch(actions.tick(convertEventToCursorPositions(event)));
    },
    [canFireEvent, dispatch, preview]
  );

  const handleOnComplete = useCallback(() => {
    if (preview || !canFireEvent) {
      return;
    }

    dispatch(actions.complete());
  }, [canFireEvent, dispatch, preview]);

  // Hooks

  useEffect(() => {
    const d = displayableRef.current!;
    const resizeObserver = new ResizeObserver(() => {
      dispatch(actions.updateDisplayable(d.getBoundingClientRect()));
    });

    resizeObserver.observe(d);

    return () => {
      resizeObserver.unobserve(d);
    };
  }, [displayableRef]);

  useEffect(() => {
    if (preview) {
      return;
    }

    const s = svgRef.current!;

    s.addEventListener("touchmove", handleOnTick, { passive: false });

    return () => {
      s.removeEventListener("touchmove", handleOnTick);
    };
  }, [canFireEvent, svgRef, preview]);

  // Render

  const {
    displayableTop,
    displayableLeft,
    displayableWidth,
    displayableHeight,
    styleTop,
    styleLeft,
    styleWidth,
    styleHeight,
    viewBoxWidth,
    viewBoxHeight,
  } = canvas;

  return (
    <>
      <Displayable ref={displayableRef} />
      <Svg
        ref={svgRef}
        onMouseLeave={handleOnComplete}
        onMouseMove={handleOnTick}
        onMouseUp={handleOnComplete}
        onTouchEnd={handleOnComplete}
        style={{
          top: `${displayableTop}px`,
          left: `${displayableLeft}px`,
        }}
        width={displayableWidth}
        height={displayableHeight}
        viewBox={`0 0 ${displayableWidth} ${displayableHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <svg
          x={styleLeft - displayableLeft}
          y={styleTop - displayableTop}
          width={styleWidth}
          height={styleHeight}
          overflow="visible"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <CanvasBackground />
          <CanvasUserFrames />
          <CanvasUserLayers />
          {!preview && <CanvasUserLayerOperator removable={removable} />}
          {stickers && <CanvasStickerLayers />}
          {essentials && <CanvasEssentialLayers />}
          {!preview && stickers && <CanvasStickerLayerOperator />}
        </svg>
      </Svg>
    </>
  );
};

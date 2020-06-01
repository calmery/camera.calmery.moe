import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResizeObserver from "resize-observer-polyfill";
import styled from "styled-components";
import { CanvasUserFrames } from "~/containers/CanvasUserFrames";
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

// Components

export const Canvas: React.FC = () => {
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

  // Events

  const handleOnTick = useCallback(
    (event: React.MouseEvent | TouchEvent) => {
      if (!canFireEvent) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      dispatch(actions.tick(convertEventToCursorPositions(event)));
    },
    [canFireEvent, dispatch]
  );

  const handleOnComplete = useCallback(() => {
    if (!canFireEvent) {
      return;
    }

    dispatch(actions.complete());
  }, [canFireEvent, dispatch]);

  // Hooks

  useEffect(() => {
    const e = displayableRef.current!;
    const resizeObserver = new ResizeObserver(() => {
      dispatch(actions.updateDisplayable(e.getBoundingClientRect()));
    });

    e.addEventListener("touchmove", handleOnTick, { passive: false });
    resizeObserver.observe(e);

    return () => {
      e.removeEventListener("touchmove", handleOnTick);
      resizeObserver.unobserve(e);
    };
  }, [displayableRef]);

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
          <CanvasUserLayerOperator />
        </svg>
      </Svg>
    </>
  );
};

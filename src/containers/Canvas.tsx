import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResizeObserver from "resize-observer-polyfill";
import styled from "styled-components";
import { CanvasLogo } from "./CanvasLogo";
import { CanvasStickerLayers } from "~/containers/CanvasStickerLayers";
import { CanvasStickerLayerOperator } from "~/containers/CanvasStickerLayerOperator";
import { CanvasUserFrames } from "~/containers/CanvasUserFrames";
import { CanvasUserLayers } from "~/containers/CanvasUserLayers";
import { CanvasUserLayerOperator } from "~/containers/CanvasUserLayerOperator";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { CanvasColors } from "~/styles/colors";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";
import { convertSvgToDataUrl } from "~/utils/convert-svg-to-url";

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
  logo?: boolean;
  removable?: boolean;
  stickers?: boolean;
  onCreatePreviewUrl?: (url: string) => void;
}

// Components

export const Canvas: React.FC<CanvasProps> = ({
  logo = true,
  removable = false,
  stickers = true,
  onCreatePreviewUrl,
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

  const preview = !!onCreatePreviewUrl;

  // References

  const displayableRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Events

  const handleOnTick = useCallback(
    (event: React.MouseEvent | TouchEvent) => {
      if (onCreatePreviewUrl || !canFireEvent) {
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const d = displayableRef.current!;
    const resizeObserver = new ResizeObserver(() => {
      dispatch(actions.updateDisplayable(d.getBoundingClientRect()));
    });

    resizeObserver.observe(d);

    return () => {
      resizeObserver.unobserve(d);
    };
  }, [dispatch, displayableRef]);

  useEffect(() => {
    if (preview) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const s = svgRef.current!;

    s.addEventListener("touchmove", handleOnTick, { passive: false });

    return () => {
      s.removeEventListener("touchmove", handleOnTick);
    };
  }, [canFireEvent, svgRef, preview]);

  useEffect(() => {
    if (!preview) {
      return;
    }

    (async () => {
      const dataUrl = await convertSvgToDataUrl(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        svgRef.current!.innerHTML,
        viewBoxWidth,
        viewBoxHeight
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onCreatePreviewUrl!(dataUrl);
    })();
  }, [preview, svgRef]);

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
          overflow={preview ? "hidden" : "visible"}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <CanvasBackground />
          <CanvasUserFrames />
          <CanvasUserLayers />
          {!preview && <CanvasUserLayerOperator removable={removable} />}
          {stickers && <CanvasStickerLayers />}
          {logo && <CanvasLogo />}
          {!preview && stickers && <CanvasStickerLayerOperator />}
        </svg>
      </Svg>
    </>
  );
};

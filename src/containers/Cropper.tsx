import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResizeObserver from "resize-observer-polyfill";
import styled from "styled-components";
import { CropperImage } from "~/containers/CropperImage";
import { CropperOperator } from "~/containers/CropperOperator";
import { State } from "~/domains";
import { actions as canvasActions } from "~/domains/canvas/actions";
import { actions } from "~/domains/cropper/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

// Styles

const Displayable = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  height: fit-content;
`;

const Svg = styled.svg`
  position: fixed;
`;

// Components

export const Cropper: React.FC = () => {
  const dispatch = useDispatch();
  const { canvas, cropper: c } = useSelector(({ canvas, cropper }: State) => ({
    canvas,
    cropper,
  }));
  const { container, cropper, image } = c;
  const { temporaries } = canvas;

  // Refs

  const displayableRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Events

  const handleOnStartTransform = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      const positions = convertEventToCursorPositions(event);

      if (positions.length > 1) {
        dispatch(
          actions.startCropperImageTransform(
            convertEventToCursorPositions(event)
          )
        );

        return;
      }

      dispatch(
        actions.startCropperCropperDrag(convertEventToCursorPositions(event))
      );
    },
    [dispatch]
  );

  const handleOnTick = useCallback(
    (event: React.MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dispatch(actions.tickCropper(convertEventToCursorPositions(event)));
    },
    [dispatch]
  );

  const handleOnComplete = useCallback(
    () => dispatch(actions.completeCropper()),
    [dispatch]
  );

  // Variables

  let sx = cropper.scaleX.current;
  let sy = cropper.scaleY.current;

  if (!cropper.freeAspect) {
    sx = cropper.scale.current;
    sy = cropper.scale.current;
  }

  const { x, y } = cropper.position;
  const width = cropper.width * sx;
  const height = cropper.height * sy;
  const { rotate, scale } = image;

  // Hooks

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const d = displayableRef.current!;
    const resizeObserver = new ResizeObserver(() => {
      dispatch(actions.updateCropperContainerRect(d.getBoundingClientRect()));
    });

    resizeObserver.observe(d);
    dispatch(actions.updateCropperContainerRect(d.getBoundingClientRect()));

    return () => {
      resizeObserver.unobserve(d);
    };
  }, [displayableRef]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const e = svgRef.current!;

    e.addEventListener("touchmove", handleOnTick, { passive: false });

    return () => {
      e.removeEventListener("touchmove", handleOnTick);
    };
  }, [svgRef]);

  useEffect(() => {
    const { userLayers } = canvas;
    let userLayer = userLayers[temporaries.selectedUserLayerIndex];

    if (!userLayer) {
      const i = userLayers.findIndex((l) => l);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userLayer = userLayers[i]!;

      // selectedUserLayerIndex で指定された画像がない場合、userLayers の画像存在確認、先頭の画像を使用する
      dispatch(canvasActions.startCanvasUserLayerCrop(i));
    }

    const { dataUrl, width, height, cropper } = userLayer;

    dispatch(
      actions.initializeCropperImage({
        url: dataUrl,
        width,
        height,
        ...cropper,
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      canvasActions.updateCanvasUserLayerCrop(
        x,
        y,
        width,
        height,
        rotate.current,
        scale.current,
        image.position.x,
        image.position.y,
        {
          cropperWidth: cropper.width,
          cropperHeight: cropper.height,
          cropperX: cropper.position.x,
          cropperY: cropper.position.y,
          imageX: image.position.x,
          imageY: image.position.y,
          imageAngle: image.rotate.current,
          imageScale: image.scale.current,
          cropperScale: cropper.scale.current,
          cropperScaleX: cropper.scaleX.current,
          cropperScaleY: cropper.scaleY.current,
        }
      )
    );
  }, [
    x,
    y,
    width,
    height,
    rotate.current,
    scale.current,
    image.position.x,
    image.position.y,
  ]);

  // Render

  const {
    displayableWidth,
    displayableHeight,
    displayableTop,
    displayableLeft,
    styleWidth,
    styleHeight,
    styleTop,
    styleLeft,
  } = container;

  return (
    <>
      <Displayable ref={displayableRef} />
      <Svg
        ref={svgRef}
        onMouseMove={handleOnTick}
        onMouseUp={handleOnComplete}
        onMouseLeave={handleOnComplete}
        onTouchStart={handleOnStartTransform}
        onMouseDown={handleOnStartTransform}
        onTouchEnd={handleOnComplete}
        viewBox={`0 0 ${displayableWidth} ${displayableHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{
          top: `${displayableTop}px`,
          left: `${displayableLeft}px`,
          width: `${displayableWidth}px`,
          height: `${displayableHeight}px`,
        }}
      >
        <svg
          width={styleWidth}
          height={styleHeight}
          x={styleLeft}
          y={styleTop}
          id="tutorial-cropper"
          viewBox={`0 0 ${image.width} ${image.height}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          overflow="visible"
        >
          <CropperImage />
          <CropperOperator />
        </svg>
      </Svg>
    </>
  );
};

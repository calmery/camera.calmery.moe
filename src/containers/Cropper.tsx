import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResizeObserver from "resize-observer-polyfill";
import styled, { css } from "styled-components";
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

const Svg = styled.svg<{ isShiftKey: boolean; isControlKey: boolean }>`
  position: fixed;

  ${({ isShiftKey, isControlKey }) => {
    if (isShiftKey) {
      return css`
        cursor: url("/images/containers/rotate.svg"), auto;
      `;
    }

    if (isControlKey) {
      return css`
        cursor: se-resize;
      `;
    }

    return css`
      cursor: move;
    `;
  }};
`;

// Components

export const Cropper: React.FC = () => {
  const dispatch = useDispatch();
  const { canvas, cropper, entities } = useSelector(
    ({ canvas, cropper, entities }: State) => ({
      canvas,
      cropper,
      entities,
    })
  );
  const [firstUpdate, setFirstUpdate] = useState(false);
  const { temporaries } = canvas;
  const {
    isCropperDragging,
    isCropperTransforming,
    isImageTransforming,
    isShiftKey,
    isControlKey,
  } = cropper;

  // Refs

  const displayableRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Events

  const handleOnStartTransform = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      const positions = convertEventToCursorPositions(event);

      if (positions.length > 1 || isShiftKey || isControlKey) {
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
    [dispatch, isControlKey, isShiftKey]
  );

  const handleOnTick = useCallback(
    (event: React.MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (
        !isCropperDragging &&
        !isCropperTransforming &&
        !isImageTransforming
      ) {
        return;
      }

      dispatch(actions.tickCropper(convertEventToCursorPositions(event)));
    },
    [dispatch, isCropperDragging, isCropperTransforming, isImageTransforming]
  );

  const handleOnComplete = useCallback(() => {
    if (!isCropperDragging && !isCropperTransforming && !isImageTransforming) {
      return;
    }

    dispatch(actions.completeCropper());
  }, [dispatch, isCropperDragging, isCropperTransforming, isImageTransforming]);

  const handleOnContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    return false;
  }, []);

  const handleOnUpdateKey = useCallback(
    (event: KeyboardEvent) => {
      const { ctrlKey, shiftKey } = event;
      dispatch(actions.updateKey(ctrlKey, shiftKey));
    },
    [dispatch]
  );

  const handleOnKeyup = useCallback(
    (event: KeyboardEvent) => {
      handleOnUpdateKey(event);
      dispatch(actions.completeCropper());
    },
    [dispatch, handleOnUpdateKey]
  );

  // Variables

  let sx = cropper.cropperScaleX;
  let sy = cropper.cropperScaleY;

  if (!cropper.freeAspect) {
    sx = cropper.cropperScale;
    sy = cropper.cropperScale;
  }

  const { cropperX: x, cropperY: y } = cropper;
  const width = cropper.cropperWidth * sx;
  const height = cropper.cropperHeight * sy;
  const { imageAngle, imageScale } = cropper;

  // Hooks

  useEffect(() => {
    addEventListener("keydown", handleOnUpdateKey);
    addEventListener("keyup", handleOnKeyup);

    return () => {
      removeEventListener("keydown", handleOnUpdateKey);
      removeEventListener("keyup", handleOnKeyup);
    };
  }, [handleOnUpdateKey]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const d = displayableRef.current!;
    const resizeObserver = new ResizeObserver(() => {
      dispatch(actions.updateDisplayableRect(d.getBoundingClientRect()));
    });

    resizeObserver.observe(d);
    dispatch(actions.updateDisplayableRect(d.getBoundingClientRect()));

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
  }, [svgRef, handleOnTick]);

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

    const { entityId, cropper } = userLayer;
    const { width, height } = entities[entityId];

    dispatch(
      actions.initializeCropperImage({
        entityId,
        width,
        height,
        ...cropper,
      })
    );
  }, []);

  useEffect(() => {
    if (!firstUpdate) {
      setFirstUpdate(true);
      return;
    }

    dispatch(
      canvasActions.updateCanvasUserLayerCrop(
        x,
        y,
        width,
        height,
        imageAngle,
        imageScale,
        cropper.imageX,
        cropper.imageY,
        {
          cropperWidth: cropper.cropperWidth,
          cropperHeight: cropper.cropperHeight,
          cropperX: cropper.cropperX,
          cropperY: cropper.cropperY,
          imageX: cropper.imageX,
          imageY: cropper.imageY,
          imageAngle: imageAngle,
          imageScale: imageScale,
          cropperScale: cropper.cropperScale,
          cropperScaleX: cropper.cropperScaleX,
          cropperScaleY: cropper.cropperScaleY,
        }
      )
    );
  }, [isCropperDragging, isCropperTransforming, isImageTransforming]);

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
  } = cropper;

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
        onContextMenu={handleOnContextMenu}
        isShiftKey={isShiftKey}
        isControlKey={isControlKey}
        viewBox={`0 0 ${displayableWidth} ${displayableHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{
          top: `${displayableTop}px`,
          left: `${displayableLeft}px`,
          width: `${displayableWidth}px`,
          height: `${displayableHeight}px`,
        }}
        id="tutorial-cropper"
      >
        <svg
          width={styleWidth}
          height={styleHeight}
          x={styleLeft}
          y={styleTop}
          viewBox={`0 0 ${cropper.imageWidth} ${cropper.imageHeight}`}
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

import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "~/domains";
import { actions } from "~/domains/cropper/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

export const Cropper: React.FC = () => {
  const dispatch = useDispatch();
  const { container, cropper, image } = useSelector(
    ({ cropper }: State) => cropper
  );
  const containerRef = useRef<SVGSVGElement>(null);

  // Events

  const handleOnMoveCursor = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dispatch(actions.tick(convertEventToCursorPositions(event)));
    },
    [dispatch]
  );

  const handleOnComplete = useCallback(() => dispatch(actions.complete()), [
    dispatch,
  ]);

  // Global Events

  const handleOnUpdateContainerSize = useCallback(() => {
    const e = containerRef.current!;
    const rect = e.getBoundingClientRect();

    dispatch(
      actions.setActualSize({
        x: rect.x,
        y: rect.y,
        width: rect.width,
      })
    );
  }, [dispatch, image.width, containerRef.current]);

  // Image Events

  const handleOnStartImageTransform = useCallback(
    (event: TouchEvent) => {
      dispatch(
        actions.startImageTransforming(convertEventToCursorPositions(event))
      );
    },
    [dispatch]
  );

  // Cropper Events

  const handleOnStartCropperMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      dispatch(
        actions.startCropperMoving(convertEventToCursorPositions(event))
      );
    },
    [dispatch]
  );

  const handleOnStartCropperTransform = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      dispatch(
        actions.startCropperTransforming(convertEventToCursorPositions(event))
      );
    },
    [dispatch]
  );

  const handleOnTouchStartDocument = useCallback((event: TouchEvent) => {
    // Safari、2 本指でピンチインしたときに Safari のタブ一覧に遷移してしまうことがある
    // そのため 2 本指でのタッチを一時的に無効化する
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, []);

  // Hooks

  useEffect(() => {
    const e = containerRef.current!;

    e.addEventListener("touchstart", handleOnStartImageTransform, false);
    e.addEventListener("mousemove", handleOnMoveCursor, false);
    e.addEventListener("touchmove", handleOnMoveCursor, { passive: false });
    e.addEventListener("mouseup", handleOnComplete, false);
    e.addEventListener("mouseleave", handleOnComplete, false);
    e.addEventListener("touchend", handleOnComplete, false);
    addEventListener("resize", handleOnUpdateContainerSize, false);
    addEventListener("touchstart", handleOnTouchStartDocument, {
      passive: false,
    });

    handleOnUpdateContainerSize();

    return () => {
      e.removeEventListener("touchstart", handleOnStartImageTransform);
      e.removeEventListener("mousemove", handleOnMoveCursor);
      e.removeEventListener("touchmove", handleOnMoveCursor);
      e.removeEventListener("mouseup", handleOnComplete);
      e.removeEventListener("mouseleave", handleOnComplete);
      e.removeEventListener("touchend", handleOnComplete);
      removeEventListener("resize", handleOnUpdateContainerSize);
      removeEventListener("touchstart", handleOnTouchStartDocument);
    };
  }, []);

  useEffect(() => {
    handleOnUpdateContainerSize();
  }, [image.width, image.height]);

  const displayRatio = container.displayRatio;

  let sx = cropper.scaleX.current;
  let sy = cropper.scaleY.current;

  if (!cropper.freeAspect) {
    sx = cropper.scale.current;
    sy = cropper.scale.current;
  }

  return (
    <svg
      ref={containerRef}
      viewBox={`0 0 ${image.width} ${image.height}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      overflow="visible"
      style={{
        position: "fixed",
        top: `${container.actualY}px`,
        left: `${container.actualX}px`,
        width: `${container.actualWidth}px`,
        height: `${container.actualHeight}px`,
      }}
    >
      {/* 画像範囲外のでは枠線が黒のクロップ領域を表示する */}

      <g>
        <rect
          fillOpacity="0"
          stroke="#3c3c3c"
          strokeWidth="2"
          strokeDasharray="8 8"
          width={cropper.width * sx}
          height={cropper.height * sy}
          x={cropper.position.x}
          y={cropper.position.y}
          onMouseDown={handleOnStartCropperMove}
          onTouchStart={handleOnStartCropperMove}
        ></rect>

        <circle
          fill="#3c3c3c"
          cx={cropper.position.x + cropper.width * sx}
          cy={cropper.position.y + cropper.height * sy}
          r={12 * displayRatio}
          onMouseDown={handleOnStartCropperTransform}
          onTouchStart={handleOnStartCropperTransform}
        ></circle>
      </g>

      {/* 切り取る対象となる画像 */}

      <svg
        width={image.width * image.scale.current}
        height={image.height * image.scale.current}
        x={image.position.x}
        y={image.position.y}
        viewBox={`0 0 ${image.width} ${image.height}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        overflow="visible"
      >
        <g
          transform={`rotate(${image.rotate.current}, ${image.width / 2}, ${
            image.height / 2
          })`}
        >
          <image xlinkHref={image.url} width="100%" height="100%" />
          <rect width="100%" height="100%" fill="#000" fillOpacity="0.48" />
        </g>
      </svg>

      {/* 切り取った画像 */}

      <clipPath id="cropper-clip-path">
        <rect
          x={cropper.position.x}
          y={cropper.position.y}
          width={cropper.width * sx}
          height={cropper.height * sy}
        />
      </clipPath>

      <g clipPath="url(#cropper-clip-path)">
        <svg
          width={image.width * image.scale.current}
          height={image.height * image.scale.current}
          x={image.position.x}
          y={image.position.y}
          viewBox={`0 0 ${image.width} ${image.height}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          overflow="visible"
        >
          <g
            transform={`rotate(${image.rotate.current}, ${image.width / 2}, ${
              image.height / 2
            })`}
          >
            <image xlinkHref={image.url} width="100%" height="100%" />
          </g>
        </svg>
      </g>

      {/* 画像の表示領域のみを切り取る */}

      <clipPath id="image-clip-path">
        <rect
          width={image.width * image.scale.current}
          height={image.height * image.scale.current}
          x={image.position.x}
          y={image.position.y}
          transform={`rotate(${image.rotate.current}, ${image.width / 2}, ${
            image.height / 2
          })`}
        />
      </clipPath>

      <g clipPath="url(#image-clip-path)">
        <rect
          fillOpacity="0"
          stroke="#FFF"
          strokeWidth="2"
          strokeDasharray="8 8"
          width={cropper.width * sx}
          height={cropper.height * sy}
          x={cropper.position.x}
          y={cropper.position.y}
          onMouseDown={handleOnStartCropperMove}
          onTouchStart={handleOnStartCropperMove}
        ></rect>

        <circle
          fill="#FFF"
          cx={cropper.position.x + cropper.width * sx}
          cy={cropper.position.y + cropper.height * sy}
          r={12 * displayRatio}
          onMouseDown={handleOnStartCropperTransform}
          onTouchStart={handleOnStartCropperTransform}
        ></circle>
      </g>
    </svg>
  );
};

import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State, getOrCreateStore } from "~/domains";
import { actions } from "~/domains/cropper/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-positions";

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

      const state = getOrCreateStore().getState();
      dispatch(actions.tick(event, state.cropper.container));
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
        height: rect.height,
        displayRatio: image.width / rect.width,
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
      const state = getOrCreateStore().getState();
      dispatch(actions.startCropperMoving(event, state.cropper.container));
    },
    [dispatch]
  );

  const handleOnStartCropperTransform = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      const state = getOrCreateStore().getState();
      dispatch(
        actions.startCropperTransforming(
          convertEventToCursorPositions(event),
          state.cropper.container
        )
      );
    },
    [dispatch]
  );

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

    handleOnUpdateContainerSize();

    return () => {
      e.removeEventListener("touchstart", handleOnStartImageTransform);
      e.removeEventListener("mousemove", handleOnMoveCursor);
      e.removeEventListener("touchmove", handleOnMoveCursor);
      e.removeEventListener("mouseup", handleOnComplete);
      e.removeEventListener("mouseleave", handleOnComplete);
      e.removeEventListener("touchend", handleOnComplete);
      removeEventListener("resize", handleOnUpdateContainerSize);
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
    >
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

      <g clipPath="url(#clip-path-1)">
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

      <g>
        <clipPath id="clip-path-1">
          <rect
            x={cropper.position.x}
            y={cropper.position.y}
            width={cropper.width * sx}
            height={cropper.height * sy}
          />
        </clipPath>

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

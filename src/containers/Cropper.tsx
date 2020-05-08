import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "~/domains";
import * as actions from "~/domains/cropper/actions";

export const Cropper: React.FC = () => {
  const dispatch = useDispatch();
  const cropper = useSelector(({ cropper }: State) => cropper);
  const containerRef = useRef<SVGSVGElement>(null);

  // Events

  const startCropperMoving = useCallback(
    (...xs: Parameters<typeof actions.startCropperMoving>) =>
      dispatch(actions.startCropperMoving(...xs)),
    [dispatch]
  );
  const startImageTransforming = useCallback(
    (...xs: Parameters<typeof actions.startImageTransforming>) =>
      dispatch(actions.startImageTransforming(...xs)),
    [dispatch]
  );
  const startCropperTransforming = useCallback(
    (...xs: Parameters<typeof actions.startCropperTransforming>) =>
      dispatch(actions.startCropperTransforming(...xs)),
    [dispatch]
  );
  const complete = useCallback(() => dispatch(actions.complete()), [dispatch]);

  const handleOnMove = useCallback(
    (event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dispatch(actions.tick(event));
    },
    [dispatch]
  );

  const setContainerActualSize = useCallback(() => {
    const e = containerRef.current!;
    dispatch(actions.setContainerActualSize(e.getBoundingClientRect()));
  }, [dispatch, containerRef]);

  // Refs

  useEffect(() => {
    const e = containerRef.current!;

    e.addEventListener("touchstart", startImageTransforming, false);
    e.addEventListener("mousemove", handleOnMove, false);
    e.addEventListener("touchmove", handleOnMove, { passive: false });
    e.addEventListener("mouseup", complete, false);
    e.addEventListener("mouseleave", complete, false);
    e.addEventListener("touchend", complete, false);
    addEventListener("resize", setContainerActualSize, false);

    setContainerActualSize();

    return () => {
      e.removeEventListener("touchstart", startImageTransforming);
      e.removeEventListener("mousemove", handleOnMove);
      e.removeEventListener("touchmove", handleOnMove);
      e.removeEventListener("mouseup", complete);
      e.removeEventListener("mouseleave", complete);
      e.removeEventListener("touchend", complete);
      removeEventListener("resize", setContainerActualSize);
    };
  }, []);

  useEffect(() => {
    setContainerActualSize();
  }, [cropper.image.width, cropper.image.height]);

  const {
    image,
    container,
    cropper: { position, scale, scaleX, scaleY, freeAspect },
  } = cropper;
  const { url, width, height, rotate } = image;
  const displayRatio = container.displayRatio;

  let sx = scaleX.current;
  let sy = scaleY.current;

  if (!freeAspect) {
    sx = scale.current;
    sy = scale.current;
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
        width={width * image.scale.current}
        height={height * image.scale.current}
        x={image.position.x}
        y={image.position.y}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        overflow="visible"
      >
        <g transform={`rotate(${rotate.current}, ${width / 2}, ${height / 2})`}>
          <image xlinkHref={url} width="100%" height="100%" />
          <rect width="100%" height="100%" fill="#000" fillOpacity="0.48" />
        </g>
      </svg>

      <g clipPath="url(#clip-path-1)">
        <svg
          width={width * image.scale.current}
          height={height * image.scale.current}
          x={image.position.x}
          y={image.position.y}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          overflow="visible"
        >
          <g
            transform={`rotate(${rotate.current}, ${width / 2}, ${height / 2})`}
          >
            <image xlinkHref={url} width="100%" height="100%" />
          </g>
        </svg>
      </g>

      <g>
        <clipPath id="clip-path-1">
          <rect
            x={position.x}
            y={position.y}
            width={cropper.cropper.width * sx}
            height={cropper.cropper.height * sy}
          />
        </clipPath>

        <rect
          fillOpacity="0"
          stroke="#FFF"
          strokeWidth="2"
          strokeDasharray="8 8"
          width={cropper.cropper.width * sx}
          height={cropper.cropper.height * sy}
          x={position.x}
          y={position.y}
          onMouseDown={startCropperMoving}
          onTouchStart={startCropperMoving}
        ></rect>

        <circle
          fill="#FFF"
          cx={position.x + cropper.cropper.width * sx}
          cy={position.y + cropper.cropper.height * sy}
          r={12 * displayRatio}
          onMouseDown={startCropperTransforming}
          onTouchStart={startCropperTransforming}
        ></circle>
      </g>
    </svg>
  );
};

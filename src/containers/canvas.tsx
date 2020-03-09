import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "~/modules";
import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasLayerTransformable } from "~/types/CanvasLayerTransformable";
import { CanvasLayerEffectable } from "~/types/CanvasLayerEffectable";

// Filter

enum FeColorMatrix {
  hueRotate = "hueRotate",
  luminanceToAlpha = "luminanceToAlpha",
  saturate = "saturate"
}

const CanvasFilter = ({
  id,
  filter: { blur, hueRotate, luminanceToAlpha, saturate }
}: CanvasLayer & CanvasLayerEffectable) => (
  <filter id={id}>
    <feColorMatrix type={FeColorMatrix.hueRotate} values={`${hueRotate}`} />
    {luminanceToAlpha && (
      <feColorMatrix type={FeColorMatrix.luminanceToAlpha} />
    )}
    <feColorMatrix type={FeColorMatrix.saturate} values={`${saturate}`} />
    <feGaussianBlur stdDeviation={`${blur}`} />
  </filter>
);

const CanvasFilters = () => {
  const { userLayers } = useSelector(({ canvas }: State) => canvas);

  return (
    <defs>
      {userLayers.map((userLayer, index) => (
        <CanvasFilter {...userLayer} key={index} />
      ))}
    </defs>
  );
};

// Images

const CanvasUserLayers = () => {
  const { userLayers: canvasLayers } = useSelector(
    ({ canvas }: State) => canvas
  );

  return (
    <>
      {canvasLayers.map(
        (
          {
            id,
            base64,
            width,
            height,
            x,
            y,
            transform
          }: CanvasLayer & CanvasLayerTransformable & CanvasLayerEffectable,
          index
        ) => {
          const { scale, flip, rotate } = transform;

          return (
            <image
              filter={`url(#${id})`}
              xlinkHref={base64}
              width={width}
              height={height}
              transform={`translate(${x}, ${y}) scale(${scale *
                (flip ? -1 : 1)}, ${scale}) rotate(${rotate} ${width /
                2} ${height / 2})`}
              key={index}
            />
          );
        }
      )}
    </>
  );
};

const CanvasStickerLayers = () => {
  const { stickerLayers: canvasLayers } = useSelector(
    ({ canvas }: State) => canvas
  );

  return (
    <>
      {canvasLayers.map(
        (
          {
            base64,
            width,
            height,
            x,
            y,
            transform
          }: CanvasLayer & CanvasLayerTransformable,
          index
        ) => {
          const { scale, flip, rotate } = transform;

          return (
            <image
              xlinkHref={base64}
              width={width}
              height={height}
              transform={`translate(${x}, ${y}) scale(${scale *
                (flip ? -1 : 1)}, ${scale}) rotate(${rotate} ${width /
                2} ${height / 2})`}
              key={index}
            />
          );
        }
      )}
    </>
  );
};

const CanvasEssentialLayers = () => {
  const { essentialLayers: canvasLayers } = useSelector(
    ({ canvas }: State) => canvas
  );

  return (
    <>
      {canvasLayers.map(
        ({ id, base64, width, height, x, y }: CanvasLayer, index) => (
          <image
            xlinkHref={base64}
            width={width}
            height={height}
            transform={`translate(${x}, ${y})`}
            key={index}
          />
        )
      )}
    </>
  );
};

const CanvasLayers = () => (
  <>
    <CanvasUserLayers />
    <CanvasStickerLayers />
    <CanvasEssentialLayers />
  </>
);

// Main

const Canvas = () => {
  return (
    <svg
      viewBox="0 0 2000 1420"
      version="1.1"
      baseProfile="full"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <CanvasFilters />
      <CanvasLayers />
    </svg>
  );
};

export default Canvas;

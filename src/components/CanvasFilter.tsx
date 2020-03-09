import React from "react";
import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasLayerEffectable } from "~/types/CanvasLayerEffectable";
import { FeColorMatrix } from "~/types/FeColorMatrix";

export const CanvasFilter = ({
  id,
  filter: { blur, hueRotate, luminanceToAlpha, saturate }
}: CanvasLayer & CanvasLayerEffectable) => (
  <filter id={`defs-filter-${id}`}>
    <feColorMatrix type={FeColorMatrix.hueRotate} values={`${hueRotate}`} />
    {luminanceToAlpha && (
      <feColorMatrix type={FeColorMatrix.luminanceToAlpha} />
    )}
    <feColorMatrix type={FeColorMatrix.saturate} values={`${saturate}`} />
    <feGaussianBlur stdDeviation={`${blur}`} />
  </filter>
);

import React from "react";
import { FeColorMatrix } from "~/types/FeColorMatrix";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";

export const CanvasFilter = ({
  id,
  filter: { blur, hueRotate, luminanceToAlpha, saturate },
}: CanvasUserLayer & { id: string }) => (
  <filter id={`filter-${id}`}>
    <feColorMatrix type={FeColorMatrix.hueRotate} values={`${hueRotate}`} />
    {luminanceToAlpha && (
      <feColorMatrix type={FeColorMatrix.luminanceToAlpha} />
    )}
    <feColorMatrix type={FeColorMatrix.saturate} values={`${saturate}`} />
    <feGaussianBlur stdDeviation={`${blur}`} />
  </filter>
);

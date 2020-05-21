import React from "react";
import { FeColorMatrix } from "~/types/FeColorMatrix";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";

export const CanvasFilter = ({
  id,
  blur,
  hue,
  saturate,
}: CanvasUserLayer & { id: string }) => (
  <filter id={`filter-${id}`}>
    <feColorMatrix type={FeColorMatrix.hue} values={`${hue}`} />
    <feColorMatrix type={FeColorMatrix.saturate} values={`${saturate}`} />
    <feGaussianBlur stdDeviation={`${blur}`} />
  </filter>
);

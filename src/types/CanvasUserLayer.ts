export type CanvasUserLayer = {
  dataUrl: string;
  width: number;
  height: number;
  x: number;
  y: number;
  isDragging: boolean;
  differenceFromStartingX: number;
  differenceFromStartingY: number;
  filter: {
    blur: number;
    hueRotate: number;
    luminanceToAlpha: boolean;
    saturate: number;
  };
};

export type CanvasStickerLayer = {
  dataUrl: string;
  width: number;
  height: number;
  x: number;
  y: number;
  isDragging: boolean;
  isTransforming: boolean;
  isMultiTouching: boolean;
  referenceX: number;
  referenceY: number;
  scale: {
    current: number;
    previous: number;
    reference: number;
  };
  rotate: {
    current: number;
    previous: number;
    reference: number;
  };
};
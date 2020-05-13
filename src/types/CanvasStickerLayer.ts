export type CanvasStickerLayer = {
  dataUrl: string;
  width: number;
  height: number;
  x: number;
  y: number;
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

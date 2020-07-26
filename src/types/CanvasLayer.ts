export type CanvasLayer = {
  entityId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  scale: number;
  // Google Analytics を使う場合の識別子、別の場所に入れたい...
  ga?: {
    group: number;
    id: number;
  };
};

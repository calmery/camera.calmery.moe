import { CanvasLayer } from "./CanvasLayer";

export interface CanvasUserLayer extends CanvasLayer {
  croppedX: number;
  croppedY: number;
  croppedWidth: number;
  croppedHeight: number;
  blur: number;
  hue: number;
  saturate: number;
}

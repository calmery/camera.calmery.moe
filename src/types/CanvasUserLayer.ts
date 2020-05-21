import { CanvasLayer } from "./CanvasLayer";

export interface CanvasUserLayer extends CanvasLayer {
  blur: number;
  hue: number;
  saturate: number;
}

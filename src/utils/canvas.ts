import { CanvasColors } from "~/styles/colors";

export const getCanvasUserFrameId = (i: number) => `canvas-user-frame-${i}`;
export const getCanvasUserLayerFilterId = (i: number) =>
  `canvas-user-layer-filter-${i}`;

export const getColorByDominantColorLightness = (
  dominantColorLightness: number
) => {
  if (dominantColorLightness > 0.5) {
    return CanvasColors.dark;
  }

  return CanvasColors.light;
};

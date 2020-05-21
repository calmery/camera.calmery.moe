import { CanvasLayer } from "~/types/CanvasLayer";

//

export const calculateCanvasUserLayerRelativeCoordinates = (
  displayMagnification: number,
  clipPathX: number,
  clipPathY: number,
  x: number,
  y: number
) => ({
  x: (x - clipPathX) * displayMagnification,
  y: (y - clipPathY) * displayMagnification,
});

//

export const progressCanvasStickerLayerTransform = (
  layers: CanvasLayer[],
  x: number,
  y: number,
  nextScale: number,
  nextAngle: number
) => {
  const sticker = layers[layers.length - 1];

  layers[layers.length - 1] = {
    ...sticker,
    x,
    y,
    scale: nextScale,
    angle: nextAngle,
  };

  return layers;
};

//

export const convertUrlToImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onerror = () => reject();
    image.onload = () => resolve(image);

    image.src = url;
  });
};

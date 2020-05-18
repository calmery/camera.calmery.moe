import { CanvasStickerLayer } from "~/types/CanvasStickerLayer";

//

export const calculateCanvasUserLayerRelativeCoordinates = (
  displayRatio: number,
  clipPathX: number,
  clipPathY: number,
  x: number,
  y: number
) => ({
  x: (x - clipPathX) * displayRatio,
  y: (y - clipPathY) * displayRatio,
});

//

export const progressCanvasStickerLayerTransform = (
  layers: CanvasStickerLayer[],
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
    scale: {
      ...sticker.scale,
      current: nextScale,
    },
    rotate: {
      ...sticker.rotate,
      current: nextAngle,
    },
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

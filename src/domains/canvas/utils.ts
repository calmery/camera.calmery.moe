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

//

export const calculateCanvasPositionAndSize = (
  viewBoxWidth: number,
  viewBoxHeight: number,
  displayableTop: number,
  displayableLeft: number,
  displayableWidth: number,
  displayableHeight: number
) => {
  let styleWidth = displayableWidth;
  let styleHeight = viewBoxHeight * (displayableWidth / viewBoxWidth);
  let styleLeft = displayableLeft;
  let styleTop = displayableTop + (displayableHeight - styleHeight) / 2;

  if (styleHeight > displayableHeight) {
    styleHeight = displayableHeight;
    styleWidth = viewBoxWidth * (displayableHeight / viewBoxHeight);
    styleLeft = displayableLeft + (displayableWidth - styleWidth) / 2;
    styleTop = displayableTop;
  }

  return {
    styleTop,
    styleLeft,
    styleWidth,
    styleHeight,
  };
};

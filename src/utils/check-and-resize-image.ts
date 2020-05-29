const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;

export const checkAndResizeImage = (image: HTMLImageElement) => {
  const { width, height } = image;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;

  let renderWidth = 0;
  let renderHeight = 0;

  const horizontalRatio = width / MAX_WIDTH;
  const verticalRatio = height / MAX_HEIGHT;

  // width を基準に縮小する
  if (horizontalRatio > verticalRatio) {
    renderWidth = MAX_WIDTH;
    renderHeight = height * (MAX_WIDTH / width);
  } else {
    renderWidth = width * (MAX_HEIGHT / height);
    renderHeight = MAX_HEIGHT;
  }

  canvas.width = renderWidth;
  canvas.height = renderHeight;
  context.drawImage(image, 0, 0, renderWidth, renderHeight);

  return {
    width: renderWidth,
    height: renderHeight,
    dataUrl: canvas.toDataURL("image/png"),
  };
};

export const convertUrlToDataUrl = (
  url: string
): Promise<{
  base64: string;
  width: number;
  height: number;
}> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onerror = () => reject();
    image.onload = () => {
      const { width, height } = image;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (context === null) {
        return reject();
      }

      context.drawImage(image, 0, 0, width, height);

      resolve({
        base64: canvas.toDataURL("image/png"),
        width,
        height,
      });
    };

    image.src = url;
  });
};

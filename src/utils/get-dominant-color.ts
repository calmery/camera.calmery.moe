// eslint-disable-next-line @typescript-eslint/no-var-requires
const ColorThief = require("~/externals/color-thief");
const colorThief = new ColorThief();

export const getDominangColor = (dataUrl: string): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onerror = () => reject();
    image.onload = () => {
      resolve(colorThief.getColor(image));
    };

    image.src = dataUrl;
  });
};

import { Dispatch } from "redux";
import blueimpLoadImage from "blueimp-load-image";

export const ADD_USER_IMAGE = "ADD_USER_IMAGE" as const;
export const REMOVE_USER_IMAGE = "REMOVE_USER_IMAGE" as const;

// Actions

export const addUserImage = (
  index: number,
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: ADD_USER_IMAGE,
  payload: {
    index,
    dataUrl,
    width,
    height,
  },
});

export const removeUserImage = (index: number) => ({
  type: REMOVE_USER_IMAGE,
  payload: { index },
});

// Redux Thunk

const convertUrlToImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onerror = () => reject();
    image.onload = () => resolve(image);

    image.src = url;
  });
};

// TODO: `blueimpLoadImage` のエラー処理をちゃんとする
export const addUserImageFromFile = (file: File, index: number) => {
  return (dispatch: Dispatch) => {
    return new Promise((resolve) => {
      blueimpLoadImage(
        file,
        async (canvas) => {
          const dataUrl = (canvas as HTMLCanvasElement).toDataURL();
          const { width, height } = await convertUrlToImage(dataUrl);

          dispatch(addUserImage(index, dataUrl, width, height));

          resolve();
        },
        { canvas: true, orientation: true }
      );
    });
  };
};

// Actions

export type Actions =
  | ReturnType<typeof addUserImage>
  | ReturnType<typeof removeUserImage>;

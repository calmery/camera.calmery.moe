import {
  CROPPER_HORIZONTAL_MARGIN,
  CROPPER_VERTICAL_MARGIN,
} from "~/constants/cropper";

export const calculateCropperPositionAndSize = (
  displayableWidth: number,
  displayableHeight: number,
  imageWidth: number,
  imageHeight: number
) => {
  displayableWidth = displayableWidth - CROPPER_HORIZONTAL_MARGIN * 2;
  displayableHeight = displayableHeight - CROPPER_VERTICAL_MARGIN * 2;

  let styleWidth = displayableWidth;
  let styleHeight = imageHeight * (displayableWidth / imageWidth);
  let styleLeft = CROPPER_HORIZONTAL_MARGIN;
  let styleTop =
    CROPPER_VERTICAL_MARGIN + (displayableHeight - styleHeight) / 2;

  if (styleHeight > displayableHeight) {
    styleHeight = displayableHeight;
    styleWidth = imageWidth * (displayableHeight / imageHeight);
    styleLeft = CROPPER_HORIZONTAL_MARGIN + (displayableWidth - styleWidth) / 2;
    styleTop = CROPPER_VERTICAL_MARGIN;
  }

  return {
    styleTop,
    styleLeft,
    styleWidth,
    styleHeight,
  };
};

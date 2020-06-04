import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";
import { Constants } from "~/styles/constants";
import { CropperState } from "~/domains/cropper/reducer";

const Image: React.FC<{
  image: CropperState;
  fill?: boolean;
}> = ({ image, fill = false }) => (
  <svg
    width={image.imageWidth * image.imageScale}
    height={image.imageHeight * image.imageScale}
    x={image.imageX}
    y={image.imageY}
    viewBox={`0 0 ${image.imageWidth} ${image.imageHeight}`}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    overflow="visible"
  >
    <g
      transform={`rotate(${image.imageAngle}, ${image.imageWidth / 2}, ${
        image.imageHeight / 2
      })`}
    >
      <image xlinkHref={image.imageUrl} width="100%" height="100%" />
      {fill && (
        <rect
          width="100%"
          height="100%"
          fill="#000"
          fillOpacity={Constants.opacity}
        />
      )}
    </g>
  </svg>
);

export const CropperImage: React.FC = () => {
  const c = useSelector(({ cropper }: State) => cropper);
  const image = c;
  const cropper = c;

  let sx = cropper.cropperScaleX;
  let sy = cropper.cropperScaleY;

  if (!cropper.freeAspect) {
    sx = cropper.cropperScale;
    sy = cropper.cropperScale;
  }

  return (
    <>
      <clipPath id="cropper-image-clip-path">
        <rect
          x={cropper.cropperX}
          y={cropper.cropperY}
          width={cropper.cropperWidth * sx}
          height={cropper.cropperHeight * sy}
        />
      </clipPath>

      <Image image={image} fill />

      <g clipPath="url(#cropper-image-clip-path)">
        <Image image={image} />
      </g>
    </>
  );
};

import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";
import { Constants } from "~/styles/constants";
import { CropperState } from "~/domains/cropper/reducer";

const Image: React.FC<{
  cropper: CropperState;
  fill?: boolean;
}> = ({ cropper, fill = false }) => (
  <svg
    width={cropper.imageWidth * cropper.imageScale}
    height={cropper.imageHeight * cropper.imageScale}
    x={cropper.imageX}
    y={cropper.imageY}
    viewBox={`0 0 ${cropper.imageWidth} ${cropper.imageHeight}`}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    overflow="visible"
  >
    <g
      transform={`rotate(${cropper.imageAngle}, ${cropper.imageWidth / 2}, ${
        cropper.imageHeight / 2
      })`}
    >
      <image xlinkHref={cropper.imageUrl} width="100%" height="100%" />
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
  const cropper = useSelector(({ cropper }: State) => cropper);

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

      <Image cropper={cropper} fill />

      <g clipPath="url(#cropper-image-clip-path)">
        <Image cropper={cropper} />
      </g>
    </>
  );
};

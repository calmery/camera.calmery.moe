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
    width={image.imageWidth * image.imageScale.current}
    height={image.imageHeight * image.imageScale.current}
    x={image.imagePosition.x}
    y={image.imagePosition.y}
    viewBox={`0 0 ${image.imageWidth} ${image.imageHeight}`}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    overflow="visible"
  >
    <g
      transform={`rotate(${image.imageRotate.current}, ${
        image.imageWidth / 2
      }, ${image.imageHeight / 2})`}
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

  let sx = cropper.scaleX.current;
  let sy = cropper.scaleY.current;

  if (!cropper.freeAspect) {
    sx = cropper.scale.current;
    sy = cropper.scale.current;
  }

  return (
    <>
      <clipPath id="cropper-image-clip-path">
        <rect
          x={cropper.position.x}
          y={cropper.position.y}
          width={cropper.width * sx}
          height={cropper.height * sy}
        />
      </clipPath>

      <Image image={image} fill />

      <g clipPath="url(#cropper-image-clip-path)">
        <Image image={image} />
      </g>
    </>
  );
};

import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";
import { Constants } from "~/styles/constants";

export const CropperImage: React.FC = () => {
  const { cropper, image } = useSelector(({ cropper }: State) => cropper);

  let sx = cropper.scaleX.current;
  let sy = cropper.scaleY.current;

  if (!cropper.freeAspect) {
    sx = cropper.scale.current;
    sy = cropper.scale.current;
  }

  return (
    <>
      <svg
        width={image.width * image.scale.current}
        height={image.height * image.scale.current}
        x={image.position.x}
        y={image.position.y}
        viewBox={`0 0 ${image.width} ${image.height}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        overflow="visible"
      >
        <g
          transform={`rotate(${image.rotate.current}, ${image.width / 2}, ${
            image.height / 2
          })`}
        >
          <image xlinkHref={image.url} width="100%" height="100%" />
          <rect
            width="100%"
            height="100%"
            fill="#000"
            fillOpacity={Constants.opacity}
          />
        </g>
      </svg>

      <clipPath id="cropper-clip-path">
        <rect
          x={cropper.position.x}
          y={cropper.position.y}
          width={cropper.width * sx}
          height={cropper.height * sy}
        />
      </clipPath>

      <g clipPath="url(#cropper-clip-path)">
        <svg
          width={image.width * image.scale.current}
          height={image.height * image.scale.current}
          x={image.position.x}
          y={image.position.y}
          viewBox={`0 0 ${image.width} ${image.height}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          overflow="visible"
        >
          <g
            transform={`rotate(${image.rotate.current}, ${image.width / 2}, ${
              image.height / 2
            })`}
          >
            <rect fill="#fff" width={image.width} height={image.height} />
            <image xlinkHref={image.url} width="100%" height="100%" />
          </g>
        </svg>
      </g>
    </>
  );
};

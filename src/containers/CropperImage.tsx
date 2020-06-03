import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";
import { Constants } from "~/styles/constants";

export const CropperImage: React.FC = () => {
  const { image } = useSelector(({ cropper }: State) => cropper);

  return (
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
  );
};

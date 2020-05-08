import React from "react";
import { connect } from "react-redux";
import { State } from "~/domains";

const mapStateToProps = ({ cropper }: State) => cropper;

class CropperPreview extends React.Component<
  ReturnType<typeof mapStateToProps>
> {
  public render = () => {
    const { cropper, image } = this.props;
    const { position, scale, scaleX, scaleY, freeAspect } = cropper;
    const { rotate } = image;

    const sx = (freeAspect ? scaleX : scale).current;
    const sy = (freeAspect ? scaleY : scale).current;

    return (
      <svg
        viewBox={`0 0 ${cropper.width * sx} ${cropper.height * sy}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        overflow="visible"
      >
        <g clipPath="url(#clip-path-2)">
          <svg
            width={image.width * image.scale.current}
            height={image.height * image.scale.current}
            x={-position.x + image.position.x}
            y={-position.y + image.position.y}
            viewBox={`0 0 ${image.width} ${image.height}`}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            overflow="visible"
          >
            <g
              transform={`rotate(${rotate.current}, ${image.width / 2}, ${
                image.height / 2
              })`}
            >
              <image xlinkHref={image.url} width="100%" height="100%" />
            </g>
          </svg>
        </g>
        <clipPath id="clip-path-2">
          <rect
            x="0"
            y="0"
            width={cropper.width * sx}
            height={cropper.height * sy}
          />
        </clipPath>
      </svg>
    );
  };
}

export default connect(mapStateToProps)(CropperPreview);

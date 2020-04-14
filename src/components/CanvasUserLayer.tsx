import React from "react";
import { CanvasUserFrame } from "~/types/CanvasUserFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";

export default class CUL extends React.Component<{
  layer: CanvasUserLayer;
  frame: CanvasUserFrame;
}> {
  public render = () => {
    const { frame } = this.props;

    return (
      <svg
        x={frame.x}
        y={frame.y}
        width={frame.width}
        height={frame.height}
        viewBox={`0 0 ${frame.width} ${frame.height}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <clipPath id={`clip-path-${frame.id}`}>
          <path d={frame.clipPath.d} />
        </clipPath>

        <g clipPath={`url(#clip-path-${frame.id})`}>{this.renderImage()}</g>
      </svg>
    );
  };

  private renderImage = () => {
    const { layer } = this.props;

    return (
      <svg
        width={layer.width}
        height={layer.height}
        x="0"
        y="0"
        viewBox={`0 0 ${layer.width} ${layer.height}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        overflow="visible"
      >
        <g transform={`rotate(0, ${layer.width / 2}, ${layer.height / 2})`}>
          <image xlinkHref={layer.dataUrl} width="100%" height="100%" />
        </g>
      </svg>
    );
  };
}

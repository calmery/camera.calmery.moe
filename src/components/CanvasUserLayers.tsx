import React from "react";
import { CanvasLayer } from "~/types/CanvasLayer";
import { CanvasLayerTransformable } from "~/types/CanvasLayerTransformable";
import { CanvasLayerEffectable } from "~/types/CanvasLayerEffectable";

export const CanvasUserLayers = ({
  userLayers,
  userLayerClipPaths
}: {
  userLayers: (CanvasLayer &
    CanvasLayerTransformable &
    CanvasLayerEffectable)[];
  userLayerClipPaths: {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}) => (
  <>
    {userLayers.map(({ id, base64, width, height, x, y, transform }, index) => {
      const { scale, flip, rotate } = transform;

      return (
        <React.Fragment key={index}>
          <clipPath id={`clip-path-${id}`}>
            {/* コラージュ機能で画像を複数配置するためにこういう形にした。clipPath で画像を切り抜いて表示する */}
            <rect
              x={userLayerClipPaths[index].x}
              y={userLayerClipPaths[index].y}
              width={userLayerClipPaths[index].width}
              height={userLayerClipPaths[index].height}
            />
          </clipPath>
          {/* g タグでラップせずに image に直接 clipPath と translate を使うと clipPath で切り取られた画像に対して translate が適用されてしまう（clipPath 中の画像の表示位置を -20px するといったことができない） */}
          {/* ここでは LINE カメラのコラージュ機能のように clipPath で切り取った要素の表示位置は固定、内部の image だけ回転させたり動かしたりしたい */}
          <g clipPath={`url(#clip-path-${id})`}>
            <image
              filter={`url(#defs-filter-${id})`}
              xlinkHref={base64}
              width={width}
              height={height}
              transform={`translate(${x}, ${y}) scale(${scale *
                (flip
                  ? -1
                  : 1)}, ${scale}) rotate(${rotate} ${userLayerClipPaths[index]
                .width / 2} ${userLayerClipPaths[index].height / 2})`}
            />
          </g>
        </React.Fragment>
      );
    })}
  </>
);

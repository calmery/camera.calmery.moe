import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";

export const CanvasStickerLayers: React.FC = () => {
  const { stickerLayers } = useSelector(({ canvas }: State) => canvas);

  return (
    <>
      {stickerLayers.map((stickerLayer, i) => {
        const { dataUrl, angle, scale, x, y, width, height } = stickerLayer;
        const w = width * scale;
        const h = height * scale;

        return (
          <g
            key={i}
            transform={`
              translate(${x}, ${y})
              rotate(${angle}, ${w / 2}, ${h / 2})
            `}
          >
            <image xlinkHref={dataUrl} width={w} height={h} />
          </g>
        );
      })}
    </>
  );
};

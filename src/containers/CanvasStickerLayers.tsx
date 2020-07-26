import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";

export const CanvasStickerLayers: React.FC = () => {
  const { canvas, entities } = useSelector(({ canvas, entities }: State) => ({
    canvas,
    entities,
  }));
  const { stickerLayers } = canvas;

  return (
    <>
      {stickerLayers.map((stickerLayer, i) => {
        const { entityId, angle, scale, x, y } = stickerLayer;
        const { dataUrl, width, height } = entities[entityId];

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

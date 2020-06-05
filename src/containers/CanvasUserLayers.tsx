import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";
import {
  getCanvasUserFrameId,
  getCanvasUserLayerFilterId,
  getCanvasUserLayerFilterPresetId,
} from "~/utils/canvas";
import { PRESET_FILTERS } from "~/constants/filters";
import { PresetFilter } from "~/types/PresetFilter";

// Components

interface CanvasUserLayerPresetFilterProps {
  presetFilter: PresetFilter | null;
}

const CanvasUserLayerPresetFilter: React.FC<CanvasUserLayerPresetFilterProps> = ({
  presetFilter,
}) => {
  if (!presetFilter) {
    return (
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 1 0"
      />
    );
  }

  const { r, g, b, a } = PRESET_FILTERS[presetFilter];
  const factor = 1 - a;

  return (
    <>
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values={[
          [factor, 0, 0, 0, 0],
          [0, factor, 0, 0, 0],
          [0, 0, factor, 0, 0],
          [0, 0, 0, 1, 0],
        ].join(" ")}
      />
      <feComponentTransfer>
        <feFuncR type="linear" slope="1" intercept={a * (r / 255)} />
        <feFuncG type="linear" slope="1" intercept={a * (g / 255)} />
        <feFuncB type="linear" slope="1" intercept={a * (b / 255)} />
      </feComponentTransfer>
    </>
  );
};

export const CanvasUserLayers = () => {
  const { isCollaging, userFrames, userLayers } = useSelector(
    ({ canvas }: State) => canvas
  );

  return (
    <>
      {userFrames.map((userFrame, i) => {
        const userLayer = userLayers[i];

        if (!userLayer) {
          return null;
        }

        return (
          <g mask={`url(#${getCanvasUserFrameId(i)})`} key={i}>
            <g
              transform={
                isCollaging
                  ? `translate(${
                      userFrame.x +
                      userLayer.x +
                      ((userLayer.croppedWidth * userLayer.scale -
                        userLayer.croppedWidth) /
                        2) *
                        -1
                    }, ${
                      userFrame.y +
                      userLayer.y +
                      ((userLayer.croppedHeight * userLayer.scale -
                        userLayer.croppedHeight) /
                        2) *
                        -1
                    }) scale(${userLayer.scale}) rotate(${userLayer.angle}, ${
                      userLayer.croppedWidth / 2
                    }, ${userLayer.croppedHeight / 2})`
                  : undefined
              }
            >
              <svg
                width={userLayer.croppedWidth}
                height={userLayer.croppedHeight}
                viewBox={`${userLayer.croppedX} ${userLayer.croppedY} ${userLayer.croppedWidth} ${userLayer.croppedHeight}`}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <svg
                  width={userLayer.width * userLayer.croppedScale}
                  height={userLayer.height * userLayer.croppedScale}
                  x={userLayer.croppedImageX}
                  y={userLayer.croppedImageY}
                  viewBox={`0 0 ${userLayer.width} ${userLayer.height}`}
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  overflow="visible"
                >
                  <defs>
                    <filter
                      id={getCanvasUserLayerFilterId(i)}
                      colorInterpolationFilters="sRGB"
                    >
                      <feGaussianBlur stdDeviation={userLayer.blur} />
                      <feColorMatrix
                        type="hueRotate"
                        values={`${userLayer.hue}`}
                      />
                      <feColorMatrix
                        type="saturate"
                        values={`${userLayer.saturate}`}
                      />
                      <feComponentTransfer>
                        <feFuncA type="discrete" tableValues="1 1" />
                      </feComponentTransfer>
                    </filter>
                    <filter
                      id={getCanvasUserLayerFilterPresetId(i)}
                      colorInterpolationFilters="sRGB"
                    >
                      <CanvasUserLayerPresetFilter
                        presetFilter={userLayer.presetFilter}
                      />
                    </filter>
                  </defs>

                  <g filter={`url(#${getCanvasUserLayerFilterId(i)})`}>
                    <image
                      xlinkHref={userLayer.dataUrl}
                      filter={`url(#${getCanvasUserLayerFilterPresetId(i)})`}
                      width="100%"
                      height="100%"
                      transform={`rotate(${userLayer.croppedAngle}, ${
                        userLayer.width / 2
                      }, ${userLayer.height / 2})`}
                    />
                  </g>
                </svg>
              </svg>
            </g>
          </g>
        );
      })}
    </>
  );
};

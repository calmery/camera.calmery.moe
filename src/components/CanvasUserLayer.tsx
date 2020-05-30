import React from "react";
import { CanvasUserLayerFrame } from "~/types/CanvasUserLayerFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";
import { CanvasStickerLayerBorder } from "~/components/CanvasStickerLayerBorder";
import { useSelector } from "react-redux";
import { State } from "~/domains";

export const CanvasUserLayerComponent: React.FC<{
  id: number;
  layer: CanvasUserLayer;
  frame: CanvasUserLayerFrame;
  isCollaging: boolean;
  stickers: boolean;
  stickerBorder: boolean;
  onStart: (event: React.MouseEvent | React.TouchEvent) => void;
}> = (props) => {
  const { stickerLayers, displayMagnification } = useSelector(
    ({ canvas }: State) => canvas
  );
  const { id, frame, layer, onStart, isCollaging, stickerBorder } = props;

  const stickerLayer = stickerLayers[stickerLayers.length - 1];

  return (
    <svg
      x={frame.x}
      y={frame.y}
      width={frame.width}
      height={frame.height}
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ cursor: "move" }}
    >
      {!stickerBorder && (
        <defs>
          <filter
            id={`canvas-user-layer-filter-${id}`}
            colorInterpolationFilters="sRGB"
          >
            {/* Safari で stdDeviation が 0 のときに画像の色がおかしくなる。`color-interpolation-filters="sRGB"` で解決する */}
            <feGaussianBlur stdDeviation={layer.blur} />
            <feColorMatrix type="hueRotate" values={`${layer.hue}`} />
            <feColorMatrix type="saturate" values={`${layer.saturate}`} />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="1 1" />
            </feComponentTransfer>
          </filter>
        </defs>
      )}

      <clipPath id={`canvas-user-layer-frame-${id}`}>
        <path d={frame.path} />
      </clipPath>

      {!stickerBorder && (
        <g clipPath={`url(#canvas-user-layer-frame-${id})`}>
          <svg
            overflow="visible"
            x={isCollaging ? layer.x : 0}
            y={isCollaging ? layer.y : 0}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g
              transform={
                isCollaging
                  ? `translate(${
                      ((layer.croppedWidth * layer.scale - layer.croppedWidth) /
                        2) *
                      -1
                    }, ${
                      ((layer.croppedHeight * layer.scale -
                        layer.croppedHeight) /
                        2) *
                      -1
                    }) scale(${layer.scale}) rotate(${layer.angle}, ${
                      layer.croppedWidth / 2
                    }, ${layer.croppedHeight / 2})`
                  : undefined
              }
            >
              {/* TODO: 切り取った画像がめっちゃ小さくなることがある、1000px 以下の画像（適当に変更する）は拡大表示したい */}
              <svg
                width={layer.croppedWidth}
                height={layer.croppedHeight}
                viewBox={`${layer.croppedX} ${layer.croppedY} ${layer.croppedWidth} ${layer.croppedHeight}`}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                {/* TODO: ヤバイですね☆ */}
                <svg
                  width={layer.width * layer.croppedScale}
                  height={layer.height * layer.croppedScale}
                  x={layer.croppedImageX}
                  y={layer.croppedImageY}
                  viewBox={`0 0 ${layer.width} ${layer.height}`}
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  overflow="visible"
                >
                  <g
                    transform={`rotate(${layer.croppedAngle}, ${
                      layer.width / 2
                    }, ${layer.height / 2})`}
                  >
                    <image
                      xlinkHref={layer.dataUrl}
                      filter={`url(#canvas-user-layer-filter-${id})`}
                      width="100%"
                      height="100%"
                    />
                  </g>
                </svg>
              </svg>
            </g>
          </svg>
        </g>
      )}

      {stickerBorder && (
        <mask id={`canvas-user-layer-mask-${id}`} x="0" y="0">
          <g clipPath={`url(#canvas-user-layer-frame-${id})`}>
            <g
              transform={
                isCollaging
                  ? `translate(${
                      layer.x +
                      ((layer.croppedWidth * layer.scale - layer.croppedWidth) /
                        2) *
                        -1
                    }, ${
                      layer.y +
                      ((layer.croppedHeight * layer.scale -
                        layer.croppedHeight) /
                        2) *
                        -1
                    }) scale(${layer.scale}) rotate(${layer.angle}, ${
                      layer.croppedWidth / 2
                    }, ${layer.croppedHeight / 2})`
                  : undefined
              }
            >
              <rect
                fill="white"
                x={layer.croppedImageX}
                y={layer.croppedImageY}
                width={layer.croppedWidth}
                height={layer.croppedHeight}
                transform={`

                      rotate(
                        ${layer.croppedAngle},
                        ${layer.width / 2},
                        ${layer.height / 2}
                      )
                    `}
              />
            </g>
          </g>
        </mask>
      )}

      {stickerBorder && props.stickers && stickerLayer && (
        <g mask={`url(#canvas-user-layer-mask-${id})`}>
          <CanvasStickerLayerBorder
            baseX={frame.x}
            baseY={frame.y}
            displayMagnification={displayMagnification}
            stickerLayer={stickerLayer}
            backgroundBrightness={layer.dominantColorLightness}
          />
        </g>
      )}

      <g clipPath={`url(#canvas-user-layer-frame-${id})`}>
        <rect
          width={frame.width}
          height={frame.height}
          fillOpacity={0}
          onTouchStart={onStart}
          onMouseDown={onStart}
        />
      </g>
    </svg>
  );
};

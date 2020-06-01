import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { getCanvasUserFrameId } from "~/utils/canvas";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

// Styles

const RectWithMove = styled.rect`
  cursor: move;
`;

const CircleWithPointer = styled.circle`
  cursor: pointer;
`;

const CircleWithResize = styled.circle`
  cursor: se-resize;
`;

// Child Components

interface BorderProps {
  color: string;
  displayMagnification: number;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  r: number;
  mask?: string;
}

const Border: React.FC<BorderProps> = ({
  color,
  displayMagnification,
  x,
  y,
  width,
  height,
  angle,
  r,
  mask,
}) => (
  <g
    transform={`translate(${x}, ${y}) rotate(${angle}, ${width / 2}, ${
      height / 2
    })`}
    mask={mask}
  >
    <RectWithMove
      x="0"
      y="0"
      width={width}
      height={height}
      stroke={color}
      strokeWidth={2 * displayMagnification}
      strokeDasharray={`${4 * displayMagnification} ${
        2 * displayMagnification
      }`}
      fillOpacity="0"
    />
    <CircleWithPointer cx={width} cy="0" r={r} fill={color} />
    <CircleWithResize cx={width} cy={height} r={r} fill={color} />
  </g>
);

// Components

export const CanvasStickerLayerOperator: React.FC = () => {
  const dispatch = useDispatch();
  const {
    isCollaging,
    displayMagnification,
    stickerLayers,
    userLayers,
    userFrames,
  } = useSelector(({ canvas }: State) => canvas);

  // Events

  const handleOnChangeOrder = useCallback(
    (i: number) => dispatch(actions.changeCanvasStickerLayerOrder(i)),
    [dispatch]
  );

  const handleOnRemove = useCallback(
    () => dispatch(actions.removeCanvasStickerLayer()),
    [dispatch]
  );

  const handleOnTransform = (event: React.MouseEvent | React.TouchEvent) => {
    const [{ x, y }] = convertEventToCursorPositions(event);
    dispatch(actions.startCanvasStickerLayerTransform(x, y));
  };

  const handleOnStartDrag = (event: React.MouseEvent | React.TouchEvent) =>
    dispatch(
      actions.startCanvasStickerLayerDrag(convertEventToCursorPositions(event))
    );

  // Render

  return (
    <>
      {stickerLayers
        .slice(0, stickerLayers.length - 1)
        .map(({ x, y, width, height, angle, scale }, i) => {
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
              <rect
                width={w}
                height={h}
                fillOpacity="0"
                onClick={() => handleOnChangeOrder(i)}
                onTouchStart={(event) => {
                  handleOnChangeOrder(i);
                  handleOnStartDrag(event);
                }}
              />
            </g>
          );
        })}
      {(() => {
        const stickerLayer = stickerLayers[stickerLayers.length - 1];

        if (!stickerLayer) {
          return null;
        }

        const { x, y, width, height, angle, scale } = stickerLayer;
        const w = width * scale;
        const h = height * scale;
        const r = 12 * displayMagnification;
        const color = "#3c3c3c"; // backgroundBrightness > 0.5 ? "#3c3c3c" : "#fff";

        return (
          <>
            <Border
              color={color}
              displayMagnification={displayMagnification}
              x={x}
              y={y}
              width={w}
              height={h}
              angle={angle}
              r={r}
            />
            {userLayers.map((userLayer, i) => {
              if (!userLayer) {
                return null;
              }

              const userFrame = userFrames[i];
              const id = `canvas-sticker-layer-operator-${i}`;

              return (
                <>
                  <mask id={id}>
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
                              }) scale(${userLayer.scale}) rotate(${
                                userLayer.angle
                              }, ${userLayer.croppedWidth / 2}, ${
                                userLayer.croppedHeight / 2
                              })`
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
                            <rect
                              fill="white"
                              width="100%"
                              height="100%"
                              transform={`rotate(${userLayer.croppedAngle}, ${
                                userLayer.width / 2
                              }, ${userLayer.height / 2})`}
                            />
                          </svg>
                        </svg>
                      </g>
                    </g>
                  </mask>
                  <Border
                    mask={`url(#${id})`}
                    color={
                      userLayer.dominantColorLightness > 0.5
                        ? "#3c3c3c"
                        : "#fff"
                    }
                    displayMagnification={displayMagnification}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    angle={angle}
                    r={r}
                  />
                </>
              );
            })}
            <g
              transform={`translate(${x}, ${y}) rotate(${angle}, ${w / 2}, ${
                h / 2
              })`}
            >
              <RectWithMove
                x="0"
                y="0"
                width={w}
                height={h}
                fillOpacity="0"
                onMouseDown={handleOnStartDrag}
                onTouchStart={handleOnStartDrag}
              />
              <CircleWithPointer
                cx={w}
                cy="0"
                r={r}
                fillOpacity="0"
                onClick={handleOnRemove}
              />
              <CircleWithResize
                cx={w}
                cy={h}
                r={r}
                fillOpacity="0"
                onMouseDown={handleOnTransform}
                onTouchStart={handleOnTransform}
              />
            </g>
          </>
        );
      })()}
    </>
  );
};

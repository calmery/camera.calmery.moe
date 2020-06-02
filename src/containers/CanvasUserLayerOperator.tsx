import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "~/domains";
import { actions, thunkActions } from "~/domains/canvas/actions";
import { getImageFile } from "~/utils/get-image-file";
import { CanvasColors } from "~/styles/colors";
import { getColorByDominantColorLightness } from "~/utils/canvas";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

// Styles

const PathWithPointer = styled.path`
  cursor: pointer;
`;

const PathWithMove = styled.path`
  cursor: move;
`;

const CircleWithPointer = styled.circle`
  cursor: pointer;
`;

const ImageWithPointer = styled.image`
  cursor: pointer;
`;

// Types

interface CanvasUserLayerOperatorProps {
  removable: boolean;
}

// Components

export const CanvasUserLayerOperator: React.FC<CanvasUserLayerOperatorProps> = ({
  removable,
}) => {
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const { displayMagnification, userFrames, userLayers } = canvas;

  // Events

  const handleOnStartDrag = useCallback(
    (i: number, event: React.MouseEvent | React.TouchEvent) => {
      dispatch(
        actions.startCanvasUserLayerDrag(
          i,
          convertEventToCursorPositions(event)
        )
      );
    },
    [dispatch]
  );

  const handleOnLoadImage = useCallback(
    async (i: number) => {
      try {
        const image = await getImageFile();
        // ToDo: Loading
        await dispatch(thunkActions.addCanvasUserLayerFromFile(image, i));
      } catch (_) {
        // ToDo: Sentry
      } finally {
        // ToDo: Loading
      }
    },
    [dispatch]
  );

  const handleOnRemove = (i: number) => {
    dispatch(actions.removeCanvasUserLayer(i));
  };

  // Render

  return (
    <>
      {userFrames.map((userFrame, i) => {
        const { x, y, width, height, path } = userFrame;
        const userLayer = userLayers[i];
        const addImageIconSize = 64 * displayMagnification;

        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            {userLayer ? (
              <PathWithMove
                d={path}
                fillOpacity="0"
                onTouchStart={(e) => handleOnStartDrag(i, e)}
                onMouseDown={(e) => handleOnStartDrag(i, e)}
              />
            ) : (
              <>
                <PathWithPointer
                  d={path}
                  fill="#fff"
                  onClick={() => handleOnLoadImage(i)}
                  stroke={CanvasColors.border}
                  strokeDasharray={`${4 * displayMagnification} ${
                    2 * displayMagnification
                  }`}
                  strokeWidth={displayMagnification}
                />
                <ImageWithPointer
                  x={width / 2 - addImageIconSize / 2}
                  y={height / 2 - addImageIconSize / 2}
                  width={addImageIconSize}
                  xlinkHref="/images/containers/image.svg"
                />
              </>
            )}
          </g>
        );
      })}
      {removable &&
        userFrames.map((userFrame, i) => {
          const userLayer = userLayers[i];

          if (!userLayer) {
            return null;
          }

          const { dominantColorLightness } = userLayer;
          const { x, y, width } = userFrame;
          const r = 12 * displayMagnification;

          return (
            <g key={i}>
              <CircleWithPointer
                fill={getColorByDominantColorLightness(dominantColorLightness)}
                cx={x + width}
                cy={y}
                r={r}
                onClick={() => handleOnRemove(i)}
              />
              <ImageWithPointer
                xlinkHref="/images/close.svg"
                width={r}
                height={r}
                x={x + width - r / 2}
                y={y - r / 2}
                onClick={() => handleOnRemove(i)}
              />
            </g>
          );
        })}
    </>
  );
};

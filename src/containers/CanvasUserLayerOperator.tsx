import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "~/domains";
import { actions, thunkActions } from "~/domains/canvas/actions";
import { getImageFile } from "~/utils/get-image-file";
import { CanvasColors } from "~/styles/colors";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

// Styles

const PathWithPointer = styled.path`
  cursor: pointer;
`;

const PathWithMove = styled.path`
  cursor: move;
`;

// Components

export const CanvasUserLayerOperator: React.FC = () => {
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

  // Render

  return (
    <>
      {userFrames.map((userFrame, i) => {
        const { x, y, path } = userFrame;
        const userLayer = userLayers[i];

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
            )}
          </g>
        );
      })}
    </>
  );
};

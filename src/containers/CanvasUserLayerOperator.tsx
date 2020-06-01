import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "~/domains";
import { thunkActions } from "~/domains/canvas/actions";
import { getCanvasUserFrameId } from "~/utils/canvas";
import { getImageFile } from "~/utils/get-image-file";
import { CanvasColors } from "~/styles/colors";

// Styles

const PathWithPointer = styled.path`
  cursor: pointer;
`;

const PathWithMove = styled.rect`
  cursor: move;
`;

// Components

export const CanvasUserLayerOperator: React.FC = () => {
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const { displayMagnification, userFrames, userLayers } = canvas;

  // Events

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
              <PathWithMove d={path} fillOpacity="0" />
            ) : (
              <PathWithPointer
                d={path}
                fill="#fff"
                onClick={() => handleOnLoadImage(i)}
                stroke={CanvasColors.border}
                strokeDasharray="8 8"
                strokeWidth={displayMagnification}
              />
            )}
          </g>
        );
      })}
    </>
  );
};

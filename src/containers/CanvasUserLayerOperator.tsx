import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { CloseIcon } from "~/components/CloseIcon";
import { State } from "~/domains";
import { actions, thunkActions } from "~/domains/canvas/actions";
import { actions as uiActions } from "~/domains/ui/actions";
import { getImageFile } from "~/utils/get-image-file";
import { CanvasColors } from "~/styles/colors";
import { getColorByDominantColorLightness } from "~/utils/canvas";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

// Styles

const PathWithPointer = styled.path`
  cursor: pointer;
`;

const PathWithMove = styled.path<{
  isCollaging: boolean;
  isShiftKey: boolean;
  isControlKey: boolean;
}>`
  ${({ isCollaging, isShiftKey, isControlKey }) => {
    if (!isCollaging) {
      return css`
        cursor: auto;
      `;
    }

    if (isShiftKey) {
      return css`
        cursor: url("/images/containers/rotate.svg"), auto;
      `;
    }

    if (isControlKey) {
      return css`
        cursor: se-resize;
      `;
    }

    return css`
      cursor: move;
    `;
  }};
`;

const CircleWithPointer = styled.circle`
  cursor: pointer;
`;

const SvgWithPointer = styled.svg`
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
  const {
    displayMagnification,
    userFrames,
    userLayers,
    isCollaging,
    isShiftKey,
    isControlKey,
  } = canvas;

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
      const image = await getImageFile();
      dispatch(uiActions.startLoading());
      try {
        await dispatch(thunkActions.addCanvasUserLayerFromFile(image, i));
      } catch (error) {
        dispatch(uiActions.imageLoadError(true));
        throw error;
      } finally {
        dispatch(uiActions.finishLoading());
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
                isCollaging={isCollaging}
                isShiftKey={isShiftKey}
                isControlKey={isControlKey}
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
                <SvgWithPointer
                  width={addImageIconSize}
                  height={addImageIconSize}
                  x={width / 2 - addImageIconSize / 2}
                  y={height / 2 - addImageIconSize / 2}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.41513 4.31676C3.58543 4.48324 3.67059 4.68671 3.67059 4.92717C3.67059 5.16763 3.58543 5.3711 3.41513 5.53757C3.25378 5.70405 3.05658 5.78728 2.82353 5.78728C2.59048 5.78728 2.39328 5.70405 2.23193 5.53757C2.07059 5.3711 1.98992 5.16763 1.98992 4.92717C1.98992 4.68671 2.07059 4.48324 2.23193 4.31676C2.39328 4.14104 2.59048 4.05318 2.82353 4.05318C3.05658 4.05318 3.25378 4.14104 3.41513 4.31676V4.31676ZM7.51857 9.8659H2.00336C1.90476 9.8659 1.84202 9.84277 1.81513 9.79653C1.7972 9.74104 1.82409 9.68093 1.8958 9.61619L3.52269 7.95145C3.5944 7.87746 3.67059 7.84046 3.75126 7.84046C3.8409 7.84046 3.92157 7.87746 3.99328 7.95145L4.5042 8.47861C4.57591 8.5526 4.65658 8.5896 4.74622 8.5896C4.83585 8.5896 4.91653 8.5526 4.98823 8.47861L7.59664 5.78728C7.66835 5.71329 7.74454 5.6763 7.82521 5.6763C7.91485 5.6763 7.99552 5.71329 8.06723 5.78728L9.27865 7.04306C9.97287 6.55392 10.8196 6.26667 11.7333 6.26667C11.7528 6.26667 11.7722 6.2668 11.7916 6.26706V3.38728C11.7916 3.28555 11.7602 3.20231 11.6975 3.13757C11.6347 3.07283 11.5541 3.04046 11.4555 3.04046H1.34454C1.24594 3.04046 1.16527 3.07283 1.10252 3.13757C1.03978 3.20231 1.0084 3.28555 1.0084 3.38728V10.2127C1.0084 10.3145 1.03978 10.3977 1.10252 10.4624C1.16527 10.5272 1.24594 10.5595 1.34454 10.5595H7.46675L7.46667 10.5333C7.46667 10.3063 7.4844 10.0834 7.51857 9.8659V9.8659ZM12.8 2.6659V6.40109C14.6402 6.87473 16 8.54524 16 10.5333C16 12.8897 14.0897 14.8 11.7333 14.8C9.74524 14.8 8.07473 13.4402 7.60109 11.6H0.631933C0.452661 11.6 0.30028 11.5353 0.17479 11.4058C0.0582633 11.2763 0 11.1191 0 10.9341V2.6659C0 2.48092 0.0582633 2.3237 0.17479 2.19422C0.30028 2.06474 0.452661 2 0.631933 2H12.1681C12.3473 2 12.4952 2.06474 12.6118 2.19422C12.7373 2.3237 12.8 2.48092 12.8 2.6659V2.6659ZM11.7333 13.8C13.5375 13.8 15 12.3375 15 10.5333C15 8.7292 13.5375 7.26667 11.7333 7.26667C9.9292 7.26667 8.46667 8.7292 8.46667 10.5333C8.46667 12.3375 9.9292 13.8 11.7333 13.8ZM13.7042 9.98646H12.2802V8.56244C12.2802 8.51912 12.264 8.48122 12.2315 8.44873C12.199 8.41624 12.1611 8.4 12.1178 8.4H11.3489C11.3056 8.4 11.2677 8.41624 11.2352 8.44873C11.2027 8.48122 11.1865 8.51912 11.1865 8.56244V9.98646H9.76244C9.71912 9.98646 9.68122 10.0027 9.64873 10.0352C9.61624 10.0677 9.6 10.1056 9.6 10.1489V10.9178C9.6 10.9611 9.61624 10.999 9.64873 11.0315C9.68122 11.064 9.71912 11.0802 9.76244 11.0802H11.1865V12.5042C11.1865 12.5475 11.2027 12.5854 11.2352 12.6179C11.2677 12.6504 11.3056 12.6667 11.3489 12.6667H12.1178C12.1611 12.6667 12.199 12.6504 12.2315 12.6179C12.264 12.5854 12.2802 12.5475 12.2802 12.5042V11.0802H13.7042C13.7475 11.0802 13.7854 11.064 13.8179 11.0315C13.8504 10.999 13.8667 10.9611 13.8667 10.9178V10.1489C13.8667 10.1056 13.8504 10.0677 13.8179 10.0352C13.7854 10.0027 13.7475 9.98646 13.7042 9.98646Z"
                    fill="#B4B4B4"
                  />
                </SvgWithPointer>
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
          const rMargin = 8 * displayMagnification;
          const cx = x + width - r - rMargin;
          const cy = y + r + rMargin;

          return (
            <g key={i}>
              <circle
                fill={getColorByDominantColorLightness(dominantColorLightness)}
                cx={cx}
                cy={cy}
                r={r}
              />
              <CloseIcon x={cx - r / 2} y={cy - r / 2} r={r} />
              <CircleWithPointer
                fillOpacity="0"
                cx={cx}
                cy={cy}
                r={r}
                onClick={() => handleOnRemove(i)}
              />
            </g>
          );
        })}
    </>
  );
};

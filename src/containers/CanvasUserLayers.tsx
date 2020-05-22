import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CanvasUserLayerComponent } from "~/components/CanvasUserLayer";
import { CanvasEmptyUserLayer } from "~/containers/CanvasEmptyUserLayer";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";
import { useRouter } from "next/router";
import { Colors } from "~/styles/colors";

export const CanvasUserLayers: React.FC<{ save: boolean }> = ({ save }) => {
  const dispatch = useDispatch();
  const { pathname } = useRouter();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const users = canvas;

  const handleOnRemove = (index: number) => {
    dispatch(actions.removeCanvasUserLayer(index));
  };

  const handleOnStart = useCallback(
    (index: number, event: React.MouseEvent | React.TouchEvent) => {
      !save &&
        dispatch(
          actions.startCanvasUserLayerDrag(
            index,
            convertEventToCursorPositions(event)
          )
        );
    },
    [dispatch]
  );

  let layerCount = 0;

  users.userLayers.forEach((layer) => {
    if (layer) {
      layerCount += 1;
    }
  });

  return (
    <>
      {users.userFrames.map((_, i: number) => {
        const layer = users.userLayers[i];
        const frame = users.userFrames[i];

        if (layer) {
          return (
            <CanvasUserLayerComponent
              layer={layer}
              frame={frame}
              id={i}
              isCollaging={canvas.isCollaging}
              key={i}
              onStart={(event) => handleOnStart(i, event)}
            />
          );
        }

        // save モードでは CanvasemptyLayer は表示しない
        if (save) {
          return null;
        }

        return <CanvasEmptyUserLayer frame={frame} index={i} key={i} />;
      })}
      {!save &&
        layerCount > 1 &&
        pathname === "/collage" &&
        users.userFrames.map((_, i) => {
          const layer = users.userLayers[i];
          const frame = users.userFrames[i];

          if (!layer) {
            return null;
          }

          return (
            <circle
              key={i}
              fill={Colors.gray}
              cx={frame.x + frame.width}
              cy={frame.y}
              r={12 * canvas.displayMagnification}
              style={{
                cursor: "pointer",
              }}
              onClick={() => handleOnRemove(i)}
            />
          );
        })}
    </>
  );
};

import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CanvasUserLayerComponent } from "~/components/CanvasUserLayer";
import { CanvasEmptyUserLayer } from "~/containers/CanvasEmptyUserLayer";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";
import { useRouter } from "next/router";
import { Colors } from "~/styles/colors";

export const CanvasUserLayers: React.FC = () => {
  const dispatch = useDispatch();
  const { pathname } = useRouter();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const { users } = canvas;

  const handleOnRemove = (index: number) => {
    dispatch(actions.removeCanvasUserLayer(index));
  };

  const handleOnStart = useCallback(
    (
      index: number,
      clipPathX: number,
      clipPathY: number,
      event: MouseEvent | TouchEvent
    ) => {
      dispatch(
        actions.startCanvasUserLayerDrag(
          index,
          clipPathX,
          clipPathY,
          convertEventToCursorPositions(event)
        )
      );
    },
    [dispatch]
  );

  const handleOnMove = useCallback(
    (
      index: number,
      clipPathX: number,
      clipPathY: number,
      event: MouseEvent | TouchEvent
    ) => {
      dispatch(
        actions.tickCanvasUserLayer(
          index,
          clipPathX,
          clipPathY,
          convertEventToCursorPositions(event)
        )
      );
    },
    [dispatch]
  );

  let layerCount = 0;

  users.layers.forEach((layer) => {
    if (layer) {
      layerCount += 1;
    }
  });

  return (
    <>
      {users.frames.map((_, i: number) => {
        const layer = users.layers[i];
        const frame = users.frames[i];

        if (layer) {
          return (
            <CanvasUserLayerComponent
              layer={layer}
              frame={frame}
              enabledCollage={canvas.users.enabledCollage}
              key={i}
              onStart={(clipPath: DOMRect, event: MouseEvent | TouchEvent) =>
                handleOnStart(i, clipPath.x, clipPath.y, event)
              }
              onMove={(clipPath: DOMRect, event: MouseEvent | TouchEvent) =>
                handleOnMove(i, clipPath.x, clipPath.y, event)
              }
            />
          );
        }

        return <CanvasEmptyUserLayer frame={frame} index={i} key={i} />;
      })}
      {layerCount > 1 &&
        pathname === "/collage" &&
        users.frames.map((_, i) => {
          const layer = users.layers[i];
          const frame = users.frames[i];

          if (!layer) {
            return null;
          }

          return (
            <circle
              key={i}
              fill={Colors.gray}
              cx={frame.x + frame.width}
              cy={frame.y}
              r={12 * canvas.container.displayRatio}
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

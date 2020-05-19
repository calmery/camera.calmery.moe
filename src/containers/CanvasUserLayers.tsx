import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CanvasUserLayerComponent } from "~/components/CanvasUserLayer";
import { CanvasEmptyUserLayer } from "~/containers/CanvasEmptyUserLayer";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

export const CanvasUserLayers: React.FC = () => {
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const { users } = canvas;

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
    </>
  );
};

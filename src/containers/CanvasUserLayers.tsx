import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CanvasUserLayerComponent } from "~/components/CanvasUserLayer";
import { CanvasEmptyUserLayer } from "~/components/CanvasEmptyUserLayer";
import { State } from "~/domains";
import { actions, thunkActions } from "~/domains/canvas/actions";
import { getImageFile } from "~/utils/get-image-file";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

export const CanvasUserLayers: React.FC = () => {
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const { frames, layers, displayRatio } = canvas;

  const handOnClickEmptyUserImage = async (index: number) => {
    dispatch(
      thunkActions.addCanvasUserLayerFromFile(await getImageFile(), index)
    );
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
        actions.setCanvasUserLayerPosition(
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
      {frames.users.map((_, i: number) => {
        const layer = layers.users[i];
        const frame = frames.users[i];

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

        return (
          <CanvasEmptyUserLayer
            frame={frame}
            onClick={() => handOnClickEmptyUserImage(i)}
            key={i}
          />
        );
      })}
    </>
  );
};

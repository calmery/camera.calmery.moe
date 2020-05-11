import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import CanvasUserLayer from "~/components/CanvasUserLayer";
import CanvasEmptyUserLayer from "~/components/CanvasEmptyUserLayer";
import { State } from "~/domains";
import { actions, thunkActions } from "~/domains/canvas/actions";
import { getImageFile } from "~/utils/get-image-file";

export const CanvasUserLayers: React.FC = () => {
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const { frames, layers, displayRatio } = canvas;

  const handleOnStart = useCallback(
    (
      index: number,
      differenceFromStartingX: number,
      differenceFromStartingY: number
    ) => {
      dispatch(
        actions.setCanvasUserLayerStartingPosition(
          index,
          differenceFromStartingX,
          differenceFromStartingY
        )
      );
    },
    [dispatch]
  );

  const handleOnMove = useCallback(
    (index: number, nextX: number, nextY: number) => {
      dispatch(actions.updateCanvasUserLayerPosition(index, nextX, nextY));
    },
    [dispatch]
  );

  const handOnClickEmptyUserImage = async (index: number) => {
    dispatch(thunkActions.addUserImageFromFile(await getImageFile(), index));
  };

  return (
    <>
      {frames.users.map((_, i: number) => {
        const layer = layers.users[i];
        const frame = frames.users[i];

        if (layer) {
          return (
            <CanvasUserLayer
              layer={layer}
              frame={frame}
              key={i}
              displayRatio={displayRatio}
              onStart={(x, y) => handleOnStart(i, x, y)}
              onMove={(x, y) => handleOnMove(i, x, y)}
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

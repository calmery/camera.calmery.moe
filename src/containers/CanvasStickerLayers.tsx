import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CanvasStickerLayerComponent } from "~/components/CanvasStickerLayer";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

export const CanvasStickerLayers: React.FC = () => {
  const dispatch = useDispatch();
  const { layers, displayRatio } = useSelector(({ canvas }: State) => canvas);

  const handleOnSelect = useCallback(
    (index: number) => dispatch(actions.setCanvasStickerLayerActive(index)),
    [dispatch]
  );

  const handleOnClickRemoveButton = useCallback(
    () => dispatch(actions.removeCanvasStickerLayer()),
    [dispatch]
  );

  const handleOnPressTransformCircle = (
    index: number,
    event: React.MouseEvent | React.TouchEvent
  ) => {
    const [{ x, y }] = convertEventToCursorPositions(event);
    dispatch(actions.startCanvasStickerLayerTransform(index, x, y));
  };

  const handleOnPress = (
    index: number,
    event: React.MouseEvent | React.TouchEvent
  ) =>
    dispatch(
      actions.startCanvasStickerLayerDrag(
        index,
        convertEventToCursorPositions(event)
      )
    );

  return (
    <>
      {layers.stickers.map((sticker, index) => {
        return (
          <CanvasStickerLayerComponent
            key={index}
            displayRatio={displayRatio}
            selected={index === layers.stickers.length - 1}
            handleOnClickRemoveButton={handleOnClickRemoveButton}
            handleOnPress={(event) => handleOnPress(index, event)}
            handleOnPressTransformCircle={(event) =>
              handleOnPressTransformCircle(index, event)
            }
            handleOnSelect={() => handleOnSelect(index)}
            sticker={sticker}
          />
        );
      })}
    </>
  );
};

import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CanvasStickerLayerComponent } from "~/components/CanvasStickerLayer";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

export const CanvasStickerLayers: React.FC = () => {
  const dispatch = useDispatch();
  const { stickers, container } = useSelector(({ canvas }: State) => canvas);

  const handleOnSelect = useCallback(
    (index: number) => dispatch(actions.setCanvasStickerLayerActive(index)),
    [dispatch]
  );

  const handleOnClickRemoveButton = useCallback(
    () => dispatch(actions.removeCanvasStickerLayer()),
    [dispatch]
  );

  const handleOnPressTransformCircle = (
    event: React.MouseEvent | React.TouchEvent
  ) => {
    const [{ x, y }] = convertEventToCursorPositions(event);
    dispatch(actions.startCanvasStickerLayerTransform(x, y));
  };

  const handleOnPress = (event: React.MouseEvent | React.TouchEvent) =>
    dispatch(
      actions.startCanvasStickerLayerDrag(convertEventToCursorPositions(event))
    );

  return (
    <>
      {stickers.layers.map((sticker, index) => {
        return (
          <CanvasStickerLayerComponent
            key={index}
            displayRatio={container.displayRatio}
            selected={index === stickers.layers.length - 1}
            handleOnClickRemoveButton={handleOnClickRemoveButton}
            handleOnPress={handleOnPress}
            handleOnPressTransformCircle={handleOnPressTransformCircle}
            handleOnSelect={() => handleOnSelect(index)}
            sticker={sticker}
          />
        );
      })}
    </>
  );
};

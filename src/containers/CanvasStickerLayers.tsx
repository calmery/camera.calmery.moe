import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CanvasStickerLayer } from "~/components/CanvasStickerLayer";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";

export const CanvasStickerLayers: React.FC<{ preview: boolean }> = ({
  preview,
}) => {
  const dispatch = useDispatch();
  const { displayMagnification, stickerLayers } = useSelector(
    ({ canvas }: State) => canvas
  );

  const handleOnSelect = useCallback(
    (index: number) => dispatch(actions.changeCanvasStickerLayerOrder(index)),
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
      {stickerLayers.map((sticker, index) => {
        return (
          <CanvasStickerLayer
            key={index}
            displayMagnification={displayMagnification}
            selected={!preview && index === stickerLayers.length - 1}
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

import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CanvasStickerLayerComponent } from "~/components/CanvasStickerLayer";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";

export const CanvasStickerLayers: React.FC = () => {
  const dispatch = useDispatch();
  const { layers, displayRatio, x, y } = useSelector(
    ({ canvas }: State) => canvas
  );

  const handleOnstartCropperTransforming = useCallback(
    (index: number, previousLength: number) => {
      dispatch(actions.startCanvasStickerLayerTransform(index, previousLength));
    },
    [dispatch]
  );

  const handleOnStartMultiTouchingTransform = useCallback(
    (index: number, previousLength: number, startingAngle: number) => {
      dispatch(
        actions.startCanvasStickerLayerMultiTouchingTransform(
          index,
          previousLength,
          startingAngle
        )
      );
    },
    [dispatch]
  );

  const handleOnstartCropperMoving = useCallback(
    (index: number, referenceX: number, referenceY: number) => {
      dispatch(
        actions.startCanvasStickerLayerDrag(index, referenceX, referenceY)
      );
    },
    [dispatch]
  );

  const handleOnClick = useCallback(
    (index: number) => {
      dispatch(actions.changeActiveCanvasStickerLayer(index));
    },
    [dispatch]
  );

  const removeCanvasStickerLayer = useCallback(() => {
    dispatch(actions.removeCanvasStickerLayer());
  }, [dispatch]);

  return (
    <>
      {layers.stickers.map((sticker, index) => (
        <CanvasStickerLayerComponent
          key={index}
          selected={index === layers.stickers.length - 1}
          {...sticker}
          displayRatio={displayRatio}
          startCropperTransforming={(l) =>
            handleOnstartCropperTransforming(index, l)
          }
          startMultiTouchingTransform={(l, a) =>
            handleOnStartMultiTouchingTransform(index, l, a)
          }
          startCropperMoving={(x, y) => handleOnstartCropperMoving(index, x, y)}
          canvasBaseX={x}
          canvasBaseY={y}
          onClick={() => handleOnClick(index)}
          onClickRemoveButton={removeCanvasStickerLayer}
        />
      ))}
    </>
  );
};

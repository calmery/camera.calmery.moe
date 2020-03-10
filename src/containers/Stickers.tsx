import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addStickerLayerWithUrl } from "~/modules/canvas/actions";

export const Stickers = () => {
  const dispatch = useDispatch();
  const onClickAddSticker = useCallback(() => {
    dispatch(addStickerLayerWithUrl("/images/logos/camera.calmery.moe.svg"));
  }, []);

  return <button onClick={onClickAddSticker}>Add</button>;
};

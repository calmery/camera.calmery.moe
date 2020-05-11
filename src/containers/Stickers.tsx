import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addCanvasStickerLayerWithUrl } from "~/domains/canvas/actions";

export const Stickers = () => {
  const dispatch = useDispatch();
  const onClickAddStickerButton = useCallback(
    (url: string) => dispatch(addCanvasStickerLayerWithUrl(url)),
    []
  );

  return (
    <>
      <button
        onClick={() => onClickAddStickerButton("/images/stickers/15.png")}
      >
        /images/stickers/15.png
      </button>
    </>
  );
};

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addStickerLayerWithUrl } from "~/domains/canvas/actions";

export const Stickers = () => {
  const dispatch = useDispatch();
  const onClickAddStickerButton = useCallback(
    (url: string) => dispatch(addStickerLayerWithUrl(url)),
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

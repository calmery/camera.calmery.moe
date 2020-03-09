import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/modules";
import { CanvasUserLayers } from "~/components/CanvasUserLayers";
import { CanvasStickerLayers } from "~/components/CanvasStickerLayers";
import { CanvasEssentialLayers } from "~/components/CanvasEssentialLayers";

export const CanvasLayers = () => {
  const {
    userLayers,
    stickerLayers,
    essentialLayers,
    userLayerClipPaths
  } = useSelector(({ canvas }: State) => canvas);

  return (
    <>
      <CanvasUserLayers
        userLayers={userLayers}
        userLayerClipPaths={userLayerClipPaths}
      />
      <CanvasStickerLayers stickerLayers={stickerLayers} />
      <CanvasEssentialLayers essentialLayers={essentialLayers} />
    </>
  );
};

import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/modules";
import { CanvasUserLayers } from "~/components/canvas-user-layers";
import { CanvasStickerLayers } from "~/components/canvas-sticker-layers";
import { CanvasEssentialLayers } from "~/components/canvas-essential-layers";

// Main

const CanvasLayers = () => {
  const { userLayers, stickerLayers, essentialLayers } = useSelector(
    ({ canvas }: State) => canvas
  );

  return (
    <>
      <CanvasUserLayers userLayers={userLayers} />
      <CanvasStickerLayers stickerLayers={stickerLayers} />
      <CanvasEssentialLayers essentialLayers={essentialLayers} />
    </>
  );
};

export default CanvasLayers;

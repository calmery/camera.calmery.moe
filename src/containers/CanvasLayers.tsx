import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/modules";
import { CanvasUserLayers } from "~/components/CanvasUserLayers";
import { CanvasStickerLayers } from "~/components/CanvasStickerLayers";
import { CanvasEssentialLayers } from "~/components/CanvasEssentialLayers";

export const CanvasLayers = (props: {
  onMouseDown: (
    event: React.MouseEvent<SVGImageElement, MouseEvent>,
    index: number
  ) => void;
  onMouseUp: (
    event: React.MouseEvent<SVGImageElement, MouseEvent>,
    index: number
  ) => void;
  onTouchStart: (
    event: React.TouchEvent<SVGImageElement>,
    index: number
  ) => void;
  onTouchEnd: (event: React.TouchEvent<SVGImageElement>, index: number) => void;
}) => {
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
      <CanvasStickerLayers {...props} stickerLayers={stickerLayers} />
      <CanvasEssentialLayers essentialLayers={essentialLayers} />
    </>
  );
};

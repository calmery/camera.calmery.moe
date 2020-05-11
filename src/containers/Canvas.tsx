import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import CanvasUserLayers from "./CanvasUserLayers";
import CanvasStickerLayers from "./CanvasStickerLayers";
import { State } from "~/domains";
import * as actions from "~/domains/canvas/actions";
import { CanvasFilters } from "./CanvasFilters";

// Redux

const mapStateToProps = ({ canvas }: State) => canvas;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, actions.Actions>
) => ({
  removeUserImage: (index: number) => dispatch(actions.removeUserImage(index)),
  updateDisplayRatio: (
    displayX: number,
    displayY: number,
    displayWidth: number
  ) => dispatch(actions.updateDisplayRatio(displayX, displayY, displayWidth)),
  complete: () => dispatch(actions.complete()),
  progressCanvasStickerLayerDrag: (x: number, y: number) =>
    dispatch(actions.progressCanvasStickerLayerDrag(x, y)),
  progressCanvasStickerLayerTransform: (
    x: number,
    y: number,
    scale: number,
    angle: number
  ) =>
    dispatch(actions.progressCanvasStickerLayerTransform(x, y, scale, angle)),
});

// Main

class Canvas extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  private ref = React.createRef<SVGSVGElement>();

  public componentDidMount = () => {
    const e = this.ref.current!;

    e.addEventListener("mouseup", this.handleOnComplete);
    e.addEventListener("touchend", this.handleOnComplete);
    e.addEventListener("mouseleave", this.handleOnComplete);
    e.addEventListener("mousemove", this.handleOnMouseMove);
    e.addEventListener("touchmove", this.handleOnTouchMove, { passive: false });
    addEventListener("resize", this.handleOnResizeWindow);

    this.handleOnResizeWindow();
  };

  public componentWillUnmount = () => {
    const e = this.ref.current!;

    e.removeEventListener("mouseup", this.handleOnComplete);
    e.removeEventListener("touchend", this.handleOnComplete);
    e.removeEventListener("mouseleave", this.handleOnComplete);
    e.removeEventListener("mousemove", this.handleOnMouseMove);
    e.removeEventListener("touchmove", this.handleOnTouchMove);
    removeEventListener("resize", this.handleOnResizeWindow);
  };

  public render = () => {
    const { width, height } = this.props;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        ref={this.ref}
      >
        <CanvasFilters />
        <CanvasUserLayers />
        <CanvasStickerLayers />
      </svg>
    );
  };

  private handleOnResizeWindow = () => {
    const { updateDisplayRatio } = this.props;
    const s = this.ref.current!;
    const { width, x, y } = s.getBoundingClientRect();

    updateDisplayRatio(x, y, width);
  };

  private handleOnComplete = () => {
    const { complete } = this.props;

    complete();
  };

  private handleOnMove = (positions: { x: number; y: number }[]) => {
    const {
      layers,
      displayRatio,
      progressCanvasStickerLayerDrag,
      progressCanvasStickerLayerTransform,
    } = this.props;
    const canvas = this.props;
    const { stickers } = layers;

    if (!stickers.length) {
      return;
    }

    const sticker = stickers[stickers.length - 1];
    const { isMultiTouching, isDragging, isTransforming } = sticker;

    if (isTransforming && isMultiTouching) {
      const nextAngle =
        sticker.rotate.previous +
        (Math.atan2(
          positions[1].y - positions[0].y,
          positions[1].x - positions[0].x
        ) *
          (180 / Math.PI) -
          sticker.rotate.reference);
      const currentLength = Math.pow(
        Math.pow(positions[1].x - positions[0].x, 2) +
          Math.pow(positions[1].y - positions[0].y, 2),
        0.5
      );
      const nextScale =
        (currentLength / sticker.scale.reference) * sticker.scale.previous;

      let nextX = sticker.x;
      let nextY = sticker.y;

      // 最小値を見て縮小するかどうかを決める
      if (sticker.width * nextScale > 200 && sticker.height * nextScale > 200) {
        nextX =
          sticker.x +
          (sticker.width * sticker.scale.current - sticker.width * nextScale) /
            2;
        nextY =
          sticker.y +
          (sticker.height * sticker.scale.current -
            sticker.height * nextScale) /
            2;

        return progressCanvasStickerLayerTransform(
          nextX,
          nextY,
          nextScale,
          nextAngle
        );
      }

      return progressCanvasStickerLayerTransform(
        nextX,
        nextY,
        sticker.scale.current,
        nextAngle
      );
    }

    if (isTransforming) {
      const [{ x, y }] = positions;
      const centerX = sticker.x + (sticker.width * sticker.scale.current) / 2;
      const centerY = sticker.y + (sticker.height * sticker.scale.current) / 2;
      const relativeX = (x - canvas.x) * displayRatio;
      const relativeY = (y - canvas.y) * displayRatio;

      // 回転ボタン初期位置と中心座標の度の差を求めて足す
      const nextAngle =
        Math.atan2(relativeX - centerX, relativeY - centerY) *
          (180 / Math.PI) *
          -1 +
        Math.atan2(
          sticker.x + sticker.width * sticker.scale.current - centerX,
          sticker.y + sticker.height * sticker.scale.current - centerY
        ) *
          (180 / Math.PI);
      const nextScale =
        (Math.pow(
          Math.pow(relativeX - centerX, 2) + Math.pow(relativeY - centerY, 2),
          0.5
        ) /
          sticker.scale.reference) *
        sticker.scale.previous;

      let nextX = sticker.x;
      let nextY = sticker.y;

      // 最小値を見て縮小するかどうかを決める
      if (sticker.width * nextScale > 200 && sticker.height * nextScale > 200) {
        nextX =
          sticker.x +
          (sticker.width * sticker.scale.current - sticker.width * nextScale) /
            2;
        nextY =
          sticker.y +
          (sticker.height * sticker.scale.current -
            sticker.height * nextScale) /
            2;

        return progressCanvasStickerLayerTransform(
          nextX,
          nextY,
          nextScale,
          nextAngle
        );
      }

      return progressCanvasStickerLayerTransform(
        nextX,
        nextY,
        sticker.scale.current,
        nextAngle
      );
    }

    if (isDragging) {
      const [{ x, y }] = positions;
      const relativeX = (x - canvas.x) * displayRatio;
      const relativeY = (y - canvas.y) * displayRatio;
      const nextX = relativeX - sticker.referenceX;
      const nextY = relativeY - sticker.referenceY;

      return progressCanvasStickerLayerDrag(nextX, nextY);
    }
  };

  private handleOnMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    this.handleOnMove([{ x: clientX, y: clientY }]);
  };

  private handleOnTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const { touches } = event;
    const positions = [];

    for (let i = 0; i < touches.length; i++) {
      positions.push({ x: touches[i].clientX, y: touches[i].clientY });
    }

    this.handleOnMove(positions);
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

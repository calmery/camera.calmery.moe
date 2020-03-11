import React from "react";
import { CanvasFilters } from "~/containers/CanvasFilters";
import { CanvasLayers } from "~/containers/CanvasLayers";
import { connect } from "react-redux";
import { State } from "~/modules";
import { setCursorPosition } from "~/modules/canvas/actions";
import { CanvasState } from "~/modules/canvas/reducer";
import {
  setCanvasPosition,
  dragStartStickerLayer,
  dragEndStickerLayer
} from "~/modules/canvas/actions";

class Canvas extends React.Component<{
  canvas: CanvasState;
  setCursorPosition: (x: number, y: number) => void;
  dragStartStickerLayer: (
    layerIndex: number,
    referenceX: number,
    referenceY: number
  ) => void;
  dragEndStickerLayer: () => void;
  setCanvasPosition: (
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
}> {
  private ref: React.RefObject<SVGSVGElement> = React.createRef();

  // React Lifecycle

  public componentDidMount = () => {
    this.ref.current!.addEventListener("mousemove", this.handleOnMouseMove, {
      passive: false
    });
    this.ref.current!.addEventListener("touchmove", this.handleOnTouchMove, {
      passive: false
    });

    window.addEventListener("resize", this.handleOnResizeWindow, false);
    this.handleOnResizeWindow(); // 最初にセットする必要がある
  };

  public componentWillUnmount = () => {
    this.ref.current!.removeEventListener("mousemove", this.handleOnMouseMove);
    this.ref.current!.removeEventListener("touchmove", this.handleOnTouchMove);
    window.removeEventListener("resize", this.handleOnResizeWindow);
  };

  // Render

  public render = () => {
    const { canvas } = this.props;

    return (
      <svg
        ref={this.ref}
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        version="1.1"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <CanvasFilters />
        <CanvasLayers
          onMouseDown={this.handleOnMouseDown}
          onMouseUp={this.handleOnMouseUpAndTouchEnd}
          onTouchStart={this.handleOnTouchStart}
          onTouchEnd={this.handleOnMouseUpAndTouchEnd}
        />
      </svg>
    );
  };

  // Event Handlers

  private handleOnResizeWindow = () => {
    const { setCanvasPosition } = this.props;
    const { x, y, width, height } = this.ref.current!.getBoundingClientRect();
    setCanvasPosition(x, y, width, height);
  };

  private handleOnMouseDown = (
    event: React.MouseEvent<SVGImageElement, MouseEvent>,
    index: number
  ) => {
    this.props.dragStartStickerLayer(index, event.clientX, event.clientY);
  };

  private handleOnTouchStart = (
    event: React.TouchEvent<SVGImageElement>,
    index: number
  ) => {
    this.props.dragStartStickerLayer(
      index,
      event.touches[0].clientX,
      event.touches[0].clientY
    );
  };

  private handleOnMouseUpAndTouchEnd = () => {
    this.props.dragEndStickerLayer();
  };

  private handleOnMouseMove = (event: MouseEvent) => {
    const { setCursorPosition } = this.props;

    event.preventDefault();
    event.stopPropagation();

    setCursorPosition(event.clientX, event.clientY);
  };

  private handleOnTouchMove = (event: TouchEvent) => {
    const { setCursorPosition } = this.props;

    event.preventDefault();
    event.stopPropagation();

    setCursorPosition(event.touches[0].clientX, event.touches[0].clientY);
  };
}

export default connect(
  (state: State) => ({
    canvas: state.canvas
  }),
  dispatch => ({
    setCursorPosition(x: number, y: number) {
      dispatch(setCursorPosition(x, y));
    },
    dragStartStickerLayer(
      layerIndex: number,
      referenceX: number,
      referenceY: number
    ) {
      dispatch(dragStartStickerLayer(layerIndex, referenceX, referenceY));
    },
    dragEndStickerLayer() {
      dispatch(dragEndStickerLayer());
    },
    setCanvasPosition(x: number, y: number, width: number, height: number) {
      dispatch(setCanvasPosition(x, y, width, height));
    }
  })
)(Canvas);

import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { CanvasFilters } from "~/containers/CanvasFilters";
import { CanvasLayers } from "~/containers/CanvasLayers";
import { State } from "~/modules";
import {
  setCanvasPosition,
  setCursorPosition,
  dragStartStickerLayer,
  dragEndStickerLayer
} from "~/modules/canvas/actions";

const mapStateToProps = ({ canvas }: State) => ({ canvas });

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCanvasPosition(x: number, y: number, width: number, height: number) {
    dispatch(setCanvasPosition(x, y, width, height));
  },
  setCursorPosition(x: number, y: number) {
    dispatch(setCursorPosition(x, y));
  },
  dragStartStickerLayer(index: number, x: number, y: number) {
    dispatch(dragStartStickerLayer(index, x, y));
  },
  dragEndStickerLayer() {
    dispatch(dragEndStickerLayer());
  }
});

class Canvas extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  private ref: React.RefObject<SVGSVGElement> = React.createRef();

  // React Lifecycle

  public componentDidMount = () => {
    const e = this.ref.current!;

    e.addEventListener("mousemove", this.handleOnDrag, { passive: false });
    e.addEventListener("touchmove", this.handleOnDrag, { passive: false });
    window.addEventListener("resize", this.handleOnResizeWindow, false);

    this.handleOnResizeWindow();
  };

  public componentWillUnmount = () => {
    const e = this.ref.current!;
    e.removeEventListener("mousemove", this.handleOnDrag);
    e.removeEventListener("touchmove", this.handleOnDrag);
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
          onMouseDown={this.handleOnDragStart}
          onMouseUp={this.handleOnDragEnd}
          onTouchStart={this.handleOnDragStart}
          onTouchEnd={this.handleOnDragEnd}
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

  private handleOnDragStart = (
    event: React.MouseEvent | React.TouchEvent,
    index: number
  ) => {
    const { dragStartStickerLayer } = this.props;

    try {
      dragStartStickerLayer(
        index,
        (event as React.TouchEvent).touches[0].clientX,
        (event as React.TouchEvent).touches[0].clientY
      );
    } catch (_) {
      dragStartStickerLayer(
        index,
        (event as React.MouseEvent).clientX,
        (event as React.MouseEvent).clientY
      );
    }
  };

  private handleOnDrag = (event: MouseEvent | TouchEvent) => {
    const { setCursorPosition } = this.props;

    event.preventDefault();
    event.stopPropagation();

    setCursorPosition(
      event instanceof TouchEvent ? event.touches[0].clientX : event.clientX,
      event instanceof TouchEvent ? event.touches[0].clientY : event.clientY
    );
  };

  private handleOnDragEnd = () => {
    const { dragEndStickerLayer } = this.props;

    dragEndStickerLayer();
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

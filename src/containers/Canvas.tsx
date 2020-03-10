import React from "react";
import { CanvasFilters } from "~/containers/CanvasFilters";
import { CanvasLayers } from "~/containers/CanvasLayers";
import { connect } from "react-redux";
import { State } from "~/modules";
import { pointerMove, referencePointerMove } from "~/modules/canvas/actions";
import { CanvasState } from "~/modules/canvas/reducer";
import { dragStart, dragEnd } from "~/modules/canvas/actions";

class Canvas extends React.Component<{
  canvas: CanvasState;
  pointerMove: (x: number, y: number) => void;
  referencePointerMove: (x: number, y: number) => void;
  dragStart: (index: number) => void;
  dragEnd: () => void;
}> {
  private ref: React.RefObject<SVGSVGElement> = React.createRef();

  public componentDidMount = () => {
    this.ref.current!.addEventListener("mousemove", this.handleOnMouseMove, {
      passive: false
    });
    this.ref.current!.addEventListener("touchmove", this.handleOnTouchMove, {
      passive: false
    });
  };

  public componentWillUnmount = () => {
    this.ref.current!.removeEventListener("mousemove", this.handleOnMouseMove);
    this.ref.current!.removeEventListener("touchmove", this.handleOnTouchMove);
  };

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

  // Events (Sticker Layers)

  private handleOnMouseUpAndTouchEnd = () => {
    const { referencePointerMove, dragEnd } = this.props;
    referencePointerMove(0, 0);
    dragEnd();
  };

  private handleOnMouseDown = (
    event: React.MouseEvent<SVGImageElement, MouseEvent>,
    index: number
  ) => {
    const { canvas, dragStart, referencePointerMove } = this.props;

    if (!this.ref.current) {
      return;
    }

    const { x, y, width } = this.ref.current.getBoundingClientRect();
    const ratio = canvas.width / width;

    const canvasLayer = canvas.stickerLayers[index];
    const referenceX = canvasLayer.x - Math.round(event.clientX * ratio - x);
    const referenceY = canvasLayer.y - Math.round(event.clientY * ratio - y);

    referencePointerMove(referenceX, referenceY);
    dragStart(index);
  };

  private handleOnTouchStart = (
    event: React.TouchEvent<SVGImageElement>,
    index: number
  ) => {
    const { canvas, dragStart, referencePointerMove } = this.props;

    if (!this.ref.current) {
      return;
    }

    const { x, y, width } = this.ref.current.getBoundingClientRect();
    const ratio = canvas.width / width;

    const canvasLayer = canvas.stickerLayers[index];
    const referenceX =
      canvasLayer.x - Math.round(event.touches[0].clientX * ratio - x);
    const referenceY =
      canvasLayer.y - Math.round(event.touches[0].clientY * ratio - y);

    referencePointerMove(referenceX, referenceY);
    dragStart(index);
  };

  private handleOnMouseMove = (event: MouseEvent) => {
    const { canvas, pointerMove } = this.props;
    const {
      draggingStickerLayerIndex,
      pointerPosition,
      width: canvasWidth
    } = canvas;

    if (draggingStickerLayerIndex === null) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (!this.ref.current) {
      return;
    }

    const { x, y, width } = this.ref.current.getBoundingClientRect();
    const ratio = canvasWidth / width;

    const relativeCoordinateX =
      Math.round(event.clientX * ratio - x) + pointerPosition.referenceX;
    const relativeCoordinateY =
      Math.round(event.clientY * ratio - y) + pointerPosition.referenceY;

    pointerMove(relativeCoordinateX, relativeCoordinateY);
  };

  private handleOnTouchMove = (event: TouchEvent) => {
    const { canvas, pointerMove } = this.props;
    const {
      draggingStickerLayerIndex,
      pointerPosition,
      width: canvasWidth
    } = canvas;

    if (draggingStickerLayerIndex === null) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (!this.ref.current) {
      return;
    }

    const { x, y, width } = this.ref.current.getBoundingClientRect();
    const ratio = canvasWidth / width;

    const relativeCoordinateX =
      Math.round(event.touches[0].clientX * ratio - x) +
      pointerPosition.referenceX;
    const relativeCoordinateY =
      Math.round(event.touches[0].clientY * ratio - y) +
      pointerPosition.referenceY;

    pointerMove(relativeCoordinateX, relativeCoordinateY);
  };
}

export default connect(
  (state: State) => ({
    canvas: state.canvas
  }),
  dispatch => ({
    pointerMove(relativeCoordinateX: number, relativeCoordinateY: number) {
      dispatch(pointerMove(relativeCoordinateX, relativeCoordinateY));
    },
    referencePointerMove(referenceX: number, referenceY: number) {
      dispatch(referencePointerMove(referenceX, referenceY));
    },
    dragStart(index: number) {
      dispatch(dragStart(index));
    },
    dragEnd() {
      dispatch(dragEnd());
    }
  })
)(Canvas);

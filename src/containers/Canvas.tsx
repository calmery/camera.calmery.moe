import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { CanvasFilters } from "./CanvasFilters";
import CanvasStickerLayers from "./CanvasStickerLayers";
import CanvasUserLayers from "./CanvasUserLayers";
import { State } from "~/domains";
import * as actions from "~/domains/canvas/actions";
import {
  convertEventToCursorPositions,
  CursorPosition,
} from "~/utils/convert-event-to-positions";

// Redux

const mapStateToProps = ({ canvas }: State) => canvas;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, actions.Actions>
) => ({
  updateDisplayRatio: (
    displayX: number,
    displayY: number,
    displayWidth: number
  ) => dispatch(actions.updateDisplayRatio(displayX, displayY, displayWidth)),
  complete: () => dispatch(actions.complete()),
  tick: (cursorPositions: CursorPosition[]) =>
    dispatch(actions.tick(cursorPositions)),
});

// Main

class Canvas extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  private ref = React.createRef<SVGSVGElement>();

  public componentDidMount = () => {
    const e = this.ref.current!;

    e.addEventListener("mouseup", this.props.complete);
    e.addEventListener("touchend", this.props.complete);
    e.addEventListener("mouseleave", this.props.complete);
    e.addEventListener("mousemove", this.handleOnMove);
    e.addEventListener("touchmove", this.handleOnMove, { passive: false });
    addEventListener("resize", this.handleOnResizeWindow);

    this.handleOnResizeWindow();
  };

  public componentWillUnmount = () => {
    const e = this.ref.current!;

    e.removeEventListener("mouseup", this.props.complete);
    e.removeEventListener("touchend", this.props.complete);
    e.removeEventListener("mouseleave", this.props.complete);
    e.removeEventListener("mousemove", this.handleOnMove);
    e.removeEventListener("touchmove", this.handleOnMove);
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
    const e = this.ref.current!;
    const { width, x, y } = e.getBoundingClientRect();

    updateDisplayRatio(x, y, width);
  };

  private handleOnMove = (event: TouchEvent | MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const { tick } = this.props;
    tick(convertEventToCursorPositions(event));
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

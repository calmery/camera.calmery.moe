import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import CanvasUserLayers from "./CanvasUserLayers";
import { State } from "~/domains";
import * as actions from "~/domains/canvas/actions";

// Redux

const mapStateToProps = ({ canvas }: State) => canvas;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, actions.Actions>
) => ({
  removeUserImage: (index: number) => dispatch(actions.removeUserImage(index)),
  updateDisplayRatio: (displayWidth: number) =>
    dispatch(actions.updateDisplayRatio(displayWidth)),
  resetAllFlags: () => dispatch(actions.resetAllFlags()),
});

// Main

class Canvas extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  private ref = React.createRef<SVGSVGElement>();

  public componentDidMount = () => {
    const s = this.ref.current!;
    const options = { passive: false };
    s.addEventListener("mouseup", this.handleOnOut, options);
    s.addEventListener("mouseout", this.handleOnOut, options);
    window.addEventListener("resize", this.handleOnResizeWindow);

    this.handleOnResizeWindow();
  };

  public componentWillUnmount = () => {
    const s = this.ref.current!;
    s.removeEventListener("mouseup", this.handleOnOut);
    s.removeEventListener("mouseout", this.handleOnOut);
    window.removeEventListener("resize", this.handleOnResizeWindow);
  };

  public render = () => {
    const { width, height } = this.props;

    return (
      <>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          ref={this.ref}
        >
          <CanvasUserLayers />
        </svg>
        {this.renderRemoveButtons()}
      </>
    );
  };

  private renderRemoveButtons = () => {
    const { layers } = this.props;

    return layers.users.map((layer, index) =>
      layer ? (
        <button
          onClick={() => this.handleOnClockRemoveImageButton(index)}
          key={index}
        >
          Remove: {index}
        </button>
      ) : null
    );
  };

  private handleOnClockRemoveImageButton = (index: number) => {
    const { removeUserImage } = this.props;
    removeUserImage(index);
  };

  private handleOnResizeWindow = () => {
    const { updateDisplayRatio } = this.props;
    const s = this.ref.current!;
    const { width } = s.getBoundingClientRect();

    updateDisplayRatio(width);
  };

  private handleOnOut = () => {
    const { resetAllFlags } = this.props;

    resetAllFlags();
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

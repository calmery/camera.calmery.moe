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
});

// Main

class Canvas extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  public render = () => {
    const { width, height, layers } = this.props;

    return (
      <>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

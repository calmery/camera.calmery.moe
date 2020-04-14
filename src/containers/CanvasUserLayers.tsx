import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import CanvasUserLayer from "~/components/CanvasUserLayer";
import CanvasEmptyUserLayer from "~/components/CanvasEmptyUserLayer";
import { State } from "~/domains";
import * as actions from "~/domains/canvas/actions";
import { getImageFile } from "~/utils/get-image-file";

const mapStateToProps = ({ canvas }: State) => canvas;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, actions.Actions>
) => ({
  addUserImageFromFile: (file: File, index: number) =>
    dispatch(actions.addUserImageFromFile(file, index)),
});

class CanvasUserLayers extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  public render = () => {
    const { layers, frames } = this.props;
    return (
      <>
        {frames.users.map((_, i: number) => {
          const layer = layers.users[i];
          const frame = frames.users[i];

          if (layer) {
            return <CanvasUserLayer layer={layer} frame={frame} key={i} />;
          }

          return (
            <CanvasEmptyUserLayer
              frame={frame}
              onClick={() => this.handOnClickEmptyUserImage(i)}
              key={i}
            />
          );
        })}
      </>
    );
  };

  // Events

  private handOnClickEmptyUserImage = async (index: number) => {
    const { addUserImageFromFile } = this.props;
    addUserImageFromFile(await getImageFile(), index);
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasUserLayers);

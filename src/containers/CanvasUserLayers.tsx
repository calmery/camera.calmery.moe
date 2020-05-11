import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import CanvasUserLayer from "~/components/CanvasUserLayer";
import CanvasEmptyUserLayer from "~/components/CanvasEmptyUserLayer";
import { State } from "~/domains";
import { actions, tickActions, Actions } from "~/domains/canvas/actions";
import { getImageFile } from "~/utils/get-image-file";

const mapStateToProps = ({ canvas }: State) => canvas;

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, Actions>) => ({
  addUserImageFromFile: (file: File, index: number) =>
    dispatch(tickActions.addUserImageFromFile(file, index)),
  setCanvasUserLayerStartingPosition: (
    index: number,
    differenceFromStartingX: number,
    differenceFromStartingY: number
  ) => {
    dispatch(
      actions.setCanvasUserLayerStartingPosition(
        index,
        differenceFromStartingX,
        differenceFromStartingY
      )
    );
  },
  updateCanvasUserLayerPosition: (
    index: number,
    nextX: number,
    nextY: number
  ) => {
    dispatch(actions.updateCanvasUserLayerPosition(index, nextX, nextY));
  },
});

class CanvasUserLayers extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  public render = () => {
    const { layers, frames, displayRatio } = this.props;
    return (
      <>
        {frames.users.map((_, i: number) => {
          const layer = layers.users[i];
          const frame = frames.users[i];

          if (layer) {
            return (
              <CanvasUserLayer
                layer={layer}
                frame={frame}
                key={i}
                displayRatio={displayRatio}
                onStart={(x, y) => this.handleOnStart(i, x, y)}
                onMove={(x, y) => this.handleOnMove(i, x, y)}
              />
            );
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

  private handleOnStart = (
    index: number,
    differenceFromStartingX: number,
    differenceFromStartingY: number
  ) => {
    const { setCanvasUserLayerStartingPosition } = this.props;
    setCanvasUserLayerStartingPosition(
      index,
      differenceFromStartingX,
      differenceFromStartingY
    );
  };

  private handleOnMove = (index: number, nextX: number, nextY: number) => {
    const { updateCanvasUserLayerPosition } = this.props;
    updateCanvasUserLayerPosition(index, nextX, nextY);
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasUserLayers);

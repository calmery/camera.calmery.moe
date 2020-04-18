import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import CanvasStickerLayer from "~/components/CanvasStickerLayer";
import { State } from "~/domains";
import * as actions from "~/domains/canvas/actions";

const mapStateToProps = ({ canvas }: State) => canvas;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, actions.Actions>
) => ({
  startTransform: (index: number, previousLength: number) =>
    dispatch(actions.startCanvasStickerLayerTransform(index, previousLength)),
  startMultiTouchingTransform: (
    index: number,
    previousLength: number,
    startingAngle: number
  ) => {
    dispatch(
      actions.startCanvasStickerLayerMultiTouchingTransform(
        index,
        previousLength,
        startingAngle
      )
    );
  },
  startDrag: (index: number, referenceX: number, referenceY: number) => {
    dispatch(
      actions.startCanvasStickerLayerDrag(index, referenceX, referenceY)
    );
  },
});

class CanvasStickerLayers extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  public render = () => {
    const { layers, displayRatio, x, y } = this.props;

    return layers.stickers.map((sticker, index) => (
      <CanvasStickerLayer
        key={index}
        selected
        {...sticker}
        displayRatio={displayRatio}
        startTransform={(l) => this.handleOnStartTransform(index, l)}
        startMultiTouchingTransform={(l, a) =>
          this.handleOnStartMultiTouchingTransform(index, l, a)
        }
        startDrag={(x, y) => this.handleOnStartDrag(index, x, y)}
        canvasBaseX={x}
        canvasBaseY={y}
      />
    ));
  };

  // Events

  private handleOnStartTransform = this.props.startTransform;
  private handleOnStartMultiTouchingTransform = this.props
    .startMultiTouchingTransform;
  private handleOnStartDrag = this.props.startDrag;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasStickerLayers);

import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import CanvasStickerLayer from "~/components/CanvasStickerLayer";
import { State } from "~/domains";
import { actions, Actions } from "~/domains/canvas/actions";

const mapStateToProps = ({ canvas }: State) => canvas;

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, Actions>) => ({
  startCropperTransforming: (index: number, previousLength: number) =>
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
  startCropperMoving: (
    index: number,
    referenceX: number,
    referenceY: number
  ) => {
    dispatch(
      actions.startCanvasStickerLayerDrag(index, referenceX, referenceY)
    );
  },
  onClick: (index: number) => {
    dispatch(actions.changeActiveCanvasStickerLayer(index));
  },
  removeCanvasStickerLayer: () => {
    dispatch(actions.removeCanvasStickerLayer());
  },
});

class CanvasStickerLayers extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  public render = () => {
    const { layers, displayRatio, x, y, removeCanvasStickerLayer } = this.props;

    return layers.stickers.map((sticker, index) => (
      <CanvasStickerLayer
        key={index}
        selected={index === layers.stickers.length - 1}
        {...sticker}
        displayRatio={displayRatio}
        startCropperTransforming={(l) =>
          this.handleOnstartCropperTransforming(index, l)
        }
        startMultiTouchingTransform={(l, a) =>
          this.handleOnStartMultiTouchingTransform(index, l, a)
        }
        startCropperMoving={(x, y) =>
          this.handleOnstartCropperMoving(index, x, y)
        }
        canvasBaseX={x}
        canvasBaseY={y}
        onClick={() => this.handleOnClick(index)}
        onClickRemoveButton={removeCanvasStickerLayer}
      />
    ));
  };

  // Events

  private handleOnstartCropperTransforming = this.props
    .startCropperTransforming;
  private handleOnStartMultiTouchingTransform = this.props
    .startMultiTouchingTransform;
  private handleOnstartCropperMoving = this.props.startCropperMoving;
  private handleOnClick = this.props.onClick;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasStickerLayers);

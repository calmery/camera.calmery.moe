import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { State } from "~/domains";
import * as actions from "~/domains/cropper/actions";

const mapStateToProps = ({ cropper }: State) => cropper;

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setContainerDisplaySize: (domRect: DOMRect) =>
    dispatch(actions.setContainerDisplaySize(domRect)),
  startDrag: (referenceX: number, referenceY: number) =>
    dispatch(actions.startDrag(referenceX, referenceY)),
  resetFlags: () => dispatch(actions.resetFlags()),
  startTransform: (event: React.MouseEvent | React.TouchEvent) =>
    dispatch(actions.startTransform(event)),
  startRotateImage: (event: TouchEvent) =>
    dispatch(actions.startRotateImage(event)),
  update: (
    event: MouseEvent | TouchEvent | React.TouchEvent | React.MouseEvent
  ) => dispatch(actions.update(event)),
});

class Cropper extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  private ref = React.createRef<SVGSVGElement>();

  public componentDidMount = () => {
    const e = this.ref.current!;

    e.addEventListener("touchstart", this.handleOnTouchStart, false);
    e.addEventListener("mousemove", this.handleOnMove, false);
    e.addEventListener("touchmove", this.handleOnMove, { passive: false });
    e.addEventListener("mouseup", this.handleOnResetFlags, false);
    e.addEventListener("mouseleave", this.handleOnResetFlags, false);
    e.addEventListener("touchend", this.handleOnResetFlags, false);
    addEventListener("resize", this.handleOnResize, false);

    this.setContainerDisplaySize();
  };

  public componentWillUnmount = () => {
    const e = this.ref.current!;

    e.removeEventListener("mousemove", this.handleOnMove);
    e.removeEventListener("touchmove", this.handleOnMove);
    e.removeEventListener("mouseup", this.handleOnResetFlags);
    e.removeEventListener("mouseleave", this.handleOnResetFlags);
    e.removeEventListener("touchend", this.handleOnResetFlags);
    removeEventListener("resize", this.handleOnResize, false);
  };

  private handleOnResize = () => {
    this.setContainerDisplaySize();
  };

  public render = () => {
    const { image, scaleImage } = this.props;

    return (
      <div id="container">
        <svg
          ref={this.ref}
          viewBox={`0 0 ${image.width} ${image.height}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          overflow="visible"
        >
          {this.renderTargetImage()}
          {this.renderCropper()}
        </svg>
      </div>
    );
  };

  private renderTargetImage = () => {
    const { image, rotate, scaleImage } = this.props;
    const { url, width, height } = image;

    return (
      <>
        <svg
          width={width * scaleImage.current}
          height={height * scaleImage.current}
          x={image.x}
          y={image.y}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          overflow="visible"
        >
          <g
            transform={`rotate(${rotate.current}, ${width / 2}, ${height / 2})`}
          >
            <image xlinkHref={url} width="100%" height="100%" />
            <rect width="100%" height="100%" fill="#000" fillOpacity="0.48" />
          </g>
        </svg>

        <g clipPath="url(#clip-path-1)">
          <svg
            width={width * scaleImage.current}
            height={height * scaleImage.current}
            x={image.x}
            y={image.y}
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            overflow="visible"
          >
            <g
              transform={`rotate(${rotate.current}, ${width / 2}, ${
                height / 2
              })`}
            >
              <image xlinkHref={url} width="100%" height="100%" />
            </g>
          </svg>
        </g>
      </>
    );
  };

  private renderCropper = () => {
    const {
      containerDisplay,
      position,
      width,
      height,
      scale,
      scaleX,
      scaleY,
      freeAspect,
    } = this.props;
    const displayRatio = containerDisplay.ratio;

    let sx = scaleX.current;
    let sy = scaleY.current;

    if (!freeAspect) {
      sx = scale.current;
      sy = scale.current;
    }

    return (
      <g>
        <clipPath id="clip-path-1">
          <rect
            x={position.x}
            y={position.y}
            width={width * sx}
            height={height * sy}
          />
        </clipPath>

        <rect
          fillOpacity="0"
          stroke="#FFF"
          strokeWidth="2"
          strokeDasharray="8 8"
          width={width * sx}
          height={height * sy}
          x={position.x}
          y={position.y}
          onMouseDown={this.handleOnMouseDownRect}
          onTouchStart={this.handleOnTouchStartRect}
        ></rect>

        <circle
          fill="#FFF"
          cx={position.x + width * sx}
          cy={position.y + height * sy}
          r={12 * displayRatio}
          onMouseDown={this.handleOnPressCircle}
          onTouchStart={this.handleOnPressCircle}
        ></circle>
      </g>
    );
  };

  // Events

  private handleOnTouchStart = (event: TouchEvent) => {
    const { startRotateImage } = this.props;

    startRotateImage(event);
  };

  private handleOnPressCircle = (
    event: React.MouseEvent | React.TouchEvent
  ) => {
    const { startTransform } = this.props;

    startTransform(event);
  };

  private handleOnMove = (
    event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
  ) => {
    const { update } = this.props;

    event.preventDefault();
    event.stopPropagation();

    update(event);
  };

  private handleOnMouseDownRect = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>
  ) => {
    const { containerDisplay, position, startDrag } = this.props;
    const referenceX =
      (event.clientX - containerDisplay.x) * containerDisplay.ratio -
      position.x;
    const referenceY =
      (event.clientY - containerDisplay.y) * containerDisplay.ratio -
      position.y;
    startDrag(referenceX, referenceY);
  };

  private handleOnTouchStartRect = (event: React.TouchEvent) => {
    const { containerDisplay, position, startDrag } = this.props;

    const referenceX =
      (event.touches[0].clientX - containerDisplay.x) * containerDisplay.ratio -
      position.x;
    const referenceY =
      (event.touches[0].clientY - containerDisplay.y) * containerDisplay.ratio -
      position.y;
    startDrag(referenceX, referenceY);
  };

  private handleOnResetFlags = () => {
    const { resetFlags } = this.props;

    resetFlags();
  };

  //

  private setContainerDisplaySize = () => {
    const { setContainerDisplaySize } = this.props;
    const e = this.ref.current!;

    setContainerDisplaySize(e.getBoundingClientRect());
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Cropper);

import React, { TouchEvent } from "react";
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
  setPosition: (x: number, y: number) => dispatch(actions.setPosition(x, y)),
  startTransform: (
    referenceScale: number,
    referenceXScale: number,
    referenceYScale: number
  ) =>
    dispatch(
      actions.startTransform(referenceScale, referenceXScale, referenceYScale)
    ),
  setScale: (nextScale: number, nextScaleX: number, nextScaleY: number) =>
    dispatch(actions.setScale(nextScale, nextScaleX, nextScaleY)),
  startRotateImage: (startingAngle: number, previousLength: number) =>
    dispatch(actions.startRotateImage(startingAngle, previousLength)),
  setRotate: (nextAngle: number, nextScale: number, x: number, y: number) =>
    dispatch(actions.setRotate(nextAngle, nextScale, x, y)),
});

class Cropper extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  private ref = React.createRef<SVGSVGElement>();

  public componentDidMount = () => {
    const e = this.ref.current!;

    e.addEventListener("touchstart", this.handleOnTouchStart, false);
    e.addEventListener("mousemove", this.handleOnMouseMove, false);
    e.addEventListener("touchmove", this.handleOnTouchMove, { passive: false });
    e.addEventListener("mouseup", this.handleOnResetFlags, false);
    e.addEventListener("mouseleave", this.handleOnResetFlags, false);
    e.addEventListener("touchend", this.handleOnResetFlags, false);
    addEventListener("resize", this.handleOnResize, false);

    this.setContainerDisplaySize();
  };

  public componentWillUnmount = () => {
    const e = this.ref.current!;

    e.removeEventListener("mousemove", this.handleOnMouseMove);
    e.removeEventListener("touchmove", this.handleOnTouchMove);
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
          onMouseDown={this.handleOnMouseDownCircle}
          onTouchStart={this.handleOnTouchStartCircle}
        ></circle>
      </g>
    );
  };

  // Events

  private handleOnTouchStart = (event: any) => {
    const { startRotateImage } = this.props;

    if (event.touches.length > 1) {
      const first = event.touches[0];
      const second = event.touches[1];

      const previousLength = Math.pow(
        Math.pow(second.clientX - first.clientX, 2) +
          Math.pow(second.clientY - first.clientY, 2),
        0.5
      );

      startRotateImage(
        Math.atan2(
          second.clientY - first.clientY,
          second.clientX - first.clientX
        ) *
          (180 / Math.PI),
        previousLength
      );
    }
  };

  private handleOnMouseDownCircle = (event: React.MouseEvent) => {
    const { startTransform, containerDisplay, position } = this.props;

    // cropperState.scale.previous = cropperState.scale.current;
    // cropperState.scaleX.previous = cropperState.scaleX.current;
    // cropperState.scaleY.previous = cropperState.scaleY.current;
    const scaleReference = Math.pow(
      Math.pow(
        (event.clientX - containerDisplay.x) * containerDisplay.ratio -
          position.x,
        2
      ) +
        Math.pow(
          (event.clientY - containerDisplay.y) * containerDisplay.ratio -
            position.y,
          2
        ),
      0.5
    );
    const scaleXReference =
      (event.clientX - containerDisplay.x) * containerDisplay.ratio -
      position.x;
    const scaleYReference =
      (event.clientY - containerDisplay.y) * containerDisplay.ratio -
      position.y;

    startTransform(scaleReference, scaleXReference, scaleYReference);
  };

  private handleOnTouchStartCircle = (event: TouchEvent) => {
    const { startTransform, containerDisplay, position } = this.props;

    const scaleReference = Math.pow(
      Math.pow(
        (event.touches[0].clientX - containerDisplay.x) *
          containerDisplay.ratio -
          position.x,
        2
      ) +
        Math.pow(
          (event.touches[0].clientY - containerDisplay.y) *
            containerDisplay.ratio -
            position.y,
          2
        ),
      0.5
    );
    const scaleXReference =
      (event.touches[0].clientX - containerDisplay.x) * containerDisplay.ratio -
      position.x;
    const scaleYReference =
      (event.touches[0].clientY - containerDisplay.y) * containerDisplay.ratio -
      position.y;

    startTransform(scaleReference, scaleXReference, scaleYReference);
  };

  private handleOnMove = (
    positions: { clientX: number; clientY: number }[]
  ) => {
    const {
      isDragging,
      setScale,
      freeAspect,
      width,
      height,
      isTransforming,
      isRotating,
      containerDisplay,
      position,
      setPosition,
      scale,
      scaleX,
      scaleY,
      rotate,
      setRotate,
      scaleImage,
      image,
    } = this.props;

    if (isRotating && positions.length > 1) {
      const nextAngle =
        rotate.previous +
        (Math.atan2(
          positions[1].clientY - positions[0].clientY,
          positions[1].clientX - positions[0].clientX
        ) *
          (180 / Math.PI) -
          rotate.reference);
      const currentLength = Math.pow(
        Math.pow(positions[1].clientX - positions[0].clientX, 2) +
          Math.pow(positions[1].clientY - positions[0].clientY, 2),
        0.5
      );
      const nextScale =
        (currentLength / scaleImage.reference) * scaleImage.previous;
      const nextX =
        image.x +
        (image.width * scaleImage.current - image.width * nextScale) / 2;
      const nextY =
        image.y +
        (image.height * scaleImage.current - image.height * nextScale) / 2;
      setRotate(nextAngle, nextScale, nextX, nextY);
    } else if (isDragging) {
      const [{ clientX, clientY }] = positions;

      const relativeX = (clientX - containerDisplay.x) * containerDisplay.ratio;
      const relativeY = (clientY - containerDisplay.y) * containerDisplay.ratio;

      const nextX = relativeX - position.referenceX;
      const nextY = relativeY - position.referenceY;

      setPosition(nextX, nextY);
    } else if (isTransforming) {
      const [{ clientX, clientY }] = positions;

      const nextScale =
        (Math.pow(
          Math.pow(
            (clientX - containerDisplay.x) * containerDisplay.ratio -
              position.x,
            2
          ) +
            Math.pow(
              (clientY - containerDisplay.y) * containerDisplay.ratio -
                position.y,
              2
            ),
          0.5
        ) /
          scale.reference) *
        scale.previous;
      const nextScaleX =
        (((clientX - containerDisplay.x) * containerDisplay.ratio -
          position.x) /
          scaleX.reference) *
        scaleX.previous;
      const nextScaleY =
        (((clientY - containerDisplay.y) * containerDisplay.ratio -
          position.y) /
          scaleY.reference) *
        scaleY.previous;

      if (freeAspect) {
        setScale(
          scale.current,
          width * nextScaleX >= 100 ? nextScaleX : scaleX.current,
          height * nextScaleY >= 100 ? nextScaleY : scaleY.current
        );
      } else {
        if (
          width * nextScale >= 100 &&
          !(
            (clientX - containerDisplay.x) * containerDisplay.ratio <
              position.x ||
            (clientY - containerDisplay.y) * containerDisplay.ratio < position.y
          )
        ) {
          setScale(nextScale, scaleX.current, scaleY.current);
        }
      }
    }
  };

  private handleOnMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    this.handleOnMove([{ clientX, clientY }]);
  };

  private handleOnTouchMove = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    const positions = [];

    for (let i = 0; i < event.touches.length; i++) {
      positions.push({
        clientX: event.touches[i].clientX,
        clientY: event.touches[i].clientY,
      });
    }

    this.handleOnMove(positions);
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

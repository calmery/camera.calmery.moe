import React from "react";
import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { withRedux, NextPageContextWithRedux, State } from "~/domains";
import { Cropper } from "~/containers/Cropper";
import * as actions from "~/domains/cropper/actions";
import CropperPreview from "~/containers/CropperPreview";

const Crop: NextPage = () => {
  const dispatch = useDispatch();
  const freeAspect = useSelector(
    ({ cropper }: State) => cropper.cropper.freeAspect
  );
  const changeFreeAspect = () => dispatch(actions.changeFreeAspect());
  const setImage = (url: string, width: number, height: number) =>
    dispatch(actions.setImage(url, width, height));
  const setAspectRatio = (w: number, h: number) =>
    dispatch(actions.setAspectRatio(w, h));

  return (
    <div style={{ margin: 48 }}>
      <Cropper />
      <input
        type="checkbox"
        defaultChecked={freeAspect}
        onChange={() => changeFreeAspect()}
      />
      <button onClick={() => setAspectRatio(16, 9)}>16:9</button>
      <button onClick={() => setAspectRatio(9, 16)}>9:16</button>
      <button onClick={() => setAspectRatio(1, 1)}>1:1</button>
      <button onClick={() => setAspectRatio(4, 3)}>4:3</button>
      <button onClick={() => setAspectRatio(3, 4)}>3:4</button>
      <button onClick={() => setImage("images/background.jpg", 1500, 1065)}>
        Image 1
      </button>
      <button onClick={() => setImage("images/background-2.jpg", 1000, 333)}>
        Image 2
      </button>
      <CropperPreview />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Crop.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Crop);

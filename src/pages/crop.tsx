import React from "react";
import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { withRedux, NextPageContextWithRedux, State } from "~/domains";
import Cropper from "~/containers/Cropper";
import * as actions from "~/domains/cropper/actions";

const Crop: NextPage = () => {
  const dispatch = useDispatch();
  const freeAspect = useSelector(({ cropper }: State) => cropper.freeAspect);
  const changeFreeAspect = () => dispatch(actions.changeFreeAspect());

  return (
    <div style={{ margin: 48 }}>
      <Cropper />
      <input
        type="checkbox"
        defaultChecked={freeAspect}
        onChange={() => changeFreeAspect()}
      />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Crop.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Crop);

import React from "react";
import { NextPage } from "next";
import { withRedux, NextPageContextWithRedux } from "~/domains";
import Cropper from "~/containers/Cropper";

const Crop: NextPage = () => {
  return (
    <div style={{ margin: 48 }}>
      <Cropper />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Crop.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Crop);

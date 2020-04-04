import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { withRedux, NextPageContextWithRedux } from "~/domains";
import Canvas from "~/containers/Canvas";
import { Menu } from "~/components/Menu";

const Edit: NextPage = () => (
  <>
    <Canvas />
    <Menu />
  </>
);

Edit.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Edit);

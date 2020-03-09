import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { withRedux, NextPageContextWithRedux } from "~/modules";
import { Canvas } from "~/containers/Canvas";

const Edit: NextPage = () => (
  <>
    <Canvas />
    <Link href="/preview">Preview</Link>
  </>
);

Edit.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Edit);

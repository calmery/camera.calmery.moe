import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { withRedux, NextPageContextWithRedux } from "~/modules";
import Canvas from "~/containers/Canvas";
import { Filters } from "~/containers/Filters";
import { Stickers } from "~/containers/Stickers";

const Edit: NextPage = () => (
  <>
    <Canvas />
    <Link href="/preview">Preview</Link>
    <Stickers />
    <Filters />
  </>
);

Edit.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Edit);

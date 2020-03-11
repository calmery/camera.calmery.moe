import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { withRedux, NextPageContextWithRedux } from "~/modules";
import Canvas from "~/containers/Canvas";
import { Filters } from "~/containers/Filters";
import { Stickers } from "~/containers/Stickers";
import { Menu } from "~/components/Menu";

const Edit: NextPage = () => (
  <>
    <Canvas />
    <Link href="/preview">Preview</Link>
    <Stickers />
    <Filters />
    <Menu />
  </>
);

Edit.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Edit);

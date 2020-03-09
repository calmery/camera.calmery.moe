import React from "react";
import { NextPage } from "next";
import { withRedux, NextPageContextWithRedux } from "~/modules";

const Edit: NextPage = () => <div>Edit: Hello World !</div>;

Edit.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Edit);

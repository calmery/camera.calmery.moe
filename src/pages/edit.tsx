import React from "react";
import { NextPage } from "next";
import { withRedux, NextPageContextWithRedux } from "~/domains";
import Canvas from "~/containers/Canvas";
import { Menu } from "~/components/Menu";
import styled from "styled-components";

const Container = styled.div`
  height: 1000px;
  text-align: center;

  svg {
    height: 100%;
  }
`;

const Edit: NextPage = () => (
  <>
    <Container>
      <Canvas />
    </Container>
    <Menu />
  </>
);

Edit.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Edit);

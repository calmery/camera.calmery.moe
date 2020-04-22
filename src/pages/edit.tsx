import React from "react";
import { NextPage } from "next";
import { useSelector, useDispatch } from "react-redux";
import { withRedux, NextPageContextWithRedux, State } from "~/domains";
import * as actions from "~/domains/canvas/actions";
import Canvas from "~/containers/Canvas";
import { Filters } from "~/containers/Filters";
import { Stickers } from "~/containers/Stickers";
import styled from "styled-components";

const Container = styled.div`
  height: 1000px;
  max-height: 80%;
  text-align: center;

  svg {
    height: 100%;
  }
`;

const Edit: NextPage = () => {
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const handleOnClickFrame = (index: number) =>
    dispatch(actions.changeFrame(index));

  return (
    <>
      <Container>
        <Canvas />
      </Container>
      <Filters />
      <Stickers />
      {canvas.layers.users.length ? (
        <button onClick={() => handleOnClickFrame(0)}>Single</button>
      ) : null}
      <button onClick={() => handleOnClickFrame(1)}>Double</button>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Edit.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Edit);

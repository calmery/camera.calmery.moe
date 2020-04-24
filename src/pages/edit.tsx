import React from "react";
import { NextPage } from "next";
import { useSelector, useDispatch } from "react-redux";
import { withRedux, NextPageContextWithRedux, State } from "~/domains";
import * as actions from "~/domains/canvas/actions";
import {
  canvasUserLayerFrame,
  CanvasUserLayerFrame,
} from "~/domains/canvas/reducer";
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
  const handleOnClickFrame = (frame: CanvasUserLayerFrame, index: number) =>
    dispatch(actions.changeFrame(frame, index));

  return (
    <>
      <Container>
        <Canvas />
      </Container>
      <Filters />
      <Stickers />
      {canvasUserLayerFrame[CanvasUserLayerFrame.W3H4].frames.map(
        (_, index) => (
          <button
            onClick={() => handleOnClickFrame(CanvasUserLayerFrame.W3H4, index)}
            key={index}
          >
            3:4 {index}
          </button>
        )
      )}
      {canvasUserLayerFrame[CanvasUserLayerFrame.W4H3].frames.map(
        (_, index) => (
          <button
            onClick={() => handleOnClickFrame(CanvasUserLayerFrame.W4H3, index)}
            key={index}
          >
            4:3 {index}
          </button>
        )
      )}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Edit.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Edit);

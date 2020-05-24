import React, { useEffect } from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { ControlBar } from "~/components/ControlBar";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { Canvas } from "~/containers/Canvas";
import { CanvasFrames } from "~/containers/CanvasFrames";
import { Spacing } from "~/styles/spacing";
import { withRedux, State } from "~/domains";
import { useSelector, useDispatch } from "react-redux";
import { thunkActions } from "~/domains/canvas/actions";

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const BottomBar = styled.div`
  width: 100%;
  flex-shrink: 0;
  padding-top: ${Spacing.l}px;
`;

const Collage: NextPage = () => {
  const dispatch = useDispatch();
  const { essentialLayers } = useSelector(({ canvas }: State) => canvas);

  useEffect(() => {
    if (essentialLayers.length === 0) {
      dispatch(thunkActions.addCanvasEssentialLayerWithUrl("/images/logo.png"));
    }
  }, []);

  return (
    <Page>
      <FlexColumn>
        <ControlBar />
        <Canvas stickers={false} />
        <BottomBar>
          <CanvasFrames />
          <Menu />
        </BottomBar>
      </FlexColumn>
    </Page>
  );
};

export default withRedux(Collage);

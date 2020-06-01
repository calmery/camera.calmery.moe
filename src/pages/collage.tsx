import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { Canvas } from "~/containers/Canvas";
import { CanvasFrames } from "~/containers/CanvasFrames";
import { Spacing } from "~/styles/spacing";
import { withRedux, State } from "~/domains";
import { useSelector, useDispatch } from "react-redux";
import { thunkActions } from "~/domains/canvas/actions";
import { Tutorial } from "~/components/Tutorial";
import { ControlBar } from "~/components/ControlBar";

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
  const { essentialLayers, userLayers } = useSelector(
    ({ canvas }: State) => canvas
  );
  const [isTutorial, setTutorial] = useState(false);

  useEffect(() => {
    if (essentialLayers.length === 0) {
      dispatch(thunkActions.addCanvasEssentialLayerWithUrl("/images/logo.png"));
    }
  }, []);

  let userLayerCount = 0;

  userLayers.forEach((u) => u && userLayerCount++);

  return (
    <>
      <Page>
        <FlexColumn>
          <ControlBar onClickHelpButton={() => setTutorial(true)} />
          <Canvas
            essentials={false}
            stickers={false}
            removable={userLayerCount > 1}
          />
          <BottomBar>
            <div id="tutorial-collage-canvas-frames">
              <CanvasFrames />
            </div>
            <Menu />
          </BottomBar>
        </FlexColumn>
      </Page>
      {isTutorial && (
        <Tutorial
          scenarios={[
            {
              characterImageUrl: "https://static.calmery.moe/s/2/5.png",
              emphasisElementId: "tutorial-collage-canvas-frames",
              message:
                "ここに色んなフレームが用意されているよ！タップして選んでみよう！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/1/10.png",
              emphasisElementId: "tutorial-collage-canvas-frames",
              message: "あれっ...もしかして...",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/2/18.png",
              emphasisElementId: "tutorial-collage-canvas-frames",
              message: "使いたいフレームがない...！？",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/1/7.png",
              emphasisElementId: "tutorial-control-bar-beta",
              message:
                "ここからこんなフレームが欲しい！ってリクエストを送ってみて！",
            },
          ]}
          onComplete={() => setTutorial(false)}
        />
      )}
    </>
  );
};

export default withRedux(Collage);

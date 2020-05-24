import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { ControlBar } from "~/components/ControlBar";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { Canvas } from "~/containers/Canvas";
import { CanvasStickers } from "~/containers/CanvasStickers";
import { Spacing } from "~/styles/spacing";
import { withRedux, State } from "~/domains";
import { Tutorial } from "~/components/Tutorial";
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

const Edit: NextPage = () => {
  const dispatch = useDispatch();
  const { essentialLayers } = useSelector(({ canvas }: State) => canvas);
  const [isTutorial, setTutorial] = useState(false);

  useEffect(() => {
    if (essentialLayers.length === 0) {
      dispatch(thunkActions.addCanvasEssentialLayerWithUrl("/images/logo.png"));
    }
  }, []);

  return (
    <>
      <Page>
        <FlexColumn>
          <ControlBar onClickHelpButton={() => setTutorial(true)} />
          <Canvas />
          <BottomBar>
            <div id="tutorial-edit-canvas-stickers">
              <CanvasStickers />
            </div>
            <Menu />
          </BottomBar>
        </FlexColumn>
      </Page>
      {isTutorial && (
        <Tutorial
          scenarios={[
            {
              characterImageUrl: "https://static.calmery.moe/s/2/3.png",
              focusElementId: "tutorial-canvas",
              message:
                "ここには読み込んだ画像、追加したスタンプが表示されているよ！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/2/8.png",
              focusElementId: "tutorial-canvas",
              message: "画面をタッチして自由に動かしてみて！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/2/11.png",
              focusElementId: "tutorial-edit-canvas-stickers",
              message: "ここにあるスタンプをタップすると画面に追加されるよ！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/2/11.png",
              focusElementId: "tutorial-edit-canvas-stickers",
              message: "スタンプは今後も追加していく予定！お楽しみに！",
            },
          ]}
          onEnd={() => setTutorial(false)}
        />
      )}
    </>
  );
};

export default withRedux(Edit);

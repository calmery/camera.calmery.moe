import React, { useCallback, useState } from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { ControlBar } from "~/components/ControlBar";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { Canvas } from "~/containers/Canvas";
import { Spacing } from "~/styles/spacing";
import { withRedux } from "~/domains";
import { Tutorial } from "~/components/Tutorial";
import { FirstLanding } from "~/components/FirstLanding";
import { useDispatch } from "react-redux";
import { Typography } from "~/styles/typography";
import { thunkActions } from "~/domains/canvas/actions";

const CANVAS_STICKERS = [
  {
    name: "かるめりちゃんスタンプ",
    urls: [
      "https://static.calmery.moe/s/1/1.png",
      "https://static.calmery.moe/s/1/2.png",
      "https://static.calmery.moe/s/1/3.png",
      "https://static.calmery.moe/s/1/4.png",
      "https://static.calmery.moe/s/1/5.png",
      "https://static.calmery.moe/s/1/6.png",
      "https://static.calmery.moe/s/1/7.png",
      "https://static.calmery.moe/s/1/8.png",
      "https://static.calmery.moe/s/1/9.png",
      "https://static.calmery.moe/s/1/10.png",
      "https://static.calmery.moe/s/1/11.png",
      "https://static.calmery.moe/s/1/12.png",
      "https://static.calmery.moe/s/1/13.png",
      "https://static.calmery.moe/s/1/14.png",
      "https://static.calmery.moe/s/1/15.png",
      "https://static.calmery.moe/s/1/16.png",
    ],
  },
  {
    name: "かるめりちゃんスタンプ 2",
    urls: [
      "https://static.calmery.moe/s/2/1.png",
      "https://static.calmery.moe/s/2/2.png",
      "https://static.calmery.moe/s/2/3.png",
      "https://static.calmery.moe/s/2/4.png",
      "https://static.calmery.moe/s/2/5.png",
      "https://static.calmery.moe/s/2/6.png",
      "https://static.calmery.moe/s/2/7.png",
      "https://static.calmery.moe/s/2/8.png",
      "https://static.calmery.moe/s/2/9.png",
      "https://static.calmery.moe/s/2/10.png",
      "https://static.calmery.moe/s/2/11.png",
      "https://static.calmery.moe/s/2/12.png",
      "https://static.calmery.moe/s/2/13.png",
      "https://static.calmery.moe/s/2/14.png",
      "https://static.calmery.moe/s/2/15.png",
      "https://static.calmery.moe/s/2/16.png",
      "https://static.calmery.moe/s/2/17.png",
      "https://static.calmery.moe/s/2/18.png",
      "https://static.calmery.moe/s/2/19.png",
      "https://static.calmery.moe/s/2/20.png",
      "https://static.calmery.moe/s/2/21.png",
      "https://static.calmery.moe/s/2/22.png",
      "https://static.calmery.moe/s/2/23.png",
      "https://static.calmery.moe/s/2/24.png",
    ],
  },
];

const Horizontal = styled.div`
  width: 100%;
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const HorizontalInner = styled.div`
  width: fit-content;
  display: flex;
`;

const Container = styled.div`
  margin-bottom: ${Spacing.l}px;
`;

const StickerContainer = styled.div`
  margin-right: ${Spacing.xl}px;

  &:first-child {
    margin-left: ${Spacing.l}px;
  }

  &:last-child {
    margin-right: ${Spacing.l}px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  margin-bottom: ${Spacing.m}px;
  align-items: center;
  position: sticky;
  width: fit-content;
  top: 0;
  left: ${Spacing.l}px;

  img {
    margin-right: ${Spacing.s}px;
  }
`;

const Title = styled.div`
  ${Typography.S};
  font-family: "Sawarabi Gothic", sans-serif;
`;

const StickerList = styled.div`
  display: grid;
  grid-gap: ${Spacing.s}px;
  grid-template-rows: 52px 52px;
  grid-auto-flow: column;
`;

const Sticker = styled.img`
  width: auto;
  height: 100%;
  cursor: pointer;
`;

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

const Stickers: NextPage = () => {
  const dispatch = useDispatch();
  const handleOnClickStickerImage = useCallback(
    (group: number, id: number, url: string) =>
      dispatch(thunkActions.addCanvasStickerLayerWithUrl(group, id, url)),
    [dispatch]
  );
  const [isTutorial, setTutorial] = useState(false);

  return (
    <>
      <Page>
        <FlexColumn>
          <ControlBar onClickHelpButton={() => setTutorial(true)} />
          <Canvas />
          <BottomBar>
            <div id="tutorial-edit-canvas-stickers">
              <Container>
                <Horizontal>
                  <HorizontalInner>
                    {CANVAS_STICKERS.map(({ name, urls }, group) => (
                      <StickerContainer key={group}>
                        <TitleContainer>
                          <img
                            src="/images/stickers/line-store.svg"
                            alt="LINE STORE"
                          />
                          <Title>{name}</Title>
                        </TitleContainer>
                        <StickerList>
                          {urls.map((url, id) => (
                            <Sticker
                              alt="スタンプ"
                              src={url}
                              key={id}
                              onClick={() =>
                                // URL と合わせる
                                handleOnClickStickerImage(
                                  group + 1,
                                  id + 1,
                                  url
                                )
                              }
                            />
                          ))}
                        </StickerList>
                      </StickerContainer>
                    ))}
                  </HorizontalInner>
                </Horizontal>
              </Container>
            </div>
            <Menu />
          </BottomBar>
        </FlexColumn>
      </Page>
      <FirstLanding />
      {isTutorial && (
        <Tutorial
          scenarios={[
            {
              characterImageUrl: "https://static.calmery.moe/s/2/3.png",
              emphasisElementId: "tutorial-canvas",
              message:
                "ここには読み込んだ画像、追加したスタンプが表示されるよ！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/2/8.png",
              emphasisElementId: "tutorial-canvas",
              message: "画像を読み込んだら画面をタッチ！自由に動かしてみて！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/2/11.png",
              emphasisElementId: "tutorial-edit-canvas-stickers",
              message: "ここにあるスタンプをタップすると画面に追加されるよ！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/2/11.png",
              emphasisElementId: "tutorial-edit-canvas-stickers",
              message: "スタンプは今後も追加していく予定！お楽しみに！",
            },
          ]}
          onComplete={() => setTutorial(false)}
        />
      )}
    </>
  );
};

export default withRedux(Stickers);

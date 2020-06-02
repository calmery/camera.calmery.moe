import React, { useCallback, useState } from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { ControlBar } from "~/components/ControlBar";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { Canvas } from "~/containers/Canvas";
import { Spacing } from "~/styles/spacing";
import { withRedux, State } from "~/domains";
import { Tutorial } from "~/components/Tutorial";
import { FirstLanding } from "~/components/FirstLanding";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "~/styles/typography";
import { thunkActions } from "~/domains/canvas/actions";
import { APPENDABLE_STICKERS } from "~/constants/stickers";
import {
  STICKERS_PAGE_WITH_IMAGE_SCENARIOS,
  STICKERS_PAGE_WITHOUT_IMAGE_SCENARIOS,
} from "~/constants/tutorials";
import * as GA from "~/utils/google-analytics";
import { useRouter } from "next/router";

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
  const { pathname } = useRouter();
  const handleOnClickStickerImage = useCallback(
    (group: number, id: number, url: string) =>
      dispatch(thunkActions.addCanvasStickerLayerWithUrl(group, id, url)),
    [dispatch]
  );
  const [isTutorial, setTutorial] = useState(false);
  const { userLayers } = useSelector(({ canvas }: State) => canvas);
  const isImageExists = userLayers.some((u) => !!u);

  return (
    <>
      <Page>
        <FlexColumn>
          <ControlBar
            onClickHelpButton={() => {
              GA.playTutorial(pathname);
              setTutorial(true);
            }}
          />
          <Canvas logo={isImageExists} />
          <BottomBar>
            {isImageExists && (
              <div id="tutorial-edit-canvas-stickers">
                <Container>
                  <Horizontal>
                    <HorizontalInner>
                      {APPENDABLE_STICKERS.map(({ name, urls }, group) => (
                        <StickerContainer key={group}>
                          <TitleContainer>
                            <img
                              src="/images/pages/stickers/line-store.svg"
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
            )}
            <Menu />
          </BottomBar>
        </FlexColumn>
      </Page>
      <FirstLanding />
      {isTutorial && (
        <Tutorial
          scenarios={
            isImageExists
              ? STICKERS_PAGE_WITH_IMAGE_SCENARIOS
              : STICKERS_PAGE_WITHOUT_IMAGE_SCENARIOS
          }
          onComplete={() => {
            setTutorial(false);
            GA.completeTutorial(pathname);
          }}
          onStop={() => {
            setTutorial(false);
            GA.stopTutorial(pathname);
          }}
        />
      )}
    </>
  );
};

export default withRedux(Stickers);

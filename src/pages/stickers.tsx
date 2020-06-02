import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { ControlBar } from "~/components/ControlBar";
import { FirstLanding } from "~/components/FirstLanding";
import { Horizontal } from "~/components/Horizontal";
import { HorizontalInner } from "~/components/HorizontalInner";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { PageColumn } from "~/components/PageColumn";
import { Tutorial } from "~/components/Tutorial";
import { APPENDABLE_STICKERS } from "~/constants/stickers";
import {
  STICKERS_PAGE_WITH_IMAGE_SCENARIOS,
  PAGE_WITHOUT_IMAGE_SCENARIOS,
} from "~/constants/tutorials";
import { Canvas } from "~/containers/Canvas";
import { withRedux, State } from "~/domains";
import { thunkActions } from "~/domains/canvas/actions";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";
import * as GA from "~/utils/google-analytics";

// Styles

const StickersContainer = styled.div`
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

// Components

const Stickers: NextPage = () => {
  const dispatch = useDispatch();
  const { pathname } = useRouter();
  const { userLayers } = useSelector(({ canvas }: State) => canvas);

  // States

  const [isTutorial, setTutorial] = useState(false);

  // Events

  const handleOnClickStickerImage = useCallback(
    (group: number, id: number, url: string) =>
      dispatch(thunkActions.addCanvasStickerLayerWithUrl(group, id, url)),
    [dispatch]
  );

  const handleOnClickHelpButton = useCallback(() => {
    GA.playTutorial(pathname);
    setTutorial(true);
  }, []);

  const handleOnCompleteTutorial = useCallback(() => {
    setTutorial(false);
    GA.completeTutorial(pathname);
  }, []);

  const handleOnStopTutorial = useCallback(() => {
    setTutorial(false);
    GA.stopTutorial(pathname);
  }, []);

  // Render

  const isImageExists = userLayers.some((u) => u);

  return (
    <>
      <Page>
        <PageColumn>
          <ControlBar onClickHelpButton={handleOnClickHelpButton} />
          <Canvas logo={isImageExists} />
          <Menu>
            {isImageExists && (
              <div id="tutorial-stickers-images">
                <StickersContainer>
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
                </StickersContainer>
              </div>
            )}
          </Menu>
        </PageColumn>
      </Page>

      <FirstLanding />

      {isTutorial && (
        <Tutorial
          scenarios={
            isImageExists
              ? STICKERS_PAGE_WITH_IMAGE_SCENARIOS
              : PAGE_WITHOUT_IMAGE_SCENARIOS
          }
          onComplete={handleOnCompleteTutorial}
          onStop={handleOnStopTutorial}
        />
      )}
    </>
  );
};

export default withRedux(Stickers);

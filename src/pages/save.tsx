import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { ControlBar } from "~/components/ControlBar";
import { FirstLanding } from "~/components/FirstLanding";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { PageColumn } from "~/components/PageColumn";
import { Tutorial } from "~/components/Tutorial";
import {
  SAVE_PAGE_WITH_IMAGE_SCENARIOS,
  PAGE_WITHOUT_IMAGE_SCENARIOS,
} from "~/constants/tutorials";
import { Canvas } from "~/containers/Canvas";
import { withRedux, State } from "~/domains";
import * as GA from "~/utils/google-analytics";

// Styles

const Image = styled.img`
  position: fixed;
`;

// Components

const Save: NextPage = () => {
  const { pathname } = useRouter();
  const canvas = useSelector(({ canvas }: State) => canvas);

  // States

  const [isTutorial, setTutorial] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Events

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

  const handleOnSave = useCallback(() => {
    GA.saveCanvas();
  }, []);

  // Render

  const { userLayers, styleTop, styleLeft, styleWidth, styleHeight } = canvas;

  const isImageExists = userLayers.some((u) => u);

  return (
    <>
      <Page>
        <PageColumn>
          <ControlBar onClickHelpButton={handleOnClickHelpButton} />
          <Canvas
            logo={isImageExists}
            onCreatePreviewUrl={isImageExists ? setPreviewUrl : undefined}
          />
          {isImageExists && (
            <Image
              style={{
                top: styleTop,
                left: styleLeft,
                width: styleWidth,
                height: styleHeight,
                opacity: previewUrl ? 1 : 0,
              }}
              onContextMenu={handleOnSave}
              onTouchStart={handleOnSave}
              id="tutorial-save-image"
              alt="出力画像"
              src={previewUrl || ""}
            />
          )}
          <Menu />
        </PageColumn>
      </Page>

      <FirstLanding />

      {isTutorial && (
        <Tutorial
          scenarios={
            isImageExists
              ? SAVE_PAGE_WITH_IMAGE_SCENARIOS
              : PAGE_WITHOUT_IMAGE_SCENARIOS
          }
          onComplete={handleOnCompleteTutorial}
          onStop={handleOnStopTutorial}
        />
      )}
    </>
  );
};

export default withRedux(Save);

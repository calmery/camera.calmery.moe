import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NextPage } from "next";
import styled from "styled-components";
import { Page } from "~/components/Page";
import { Menu } from "~/components/Menu";
import { Canvas } from "~/containers/Canvas";
import { withRedux, State } from "~/domains";
import { Spacing } from "~/styles/spacing";
import { Tutorial } from "~/components/Tutorial";
import { ControlBar } from "~/components/ControlBar";
import { FirstLanding } from "~/components/FirstLanding";
import * as GA from "~/utils/google-analytics";
import { SAVE_PAGE_SCENARIOS } from "~/constants/tutorials";

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

const Save: NextPage = () => {
  const {
    userLayers,
    styleTop,
    styleLeft,
    styleWidth,
    styleHeight,
  } = useSelector(({ canvas }: State) => canvas);
  const imageRef: React.Ref<HTMLImageElement> = useRef(null);
  const [isTutorial, setTutorial] = useState(false);
  const isImageExists = userLayers.some((u) => u);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const e = imageRef.current;

    if (!e) {
      return;
    }

    e.style.position = "fixed";
    e.style.top = `${styleTop}px`;
    e.style.left = `${styleLeft}px`;
    e.style.width = `${styleWidth}px`;
    e.style.height = `${styleHeight}px`;
  }, [imageRef, isImageExists, styleTop, styleLeft, styleWidth, styleHeight]);

  return (
    <>
      <Page>
        <FlexColumn>
          <ControlBar onClickHelpButton={() => setTutorial(true)} />
          <Canvas onCreatePreviewUrl={setPreviewUrl} />
          {isImageExists && (
            <img
              ref={imageRef}
              onTouchStart={() => {
                GA.saveCanvas();
              }}
              onContextMenu={() => {
                GA.saveCanvas();
              }}
              id="tutorial-save-image"
              alt="出力画像"
              src={previewUrl || ""}
              style={{
                opacity: previewUrl ? 1 : 0,
              }}
            />
          )}
          <BottomBar>
            <Menu />
          </BottomBar>
        </FlexColumn>
      </Page>
      <FirstLanding />
      {isTutorial && (
        <Tutorial
          scenarios={SAVE_PAGE_SCENARIOS}
          onComplete={() => setTutorial(false)}
        />
      )}
    </>
  );
};

export default withRedux(Save);

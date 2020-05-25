import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NextPage } from "next";
import styled from "styled-components";
import { Page } from "~/components/Page";
import { Menu } from "~/components/Menu";
import { Canvas } from "~/containers/Canvas";
import { withRedux, State } from "~/domains";
import { Spacing } from "~/styles/spacing";
import { convertSvgToDataUrl } from "~/utils/convert-svg-to-url";
import { Tutorial } from "~/components/Tutorial";
import { ControlBar } from "~/components/ControlBar";
import { FirstLanding } from "~/components/FirstLanding";

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
    userFrames,
    userLayers,
    stickerLayers,
    viewBoxWidth,
    viewBoxHeight,
    styleTop,
    styleLeft,
    styleWidth,
    styleHeight,
  } = useSelector(({ canvas }: State) => canvas);
  const ref: React.Ref<HTMLDivElement> = useRef(null);
  const imageRef: React.Ref<HTMLImageElement> = useRef(null);
  const [isTutorial, setTutorial] = useState(false);

  useEffect(() => {
    (async () => {
      const dataUrl = await convertSvgToDataUrl(
        ref.current!.innerHTML,
        viewBoxWidth,
        viewBoxHeight
      );

      imageRef.current!.src = dataUrl;
    })();
  }, [ref, userFrames.length, userLayers.length, stickerLayers.length]);

  useEffect(() => {
    const e = imageRef.current!;
    e.style.position = "fixed";
    e.style.top = `${styleTop}px`;
    e.style.left = `${styleLeft}px`;
    e.style.width = `${styleWidth}px`;
    e.style.height = `${styleHeight}px`;
  }, [styleTop, styleLeft, styleWidth, styleHeight]);

  return (
    <>
      <Page>
        <FlexColumn>
          <ControlBar onClickHelpButton={() => setTutorial(true)} />
          <Canvas save containerRef={ref} />
          <BottomBar>
            <Menu />
          </BottomBar>
        </FlexColumn>
      </Page>
      <img ref={imageRef} id="tutorial-save-image" />
      <FirstLanding />
      {isTutorial && (
        <Tutorial
          scenarios={[
            {
              characterImageUrl: "https://static.calmery.moe/s/1/12.png",
              focusElementId: "tutorial-save-image",
              message: "完成〜！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/2/11.png",
              focusElementId: "tutorial-save-image",
              message: "画像を長押しすると保存できるよ！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/1/15.png",
              focusElementId: "tutorial-save-image",
              message: "とっても素敵！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/1/11.png",
              focusElementId: "tutorial-save-image",
              message:
                "Twitter で「#かるめりちゃんカメラ」を付けてツイートしてみて！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/2/3.png",
              focusElementId: "tutorial-save-image",
              message: "使ってくれてありがとう！",
            },
          ]}
          onEnd={() => setTutorial(false)}
        />
      )}
    </>
  );
};

export default withRedux(Save);

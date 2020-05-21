import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { NextPage } from "next";
import styled from "styled-components";
import { Page } from "~/components/Page";
import { Menu } from "~/components/Menu";
import { Canvas } from "~/containers/Canvas";
import { withRedux, State } from "~/domains";
import { Spacing } from "~/styles/spacing";
import { convertSvgToDataUrl } from "~/utils/convert-svg-to-url";

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ControlBar = styled.div`
  height: 16px;
  padding: ${Spacing.l}px;
  flex-shrink: 0;

  img {
    width: 16px;
    height: 16px;
  }
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
          <ControlBar>
            <img src="/images/close.svg" />
          </ControlBar>
          <Canvas save containerRef={ref} />
          <BottomBar>
            <Menu />
          </BottomBar>
        </FlexColumn>
      </Page>
      <img ref={imageRef} />
    </>
  );
};

export default withRedux(Save);

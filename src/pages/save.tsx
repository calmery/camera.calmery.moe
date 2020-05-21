import React, { useRef, useCallback, useEffect } from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { withRedux, State } from "~/domains";
import { Canvas } from "~/containers/Canvas";
import { useSelector, useDispatch } from "react-redux";
import { convertSvgToDataUrl } from "~/utils/convert-svg-to-url";
import { Spacing } from "~/styles/spacing";
import { Page } from "~/components/Page";
import { Menu } from "~/components/Menu";
import ResizeObserver from "resize-observer-polyfill";
import { actions } from "~/domains/canvas/actions";

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

const Preview: NextPage = () => {
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
          <BottomBar>
            <Menu />
          </BottomBar>
        </FlexColumn>
      </Page>
      <div
        ref={ref}
        style={{
          display: "none",
        }}
      >
        <Canvas preview />
      </div>
      <img ref={imageRef} />
    </>
  );
};

export default withRedux(Preview);

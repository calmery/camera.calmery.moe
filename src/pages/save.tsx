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

const CanvasContainer = styled.div`
  box-sizing: border-box;
  padding: 0 24px;
  flex-grow: 1;
  height: fit-content;
`;

const CanvasSizeDetector = styled.div`
  width: 100%;
  height: 100%;
`;

const BottomBar = styled.div`
  width: 100%;
  flex-shrink: 0;
  padding-top: ${Spacing.l}px;
`;

const Preview: NextPage = () => {
  const dRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const users = canvas;
  const stickers = canvas;
  const container = canvas;
  const ref: React.Ref<HTMLDivElement> = useRef(null);
  const imageRef: React.Ref<HTMLImageElement> = useRef(null);

  useEffect(() => {
    (async () => {
      const dataUrl = await convertSvgToDataUrl(
        ref.current!.innerHTML,
        container.viewBoxWidth,
        container.viewBoxHeight
      );

      const e = imageRef.current!;

      e.src = dataUrl;
    })();
  }, [ref.current!, users.layers, users.frames, stickers.layers]);

  useEffect(() => {
    const e = imageRef.current!;
    e.style.position = "fixed";
    e.style.top = `${container.styleTop}px`;
    e.style.left = `${container.styleLeft}px`;
    e.style.width = `${container.styleWidth}px`;
    e.style.height = `${container.styleHeight}px`;
  }, [container]);

  useEffect(() => {
    const e = dRef.current!;
    const resizeObserver = new ResizeObserver(() => {
      dispatch(actions.updateCanvasContainerRect(e.getBoundingClientRect()));
    });

    resizeObserver.observe(e);

    return () => {
      resizeObserver.unobserve(e);
    };
  }, []);

  return (
    <>
      <Page>
        <FlexColumn>
          <ControlBar>
            <img src="/images/close.svg" />
          </ControlBar>
          <CanvasContainer>
            <CanvasSizeDetector ref={dRef} />
          </CanvasContainer>
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

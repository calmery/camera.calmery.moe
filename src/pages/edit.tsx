import React, { useEffect, useRef } from "react";
import { NextPage } from "next";
import { useDispatch } from "react-redux";
import ResizeObserver from "resize-observer-polyfill";
import styled from "styled-components";
import { Canvas } from "~/containers/Canvas";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { withRedux } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { Spacing } from "~/styles/spacing";
import { CanvasStickers } from "~/containers/CanvasStickers";

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

const Edit: NextPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const e = ref.current!;
    const resizeObserver = new ResizeObserver(() => {
      dispatch(actions.setSvgPositionAndSize(e.getBoundingClientRect()));
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
            <CanvasSizeDetector ref={ref} />
          </CanvasContainer>
          <BottomBar>
            <CanvasStickers />
            <Menu />
          </BottomBar>
        </FlexColumn>
      </Page>
      <Canvas />
    </>
  );
};

export default withRedux(Edit);

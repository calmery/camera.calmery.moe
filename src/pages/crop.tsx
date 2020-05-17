import React, { useEffect, useState, useRef } from "react";
import styled, { css } from "styled-components";
import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { withRedux, State } from "~/domains";
import { Cropper } from "~/containers/Cropper";
import { actions } from "~/domains/cropper/actions";
import CropperPreview from "~/containers/CropperPreview";
import { Page } from "~/components/Page";
import { Spacing } from "~/styles/spacing";
import { Colors, GradientColors } from "~/styles/colors";
import { Typography } from "~/styles/typography";
import { HorizontalScrollView } from "~/components/HorizontalScrollView";
import { HorizontalScrollViewItem } from "~/components/HorizontalScrollViewItem";
import ResizeObserver from "resize-observer-polyfill";

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ControlBar = styled.div`
  width: 100%;
  height: 16px;
  padding: ${Spacing.l}px 0;
  flex-shrink: 0;

  img {
    height: 100%;
  }
`;

const Canvas = styled.div`
  box-sizing: border-box;
  padding: 24px 0;
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
  display: flex;
`;

const AspectRatioContainer = styled.div`
  display: flex;
  justify-content: strech;
  transition: 0.4s ease;
  width: 365px;
  &:hover {
    width: 100px;
  }
`;

const AspectRatio = styled.div`
  width: 36px;
  margin-right: ${Spacing.m}px;
`;

const AspectRatioIcon = styled.div<{ selected?: boolean }>`
  width: 36px;
  height: 36px;
  background: ${({ selected }) =>
    selected ? GradientColors.pinkToBlue : "transparent"};
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    filter: ${({ selected }) =>
      selected ? "brightness(0) invert(1)" : "none"};
    max-width: 22px;
    max-height: 22px;
  }
`;

const AspectRatioCenter = styled.div`
  margin: 0 auto;
  display: flex;
`;

const AspectRatioTitle = styled.div<{ selected?: boolean }>`
  ${Typography.XS};
  text-align: center;
  margin-top: ${Spacing.xs}px;
  font-weight: bold;
  color: ${Colors.gray};
  ${({ selected }) =>
    selected &&
    css`
      background: ${GradientColors.pinkToBlue};
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    `}
`;

const Crop: NextPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const freeAspect = useSelector(
    ({ cropper }: State) => cropper.cropper.freeAspect
  );
  const changeFreeAspect = () => dispatch(actions.changeFreeAspect());
  const setImage = (url: string, width: number, height: number) =>
    dispatch(actions.setImage({ url, width, height }));
  const setAspectRatio = (w: number, h: number) =>
    dispatch(actions.setAspectRatio(w, h));

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

  // Debug

  useEffect(() => {
    setImage("images/background.jpg", 1500, 1065);
  }, []);

  return (
    <>
      <Page margin>
        <FlexColumn>
          <ControlBar>
            <img src="/images/close.svg" />
          </ControlBar>
          <Canvas>
            <CanvasSizeDetector ref={ref} />
          </Canvas>
          <BottomBar>
            <AspectRatioContainer>
              <AspectRatioCenter>
                <AspectRatio>
                  <AspectRatioIcon selected>
                    <img src="/images/crop/4-3.svg" />
                  </AspectRatioIcon>
                  <AspectRatioTitle selected>4:3</AspectRatioTitle>
                </AspectRatio>

                <AspectRatio>
                  <AspectRatioIcon>
                    <img src="/images/crop/3-4.svg" />
                  </AspectRatioIcon>
                  <AspectRatioTitle>3:4</AspectRatioTitle>
                </AspectRatio>
              </AspectRatioCenter>
            </AspectRatioContainer>
          </BottomBar>
        </FlexColumn>
      </Page>
      <Cropper />
    </>
  );
};

/*
      <input
        type="checkbox"
        defaultChecked={freeAspect}
        onChange={() => changeFreeAspect()}
      />
      <button onClick={() => setAspectRatio(16, 9)}>16:9</button>
      <button onClick={() => setAspectRatio(9, 16)}>9:16</button>
      <button onClick={() => setAspectRatio(1, 1)}>1:1</button>
      <button onClick={() => setAspectRatio(4, 3)}>4:3</button>
      <button onClick={() => setAspectRatio(3, 4)}>3:4</button>
      <button onClick={() => setImage("images/background.jpg", 1500, 1065)}>
        Image 1
      </button>
      <button onClick={() => setImage("images/background-2.jpg", 1000, 333)}>
        Image 2
      </button>
      */

export default withRedux(Crop);

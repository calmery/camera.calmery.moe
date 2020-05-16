import React, { useEffect, useState } from "react";
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

const ControlBar = styled.div`
  height: 16px;
  margin: ${Spacing.l}px 0;

  img {
    height: 100%;
  }
`;

const BottomBar = styled.div`
  width: 100%;
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

const H1 = styled.div`
  background: #ff6015;
  color: #fff;
  position: sticky;
  left: 50%;
  margin-left: -50px;
  width: 100px;
`;

const Crop: NextPage = () => {
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

  // Debug

  useEffect(() => {
    setImage("images/background.jpg", 1500, 1065);
  }, []);

  const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <Page margin>
      <ControlBar>
        <img src="/images/close.svg" />
      </ControlBar>
      <div>
        <Cropper />
      </div>

      <HorizontalScrollView rootElement={(element) => setRootElement(element)}>
        <div>
          <H1>Hello</H1>
          <div style={{ display: "flex" }}>
            {rootElement &&
              data.map((props, index) => (
                <HorizontalScrollViewItem key={index} rootElement={rootElement}>
                  <div style={{ width: "100px" }}>{props}</div>
                </HorizontalScrollViewItem>
              ))}
          </div>
        </div>
        <div>
          <H1>Hello</H1>
          <div style={{ display: "flex" }}>
            {rootElement &&
              data.map((props, index) => (
                <HorizontalScrollViewItem key={index} rootElement={rootElement}>
                  <div style={{ width: "100px" }}>{props}</div>
                </HorizontalScrollViewItem>
              ))}
          </div>
        </div>
      </HorizontalScrollView>

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
    </Page>
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

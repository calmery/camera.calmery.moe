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
import { Menu } from "~/components/Menu";
import { Mixin } from "~/styles/mixin";

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

const Canvas = styled.div`
  box-sizing: border-box;
  padding: 24px;
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
`;

const Rotate = styled.div`
  ${Typography.S};

  text-align: center;
  font-weight: bold;
  margin-bottom: ${Spacing.l}px;
  color: ${Colors.black};
`;

const AspectRatioContainer = styled.div`
  margin-bottom: ${Spacing.l}px;
`;

const AspectRatio = styled.div<{ selected?: boolean }>`
  margin-right: ${Spacing.m}px;
  cursor: pointer;

  ${({ selected }) =>
    selected &&
    css`
      ${Mixin.clickable};
    `}
`;

const AspectRatioFree = styled.div<{ selected?: boolean }>`
  margin-right: ${Spacing.m}px;
  cursor: pointer;
  margin-left: ${Spacing.l}px;

  ${({ selected }) =>
    selected &&
    css`
      ${Mixin.clickable};
    `}
`;

const AspectRatioIcon = styled.div<{ selected?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ selected }) =>
    selected &&
    css`
      background: ${GradientColors.pinkToBlue};

      img {
        filter: brightness(0) invert(1);
      }
    `}
`;

const AspectRatioTitle = styled.div<{ selected?: boolean }>`
  ${Typography.XS};

  font-weight: bold;
  color: ${Colors.gray};
  text-align: center;
  margin-top: ${Spacing.xs}px;

  ${({ selected }) =>
    selected &&
    css`
      background: ${GradientColors.pinkToBlue};
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    `}
`;

const aspectRatios = [
  {
    w: 1,
    h: 1,
  },
  {
    w: 3,
    h: 4,
  },
  {
    w: 4,
    h: 3,
  },
  {
    w: 9,
    h: 16,
  },
  {
    w: 16,
    h: 9,
  },
  {
    w: 3,
    h: 1,
  },
];

const Crop: NextPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const { image, cropper } = useSelector(({ cropper }: State) => cropper);
  // const initializeCropperImage = (url: string, width: number, height: number) =>
  //   dispatch(actions.initializeCropperImage({ url, width, height }));
  const changeCropperCropperAspectRatio = (
    index: number,
    w: number,
    h: number
  ) => dispatch(actions.changeCropperCropperAspectRatio(index, w, h));

  useEffect(() => {
    const e = ref.current!;
    const resizeObserver = new ResizeObserver(() => {
      dispatch(actions.updateCropperContainerRect(e.getBoundingClientRect()));
    });

    resizeObserver.observe(e);

    return () => {
      resizeObserver.unobserve(e);
    };
  }, []);

  // Debug

  // useEffect(() => {
  //   initializeCropperImage("images/background.jpg", 1500, 1065);
  // }, []);

  let rotate = image.rotate.current;

  if (rotate < 0) {
    rotate = 360 - (Math.abs(rotate) % 360);
  } else {
    rotate = rotate % 360;
  }

  return (
    <>
      <Page>
        <FlexColumn>
          <ControlBar>
            <img src="/images/close.svg" />
          </ControlBar>
          <Canvas>
            <CanvasSizeDetector ref={ref} />
          </Canvas>
          <BottomBar>
            <Rotate>{Math.floor(rotate)}°</Rotate>
            <AspectRatioContainer>
              <HorizontalScrollView
                rootElement={(element) => setRootElement(element)}
              >
                {rootElement && (
                  <>
                    <HorizontalScrollViewItem rootElement={rootElement}>
                      <AspectRatioFree
                        selected={cropper.selectedIndex === -1}
                        onClick={
                          // ToDo: FreeAspect を true にする処理が必要になる
                          () => {
                            console.log;
                          }
                        }
                      >
                        <AspectRatioIcon
                          selected={cropper.selectedIndex === -1}
                        >
                          <img src="/images/crop/free.svg" />
                        </AspectRatioIcon>
                        <AspectRatioTitle
                          selected={cropper.selectedIndex === -1}
                        >
                          Free
                        </AspectRatioTitle>
                      </AspectRatioFree>
                    </HorizontalScrollViewItem>
                    {aspectRatios.map(({ w, h }, index) => {
                      return (
                        <HorizontalScrollViewItem
                          rootElement={rootElement}
                          key={index}
                        >
                          <AspectRatio
                            selected={cropper.selectedIndex === index}
                            onClick={() =>
                              changeCropperCropperAspectRatio(index, w, h)
                            }
                          >
                            <AspectRatioIcon
                              selected={cropper.selectedIndex === index}
                            >
                              <img src={`/images/crop/${w}-${h}.svg`} />
                            </AspectRatioIcon>
                            <AspectRatioTitle
                              selected={cropper.selectedIndex === index}
                            >
                              {w}:{h}
                            </AspectRatioTitle>
                          </AspectRatio>
                        </HorizontalScrollViewItem>
                      );
                    })}
                  </>
                )}
              </HorizontalScrollView>
            </AspectRatioContainer>
            <Menu />
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
      <button onClick={() => changeCropperCropperAspectRatio(16, 9)}>16:9</button>
      <button onClick={() => changeCropperCropperAspectRatio(9, 16)}>9:16</button>
      <button onClick={() => changeCropperCropperAspectRatio(1, 1)}>1:1</button>
      <button onClick={() => changeCropperCropperAspectRatio(4, 3)}>4:3</button>
      <button onClick={() => changeCropperCropperAspectRatio(3, 4)}>3:4</button>
      <button onClick={() => initializeCropperImage("images/background.jpg", 1500, 1065)}>
        Image 1
      </button>
      <button onClick={() => initializeCropperImage("images/background-2.jpg", 1000, 333)}>
        Image 2
      </button>
      */

export default withRedux(Crop);

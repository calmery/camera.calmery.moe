import React, { useState } from "react";
import styled, { css } from "styled-components";
import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { withRedux, State } from "~/domains";
import { Canvas } from "~/containers/Canvas";
import { Cropper } from "~/containers/Cropper";
import { actions } from "~/domains/cropper/actions";
import { actions as canvasActions } from "~/domains/canvas/actions";
import { Page } from "~/components/Page";
import { Spacing } from "~/styles/spacing";
import { Colors, GradientColors } from "~/styles/colors";
import { Typography } from "~/styles/typography";
import { HorizontalScrollView } from "~/components/HorizontalScrollView";
import { HorizontalScrollViewItem } from "~/components/HorizontalScrollViewItem";
import { Menu } from "~/components/Menu";
import { Mixin } from "~/styles/mixin";
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
  display: flex;
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

const CropTargetImages = styled.div`
  align-items: center;
  height: 54px;
  display: flex;
`;

const CropTargetImage = styled.div`
  ${Mixin.clickable};

  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${Spacing.m}px;
  cursor: pointer;

  &:first-child {
    margin-left: ${Spacing.l}px;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 2px;
    box-sizing: border-box;
    border: 1px solid ${Colors.lightGray};
  }
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
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const { image, cropper } = useSelector(({ cropper }: State) => cropper);
  const changeCropperCropperAspectRatio = (
    index: number,
    w: number,
    h: number
  ) => dispatch(actions.changeCropperCropperAspectRatio(index, w, h));
  const [isTutorial, setTutorial] = useState(false);

  const isImageExists = canvas.userLayers.some((l) => !!l);

  // Debug

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
          <ControlBar onClickHelpButton={() => setTutorial(true)} />
          {isImageExists && <Cropper />}
          {!isImageExists && <Canvas />}
          <BottomBar>
            <div style={{ marginTop: `${Spacing.l}px` }}></div>
            {isImageExists && (
              <>
                <Rotate id="tutorial-crop-angle">{Math.floor(rotate)}°</Rotate>
                <AspectRatioContainer>
                  <HorizontalScrollView
                    id="tutorial-crop-aspect-ratios"
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
                  <CropTargetImages id="tutorial-crop-target-images">
                    {canvas.userLayers.map((userLayer, index) => {
                      if (!userLayer) {
                        return null;
                      }

                      return (
                        <CropTargetImage
                          key={index}
                          onClick={() => {
                            const {
                              dataUrl,
                              width,
                              height,
                              cropper,
                            } = userLayer;

                            dispatch(
                              canvasActions.startCanvasUserLayerCrop(index)
                            );

                            dispatch(
                              actions.initializeCropperImage({
                                url: dataUrl,
                                width,
                                height,
                                ...cropper,
                              })
                            );
                          }}
                        >
                          <img src={userLayer.dataUrl} />
                        </CropTargetImage>
                      );
                    })}
                  </CropTargetImages>
                </AspectRatioContainer>
              </>
            )}
            <Menu />
          </BottomBar>
        </FlexColumn>
      </Page>
      <FirstLanding />
      {isTutorial && (
        <Tutorial
          scenarios={
            isImageExists
              ? [
                  {
                    characterImageUrl: "https://static.calmery.moe/s/2/17.png",
                    focusElementId: "tutorial-cropper",
                    message: "ここにはクロップする画像が表示されているよ！",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/1/5.png",
                    focusElementId: "tutorial-cropper",
                    message: "画面をタップしてクロップ位置を調整したり...",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/1/5.png",
                    focusElementId: "tutorial-cropper",
                    message: "2 本指でタッチして画像の大きさを変えてみよう！",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/1/16.png",
                    focusElementId: "tutorial-crop-angle",
                    message: `回した角度はここで確認！もうちょっと回してみようかな？`,
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/1/10.png",
                    focusElementId: "tutorial-crop-angle",
                    message: "あれっ...もしかしてパソコン...？",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/1/10.png",
                    focusElementId: "tutorial-crop-angle",
                    message: "...",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/1/6.png",
                    focusElementId: "tutorial-crop-angle",
                    message: "......",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/1/2.png",
                    focusElementId: "tutorial-crop-angle",
                    message: "パソコンからだと回転できないみたい...ごめんね...",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/1/7.png",
                    focusElementId: "tutorial-crop-angle",
                    message: "気を取り直して...！",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/2/3.png",
                    focusElementId: "tutorial-crop-aspect-ratios",
                    message:
                      "ここで対比を選べるよ！\n比率を保ったまま操作したいときに使おう！",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/2/4.png",
                    focusElementId: "tutorial-crop-target-images",
                    message: "他の画像をクロップしたい？",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/2/4.png",
                    focusElementId: "tutorial-crop-target-images",
                    message: "ここでクロップしたい画像をタップしてみて！",
                  },
                ]
              : [
                  {
                    characterImageUrl: "https://static.calmery.moe/s/2/17.png",
                    focusElementId: "tutorial-canvas",
                    message: "まずはここをタップして画像を読み込んでみて！",
                  },
                ]
          }
          onEnd={() => setTutorial(false)}
        />
      )}
    </>
  );
};

export default withRedux(Crop);

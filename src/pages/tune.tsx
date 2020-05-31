import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { withRedux, State } from "~/domains";
import { Canvas } from "~/containers/Canvas";
import { actions } from "~/domains/ui/actions";
import { actions as canvasActions } from "~/domains/canvas/actions";
import { Page } from "~/components/Page";
import { Spacing } from "~/styles/spacing";
import { Colors, GradientColors } from "~/styles/colors";
import { Typography } from "~/styles/typography";
import { HorizontalScrollView } from "~/components/HorizontalScrollView";
import { HorizontalScrollViewItem } from "~/components/HorizontalScrollViewItem";
import { Menu } from "~/components/Menu";
import { Mixin } from "~/styles/mixin";
import { FeColorMatrix } from "~/types/FeColorMatrix";
import { InputRange } from "~/components/InputRange";
import { thunkActions } from "~/domains/canvas/actions";
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

const FilterTypeContainer = styled.div`
  margin-bottom: ${Spacing.l}px;
  display: flex;
`;

const FilterType = styled.div<{ selected?: boolean }>`
  margin-right: ${Spacing.m}px;
  cursor: pointer;

  ${({ selected }) =>
    selected &&
    css`
      ${Mixin.clickable};
    `}
`;

const FilterTypeFree = styled.div<{ selected?: boolean }>`
  margin-right: ${Spacing.m}px;
  cursor: pointer;
  margin-left: ${Spacing.l}px;

  ${({ selected }) =>
    selected &&
    css`
      ${Mixin.clickable};
    `}
`;

const FilterTypeIcon = styled.div<{ selected?: boolean }>`
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

const FilterTypeTitle = styled.div<{ selected?: boolean }>`
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

const TuneTargetImages = styled.div`
  align-items: center;
  height: 54px;
  display: flex;
`;

const TuneTargetImage = styled.div`
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

const FilterContainer = styled.div`
  margin: 0 ${Spacing.l}px;
  margin-bottom: ${Spacing.m}px;
`;

const Tune: NextPage = () => {
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const [isTutorial, setTutorial] = useState(false);
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const ui = useSelector(({ ui }: State) => ui);
  const isImageExists = canvas.userLayers.some((l) => !!l);
  const { essentialLayers } = useSelector(({ canvas }: State) => canvas);

  useEffect(() => {
    if (essentialLayers.length === 0) {
      dispatch(thunkActions.addCanvasEssentialLayerWithUrl("/images/logo.png"));
    }
  }, []);

  let userLayer =
    canvas.userLayers[canvas.temporaries.selectedUserLayerFilterIndex];

  if (!userLayer) {
    const i = canvas.userLayers.findIndex((l) => !!l);
    userLayer = canvas.userLayers[i]!;
  }

  return (
    <>
      <Page>
        <FlexColumn>
          <ControlBar onClickHelpButton={() => setTutorial(true)}>
            <img src="/images/close.svg" />
          </ControlBar>
          <Canvas stickers={false} />
          <BottomBar>
            <div style={{ marginTop: `${Spacing.l}px` }}></div>
            {isImageExists && (
              <FilterContainer id="tutorial-filter-input">
                <div
                  style={{
                    display:
                      FeColorMatrix.blur === ui.selectedFilterType
                        ? "block"
                        : "none",
                  }}
                >
                  <InputRange
                    min={0}
                    max={12}
                    step={1}
                    baseValue={0}
                    defaultValue={userLayer.blur}
                    onChange={(value: number) => {
                      dispatch(
                        canvasActions.updateCanvasUserLayerFilter(
                          FeColorMatrix.blur,
                          value
                        )
                      );
                    }}
                  />
                </div>
                <div
                  style={{
                    display:
                      FeColorMatrix.hue === ui.selectedFilterType
                        ? "block"
                        : "none",
                  }}
                >
                  <InputRange
                    min={0}
                    max={359}
                    step={1}
                    baseValue={0}
                    defaultValue={userLayer.hue}
                    onChange={(value: number) => {
                      dispatch(
                        canvasActions.updateCanvasUserLayerFilter(
                          FeColorMatrix.hue,
                          value
                        )
                      );
                    }}
                  />
                </div>
                <div
                  style={{
                    display:
                      FeColorMatrix.saturate === ui.selectedFilterType
                        ? "block"
                        : "none",
                  }}
                >
                  <InputRange
                    min={-1}
                    max={2}
                    step={0.1}
                    baseValue={1}
                    defaultValue={userLayer.saturate}
                    onChange={(value: number) => {
                      dispatch(
                        canvasActions.updateCanvasUserLayerFilter(
                          FeColorMatrix.saturate,
                          value
                        )
                      );
                    }}
                  />
                </div>
              </FilterContainer>
            )}
            {isImageExists && (
              <>
                <FilterTypeContainer>
                  <HorizontalScrollView
                    id="tutorial-filters"
                    rootElement={(element) => setRootElement(element)}
                  >
                    {rootElement && (
                      <>
                        <HorizontalScrollViewItem rootElement={rootElement}>
                          <FilterTypeFree
                            selected={
                              ui.selectedFilterType === FeColorMatrix.blur
                            }
                            onClick={() =>
                              dispatch(
                                actions.changeUiFilterType(FeColorMatrix.blur)
                              )
                            }
                          >
                            <FilterTypeIcon
                              selected={
                                ui.selectedFilterType === FeColorMatrix.blur
                              }
                            >
                              <img src="/images/tune/blur.svg" />
                            </FilterTypeIcon>
                            <FilterTypeTitle
                              selected={
                                ui.selectedFilterType === FeColorMatrix.blur
                              }
                            >
                              ぼかし
                            </FilterTypeTitle>
                          </FilterTypeFree>
                        </HorizontalScrollViewItem>
                        <HorizontalScrollViewItem rootElement={rootElement}>
                          <FilterType
                            selected={
                              ui.selectedFilterType === FeColorMatrix.hue
                            }
                            onClick={() =>
                              dispatch(
                                actions.changeUiFilterType(FeColorMatrix.hue)
                              )
                            }
                          >
                            <FilterTypeIcon
                              selected={
                                ui.selectedFilterType === FeColorMatrix.hue
                              }
                            >
                              <img src="/images/tune/hue.svg" />
                            </FilterTypeIcon>
                            <FilterTypeTitle
                              selected={
                                ui.selectedFilterType === FeColorMatrix.hue
                              }
                            >
                              色相
                            </FilterTypeTitle>
                          </FilterType>
                        </HorizontalScrollViewItem>
                        <HorizontalScrollViewItem rootElement={rootElement}>
                          <FilterType
                            selected={
                              ui.selectedFilterType === FeColorMatrix.saturate
                            }
                            onClick={() =>
                              dispatch(
                                actions.changeUiFilterType(
                                  FeColorMatrix.saturate
                                )
                              )
                            }
                          >
                            <FilterTypeIcon
                              selected={
                                ui.selectedFilterType === FeColorMatrix.saturate
                              }
                            >
                              <img src="/images/tune/saturate.svg" />
                            </FilterTypeIcon>
                            <FilterTypeTitle
                              selected={
                                ui.selectedFilterType === FeColorMatrix.saturate
                              }
                            >
                              彩度
                            </FilterTypeTitle>
                          </FilterType>
                        </HorizontalScrollViewItem>
                      </>
                    )}
                  </HorizontalScrollView>
                  <TuneTargetImages id="tutorial-filter-targets">
                    {canvas.userLayers.map((userLayer, index) => {
                      if (!userLayer) {
                        return null;
                      }

                      return (
                        <TuneTargetImage
                          key={index}
                          onClick={() => {
                            dispatch(
                              canvasActions.startCanvasUserLayerFilter(index)
                            );
                          }}
                        >
                          <img src={userLayer.dataUrl} />
                        </TuneTargetImage>
                      );
                    })}
                  </TuneTargetImages>
                </FilterTypeContainer>
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
                    emphasisElementId: "tutorial-canvas",
                    message: "ここにフィルターをかける画像が表示されているよ！",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/2/3.png",
                    emphasisElementId: "tutorial-filter-input",
                    message: "ここがフィルターの値を変更するところ！",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/1/15.png",
                    emphasisElementId: "tutorial-filters",
                    message:
                      "色んなフィルターを使って自分好みの画像にしちゃおう！",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/2/11.png",
                    emphasisElementId: "tutorial-filter-targets",
                    message: "他の画像にフィルターをかけたい？",
                  },
                  {
                    characterImageUrl: "https://static.calmery.moe/s/2/11.png",
                    emphasisElementId: "tutorial-filter-targets",
                    message:
                      "ここでフィルターをかけたい画像をタップしてみよう！",
                  },
                ]
              : [
                  {
                    characterImageUrl: "https://static.calmery.moe/s/2/17.png",
                    emphasisElementId: "tutorial-canvas",
                    message: "まずはここをタップして画像を読み込んでみて！",
                  },
                ]
          }
          onComplete={() => setTutorial(false)}
        />
      )}
    </>
  );
};

export default withRedux(Tune);

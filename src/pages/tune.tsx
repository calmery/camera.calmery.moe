import React, { useState } from "react";
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
import { Input } from "~/components/Input";

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
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const ui = useSelector(({ ui }: State) => ui);
  const isImageExists = canvas.userLayers.some((l) => !!l);

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
          <ControlBar>
            <img src="/images/close.svg" />
          </ControlBar>
          <Canvas />
          <BottomBar>
            <div style={{ marginTop: `${Spacing.l}px` }}></div>
            {isImageExists && (
              <FilterContainer>
                <div
                  style={{
                    display:
                      FeColorMatrix.blur === ui.selectedFilterType
                        ? "block"
                        : "none",
                  }}
                >
                  <Input
                    id={FeColorMatrix.blur}
                    min={0}
                    max={12}
                    step={1}
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
                  <Input
                    id={FeColorMatrix.hue}
                    min={0}
                    max={359}
                    step={1}
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
                  <Input
                    id={FeColorMatrix.saturate}
                    min={-1}
                    max={2}
                    step={0.1}
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
                              <img src="/images/crop/free.svg" />
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
                              <img src="/images/crop/free.svg" />
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
                              <img src="/images/crop/free.svg" />
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
                  <TuneTargetImages>
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
    </>
  );
};

export default withRedux(Tune);

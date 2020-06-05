import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { ControlBar } from "~/components/ControlBar";
import { FirstLanding } from "~/components/FirstLanding";
import { Page } from "~/components/Page";
import { PageColumn } from "~/components/PageColumn";
import { Horizontal } from "~/components/Horizontal";
import { HorizontalInner } from "~/components/HorizontalInner";
import { Menu } from "~/components/Menu";
import { Tutorial } from "~/components/Tutorial";
import { ASPECT_RATIOS } from "~/constants/cropper";
import {
  CROP_PAGE_WITH_IMAGE_SCENARIOS,
  PAGE_WITHOUT_IMAGE_SCENARIOS,
} from "~/constants/tutorials";
import { Canvas } from "~/containers/Canvas";
import { Cropper } from "~/containers/Cropper";
import { State, withRedux } from "~/domains";
import { actions } from "~/domains/cropper/actions";
import { actions as canvasActions } from "~/domains/canvas/actions";
import { Colors, GradientColors } from "~/styles/colors";
import { Constants } from "~/styles/constants";
import { Mixin } from "~/styles/mixin";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";
import * as GA from "~/utils/google-analytics";

// Styles

const Angle = styled.div`
  ${Typography.S};

  text-align: center;
  font-weight: bold;
  margin-bottom: ${Spacing.l}px;
  color: ${Colors.black};
  display: flex;
  justify-content: center;
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

const CropTargetImage = styled.div<{ selected?: boolean }>`
  ${Mixin.clickable};

  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${Spacing.m}px;
  cursor: pointer;
  opacity: ${({ selected }) => (selected ? 1 : Constants.opacity)};

  &:first-child {
    margin-left: ${Spacing.m}px;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 2px;
    box-sizing: border-box;
    border: 1px solid ${Colors.lightGray};
  }
`;

const TargetImageDivider = styled.div`
  width: 2px;
  height: 54px;
  background: ${GradientColors.pinkToBlue};
  border-radius: 1px;
  flex-shrink: 0;
`;

// Components

const Crop: NextPage = () => {
  const { pathname } = useRouter();
  const dispatch = useDispatch();
  const { temporaries, userLayers } = useSelector(
    ({ canvas }: State) => canvas
  );
  const cropper = useSelector(({ cropper }: State) => cropper);

  // States

  const [isTutorial, setTutorial] = useState(false);

  // Events

  const handleOnClickHelpButton = useCallback(() => {
    GA.playTutorial(pathname);
    setTutorial(true);
  }, []);

  const handleOnCompleteTutorial = useCallback(() => {
    setTutorial(false);
    GA.completeTutorial(pathname);
  }, []);

  const handleOnStopTutorial = useCallback(() => {
    setTutorial(false);
    GA.stopTutorial(pathname);
  }, []);

  const handleOnChangeFixedAspectRatio = useCallback(
    (i: number, w: number, h: number) => {
      dispatch(actions.changeCropperCropperAspectRatio(i, w, h));
    },
    [dispatch]
  );

  const handleOnChangeFreeAspectRatio = useCallback(() => {
    dispatch(actions.changeCropperCropperFreeAspectRatio());
  }, [dispatch]);

  const handleOnChangeCropTargetImage = useCallback(
    (i: number) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const userLayer = userLayers[i]!;

      const { dataUrl, width, height, cropper } = userLayer;

      dispatch(canvasActions.startCanvasUserLayerCrop(i));
      dispatch(
        actions.initializeCropperImage({
          url: dataUrl,
          width,
          height,
          ...cropper,
        })
      );
    },
    [dispatch, userLayers]
  );

  // Render

  const isImageExists = userLayers.some((u) => u);
  let angle = cropper.imageAngle;

  if (angle < 0) {
    angle = 360 - (Math.abs(angle) % 360);
  } else {
    angle = angle % 360;
  }

  return (
    <>
      <Page>
        <PageColumn>
          <ControlBar onClickHelpButton={handleOnClickHelpButton} />
          {!isImageExists && <Canvas logo={false} stickers={false} />}
          {isImageExists && <Cropper />}
          <Menu>
            {isImageExists && (
              <>
                <Angle>
                  <div id="tutorial-crop-angle">{Math.floor(angle)}°</div>
                </Angle>
                <AspectRatioContainer>
                  <Horizontal>
                    <HorizontalInner id="tutorial-crop-aspect-ratios">
                      <AspectRatioFree
                        selected={cropper.freeAspect}
                        onClick={handleOnChangeFreeAspectRatio}
                      >
                        <AspectRatioIcon selected={cropper.freeAspect}>
                          <img src="/images/pages/crop/free.svg" alt="Free" />
                        </AspectRatioIcon>
                        <AspectRatioTitle selected={cropper.freeAspect}>
                          Free
                        </AspectRatioTitle>
                      </AspectRatioFree>
                      {ASPECT_RATIOS.map(({ w, h }, index) => {
                        return (
                          <>
                            <AspectRatio
                              selected={
                                !cropper.freeAspect &&
                                cropper.temporaries.selectedIndex === index
                              }
                              onClick={() =>
                                handleOnChangeFixedAspectRatio(index, w, h)
                              }
                            >
                              <AspectRatioIcon
                                selected={
                                  !cropper.freeAspect &&
                                  cropper.temporaries.selectedIndex === index
                                }
                              >
                                <img
                                  src={`/images/pages/crop/${w}-${h}.svg`}
                                  alt={`${w}:${h}`}
                                />
                              </AspectRatioIcon>
                              <AspectRatioTitle
                                selected={
                                  !cropper.freeAspect &&
                                  cropper.temporaries.selectedIndex === index
                                }
                              >
                                {w}:{h}
                              </AspectRatioTitle>
                            </AspectRatio>
                          </>
                        );
                      })}
                    </HorizontalInner>
                  </Horizontal>
                  <TargetImageDivider />
                  <CropTargetImages id="tutorial-crop-target-images">
                    {userLayers.map((userLayer, i) => {
                      if (!userLayer) {
                        return null;
                      }

                      return (
                        <CropTargetImage
                          key={i}
                          onClick={() => handleOnChangeCropTargetImage(i)}
                          selected={temporaries.selectedUserLayerIndex === i}
                        >
                          <img src={userLayer.dataUrl} alt="編集画像" />
                        </CropTargetImage>
                      );
                    })}
                  </CropTargetImages>
                </AspectRatioContainer>
              </>
            )}
          </Menu>
        </PageColumn>
      </Page>

      <FirstLanding />

      {isTutorial && (
        <Tutorial
          scenarios={
            isImageExists
              ? CROP_PAGE_WITH_IMAGE_SCENARIOS
              : PAGE_WITHOUT_IMAGE_SCENARIOS
          }
          onComplete={handleOnCompleteTutorial}
          onStop={handleOnStopTutorial}
        />
      )}
    </>
  );
};

export default withRedux(Crop);

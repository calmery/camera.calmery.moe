import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { ControlBar } from "~/components/ControlBar";
import { FirstLanding } from "~/components/FirstLanding";
import { Horizontal } from "~/components/Horizontal";
import { HorizontalInner } from "~/components/HorizontalInner";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { PageColumn } from "~/components/PageColumn";
import { Tutorial } from "~/components/Tutorial";
import { COLLAGES_PAGE_SCENARIOS } from "~/constants/tutorials";
import { Canvas } from "~/containers/Canvas";
import { withRedux, State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { canvasUserLayerFrame } from "~/domains/canvas/frames";
import { GradientColors } from "~/styles/colors";
import { Spacing } from "~/styles/spacing";
import { CanvasUserFrameType } from "~/types/CanvasUserFrameType";
import * as GA from "~/utils/google-analytics";

// Styles

const FramesContainer = styled.div`
  margin-bottom: ${Spacing.l}px;
  padding: 0 ${Spacing.l}px;
`;

const FrameButton = styled.div<{ selected?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 100%;
  margin-left: ${Spacing.s}px;

  &:first-child {
    margin-left: 0;
  }

  object {
    width: 22px;
    height: 22px;
    pointer-events: none;
  }

  ${({ selected }) =>
    selected &&
    css`
      background: ${GradientColors.pinkToBlue};

      object {
        filter: brightness(0) invert(1);
      }
    `}
`;

// Components

const Frames: NextPage = () => {
  const dispatch = useDispatch();
  const { pathname } = useRouter();
  const { selectedUserLayerFrame } = useSelector(({ ui }: State) => ui);

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

  const handleOnClickEnableCollage = useCallback(
    (frame: CanvasUserFrameType, i: number) => {
      dispatch(actions.enableCollage(frame, i));
    },
    [dispatch]
  );

  const handleOnClickDisableCollage = useCallback(() => {
    dispatch(actions.disableCollage());
  }, [dispatch]);

  // Render

  return (
    <>
      <Page>
        <PageColumn>
          <ControlBar onClickHelpButton={handleOnClickHelpButton} />
          <Canvas logo={false} removable stickers={false} />
          <Menu>
            <div id="tutorial-frames-canvas-frames">
              <FramesContainer>
                <Horizontal>
                  <HorizontalInner>
                    <FrameButton
                      selected={!selectedUserLayerFrame}
                      onClick={handleOnClickDisableCollage}
                    >
                      <object
                        type="image/svg+xml"
                        data={`/images/pages/frames/disable.svg`}
                      />
                    </FrameButton>
                    {canvasUserLayerFrame[CanvasUserFrameType.W3H4].frames.map(
                      (_, i) => (
                        <FrameButton
                          onClick={() =>
                            handleOnClickEnableCollage(
                              CanvasUserFrameType.W3H4,
                              i
                            )
                          }
                          selected={
                            !!(
                              selectedUserLayerFrame &&
                              selectedUserLayerFrame.frame ===
                                CanvasUserFrameType.W3H4 &&
                              selectedUserLayerFrame.index === i
                            )
                          }
                          key={i}
                        >
                          <object
                            type="image/svg+xml"
                            data={`/images/pages/frames/3-4-${i}.svg`}
                          />
                        </FrameButton>
                      )
                    )}
                    {canvasUserLayerFrame[CanvasUserFrameType.W4H3].frames.map(
                      (_, i) => (
                        <FrameButton
                          onClick={() =>
                            handleOnClickEnableCollage(
                              CanvasUserFrameType.W4H3,
                              i
                            )
                          }
                          selected={
                            !!(
                              selectedUserLayerFrame &&
                              selectedUserLayerFrame.frame ===
                                CanvasUserFrameType.W4H3 &&
                              selectedUserLayerFrame.index === i
                            )
                          }
                          key={i}
                        >
                          <object
                            type="image/svg+xml"
                            data={`/images/pages/frames/4-3-${i}.svg`}
                          />
                        </FrameButton>
                      )
                    )}
                  </HorizontalInner>
                </Horizontal>
              </FramesContainer>
            </div>
          </Menu>
        </PageColumn>
      </Page>

      <FirstLanding />

      {isTutorial && (
        <Tutorial
          scenarios={COLLAGES_PAGE_SCENARIOS}
          onComplete={handleOnCompleteTutorial}
          onStop={handleOnStopTutorial}
        />
      )}
    </>
  );
};

export default withRedux(Frames);

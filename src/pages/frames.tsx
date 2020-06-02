import { NextPage } from "next";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { ControlBar } from "~/components/ControlBar";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { Tutorial } from "~/components/Tutorial";
import { Canvas } from "~/containers/Canvas";
import { withRedux, State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { canvasUserLayerFrame } from "~/domains/canvas/frames";
import { Spacing } from "~/styles/spacing";
import { GradientColors } from "~/styles/colors";
import { CanvasUserFrameType } from "~/types/CanvasUserFrameType";
import { COLLAGES_PAGE_SCENARIOS } from "~/constants/tutorials";
import * as GA from "~/utils/google-analytics";
import { useRouter } from "next/router";

const Horizontal = styled.div`
  width: 100%;
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const HorizontalInner = styled.div`
  width: fit-content;
  display: flex;
  padding: 0 ${Spacing.l}px;
`;

const Container = styled.div`
  margin-bottom: ${Spacing.l}px;
`;

const CollageButton = styled.div<{ selected?: boolean }>`
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

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const BottomBar = styled.div`
  width: 100%;
  flex-shrink: 0;
  padding-top: ${Spacing.l}px;
`;

const Frames: NextPage = () => {
  const { userLayers } = useSelector(({ canvas }: State) => canvas);
  const [isTutorial, setTutorial] = useState(false);
  const dispatch = useDispatch();
  const { selectedUserLayerFrame } = useSelector(({ ui }: State) => ui);
  const { pathname } = useRouter();
  const handleOnClickEnableCollage = (
    frame: CanvasUserFrameType,
    index: number
  ) => dispatch(actions.enableCollage(frame, index));
  const handleOnClickDisableCollage = () => dispatch(actions.disableCollage());

  let userLayerCount = 0;

  userLayers.forEach((u) => u && userLayerCount++);

  return (
    <>
      <Page>
        <FlexColumn>
          <ControlBar
            onClickHelpButton={() => {
              GA.playTutorial(pathname);
              setTutorial(true);
            }}
          />
          <Canvas
            logo={false}
            stickers={false}
            removable={userLayerCount > 1}
          />
          <BottomBar>
            <div id="tutorial-collage-canvas-frames">
              <Container>
                <Horizontal>
                  <HorizontalInner>
                    <CollageButton
                      selected={!selectedUserLayerFrame}
                      onClick={handleOnClickDisableCollage}
                    >
                      <object
                        type="image/svg+xml"
                        data={`/images/pages/frames/disable.svg`}
                      />
                    </CollageButton>
                    {canvasUserLayerFrame[CanvasUserFrameType.W3H4].frames.map(
                      (_, index) => (
                        <CollageButton
                          onClick={() =>
                            handleOnClickEnableCollage(
                              CanvasUserFrameType.W3H4,
                              index
                            )
                          }
                          selected={
                            !!(
                              selectedUserLayerFrame &&
                              selectedUserLayerFrame.frame ===
                                CanvasUserFrameType.W3H4 &&
                              selectedUserLayerFrame.index === index
                            )
                          }
                          key={index}
                        >
                          <object
                            type="image/svg+xml"
                            data={`/images/pages/frames/3-4-${index}.svg`}
                          />
                        </CollageButton>
                      )
                    )}
                    {canvasUserLayerFrame[CanvasUserFrameType.W4H3].frames.map(
                      (_, index) => (
                        <CollageButton
                          onClick={() =>
                            handleOnClickEnableCollage(
                              CanvasUserFrameType.W4H3,
                              index
                            )
                          }
                          selected={
                            !!(
                              selectedUserLayerFrame &&
                              selectedUserLayerFrame.frame ===
                                CanvasUserFrameType.W4H3 &&
                              selectedUserLayerFrame.index === index
                            )
                          }
                          key={index}
                        >
                          <object
                            type="image/svg+xml"
                            data={`/images/pages/frames/4-3-${index}.svg`}
                          />
                        </CollageButton>
                      )
                    )}
                  </HorizontalInner>
                </Horizontal>
              </Container>
            </div>
            <Menu />
          </BottomBar>
        </FlexColumn>
      </Page>
      {isTutorial && (
        <Tutorial
          scenarios={COLLAGES_PAGE_SCENARIOS}
          onComplete={() => {
            setTutorial(false);
            GA.completeTutorial(pathname);
          }}
          onStop={() => {
            setTutorial(false);
            GA.stopTutorial(pathname);
          }}
        />
      )}
    </>
  );
};

export default withRedux(Frames);

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
import { CanvasUserLayerFrameType } from "~/types/CanvasUserLayerFrameType";

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

const Collages: NextPage = () => {
  const { userLayers } = useSelector(({ canvas }: State) => canvas);
  const [isTutorial, setTutorial] = useState(false);
  const dispatch = useDispatch();
  const { selectedUserLayerFrame } = useSelector(({ ui }: State) => ui);
  const handleOnClickEnableCollage = (
    frame: CanvasUserLayerFrameType,
    index: number
  ) => dispatch(actions.enableCollage(frame, index));
  const handleOnClickDisableCollage = () => dispatch(actions.disableCollage());

  let userLayerCount = 0;

  userLayers.forEach((u) => u && userLayerCount++);

  return (
    <>
      <Page>
        <FlexColumn>
          <ControlBar onClickHelpButton={() => setTutorial(true)} />
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
                        data={`/images/collages/disable.svg`}
                      />
                    </CollageButton>
                    {canvasUserLayerFrame[
                      CanvasUserLayerFrameType.W3H4
                    ].frames.map((_, index) => (
                      <CollageButton
                        onClick={() =>
                          handleOnClickEnableCollage(
                            CanvasUserLayerFrameType.W3H4,
                            index
                          )
                        }
                        selected={
                          !!(
                            selectedUserLayerFrame &&
                            selectedUserLayerFrame.frame ===
                              CanvasUserLayerFrameType.W3H4 &&
                            selectedUserLayerFrame.index === index
                          )
                        }
                        key={index}
                      >
                        <object
                          type="image/svg+xml"
                          data={`/images/collages/3-4-${index}.svg`}
                        />
                      </CollageButton>
                    ))}
                    {canvasUserLayerFrame[
                      CanvasUserLayerFrameType.W4H3
                    ].frames.map((_, index) => (
                      <CollageButton
                        onClick={() =>
                          handleOnClickEnableCollage(
                            CanvasUserLayerFrameType.W4H3,
                            index
                          )
                        }
                        selected={
                          !!(
                            selectedUserLayerFrame &&
                            selectedUserLayerFrame.frame ===
                              CanvasUserLayerFrameType.W4H3 &&
                            selectedUserLayerFrame.index === index
                          )
                        }
                        key={index}
                      >
                        <object
                          type="image/svg+xml"
                          data={`/images/collages/4-3-${index}.svg`}
                        />
                      </CollageButton>
                    ))}
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
          scenarios={[
            {
              characterImageUrl: "https://static.calmery.moe/s/2/5.png",
              emphasisElementId: "tutorial-collage-canvas-frames",
              message:
                "ここに色んなフレームが用意されているよ！タップして選んでみよう！",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/1/10.png",
              emphasisElementId: "tutorial-collage-canvas-frames",
              message: "あれっ...もしかして...",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/2/18.png",
              emphasisElementId: "tutorial-collage-canvas-frames",
              message: "使いたいフレームがない...！？",
            },
            {
              characterImageUrl: "https://static.calmery.moe/s/1/7.png",
              emphasisElementId: "tutorial-control-bar-beta",
              message:
                "ここからこんなフレームが欲しい！ってリクエストを送ってみて！",
            },
          ]}
          onComplete={() => setTutorial(false)}
        />
      )}
    </>
  );
};

export default withRedux(Collages);

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { State } from "~/domains";
import { Spacing } from "~/styles/spacing";
import { actions } from "~/domains/canvas/actions";
import {
  canvasUserLayerFrame,
  CanvasUserLayerFrame,
} from "~/domains/canvas/frames";
import { GradientColors } from "~/styles/colors";

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

export const CanvasFrames: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedUserLayerFrame } = useSelector(({ ui }: State) => ui);
  const handleOnClickEnableCollage = (
    frame: CanvasUserLayerFrame,
    index: number
  ) => dispatch(actions.enableCollage(frame, index));
  const handleOnClickDisableCollage = () => dispatch(actions.disableCollage());

  return (
    <Container>
      <Horizontal>
        <HorizontalInner>
          <CollageButton
            selected={!selectedUserLayerFrame}
            onClick={handleOnClickDisableCollage}
          >
            <object type="image/svg+xml" data={`/images/collage/disable.svg`} />
          </CollageButton>
          {canvasUserLayerFrame[CanvasUserLayerFrame.W3H4].frames.map(
            (_, index) => (
              <CollageButton
                onClick={() =>
                  handleOnClickEnableCollage(CanvasUserLayerFrame.W3H4, index)
                }
                selected={
                  !!(
                    selectedUserLayerFrame &&
                    selectedUserLayerFrame.frame ===
                      CanvasUserLayerFrame.W3H4 &&
                    selectedUserLayerFrame.index === index
                  )
                }
                key={index}
              >
                <object
                  type="image/svg+xml"
                  data={`/images/collage/3-4-${index}.svg`}
                />
              </CollageButton>
            )
          )}
          {canvasUserLayerFrame[CanvasUserLayerFrame.W4H3].frames.map(
            (_, index) => (
              <CollageButton
                onClick={() =>
                  handleOnClickEnableCollage(CanvasUserLayerFrame.W4H3, index)
                }
                selected={
                  !!(
                    selectedUserLayerFrame &&
                    selectedUserLayerFrame.frame ===
                      CanvasUserLayerFrame.W4H3 &&
                    selectedUserLayerFrame.index === index
                  )
                }
                key={index}
              >
                <object
                  type="image/svg+xml"
                  data={`/images/collage/4-3-${index}.svg`}
                />
              </CollageButton>
            )
          )}
        </HorizontalInner>
      </Horizontal>
    </Container>
  );
};

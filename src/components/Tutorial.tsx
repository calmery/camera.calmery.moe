import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import ResizeObserver from "resize-observer-polyfill";
import { GradientColors } from "~/styles/colors";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";

const Container = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
`;

const CloseButton = styled.img`
  top: 24px;
  right: 24px;
  position: fixed;
  filter: brightness(0) invert(1);
`;

const CharacterContainer = styled.div`
  ${Typography.S};
  width: 100%;
  height: 138px;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  justify-content: center;
`;

const Character = styled.div`
  width: 100%;
  max-width: 500px;
  padding-left: 16px;
  display: flex;
`;

const CharacterImage = styled.img`
  width: 160px;
  height: 138px;
  flex-shrink: 0;
`;

const CharacterMessage = styled.div`
  background: ${GradientColors.page};
  padding: ${Spacing.l}px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 16px 0;
`;

interface TutorialProps {
  onEnd: () => void;
  scenarios: {
    characterImageUrl: string;
    focusElementId: string;
    message: string;
  }[];
}

export const Tutorial: React.FC<TutorialProps> = ({ onEnd, scenarios }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState({ width: 0, height: 0 });
  const [focusElementRect, setFocusElementRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const updateFocusElementRect = useCallback(() => {
    const { focusElementId } = scenarios[currentScenario];
    console.log(`#${focusElementId}`);
    const e = document.getElementById(focusElementId);
    setFocusElementRect(e!.getBoundingClientRect());
  }, [currentScenario]);

  const nextScenario = useCallback(() => {
    if (scenarios.length > currentScenario + 1) {
      setCurrentScenario(currentScenario + 1);
      return;
    }

    onEnd();
  }, [currentScenario, onEnd]);

  useEffect(() => {
    const e = containerRef.current!;
    const resizeObserver = new ResizeObserver(() => {
      setContainerRect(e.getBoundingClientRect());
      updateFocusElementRect();
    });

    resizeObserver.observe(e);
    setContainerRect(e.getBoundingClientRect());

    return () => {
      resizeObserver.unobserve(e);
    };
  }, [containerRef]);

  useEffect(updateFocusElementRect, [currentScenario]);

  const { width, height } = containerRect;
  const scenario = scenarios[currentScenario];

  return (
    <Container ref={containerRef} onClick={nextScenario}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="tutorial-focus">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={focusElementRect.x - 16}
              y={focusElementRect.y - 16}
              width={focusElementRect.width + 32}
              height={focusElementRect.height + 32}
              rx="4"
              fill="black"
            />
          </mask>
        </defs>

        <rect
          fill="#000"
          fillOpacity="0.48"
          width={width}
          height={height}
          mask="url(#tutorial-focus)"
        />
      </svg>
      <CloseButton src="/images/close.svg" onClick={onEnd} />
      <CharacterContainer
        style={(() => {
          if (
            containerRect.height -
              (focusElementRect.y + focusElementRect.height) >
            138 + 16 + 16
          ) {
            return {
              top: `${focusElementRect.y + focusElementRect.height + 16}px`,
            };
          }

          if (focusElementRect.y > 138 + 16 + 16) {
            return {
              top: `${focusElementRect.y - 16 - 16 - 138}px`,
            };
          }

          return {};
        })()}
      >
        <Character>
          <CharacterMessage>{scenario.message}</CharacterMessage>
          <CharacterImage src={scenario.characterImageUrl} />
        </Character>
      </CharacterContainer>
    </Container>
  );
};

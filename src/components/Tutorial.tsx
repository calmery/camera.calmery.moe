import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import ResizeObserver from "resize-observer-polyfill";
import { GradientColors, Colors } from "~/styles/colors";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";
import { Mixin } from "~/styles/mixin";

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
  left: 24px;
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
  display: flex;
  position: relative;
  margin: 0 16px;
`;

const CharacterImage = styled.img`
  width: 160px;
  height: 138px;
  flex-shrink: 0;
  position: absolute;
`;

const CharacterMessage = styled.div`
  background: ${GradientColors.page};
  font-family: SmartFontUI, sans-serif;
  width: 100%;
  height: 80px;
  border-radius: 4px;
  flex: 1;
  bottom: 0;
  box-sizing: border-box;
  padding: 16px;
  padding-left: 160px;
  padding-right: 48px;
  position: absolute;
  white-space: pre-line;
`;

const CharacterPetal = styled.img`
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  width: 16px;
  height: 16px;
  bottom: 16px;
  right: 16px;
  position: absolute;
  animation: rotate 4s linear infinite;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 48px;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
`;

const ProgressImage = styled.div<{ parcent: number }>`
  ${Mixin.animation};

  width: ${({ parcent }) => `${parcent}%`};
  height: 100%;
  text-align: right;
  bottom: 0;
  left: 0;
  position: absolute;

  img {
    height: 100%;
  }
`;

const Progress = styled.div<{ parcent: number }>`
  ${Mixin.animation};

  width: ${({ parcent }) => `${parcent}%`};
  height: 4px;
  background: ${Colors.white};
  border-radius: ${({ parcent }) => (parcent === 100 ? "0" : "0 4px 4px 0")};
  bottom: 0;
  left: 0;
  position: absolute;
`;

interface TutorialProps {
  onEnd: () => void;
  skip?: boolean;
  scenarios: {
    characterImageUrl: string;
    focusElementId: string | null;
    message: string;
  }[];
}

export const Tutorial: React.FC<TutorialProps> = ({
  onEnd,
  scenarios,
  skip = true,
}) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState({ width: 0, height: 0 });
  const [focusElementRect, setFocusElementRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [count, setCount] = useState(1);

  const { width, height } = containerRect;
  const scenario = scenarios[currentScenario];

  const updateTextCount = () => {
    if (count >= scenario.message.length) {
      return;
    }

    setCount(count + 1);
  };

  const resetTextCount = () => {
    setCount(1);
  };

  useEffect(() => {
    // First
    if (timer) {
      clearTimeout(timer);
    }

    const t = setTimeout(() => {
      updateTextCount();
    }, 75);

    setTimer(t);
  }, [count]);

  const updateFocusElementRect = useCallback(() => {
    const { focusElementId } = scenarios[currentScenario];

    if (focusElementId) {
      const e = document.getElementById(focusElementId);
      setFocusElementRect(e!.getBoundingClientRect());
    } else {
      setFocusElementRect({ x: 0, y: 0, width: 0, height: 0 });
    }
  }, [currentScenario]);

  const nextScenario = () => {
    if (count < scenario.message.length) {
      setCount(scenarios[currentScenario].message.length);
      return;
    }

    if (scenarios.length > currentScenario + 1) {
      setCurrentScenario(currentScenario + 1);
      return;
    }

    onEnd();
  };

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

  useEffect(() => {
    resetTextCount();
  }, [scenario.message]);

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
            {scenario.focusElementId && (
              <rect
                x={focusElementRect.x - 16}
                y={focusElementRect.y - 16}
                width={focusElementRect.width + 32}
                height={focusElementRect.height + 32}
                rx="4"
                fill="black"
              />
            )}
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
      {skip && <CloseButton src="/images/close.svg" onClick={onEnd} />}
      <CharacterContainer
        className="animate__bounceIn"
        key={`${containerRect.width}-${containerRect.height}-${focusElementRect.x}-${focusElementRect.y}`}
        style={(() => {
          if (!scenario.focusElementId) {
            return {
              top: `${containerRect.height / 2 - 138 / 2}px`,
            };
          }

          if (
            containerRect.height -
              (focusElementRect.y + focusElementRect.height + 16) >
            138 + 16 + 16
          ) {
            return {
              top: `${
                focusElementRect.y + focusElementRect.height + 16 + 16
              }px`,
            };
          }

          if (focusElementRect.y > 138 + 16 + 16) {
            return {
              top: `${focusElementRect.y - 16 - 16 - 138}px`,
            };
          }

          return {
            bottom: `${48 + 16}px`,
          };
        })()}
      >
        <Character>
          <CharacterMessage>
            {scenario.message.slice(0, count)}
          </CharacterMessage>
          <CharacterImage src={scenario.characterImageUrl} />
          <CharacterPetal src="/images/petal.svg" />
        </Character>
      </CharacterContainer>
      <ProgressBar>
        <Progress
          parcent={((currentScenario + 1) / scenarios.length) * 100}
        ></Progress>
        <ProgressImage
          parcent={((currentScenario + 1) / scenarios.length) * 100}
        >
          <img src="/images/tutorial/run.gif" />
        </ProgressImage>
      </ProgressBar>
    </Container>
  );
};

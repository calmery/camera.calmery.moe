import React, { useCallback, useEffect, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import styled from "styled-components";
import { Colors, GradientColors } from "~/styles/colors";
import { Mixin } from "~/styles/mixin";
import { Spacing } from "~/styles/spacing";
import { Typography, TypographyLineHeight } from "~/styles/typography";

// Constants

const EMPHASIS_ELEMENT_MARGIN = Spacing.m;
const SPEECH_BUBBLE_HEIGHT = 128;
const SPEECH_BUBBLE_MARGIN = Spacing.l;
const SPEECH_BUBBLE_HEIGHT_WITH_MARGIN =
  SPEECH_BUBBLE_HEIGHT + SPEECH_BUBBLE_MARGIN * 2;
const SPEECH_BUBBLE_MAX_WIDTH = 480;
const PROGRESS_BAR_HEIGHT = 48;

// Styles

const Container = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 2147483647;
  user-select: none;
`;

const CloseButton = styled.img`
  width: 16px;
  height: 16px;
  top: ${Spacing.l}px;
  left: ${Spacing.l}px;
  filter: brightness(0) invert(1);
  position: absolute;
  cursor: pointer;
`;

const SpeechBubbleContainer = styled.div`
  width: calc(100% - ${Spacing.l * 2}px);
  margin: 0 ${Spacing.l}px;
  height: ${SPEECH_BUBBLE_HEIGHT}px;
  display: flex;
  justify-content: center;
  position: absolute;
`;

const SpeechBubble = styled.div`
  width: 100%;
  max-width: ${SPEECH_BUBBLE_MAX_WIDTH}px;
  height: ${Spacing.m * 2 + TypographyLineHeight.S * 3}px;
  background: ${GradientColors.page};
  border-radius: 4px;
  display: flex;
  bottom: 0;
  position: absolute;
  cursor: pointer;
`;

const SpeechBubbleCharacterImage = styled.img`
  width: auto;
  height: ${SPEECH_BUBBLE_HEIGHT}px;
  margin-top: -${SPEECH_BUBBLE_HEIGHT - Spacing.m * 2 - TypographyLineHeight.S * 3}px;
  margin-right: ${Spacing.s}px;
`;

const SpeechBubbleNoCharacterImage = styled.div`
  width: ${Spacing.m}px;
`;

const SpeechBubbleMessage = styled.div`
  ${Typography.S};

  color: ${Colors.black};
  font-family: "Sawarabi Gothic", sans-serif;
  flex-grow: 1;
  padding: ${Spacing.m}px 0;
  bottom: 0;
`;

const SpeechBubblePetalImage = styled.img`
  @keyframes petal {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  width: 16px;
  height: 16px;
  margin: ${Spacing.m}px;
  margin-top: auto;
  margin-left: ${Spacing.s}px;
  animation: petal 4s linear infinite;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: ${PROGRESS_BAR_HEIGHT}px;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
`;

const ProgressBar = styled.div<{ scenarioProgress: number }>`
  ${Mixin.animation};

  width: ${({ scenarioProgress }) => `${scenarioProgress}%`};
  height: 4px;
  background: ${Colors.white};
  border-radius: ${({ scenarioProgress }) =>
    scenarioProgress === 100 ? "0" : "0 4px 4px 0"};
  bottom: 0;
  left: 0;
  position: absolute;
`;

const ProgressBarImage = styled.div<{ scenarioProgress: number }>`
  ${Mixin.animation};

  width: ${({ scenarioProgress }) => `${scenarioProgress}%`};
  height: 100%;
  text-align: right;
  bottom: 0;
  left: 0;
  position: absolute;

  img {
    height: 100%;
  }
`;

// Types

interface TutorialProps {
  scenarios: {
    characterImageUrl?: string;
    emphasisElementId?: string;
    message: string;
  }[];
  onComplete: () => void;
}

// Components

export const Tutorial: React.FC<TutorialProps> = ({
  scenarios,
  onComplete,
}) => {
  const displayableRef = useRef<HTMLDivElement>(null);

  const [displayableRect, setDisplayableRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [
    emphasisElementRect,
    setEmphasisElementRect,
  ] = useState<DOMRect | null>(null);
  const [speechBubbleY, setSpeechBubbleY] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioProgress, setScenarioProgress] = useState(
    (1 / scenarios.length) * 100
  );
  const [characterCount, setCharacterCount] = useState(0);
  const [characterTimer, setCharacterTimer] = useState<number | null>(null);
  const [progressBarImage, setProgressBarImage] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const scenario = scenarios[scenarioIndex]!;

  // Hooks

  useEffect(() => {
    let speechBubbleY = (displayableRect.height - SPEECH_BUBBLE_HEIGHT) / 2;

    if (!scenario.emphasisElementId) {
      setEmphasisElementRect(null);
      setSpeechBubbleY(speechBubbleY);
      return;
    }

    const e = document.getElementById(scenario.emphasisElementId);

    if (!e) {
      setEmphasisElementRect(null);
      setSpeechBubbleY(speechBubbleY);
      return;
    }

    const emphasisElementRect = e.getBoundingClientRect();
    emphasisElementRect.x -= EMPHASIS_ELEMENT_MARGIN;
    emphasisElementRect.y -= EMPHASIS_ELEMENT_MARGIN;
    emphasisElementRect.width += EMPHASIS_ELEMENT_MARGIN * 2;
    emphasisElementRect.height += EMPHASIS_ELEMENT_MARGIN * 2;

    if (emphasisElementRect.y > SPEECH_BUBBLE_HEIGHT_WITH_MARGIN) {
      speechBubbleY =
        emphasisElementRect.y - (SPEECH_BUBBLE_HEIGHT + SPEECH_BUBBLE_MARGIN);
    } else if (
      displayableRect.height -
        (emphasisElementRect.y + emphasisElementRect.height) -
        PROGRESS_BAR_HEIGHT >
      SPEECH_BUBBLE_HEIGHT_WITH_MARGIN
    ) {
      speechBubbleY =
        emphasisElementRect.y +
        emphasisElementRect.height +
        SPEECH_BUBBLE_MARGIN;
    } else {
      speechBubbleY =
        displayableRect.height -
        PROGRESS_BAR_HEIGHT -
        (SPEECH_BUBBLE_HEIGHT + SPEECH_BUBBLE_MARGIN);
    }

    setEmphasisElementRect(emphasisElementRect);
    setSpeechBubbleY(speechBubbleY);
  }, [displayableRect, scenario]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const e = displayableRef.current!;
    const resizeObserver = new ResizeObserver(() => {
      setDisplayableRect(e.getBoundingClientRect());
    });

    setDisplayableRect(e.getBoundingClientRect());
    resizeObserver.observe(e);

    return () => {
      resizeObserver.unobserve(e);
    };
  }, [displayableRef]);

  useEffect(() => {
    if (characterCount >= scenario.message.length) {
      return;
    }

    setCharacterTimer(
      setTimeout(() => {
        setCharacterCount(characterCount + 1);
      }, 80)
    );
  }, [characterCount, scenario]);

  useEffect(() => {
    setTimeout(() => {
      setProgressBarImage(progressBarImage ? 0 : 1);
    }, 800);
  }, [progressBarImage]);

  // Events

  const handleOnClickSpeechBubble = useCallback(() => {
    if (characterCount >= scenario.message.length) {
      const nextScenarioIndex = scenarioIndex + 1;

      if (!scenarios[nextScenarioIndex]) {
        onComplete();
      } else {
        setScenarioProgress(((nextScenarioIndex + 1) / scenarios.length) * 100);
        setScenarioIndex(nextScenarioIndex);
        setCharacterCount(0);
      }

      return;
    }

    if (characterTimer) {
      clearTimeout(characterTimer);
    }

    setCharacterCount(scenario.message.length);
  }, [
    scenarioIndex,
    characterCount,
    scenarios.length,
    scenario.message,
    characterTimer,
  ]);

  // Render

  return (
    <Container ref={displayableRef} onClick={handleOnClickSpeechBubble}>
      <CloseButton src="/images/close.svg" onClick={onComplete} alt="閉じる" />
      <svg
        width={displayableRect.width}
        height={displayableRect.height}
        viewBox={`0 0 ${displayableRect.width} ${displayableRect.height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="tutorial-emphasis">
            <rect width="100%" height="100%" fill="#FFF" />
            {emphasisElementRect && (
              <rect
                x={emphasisElementRect.x}
                y={emphasisElementRect.y}
                width={emphasisElementRect.width}
                height={emphasisElementRect.height}
                rx="4"
                fill="#000"
              />
            )}
          </mask>
        </defs>
        <rect
          fill="#000"
          fillOpacity="0.48"
          width="100%"
          height="100%"
          mask="url(#tutorial-emphasis)"
        />
      </svg>
      <SpeechBubbleContainer
        style={{
          top: `${speechBubbleY}px`,
        }}
      >
        <SpeechBubble
          className="animate__bounceIn"
          key={scenario.emphasisElementId}
        >
          {scenario.characterImageUrl ? (
            <SpeechBubbleCharacterImage
              src={scenario.characterImageUrl}
              alt="キャラクター"
            />
          ) : (
            <SpeechBubbleNoCharacterImage />
          )}
          <SpeechBubbleMessage>
            {scenario.message.slice(0, characterCount)}
          </SpeechBubbleMessage>
          <SpeechBubblePetalImage src="/images/petal.svg" alt="花弁" />
        </SpeechBubble>
      </SpeechBubbleContainer>
      <ProgressBarContainer>
        <ProgressBar scenarioProgress={scenarioProgress} />
        <ProgressBarImage scenarioProgress={scenarioProgress}>
          <img src={`/images/tutorial/${progressBarImage}.png`} alt="走る" />
        </ProgressBarImage>
      </ProgressBarContainer>
    </Container>
  );
};

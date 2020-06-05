import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { UAParser } from "ua-parser-js";
import { Colors, GradientColors } from "~/styles/colors";
import { Spacing } from "~/styles/spacing";
import { Typography, TypographyLineHeight } from "~/styles/typography";

const SPEECH_BUBBLE_HEIGHT = 128;
const SPEECH_BUBBLE_MARGIN = Spacing.l;
const SPEECH_BUBBLE_HEIGHT_WITH_MARGIN =
  SPEECH_BUBBLE_HEIGHT + SPEECH_BUBBLE_MARGIN * 2;
const SPEECH_BUBBLE_MAX_WIDTH = 480;

const usParser = new UAParser();
const isMobile = usParser.getDevice().type === "mobile";

const Container = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${Colors.white};
  display: flex;
  align-items: center;
`;

const SpeechBubbleContainer = styled.div`
  width: 100%;
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

export const DeviceOrientation: React.FC = () => {
  if (!isMobile) {
    return null;
  }

  const [isPortrait, setPortrait] = useState(true);

  const updateOrientation = () => {
    if (
      (screen.orientation && screen.orientation.angle !== 0) ||
      (window.orientation && window.orientation.toString() !== "0")
    ) {
      setPortrait(false);
      return;
    }

    setPortrait(true);
  };

  useEffect(() => {
    addEventListener("orientationchange", updateOrientation, true);

    updateOrientation();

    return () => {
      removeEventListener("orientationchange", updateOrientation);
    };
  }, [updateOrientation]);

  if (isPortrait) {
    return null;
  }

  return (
    <Container>
      <SpeechBubbleContainer>
        <SpeechBubble className="animate__bounceIn">
          <SpeechBubbleCharacterImage
            src="https://static.calmery.moe/s/1/7.png"
            alt="キャラクター"
          />
          <SpeechBubbleMessage>
            ごめんなさい！横画面には対応してないみたい...画面を縦にして使ってね！
          </SpeechBubbleMessage>
          <SpeechBubblePetalImage
            src="/images/components/tutorial/petal.svg"
            alt="花弁"
          />
        </SpeechBubble>
      </SpeechBubbleContainer>
    </Container>
  );
};

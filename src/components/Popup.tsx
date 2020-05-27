import React, { useRef, useCallback } from "react";
import styled from "styled-components";
import { Colors } from "~/styles/colors";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";
import { Button } from "~/components/Button";
import { Mixin } from "~/styles/mixin";

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
  z-index: 10000;
`;

const Background = styled.div`
  ${Mixin.animation};
  width: 100%;
  height: 100%;
  background: ${Colors.blackTransparent};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
`;

const PopupContainer = styled.div`
  position: absolute;
`;

const PopupInner = styled.div`
  ${Mixin.animation};

  max-width: 360px;
  box-sizing: border-box;
  padding: ${Spacing.m}px;
  margin: ${Spacing.l}px;
  background: ${Colors.white};
  border-radius: 4px;
  text-align: center;
`;

const PopupInnerCharacter = styled.img`
  height: 160px;
  margin-top: -80px;
`;

const PopupInnerMessage = styled.div`
  ${Typography.M};

  font-family: SmartFontUI, sans-serif;
  color: ${Colors.black};
  padding: ${Spacing.m}px ${Spacing.s}px;
`;

const PopupInnerButtons = styled.div`
  display: flex;

  > * {
    margin-left: ${Spacing.m}px;
    font-family: SmartFontUI, sans-serif;

    &:first-child {
      margin-left: 0;
    }
  }
`;

interface PopupProps {
  onEnter: () => void;
  onCancel?: () => void;
  characterImageUrl: string;
  children: React.ReactNode;
  enterText?: string;
  cancalText?: string;
}

export const Popup: React.FC<PopupProps> = ({
  enterText,
  cancalText,
  characterImageUrl,
  children,
  onEnter,
  onCancel,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const handleOnClickCancel = useCallback(() => {
    const e = ref.current!;
    e.classList.add("animate__bounceOut");

    setTimeout(() => {
      const b = backgroundRef.current!;
      b.classList.add("animate__fadeOut");
    }, 200);

    setTimeout(() => {
      onCancel && onCancel();
    }, 800);
  }, [ref, onCancel]);

  const handleOnClickEnter = useCallback(() => {
    const e = ref.current!;
    e.classList.add("animate__bounceOut");
    const b = backgroundRef.current!;
    b.classList.add("animate__fadeOut");

    setTimeout(() => {
      onEnter();
    }, 800);
  }, [ref, onEnter]);

  return (
    <Container>
      <Background ref={backgroundRef} className="animate__fadeIn" />
      <PopupContainer>
        <PopupInner
          ref={ref}
          key={children?.toString()}
          className="animate__bounceIn"
        >
          <PopupInnerCharacter src={characterImageUrl} />
          <PopupInnerMessage>{children}</PopupInnerMessage>
          <PopupInnerButtons>
            {onCancel && (
              <Button round={false} onClickButton={handleOnClickCancel}>
                {cancalText || "キャンセル"}
              </Button>
            )}
            <Button round={false} primary onClickButton={handleOnClickEnter}>
              {enterText || "わかった"}
            </Button>
          </PopupInnerButtons>
        </PopupInner>
      </PopupContainer>
    </Container>
  );
};

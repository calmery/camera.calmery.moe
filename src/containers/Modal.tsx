import React, { useState, useRef, useLayoutEffect } from "react";
import styled, { css } from "styled-components";
import { Colors, GradientColors } from "~/styles/colors";
import { Constants } from "~/styles/constants";
import { Media } from "~/styles/media";
import { Spacing } from "~/styles/spacing";
import { Mixin } from "~/styles/mixin";

const FadeIn = css`
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
`;

const FadeInUp = css`
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
`;

const FadeOut = css`
  -webkit-animation-name: fadeOut;
  animation-name: fadeOut;
`;

const FadeOutDown = css`
  -webkit-animation-name: fadeOutDown;
  animation-name: fadeOutDown;
`;

const AnimationKeyframes = css`
  @-webkit-keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeInUp {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @-webkit-keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @-webkit-keyframes fadeOutDown {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }
  }

  @keyframes fadeOutDown {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }
  }
`;

const Container = styled.div<{
  visible: boolean;
  isAnimationCompleted: boolean;
}>`
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 2147483647;

  ${({ visible, isAnimationCompleted }) =>
    !visible &&
    isAnimationCompleted &&
    css`
      display: none !important;
    `}
`;

const Background = styled.div<{ visible: boolean }>`
  ${AnimationKeyframes}
  ${Mixin.animation}
  ${({ visible }) => (visible ? FadeIn : FadeOut)};

  width: 100%;
  height: 100%;
  background: ${Colors.blackTransparent};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
`;

const Body = styled.div<{ visible: boolean }>`
  ${AnimationKeyframes}
  ${Mixin.animation}
  ${({ visible }) => (visible ? FadeInUp : FadeOutDown)}

  background: ${Colors.white};
  box-shadow: ${Constants.boxShadow};
  box-sizing: border-box;
  position: fixed;
  overflow: scroll;

  ${Media.queries.pc} {
    padding: 0 ${Spacing.xl}px ${Spacing.m}px;
    width: 600px;
    height: 450px;
    top: 50%;
    left: 50%;
    margin: -225px 0 0 -300px;
  }

  ${Media.queries.sp} {
    padding: 0 ${Spacing.l}px ${Spacing.m}px;
    width: 100%;
    height: calc(100% - 80px);
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const CloseButton = styled.div`
  ${Mixin.clickable}

  width: 100%;
  padding: ${Spacing.m}px 0;
  text-align: center;
  cursor: pointer;

  img {
    vertical-align: bottom;
  }
`;

const Border = styled.div`
  width: 100%;
  height: 1px;
  background: ${GradientColors.pinkToBlue};
`;

const Contents = styled.div`
  width: 100%;
  height: max-content;

  ${Media.queries.pc} {
    margin-top: ${Spacing.m}px;
  }

  ${Media.queries.sp} {
    margin-top: ${Spacing.m}px;
  }
`;

type ModalProps = {
  children: React.ReactNode;
  onClickCloseButton: () => void;
  visible: boolean;
};

export const Modal: React.FC<ModalProps> = ({
  children,
  onClickCloseButton,
  visible,
}: ModalProps) => {
  const [isAnimationCompleted, setIsAnimationCompleted] = useState(true);

  useLayoutEffect(() => {
    setIsAnimationCompleted(false);

    const animationTimer = setTimeout(() => setIsAnimationCompleted(true), 400);
    return () => clearTimeout(animationTimer);
  }, [visible]);

  return (
    <Container visible={visible} isAnimationCompleted={isAnimationCompleted}>
      <Background onClick={onClickCloseButton} visible={visible} />
      <Body visible={visible}>
        <CloseButton onClick={onClickCloseButton}>
          <img src="/images/modal/close.svg" />
        </CloseButton>
        <Border />
        <Contents>{children}</Contents>
      </Body>
    </Container>
  );
};

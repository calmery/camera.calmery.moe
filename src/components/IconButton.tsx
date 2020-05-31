import React from "react";
import styled, { css } from "styled-components";
import { GradientColors, Colors } from "~/styles/colors";
import { Mixin } from "~/styles/mixin";

const Container = styled.div`
  ${Mixin.clickable};

  width: 32px;
  height: 32px;
  background: ${GradientColors.pinkToBlue};
  border-radius: 100%;
  position: relative;
  cursor: pointer;
`;

const Background = styled.div<{ clicked: boolean }>`
  width: 28px;
  height: 28px;
  background: ${({ clicked }) => (clicked ? "transparent" : Colors.white)};
  border-radius: 100%;
  font-size: 16px;
  text-align: center;
  line-height: 28px;
  top: 2px;
  left: 2px;
  position: absolute;
`;

const Icon = styled.div<{ clicked: boolean }>`
  width: 32px;
  height: 32px;
  color: ${Colors.white};
  display: flex;
  align-items: center;
  justify-content: center;

  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;

  img {
    filter: brightness(0) invert(1);
  }

  ${({ clicked }) =>
    !clicked &&
    css`
      background: ${GradientColors.pinkToBlue};
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;

      img {
        filter: none;
      }
    `};
`;

type IconButtonProps = {
  src: string;
  clicked?: boolean;
  onClick?: () => void;
};

export const IconButton: React.FC<IconButtonProps> = ({
  src,
  clicked = false,
  onClick,
}: IconButtonProps) => (
  <Container onClick={onClick}>
    <Background clicked={clicked} />
    <Icon clicked={clicked}>
      <img src={src} alt="アイコン" />
    </Icon>
  </Container>
);

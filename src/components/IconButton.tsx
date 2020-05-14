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

const Text = styled.div<{ clicked: boolean }>`
  width: 32px;
  height: 32px;
  color: ${Colors.white};
  line-height: 32px;
  text-align: center;

  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;

  ${({ clicked }) =>
    !clicked &&
    css`
      background: ${GradientColors.pinkToBlue};
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    `};
`;

type IconButtonProps = {
  children: React.ReactNode;
  clicked?: boolean;
  onClick: () => void;
};

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  clicked = false,
  onClick,
}: IconButtonProps) => {
  if (!children) {
    return null;
  }

  return (
    <Container onClick={onClick}>
      <Background clicked={clicked} />
      <Text clicked={clicked}>{children}</Text>
    </Container>
  );
};

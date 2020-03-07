import React from "react";
import styled, { css } from "styled-components";
import { Colors, GradientColors } from "~/styles/colors";
import { Mixin } from "~/styles/mixin";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";

const Container = styled.div`
  ${Mixin.clickable};
  ${Typography.M};

  background: ${GradientColors.pinkToBlue};
  border-radius: 50vh;
  padding: 2px;
  text-align: center;
  width: 100%;
`;

const Body = styled.div<Pick<ButtonProps, "primary">>`
  background: ${({ primary }) => (primary ? "transparent" : Colors.white)};
  border-radius: 50vh;
  padding: ${Spacing.m - 2}px ${Spacing.l - 2}px;
`;

const Text = styled.div<Pick<ButtonProps, "primary">>`
  color: ${Colors.white};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ primary }) =>
    !primary &&
    css`
      background: ${GradientColors.pinkToBlue};
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    `};
`;

type ButtonProps = {
  primary?: boolean;
};

export const Button: React.FC<ButtonProps> = props => (
  <Container>
    <Body {...props}>
      <Text {...props}>Hellkasdkasdlkjaso World</Text>
    </Body>
  </Container>
);

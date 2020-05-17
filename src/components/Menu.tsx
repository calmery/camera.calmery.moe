import React from "react";
import styled, { css } from "styled-components";
import { Colors, GradientColors } from "~/styles/colors";
import { Spacing } from "~/styles/spacing";

const Container = styled.div`
  box-sizing: border-box;
  background: ${Colors.white};
  border-top: 1px solid ${Colors.border};
  padding: ${Spacing.s}px 0;
  display: flex;
`;

const PrimaryButtons = styled.div`
  height: 48px;
  margin-left: ${Spacing.l}px;
  margin-right: auto;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const SecondaryButtons = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const Divider = styled.div`
  width: 2px;
  height: 48px;
  background: ${GradientColors.pinkToBlue};
  border-radius: 1px;
  margin-right: ${Spacing.l}px;
  flex-shrink: 0;
`;

const Icon = styled.object<{ selected?: boolean; disabled?: boolean }>`
  height: 32px;
  margin-right: ${Spacing.l}px;
  pointer-events: none;

  ${({ selected }) =>
    !selected &&
    css`
      // rgba(180, 180, 180, 1);
      filter: brightness(0) opacity(29.5%);
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.48;
    `};
`;

export const Menu = () => {
  return (
    <Container>
      <PrimaryButtons>
        <Icon type="image/svg+xml" data="/images/menu/stickers.svg" />
        <Icon disabled type="image/svg+xml" data="/images/menu/tune.svg" />
        <Icon selected type="image/svg+xml" data="/images/menu/crop.svg" />
        <Icon type="image/svg+xml" data="/images/menu/collage.svg" />
      </PrimaryButtons>

      <Divider />
      <SecondaryButtons>
        <Icon type="image/svg+xml" data="/images/menu/save.svg" />
      </SecondaryButtons>
    </Container>
  );
};

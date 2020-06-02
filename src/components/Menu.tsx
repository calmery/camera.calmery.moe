import React from "react";
import { useRouter } from "next/router";
import styled, { css } from "styled-components";
import { Colors, GradientColors } from "~/styles/colors";
import { Constants } from "~/styles/constants";
import { Spacing } from "~/styles/spacing";

// Styles

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

const IconContainer = styled.div<{ disabled?: boolean }>`
  height: 32px;
  margin-right: ${Spacing.l}px;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
    `}
`;

const Icon = styled.object<{ selected?: boolean; disabled?: boolean }>`
  height: 32px;
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
      opacity: ${Constants.opacity};
    `};
`;

// Components

export const Menu = () => {
  const { pathname, push } = useRouter();

  return (
    <Container id="tutorial-menu">
      <PrimaryButtons>
        <IconContainer onClick={() => push("/stickers")}>
          <Icon
            selected={pathname === "/stickers"}
            type="image/svg+xml"
            data="/images/components/menu/stickers.svg"
          />
        </IconContainer>
        <IconContainer onClick={() => push("/filters")}>
          <Icon
            selected={pathname === "/filters"}
            type="image/svg+xml"
            data="/images/components/menu/filters.svg"
          />
        </IconContainer>
        <IconContainer onClick={() => push("/crop")}>
          <Icon
            selected={pathname === "/crop"}
            type="image/svg+xml"
            data="/images/components/menu/crop.svg"
          />
        </IconContainer>
        <IconContainer onClick={() => push("/frames")}>
          <Icon
            selected={pathname === "/frames"}
            type="image/svg+xml"
            data="/images/components/menu/frames.svg"
          />
        </IconContainer>
      </PrimaryButtons>
      <Divider />
      <SecondaryButtons>
        <IconContainer onClick={() => push("/save")}>
          <Icon
            selected={pathname === "/save"}
            type="image/svg+xml"
            data="/images/components/menu/save.svg"
          />
        </IconContainer>
      </SecondaryButtons>
    </Container>
  );
};

import React, { useCallback } from "react";
import { useRouter } from "next/router";
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

const IconContainer = styled.div`
  height: 32px;
  margin-right: ${Spacing.l}px;
  cursor: pointer;
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
      opacity: 0.48;
    `};
`;

export const Menu = () => {
  const { pathname, push } = useRouter();
  const handleOnClickRouterPush = useCallback(
    (pathname: string) => push(pathname),
    []
  );

  return (
    <Container>
      <PrimaryButtons>
        <IconContainer onClick={() => handleOnClickRouterPush("/edit")}>
          <Icon
            selected={pathname === "/edit"}
            type="image/svg+xml"
            data="/images/menu/stickers.svg"
          />
        </IconContainer>
        <IconContainer onClick={() => handleOnClickRouterPush("/tune")}>
          <Icon
            selected={pathname === "/tune"}
            type="image/svg+xml"
            data="/images/menu/tune.svg"
          />
        </IconContainer>
        <IconContainer onClick={() => handleOnClickRouterPush("/crop")}>
          <Icon
            selected={pathname === "/crop"}
            type="image/svg+xml"
            data="/images/menu/crop.svg"
          />
        </IconContainer>
        <IconContainer onClick={() => handleOnClickRouterPush("/collage")}>
          <Icon
            selected={pathname === "/collage"}
            type="image/svg+xml"
            data="/images/menu/collage.svg"
          />
        </IconContainer>
      </PrimaryButtons>

      <Divider />
      <SecondaryButtons>
        <IconContainer onClick={() => handleOnClickRouterPush("/save")}>
          <Icon type="image/svg+xml" data="/images/menu/save.svg" />
        </IconContainer>
      </SecondaryButtons>
    </Container>
  );
};

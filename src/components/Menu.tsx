import React from "react";
import styled from "styled-components";
import { Colors, GradientColors } from "~/styles/colors";
import { Spacing } from "~/styles/spacing";

const Container = styled.div`
  width: 100%;
  background: ${Colors.white};
  border-top: 1px solid ${Colors.border};
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  padding: ${Spacing.s}px ${Spacing.l}px;
  box-sizing: border-box;
  display: flex;
`;

const Group = styled.div`
  margin: ${Spacing.s}px 0;
  display: flex;

  &:first-child {
    margin-right: auto;
  }
`;

const Border = styled.div`
  width: 2px;
  background: ${GradientColors.pinkToBlue};
  border-radius: 50vw;
  margin: 0 ${Spacing.l}px;
`;

const Item = styled.img`
  margin-left: ${Spacing.l}px;

  &:first-child {
    margin-left: 0;
  }
`;

export const Menu = () => {
  return (
    <Container>
      <Group>
        <Item src="/images/menu/tune.svg" />
        <Item src="/images/menu/tune.svg" />
        <Item src="/images/menu/tune.svg" />
        <Item src="/images/menu/tune.svg" />
      </Group>
      <Border />
      <Group>
        <Item src="/images/menu/tune.svg" />
      </Group>
    </Container>
  );
};

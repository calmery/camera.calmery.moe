import React from "react";
import styled from "styled-components";
import { Spacing } from "~/styles/spacing";

const Container = styled.div`
  height: 16px;
  padding: ${Spacing.l}px;
  flex-shrink: 0;

  img {
    width: 16px;
    height: 16px;
  }
`;

export const ControlBar = () => (
  <Container>
    <img src="/images/close.svg" />
  </Container>
);

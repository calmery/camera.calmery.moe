import React from "react";
import styled from "styled-components";
import { Spacing } from "~/styles/spacing";

const Container = styled.div`
  height: 16px;
  padding: ${Spacing.l}px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;

  img {
    width: 16px;
    height: 16px;
  }
`;

export const ControlBar: React.FC<{
  onClickHelpButton?: () => void;
}> = ({ onClickHelpButton }) => (
  <Container>
    <img src="/images/close.svg" />
    <img src="/images/help.svg" onClick={onClickHelpButton} />
  </Container>
);

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
    height: 16px;
  }
`;

export const ControlBar: React.FC<{
  onClickHelpButton?: () => void;
}> = ({ onClickHelpButton }) => (
  <Container>
    <img src="/images/close.svg" />
    <img id="tutorial-control-bar-beta" src="/images/beta.svg" />
    <img
      id="tutorial-control-bar-usage"
      src="/images/help.svg"
      onClick={onClickHelpButton}
    />
  </Container>
);

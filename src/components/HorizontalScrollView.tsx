import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  overflow-y: visible;
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Horizontal = styled.div`
  width: fit-content;
  display: flex;
`;

export const HorizontalScrollView: React.FC<{
  id?: string;
  rootElement?: (instance: HTMLDivElement | null) => void;
}> = ({ id, children, rootElement }) => (
  <Container id={id} ref={rootElement}>
    <Horizontal>{children}</Horizontal>
  </Container>
);

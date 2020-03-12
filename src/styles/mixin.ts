import { css } from "styled-components";

const animation = css`
  transition: ease 0.4s;
  animation-fill-mode: forwards;
  animation-duration: 0.4s;
`;

const clickable = css`
  cursor: pointer;
  transition: 0.4s ease;

  &:hover {
    transform: scale(1.06);
  }
`;

export const Mixin = { animation, clickable };

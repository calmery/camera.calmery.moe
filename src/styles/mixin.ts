import { css } from "styled-components";

const clickable = css`
  cursor: pointer;
  transition: 0.4s ease;

  &:hover {
    transform: scale(1.06);
  }
`;

export const Mixin = { clickable };

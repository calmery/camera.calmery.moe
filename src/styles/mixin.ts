import { css } from "styled-components";

const ANIMATION_DURATION = {
  seconds: 0.4,
  milliseconds: 400
};

const animation = css`
  transition: ease ${ANIMATION_DURATION.seconds}s;
  animation-fill-mode: forwards;
  animation-duration: ${ANIMATION_DURATION.seconds}s;
`;

const clickable = css`
  cursor: pointer;
  transition: ${ANIMATION_DURATION.seconds}s ease;

  &:hover {
    transform: scale(1.06);
  }
`;

export const Mixin = { ANIMATION_DURATION, animation, clickable };

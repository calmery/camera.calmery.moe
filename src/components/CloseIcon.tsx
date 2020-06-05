import React from "react";
import styled from "styled-components";

const Svg = styled.svg`
  cursor: pointer;
`;

interface CloseIconProps {
  x: number;
  y: number;
  r: number;
}

export const CloseIcon: React.FC<CloseIconProps> = ({ x, y, r }) => (
  <Svg
    width={r}
    height={r}
    x={x}
    y={y}
    fill="none"
    viewBox="0 0 17 17"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="m16.0756 1.19634c-.7471-.747057-1.9583-.747055-2.7054 0l-4.73437 4.73441-4.73424-4.73424c-.74705-.747048-1.95826-.747048-2.70531 0-.747058.74706-.747056 1.95827 0 2.70532l4.73423 4.73424-4.73419 4.73423c-.747053.747-.747053 1.9582 0 2.7053.74705.747 1.95827.747 2.70532 0l4.73419-4.7342 4.73437 4.7344c.7471.747 1.9583.747 2.7053 0 .7471-.7471.7471-1.9583 0-2.7054l-4.7344-4.73433 4.7345-4.73442c.747-.74705.747-1.95826 0-2.70531z"
      fill="#b4b4b4"
      fillRule="evenodd"
    />
  </Svg>
);

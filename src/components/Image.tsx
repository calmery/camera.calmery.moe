import React from "react";
import styled from "styled-components";

const Img = styled.img`
  vertical-align: middle;
`;

type ImageProps = {
  src: string;
  webp?: boolean;
};

export const Image: React.FC<ImageProps> = ({
  src,
  webp = false
}: ImageProps) => (
  <picture>
    {webp && <source srcSet={`${src}.webp`} type="image/webp" />}
    <Img src={src} />
  </picture>
);

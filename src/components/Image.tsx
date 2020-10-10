import React from "react";
import styled from "styled-components";

const Img = styled.img`
  vertical-align: middle;
`;

type ImageProps = {
  alt?: string;
  src: string;
  style?: React.CSSProperties;
  webp?: boolean;
};

export const Image: React.FC<ImageProps> = ({
  alt,
  src,
  style,
  webp = false,
}: ImageProps) => (
  <picture>
    {webp && <source srcSet={`${src}.webp`} type="image/webp" />}
    <Img src={src} style={style} alt={alt} />
  </picture>
);

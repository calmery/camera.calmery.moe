import React from "react";

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
    <img src={src} />
  </picture>
);

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Image } from "~/components/Image";
import { Colors } from "~/styles/colors";

const Container = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${Colors.blackTransparent};

  img {
    height: 128px;
  }
`;

export const Loading: React.FC = () => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setImageIndex(imageIndex ? 0 : 1);
    }, 800);
  }, [imageIndex]);

  return (
    <Container>
      <Image webp src={`/images/loading/${imageIndex}.png`} alt="読み込み中" />
    </Container>
  );
};

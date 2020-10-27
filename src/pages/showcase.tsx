import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Masonry from "react-masonry-component";
import InfiniteScroll from "react-infinite-scroller";
import { Spacing } from "~/styles/spacing";
import { Mixin } from "~/styles/mixin";
import { Image } from "~/components/Image";
import { Button } from "~/components/Button";
import { useRouter } from "next/router";

const Container = styled.div`
  margin: ${Spacing.m}px;
`;

const ShowcaseImage = styled.div`
  ${Mixin.clickable};
  ${Mixin.animation};

  width: 152px;
  margin: ${Spacing.s}px;
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;

  img {
    width: 100%;
    border-radius: 4px;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${Spacing.m}px;

  img {
    height: 96px;
  }
`;

const Loading = styled.div`
  height: 128px;
  text-align: center;
  margin: ${Spacing.s}px 0;

  img {
    height: 128px;
  }
`;

const ButtonContainer = styled.div`
  margin: 0 auto;
  margin-bottom: ${Spacing.m}px;
  max-width: 360px;
  width: 100%;

  & > * {
    font-family: "Sawarabi Gothic";
  }
`;

const Showcase = () => {
  const { push } = useRouter();
  const [fetchMore, setFetchMore] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setImageIndex(imageIndex ? 0 : 1);
    }, 800);
  }, [imageIndex]);

  const handleOnClickStartButton = useCallback(() => {
    push("/");
  }, []);

  const handleOnChangePage = useCallback(
    async (page: number) => {
      const { data } = await fetch(
        process.env.NODE_ENV === "production"
          ? `https://api.calmery.moe/camera/showcase/${page}`
          : `http://localhost:5000/camera/showcase/${page}`
      ).then((response) => response.json());

      if (data.length < 10) {
        setFetchMore(false);
      }

      setImages([...images, ...data]);
    },
    [images]
  );

  return (
    <Container>
      <Logo>
        <Image src="/images/pages/camera.calmery.moe.svg" alt="ロゴ" />
      </Logo>
      <InfiniteScroll
        pageStart={0}
        loadMore={handleOnChangePage}
        hasMore={fetchMore}
        loader={
          <Loading>
            <Image
              webp
              src={`/images/components/loading/${imageIndex}.png`}
              alt="読み込み中"
            />
          </Loading>
        }
      >
        <Masonry options={{ transitionDuration: 0 }}>
          {images.map((image, index) => {
            return (
              <ShowcaseImage key={index}>
                <img alt="画像" src={image} />
              </ShowcaseImage>
            );
          })}
        </Masonry>
      </InfiniteScroll>
      <ButtonContainer>
        <Button primary onClickButton={handleOnClickStartButton}>
          かるめりちゃんカメラを試してみる！
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default Showcase;

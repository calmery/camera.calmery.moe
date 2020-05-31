import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Typography } from "~/styles/typography";
import { Spacing } from "~/styles/spacing";
import { thunkActions } from "~/domains/canvas/actions";

const CANVAS_STICKERS = [
  {
    name: "かるめりちゃんスタンプ",
    urls: [
      "https://static.calmery.moe/s/1/1.png",
      "https://static.calmery.moe/s/1/2.png",
      "https://static.calmery.moe/s/1/3.png",
      "https://static.calmery.moe/s/1/4.png",
      "https://static.calmery.moe/s/1/5.png",
      "https://static.calmery.moe/s/1/6.png",
      "https://static.calmery.moe/s/1/7.png",
      "https://static.calmery.moe/s/1/8.png",
      "https://static.calmery.moe/s/1/9.png",
      "https://static.calmery.moe/s/1/10.png",
      "https://static.calmery.moe/s/1/11.png",
      "https://static.calmery.moe/s/1/12.png",
      "https://static.calmery.moe/s/1/13.png",
      "https://static.calmery.moe/s/1/14.png",
      "https://static.calmery.moe/s/1/15.png",
      "https://static.calmery.moe/s/1/16.png",
    ],
  },
  {
    name: "かるめりちゃんスタンプ 2",
    urls: [
      "https://static.calmery.moe/s/2/1.png",
      "https://static.calmery.moe/s/2/2.png",
      "https://static.calmery.moe/s/2/3.png",
      "https://static.calmery.moe/s/2/4.png",
      "https://static.calmery.moe/s/2/5.png",
      "https://static.calmery.moe/s/2/6.png",
      "https://static.calmery.moe/s/2/7.png",
      "https://static.calmery.moe/s/2/8.png",
      "https://static.calmery.moe/s/2/9.png",
      "https://static.calmery.moe/s/2/10.png",
      "https://static.calmery.moe/s/2/11.png",
      "https://static.calmery.moe/s/2/12.png",
      "https://static.calmery.moe/s/2/13.png",
      "https://static.calmery.moe/s/2/14.png",
      "https://static.calmery.moe/s/2/15.png",
      "https://static.calmery.moe/s/2/16.png",
      "https://static.calmery.moe/s/2/17.png",
      "https://static.calmery.moe/s/2/18.png",
      "https://static.calmery.moe/s/2/19.png",
      "https://static.calmery.moe/s/2/20.png",
      "https://static.calmery.moe/s/2/21.png",
      "https://static.calmery.moe/s/2/22.png",
      "https://static.calmery.moe/s/2/23.png",
      "https://static.calmery.moe/s/2/24.png",
    ],
  },
];

const Horizontal = styled.div`
  width: 100%;
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const HorizontalInner = styled.div`
  width: fit-content;
  display: flex;
`;

const Container = styled.div`
  margin-bottom: ${Spacing.l}px;
`;

const StickerContainer = styled.div`
  margin-right: ${Spacing.xl}px;

  &:first-child {
    margin-left: ${Spacing.l}px;
  }

  &:last-child {
    margin-right: ${Spacing.l}px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  margin-bottom: ${Spacing.m}px;
  align-items: center;
  position: sticky;
  width: fit-content;
  top: 0;
  left: ${Spacing.l}px;

  img {
    margin-right: ${Spacing.s}px;
  }
`;

const Title = styled.div`
  ${Typography.S};
  font-family: "Sawarabi Gothic", sans-serif;
`;

const Stickers = styled.div`
  display: grid;
  grid-gap: ${Spacing.s}px;
  grid-template-rows: 52px 52px;
  grid-auto-flow: column;
`;

const Sticker = styled.img`
  width: auto;
  height: 100%;
  cursor: pointer;
`;

export const CanvasStickers: React.FC = () => {
  const dispatch = useDispatch();
  const handleOnClickStickerImage = useCallback(
    (group: number, id: number, url: string) =>
      dispatch(thunkActions.addCanvasStickerLayerWithUrl(group, id, url)),
    [dispatch]
  );

  return (
    <Container>
      <Horizontal>
        <HorizontalInner>
          {CANVAS_STICKERS.map(({ name, urls }, group) => (
            <StickerContainer key={group}>
              <TitleContainer>
                <img src="/images/stickers/line-store.svg" alt="LINE STORE" />
                <Title>{name}</Title>
              </TitleContainer>
              <Stickers>
                {urls.map((url, id) => (
                  <Sticker
                    alt="スタンプ"
                    src={url}
                    key={id}
                    onClick={() =>
                      // URL と合わせる
                      handleOnClickStickerImage(group + 1, id + 1, url)
                    }
                  />
                ))}
              </Stickers>
            </StickerContainer>
          ))}
        </HorizontalInner>
      </Horizontal>
    </Container>
  );
};

import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useCallback, useState, useRef } from "react";
import styled from "styled-components";
import { Button } from "~/components/Button";
import { Image } from "~/components/Image";
import { Page } from "~/components/Page";
import { Colors } from "~/styles/colors";
import { Mixin } from "~/styles/mixin";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";
import Head from "next/head";
import ResizeObserver from "resize-observer-polyfill";

const Columns = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  margin-top: 24px;
  display: flex;
`;

const HeaderLogo = styled.div`
  ${Mixin.clickable}

  margin-right: auto;

  picture,
  img {
    height: 32px;
  }
`;

const ButtonContainer = styled.div`
  margin: 0 auto;
  max-width: 360px;
  width: 100%;

  & > * {
    font-family: "Sawarabi Gothic";
  }
`;

const Footer = styled.div`
  ${Typography.XS}

  color: ${Colors.black};
  font-weight: bold;
  margin: ${Spacing.l}px 0;
  text-align: center;
`;

const Logo = styled.div`
  align-items: center;
  flex: 1;
  display: flex;
  margin: ${Spacing.l}px auto;
  width: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const FooterMenu = styled.div`
  display: flex;
  justify-content: center;

  a {
    color: ${Colors.black};
    text-decoration: none;
    margin-right: ${Spacing.s}px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const NotFound = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Sawarabi Gothic";
  font-size: 14px;
  text-align: center;

  img {
    margin-bottom: ${Spacing.m}px;
    height: 160px;
  }
`;

const Share: NextPage<{
  image_url: string;
  og_image_url: string;
  notFound?: boolean;
}> = ({ image_url, og_image_url, notFound = false }) => {
  const displayableRef = useRef<HTMLDivElement>(null);
  const { push } = useRouter();
  const [size, setSize] = useState<{ width: number; height: number }>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const d = displayableRef.current!;
    const resizeObserver = new ResizeObserver(() => {
      setSize(d.getBoundingClientRect());
    });

    resizeObserver.observe(d);

    return () => {
      resizeObserver.unobserve(d);
    };
  }, [displayableRef]);

  const handleOnClickStartButton = useCallback(() => {
    push("/");
  }, []);

  // Render

  return (
    <>
      <Head>
        <meta property="og:image" content={og_image_url} key="og_image" />
        <meta property="og:image:height" content="630" key="og_image_height" />
        <meta property="og:image:width" content="1200" key="og_image_width" />
        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter_card"
        />
        <meta name="twitter:image" content={og_image_url} key="twitter_image" />
      </Head>
      <Page margin>
        <Columns>
          <Header>
            <HeaderLogo>
              <a href="https://calmery.moe">
                <Image src="/images/pages/index/calmery.moe.svg" alt="ロゴ" />
              </a>
            </HeaderLogo>
          </Header>

          <Logo
            ref={displayableRef}
            style={{
              width: size?.width,
              height: size?.height,
            }}
          >
            {size && !notFound && <img src={image_url} alt="画像" />}
            {notFound && (
              <NotFound>
                <div>
                  <div>
                    <img src="/images/stickers/2/6.png" alt="スタンプ" />
                  </div>
                  ごめんなさい...見つかりませんでした...
                </div>
              </NotFound>
            )}
          </Logo>

          <ButtonContainer>
            <Button primary onClickButton={handleOnClickStartButton}>
              {notFound ? "トップに戻る" : "試してみる！"}
            </Button>
          </ButtonContainer>

          <Footer>
            <FooterMenu>
              <a href="https://calmery.moe">Calmery.moe</a>
              <a href="/terms">利用規約</a>
              <a
                href="https://forms.gle/37ucm5pkdZV7L4HAA"
                target="_blank"
                rel="noopener noreferrer"
              >
                お問い合わせ
              </a>
            </FooterMenu>
          </Footer>
        </Columns>
      </Page>
    </>
  );
};

Share.getInitialProps = async ({ query, res }: NextPageContext) => {
  try {
    const response = await fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "https://api.calmery.moe"
          : "http://localhost:5000"
      }/camera/images/${query.id}`
    );

    const {
      data,
    }: {
      data: {
        image_url: string;
        og_image_url: string;
      };
    } = await response.json();

    return data;
  } catch (_) {
    return {
      og_image_url: "",
      image_url: "",
      notFound: true,
    };
  }
};

export default Share;

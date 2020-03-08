import React from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { Button } from "~/components/button";
import { Image } from "~/components/image";
import { Page } from "~/components/page";
import { withRedux, NextPageContextWithRedux } from "~/modules";
import { increment } from "~/modules/counter/actions";
import { Colors } from "~/styles/colors";
import { Media } from "~/styles/media";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";

const Buttons = styled.div`
  display: flex;

  ${Media.queries.pc} {
    width: fit-content;
    margin: 0 auto;
  }

  ${Media.queries.sp} {
    flex-direction: column;
  }

  & > * {
    ${Media.queries.pc} {
      max-width: 217px;
      margin-right: ${Spacing.l}px;
    }

    ${Media.queries.sp} {
      margin-bottom: ${Spacing.m}px;
    }

    &:last-child {
      margin-bottom: 0;
      margin-right: 0;
    }
  }
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Footer = styled.div`
  ${Typography.XS}

  color: ${Colors.black};
  font-weight: bold;
  margin: ${Spacing.xl}px 0;
  text-align: center;
`;

const Header = styled.div`
  display: flex;

  ${Media.queries.pc} {
    padding: ${Spacing.xl}px 0;
  }

  ${Media.queries.sp} {
    padding: ${Spacing.l}px 0;
  }

  img {
    height: 32px;
  }
`;

const Logo = styled.div`
  align-items: center;
  flex: 1;
  display: flex;
  margin: ${Spacing.xl}px auto;
  width: fit-content;

  picture,
  img {
    max-width: 512px;
    width: 100%;
  }
`;

const Home: NextPage = () => (
  <Page margin>
    <Contents>
      <Header>
        <Image src="/images/logos/calmery.moe.svg" />
      </Header>

      <Logo>
        <Image src="/images/logos/camera.calmery.moe.svg" />
      </Logo>

      <Buttons>
        <Button primary>画像を読み込んで始める！</Button>
        <Button>前回の続きから始める！</Button>
      </Buttons>

      <Footer>
        Made with <Image src="/images/heart.svg" /> by Calmery
      </Footer>
    </Contents>
  </Page>
);

Home.getInitialProps = async ({ store }: NextPageContextWithRedux) => {
  store.dispatch(increment(100));
};

export default withRedux(Home);

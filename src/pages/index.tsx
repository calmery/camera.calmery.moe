import React, { useCallback } from "react";
import { NextPage } from "next";
import blueimpLoadImage from "blueimp-load-image";
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
import { useDispatch } from "react-redux";
import { Mixin } from "~/styles/mixin";
import { addUserLayerWithDataUrl } from "~/modules/canvas/actions";

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

const InputButton = styled.div`
  ${Mixin.clickable}

  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const file = event.target.files[0];

    blueimpLoadImage(
      file,
      async canvas => {
        dispatch(
          addUserLayerWithDataUrl((canvas as HTMLCanvasElement).toDataURL())
        );
      },
      { canvas: true, orientation: true }
    );
  }, []);

  return (
    <Page margin>
      <Contents>
        <Header>
          <Image src="/images/logos/calmery.moe.svg" />
        </Header>

        <Logo>
          <Image src="/images/logos/camera.calmery.moe.svg" />
        </Logo>

        <Buttons>
          <InputButton>
            <Button primary>画像を読み込んで始める！</Button>
            <Input type="file" onChange={onChange} multiple={false} />
          </InputButton>
          <Button>前回の続きから始める！</Button>
        </Buttons>

        <Footer>
          Made with <Image src="/images/heart.svg" /> by Calmery
        </Footer>
      </Contents>
    </Page>
  );
};

Home.getInitialProps = async ({ store }: NextPageContextWithRedux) => {
  store.dispatch(increment(100));
};

export default withRedux(Home);

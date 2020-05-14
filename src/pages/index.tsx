import React, { useState, useCallback } from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { IconButton } from "~/components/IconButton";
import { Page } from "~/components/Page";
import { Colors } from "~/styles/colors";
import { Media } from "~/styles/media";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";
import { Modal } from "~/containers/Modal";
import { Image } from "~/components/Image";
import { Button } from "~/components/Button";

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
  margin-right: auto;

  picture,
  img {
    height: 32px;
  }
`;

const HeaderIconButtons = styled.div`
  display: flex;

  > * {
    margin-left: ${Spacing.m}px;
  }
`;

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

const Footer = styled.div`
  ${Typography.XS}

  color: ${Colors.black};
  font-weight: bold;
  margin: ${Spacing.xl}px 0;
  text-align: center;
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

const Index: NextPage = () => {
  const [isInformationVisible, setInformationVisible] = useState(false);
  const [isSettingVisible, setSettingVisible] = useState(false);

  // Events

  const handleOnClickInformationVisible = useCallback(
    () => setInformationVisible(!isInformationVisible),
    [isInformationVisible]
  );

  const handleOnClickSettingVisible = useCallback(
    () => setSettingVisible(!isSettingVisible),
    [isSettingVisible]
  );

  // Render

  return (
    <>
      <Page margin>
        <Columns>
          <Header>
            <HeaderLogo>
              <Image src="/images/logos/calmery.moe.svg" />
            </HeaderLogo>
            <HeaderIconButtons>
              <IconButton
                clicked={isInformationVisible}
                onClick={handleOnClickInformationVisible}
              >
                A
              </IconButton>
              <IconButton
                clicked={isSettingVisible}
                onClick={handleOnClickSettingVisible}
              >
                A
              </IconButton>
            </HeaderIconButtons>
          </Header>

          <Logo>
            <Image src="/images/logos/camera.calmery.moe.svg" />
          </Logo>

          <Buttons>
            <Button primary>画像を読み込んで始める！</Button>
            <Button disabled>前回の続きから始める！</Button>
          </Buttons>

          <Footer>
            Made with <Image src="/images/heart.svg" /> by Calmery
          </Footer>
        </Columns>
      </Page>

      <Modal
        visible={isInformationVisible}
        onClickCloseButton={handleOnClickInformationVisible}
      >
        Information
      </Modal>
      <Modal
        visible={isSettingVisible}
        onClickCloseButton={handleOnClickSettingVisible}
      >
        Setting
      </Modal>
    </>
  );
};

export default Index;

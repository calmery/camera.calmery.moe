import React, { useState, useCallback, useRef } from "react";
import { NextPage } from "next";
import Router from "next/router";
import styled from "styled-components";
import { IconButton } from "~/components/IconButton";
import { Page } from "~/components/Page";
import { Colors } from "~/styles/colors";
import { Media } from "~/styles/media";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";
import { Mixin } from "~/styles/mixin";
import { Modal } from "~/containers/Modal";
import { Image } from "~/components/Image";
import { Checkbox } from "~/components/Checkbox";
import { Button } from "~/components/Button";
import { useDispatch } from "react-redux";
import { withRedux } from "~/domains";
import { actions, thunkActions } from "~/domains/canvas/actions";

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
    font-family: SmartFontUI;

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

const ModalTitle = styled.div`
  ${Typography.L}

  color: ${Colors.black};
  font-family: SmartFontUI, sans-serif;
  margin-bottom: ${Spacing.s}px;
`;

const ModalText = styled.div`
  ${Typography.S}

  color: ${Colors.black};
  font-family: SmartFontUI, sans-serif;

  a {
    color: ${Colors.black};
    font-family: Roboto, sans-serif;
    font-weight: bold;
    text-decoration: none;
  }
`;

const ModalTextRoboto = styled.span`
  color: ${Colors.black};
  font-family: Roboto, sans-serif;
`;

const ModalConfig = styled.div`
  display: flex;
  margin-bottom: ${Spacing.l}px;

  > *:first-child {
    margin-right: ${Spacing.m}px;
  }
`;

const ModalConfigTitle = styled.div`
  ${Typography.L}

  line-height: 32px;
  color: ${Colors.black};
  font-family: SmartFontUI, sans-serif;
`;

const ModalConfigDescription = styled.div`
  ${Typography.XS}

  color: ${Colors.gray};
  font-family: SmartFontUI, sans-serif;
`;

const HiddenInput = styled.input`
  width: 100%;
  height: 100%;
  opacity: 0;
  top: 0;
  left: 0;
  position: absolute;
  cursor: pointer;
`;

const Index: NextPage = () => {
  const dispatch = useDispatch();
  const [isInformationVisible, setInformationVisible] = useState(false);
  const [isSettingVisible, setSettingVisible] = useState(false);

  // Events

  const handleOnChangeFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      const file = files![0];

      await dispatch(thunkActions.addCanvasUserLayerAndSetFrameFromFile(file));

      Router.push("/edit");
    },
    [dispatch]
  );

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
              <a href="https://calmery.moe">
                <Image src="/images/logos/calmery.moe.svg" />
              </a>
            </HeaderLogo>
            <HeaderIconButtons>
              <IconButton
                clicked={isInformationVisible}
                onClick={handleOnClickInformationVisible}
                src="/images/information.svg"
              />
              <IconButton
                clicked={isSettingVisible}
                onClick={handleOnClickSettingVisible}
                src="/images/setting.svg"
              />
            </HeaderIconButtons>
          </Header>

          <Logo>
            <Image src="/images/logos/camera.calmery.moe.svg" />
          </Logo>

          <Buttons>
            <Button primary>
              画像を読み込んで始める！
              <HiddenInput
                type="file"
                multiple={false}
                accept="image/*"
                onChange={handleOnChangeFile}
              />
            </Button>
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
        <ModalTitle>お問い合わせ</ModalTitle>
        <ModalText>
          ご感想や不具合の報告は次の <ModalTextRoboto>Google</ModalTextRoboto>{" "}
          フォームまでお願いします。
          <br />
          <a
            href="https://forms.gle/37ucm5pkdZV7L4HAA"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://forms.gle/37ucm5pkdZV7L4HAA
          </a>
        </ModalText>
      </Modal>

      <Modal
        visible={isSettingVisible}
        onClickCloseButton={handleOnClickSettingVisible}
      >
        <ModalConfig>
          <div>
            <Checkbox
              onChange={() => {
                console.log("Dummy");
              }}
            />
          </div>
          <div>
            <ModalConfigTitle>画像を元のサイズで読み込む</ModalConfigTitle>
            <ModalConfigDescription>
              画像を読み込むときに画像を縮小せずに読み込みます。画像を読み込んだときにページが落ちる、再読み込みするといった症状が起こる場合はオフにしてください。
            </ModalConfigDescription>
          </div>
        </ModalConfig>
        <ModalConfig>
          <div>
            <Checkbox
              onChange={() => {
                console.log("Dummy");
              }}
            />
          </div>
          <div>
            <ModalConfigTitle>開発中の機能をオンにする</ModalConfigTitle>
            <ModalConfigDescription>
              開発中の機能を使用します。使用中にアプリが落ちる、再読み込みするといった問題が起こる可能性があることに注意してください。
            </ModalConfigDescription>
          </div>
        </ModalConfig>
      </Modal>
    </>
  );
};

export default withRedux(Index);

import React, { useState, useCallback, useRef, useEffect } from "react";
import { NextPage } from "next";
import Router from "next/router";
import styled, { css } from "styled-components";
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
import { thunkActions } from "~/domains/canvas/actions";
import { getImageFile } from "~/utils/get-image-file";
import { actions as uiActions } from "~/domains/ui/actions";
import { Popup } from "~/components/Popup";

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
    font-family: "Sawarabi Gothic";

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
  font-family: "Sawarabi Gothic", sans-serif;
  margin-bottom: ${Spacing.s}px;
`;

const ModalText = styled.div`
  ${Typography.S}

  color: ${Colors.black};
  font-family: "Sawarabi Gothic", sans-serif;
  margin-bottom: ${Spacing.m}px;

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

const ModalConfig = styled.div<{ disabled?: boolean }>`
  display: flex;
  margin-bottom: ${Spacing.l}px;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.46;
      cursor: not-allowed;
    `}

  > *:first-child {
    margin-right: ${Spacing.m}px;
  }
`;

const ModalConfigTitle = styled.div`
  ${Typography.L}

  line-height: 32px;
  color: ${Colors.black};
  font-family: "Sawarabi Gothic", sans-serif;
`;

const ModalConfigDescription = styled.div`
  ${Typography.XS}

  color: ${Colors.gray};
  font-family: "Sawarabi Gothic", sans-serif;
`;

const FooterMenu = styled.div`
  margin-bottom: ${Spacing.s}px;
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

const Index: NextPage = () => {
  const dispatch = useDispatch();
  const [isTermsAgreed, setTermsAgreed] = useState(false);
  const [isShowTermsPopup, setShowTermsPopup] = useState(false);
  const [isInformationVisible, setInformationVisible] = useState(false);
  const [isSettingVisible, setSettingVisible] = useState(false);

  useEffect(() => {
    const maybeIsTermsAgreed = localStorage.getItem("terms-of-service");

    if (!maybeIsTermsAgreed) {
      return;
    }

    setTermsAgreed(true);
  }, []);

  const pickupImage = useCallback(async () => {
    try {
      await dispatch(
        thunkActions.addCanvasUserLayerFromFile(await getImageFile(), 0)
      );

      Router.push("/edit");
    } catch (_) {
      dispatch(uiActions.imageLoadError(true));
    }
  }, [dispatch]);

  const handleOnClickTermsAgreeButton = useCallback(() => {
    localStorage.setItem("terms-of-service", new Date().toISOString());
    setTermsAgreed(true);
    setShowTermsPopup(false);

    pickupImage();
  }, [dispatch]);

  const handleOnClickTermsCancelButton = useCallback(() => {
    setShowTermsPopup(false);
  }, []);

  // Events

  const handleOnClickStartButton = useCallback(() => {
    if (!isTermsAgreed) {
      setShowTermsPopup(true);
      return;
    }

    pickupImage();
  }, [isTermsAgreed]);

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
            <Button primary onClickButton={handleOnClickStartButton}>
              画像を読み込んで始める！
            </Button>
            <Button disabled>前回の続きから始める！</Button>
          </Buttons>
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
        <ModalText>ごめんなさい！現在、設定は利用できません。</ModalText>
        <ModalConfig disabled>
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
        <ModalConfig disabled>
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

      {isShowTermsPopup && (
        <Popup
          characterImageUrl="https://static.calmery.moe/s/2/17.png"
          onEnter={handleOnClickTermsAgreeButton}
          onCancel={handleOnClickTermsCancelButton}
          cancalText="同意しない"
          enterText="同意する"
        >
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            利用規約
          </a>{" "}
          に同意して始める！
          <br />
        </Popup>
      )}
    </>
  );
};

export default withRedux(Index);

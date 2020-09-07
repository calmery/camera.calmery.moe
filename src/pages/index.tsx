import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { Button } from "~/components/Button";
import { Checkbox } from "~/components/Checkbox";
import { IconButton } from "~/components/IconButton";
import { Image } from "~/components/Image";
import { Modal } from "~/components/Modal";
import { Page } from "~/components/Page";
import { Popup } from "~/components/Popup";
import { Colors } from "~/styles/colors";
import { Media } from "~/styles/media";
import { Mixin } from "~/styles/mixin";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";
import { withRedux } from "~/domains";
import { thunkActions } from "~/domains/canvas/actions";
import { actions as uiActions } from "~/domains/ui/actions";
import { getImageFile } from "~/utils/get-image-file";

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
  }

  img {
    border-radius: 4px;
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
  const { push } = useRouter();

  // States

  const [isTermsAgreed, setTermsAgreed] = useState(false);
  const [isShowTermsPopup, setShowTermsPopup] = useState(false);
  const [isInformationVisible, setInformationVisible] = useState(false);
  const [isSettingVisible, setSettingVisible] = useState(false);

  // Hooks

  useEffect(() => {
    if (localStorage.getItem("terms-of-service")) {
      setTermsAgreed(true);
    }
  }, []);

  // Helper Functions

  const loadImage = useCallback(async () => {
    const image = await getImageFile();
    dispatch(uiActions.startLoading());

    try {
      await dispatch(thunkActions.addCanvasUserLayerFromFile(image, 0));
      push("/stickers");
    } catch (error) {
      dispatch(uiActions.imageLoadError(true));
      throw error;
    } finally {
      dispatch(uiActions.finishLoading());
    }
  }, [dispatch, push]);

  // Events

  const handleOnClickTermsAgreeButton = useCallback(() => {
    localStorage.setItem("terms-of-service", new Date().toISOString());
    setShowTermsPopup(false);
    setTermsAgreed(true);
    loadImage();
  }, [dispatch]);

  const handleOnClickTermsCancelButton = useCallback(() => {
    setShowTermsPopup(false);
  }, []);

  const handleOnClickStartButton = useCallback(() => {
    if (!isTermsAgreed) {
      setShowTermsPopup(true);
      return;
    }

    loadImage();
  }, [isTermsAgreed]);

  const handleOnOpenInformationButton = useCallback(
    () => setInformationVisible(true),
    []
  );

  const handleOnCloseInformationButton = useCallback(
    () => setInformationVisible(false),
    []
  );

  const handleOnOpenSettingButton = useCallback(
    () => setSettingVisible(true),
    []
  );

  const handleOnCloseSettingButton = useCallback(
    () => setSettingVisible(false),
    []
  );

  // Render

  return (
    <>
      <Page margin>
        <Columns>
          <Header>
            <HeaderLogo>
              <a href="https://calmery.moe">
                <Image src="/images/pages/index/calmery.moe.svg" alt="ロゴ" />
              </a>
            </HeaderLogo>
            <HeaderIconButtons>
              <IconButton
                clicked={isInformationVisible}
                onClick={handleOnOpenInformationButton}
                src="/images/pages/index/information.svg"
              />
              <IconButton
                clicked={isSettingVisible}
                onClick={handleOnOpenSettingButton}
                src="/images/pages/index/setting.svg"
              />
            </HeaderIconButtons>
          </Header>

          <Logo>
            <Image src="/images/pages/camera.calmery.moe.svg" alt="ロゴ" />
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
            Made with <Image src="/images/pages/index/heart.svg" alt="ハート" />{" "}
            by Calmery
          </Footer>
        </Columns>
      </Page>
      <Modal
        visible={isInformationVisible}
        onClickCloseButton={handleOnCloseInformationButton}
      >
        <ModalText>
          <img
            src="https://pbs.twimg.com/profile_banners/3086780643/1583232158/1500x500"
            width="100%"
          />
        </ModalText>
        <ModalTitle>かるめりちゃんカメラって？</ModalTitle>
        <ModalText>
          かるめりちゃんカメラは{" "}
          <a
            href="https://twitter.com/calmeryme"
            target="_blank"
            rel="noopener noreferrer"
          >
            Calmery
          </a>{" "}
          のうちの子である「白咲 愛々璃（しろさき
          あめり）」、通称かるめりちゃんのイラストを使用して写真や画像を加工できるサービスです！
        </ModalText>
        <ModalText>
          <a
            href="https://calmery.moe"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://calmery.moe
          </a>
          <br />
          <a
            href="https://github.com/calmery-chan/camera.calmery.moe"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/calmery-chan/camera.calmery.moe
          </a>
        </ModalText>
        <ModalTitle>Special Thanks !</ModalTitle>
        <ModalText>
          このかるめりちゃんカメラで使用しているかわいいスタンプのイラストは{" "}
          <a
            href="https://twitter.com/metanen0x0"
            target="_blank"
            rel="noopener noreferrer"
          >
            めたねのおくすり
          </a>{" "}
          さんに、素敵なロゴは{" "}
          <a
            href="https://twitter.com/sorano_design"
            target="_blank"
            rel="noopener noreferrer"
          >
            takumi
          </a>{" "}
          さんに作成していただきました。また、
          <a
            href="https://twitter.com/gikobull"
            target="_blank"
            rel="noopener noreferrer"
          >
            gikobull
          </a>{" "}
          にはデザイン周りで相談に乗ってもらいました。ありがとうございました！
        </ModalText>
        <ModalTitle>お問い合わせ</ModalTitle>
        <ModalText>
          ご感想や不具合の報告は次の <ModalTextRoboto>Google</ModalTextRoboto>{" "}
          フォームまでお願いします。
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
        onClickCloseButton={handleOnCloseSettingButton}
      >
        <ModalText>ごめんなさい！現在、設定は変更できません。</ModalText>
        <ModalConfig disabled>
          <div>
            <Checkbox onChange={() => void 0} />
          </div>
          <div>
            <ModalConfigTitle>画像を縮小せずに読み込む</ModalConfigTitle>
            <ModalConfigDescription>
              画像を読み込む際に画像を縮小せずに読み込みます。この設定をオンにした際にブラウザがクラッシュする、再読み込みするといった症状が起こる場合はオフにしてください。
            </ModalConfigDescription>
          </div>
        </ModalConfig>
        <ModalConfig disabled>
          <div>
            <Checkbox onChange={() => void 0} />
          </div>
          <div>
            <ModalConfigTitle>開発中の機能を使用する</ModalConfigTitle>
            <ModalConfigDescription>
              開発中の機能を使用します。この設定をオンにした際にブラウザがクラッシュする、再読み込みするといった症状が起こる場合はオフにしてください。
            </ModalConfigDescription>
          </div>
        </ModalConfig>
      </Modal>
      s
      {isShowTermsPopup && (
        <Popup
          characterImageUrl="/images/stickers/2/17.png"
          onEnter={handleOnClickTermsAgreeButton}
          onCancel={handleOnClickTermsCancelButton}
          enterText="同意する"
          cancalText="同意しない"
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

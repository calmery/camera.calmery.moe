import React, { useState } from "react";
import styled from "styled-components";
import { Modal } from "~/components/Modal";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";
import { Colors } from "~/styles/colors";
import { Button } from "./Button";
import { Popup } from "./Popup";
import { useRouter } from "next/router";
import * as GA from "~/utils/google-analytics";

const Container = styled.div`
  height: 16px;
  padding: ${Spacing.l}px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;

  img {
    cursor: pointer;
    height: 16px;
    vertical-align: top;
  }
`;

const Group = styled.div`
  img {
    margin-left: ${Spacing.l}px;
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
  font-family: "Sawarabi Gothic", sans-serif;
`;

const ModalConfigDescription = styled.div`
  ${Typography.XS}

  color: ${Colors.gray};
  font-family: "Sawarabi Gothic", sans-serif;
`;

export const ControlBar: React.FC<{
  onClickHelpButton?: () => void;
}> = ({ onClickHelpButton }) => {
  const [isOpenBetaMenu, setOpenBetaMenu] = useState(false);
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isOpenSetting, setOpenSetting] = useState(false);
  const { push } = useRouter();

  return (
    <>
      <Container>
        <img
          src="/images/close.svg"
          onClick={() => setOpenPopup(true)}
          alt="閉じる"
        />
        <img
          id="tutorial-control-bar-beta"
          onClick={() => {
            GA.clickBetaButton();
            setOpenBetaMenu(true);
          }}
          src="/images/components/beta.svg"
          alt="Beta"
        />
        <Group>
          <img
            id="tutorial-control-bar-usage"
            src="/images/components/help.svg"
            onClick={onClickHelpButton}
            alt="ヘルプ"
          />
          <img
            id="tutorial-control-bar-usage"
            src="/images/components/setting.svg"
            onClick={() => setOpenSetting(true)}
            alt="設定"
          />
        </Group>
      </Container>
      <Modal
        visible={isOpenBetaMenu}
        onClickCloseButton={() => setOpenBetaMenu(false)}
      >
        <ModalConfig>
          <div>
            <ModalTitle>お問い合わせ</ModalTitle>
            <ModalText>
              ご感想や不具合の報告、機能やフレームのリクエストは以下の{" "}
              <ModalTextRoboto>Google</ModalTextRoboto>{" "}
              フォームよりお願いします。
              <br />
              <a
                href="https://forms.gle/37ucm5pkdZV7L4HAA"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://forms.gle/37ucm5pkdZV7L4HAA
              </a>
            </ModalText>
          </div>
        </ModalConfig>
        <ModalConfig>
          <div>
            <ModalConfigTitle>
              ローカルストレージの内容を削除する
            </ModalConfigTitle>
            <ModalConfigDescription>
              デバッグ用です。ローカルストレージに保存している全てのデータを削除、トップページに移動します。
            </ModalConfigDescription>
          </div>
        </ModalConfig>
        <Button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          ローカルストレージの内容を削除する
        </Button>
      </Modal>
      <Modal
        visible={isOpenSetting}
        onClickCloseButton={() => setOpenSetting(false)}
      >
        Setting
      </Modal>
      {isOpenPopup && (
        <Popup
          characterImageUrl="https://static.calmery.moe/s/2/18.png"
          onEnter={() => {
            push("/");
          }}
          onCancel={() => setOpenPopup(false)}
          enterText="トップに戻る"
          cancalText="戻らない！"
        >
          トップに戻る？
          <br />
          気を付けて！編集内容は失われるよ！
        </Popup>
      )}
    </>
  );
};

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { Modal } from "~/components/Modal";
import { State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
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

  img {
    cursor: pointer;
    height: 16px;
    vertical-align: top;
  }
`;

const ContainerInner = styled.div`
  position: relative;
  text-align: center;
`;

const LeftGroup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;

  img {
    margin-right: ${Spacing.l}px;
  }
`;

const RightGroup = styled.div`
  position: absolute;
  top: 0;
  right: 0;

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
  width: 100%;
  display: flex;
  margin-bottom: ${Spacing.l}px;

  > *:first-child {
    margin-right: ${Spacing.m}px;
  }
`;

const ModalConfigSingleColumn = styled.div`
  width: 100%;
  margin: 0 !important;
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

const SelectContainer = styled.div`
  ${Typography.S};

  width: 100%;
  height: 34px;
  position: relative;
  margin-top: ${Spacing.m}px;
  font-family: "Sawarabi Gothic", sans-serif;
`;

const SelectInner = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: ${Spacing.s}px ${Spacing.m}px;
  position: absolute;
  border: 1px solid ${Colors.gray};
  border-radius: 50vh;
  display: flex;

  img {
    vertical-align: bottom;
    margin-left: auto;
  }
`;

const SelectHidden = styled.select`
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0;
  font-size: 16px; // iOS で 16px 未満のフォントサイズのとき画面が拡大される
`;

const HistoryBack = styled.img<{ disabled?: boolean }>`
  transform: scaleX(-1);

  ${({ disabled }) =>
    disabled
      ? css`
          opacity: 0.46;
        `
      : ""}
`;

const HistoryGo = styled.img<{ disabled?: boolean }>`
  ${({ disabled }) =>
    disabled
      ? css`
          opacity: 0.46;
        `
      : ""}
`;

export const ControlBar: React.FC<{
  onClickHelpButton?: () => void;
}> = ({ onClickHelpButton }) => {
  const dispatch = useDispatch();
  const { logoPosition, histories, backedHistories } = useSelector(
    ({ canvas }: State) => canvas
  );
  const [isOpenBetaMenu, setOpenBetaMenu] = useState(false);
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isOpenSetting, setOpenSetting] = useState(false);
  const { push } = useRouter();

  return (
    <>
      <Container>
        <ContainerInner>
          <LeftGroup>
            <img
              src="/images/close.svg"
              onClick={() => setOpenPopup(true)}
              alt="閉じる"
            />
            <HistoryBack
              src="/images/components/next.svg"
              onClick={() => dispatch(actions.canvasHistoryBack())}
              alt="戻る"
              disabled={!histories.length}
            />
            <HistoryGo
              src="/images/components/next.svg"
              onClick={() => dispatch(actions.canvasHistoryGo())}
              alt="進む"
              disabled={!backedHistories.length}
            />
          </LeftGroup>
          <img
            id="tutorial-control-bar-beta"
            onClick={() => {
              GA.clickBetaButton();
              setOpenBetaMenu(true);
            }}
            src="/images/components/beta.svg"
            alt="Beta"
          />
          <RightGroup>
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
          </RightGroup>
        </ContainerInner>
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
        <ModalConfig>
          <ModalConfigSingleColumn>
            <ModalConfigTitle>ロゴの位置を変更する</ModalConfigTitle>
            <ModalConfigDescription>
              画像上に表示されるロゴの位置を変更します。
            </ModalConfigDescription>
            <SelectContainer>
              <SelectInner>
                {logoPosition === "left" ? "左" : "右"}
                <img src="/images/components/arrow.svg" alt="選択する" />
              </SelectInner>
              <SelectHidden
                onChange={(event) => {
                  dispatch(
                    actions.changeCanvasLogoPosition(
                      event.target.value as "left" | "right"
                    )
                  );
                }}
              >
                <option value="left" selected={logoPosition === "left"}>
                  左
                </option>
                <option value="right" selected={logoPosition === "right"}>
                  右
                </option>
              </SelectHidden>
            </SelectContainer>
          </ModalConfigSingleColumn>
        </ModalConfig>
      </Modal>
      {isOpenPopup && (
        <Popup
          characterImageUrl="/images/stickers/2/18.png"
          onEnter={() => {
            push("/");
          }}
          onCancel={() => setOpenPopup(false)}
          enterText="トップに戻る"
          cancalText="戻らない！"
        >
          トップに戻る？
          <br />
          編集は「前回の続きから始める！」から再開できるよ！
        </Popup>
      )}
    </>
  );
};

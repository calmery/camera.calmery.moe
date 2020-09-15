import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Button } from "~/components/Button";
import { ControlBar } from "~/components/ControlBar";
import { FirstLanding } from "~/components/FirstLanding";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { PageColumn } from "~/components/PageColumn";
import { Tutorial } from "~/components/Tutorial";
import {
  SAVE_PAGE_WITH_IMAGE_SCENARIOS,
  PAGE_WITHOUT_IMAGE_SCENARIOS,
} from "~/constants/tutorials";
import { Canvas } from "~/containers/Canvas";
import { withRedux, State } from "~/domains";
import * as GA from "~/utils/google-analytics";
import { Spacing } from "~/styles/spacing";
import { Popup } from "~/components/Popup";

// Styles

const PreviewImage = styled.img`
  position: fixed;
`;

const ButtonContainer = styled.div`
  max-width: 360px;
  margin: 0 auto;
  padding: ${Spacing.m}px ${Spacing.l}px;
  padding-top: 0;
`;

// Components

const Save: NextPage = () => {
  const { pathname } = useRouter();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const [cache, setCache] = useState<string>();

  // States

  const [isTutorial, setTutorial] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageUploadError, setImageUploadError] = useState(false);

  // Events

  const handleOnClickHelpButton = useCallback(() => {
    GA.playTutorial(pathname);
    setTutorial(true);
  }, []);

  const handleOnCompleteTutorial = useCallback(() => {
    setTutorial(false);
    GA.completeTutorial(pathname);
  }, []);

  const handleOnStopTutorial = useCallback(() => {
    setTutorial(false);
    GA.stopTutorial(pathname);
  }, []);

  const handleOnSave = useCallback(() => {
    GA.saveCanvas();
  }, []);

  const handleOnClickShareButton = useCallback(async () => {
    if (cache) {
      const a = document.createElement("a");

      const url = `${window.location.origin}/share/${cache}`;
      a.href = `http://twitter.com/share?url=${url}&related=calmeryme&hashtags=%E3%81%8B%E3%82%8B%E3%82%81%E3%82%8A%E3%81%A1%E3%82%83%E3%82%93%E3%82%AB%E3%83%A1%E3%83%A9`;
      a.target = "_blank";
      a.rel = "noopener noreferrer";

      a.click();

      return;
    }

    if (!previewUrl) {
      return;
    }

    setIsImageUploading(true);

    const array = previewUrl.split(",");
    const type = array[0]!.match(/:(.*?);/)![1];
    const bstr = atob(array[1]);

    let i = bstr.length;
    const uInt8Array = new Uint8Array(i);
    while (i--) {
      uInt8Array[i] = bstr.charCodeAt(i);
    }

    const file = new File([uInt8Array], "preview.png", { type });

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await fetch(
        process.env.NODE_ENV === "production"
          ? "https://api.calmery.moe/camera/images"
          : "http://localhost:5000/camera/images",
        {
          body: formData,
          mode: "cors",
          method: "POST",
        }
      ).then((r) => r.json());

      const a = document.createElement("a");

      const url = `${window.location.origin}/share/${data.id}`;
      a.href = `http://twitter.com/share?url=${url}&related=calmeryme&hashtags=%E3%81%8B%E3%82%8B%E3%82%81%E3%82%8A%E3%81%A1%E3%82%83%E3%82%93%E3%82%AB%E3%83%A1%E3%83%A9`;
      a.target = "_blank";
      a.rel = "noopener noreferrer";

      setCache(data.id);

      a.click();
    } catch (_) {
      setImageUploadError(true);
    } finally {
      setIsImageUploading(false);
    }
  }, [previewUrl, cache]);

  // Render

  const { userLayers, styleTop, styleLeft, styleWidth, styleHeight } = canvas;

  const isImageExists = userLayers.some((u) => u);

  return (
    <>
      <Page>
        <PageColumn>
          <ControlBar onClickHelpButton={handleOnClickHelpButton} />
          <Canvas
            logo={isImageExists}
            onCreatePreviewUrl={isImageExists ? setPreviewUrl : undefined}
          />
          {isImageExists && (
            <PreviewImage
              style={{
                top: styleTop,
                left: styleLeft,
                width: styleWidth,
                height: styleHeight,
                opacity: previewUrl ? 1 : 0,
              }}
              onContextMenu={handleOnSave}
              onTouchStart={handleOnSave}
              id="tutorial-save-image"
              alt="出力画像"
              src={previewUrl || ""}
            />
          )}
          <Menu>
            {isImageExists && (
              <ButtonContainer>
                <Button
                  disabled={!previewUrl || isImageUploading}
                  primary
                  onClickButton={handleOnClickShareButton}
                >
                  {isImageUploading
                    ? "画像の準備をしているよ..."
                    : "Twitter にシェアする！"}
                </Button>
              </ButtonContainer>
            )}
          </Menu>
        </PageColumn>
      </Page>

      <FirstLanding />

      {isTutorial && (
        <Tutorial
          scenarios={
            isImageExists
              ? SAVE_PAGE_WITH_IMAGE_SCENARIOS
              : PAGE_WITHOUT_IMAGE_SCENARIOS
          }
          onComplete={handleOnCompleteTutorial}
          onStop={handleOnStopTutorial}
        />
      )}

      {isImageUploadError && (
        <Popup
          characterImageUrl="/images/stickers/2/6.png"
          onEnter={() => setImageUploadError(false)}
          enterText="わかった"
        >
          画像のアップロードに失敗したみたい...
          <br />
          もう一度試してみてね！
        </Popup>
      )}
    </>
  );
};

export default withRedux(Save);

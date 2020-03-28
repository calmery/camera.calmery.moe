import React, { useRef, useCallback } from "react";
import { NextPage } from "next";
import { withRedux, NextPageContextWithRedux } from "~/domains";
import Canvas from "~/containers/Canvas";

const convertDataUrlToBlob = (dataUrl: string) => {
  const type = dataUrl
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  const decodedData = atob(dataUrl.split(",")[1]);
  const buffer = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; i++) {
    buffer[i] = decodedData.charCodeAt(i);
  }
  return new Blob([buffer.buffer], { type });
};

export const convertSvgToDataUrl = (
  svgText: string,
  width: number,
  height: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const svg = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svg);
    const image = new Image();

    image.onerror = () => reject();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (context === null) {
        return reject();
      }

      context.drawImage(image, 0, 0, width, height);
      const blob = convertDataUrlToBlob(canvas.toDataURL("image/png"));
      resolve(URL.createObjectURL(blob));
    };

    image.src = url;
  });
};

export const download = (name: string, body: string) => {
  const a = document.createElement("a");
  a.href = body;
  a.download = name;
  a.click();
};

const Preview: NextPage = () => {
  const ref: React.Ref<HTMLDivElement> = useRef(null);
  const onClickDownload = useCallback(async () => {
    if (!ref.current) {
      // ToDo
      return;
    }

    const dataUrl = await convertSvgToDataUrl(
      ref.current!.innerHTML,
      2000,
      1420
    );
    download(`${new Date().toISOString()}.png`, dataUrl);
  }, []);

  return (
    <>
      <div ref={ref}>
        <Canvas />
      </div>
      <button onClick={onClickDownload}>Download</button>
    </>
  );
};

Preview.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Preview);

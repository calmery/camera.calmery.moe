import React, { useRef, useCallback } from "react";
import { NextPage } from "next";
import { withRedux, State } from "~/domains";
import { Canvas } from "~/containers/Canvas";
import { useSelector } from "react-redux";
import { convertSvgToDataUrl } from "~/utils/convert-svg-to-url";

const Preview: NextPage = () => {
  const { width, height } = useSelector(
    ({ canvas }: State) => canvas.container
  );
  const ref: React.Ref<HTMLDivElement> = useRef(null);
  const onClickDownload = useCallback(async () => {
    const dataUrl = await convertSvgToDataUrl(
      ref.current!.innerHTML,
      width,
      height
    );

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${new Date().toISOString()}.png`;
    a.click();
  }, []);

  return (
    <>
      <div ref={ref}>
        <Canvas preview />
      </div>
      <button onClick={onClickDownload}>Download</button>
    </>
  );
};

export default withRedux(Preview);

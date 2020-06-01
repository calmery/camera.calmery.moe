import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";
import { getCanvasUserFrameId } from "~/utils/canvas";

export const CanvasUserFrames: React.FC = () => {
  const canvas = useSelector(({ canvas }: State) => canvas);
  const { userFrames } = canvas;

  return (
    <>
      {userFrames.map((userFrame, i) => {
        const { x, y, path } = userFrame;

        return (
          <mask id={getCanvasUserFrameId(i)} key={i}>
            <g transform={`translate(${x}, ${y})`}>
              <path d={path} fill="#fff" />
            </g>
          </mask>
        );
      })}
    </>
  );
};

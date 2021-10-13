import { css, cx } from "@emotion/css";
import React from "react";
import { useDeno } from "aleph/react";

export default function Home() {
  useDeno((aleph) => aleph.mode);

  return (
    <div
      className={cx(css`color: white;`, "bg-black")}
    >
      Hello World
    </div>
  );
}

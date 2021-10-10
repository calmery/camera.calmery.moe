import { css } from "@emotion/css";
import React from "react";
import clsx from "clsx";
import { useDeno } from "aleph/react";

export default function Home() {
  useDeno((aleph) => aleph.mode);

  return (
    <div
      className={clsx(css`color: white;`, "bg-black")}
    >
      Hello World
    </div>
  );
}

import { css } from "@emotion/react";
import { useDeno } from "aleph/react";
import clsx from "clsx";
import React from "react";
import useCounter from "~/lib/useCounter.ts";

export default function Home() {
  const [count, isSyncing, increase, decrease] = useCounter();
  const version = useDeno(() => Deno.version.deno);

  return (
    <div
      className={clsx("page", css`background: black;`)}
      // @ts-ignore
      css={css`color: white;`}
    >
      <head>
        <title>Hello World - Aleph.js</title>
      </head>
      <h1>
        Welcome to use <strong>Aleph.js</strong>!
      </h1>
      <p>
        <a href="https://alephjs.org" target="_blank">Website</a>
        <span></span>
        <a href="https://alephjs.org/docs/get-started" target="_blank">
          Get Started
        </a>
        <span></span>
        <a href="https://alephjs.org/docs" target="_blank">Docs</a>
        <span></span>
        <a href="https://github.com/alephjs/aleph.js" target="_blank">Github</a>
      </p>
      <div>
        <span>Counter:</span>
        {isSyncing && <em>...</em>}
        {!isSyncing && <strong>{count}</strong>}
        <button onClick={decrease}>-</button>
        <button onClick={increase}>+</button>
      </div>
      <p>Built by Aleph.js in Deno {version}</p>
    </div>
  );
}

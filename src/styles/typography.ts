import { css } from "styled-components";

const Common = css`
  font-family: Roboto, sans-serif;
`;

/** font-size: 10px / line-height: 14px */
export const XS = css`
  ${Common}

  font-size: 10px;
  line-height: 14px;
`;

/** font-size: 12px / line-height: 16px */
export const S = css`
  ${Common}

  font-size: 12px;
  line-height: 16px;
`;

/** font-size: 14px / line-height: 18px */
export const M = css`
  ${Common}

  font-size: 14px;
  line-height: 18px;
`;

/** font-size: 16px / line-height: 20px */
export const L = css`
  ${Common}

  font-size: 16px;
  line-height: 20px;
`;

// Exports

export const Typography = { XS, S, M, L };

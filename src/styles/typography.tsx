import styled, { css } from "./styled-components";

const Typography = css`
  color: ${({ theme }) => theme.colors.black};
  font-family: Roboto, sans-serif;
  margin: 0;
`;

const TypographyBold = css`
  font-weight: bold;
`;

// Normal

/** font-size: 10px / line-height: 14px */
export const TypographyXS = styled.p`
  ${Typography}

  font-size: 10px;
  line-height: 14px;
`;

/** font-size: 12px / line-height: 16px */
export const TypographyS = styled.p`
  ${Typography}

  font-size: 12px;
  line-height: 16px;
`;

/** font-size: 14px / line-height: 18px */
export const TypographyM = styled.p`
  ${Typography}

  font-size: 14px;
  line-height: 18px;
`;

/** font-size: 16px / line-height: 20px */
export const TypographyL = styled.p`
  ${Typography}

  font-size: 16px;
  line-height: 20px;
`;

// Bold

/** font-size: 10px / line-height: 14px / font-weight: bold */
export const TypographyBoldXS = styled(TypographyXS)`
  ${TypographyBold}
`;

/** font-size: 12px / line-height: 16px / font-weight: bold */
export const TypographyBoldS = styled(TypographyS)`
  ${TypographyS}
`;

/** font-size: 14px / line-height: 18px / font-weight: bold*/
export const TypographyBoldM = styled(TypographyM)`
  ${TypographyBold}
`;

/** font-size: 16px / line-height: 20px / font-weight: bold */
export const TypographyBoldL = styled(TypographyL)`
  ${TypographyBold}
`;

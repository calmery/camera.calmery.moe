import styled from "./styled-components";

/** 4px */
export const MarginXS = styled.div`
  margin: ${({ theme }) => theme.spacing.xs};
`;

/** 8px */
export const MarginS = styled.div`
  margin: ${({ theme }) => theme.spacing.s};
`;

/** 16px */
export const MarginM = styled.div`
  margin: ${({ theme }) => theme.spacing.m};
`;

/** 24px */
export const MarginL = styled.div`
  margin: ${({ theme }) => theme.spacing.l};
`;

/** 48px */
export const MarginXL = styled.div`
  margin: ${({ theme }) => theme.spacing.xl};
`;

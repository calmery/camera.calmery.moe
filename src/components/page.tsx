import styled from "styled-components";
import { GradientColors } from "~/styles/colors";
import { Spacing } from "~/styles/spacing";
import { Media } from "~/styles/media";

export const Page = styled.div<{ margin?: boolean }>`
  background: ${GradientColors.page};
  box-sizing: border-box;
  height: inherit;

  ${Media.queries.pc} {
    padding: 0 ${({ margin }) => (margin ? `${Spacing.xl}px` : 0)};
  }

  ${Media.queries.sp} {
    padding: 0 ${({ margin }) => (margin ? `${Spacing.l}px` : 0)};
  }
`;

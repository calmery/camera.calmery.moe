import styled from "styled-components";
import { GradientColors } from "~/styles/colors";
import { Spacing } from "~/styles/spacing";
import { Media } from "~/styles/media";

export const Page = styled.div<{ margin?: boolean }>`
  background: ${GradientColors.page};
  box-sizing: border-box;
  height: inherit;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;

  ${Media.queries.pc} {
    padding: 0 ${({ margin }) => (margin ? `${Spacing.xl}px` : 0)};
  }

  ${Media.queries.sp} {
    padding: 0 ${({ margin }) => (margin ? `${Spacing.l}px` : 0)};
  }
`;

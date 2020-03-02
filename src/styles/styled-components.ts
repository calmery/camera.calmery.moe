import baseStyled, {
  css as baseCss,
  ThemedCssFunction,
  ThemedStyledInterface
} from "styled-components";
import { Theme } from "./theme";

const styled = baseStyled as ThemedStyledInterface<Theme>;
const css = baseCss as ThemedCssFunction<Theme>;

export { css };
export default styled;

import baseStyled, { ThemedStyledInterface } from "styled-components";
import { Theme } from "./theme";

const styled = baseStyled as ThemedStyledInterface<Theme>;

export default styled;

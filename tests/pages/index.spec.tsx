import React from "react";
import renderer from "react-test-renderer";
import { getOrCreateStore } from "~/modules";
import Home from "~/pages";
import { ThemeProvider } from "styled-components";
import { theme } from "~/styles/theme";

it("Home", () => {
  renderer
    .create(
      <ThemeProvider theme={theme}>
        <Home state={getOrCreateStore().getState()} />
      </ThemeProvider>
    )
    .toJSON();
});

import React from "react";
import * as renderer from "react-test-renderer";
import Index from "./index";

it("pages/index.tsx", () => {
  expect(renderer.create(<Index />).toJSON()).toMatchSnapshot();
});

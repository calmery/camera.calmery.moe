import React from "react";
import * as renderer from "react-test-renderer";
import Index from "~/pages/index";

it("pages/index.tsx", () => {
  expect(renderer.create(<Index />).toJSON()).toMatchSnapshot();
});

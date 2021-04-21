import React from "react";
import * as renderer from "react-test-renderer";
import Studio from "./studio";

it("pages/studio.tsx", () => {
  expect(renderer.create(<Studio />).toJSON()).toMatchSnapshot();
});

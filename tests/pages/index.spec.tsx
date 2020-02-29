import React from "react";
import renderer from "react-test-renderer";
import Index from "~/pages/index";

it("Index", () => {
  renderer.create(<Index />).toJSON();
});

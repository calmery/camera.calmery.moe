import React from "react";
import renderer from "react-test-renderer";
import { getOrCreateStore } from "~/modules";
import Home from "~/pages";

it("Home", () => {
  renderer.create(<Home state={getOrCreateStore().getState()} />).toJSON();
});

import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";
import { withRedux } from "~/modules";
import Counter from "./counter";

const CounterWithRedux = withRedux(Counter);

const stories = storiesOf("Counter", module);
stories.addDecorator(withKnobs);

stories.add("Default", () => <CounterWithRedux />);
stories.add("Button", () => (
  <button disabled={boolean("Disabled", false)}>
    {text("Label", "Hello Storybook")}
  </button>
));

import classNames from "classnames";
import { Canvas } from "~/components/Canvas";
import { Navigation } from "~/components/Navigation";
import { Toolbar } from "~/components/Toolbar";

const Index = () => {
  return (
    <div
      className={classNames("flex", "flex-col", "h-full", "justify-between")}
    >
      <Toolbar />
      <Canvas />
      <Navigation />
    </div>
  );
};

export default Index;

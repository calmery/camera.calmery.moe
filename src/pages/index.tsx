import classNames from "classnames";
import Canvas from "~/components/Canvas";

const Index = () => {
  return (
    <div
      className={classNames("flex", "flex-col", "h-full", "justify-between")}
    >
      <menu className="shrink-0" type="toolbar">
        Menu
      </menu>
      <Canvas />
      <nav className="shrink-0">Nav</nav>
    </div>
  );
};

export default Index;

import classNames from "classnames";
import Canvas from "~/components/Canvas";

const Index = () => {
  return (
    <div
      className={classNames("flex", "flex-col", "h-full", "justify-between")}
    >
      <menu
        className={classNames("backdrop-blur", "shrink-0", "z-10")}
        type="toolbar"
      >
        Menu
      </menu>
      <div className={classNames("h-full", "z-0")}>
        <Canvas />
      </div>
      <nav className={classNames("backdrop-blur", "shrink-0", "z-10")}>Nav</nav>
    </div>
  );
};

export default Index;

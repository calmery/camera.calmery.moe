import classNames from "classnames";

const Index = () => {
  return (
    <div
      className={classNames("flex", "flex-col", "h-full", "justify-between")}
    >
      <menu className="shrink-0" type="toolbar">
        Menu
      </menu>
      <section className="h-full">Hello world</section>
      <nav className="shrink-0">Nav</nav>
    </div>
  );
};

export default Index;

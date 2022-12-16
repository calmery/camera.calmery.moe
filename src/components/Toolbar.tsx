import classNames from "classnames";

export const Toolbar = () => {
  return (
    <menu
      className={classNames("backdrop-blur", "shrink-0", "z-10")}
      type="toolbar"
    >
      Menu
    </menu>
  );
};

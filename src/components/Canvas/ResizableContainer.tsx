import classNames from "classnames";
import { type ReactNode, useRef, useEffect } from "react";
import type { Rect } from "~/types/Rect";

export const CanvasResizableContainer = ({
  children,
  onResize,
}: {
  children: ReactNode;
  onResize: (rect: Rect) => void;
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const { height, width, x, y } = container.getBoundingClientRect();

      onResize({
        height,
        width,
        x,
        y,
      });
    });

    observer.observe(container);

    return () => {
      observer.unobserve(container);
      observer.disconnect();
    };
  }, [containerRef, onResize]);

  return (
    <section
      className={classNames("h-full", "w-full", "z-0")}
      ref={containerRef}
    >
      {children}
    </section>
  );
};

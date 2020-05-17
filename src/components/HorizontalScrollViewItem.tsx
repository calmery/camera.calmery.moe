import React from "react";
import { useIntersectionObserver } from "~/utils/use-intersection-observer";

export const HorizontalScrollViewItem: React.FC<{
  rootElement?: Element;
}> = ({ children, rootElement }) => {
  const [ref, opacity] = useIntersectionObserver(rootElement) as [
    React.RefObject<HTMLDivElement>,
    number
  ];

  return (
    <div ref={ref} style={{ opacity, overflowY: "visible" }}>
      {children}
    </div>
  );
};

import { useEffect, useRef, useState } from "react";

export const useIntersectionObserver = (
  root?: Element
): [React.RefObject<Element>, number] => {
  const ref = useRef<Element>(null);
  const [ratio, setRatio] = useState(0);

  if (!root || window.IntersectionObserver === undefined) {
    return [ref, 1];
  }

  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    const observer = new IntersectionObserver(
      (changes) =>
        changes.forEach(({ intersectionRatio }) => setRatio(intersectionRatio)),
      { root, threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, ratio];
};

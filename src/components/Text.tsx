import React, { useEffect, useState } from "react";

interface TextProps {
  children: string;
  onAnimationComplete: () => void;
}

export const Text: React.FC<TextProps> = ({ children }) => {
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }

    setCount(0);
  }, [children]);

  useEffect(() => {
    if (count >= children.length) {
      return;
    }

    setTimer(
      setTimeout(() => {
        setCount(count + 1);
      }, 80)
    );
  }, [count]);

  return <>{children.slice(0, count)}</>;
};

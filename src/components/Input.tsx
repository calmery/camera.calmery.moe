import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import ResizeObserver from "resize-observer-polyfill";
import { Colors } from "~/styles/colors";
import { Spacing } from "~/styles/spacing";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";
import { Typography } from "~/styles/typography";

const Container = styled.div`
  margin-top: ${Spacing.l}px;
  margin-bottom: 8px;
  height: 36px;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Circle = styled.div`
  ${Typography.S};

  width: 36px;
  height: 36px;
  position: absolute;
  top: 0;
  border-radius: 100%;
  color: ${Colors.white};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Svg = styled.svg`
  top: 0;
  left: 0;
  position: absolute;
`;

const View = styled.div`
  ${Typography.S};
  font-weight: bold;
  width: 100%;
  justify-content: space-between;
  height: 16px;
  align-items: center;
  display: flex;
  margin-bottom: ${Spacing.l}px;
`;

const ViewItem = styled.div`
  width: 36px;
  text-align: center;
`;

// Props

interface InputProps {
  id: string;
  min: number;
  max: number;
  defaultValue: number;
  step: number;
  onChange: (v: number) => void;
}

// Render

export const Input: React.FC<InputProps> = ({
  id,
  min,
  max,
  defaultValue,
  step,
  onChange,
}) => {
  const [isChanging, setChanging] = useState(false);

  const [styles, setStyles] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [x, setX] = useState(0);
  const [defaultX, setDefaultX] = useState(0);
  const [value, setValue] = useState(defaultValue);
  const ref = useRef<HTMLDivElement>(null);

  const handleOnResize = useCallback(() => {
    const e = ref.current!;
    const { x, y, width, height } = e.getBoundingClientRect();
    setStyles({ x, y, w: width, h: height });
  }, [ref]);

  useEffect(() => {
    const e = ref.current!;
    const range = Math.abs(max - min);
    const diffMin = defaultValue - min;
    const stepCount = range / step;
    const currentStep = diffMin / step;

    const resizeObserver = new ResizeObserver(handleOnResize);
    resizeObserver.observe(e);

    handleOnResize();

    setX((e.getBoundingClientRect().width / stepCount) * currentStep);
    setDefaultX((e.getBoundingClientRect().width / stepCount) * currentStep);

    return () => {
      resizeObserver.unobserve(e);
    };
  }, [ref]);

  // Events

  const handleOnStart = useCallback(() => setChanging(true), []);
  const handleOnEnd = useCallback(() => setChanging(false), []);

  const move = (event: React.MouseEvent | React.TouchEvent) => {
    const [{ x: pointerX }] = convertEventToCursorPositions(event);
    const range = Math.abs(max - min);
    let x = pointerX - 18 - styles.x;

    if (x < 0) {
      x = 0;
    }

    if (x > styles.w - 36) {
      x = styles.w - 36;
    }

    setX(x);
    // TODO: `x` が `-1` になることがある
    const ratio = Math.abs(Math.round((x / (styles.w - 36)) * (range / step)));
    const v = parseFloat((min + step * ratio).toFixed(1));
    setValue(v);
    onChange(v);
  };

  // ToDo: click にもこの処理いるかも
  const handleOnMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isChanging) {
      return;
    }

    move(event);
  };

  // Render Function

  return (
    <>
      <Container
        ref={ref}
        onMouseDown={handleOnStart}
        onMouseMove={handleOnMove}
        onMouseUp={handleOnEnd}
        onMouseLeave={handleOnEnd}
        onClick={move}
        onTouchStart={handleOnStart}
        onTouchMove={handleOnMove}
        onTouchEnd={handleOnEnd}
      >
        <Svg
          width={styles.w}
          height={styles.h}
          viewBox={`0 0 ${styles.w} ${styles.h}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`gradient-${id}`}>
              <stop stopColor="#FF91BE" />
              <stop offset="1" stopColor="#91C3FF" />
            </linearGradient>
          </defs>
          <rect
            width={styles.w}
            x="0"
            y={(styles.h - 8) / 2}
            height="8"
            rx="4"
            fill={Colors.lightGray}
          />
          <clipPath id={`gradient-clip-${id}`}>
            <rect
              width={defaultX < x ? x - defaultX + 18 : defaultX - x}
              x={defaultX < x ? defaultX : x}
              y={(styles.h - 8) / 2}
              height="8"
              rx="4"
            />
            <circle cx={18 + x} cy="18" r="18"></circle>
          </clipPath>
          <rect
            width={styles.w}
            height={styles.h}
            x="0"
            y="0"
            fill={`url(#gradient-${id})`}
            clipPath={`url(#gradient-clip-${id})`}
          />
        </Svg>
        <Circle
          style={{
            left: `${x}px`,
          }}
        >
          {value}
        </Circle>
      </Container>
      <View>
        <ViewItem>{min}</ViewItem>
        <ViewItem>{max}</ViewItem>
      </View>
    </>
  );
};

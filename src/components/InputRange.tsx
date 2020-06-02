import React, { useCallback, useEffect, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import styled from "styled-components";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";
import { Colors } from "~/styles/colors";
import { Typography } from "~/styles/typography";

// Constants

const CIRCLE_RADIUS = 18;
const BAR_HEIGHT = 8;

// Styles

const Container = styled.div`
  position: relative;
  user-select: none;
  cursor: pointer;

  &:active {
    cursor: ew-resize;
  }
`;

const CurrentValue = styled.div`
  ${Typography.S};

  width: ${CIRCLE_RADIUS * 2}px;
  height: ${CIRCLE_RADIUS * 2}px;
  top: 0;
  position: absolute;
  color: ${Colors.white};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Values = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Value = styled.div`
  ${Typography.S};

  width: ${CIRCLE_RADIUS * 2}px;
  font-weight: bold;
  color: ${Colors.black};
  text-align: center;
`;

// Types

interface InputRangeProps {
  min: number;
  max: number;
  step: number;
  baseValue: number;
  defaultValue: number;
  onChange: (value: number) => void;
}

// Components

export const InputRange: React.FC<InputRangeProps> = ({
  min,
  max,
  step,
  baseValue,
  defaultValue,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // States

  const [containerRect, setContainerRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [stepCount, setStepCount] = useState(0);
  const [stepWidth, setStepWidth] = useState(0);

  const [baseStepCount, setBaseStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const [isMoving, setIsMoving] = useState(false);

  // Validations and updates

  [min, max] = min > max ? [max, min] : [min, max];

  baseValue = baseValue < min ? min : baseValue;
  baseValue = baseValue > max ? max : baseValue;
  defaultValue = defaultValue < min ? min : defaultValue;
  defaultValue = defaultValue > max ? max : defaultValue;

  // Hooks

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const e = containerRef.current!;
    const resizeObserver = new ResizeObserver(() => {
      setContainerRect(e.getBoundingClientRect());
    });

    resizeObserver.observe(e);
    setContainerRect(e.getBoundingClientRect());

    return () => {
      resizeObserver.unobserve(e);
    };
  }, [containerRef]);

  useEffect(() => {
    setBaseStepCount((baseValue - min) / step);
  }, [min, step, baseValue]);

  useEffect(() => {
    setCurrentStepCount((defaultValue - min) / step);
  }, [min, step, defaultValue]);

  useEffect(() => {
    setStepCount(Math.floor((max - min) / step));
  }, [min, max, step]);

  useEffect(() => {
    if (!stepCount) {
      return;
    }

    setStepWidth((containerRect.width - CIRCLE_RADIUS * 2) / stepCount);
  }, [containerRect.width, stepCount]);

  // Functions

  const updateCurrentStepCount = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      const [{ x }] = convertEventToCursorPositions(event);
      const offsetX = containerRect.x + CIRCLE_RADIUS;
      const moveableWidth = containerRect.width - CIRCLE_RADIUS * 2;
      let currentX = x - offsetX;

      // Validations

      if (currentX < 0) {
        currentX = 0;
      }

      if (currentX > moveableWidth) {
        currentX = moveableWidth;
      }

      // Processing

      const nextStepCount = Math.round(currentX / stepWidth);

      if (currentStepCount !== nextStepCount) {
        setCurrentStepCount(nextStepCount);

        onChange(parseFloat((min + nextStepCount * step).toFixed(1)));
      }
    },
    [
      containerRect.x,
      containerRect.width,
      min,
      step,
      stepWidth,
      currentStepCount,
    ]
  );

  // Events

  const handleOnBegin = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      setIsMoving(true);
      updateCurrentStepCount(event);
    },
    [updateCurrentStepCount]
  );

  const handleOnUpdate = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (isMoving) {
        updateCurrentStepCount(event);
      }
    },
    [isMoving, updateCurrentStepCount]
  );

  const handleOnEnd = useCallback(() => {
    setIsMoving(false);
  }, []);

  // Render

  const baseX = baseStepCount * stepWidth;
  const currentX = currentStepCount * stepWidth;
  const suffix = `${min}-${max}-${step}-${baseValue}-${defaultValue}`;

  return (
    <Container
      ref={containerRef}
      onMouseDown={handleOnBegin}
      onTouchStart={handleOnBegin}
      onMouseMove={handleOnUpdate}
      onTouchMove={handleOnUpdate}
      onMouseLeave={handleOnEnd}
      onMouseUp={handleOnEnd}
      onTouchEnd={handleOnEnd}
    >
      <svg
        width={containerRect.width}
        height={CIRCLE_RADIUS * 2}
        viewBox={`0 0 ${containerRect.width} ${CIRCLE_RADIUS * 2}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={`gradient-${suffix}`}
            gradientTransform="rotate(45)"
          >
            <stop stopColor="#FF91BE" />
            <stop offset="1" stopColor="#91C3FF" />
          </linearGradient>
        </defs>
        <clipPath id={`gradient-clip-${suffix}`}>
          <rect
            x={CIRCLE_RADIUS + (baseX < currentX ? baseX : currentX)}
            y={(CIRCLE_RADIUS * 2 - BAR_HEIGHT) / 2}
            width={baseX < currentX ? currentX - baseX : baseX - currentX}
            height={BAR_HEIGHT}
            rx={BAR_HEIGHT / 2}
          />
          <circle
            cx={CIRCLE_RADIUS + currentX}
            cy={CIRCLE_RADIUS + 0}
            r={CIRCLE_RADIUS}
          />
        </clipPath>
        <rect
          x={CIRCLE_RADIUS}
          y={(CIRCLE_RADIUS * 2 - BAR_HEIGHT) / 2}
          width={containerRect.width - CIRCLE_RADIUS * 2}
          height={BAR_HEIGHT}
          rx={BAR_HEIGHT / 2}
          fill={Colors.lightGray}
        />
        <rect
          x="0"
          y="0"
          width={containerRect.width}
          height={CIRCLE_RADIUS * 2}
          fill={`url(#gradient-${suffix})`}
          clipPath={`url(#gradient-clip-${suffix})`}
        />
      </svg>
      <Values>
        <Value>{min}</Value>
        <Value>{max}</Value>
      </Values>
      <CurrentValue
        style={{
          left: `${currentX}px`,
        }}
      >
        {parseFloat((min + currentStepCount * step).toFixed(1))}
      </CurrentValue>
    </Container>
  );
};

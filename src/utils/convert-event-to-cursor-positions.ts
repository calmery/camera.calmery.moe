export type CursorPosition = {
  x: number;
  y: number;
};

export const convertEventToCursorPositions = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
): CursorPosition[] => {
  const positions = [];

  if ((event as any).touches) {
    const { touches } = event as TouchEvent | React.TouchEvent;

    for (let i = 0; i < touches.length; i++) {
      positions.push({
        x: touches[i].clientX,
        y: touches[i].clientY,
      });
    }
  } else {
    positions.push({
      x: (event as MouseEvent | React.MouseEvent).clientX,
      y: (event as MouseEvent | React.MouseEvent).clientY,
    });
  }

  return positions;
};

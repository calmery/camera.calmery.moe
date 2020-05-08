export type CursorPosition = {
  clientX: number;
  clientY: number;
};

export const convertEventToCursorPositions = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
): CursorPosition[] => {
  const positions = [];

  if ((event as any).touches) {
    const { touches } = event as TouchEvent | React.TouchEvent;

    for (let i = 0; i < touches.length; i++) {
      positions.push({
        clientX: touches[i].clientX,
        clientY: touches[i].clientY,
      });
    }
  } else {
    positions.push({
      clientX: (event as MouseEvent | React.MouseEvent).clientX,
      clientY: (event as MouseEvent | React.MouseEvent).clientY,
    });
  }

  return positions;
};

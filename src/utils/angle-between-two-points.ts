export const angleBetweenTwoPoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

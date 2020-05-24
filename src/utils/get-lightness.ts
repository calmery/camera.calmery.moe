export const getLightness = ([red, green, blue]: number[]) => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
};

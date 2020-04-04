const breakPoints = {
  pc: 960,
  sp: 959,
};

const queries = {
  pc: `@media all and (min-width: ${breakPoints.pc}px)`,
  sp: `@media all and (max-width: ${breakPoints.sp}px)`,
};

export const Media = { breakPoints, queries };

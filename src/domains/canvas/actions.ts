export const NO_OP = "NO_OP" as const;

// Actions

export const noOp = () => ({
  type: NO_OP,
});

export type Actions = ReturnType<typeof noOp>;

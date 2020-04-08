export const INCREMENT = "INCREMENT" as const;
export const DECREMENT = "DECREMENT" as const;

export const increment = (count: number) => ({
  type: INCREMENT,
  payload: { count }
});

export const decrement = () => ({
  type: DECREMENT
});

export type Actions =
  | ReturnType<typeof increment>
  | ReturnType<typeof decrement>;

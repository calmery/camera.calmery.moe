export const Colors = {
  black: "#3C3C3C",
  blackTransparent: "rgba(0, 0, 0, .48)",
  blue: "#91C3FF",
  gray: "#B4B4B4",
  lightGray: "#F0F0F0",
  pink: "#FF91BE",
  white: "#FFFFFF",
  border: "#F5F5F5",
};

export const CanvasColors = {
  background: Colors.lightGray,
  border: Colors.gray,
};

export const GradientColors = {
  page: `linear-gradient(135deg, ${Colors.white}, #FAFAFA)`,
  pinkToBlue: `linear-gradient(135deg, ${Colors.pink}, ${Colors.blue})`,
};

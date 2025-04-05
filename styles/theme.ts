export const lightTheme = {
  colors: {
    primary: "#6200ea",
    secondary: "#03dac6",
    error: "#b00020",
    warning: "#fbc02d",
    info: "#2196f3",
    success: "#4caf50",
  },
};

export const darkTheme = {
  colors: {
    primary: "#bb86fc",
    secondary: "#03dac6",
    error: "#cf6679",
    warning: "#ff9800",
    info: "#2196f3",
    success: "#4caf50",
  },
};

export type ThemeType = typeof lightTheme | typeof darkTheme;

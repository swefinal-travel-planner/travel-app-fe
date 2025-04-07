export const colorPalettes = {
  light: {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#0A84FF",
  },
  dark: {
    background: "#000000",
    text: "#FFFFFF",
    primary: "#64D2FF",
  },
  pink: {
    background: "#FFE4E6",
    text: "#9D174D",
    primary: "#F472B6",
  },
  blue: {
    background: "#E6F7FF",
    text: "#0055FF",
    primary: "#3399FF",
  },
};

export type ThemeName = keyof typeof colorPalettes;
export type Theme = typeof colorPalettes.light;

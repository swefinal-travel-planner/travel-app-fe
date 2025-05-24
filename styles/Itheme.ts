export const colorPalettes = {
  light: {
    primary: '#1A434E',
    secondary: '#F3E6FF',
    accent: '#D4ACFB',
    error: '#D73C62',
    disabled: '#ABBBBF',
    background: '#F0FCFF',
    text: '#4C585B',
    black: '#000000',
    white: '#ffffff',
  },
  dark: {
    primary: '#1A434E',
    secondary: '#F3E6FF',
    accent: '#D4ACFB',
    error: '#D73C62',
    disabled: '#ABBBBF',
    background: '#F0FCFF',
    text: '#1D292C',
    black: '#000000',
    white: '#ffffff',
  },
}

export type ThemeName = keyof typeof colorPalettes
export type Theme = typeof colorPalettes.light

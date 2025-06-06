export const colorPalettes = {
  light: {
    primary: '#1A434E',
    secondary: '#F3E6FF',
    accent: '#FFE1B8',
    error: '#D73C62',
    disabled: '#ABBBBF',
    background: '#F0FCFF',
    text: '#4C585B',
    dimText: '#808E91',
    black: '#000000',
    white: '#ffffff',
  },
  dark: {
    primary: '#1A434E',
    secondary: '#F3E6FF',
    accent: '#FFE1B8',
    error: '#D73C62',
    disabled: '#ABBBBF',
    background: '#F0FCFF',
    text: '#1D292C',
    dimText: '#808E91',
    black: '#000000',
    white: '#ffffff',
  },
}

export type ThemeName = keyof typeof colorPalettes
export type Theme = typeof colorPalettes.light

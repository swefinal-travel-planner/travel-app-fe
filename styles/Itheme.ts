export const colorPalettes = {
  light: {
    primary: '#1A434E',
    secondary: '#DCF4F5',
    accent: '#FFE1B8',
    error: '#D73C62',
    disabled: '#ABBBBF',
    background: '#F2F2F2',
    text: '#4C585B',
    dimText: '#808E91',
    black: '#000000',
    white: '#ffffff',
  },
  dark: {
    primary: '#1EE',
    secondary: '#DCF4F5',
    accent: '#FFE1B8',
    error: '#D73C62',
    disabled: '#ABBBBF',
    background: '#F2F2F2',
    text: '#1D292C',
    dimText: '#808E91',
    black: '#000000',
    white: '#ffffff',
  },
}

export type ThemeName = keyof typeof colorPalettes
export type Theme = typeof colorPalettes.light

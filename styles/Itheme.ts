export const colorPalettes = {
  light: {
    normal: '#563d30',
    subtle1: '#a68372',
    subtle2: '#d3b7a8',
    background: '#e5dacb',
    surface: '#fcf4e8',
    primary: '#3f6453',
    primarySubtle: '#eef8ef',
    black: '#000000',
    white: '#ffffff',
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#64D2FF',
  },
  pink: {
    background: '#FFE4E6',
    text: '#9D174D',
    primary: '#F472B6',
  },
  blue: {
    background: '#E6F7FF',
    text: '#0055FF',
    primary: '#3399FF',
  },
}

export type ThemeName = keyof typeof colorPalettes
export type Theme = typeof colorPalettes.light

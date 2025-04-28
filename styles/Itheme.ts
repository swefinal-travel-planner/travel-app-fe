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
    normal: '#000',
    subtle1: '#a68372',
    subtle2: '#d3b7a8',
    background: '#e5dacb',
    surface: '#fcf4e8',
    primary: '#3f6453',
    primarySubtle: '#eef8ef',
    black: '#000000',
    white: '#ffffff',
  },
  pink: {
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
  blue: {
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
}

export type ThemeName = keyof typeof colorPalettes
export type Theme = typeof colorPalettes.light

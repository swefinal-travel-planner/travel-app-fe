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
    normal: '#e0e0e0', // Light text for dark mode
    subtle1: '#b0b0b0', // Lighter for contrast
    subtle2: '#808080', // Adjusted for dark mode
    background: '#121212', // Dark background
    surface: '#1e1e1e', // Dark surface
    primary: '#4f8968', // Brighter primary for visibility
    primarySubtle: '#1a2e25', // Darker subtle primary
    black: '#000000',
    white: '#ffffff',
  },
  pink: {
    normal: '#563d30',
    subtle1: '#a68372',
    subtle2: '#d3b7a8',
    background: '#fce4ec', // Pink background
    surface: '#fff5f8',
    primary: '#c2185b', // Pink primary
    primarySubtle: '#f8bbd0',
    black: '#000000',
    white: '#ffffff',
  },
  blue: {
    normal: '#563d30',
    subtle1: '#a68372',
    subtle2: '#d3b7a8',
    background: '#e3f2fd', // Blue background
    surface: '#f5fbff',
    primary: '#1976d2', // Blue primary
    primarySubtle: '#bbdefb',
    black: '#000000',
    white: '#ffffff',
  },
}

export type ThemeName = keyof typeof colorPalettes
export type Theme = typeof colorPalettes.light

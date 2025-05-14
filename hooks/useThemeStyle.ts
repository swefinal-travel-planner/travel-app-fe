import { useThemeStore } from '@/store/themeStore'
import { colorPalettes } from '@/styles/Itheme'
import { useMemo } from 'react'
import { useColorScheme } from 'react-native'

export const useThemeStyle = () => {
  const themeName = useThemeStore((s) => s.themeName)
  const isSystemTheme = useThemeStore((s) => s.isSystemTheme)
  const deviceColorScheme = useColorScheme()

  return useMemo(() => {
    // Use system theme if enabled
    if (isSystemTheme && deviceColorScheme) {
      return colorPalettes[deviceColorScheme === 'dark' ? 'dark' : 'light']
    }
    return colorPalettes[themeName]
  }, [themeName, isSystemTheme, deviceColorScheme])
}

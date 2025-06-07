import { useThemeStore } from '@/store/themeStore'
import { colorPalettes } from '@/styles/Itheme'
import { useMemo } from 'react'

export const useThemeStyle = () => {
  const themeName = useThemeStore((s) => s.themeName)

  return useMemo(() => {
    return colorPalettes[themeName]
  }, [themeName])
}

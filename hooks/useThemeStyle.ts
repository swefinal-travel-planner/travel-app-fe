import { colorPalettes } from '@/constants/Itheme'
import { useThemeStore } from '@/store/themeStore'
import { useMemo } from 'react'

export const useThemeStyle = () => {
  const themeName = useThemeStore((s) => s.themeName)

  return useMemo(() => {
    return colorPalettes[themeName]
  }, [themeName])
}

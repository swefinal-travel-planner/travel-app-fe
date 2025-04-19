import { useThemeStore } from '@/store/themeStore'
import { colorPalettes } from '@/styles/Itheme'

export const useThemeStyle = () => {
  const themeName = useThemeStore((s) => s.themeName)
  return colorPalettes[themeName]
}

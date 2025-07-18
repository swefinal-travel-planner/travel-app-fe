import { colorPalettes, Theme, ThemeName } from '@/constants/Itheme'
import i18n from '@/i18n'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Language = 'en' | 'vi'

interface ThemeState {
  // Current theme name
  themeName: ThemeName
  language: Language
  isSystemTheme: boolean
  setTheme: (themeName: ThemeName) => void
  setLanguage: (language: Language) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeName: 'light',
      theme: colorPalettes.light,
      language: 'en',
      isSystemTheme: true, // Default to system theme

      setTheme: (name: ThemeName) => {
        set(() => ({
          themeName: name,
          theme: colorPalettes[name],
          useSystemTheme: false, // Disable system theme when manually set
        }))
      },

      setLanguage: (lang) => {
        i18n.changeLanguage(lang)
        set({ language: lang })
      },

      setIsSystemTheme: (bool: boolean) => {
        set({ isSystemTheme: bool })
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

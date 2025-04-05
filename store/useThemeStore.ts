import { colorPalettes, Theme, ThemeName } from "@/styles/Itheme";
import { create } from "zustand";

type Language = "en" | "vn";

interface ThemeState {
  themeName: ThemeName;
  theme: Theme;
  language: Language;
  setTheme: (themeName: ThemeName) => void;
  setLanguage: (language: Language) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeName: "light",
  theme: colorPalettes.light,
  language: "en",
  setTheme: (name: ThemeName) => {
    set(() => ({
      themeName: name,
      theme: colorPalettes[name],
    }));
  },
  setLanguage: (lang: Language) => set(() => ({ language: lang })),
}));

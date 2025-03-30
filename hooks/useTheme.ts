import { useThemeStore } from "../store/useThemeStore";

export const useTheme = () => {
  const { colors, typography, layout, toggleTheme, themeMode } =
    useThemeStore();
  return { colors, typography, layout, toggleTheme, themeMode };
};

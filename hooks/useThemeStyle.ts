import { useThemeStore } from "@/store/useThemeStore";
import { colorPalettes } from "@/styles/Itheme";

export const useThemeStyle = () => {
  const themeName = useThemeStore((s) => s.themeName);
  return colorPalettes[themeName];
};

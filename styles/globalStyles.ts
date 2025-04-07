import { StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

export const useGlobalStyles = () => {
  const { colors, typography, layout } = useTheme();

  return StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      padding: layout.spacing.small,
    },
    container: {
      flex: 1,
      padding: layout.spacing.medium,
      borderRadius: layout.borderRadius.small,
    },
    text: {
      color: colors.text,
      fontSize: typography.fontSize.medium,
      fontFamily: typography.fontFamily,
    },
    title: {
      color: colors.text,
      fontSize: typography.fontSize.large,
    },
    button: {
      backgroundColor: colors.primary,
      padding: layout.spacing.medium,
      borderRadius: layout.borderRadius.small,
      alignItems: "center",
      justifyContent: "center",
      ...layout.shadow, // Apply shadow globally
    },

    buttonText: {
      color: "#FFFFFF",
    },
    card: {
      backgroundColor: colors.background,
      padding: layout.spacing.medium,
      borderRadius: layout.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.border,
      ...layout.shadow,
    },
  });
};

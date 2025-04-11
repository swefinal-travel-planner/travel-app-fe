import { StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

export const useGlobalStyles = () => {
  const { colors, typography, layout } = useTheme();

  return StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      padding: 10,
    },
    container: {
      flex: 1,
      padding: 20,
      borderRadius: 10,
    },
    text: {
      color: "red",
      fontSize: 10,
    },
    title: {
      color: "red",
    },
    button: {
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },

    buttonText: {
      color: "#FFFFFF",
    },
    card: {
      padding: 20,
      borderRadius: 10,
      borderWidth: 1,
    },
  });
};

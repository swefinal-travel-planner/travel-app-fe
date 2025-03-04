import React from "react";
import { Text, StyleSheet } from "react-native";

import PressableOpacity from "./PressableOpacity";

interface ButtonProps {
  title: string;
  backgroundColor?: string;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
}

// custom button component
const CButton: React.FC<ButtonProps> = ({
  title,
  color,
  backgroundColor,
  onPress,
  disabled,
  style,
}) => {
  return (
    <PressableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.wrapper,
        { backgroundColor: backgroundColor ?? "#A8A8A8" },
        style,
      ]}
    >
      <Text style={[styles.title, { color: color ?? "#FFFFFF" }]}>{title}</Text>
    </PressableOpacity>
  );
};

export default CButton;

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 12,
    fontFamily: "NotoSerif_700Bold",
  },
});

import React from "react";
import { Text, StyleSheet } from "react-native";

import PressableOpacity from "./PressableOpacity";

interface PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "disabled" | "otpDisabled";
  onPress?: () => void;
  disabled?: boolean;
  style?: object;
}

// custom button component
const Pressable: React.FC<PressableProps> = ({
  title,
  variant,
  onPress,
  disabled,
  style,
}) => {
  return (
    <PressableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.wrapper, styles[`${variant || "primary"}Bg`], style]}
    >
      <Text style={[styles.title, styles[`${variant || "primary"}Title`]]}>
        {title}
      </Text>
    </PressableOpacity>
  );
};

export default Pressable;

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  primaryBg: {
    backgroundColor: "#3F6453",
  },
  secondaryBg: {},
  disabledBg: { backgroundColor: "#E5E5E5" },
  title: {
    fontSize: 14,
    fontFamily: "NotoSerif_400Regular",
  },
  otpDisabledBg: {},
  primaryTitle: {
    color: "#FFFFFF",
  },
  secondaryTitle: {
    color: "#3F6453",
  },
  disabledTitle: {
    color: "#4B4B4B",
  },
  otpDisabledTitle: {
    color: "#4B4B4B",
  },
});

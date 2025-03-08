import React, { useState } from "react";
import { TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import styles from "./styles";
import PressableOpacity from "../PressableOpacity";

interface PasswordFieldProps {
  placeholder: string;
  label?: string;
  leftIcon?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (text: string) => void;
  onBlur?: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  placeholder,
  label,
  leftIcon,
  error,
  required,
  onChange,
  value,
  onBlur,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      {leftIcon && (
        <Ionicons name={leftIcon as any} style={styles.leftIcon} size={24} />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder ? placeholder : ""}
        placeholderTextColor="#3F6453"
        underlineColorAndroid="transparent"
        textContentType="password"
        onChangeText={(value) => {
          if (onChange) onChange(value);
        }}
        onBlur={() => {
          if (onBlur) onBlur();
        }}
        secureTextEntry={!isVisible}
      />

      <PressableOpacity onPress={() => setIsVisible(!isVisible)}>
        <Ionicons
          name={isVisible ? "eye-off-outline" : "eye-outline"}
          style={styles.rightIcon}
          size={24}
        />
      </PressableOpacity>
    </View>
  );
};

export default PasswordField;

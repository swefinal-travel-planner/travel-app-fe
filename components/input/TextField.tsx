import React, { useState } from "react";
import { TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import styles from "./styles";

interface TextFieldProps {
  placeholder: string;
  label?: string;
  rightIcon?: string;
  leftIcon?: string;
  error?: string;
  required?: boolean;
  type?: string;
  value?: string;
  onChange?: (text: string) => void;
  onBlur?: () => void;
}

// custom text field component
const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  label,
  rightIcon,
  leftIcon,
  error,
  required,
  type,
  onChange,
  onBlur,
  value,
}) => {
  return (
    <View style={styles.wrapper}>
      {leftIcon && (
        <Ionicons name={leftIcon as any} style={styles.leftIcon} size={24} />
      )}
      <TextInput
        numberOfLines={1}
        style={styles.input}
        placeholder={placeholder ? placeholder : ""}
        placeholderTextColor="#3F6453"
        onChangeText={(value) => {
          if (onChange) onChange(value);
        }}
        onBlur={() => {
          if (onBlur) onBlur();
        }}
        underlineColorAndroid="transparent"
        autoComplete={type ? (type as any) : "none"}
      />
      {rightIcon && (
        <Ionicons name={rightIcon as any} style={styles.rightIcon} size={24} />
      )}
    </View>
  );
};

export default TextField;

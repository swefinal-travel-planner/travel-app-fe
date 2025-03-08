import React, { useState } from "react";
import { TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import styles from "./styles";

interface TextInputProps {
  placeholder: string;
  label?: string;
  rightIcon?: string;
  leftIcon?: string;
  error?: string;
  required?: boolean;
  type?: string;
}

// custom text input component
const CTextInput: React.FC<TextInputProps> = ({
  placeholder,
  label,
  rightIcon,
  leftIcon,
  error,
  required,
  type,
}) => {
  const [text, onChangeText] = useState("");

  return (
    <View style={styles.wrapper}>
      {leftIcon && (
        <Ionicons name={leftIcon as any} style={styles.icon} size={24} />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder ? placeholder : ""}
        placeholderTextColor="#3F6453"
        onChangeText={onChangeText}
        underlineColorAndroid="transparent"
        autoComplete={type ? (type as any) : "none"}
      />
      {rightIcon && (
        <Ionicons name={rightIcon as any} style={styles.icon} size={24} />
      )}
    </View>
  );
};

export default CTextInput;

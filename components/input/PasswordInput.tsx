import React, { useState } from "react";
import { TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import styles from "./styles";
import PressableOpacity from "../PressableOpacity";

interface PasswordInputProps {
  placeholder: string;
  label?: string;
  leftIcon?: string;
  error?: string;
  required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  label,
  leftIcon,
  error,
  required,
}) => {
  const [text, onChangeText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

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
        textContentType="password"
        secureTextEntry={!isVisible}
      />

      <PressableOpacity onPress={() => setIsVisible(!isVisible)}>
        <Ionicons
          name={isVisible ? "eye-off-outline" : "eye-outline"}
          style={styles.icon}
          size={24}
        />
      </PressableOpacity>
    </View>
  );
};

export default PasswordInput;

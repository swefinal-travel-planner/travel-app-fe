import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { TextInput, View, Text } from 'react-native'

import styles from './styles'

interface TextFieldProps {
  placeholder: string
  label?: string
  rightIcon?: string
  leftIcon?: string
  error?: string
  required?: boolean
  type?: string
  value?: string
  onChange?: (text: string) => void
  onBlur?: () => void
}

const CustomTextField: React.FC<TextFieldProps> = ({
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
        placeholder={placeholder || ''}
        placeholderTextColor="#3F6453"
        onChangeText={(value) => {
          if (onChange) onChange(value)
        }}
        onBlur={() => {
          if (onBlur) onBlur()
        }}
        underlineColorAndroid="transparent"
        autoComplete={type ? (type as any) : 'none'}
      />
      {rightIcon && (
        <Ionicons name={rightIcon as any} style={styles.rightIcon} size={24} />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

export default CustomTextField
